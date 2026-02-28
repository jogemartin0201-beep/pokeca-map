import React, { useState, useMemo } from 'react';
import { Zap, Footprints, Car, Clock, X, MapPin, ExternalLink, Settings, Star } from 'lucide-react';

// OSRM routing API
const OSRM_BASE = 'https://router.project-osrm.org';

// Calculate distance between two points (Haversine)
const calcDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Calculate shopping + parking time based on store category
// Calculate shopping + parking time based on store category and travel mode
const getShoppingTime = (category, mode) => {
    if (mode === 'foot') {
        switch (category) {
            case 'conveni': return 1;
            case 'yodobashi':
            case 'geo': return 3;
            case 'aeon': return 5;
            case 'pokemon-center': return 5;
            default: return 3;
        }
    } else {
        // car
        switch (category) {
            case 'conveni': return 1;
            case 'yodobashi':
            case 'geo': return 3;
            case 'aeon': return 8;
            case 'pokemon-center': return 8;
            default: return 5;
        }
    }
};

// Solve simple TSP (nearest neighbor heuristic)
const solveTSP = (origin, stores) => {
    const remaining = [...stores];
    const route = [];
    let current = origin;

    while (remaining.length > 0) {
        let closest = 0;
        let minDist = Infinity;
        for (let i = 0; i < remaining.length; i++) {
            const d = calcDistance(current[0], current[1], remaining[i].lat, remaining[i].lng);
            if (d < minDist) {
                minDist = d;
                closest = i;
            }
        }
        route.push(remaining[closest]);
        current = [remaining[closest].lat, remaining[closest].lng];
        remaining.splice(closest, 1);
    }
    return route;
};

