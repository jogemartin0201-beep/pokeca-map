import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import {
    Navigation, Store, CheckCircle, XCircle,
    Star, X, MapPin, ExternalLink, Car, Footprints, MessageCircle
} from 'lucide-react';

// Nagoya City center coordinates (Shifted to Higashi Ward / Nagoya Dome area for testing)
const defaultCenter = [35.1868, 136.9472];
const defaultZoom = 14;

// Fix Leaflet's default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to fly to user location
function LocationMarker({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 15, { duration: 1.5 });
        }
    }, [position, map]);

    if (!position) return null;

    const userIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width:100%;height:100%;background:#3742fa;border:3px solid white;border-radius:50%;box-shadow:0 0 0 3px rgba(55,66,250,0.3), 0 2px 8px rgba(0,0,0,0.2);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
    });

    return <Marker position={position} icon={userIcon} />;
}

// Helper: Get derived status based on history
const getDerivedStatus = (store) => {
    if (store.status === 'no-handling') return 'no-handling';
    if (!store.history || store.history.length === 0) return 'unknown';

    const latest = store.history[0];
    if (latest.status === 'in-stock') return 'in-stock';

    // If out-of-stock, check timestamp
    if (latest.status === 'out-of-stock') {
        if (!latest.timestamp) return 'out-of-stock'; // fallback
        const ageMs = new Date() - new Date(latest.timestamp);
        const ageDays = ageMs / (1000 * 60 * 60 * 24);
        if (ageDays >= 7) return 'restock-undecided';
        return 'out-of-stock';
    }

    return 'unknown';
};

// 3-color system + gray: green (in-stock), red (out-of-stock recent), gray (unknown/undecided/no-handling)
const getStatusColor = (derivedStatus) => {
    switch (derivedStatus) {
        case 'in-stock': return '#2ed573'; // Green
        case 'out-of-stock': return '#ff4757'; // Red/Warning
        case 'restock-undecided':
        case 'unknown':
        case 'no-handling':
        default: return '#a4b0be'; // Gray
    }
};

