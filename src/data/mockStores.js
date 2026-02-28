// 名古屋市東区のコンビニエンスストアを中心とした実在店舗データ
// category: 'conveni', 'other'
// status: 'in-stock', 'low-stock', 'out-of-stock', 'unknown'
//   in-stock = 在庫あり
//   low-stock = 残りわずか
//   out-of-stock / unknown = 未確認・在庫なし
// packLimit: null | number — ()パック限（購入制限）

export const mockStores = [
    // --- 東区：代官町・泉・葵エリア ---
    {
        id: 1,
        name: 'セブン-イレブン 名古屋代官町店',
        category: 'conveni',
        lat: 35.174867,
        lng: 136.921572,
        status: 'in-stock',
        packLimit: 2,
        history: [{ status: 'in-stock', memo: 'レジ横に2パック限であり', packLimit: 2, timestamp: new Date(Date.now() - 3600000).toISOString() }]
    },
    {
        id: 2,
        name: 'ファミリーマート 代官町東店',
        category: 'conveni',
        lat: 35.176081,
        lng: 136.924757,
        status: 'low-stock',
        packLimit: 5,
        history: [{ status: 'low-stock', memo: '残り数パックでした。5パック限。', packLimit: 5, timestamp: new Date(Date.now() - 7200000).toISOString() }]
    },
    {
        id: 3,
        name: 'ローソン 東区代官町店',
        category: 'conveni',
        lat: 35.174531,
        lng: 136.920747,
        status: 'unknown',
        packLimit: null,
        history: []
    },
    {
        id: 4,
        name: 'セブン-イレブン 名古屋葵3丁目東店',
        category: 'conveni',
        lat: 35.17176,
        lng: 136.931118,
        status: 'out-of-stock',
        packLimit: null,
        history: [{ status: 'out-of-stock', memo: '売り切れ', packLimit: null, timestamp: new Date(Date.now() - 86400000).toISOString() }]
    },
    {
        id: 5,
        name: 'ファミリーマート 葵店',
        category: 'conveni',
        lat: 35.171008,
        lng: 136.920238,
        status: 'in-stock',
        packLimit: 3,
        history: [{ status: 'in-stock', memo: '深夜に入荷した模様', packLimit: 3, timestamp: new Date(Date.now() - 14400000).toISOString() }]
    },
    {
        id: 6,
        name: 'セブン-イレブン 名古屋泉1丁目店',
        category: 'conveni',
        lat: 35.1763,
        lng: 136.9112,
        status: 'unknown',
        packLimit: null,
        history: []
    },
    {
        id: 7,
        name: 'セブン-イレブン 名古屋泉2丁目店',
        category: 'conveni',
        lat: 35.1775,
        lng: 136.9165,
        status: 'in-stock',
        packLimit: null,
        history: [{ status: 'in-stock', memo: '箱で置いてありました', packLimit: null, timestamp: new Date(Date.now() - 1800000).toISOString() }]
    },
    {
        id: 8,
        name: 'セブン-イレブン 名古屋泉3丁目店',
        category: 'conveni',
        lat: 35.1768,
        lng: 136.9205,
        status: 'out-of-stock',
        packLimit: null,
        history: [{ status: 'out-of-stock', memo: '次回の入荷は未定とのこと', packLimit: null, timestamp: new Date(Date.now() - 43200000).toISOString() }]
    },
    {
        id: 9,
        name: 'ローソン 東区泉三丁目店内',
        category: 'conveni',
        lat: 35.1755,
        lng: 136.9215,
        status: 'unknown',
        packLimit: null,
        history: []
    },

    // --- 東区：大曽根・矢田・ナゴヤドーム周辺エリア ---
    {
        id: 10,
        name: 'ファミリーマート 大幸一丁目店',
        category: 'conveni',
        lat: 35.192357,
        lng: 136.946714,
        status: 'low-stock',
        packLimit: 1,
        history: [{ status: 'low-stock', memo: 'レジ裏にプロモパックあり・1パックのみ', packLimit: 1, timestamp: new Date(Date.now() - 2700000).toISOString() }]
    },
    {
        id: 11,
        name: 'ローソン 東区矢田五丁目店',
        category: 'conveni',
        lat: 35.191554,
        lng: 136.942255,
        status: 'in-stock',
        packLimit: 10,
        history: [{ status: 'in-stock', memo: '10パック限で販売中', packLimit: 10, timestamp: new Date(Date.now() - 5000000).toISOString() }]
    },
    {
        id: 12,
        name: 'ファミリーマート 名古屋東大曽根店',
        category: 'conveni',
        lat: 35.185901,
        lng: 136.93652,
        status: 'out-of-stock',
        packLimit: null,
        history: [{ status: 'out-of-stock', memo: '売り切れ。', packLimit: null, timestamp: new Date(Date.now() - 18000000).toISOString() }]
    },
    {
        id: 13,
        name: 'セブン-イレブン 名古屋新出来2丁目店',
        category: 'conveni',
        lat: 35.1855,
        lng: 136.9385,
        status: 'in-stock',
        packLimit: 5,
        history: [{ status: 'in-stock', memo: '在庫あり', packLimit: 5, timestamp: new Date(Date.now() - 1200000).toISOString() }]
    },
    {
        id: 14,
        name: 'セブン-イレブン 名古屋徳川2丁目店',
        category: 'conveni',
        lat: 35.1850,
        lng: 136.9280,
        status: 'unknown',
        packLimit: null,
        history: []
    },

    // --- 東区：車道・筒井エリア ---
    {
        id: 15,
        name: 'ミニストップ 車道店',
        category: 'conveni',
        lat: 35.173954,
        lng: 136.92834,
        status: 'in-stock',
        packLimit: 3,
        history: [{ status: 'in-stock', memo: '在庫あり。', packLimit: 3, timestamp: new Date(Date.now() - 800000).toISOString() }]
    },
    {
        id: 16,
        name: 'セブン-イレブン 名古屋筒井町4丁目店',
        category: 'conveni',
        lat: 35.1755,
        lng: 136.9280,
        status: 'low-stock',
        packLimit: 2,
        history: [{ status: 'low-stock', memo: '残りわずか', packLimit: 2, timestamp: new Date(Date.now() - 4000000).toISOString() }]
    },

    // --- ドラッグストア・その他東区エリア ---
    {
        id: 17,
        name: 'スギ薬局 代官町店',
        category: 'other',
        lat: 35.1756,
        lng: 136.9220,
        status: 'out-of-stock',
        packLimit: null,
        history: [{ status: 'out-of-stock', memo: 'おもちゃ売り場扱いなし', packLimit: null, timestamp: new Date(Date.now() - 86400000).toISOString() }]
    },
    {
        id: 18,
        name: 'スギドラッグ 砂田橋店',
        category: 'other',
        lat: 35.1880,
        lng: 136.9530,
        status: 'in-stock',
        packLimit: 1,
        history: [{ status: 'in-stock', memo: '1人1パックまで', packLimit: 1, timestamp: new Date(Date.now() - 2500000).toISOString() }]
    },
    {
        id: 19,
        name: 'イオンモールナゴヤドーム前',
        category: 'other',
        lat: 35.187111,
        lng: 136.944222,
        status: 'out-of-stock',
        packLimit: null,
        history: [{ status: 'out-of-stock', memo: '売り切れ', packLimit: null, timestamp: new Date(Date.now() - 18000000).toISOString() }]
    },
    {
        id: 20,
        name: 'TSUTAYA バロー砂田橋店',
        category: 'other',
        lat: 35.1885,
        lng: 136.9540,
        status: 'in-stock',
        packLimit: null,
        history: [
            { status: 'in-stock', memo: 'カード売り場に潤沢に在庫あり', packLimit: null, timestamp: new Date(Date.now() - 600000).toISOString() }
        ]
    }
];