export default function GachiMode({
    isOpen, onClose, stores, userPos, onRouteCalculated,
    showFavoritesOnly, setShowFavoritesOnly
}) {
    const [travelMode, setTravelMode] = useState('foot'); // 'car' | 'foot'
    const [timeLimit, setTimeLimit] = useState(60); // minutes
    const [isCalculating, setIsCalculating] = useState(false);
    const [routeResult, setRouteResult] = useState(null);
    const [error, setError] = useState(null);
    const [statusFilters, setStatusFilters] = useState({
        inStock: true,
        unknown: false,
        restockUndecided: false
    });

    // Filter stores based on toggle (derived status)
    const targetStores = useMemo(() => {
        return stores.filter(s => {
            // Logic replication from PokeMap.jsx getDerivedStatus mapping
            let dStat = 'unknown';
            if (s.status === 'no-handling') dStat = 'no-handling';
            else if (!s.history || s.history.length === 0) dStat = 'unknown';
            else if (s.history[0].status === 'in-stock') dStat = 'in-stock';
            else if (s.history[0].status === 'out-of-stock') {
                if (!s.history[0].timestamp) dStat = 'out-of-stock';
                else {
                    const ageMs = new Date() - new Date(s.history[0].timestamp);
                    if (ageMs / (1000 * 60 * 60 * 24) >= 7) dStat = 'restock-undecided';
                    else dStat = 'out-of-stock';
                }
            }

            if (dStat === 'in-stock' && statusFilters.inStock) return true;
            if (dStat === 'unknown' && statusFilters.unknown) return true;
            if (dStat === 'restock-undecided' && statusFilters.restockUndecided) return true;

            return false;
        });
    }, [stores, statusFilters]);

    const calculateRoute = async () => {
        if (!userPos) {
            setError('現在地を取得してください（右下の📍ボタン）');
            return;
        }

        if (targetStores.length === 0) {
            setError(showInStockOnly ? '在庫ありの店舗がありません' : '対象の店舗がありません');
            return;
        }

        setIsCalculating(true);
        setError(null);
        setRouteResult(null);

        try {
            // Speed in km/h
            const speed = travelMode === 'car' ? 30 : 5; // city driving / walking
            const maxDistKm = speed * (timeLimit / 60);

            // Filter stores within reasonable range
            const reachableStores = targetStores.filter(s => {
                const dist = calcDistance(userPos[0], userPos[1], s.lat, s.lng);
                return dist <= maxDistKm;
            });

            if (reachableStores.length === 0) {
                setError(`${timeLimit}分以内に到達可能な店舗がありません`);
                setIsCalculating(false);
                return;
            }

            // Solve TSP
            const ordered = solveTSP(userPos, reachableStores);

            // Build OSRM request (origin + stores)
            const profile = travelMode === 'car' ? 'driving' : 'foot';
            const coords = [
                `${userPos[1]},${userPos[0]}`,
                ...ordered.map(s => `${s.lng},${s.lat}`)
            ].join(';');

            const osrmUrl = `${OSRM_BASE}/route/v1/${profile}/${coords}?overview=full&geometries=geojson&steps=true`;
            const response = await fetch(osrmUrl);
            const data = await response.json();

            if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                setError('ルートの計算に失敗しました。もう一度お試しください。');
                setIsCalculating(false);
                return;
            }

            const route = data.routes[0];
            const totalDistance = (route.distance / 1000).toFixed(1); // km

            // Extract leg durations — apply 1.8x correction factor
            // OSRM tends to underestimate urban travel time vs Google Maps
            const OSRM_CORRECTION = 1.8;
            const legs = route.legs || [];
            let cumulativeTime = 0;
            const routeStores = ordered.map((store, i) => {
                const rawDuration = legs[i] ? legs[i].duration / 60 : 0;
                const legDuration = Math.round(rawDuration * OSRM_CORRECTION); // movement only
                const shopTime = getShoppingTime(store.category, travelMode);

                cumulativeTime += (legDuration + shopTime);

                return {
                    storeId: store.id,
                    name: store.name,
                    status: store.status,
                    category: store.category,
                    legTime: legDuration,
                    shopTime: shopTime,
                    cumulativeTime: cumulativeTime,
                };
            });

            // Filter stores within time limit
            const withinTimeLimit = routeStores.filter(s => s.cumulativeTime <= timeLimit);

            // Calculate totals
            const totalDuration = withinTimeLimit.length > 0 ? withinTimeLimit[withinTimeLimit.length - 1].cumulativeTime : 0;
            const totalShoppingTime = withinTimeLimit.reduce((sum, s) => sum + s.shopTime, 0);

            // Extract route coordinates for polyline
            const routeCoords = route.geometry.coordinates.map(c => [c[1], c[0]]);

            const result = {
                stores: withinTimeLimit,
                totalDuration,
                totalShoppingTime,
                totalDistance,
                routeCoords,
                allStores: routeStores,
            };

            setRouteResult(result);
            onRouteCalculated(result.stores, routeCoords);

        } catch (err) {
            console.error('Route calculation error:', err);
            setError('ルート計算中にエラーが発生しました');
        } finally {
            setIsCalculating(false);
        }
    };

    const handleClose = () => {
        setRouteResult(null);
        setError(null);
        onRouteCalculated(null, null);
        onClose();
    };

    const clearRoute = () => {
        setRouteResult(null);
        onRouteCalculated(null, null);
    };

    const openGoogleMaps = () => {
        if (!userPos || !routeResult || routeResult.stores.length === 0) return;

        const origin = `${userPos[0]},${userPos[1]}`;
        const destStore = routeResult.stores[routeResult.stores.length - 1];
        // Note: Google Maps expects lat,lng
        const destination = `${destStore.lat || 0},${destStore.lng || 0}`;

        // Find actual coordinates for each store since routeResult.stores only has ID right now
        // We need the full store object from 'stores' array
        const waypoints = routeResult.stores.slice(0, -1).map(rs => {
            const s = stores.find(x => x.id === rs.storeId);
            return s ? `${s.lat},${s.lng}` : '';
        }).filter(Boolean).join('|');

        // We need to fix the destination coords if they aren't in routeResult
        const finalDestStore = stores.find(x => x.id === destStore.storeId);
        const finalDestCoords = finalDestStore ? `${finalDestStore.lat},${finalDestStore.lng}` : origin;

        const mode = travelMode === 'car' ? 'driving' : 'walking';

        let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${finalDestCoords}&travelmode=${mode}`;
        if (waypoints) {
            url += `&waypoints=${waypoints}`;
        }

        window.open(url, '_blank');
    };

    return (
        <>
            {/* Background Overlay */}
            <div className={`side-panel-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose}></div>

            <div className={`settings-bottom-sheet ${isOpen ? 'open' : ''}`}>
                <div className="side-panel-header">
                    <div className="side-panel-header-top">
                        <div className="side-panel-store-info">
                            <Settings size={22} style={{ color: 'var(--color-text-main)', marginTop: '2px' }} />
                            <div>
                                <h3 className="side-panel-store-name">設定・ルート検索</h3>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                    表示の絞り込みと、効率的な巡回ルートの計算
                                </div>
                            </div>
                        </div>
                        <button className="side-panel-close" onClick={handleClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="side-panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Basic Filters (Favorites) */}
                    <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '12px', color: 'var(--color-text-main)' }}>表示フィルター</h4>
                        <button
                            className="btn"
                            style={{
                                width: '100%',
                                justifyContent: 'flex-start',
                                backgroundColor: showFavoritesOnly ? '#fff5e6' : 'var(--color-bg)',
                                border: `1px solid ${showFavoritesOnly ? '#f39c12' : 'var(--color-surface-border)'}`,
                                color: showFavoritesOnly ? '#d35400' : 'var(--color-text-main)'
                            }}
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        >
                            <Star size={18} fill={showFavoritesOnly ? "#f39c12" : "none"} color={showFavoritesOnly ? "#f39c12" : "currentColor"} />
                            お気に入りの店舗のみ表示
                        </button>
                    </div>

                    <div style={{ height: '1px', background: 'var(--color-surface-border)' }}></div>

                    {/* Gachi Mode Routing */}
                    <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '16px', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Zap size={16} color="var(--color-primary)" /> ガチ回りルート計算
                        </h4>

                        {/* Travel mode toggle */}
                        <div style={{ marginBottom: '16px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px', display: 'block' }}>移動手段</span>
                            <div className="radio-group">
                                <label className={`radio-label ${travelMode === 'foot' ? 'selected-out-of-stock' : ''}`} style={{ padding: '8px' }}>
                                    <input type="radio" checked={travelMode === 'foot'} onChange={() => setTravelMode('foot')} />
                                    <Footprints size={16} style={{ marginRight: 6 }} /> 徒歩
                                </label>
                                <label className={`radio-label ${travelMode === 'car' ? 'selected-out-of-stock' : ''}`} style={{ padding: '8px' }}>
                                    <input type="radio" checked={travelMode === 'car'} onChange={() => setTravelMode('car')} />
                                    <Car size={16} style={{ marginRight: 6 }} /> 車
                                </label>
                            </div>
                        </div>
                        {/* Travel mode toggle */}
                        <div className="gachi-option-group">
                            <span className="gachi-option-label">移動手段</span>
                            <div className="gachi-toggle-group">
                                <button
                                    className={`gachi-toggle-btn ${travelMode === 'foot' ? 'active' : ''}`}
                                    onClick={() => setTravelMode('foot')}
                                >
                                    <Footprints size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                    徒歩
                                </button>
                                <button
                                    className={`gachi-toggle-btn ${travelMode === 'car' ? 'active' : ''}`}
                                    onClick={() => setTravelMode('car')}
                                >
                                    <Car size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                    車
                                </button>
                            </div>
                        </div>

                        {/* Target stores toggle */}
                        <div style={{ marginBottom: '16px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px', display: 'block' }}>ルート対象店舗</span>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
                                    <input
                                        type="checkbox"
                                        checked={statusFilters.inStock}
                                        onChange={(e) => setStatusFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                                        style={{ accentColor: 'var(--color-in-stock)', width: '16px', height: '16px' }}
                                    />
                                    在庫あり
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                                    <input
                                        type="checkbox"
                                        checked={statusFilters.unknown}
                                        onChange={(e) => setStatusFilters(prev => ({ ...prev, unknown: e.target.checked }))}
                                        style={{ accentColor: 'var(--color-unavailable)', width: '16px', height: '16px' }}
                                    />
                                    不明
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                                    <input
                                        type="checkbox"
                                        checked={statusFilters.restockUndecided}
                                        onChange={(e) => setStatusFilters(prev => ({ ...prev, restockUndecided: e.target.checked }))}
                                        style={{ accentColor: 'var(--color-unavailable)', width: '16px', height: '16px' }}
                                    />
                                    入荷未定
                                </label>
                            </div>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={statusFilters.inStock}
                                onChange={(e) => setStatusFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                                style={{ accentColor: '#2ed573' }}
                            />
                            🟢 在庫あり
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={statusFilters.unknown}
                                onChange={(e) => setStatusFilters(prev => ({ ...prev, unknown: e.target.checked }))}
                                style={{ accentColor: '#a4b0be' }}
                            />
                            ⚫️ 不明
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={statusFilters.restockUndecided}
                                onChange={(e) => setStatusFilters(prev => ({ ...prev, restockUndecided: e.target.checked }))}
                                style={{ accentColor: '#a4b0be' }}
                            />
                            ⚫️ 入荷未定
                        </label>
                    </div>
                </div>

                {/* Time limit select */}
                <div className="gachi-option-group">
                    <span className="gachi-option-label">
                        <Clock size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        所要時間
                    </span>
                    <select
                        className="gachi-time-select"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                    >
                        <option value={30}>30分</option>
                        <option value={60}>60分</option>
                        <option value={90}>90分</option>
                        <option value={120}>120分</option>
                    </select>
                </div>

                {/* Calculate button */}
                <button
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '8px' }}
                    onClick={routeResult ? clearRoute : calculateRoute}
                    disabled={isCalculating}
                >
                    {isCalculating ? '計算中...' : routeResult ? '🔄 ルートをリセット' : '🔥 最適ルートを計算'}
                </button>

                {error && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', textAlign: 'center', padding: '8px 0', fontWeight: 600 }}>
                        {error}
                    </div>
                )}
            </div>

            {/* Route results */}
            {routeResult && routeResult.stores.length > 0 && (
                <div style={{ background: 'var(--color-bg)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '12px', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={16} color="var(--color-primary)" />
                        ルート（{routeResult.stores.length}店舗）
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {routeResult.stores.map((s, i) => (
                            <li key={s.storeId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', padding: '6px 0', borderBottom: '1px solid var(--color-surface-border)' }}>
                                <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ background: 'var(--color-text-main)', color: 'white', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>{i + 1}</span>
                                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                                </span>
                                <span style={{ color: 'var(--color-text-muted)' }}>{s.legTime}分</span>
                            </li>
                        ))}
                    </ul>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '16px', textAlign: 'right' }}>
                        合計: 約{routeResult.totalDuration}分 / {routeResult.totalDistance}km <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>(購入時間含む)</span>
                    </div>
                    <button
                        className="btn"
                        onClick={openGoogleMaps}
                        style={{ width: '100%', background: 'white', border: '1px solid var(--color-surface-border)', color: 'var(--color-text-main)' }}
                    >
                        <ExternalLink size={16} style={{ marginRight: 6 }} /> Google Mapsで開く
                    </button>
                </div>
            )}
        </>
    );
}
