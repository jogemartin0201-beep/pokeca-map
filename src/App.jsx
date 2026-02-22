import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Star, Zap } from 'lucide-react';
import PokeMap from './components/PokeMap';
import GachiMode from './components/GachiMode';
import { mockStores } from './data/mockStores';
import './index.css';

function App() {
    const [stores, setStores] = useState(mockStores);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('pokecan_favorites');
        return saved ? JSON.parse(saved) : [];
    });
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [gachiMode, setGachiMode] = useState(false);
    const [gachiRoute, setGachiRoute] = useState(null);
    const [routeCoords, setRouteCoords] = useState(null);
    const [userPos, setUserPos] = useState(null);

    const locateUser = useCallback(() => {
        // Fallback coordinates (Sakae Station area)
        const fallbackPos = [35.1689, 136.9079];

        // Check if geolocation is available AND we are in a secure context (HTTPS/localhost)
        // Some mobile browsers return navigator.geolocation but fail silently or with code 2/3 if not secure
        if (navigator.geolocation && (window.isSecureContext !== false)) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
                (err) => {
                    console.error('Geolocation Error:', err);
                    if (err.code === 1) { // PERMISSION_DENIED
                        alert('位置情報の利用が許可されていません。テスト用の現在地（栄駅周辺）を設定します。');
                    } else {
                        alert('ローカルネットワーク接続エラー（HTTP制限）のため位置情報が取得できません。\nテスト用の現在地（栄駅周辺）を設定します。');
                    }
                    setUserPos(fallbackPos);
                },
                { enableHighAccuracy: true, timeout: 5000 }
            );
        } else {
            alert('HTTP環境のため位置情報が利用できません。\nテスト用の現在地（栄駅周辺）を設定します。');
            setUserPos(fallbackPos);
        }
    }, []);

    useEffect(() => {
        locateUser();
    }, [locateUser]);

    useEffect(() => {
        localStorage.setItem('pokecan_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (storeId) => {
        setFavorites(prev =>
            prev.includes(storeId)
                ? prev.filter(id => id !== storeId)
                : [...prev, storeId]
        );
    };

    const handleRouteCalculated = (route, coords) => {
        setGachiRoute(route);
        setRouteCoords(coords);
    };

    return (
        <div className="app-container">
            {/* Floating Header UI */}
            <div className="floating-header">
                <div className="floating-title-card">
                    <MapPin className="floating-icon" size={24} />
                    <h1 className="floating-title">ポケ探</h1>
                </div>

                <div className="floating-actions">
                    <button
                        className={`floating-action-btn ${gachiMode ? 'gachi-active' : ''}`}
                        onClick={() => {
                            setGachiMode(!gachiMode);
                            if (gachiMode) {
                                setGachiRoute(null);
                                setRouteCoords(null);
                            }
                        }}
                        title="ガチ回りモード"
                    >
                        <Zap size={20} />
                    </button>
                    <button
                        className={`floating-action-btn ${showFavoritesOnly ? 'active' : ''}`}
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        title="お気に入りのみ表示"
                    >
                        <Star size={20} fill={showFavoritesOnly ? "white" : "none"} />
                    </button>
                </div>
            </div>

            {/* Gachi Mode Panel */}
            <GachiMode
                isOpen={gachiMode}
                onClose={() => {
                    setGachiMode(false);
                    setGachiRoute(null);
                    setRouteCoords(null);
                }}
                stores={stores}
                userPos={userPos}
                onRouteCalculated={handleRouteCalculated}
            />

            {/* Main Map Area */}
            <main className="map-container">
                <PokeMap
                    stores={stores}
                    setStores={setStores}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    showFavoritesOnly={showFavoritesOnly}
                    gachiMode={gachiMode}
                    gachiRoute={gachiRoute}
                    routeCoords={routeCoords}
                    userPos={userPos}
                    locateUser={locateUser}
                />
            </main>
        </div>
    );
}

export default App;