const createCustomIcon = (derivedStatus) => {
    const color = getStatusColor(derivedStatus);
    const isInStock = derivedStatus === 'in-stock';
    const shadowExtra = isInStock ? ', 0 0 0 4px rgba(46, 213, 115, 0.2)' : '';

    return L.divIcon({
        className: `custom-marker${isInStock ? ' marker-pulse' : ''}`,
        html: `<div style="
            width: 100%; height: 100%;
            background-color: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08)${shadowExtra};
        "></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
};

// Format timestamp to relative time string
const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '不明';
    const ageMs = new Date() - new Date(timestamp);
    const ageMins = Math.floor(ageMs / (1000 * 60));
    if (ageMins < 60) return `${Math.max(1, ageMins)}分前`;
    const ageHrs = Math.floor(ageMins / 60);
    if (ageHrs < 24) return `${ageHrs}時間前`;
    const ageDays = Math.floor(ageHrs / 24);
    if (ageDays === 1) return '昨日';
    return `${ageDays}日前`;
};

const StatusBadge = ({ derivedStatus, historyTimeStr }) => {
    const color = getStatusColor(derivedStatus);
    let icon = <XCircle size={16} />;
    let text = '不明';

    if (derivedStatus === 'in-stock') {
        icon = <CheckCircle size={16} />;
        text = '在庫あり';
    } else if (derivedStatus === 'out-of-stock') {
        icon = <XCircle size={16} />;
        text = '在庫なし';
    } else if (derivedStatus === 'restock-undecided') {
        icon = <XCircle size={16} />;
        text = '入荷未定';
    } else if (derivedStatus === 'no-handling') {
        icon = <XCircle size={16} />;
        text = '取扱なし';
    }

    return (
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: color, fontWeight: 'bold'
        }}>
            {icon}
            <span>
                {text}
                {historyTimeStr && derivedStatus !== 'no-handling' && (
                    <span style={{ fontSize: '0.8em', marginLeft: '4px', fontWeight: 'normal' }}>
                        ({historyTimeStr})
                    </span>
                )}
            </span>
        </div>
    );
};

const HistoryList = ({ history }) => {
    if (!history || history.length === 0) {
        return <div style={{ padding: '12px 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>履歴はありません</div>;
    }
    return (
        <div className="history-list">
            <p className="history-title">直近の更新（最大5件）</p>
            <div className="history-items">
                {history.slice(0, 5).map((item, idx) => {
                    // For history items, we just show their raw status point-in-time, but format the time
                    const histStatus = item.status === 'in-stock' ? 'in-stock' : (item.status === 'no-handling' ? 'no-handling' : 'out-of-stock');
                    const timeStr = item.timestamp ? formatTimeAgo(item.timestamp) : (item.time || '不明');
                    return (
                        <div key={idx} className="history-item">
                            <div className="history-item-header">
                                <StatusBadge derivedStatus={histStatus} />
                                <span style={{ color: 'var(--color-text-muted)', flexShrink: 0, fontSize: '0.85rem' }}>{timeStr}</span>
                            </div>
                            {item.memo && <div className="history-item-memo">・{item.memo}</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Calculate distance between two points (Haversine formula)
const calcDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Component to draw route polyline on map
function RoutePolyline({ routeCoords }) {
    if (!routeCoords || routeCoords.length === 0) return null;
    return (
        <Polyline
            positions={routeCoords}
            pathOptions={{
                color: '#ff4757',
                weight: 5,
                opacity: 0.8,
                dashArray: '10, 6'
            }}
        />
    );
}

// Share format builder
const buildShareText = (store, derivedStatus) => {
    let statusText = '❓ 不明';
    if (derivedStatus === 'in-stock') statusText = '✅ 在庫あり';
    else if (derivedStatus === 'out-of-stock') statusText = '❌ 在庫なし';
    else if (derivedStatus === 'restock-undecided') statusText = '💤 入荷未定';
    else if (derivedStatus === 'no-handling') statusText = '🚫 取扱なし';

    const lines = [
        '【ポケカ在庫速報】',
        `🏪 ${store.name}`,
        `📦 ${statusText}`,
        '',
        '#ポケカ #ポケ探'
    ];
    return lines.join('\n');
};

export default function PokeMap({
    stores, setStores, favorites, toggleFavorite, showFavoritesOnly,
    gachiMode, gachiRoute, routeCoords, userPos, locateUser
}) {
    const [selectedStore, setSelectedStore] = useState(null);
    const [memoInput, setMemoInput] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(null);

    const handleShareX = (store) => {
        const text = encodeURIComponent(buildShareText(store, getDerivedStatus(store)));
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    };

    const handleShareLINE = (store) => {
        const text = encodeURIComponent(buildShareText(store, getDerivedStatus(store)));
        window.open(`https://social-plugins.line.me/lineit/share?text=${text}`, '_blank');
    };

    const handleNavigate = (store) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}&travelmode=walking`;
        window.open(url, '_blank');
    };

    const handleStatusSubmit = () => {
        if (!selectedStore || !selectedStatus) return alert('ステータスを選択してください');

        const memo = memoInput || '';
        const newHistoryItem = {
            status: selectedStatus,
            time: 'たった今',
            timestamp: new Date().toISOString(),
            memo
        };

        setStores(stores.map(store =>
            store.id === selectedStore.id
                ? {
                    ...store,
                    status: selectedStatus,
                    history: [newHistoryItem, ...(store.history || [])]
                }
                : store
        ));

        setSelectedStore({
            ...selectedStore,
            status: selectedStatus,
            history: [newHistoryItem, ...(selectedStore.history || [])]
        });

        setMemoInput('');
        setSelectedStatus(null);
    };

    const closePanel = () => {
        setSelectedStore(null);
        setMemoInput('');
        setSelectedStatus(null);
    };

    const filteredStores = showFavoritesOnly
        ? stores.filter(store => favorites.includes(store.id))
        : stores;

    // Calculate distances for selected store
    const storeDistance = useMemo(() => {
        if (!selectedStore || !userPos) return null;
        const dist = calcDistance(userPos[0], userPos[1], selectedStore.lat, selectedStore.lng);
        const distText = dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`;
        // Walking: ~4.5 km/h with 1.3x road factor
        const walkMin = Math.max(1, Math.round((dist / 4.5) * 60 * 1.3));
        // Driving: ~25 km/h city average with 1.3x road factor
        const driveMin = Math.max(1, Math.round((dist / 25) * 60 * 1.3));
        return { distText, walkMin, driveMin };
    }, [selectedStore, userPos]);

    return (
        <>
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {filteredStores.map((store) => {
                    const derivedStatus = getDerivedStatus(store);
                    return (
                        <Marker
                            key={store.id}
                            position={[store.lat, store.lng]}
                            icon={createCustomIcon(derivedStatus)}
                            eventHandlers={{
                                click: () => {
                                    setSelectedStore(store);
                                    setMemoInput('');
                                    setSelectedStatus(null);
                                }
                            }}
                        />
                    );
                })}

                <LocationMarker position={userPos} />
                <RoutePolyline routeCoords={routeCoords} />
            </MapContainer>

            {/* Fab Location Button */}
            <button className="fab-location" onClick={locateUser} title="現在地へ移動">
                <Navigation size={24} />
            </button>

            {/* Side Panel (Desktop) / Bottom Sheet (Mobile) */}
            <div className={`side-panel-overlay ${selectedStore ? 'open' : ''}`} onClick={closePanel}></div>
            <div className={`side-panel ${selectedStore ? 'open' : ''}`}>
                {selectedStore && (() => {
                    const isFavorite = favorites.includes(selectedStore.id);
                    const reportCount = (selectedStore.history || []).length;
                    return (
                        <>
                            <div className="side-panel-header">
                                <div className="side-panel-header-top">
                                    <div className="side-panel-store-info">
                                        <Store size={20} style={{ flexShrink: 0, marginTop: '3px', color: 'var(--color-primary)' }} />
                                        <div>
                                            <h3 className="side-panel-store-name" style={{ fontSize: '1.05rem', marginBottom: '2px' }}>{selectedStore.name}</h3>
                                            <div style={{ marginTop: '2px' }}>
                                                <StatusBadge
                                                    derivedStatus={getDerivedStatus(selectedStore)}
                                                    historyTimeStr={selectedStore.history && selectedStore.history.length > 0 ? (selectedStore.history[0].timestamp ? formatTimeAgo(selectedStore.history[0].timestamp) : selectedStore.history[0].time) : null}
                                                />
                                            </div>
                                            {userPos && storeDistance ? (
                                                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div className="side-panel-distance">
                                                        <MapPin size={14} />
                                                        <span>{storeDistance.distText}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                            <Footprints size={13} /> 徒歩 約{storeDistance.walkMin}分
                                                        </span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                            <Car size={13} /> 車 約{storeDistance.driveMin}分
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ marginTop: '2px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                                    📍 右下ボタンで現在地を取得すると距離が表示されます
                                                </div>
                                            )}
                                            <div style={{ marginTop: '2px' }}>
                                                <span className="report-badge" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>📝 報告: {reportCount}件</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="side-panel-close" onClick={closePanel}>
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Action Buttons (Compacted) */}
                                {/* Share and Route actions */}
                                <div className="side-panel-actions" style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'nowrap' }}>
                                    <button className="btn btn-primary" onClick={() => handleNavigate(selectedStore)} style={{ flex: 1, padding: '8px 12px', fontSize: '0.9rem' }}>
                                        <Navigation size={16} /> 店舗へ
                                    </button>
                                    <button
                                        className="btn side-panel-action-btn"
                                        onClick={() => toggleFavorite(selectedStore.id)}
                                        style={{ padding: '8px', minWidth: '40px', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-main)', display: 'flex', justifyContent: 'center' }}
                                    >
                                        <Star size={18} fill={favorites.includes(selectedStore.id) ? '#ffd32a' : 'transparent'} color={favorites.includes(selectedStore.id) ? '#ffd32a' : 'currentColor'} />
                                    </button>
                                    <button
                                        className="btn side-panel-action-btn"
                                        onClick={() => handleShareX(selectedStore)}
                                        style={{ padding: '8px', minWidth: '40px', backgroundColor: 'black', color: 'white', display: 'flex', justifyContent: 'center' }}
                                    >
                                        <X size={18} />
                                    </button>
                                    <button
                                        className="btn side-panel-action-btn"
                                        onClick={() => handleShareLINE(selectedStore)}
                                        style={{ padding: '8px', minWidth: '40px', backgroundColor: '#06C755', color: 'white', display: 'flex', justifyContent: 'center' }}
                                    >
                                        <MessageCircle size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="side-panel-content" style={{ padding: '0 16px 16px' }}>
                                <HistoryList history={selectedStore.history} />

                                <div className="status-update-form" style={{ marginTop: '8px', padding: '8px 12px' }}>
                                    <p className="status-update-title" style={{ margin: '0 0 4px 0', fontSize: '0.85rem' }}>在庫更新</p>

                                    <div className="radio-group" style={{ marginBottom: '4px', flexWrap: 'wrap' }}>
                                        <label className={`radio-label ${selectedStatus === 'in-stock' ? 'selected-in-stock' : ''}`} style={{ padding: '6px', flex: '1 1 45%' }}>
                                            <input type="radio" value="in-stock" checked={selectedStatus === 'in-stock'} onChange={() => setSelectedStatus('in-stock')} />
                                            ✅ 在庫あり
                                        </label>
                                        <label className={`radio-label ${selectedStatus === 'out-of-stock' ? 'selected-unavailable' : ''}`} style={{ padding: '6px', flex: '1 1 45%' }}>
                                            <input type="radio" value="out-of-stock" checked={selectedStatus === 'out-of-stock'} onChange={() => setSelectedStatus('out-of-stock')} />
                                            ❌ 在庫なし
                                        </label>
                                        <label className={`radio-label ${selectedStatus === 'no-handling' ? 'selected-unavailable' : ''}`} style={{ padding: '4px', flex: '1 1 100%', fontSize: '0.8rem', justifyContent: 'center', backgroundColor: 'transparent', border: 'none', color: 'var(--color-text-muted)' }}>
                                            <input type="radio" value="no-handling" checked={selectedStatus === 'no-handling'} onChange={() => setSelectedStatus('no-handling')} style={{ display: 'none' }} />
                                            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>🚫 この店舗はポケカを取り扱っていない</span>
                                        </label>
                                    </div>

                                    <textarea
                                        placeholder="備考（例：3パック限）"
                                        value={memoInput}
                                        onChange={(e) => setMemoInput(e.target.value)}
                                        style={{
                                            width: '100%', padding: '6px', borderRadius: '6px',
                                            border: '1px solid #dfe4ea', marginBottom: '6px',
                                            fontSize: '0.85rem', resize: 'none',
                                            fontFamily: 'var(--font-family-sans)'
                                        }}
                                        rows={1}
                                    />

                                    <button
                                        className="btn btn-primary"
                                        style={{ width: '100%', padding: '8px', fontSize: '0.9rem' }}
                                        onClick={handleStatusSubmit}
                                        disabled={!selectedStatus}
                                    >
                                        投稿する
                                    </button>
                                </div>
                            </div>
                        </>
                    );
                })()}
            </div>
        </>
    );
}
