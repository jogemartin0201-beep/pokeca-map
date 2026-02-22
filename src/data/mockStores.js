// 愛知県（名古屋市周辺）のモックデータ
// category: 'yodobashi', 'geo', 'aeon', 'conveni', 'pokemon-center', 'other'
// status: 'in-stock', 'low-stock', 'out-of-stock', 'unknown'
//   in-stock = 在庫あり (green)
//   low-stock = 残りわずか (orange)
//   out-of-stock / unknown = 未確認・在庫なし (gray)
// packLimit: null | number — ()パック限（購入制限）

export const mockStores = [
    {
        id: 1,
        name: 'ヨドバシカメラ マルチメディア名古屋松坂屋店',
        category: 'yodobashi',
        lat: 35.1633,
        lng: 136.9075,
        status: 'in-stock',
        packLimit: null,
        history: [{ status: 'in-stock', memo: 'レジ裏にプロモパックあり', packLimit: null }]
    },
    {
        id: 2,
        name: 'ゲオ 名古屋大須店',
        category: 'geo',
        lat: 35.1595,
        lng: 136.9052,
        status: 'out-of-stock',
        packLimit: null,
        history: [{ status: 'out-of-stock', memo: '次回の入荷は未定とのこと', packLimit: null }]
    },
    {
        id: 3,
        name: 'イオンモール熱田',
        category: 'aeon',
        lat: 35.1362,
        lng: 136.9065,
        status: 'in-stock',
        packLimit: 3,
        history: [{ status: 'in-stock', memo: 'お一人様3パックまで', packLimit: 3 }]
    },
    {
        id: 4,
        name: 'セブン-イレブン 名古屋栄３丁目店',
        category: 'conveni',
        lat: 35.1668,
        lng: 136.9044,
        status: 'unknown',
        packLimit: null,
        history: []
    },
    {
        id: 5,
        name: 'ファミリーマート 錦三丁目店',
        category: 'conveni',
        lat: 35.1729,
        lng: 136.9038,
        status: 'in-stock',
        packLimit: 2,
        history: [{ status: 'in-stock', memo: 'シャイニートレジャーex入荷中', packLimit: 2 }]
    },
    {
        id: 6,
        name: 'カードショップ 大須トレカ',
        category: 'other',
        lat: 35.1578,
        lng: 136.9022,
        status: 'low-stock',
        packLimit: 3,
        history: [
            { status: 'low-stock', memo: '1人3パックまで', packLimit: 3 },
            { status: 'in-stock', memo: 'ボックス入荷しました', packLimit: null }
        ]
    },
    {
        id: 7,
        name: 'ポケモンセンター ナゴヤ',
        category: 'pokemon-center',
        lat: 35.1706,
        lng: 136.8816,
        status: 'in-stock',
        packLimit: null,
        history: [{ status: 'in-stock', memo: '最新弾まだあります', packLimit: null }]
    },
    {
        id: 8,
        name: 'ビックカメラ 名古屋駅西店',
        category: 'yodobashi',
        lat: 35.1709,
        lng: 136.8822,
        status: 'out-of-stock',
        packLimit: null,
    },
    // --- 愛知県東区（ナゴヤドーム・大曽根周辺）の追加データ ---
    {
        "id": 17,
        "name": "ミニストップ 名古屋古出来店",
        "category": "conveni",
        "lat": 35.1771,
        "lng": 136.9453,
        "status": "out-of-stock",
        "packLimit": null,
        "history": [
            {
                "status": "out-of-stock",
                "time": "8時間前",
                "timestamp": "2026-02-21T18:53:55.058Z",
                "memo": "売り切れでした",
                "packLimit": null
            }
        ]
    },
    {
        "id": 18,
        "name": "ミニストップ 名古屋泉店",
        "category": "conveni",
        "lat": 35.1857,
        "lng": 136.9453,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "16時間前",
                "timestamp": "2026-02-21T10:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 19,
        "name": "ミニストップ 名古屋徳川店",
        "category": "conveni",
        "lat": 35.1723,
        "lng": 136.9458,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "2時間前",
                "timestamp": "2026-02-22T00:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 20,
        "name": "ローソン 名古屋矢田店",
        "category": "conveni",
        "lat": 35.1987,
        "lng": 136.9494,
        "status": "out-of-stock",
        "packLimit": null,
        "history": [
            {
                "status": "out-of-stock",
                "time": "7時間前",
                "timestamp": "2026-02-13T19:53:55.058Z",
                "memo": "売り切れでした",
                "packLimit": null
            }
        ]
    },
    {
        "id": 21,
        "name": "スギ薬局 ナゴヤドーム前店",
        "category": "other",
        "lat": 35.1947,
        "lng": 136.9394,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "8時間前",
                "timestamp": "2026-02-21T18:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 22,
        "name": "ローソン 名古屋葵店",
        "category": "conveni",
        "lat": 35.1998,
        "lng": 136.9335,
        "status": "unknown",
        "packLimit": null,
        "history": []
    },
    {
        "id": 23,
        "name": "ファミリーマート 名古屋新出来店",
        "category": "conveni",
        "lat": 35.1953,
        "lng": 136.9512,
        "status": "unknown",
        "packLimit": null,
        "history": []
    },
    {
        "id": 24,
        "name": "ミニストップ 名古屋代官町店",
        "category": "conveni",
        "lat": 35.1743,
        "lng": 136.9389,
        "status": "unknown",
        "packLimit": null,
        "history": []
    },
    {
        "id": 25,
        "name": "ミニストップ 名古屋徳川店",
        "category": "conveni",
        "lat": 35.1806,
        "lng": 136.9373,
        "status": "out-of-stock",
        "packLimit": null,
        "history": [
            {
                "status": "out-of-stock",
                "time": "22時間前",
                "timestamp": "2026-02-21T04:53:55.058Z",
                "memo": "売り切れでした",
                "packLimit": null
            }
        ]
    },
    {
        "id": 26,
        "name": "ローソン 名古屋葵店",
        "category": "conveni",
        "lat": 35.1968,
        "lng": 136.9507,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "23時間前",
                "timestamp": "2026-02-13T03:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 27,
        "name": "セブン-イレブン 名古屋筒井店",
        "category": "conveni",
        "lat": 35.1872,
        "lng": 136.9344,
        "status": "unknown",
        "packLimit": null,
        "history": []
    },
    {
        "id": 28,
        "name": "ゲオ 大曽根店",
        "category": "geo",
        "lat": 35.1846,
        "lng": 136.9556,
        "status": "unknown",
        "packLimit": null,
        "history": []
    },
    {
        "id": 29,
        "name": "マックスバリュ 徳川店",
        "category": "aeon",
        "lat": 35.1893,
        "lng": 136.9393,
        "status": "out-of-stock",
        "packLimit": null,
        "history": [
            {
                "status": "out-of-stock",
                "time": "5時間前",
                "timestamp": "2026-02-21T21:53:55.058Z",
                "memo": "売り切れでした",
                "packLimit": null
            }
        ]
    },
    {
        "id": 30,
        "name": "ローソン 名古屋白壁店",
        "category": "conveni",
        "lat": 35.1993,
        "lng": 136.9495,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "20時間前",
                "timestamp": "2026-02-21T06:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 31,
        "name": "スギ薬局 徳川店",
        "category": "other",
        "lat": 35.178,
        "lng": 136.9434,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "0時間前",
                "timestamp": "2026-02-14T02:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 32,
        "name": "ローソン 名古屋砂田橋店",
        "category": "conveni",
        "lat": 35.2011,
        "lng": 136.9368,
        "status": "out-of-stock",
        "packLimit": null,
        "history": [
            {
                "status": "out-of-stock",
                "time": "19時間前",
                "timestamp": "2026-02-21T07:53:55.058Z",
                "memo": "売り切れでした",
                "packLimit": null
            }
        ]
    },
    {
        "id": 33,
        "name": "ミニストップ 名古屋矢田店",
        "category": "conveni",
        "lat": 35.1795,
        "lng": 136.9565,
        "status": "unknown",
        "packLimit": null,
        "history": []
    },
    {
        "id": 34,
        "name": "エディオン 徳川店",
        "category": "yodobashi",
        "lat": 35.1961,
        "lng": 136.9425,
        "status": "unknown",
        "packLimit": null,
        "history": []
    },
    {
        "id": 35,
        "name": "ファミリーマート 名古屋大曽根店",
        "category": "conveni",
        "lat": 35.177,
        "lng": 136.9621,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "18時間前",
                "timestamp": "2026-02-21T08:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 36,
        "name": "ローソン 名古屋泉店",
        "category": "conveni",
        "lat": 35.1799,
        "lng": 136.9589,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "1時間前",
                "timestamp": "2026-02-22T01:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 37,
        "name": "ミニストップ 名古屋泉店",
        "category": "conveni",
        "lat": 35.1754,
        "lng": 136.9406,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "16時間前",
                "timestamp": "2026-02-21T10:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 38,
        "name": "セブン-イレブン 名古屋徳川店",
        "category": "conveni",
        "lat": 35.1974,
        "lng": 136.9468,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "12時間前",
                "timestamp": "2026-02-21T14:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 39,
        "name": "TSUTAYA 砂田橋店",
        "category": "geo",
        "lat": 35.201,
        "lng": 136.9371,
        "status": "out-of-stock",
        "packLimit": null,
        "history": [
            {
                "status": "out-of-stock",
                "time": "15時間前",
                "timestamp": "2026-02-21T11:53:55.058Z",
                "memo": "売り切れでした",
                "packLimit": null
            }
        ]
    },
    {
        "id": 40,
        "name": "セブン-イレブン 名古屋白壁店",
        "category": "conveni",
        "lat": 35.1879,
        "lng": 136.9606,
        "status": "out-of-stock",
        "packLimit": null,
        "history": [
            {
                "status": "out-of-stock",
                "time": "13時間前",
                "timestamp": "2026-02-13T13:53:55.058Z",
                "memo": "売り切れでした",
                "packLimit": null
            }
        ]
    },
    {
        "id": 41,
        "name": "ミニストップ 名古屋主税町店",
        "category": "conveni",
        "lat": 35.1986,
        "lng": 136.9533,
        "status": "unknown",
        "packLimit": null,
        "history": []
    },
    {
        "id": 42,
        "name": "ファミリーマート 名古屋筒井店",
        "category": "conveni",
        "lat": 35.1985,
        "lng": 136.9413,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "5時間前",
                "timestamp": "2026-02-21T21:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 43,
        "name": "ローソン 名古屋矢田店",
        "category": "conveni",
        "lat": 35.1809,
        "lng": 136.958,
        "status": "out-of-stock",
        "packLimit": null,
        "history": [
            {
                "status": "out-of-stock",
                "time": "5時間前",
                "timestamp": "2026-02-21T21:53:55.058Z",
                "memo": "売り切れでした",
                "packLimit": null
            }
        ]
    },
    {
        "id": 44,
        "name": "ドラッグスギヤマ ナゴヤドーム前店",
        "category": "other",
        "lat": 35.1862,
        "lng": 136.9608,
        "status": "out-of-stock",
        "packLimit": null,
        "history": [
            {
                "status": "out-of-stock",
                "time": "14時間前",
                "timestamp": "2026-02-13T12:53:55.058Z",
                "memo": "売り切れでした",
                "packLimit": null
            }
        ]
    },
    {
        "id": 45,
        "name": "セブン-イレブン 名古屋主税町店",
        "category": "conveni",
        "lat": 35.1883,
        "lng": 136.959,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "13時間前",
                "timestamp": "2026-02-21T13:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 46,
        "name": "マックスバリュ 徳川店",
        "category": "aeon",
        "lat": 35.1865,
        "lng": 136.9445,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "21時間前",
                "timestamp": "2026-02-21T05:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 47,
        "name": "セブン-イレブン 名古屋古出来店",
        "category": "conveni",
        "lat": 35.1877,
        "lng": 136.9485,
        "status": "unknown",
        "packLimit": null,
        "history": []
    },
    {
        "id": 48,
        "name": "ミニストップ 名古屋砂田橋店",
        "category": "conveni",
        "lat": 35.1938,
        "lng": 136.9419,
        "status": "unknown",
        "packLimit": null,
        "history": []
    },
    {
        "id": 49,
        "name": "ミニストップ 名古屋大曽根店",
        "category": "conveni",
        "lat": 35.1795,
        "lng": 136.9415,
        "status": "out-of-stock",
        "packLimit": null,
        "history": [
            {
                "status": "out-of-stock",
                "time": "1時間前",
                "timestamp": "2026-02-22T01:53:55.058Z",
                "memo": "売り切れでした",
                "packLimit": null
            }
        ]
    },
    {
        "id": 50,
        "name": "ローソン 名古屋白壁店",
        "category": "conveni",
        "lat": 35.1996,
        "lng": 136.9339,
        "status": "unknown",
        "packLimit": null,
        "history": []
    },
    {
        "id": 51,
        "name": "セブン-イレブン 名古屋白壁店",
        "category": "conveni",
        "lat": 35.1922,
        "lng": 136.9453,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "3時間前",
                "timestamp": "2026-02-21T23:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 52,
        "name": "エディオン 大曽根店",
        "category": "yodobashi",
        "lat": 35.1891,
        "lng": 136.9519,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "8時間前",
                "timestamp": "2026-02-13T18:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 53,
        "name": "イオン 砂田橋店",
        "category": "aeon",
        "lat": 35.1951,
        "lng": 136.9324,
        "status": "out-of-stock",
        "packLimit": null,
        "history": [
            {
                "status": "out-of-stock",
                "time": "7時間前",
                "timestamp": "2026-02-21T19:53:55.058Z",
                "memo": "売り切れでした",
                "packLimit": null
            }
        ]
    },
    {
        "id": 54,
        "name": "セブン-イレブン 名古屋古出来店",
        "category": "conveni",
        "lat": 35.1962,
        "lng": 136.9478,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "22時間前",
                "timestamp": "2026-02-13T04:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 55,
        "name": "ファミリーマート 名古屋葵店",
        "category": "conveni",
        "lat": 35.1858,
        "lng": 136.96,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "18時間前",
                "timestamp": "2026-02-13T08:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 56,
        "name": "ミニストップ 名古屋矢田店",
        "category": "conveni",
        "lat": 35.18,
        "lng": 136.9388,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "19時間前",
                "timestamp": "2026-02-13T07:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 57,
        "name": "ファミリーマート 名古屋徳川店",
        "category": "conveni",
        "lat": 35.2003,
        "lng": 136.9541,
        "status": "out-of-stock",
        "packLimit": null,
        "history": [
            {
                "status": "out-of-stock",
                "time": "14時間前",
                "timestamp": "2026-02-21T12:53:55.058Z",
                "memo": "売り切れでした",
                "packLimit": null
            }
        ]
    },
    {
        "id": 58,
        "name": "セブン-イレブン 名古屋筒井店",
        "category": "conveni",
        "lat": 35.1961,
        "lng": 136.9424,
        "status": "out-of-stock",
        "packLimit": null,
        "history": [
            {
                "status": "out-of-stock",
                "time": "20時間前",
                "timestamp": "2026-02-21T06:53:55.058Z",
                "memo": "売り切れでした",
                "packLimit": null
            }
        ]
    },
    {
        "id": 59,
        "name": "ローソン 名古屋筒井店",
        "category": "conveni",
        "lat": 35.1917,
        "lng": 136.961,
        "status": "unknown",
        "packLimit": null,
        "history": []
    },
    {
        "id": 60,
        "name": "ミニストップ 名古屋大曽根店",
        "category": "conveni",
        "lat": 35.1953,
        "lng": 136.9615,
        "status": "out-of-stock",
        "packLimit": null,
        "history": [
            {
                "status": "out-of-stock",
                "time": "1時間前",
                "timestamp": "2026-02-22T01:53:55.058Z",
                "memo": "売り切れでした",
                "packLimit": null
            }
        ]
    },
    {
        "id": 61,
        "name": "ミニストップ 名古屋筒井店",
        "category": "conveni",
        "lat": 35.1966,
        "lng": 136.9413,
        "status": "unknown",
        "packLimit": null,
        "history": []
    },
    {
        "id": 62,
        "name": "TSUTAYA ナゴヤドーム前店",
        "category": "geo",
        "lat": 35.1951,
        "lng": 136.9466,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "10時間前",
                "timestamp": "2026-02-21T16:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 63,
        "name": "ミニストップ 名古屋古出来店",
        "category": "conveni",
        "lat": 35.1867,
        "lng": 136.9577,
        "status": "unknown",
        "packLimit": null,
        "history": []
    },
    {
        "id": 64,
        "name": "ファミリーマート 名古屋代官町店",
        "category": "conveni",
        "lat": 35.1756,
        "lng": 136.9396,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "8時間前",
                "timestamp": "2026-02-21T18:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 65,
        "name": "ファミリーマート 名古屋古出来店",
        "category": "conveni",
        "lat": 35.1788,
        "lng": 136.9494,
        "status": "in-stock",
        "packLimit": null,
        "history": [
            {
                "status": "in-stock",
                "time": "11時間前",
                "timestamp": "2026-02-13T15:53:55.058Z",
                "memo": "在庫ありました",
                "packLimit": null
            }
        ]
    },
    {
        "id": 66,
        "name": "イオン 砂田橋店",
        "category": "aeon",
        "lat": 35.1796,
        "lng": 136.951,
        "status": "unknown",
        "packLimit": null,
        "history": []
    }
];
