// borsa-analysis.js — Motore di analisi condiviso (tecnico + fondamentale + Analisi 3)
// Includi questo file prima di usare le funzioni di analisi nelle pagine.
'use strict';

// ─── ASSETS ─────────────────────────────────────────────────────────────────
const BORSA_ASSETS = {
    nasdaq: {
        label: 'NASDAQ', pillClass: 'pill-nasdaq',
        items: [
            {symbol:'AAPL',name:'Apple'},{symbol:'MSFT',name:'Microsoft'},
            {symbol:'NVDA',name:'NVIDIA'},{symbol:'AMZN',name:'Amazon'},
            {symbol:'META',name:'Meta'},{symbol:'GOOGL',name:'Alphabet'},
            {symbol:'TSLA',name:'Tesla'},{symbol:'AVGO',name:'Broadcom'},
            {symbol:'NFLX',name:'Netflix'},{symbol:'AMD',name:'AMD'},
            {symbol:'ADBE',name:'Adobe'},{symbol:'QCOM',name:'Qualcomm'},
            {symbol:'COST',name:'Costco'},{symbol:'INTC',name:'Intel'},
            {symbol:'CSCO',name:'Cisco'},{symbol:'PYPL',name:'PayPal'},
            {symbol:'SBUX',name:'Starbucks'},{symbol:'ORCL',name:'Oracle'},
            {symbol:'INTU',name:'Intuit'},{symbol:'AMAT',name:'Applied Materials'},
            {symbol:'PANW',name:'Palo Alto Networks'},{symbol:'MRVL',name:'Marvell Technology'},
            {symbol:'KLAC',name:'KLA Corporation'},{symbol:'LRCX',name:'Lam Research'},
            {symbol:'SNPS',name:'Synopsys'},{symbol:'CDNS',name:'Cadence Design'},
            {symbol:'MELI',name:'MercadoLibre'},{symbol:'ABNB',name:'Airbnb'},
            {symbol:'BKNG',name:'Booking Holdings'},{symbol:'CRWD',name:'CrowdStrike'},
            {symbol:'DDOG',name:'Datadog'},{symbol:'MDB',name:'MongoDB'},
            {symbol:'SNOW',name:'Snowflake'},{symbol:'TEAM',name:'Atlassian'},
            {symbol:'WDAY',name:'Workday'},{symbol:'SHOP',name:'Shopify'},
            {symbol:'COIN',name:'Coinbase'},{symbol:'ZS',name:'Zscaler'},
            {symbol:'ON',name:'ON Semiconductor'},{symbol:'ARM',name:'ARM Holdings'},
            {symbol:'SMCI',name:'Super Micro Computer'},{symbol:'FAST',name:'Fastenal'},
            {symbol:'PAYX',name:'Paychex'},{symbol:'REGN',name:'Regeneron'},
            {symbol:'VRTX',name:'Vertex Pharmaceuticals'},{symbol:'PCAR',name:'PACCAR'},
            {symbol:'ROST',name:'Ross Stores'},{symbol:'CSGP',name:'CoStar Group'},
            {symbol:'NXPI',name:'NXP Semiconductors'},{symbol:'PLTR',name:'Palantir'}
        ]
    },
    sp500: {
        label: 'S&P 500', pillClass: 'pill-sp500',
        items: [
            {symbol:'JPM',name:'JPMorgan Chase'},{symbol:'V',name:'Visa'},
            {symbol:'WMT',name:'Walmart'},{symbol:'MA',name:'Mastercard'},
            {symbol:'XOM',name:'ExxonMobil'},{symbol:'JNJ',name:'Johnson & Johnson'},
            {symbol:'PG',name:'Procter & Gamble'},{symbol:'UNH',name:'UnitedHealth'},
            {symbol:'HD',name:'Home Depot'},{symbol:'CVX',name:'Chevron'},
            {symbol:'MRK',name:'Merck'},{symbol:'BAC',name:'Bank of America'},
            {symbol:'KO',name:'Coca-Cola'},{symbol:'LLY',name:'Eli Lilly'},
            {symbol:'ABBV',name:'AbbVie'},{symbol:'PFE',name:'Pfizer'},
            {symbol:'DIS',name:'Walt Disney'},{symbol:'MCD',name:"McDonald's"},
            {symbol:'WFC',name:'Wells Fargo'},{symbol:'GS',name:'Goldman Sachs'},
            {symbol:'BRK-B',name:'Berkshire Hathaway'},{symbol:'RTX',name:'RTX'},
            {symbol:'HON',name:'Honeywell'},{symbol:'CAT',name:'Caterpillar'},
            {symbol:'BA',name:'Boeing'},{symbol:'GE',name:'GE Aerospace'},
            {symbol:'IBM',name:'IBM'},{symbol:'CRM',name:'Salesforce'},
            {symbol:'NEE',name:'NextEra Energy'},{symbol:'T',name:'AT&T'},
            {symbol:'VZ',name:'Verizon'},{symbol:'CMCSA',name:'Comcast'},
            {symbol:'BMY',name:'Bristol-Myers Squibb'},{symbol:'AMGN',name:'Amgen'},
            {symbol:'MDT',name:'Medtronic'},{symbol:'ABT',name:'Abbott'},
            {symbol:'TMO',name:'Thermo Fisher'},{symbol:'LMT',name:'Lockheed Martin'},
            {symbol:'COP',name:'ConocoPhillips'},{symbol:'USB',name:'US Bancorp'},
            {symbol:'MS',name:'Morgan Stanley'},{symbol:'AXP',name:'American Express'},
            {symbol:'BLK',name:'BlackRock'},{symbol:'SPGI',name:'S&P Global'},
            {symbol:'SO',name:'Southern Company'},{symbol:'DUK',name:'Duke Energy'},
            {symbol:'SLB',name:'SLB'},{symbol:'MMM',name:'3M'},
            {symbol:'DHR',name:'Danaher'},{symbol:'NOC',name:'Northrop Grumman'}
        ]
    },
    italia: {
        label: 'Borsa IT', pillClass: 'pill-italia',
        items: [
            {symbol:'ENI.MI',name:'Eni'},{symbol:'ENEL.MI',name:'Enel'},
            {symbol:'ISP.MI',name:'Intesa Sanpaolo'},{symbol:'UCG.MI',name:'UniCredit'},
            {symbol:'STM.MI',name:'STMicroelectronics'},{symbol:'G.MI',name:'Generali'},
            {symbol:'STLAM.MI',name:'Stellantis'},{symbol:'TIT.MI',name:'Telecom Italia'},
            {symbol:'MB.MI',name:'Mediobanca'},{symbol:'FBK.MI',name:'FinecoBank'},
            {symbol:'LDO.MI',name:'Leonardo'},{symbol:'MONC.MI',name:'Moncler'},
            {symbol:'RACE.MI',name:'Ferrari'},{symbol:'BMED.MI',name:'Banca Mediolanum'},
            {symbol:'CNHI.MI',name:'CNH Industrial'},{symbol:'HER.MI',name:'Hera'},
            {symbol:'INW.MI',name:'Inwit'},{symbol:'AMP.MI',name:'Amplifon'},
            {symbol:'PRY.MI',name:'Prysmian'},{symbol:'CPR.MI',name:'Azimut'},
            {symbol:'PST.MI',name:'Poste Italiane'},{symbol:'REC.MI',name:'Recordati'},
            {symbol:'DIA.MI',name:'DiaSorin'},{symbol:'BAMI.MI',name:'Banco BPM'},
            {symbol:'BMPS.MI',name:'Monte dei Paschi'},{symbol:'A2A.MI',name:'A2A'},
            {symbol:'SRG.MI',name:'Snam'},{symbol:'ERG.MI',name:'ERG'},
            {symbol:'BPER.MI',name:'BPER Banca'},{symbol:'BGN.MI',name:'Banca Generali'},
            {symbol:'TEN.MI',name:'Tenaris'},{symbol:'SPM.MI',name:'Saipem'},
            {symbol:'PIRC.MI',name:'Pirelli'},{symbol:'DLG.MI',name:"De'Longhi"},
            {symbol:'IP.MI',name:'Interpump'},{symbol:'IG.MI',name:'Italgas'},
            {symbol:'IRE.MI',name:'IREN'},{symbol:'BZU.MI',name:'Buzzi'},
            {symbol:'NEXI.MI',name:'Nexi'},{symbol:'EXO.MI',name:'Exor'}
        ]
    },
    cinesi: {
        label: 'Cinesi', pillClass: 'pill-cinesi',
        items: [
            {symbol:'BABA',name:'Alibaba'},{symbol:'JD',name:'JD.com'},
            {symbol:'BIDU',name:'Baidu'},{symbol:'PDD',name:'PDD (Temu)'},
            {symbol:'NIO',name:'NIO'},{symbol:'XPEV',name:'XPeng'},
            {symbol:'LI',name:'Li Auto'},{symbol:'TME',name:'Tencent Music'},
            {symbol:'NTES',name:'NetEase'},{symbol:'YUMC',name:'Yum China'},
            {symbol:'EDU',name:'New Oriental'},{symbol:'FUTU',name:'Futu Holdings'},
            {symbol:'IQ',name:'iQIYI'},{symbol:'MNSO',name:'MINISO'},{symbol:'ZH',name:'Zhihu'},
            {symbol:'TCOM',name:'Trip.com'},{symbol:'BILI',name:'Bilibili'},
            {symbol:'VIPS',name:'Vipshop'},{symbol:'WB',name:'Weibo'},
            {symbol:'TAL',name:'TAL Education'},{symbol:'BEKE',name:'KE Holdings'},
            {symbol:'GDS',name:'GDS Holdings'},{symbol:'DOYU',name:'DouYu'},
            {symbol:'HUYA',name:'Huya'},{symbol:'RLX',name:'RLX Technology'},
            {symbol:'KC',name:'Kingsoft Cloud'},{symbol:'TIGR',name:'UP Fintech'},
            {symbol:'GOTU',name:'Gaotu Techedu'},{symbol:'CAN',name:'Canaan'},
            {symbol:'HTHT',name:'H World Group'},{symbol:'DQ',name:'Daqo New Energy'},
            {symbol:'BGNE',name:'BeiGene'},{symbol:'LU',name:'Lufax'},
            {symbol:'CANG',name:'Cango'},{symbol:'LAIX',name:'LAIX'}
        ]
    },
    europee: {
        label: 'Europee', pillClass: 'pill-europee',
        items: [
            {symbol:'ASML.AS',name:'ASML'},{symbol:'SAP.DE',name:'SAP'},
            {symbol:'NESN.SW',name:'Nestlé'},{symbol:'MC.PA',name:'LVMH'},
            {symbol:'OR.PA',name:"L'Oréal"},{symbol:'SIE.DE',name:'Siemens'},
            {symbol:'TTE.PA',name:'TotalEnergies'},{symbol:'NOVN.SW',name:'Novartis'},
            {symbol:'ALV.DE',name:'Allianz'},{symbol:'BNP.PA',name:'BNP Paribas'},
            {symbol:'AZN.L',name:'AstraZeneca'},{symbol:'AIR.PA',name:'Airbus'},
            {symbol:'VOW3.DE',name:'Volkswagen'},{symbol:'BMW.DE',name:'BMW'},
            {symbol:'ROG.SW',name:'Roche'},{symbol:'HSBA.L',name:'HSBC'},
            {symbol:'GSK.L',name:'GSK'},{symbol:'BP.L',name:'BP'},
            {symbol:'SHEL.L',name:'Shell'},{symbol:'ULVR.L',name:'Unilever'},
            {symbol:'DGE.L',name:'Diageo'},{symbol:'BARC.L',name:'Barclays'},
            {symbol:'RIO.L',name:'Rio Tinto'},{symbol:'BAS.DE',name:'BASF'},
            {symbol:'DBK.DE',name:'Deutsche Bank'},{symbol:'MUV2.DE',name:'Munich Re'},
            {symbol:'DTE.DE',name:'Deutsche Telekom'},{symbol:'ADS.DE',name:'Adidas'},
            {symbol:'BAYN.DE',name:'Bayer'},{symbol:'MBG.DE',name:'Mercedes-Benz'},
            {symbol:'PAH3.DE',name:'Porsche'},{symbol:'SAN.PA',name:'Sanofi'},
            {symbol:'KER.PA',name:'Kering'},{symbol:'RMS.PA',name:'Hermès'},
            {symbol:'AXA.PA',name:'AXA'},{symbol:'DSY.PA',name:'Dassault Systèmes'},
            {symbol:'SU.PA',name:'Schneider Electric'},{symbol:'ORA.PA',name:'Orange'},
            {symbol:'CAP.PA',name:'Capgemini'},{symbol:'INGA.AS',name:'ING'},
            {symbol:'HEIA.AS',name:'Heineken'},{symbol:'AD.AS',name:'Ahold Delhaize'},
            {symbol:'ABBN.SW',name:'ABB'},{symbol:'ZURN.SW',name:'Zurich Insurance'},
            {symbol:'CFR.SW',name:'Richemont'},{symbol:'LONN.SW',name:'Lonza'},
            {symbol:'SAN.MC',name:'Santander'},{symbol:'BBVA.MC',name:'BBVA'},
            {symbol:'TEF.MC',name:'Telefonica'},{symbol:'UCB.BR',name:'UCB'}
        ]
    },
    crypto: {
        label: 'Crypto', pillClass: 'pill-crypto',
        items: [
            {symbol:'BTC-USD',name:'Bitcoin'},{symbol:'ETH-USD',name:'Ethereum'},
            {symbol:'BNB-USD',name:'BNB'},{symbol:'SOL-USD',name:'Solana'},
            {symbol:'XRP-USD',name:'XRP'},{symbol:'ADA-USD',name:'Cardano'},
            {symbol:'DOGE-USD',name:'Dogecoin'},{symbol:'AVAX-USD',name:'Avalanche'},
            {symbol:'DOT-USD',name:'Polkadot'},{symbol:'LINK-USD',name:'Chainlink'},
            {symbol:'LTC-USD',name:'Litecoin'},{symbol:'BCH-USD',name:'Bitcoin Cash'},
            {symbol:'ATOM-USD',name:'Cosmos'},{symbol:'UNI-USD',name:'Uniswap'},
            {symbol:'MATIC-USD',name:'Polygon'},{symbol:'SHIB-USD',name:'Shiba Inu'},
            {symbol:'TRX-USD',name:'TRON'},{symbol:'ICP-USD',name:'Internet Computer'},
            {symbol:'FIL-USD',name:'Filecoin'},{symbol:'NEAR-USD',name:'NEAR Protocol'},
            {symbol:'ALGO-USD',name:'Algorand'},{symbol:'HBAR-USD',name:'Hedera'},
            {symbol:'APT-USD',name:'Aptos'},{symbol:'SUI-USD',name:'Sui'},
            {symbol:'AAVE-USD',name:'Aave'},{symbol:'MKR-USD',name:'Maker'},
            {symbol:'XLM-USD',name:'Stellar'},{symbol:'GRT-USD',name:'The Graph'},
            {symbol:'CRV-USD',name:'Curve'},{symbol:'LDO-USD',name:'Lido DAO'}
        ]
    },
    commodities: {
        label: 'Materie Prime', pillClass: 'pill-commodities',
        items: [
            {symbol:'GC=F',name:'Oro'},{symbol:'SI=F',name:'Argento'},
            {symbol:'CL=F',name:'Petrolio WTI'},{symbol:'BZ=F',name:'Petrolio Brent'},
            {symbol:'NG=F',name:'Gas Naturale'},{symbol:'HG=F',name:'Rame'},
            {symbol:'ZW=F',name:'Grano'},{symbol:'ZC=F',name:'Mais'},
            {symbol:'PL=F',name:'Platino'},{symbol:'PA=F',name:'Palladio'},
            {symbol:'ZS=F',name:'Soia'},{symbol:'KC=F',name:'Caffè'},
            {symbol:'CT=F',name:'Cotone'},{symbol:'SB=F',name:'Zucchero'},
            {symbol:'CC=F',name:'Cacao'},{symbol:'ZL=F',name:'Olio di Soia'},
            {symbol:'ALI=F',name:'Alluminio'},{symbol:'ZO=F',name:'Avena'}
        ]
    },
    forex: {
        label: 'Forex', pillClass: 'pill-forex',
        items: [
            {symbol:'EURUSD=X',name:'EUR/USD'},{symbol:'GBPUSD=X',name:'GBP/USD'},
            {symbol:'USDJPY=X',name:'USD/JPY'},{symbol:'USDCHF=X',name:'USD/CHF'},
            {symbol:'AUDUSD=X',name:'AUD/USD'},{symbol:'USDCAD=X',name:'USD/CAD'},
            {symbol:'EURGBP=X',name:'EUR/GBP'},{symbol:'EURJPY=X',name:'EUR/JPY'},
            {symbol:'NZDUSD=X',name:'NZD/USD'},{symbol:'GBPJPY=X',name:'GBP/JPY'},
            {symbol:'USDCNY=X',name:'USD/CNY'},{symbol:'USDINR=X',name:'USD/INR'},
            {symbol:'EURCAD=X',name:'EUR/CAD'},{symbol:'GBPAUD=X',name:'GBP/AUD'},
            {symbol:'AUDCAD=X',name:'AUD/CAD'},{symbol:'USDMXN=X',name:'USD/MXN'}
        ]
    },
    indici: {
        label: 'Indici', pillClass: 'pill-indici',
        items: [
            {symbol:'^GSPC',name:'S&P 500'},{symbol:'^IXIC',name:'NASDAQ Composite'},
            {symbol:'^DJI',name:'Dow Jones'},{symbol:'^FTSE',name:'FTSE 100'},
            {symbol:'^GDAXI',name:'DAX 40'},{symbol:'^FCHI',name:'CAC 40'},
            {symbol:'^N225',name:'Nikkei 225'},{symbol:'^HSI',name:'Hang Seng'},
            {symbol:'^STOXX50E',name:'Euro Stoxx 50'},{symbol:'^RUT',name:'Russell 2000'},
            {symbol:'000001.SS',name:'Shanghai Composite'},{symbol:'^BSESN',name:'BSE Sensex'},
            {symbol:'^AXJO',name:'ASX 200'},{symbol:'^TWII',name:'Taiwan Weighted'},
            {symbol:'^KS11',name:'KOSPI'},{symbol:'^NSEI',name:'Nifty 50'},
            {symbol:'^MXX',name:'IPC Mexico'},{symbol:'^BVSP',name:'Bovespa'},
            {symbol:'^AEX',name:'AEX Amsterdam'},{symbol:'^IBEX',name:'IBEX 35'},
            {symbol:'^SSMI',name:'SMI Svizzera'},{symbol:'^TA125.TA',name:'TA-125 Tel Aviv'}
        ]
    }
};

const BORSA_CUSTOM_CATS_KEY = 'rankingCustomCats';

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function baClamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function baIsEquity(symbol) {
    return !(symbol.endsWith('=X') || symbol.endsWith('=F') ||
             symbol.endsWith('-USD') || symbol.startsWith('^') ||
             symbol === '000001.SS');
}

function baToTvSymbol(symbol) {
    const idxMap = {
        '^GSPC':'SP:SPX','^IXIC':'NASDAQ:IXIC','^DJI':'DJ:DJI','^FTSE':'TVC:UKX',
        '^GDAXI':'XETR:DAX','^FCHI':'EURONEXT:PX1','^N225':'TVC:NI225','^HSI':'TVC:HSI',
        '^STOXX50E':'TVC:SX5E','^RUT':'TVC:RUT','^BSESN':'BSE:SENSEX','000001.SS':'SSE:000001'
    };
    if (idxMap[symbol]) return idxMap[symbol];
    const futMap = { 'GC=F':'COMEX:GC1!','SI=F':'COMEX:SI1!','CL=F':'NYMEX:CL1!',
        'BZ=F':'NYMEX:BB1!','NG=F':'NYMEX:NG1!','HG=F':'COMEX:HG1!' };
    if (futMap[symbol]) return futMap[symbol];
    if (symbol.endsWith('=X'))  return 'FX:' + symbol.slice(0, -2);
    if (symbol.endsWith('-USD')) return 'BINANCE:' + symbol.slice(0, -4) + 'USDT';
    if (symbol.endsWith('.MI'))  return 'MIL:'      + symbol.slice(0, -3);
    if (symbol.endsWith('.DE'))  return 'XETR:'     + symbol.slice(0, -3);
    if (symbol.endsWith('.PA'))  return 'EURONEXT:' + symbol.slice(0, -3);
    if (symbol.endsWith('.SW'))  return 'SIX:'      + symbol.slice(0, -3);
    if (symbol.endsWith('.AS'))  return 'EURONEXT:' + symbol.slice(0, -3);
    if (symbol.endsWith('.L'))   return 'LSE:'      + symbol.slice(0, -2);
    if (symbol.endsWith('.SS'))  return 'SSE:'      + symbol.slice(0, -3);
    return symbol;
}

// ─── API ─────────────────────────────────────────────────────────────────────
async function baFetchWithTimeout(url, options, ms) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms || 6000);
    try { return await fetch(url, { ...options, signal: ctrl.signal }); }
    finally { clearTimeout(t); }
}

async function baFetchJson(url, ms) {
    const proxies = [
        url,
        'https://corsproxy.io/?' + encodeURIComponent(url),
        'https://api.allorigins.win/raw?url=' + encodeURIComponent(url)
    ];
    return Promise.any(proxies.map(async u => {
        const res = await baFetchWithTimeout(u, { headers: { Accept: 'application/json' } }, ms || 6000);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const txt = await res.text();
        return JSON.parse(txt.replace(/^﻿/, '').replace(/^\)\]\}',?\s*/, '').trim());
    }));
}

async function baRunWithConcurrency(tasks, limit) {
    const results = new Array(tasks.length).fill(null);
    let idx = 0;
    async function worker() {
        while (idx < tasks.length) {
            const i = idx++;
            try { results[i] = await tasks[i](); } catch (e) { results[i] = null; }
        }
    }
    await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
    return results;
}

async function baFetchPriceHistory(symbol) {
    const url = 'https://query2.finance.yahoo.com/v8/finance/chart/' +
        encodeURIComponent(symbol) + '?interval=1d&range=6mo';
    try {
        const data = await baFetchJson(url, 8000);
        const res = data?.chart?.result?.[0];
        if (!res) return null;
        const raw = res.indicators?.quote?.[0]?.close || [];
        const closes = raw.filter(c => c != null && isFinite(c) && c > 0);
        const currentPrice = res.meta?.regularMarketPrice || (closes.length ? closes[closes.length - 1] : null);
        if (closes.length < 15) return null;
        const meta = res.meta || {};
        const high52w = (meta.fiftyTwoWeekHigh && isFinite(meta.fiftyTwoWeekHigh)) ? meta.fiftyTwoWeekHigh : null;
        const low52w  = (meta.fiftyTwoWeekLow  && isFinite(meta.fiftyTwoWeekLow))  ? meta.fiftyTwoWeekLow  : null;
        const currency = meta.currency || '';
        return { closes, currentPrice, high52w, low52w, currency };
    } catch(e) { return null; }
}

async function baFetchFundamentals(symbol) {
    const url = 'https://query2.finance.yahoo.com/v10/finance/quoteSummary/' +
        encodeURIComponent(symbol) + '?modules=summaryDetail%2CfinancialData';
    try {
        const data = await baFetchJson(url, 9000);
        const res = data?.quoteSummary?.result?.[0];
        if (!res) return null;
        const sd = res.summaryDetail || {};
        const fd = res.financialData || {};
        const raw = v => (v && v.raw != null && isFinite(v.raw)) ? v.raw : null;
        const pe = raw(sd.trailingPE), pb = raw(sd.priceToBook);
        const roe = raw(fd.returnOnEquity), rev = raw(fd.revenueGrowth);
        const eg = raw(fd.earningsGrowth), de = raw(fd.debtToEquity);
        const beta = raw(sd.beta), divYield = raw(sd.dividendYield);
        const profitMargins = raw(fd.profitMargins);
        if (pe === null && pb === null && roe === null && rev === null) return null;
        return { pe, pb, roe, revenueGrowth: rev, earningsGrowth: eg,
            debtToEquity: de, beta, dividendYield: divYield, profitMargins };
    } catch(e) { return null; }
}

async function baFetchNewsSignal(symbol, name) {
    const query = encodeURIComponent(symbol + ' ' + (name || ''));
    const url = 'https://query1.finance.yahoo.com/v1/finance/search?q=' + query + '&quotesCount=0&newsCount=10';
    try {
        const data = await baFetchJson(url, 7000);
        const news = Array.isArray(data?.news) ? data.news.slice(0, 10) : [];
        const ns = baScoreNews3(news);
        return { count: news.length, score: ns.score, sentiment: ns.sentiment,
            topTitle: news[0]?.title || '', topLink: news[0]?.link || '' };
    } catch(e) {
        return { count: 0, score: 5, sentiment: 0, topTitle: '', topLink: '' };
    }
}

// ─── INDICATORI TECNICI ───────────────────────────────────────────────────────
function baCalcRSI(closes, period) {
    period = period || 14;
    if (closes.length < period + 1) return null;
    const chg = closes.map((c, i) => i === 0 ? 0 : c - closes[i - 1]).slice(1);
    let avgG = 0, avgL = 0;
    for (let i = 0; i < period; i++) {
        if (chg[i] > 0) avgG += chg[i]; else avgL += Math.abs(chg[i]);
    }
    avgG /= period; avgL /= period;
    for (let i = period; i < chg.length; i++) {
        avgG = (avgG * (period - 1) + Math.max(0, chg[i])) / period;
        avgL = (avgL * (period - 1) + Math.abs(Math.min(0, chg[i]))) / period;
    }
    if (avgL === 0) return 100;
    return 100 - 100 / (1 + avgG / avgL);
}

function baCalcEMA(closes, period) {
    if (closes.length < period) return null;
    const k = 2 / (period + 1);
    let ema = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
    for (let i = period; i < closes.length; i++) ema = closes[i] * k + ema * (1 - k);
    return ema;
}

function baCalcEMAVector(closes, period) {
    if (closes.length < period) return [];
    const k = 2 / (period + 1);
    let ema = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
    const result = [ema];
    for (let i = period; i < closes.length; i++) {
        ema = closes[i] * k + ema * (1 - k);
        result.push(ema);
    }
    return result;
}

function baCalcMACD(closes) {
    const ema12 = baCalcEMAVector(closes, 12);
    const ema26 = baCalcEMAVector(closes, 26);
    if (!ema12.length || !ema26.length) return null;
    const offset = 14;
    if (ema12.length <= offset) return null;
    const macdArr = [];
    for (let j = 0; j < ema26.length; j++) macdArr.push(ema12[j + offset] - ema26[j]);
    if (macdArr.length < 9) return null;
    const k9 = 2 / 10;
    let sig = macdArr.slice(0, 9).reduce((a, b) => a + b, 0) / 9;
    const sigArr = [sig];
    for (let i = 9; i < macdArr.length; i++) { sig = macdArr[i] * k9 + sig * (1 - k9); sigArr.push(sig); }
    const lastMacd = macdArr[macdArr.length - 1];
    const prevMacd = macdArr.length >= 2 ? macdArr[macdArr.length - 2] : null;
    const lastSig  = sigArr[sigArr.length - 1];
    const prevSig  = sigArr.length >= 2 ? sigArr[sigArr.length - 2] : null;
    const histogram = lastMacd - lastSig;
    const prevHistogram = (prevMacd !== null && prevSig !== null) ? prevMacd - prevSig : null;
    const bullishCross = prevMacd !== null && prevSig !== null && prevMacd < prevSig && lastMacd >= lastSig;
    const bearishCross = prevMacd !== null && prevSig !== null && prevMacd > prevSig && lastMacd <= lastSig;
    return { macdLine: lastMacd, signal: lastSig, histogram, prevHistogram, bullishCross, bearishCross };
}

function baCalcBollinger(closes, period, mult) {
    period = period || 20; mult = mult || 2;
    if (closes.length < period) return null;
    const slice = closes.slice(-period);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((a, c) => a + (c - mean) * (c - mean), 0) / period;
    const std = Math.sqrt(variance);
    if (std === 0) return null;
    const upper = mean + mult * std, lower = mean - mult * std;
    const price = closes[closes.length - 1];
    return { percentB: (price - lower) / (upper - lower), upper, lower, midBand: mean };
}

function baCalcTrendConsistency(closes, n) {
    n = n || 20;
    if (!Array.isArray(closes) || closes.length < n + 1) return null;
    const slice = closes.slice(-n - 1);
    let upDays = 0;
    for (let i = 1; i < slice.length; i++) { if (slice[i] > slice[i - 1]) upDays++; }
    return upDays / n;
}

// ─── SCORING ──────────────────────────────────────────────────────────────────
function baWeightedAvg(pairs) {
    const valid = pairs.filter(([v]) => v !== null && v !== undefined);
    if (!valid.length) return null;
    const totalW = valid.reduce((a, [, w]) => a + w, 0);
    return valid.reduce((a, [v, w]) => a + v * w, 0) / totalW;
}

function baScoreRSI(rsi) {
    if (rsi === null) return 5;
    if (rsi < 20)  return 10; if (rsi < 25)  return 9.5; if (rsi < 30)  return 9;
    if (rsi < 35)  return 8;  if (rsi < 40)  return 7;   if (rsi < 45)  return 6;
    if (rsi < 55)  return 5;  if (rsi < 60)  return 4;   if (rsi < 65)  return 3.5;
    if (rsi < 70)  return 2.5; if (rsi < 75) return 2;
    return 1.5;
}
function baScoreMA(price, ma20, ma50) {
    if (!ma20 || !ma50 || !price) return 5;
    let s = 5;
    if (price > ma50) s += 1.5; else s -= 1.5;
    if (ma20  > ma50) s += 1.5; else s -= 1.5;
    if (price < ma20 && price > ma50 && ma20 > ma50) s += 1;
    return Math.max(0, Math.min(10, s));
}
function baScoreMACD(macd) {
    if (!macd) return 5;
    let s = 5;
    if (macd.histogram > 0) s += 1.5; else if (macd.histogram < 0) s -= 1.5;
    if (macd.prevHistogram !== null) {
        const growing = macd.histogram > macd.prevHistogram;
        if (macd.histogram > 0 &&  growing) s += 0.8;
        if (macd.histogram < 0 && !growing) s -= 0.8;
    }
    if (macd.bullishCross) s += 1.2;
    if (macd.bearishCross) s -= 1.2;
    return Math.max(0, Math.min(10, s));
}
function baScoreBollinger(percentB) {
    if (percentB === null || percentB === undefined || !isFinite(percentB)) return 5;
    if (percentB < 0)    return 8.5; if (percentB < 0.15) return 7.5;
    if (percentB < 0.30) return 6.5; if (percentB < 0.50) return 5.5;
    if (percentB < 0.70) return 5;   if (percentB < 0.85) return 4;
    if (percentB < 1.00) return 3;
    return 2.5;
}
function baScoreTrendConsistency(ratio) {
    if (ratio === null || !isFinite(ratio)) return null;
    if (ratio > 0.68) return 8.5; if (ratio > 0.58) return 7.5;
    if (ratio > 0.50) return 6.2; if (ratio > 0.42) return 5.0;
    if (ratio > 0.32) return 3.5;
    return 2.0;
}
function baScorePE(pe) {
    if (pe === null || pe <= 0) return null;
    if (pe < 8)  return 9.5; if (pe < 12) return 8.5; if (pe < 15) return 7.5;
    if (pe < 20) return 6.5; if (pe < 25) return 5.5; if (pe < 30) return 4.5;
    if (pe < 40) return 3.5; if (pe < 55) return 2.5;
    return 1.5;
}
function baScorePEG(peg) {
    if (peg === null || peg <= 0 || !isFinite(peg)) return null;
    if (peg < 0.5) return 9.5; if (peg < 1.0) return 8.5; if (peg < 1.5) return 7;
    if (peg < 2.0) return 5.5; if (peg < 3.0) return 3.5;
    return 2;
}
function baScorePB(pb) {
    if (pb === null) return null;
    if (pb < 0) return 7; if (pb < 1) return 9; if (pb < 2) return 7.5;
    if (pb < 4) return 6; if (pb < 7) return 4.5; if (pb < 12) return 3;
    return 2;
}
function baScoreROE(roe) {
    if (roe === null) return null;
    const r = roe * 100;
    if (r > 30) return 9; if (r > 20) return 8; if (r > 15) return 7;
    if (r > 10) return 6; if (r > 5)  return 5; if (r > 0)  return 3.5;
    return 2;
}
function baScoreGrowth(g) {
    if (g === null) return null;
    const p = g * 100;
    if (p > 30) return 9.5; if (p > 20) return 8.5; if (p > 10) return 7.5;
    if (p > 5)  return 6.5; if (p > 0)  return 5.5; if (p > -5) return 4.5;
    if (p > -10) return 3.5;
    return 2;
}
function baScoreDebt(de_raw) {
    if (de_raw === null || de_raw < 0) return null;
    const r = de_raw > 5 ? de_raw / 100 : de_raw;
    if (r < 0.2) return 9; if (r < 0.5) return 7.5; if (r < 1.0) return 6;
    if (r < 1.5) return 5; if (r < 2.5) return 3.5; if (r < 4.0) return 2.5;
    return 1.5;
}
function baScoreProfitMargin(margin) {
    if (margin === null || !isFinite(margin)) return null;
    const p = margin * 100;
    if (p > 30) return 9.5; if (p > 20) return 8; if (p > 10) return 7;
    if (p > 5)  return 5.5; if (p > 0)  return 4;
    return 2;
}
function baScoreVolatility(volPct) {
    if (volPct === null || !isFinite(volPct)) return null;
    if (volPct < 18) return 8.8; if (volPct < 25) return 8.0;
    if (volPct < 35) return 7.0; if (volPct < 50) return 5.8;
    if (volPct < 70) return 4.2; if (volPct < 95) return 3.0;
    return 2.0;
}
function baScoreDrawdown(ddPct) {
    if (ddPct === null || !isFinite(ddPct)) return null;
    if (ddPct < 8)  return 9.0; if (ddPct < 15) return 8.0;
    if (ddPct < 22) return 7.0; if (ddPct < 30) return 5.7;
    if (ddPct < 40) return 4.5; if (ddPct < 55) return 3.2;
    return 2.0;
}
function baScoreLiquidity(avgAbsRet, beta) {
    let s = 5;
    if (avgAbsRet !== null && isFinite(avgAbsRet)) {
        const d = avgAbsRet * 100;
        if (d < 1.2) s += 2; else if (d < 2.0) s += 1.3;
        else if (d < 3.5) s += 0.5; else if (d < 5.5) s -= 0.7; else s -= 1.5;
    }
    if (beta !== null && isFinite(beta)) {
        if (beta < 0.8) s += 0.4; else if (beta > 1.8) s -= 0.6;
    }
    return baClamp(s, 1.5, 9.5);
}

// ─── RISK & MOMENTUM ─────────────────────────────────────────────────────────
function baAvgAbsDailyReturn(closes, lookback) {
    if (!Array.isArray(closes) || closes.length < 3) return null;
    const n = Math.min(lookback || 63, closes.length - 1);
    if (n < 2) return null;
    let sum = 0, cnt = 0;
    for (let i = closes.length - n; i < closes.length; i++) {
        const p0 = closes[i - 1], p1 = closes[i];
        if (!p0 || !p1) continue;
        sum += Math.abs((p1 - p0) / p0); cnt++;
    }
    return cnt ? (sum / cnt) : null;
}
function baCalcAnnualVolatility(closes, lookback) {
    if (!Array.isArray(closes) || closes.length < 4) return null;
    const n = Math.min(lookback || 63, closes.length - 1);
    if (n < 3) return null;
    const rets = [];
    for (let i = closes.length - n; i < closes.length; i++) {
        const p0 = closes[i - 1], p1 = closes[i];
        if (!p0 || !p1) continue;
        rets.push((p1 - p0) / p0);
    }
    if (rets.length < 3) return null;
    const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
    const variance = rets.reduce((a, r) => a + (r - mean) * (r - mean), 0) / (rets.length - 1);
    return Math.sqrt(Math.max(0, variance)) * Math.sqrt(252) * 100;
}
function baCalcMaxDrawdown(closes) {
    if (!Array.isArray(closes) || closes.length < 2) return null;
    let peak = closes[0], maxDd = 0;
    for (let i = 1; i < closes.length; i++) {
        const p = closes[i];
        if (!p || !isFinite(p)) continue;
        if (p > peak) peak = p;
        if (peak > 0) { const dd = ((peak - p) / peak) * 100; if (dd > maxDd) maxDd = dd; }
    }
    return maxDd;
}
function baCalcMomentumPct(closes, bars) {
    if (!Array.isArray(closes) || closes.length < 2 || closes.length <= bars) return null;
    const end = closes[closes.length - 1], start = closes[closes.length - 1 - bars];
    if (!end || !start) return null;
    return ((end - start) / start) * 100;
}

// ─── NEWS A3 ─────────────────────────────────────────────────────────────────
const BA_NEWS_POS = [
    'beat','beats','upgrade','outperform','growth','record','partnership','contract',
    'surge','strong','raises','expands','profit','breakthrough','acquisition','buyback',
    'dividend','approval','launch','wins','rally','positive','bullish','recovery',
    'rebound','revenue','momentum','exceeds','guidance raised'
];
const BA_NEWS_NEG = [
    'downgrade','miss','misses','cuts','cut','lawsuit','probe','investigation',
    'decline','drop','warning','fraud','loss','bankruptcy','layoffs','recall',
    'fine','penalty','crash','tumbles','falls','bearish','sell-off','concern',
    'halt','suspension','scandal','collapse','tariff','sanctions',
    'below expectations','guidance cut','writedown','impairment'
];
function baScoreNews3(news) {
    if (!Array.isArray(news) || !news.length) return { score: 5, sentiment: 0 };
    const nowSec = Date.now() / 1000;
    let sentiment = 0;
    for (const item of news) {
        const title = String(item?.title || '').toLowerCase();
        if (!title) continue;
        let raw = 0;
        BA_NEWS_POS.forEach(w => { if (title.includes(w)) raw += 1; });
        BA_NEWS_NEG.forEach(w => { if (title.includes(w)) raw -= 1; });
        if (raw === 0) continue;
        const ageDays = Math.max(0, (nowSec - (item?.providerPublishTime || nowSec)) / 86400);
        const weight = ageDays < 1 ? 1.3 : ageDays < 3 ? 1.0 : ageDays < 7 ? 0.65 : 0.35;
        sentiment += raw * weight;
    }
    return { score: baClamp(5 + (sentiment / Math.max(2, news.length)) * 2.0, 1.5, 9.0), sentiment };
}

// ─── CALCOLO SCORE COMPLESSIVI ────────────────────────────────────────────────

// Tecnico Analisi 3 (con Trend Consistency)
function baCalcTechScore3(closes, currentPrice) {
    const rsi   = baCalcRSI(closes);
    const ma20  = baCalcEMA(closes, 20);
    const ma50  = baCalcEMA(closes, 50);
    const macd  = baCalcMACD(closes);
    const boll  = baCalcBollinger(closes);
    const trendR = baCalcTrendConsistency(closes, 20);
    const score = baWeightedAvg([
        [baScoreRSI(rsi),              0.28],
        [baScoreMA(currentPrice, ma20, ma50), 0.22],
        [baScoreMACD(macd),            0.22],
        [baScoreBollinger(boll ? boll.percentB : null), 0.18],
        [baScoreTrendConsistency(trendR), 0.10]
    ]) ?? 5;
    return { score, rsi, ma20, ma50, currentPrice, macd, boll, trendR };
}

// Fondamentale Analisi 3 (debito pesato 20%)
function baCalcFundScore3(fund) {
    if (!fund) return null;
    const growth = fund.revenueGrowth ?? fund.earningsGrowth;
    let peg = null;
    if (fund.pe !== null && fund.pe > 0 && fund.earningsGrowth !== null && fund.earningsGrowth > 0)
        peg = fund.pe / (fund.earningsGrowth * 100);
    const sVal = peg !== null ? baScorePEG(peg) : baScorePE(fund.pe);
    const score = baWeightedAvg([
        [sVal,                            0.25],
        [baScoreROE(fund.roe),            0.20],
        [baScoreGrowth(growth),           0.15],
        [baScoreProfitMargin(fund.profitMargins), 0.12],
        [baScorePB(fund.pb),              0.08],
        [baScoreDebt(fund.debtToEquity),  0.20]
    ]);
    return score !== null ? { score, data: fund, peg } : null;
}

// Score Analisi 3 completo
function baCalcAnalysis3Score(tech3, fund3, equity, closes, beta, news) {
    const vol         = baCalcAnnualVolatility(closes, 63);
    const drawdown    = baCalcMaxDrawdown(closes);
    const mom1m       = baCalcMomentumPct(closes, 22);
    const mom3m       = baCalcMomentumPct(closes, 66);
    const mom6m       = baCalcMomentumPct(closes, 126);
    const avgAbsRet   = baAvgAbsDailyReturn(closes, 63);
    const riskScore   = baWeightedAvg([
        [baScoreVolatility(vol), 0.45],
        [baScoreDrawdown(drawdown), 0.35],
        [baScoreLiquidity(avgAbsRet, beta), 0.20]
    ]) ?? 5;
    // Momentum 3 timeframe
    let momScore = 5;
    if (mom6m !== null && isFinite(mom6m)) {
        if (mom6m > 30) momScore += 1.0; else if (mom6m > 15) momScore += 0.7;
        else if (mom6m > 0) momScore += 0.3; else if (mom6m > -15) momScore -= 0.5; else momScore -= 1.2;
    }
    if (mom3m !== null && isFinite(mom3m)) {
        if (mom3m > 20) momScore += 0.6; else if (mom3m > 10) momScore += 1.0;
        else if (mom3m > 0) momScore += 0.4; else if (mom3m > -10) momScore -= 0.4; else momScore -= 1.0;
    }
    if (mom1m !== null && isFinite(mom1m)) {
        if (mom1m < -20) momScore += 0.4; else if (mom1m < -5) momScore += 0.1;
        else if (mom1m < 0) momScore -= 0.1; else if (mom1m < 10) momScore += 0.3;
        else if (mom1m < 25) momScore += 0.1; else momScore -= 0.4;
    }
    momScore = baClamp(momScore, 0, 10);
    const newsScore = news?.score ?? 5;
    // Azioni: Tech25% Fund27% Rischio22% Momentum16% News10%
    // Non-azioni: Tech42% Rischio26% Momentum22% News10%
    const basePairs = equity
        ? [[tech3?.score ?? null, 0.25], [fund3?.score ?? null, 0.27],
           [riskScore, 0.22], [momScore, 0.16], [newsScore, 0.10]]
        : [[tech3?.score ?? null, 0.42], [riskScore, 0.26],
           [momScore, 0.22], [newsScore, 0.10]];
    const score10 = baWeightedAvg(basePairs) ?? 5;
    const overall = baClamp(score10 * 10, 0, 100);
    const confidence = Math.round((basePairs.filter(([v]) => v !== null).length / basePairs.length) * 100);
    return { overall, riskScore, momScore, newsScore, vol, drawdown, mom1m, mom3m, mom6m, confidence };
}

// ─── SEGNALE 5 LIVELLI ────────────────────────────────────────────────────────
function baGetSignal(sc) {
    if (sc >= 72) return { cls: 'signal-strong-buy', txt: 'Forte Acquisto', short: 'Forte Acq.' };
    if (sc >= 58) return { cls: 'signal-buy',        txt: 'Acquisto',       short: 'Acquisto'   };
    if (sc >= 44) return { cls: 'signal-neutral',    txt: 'Neutro',         short: 'Neutro'     };
    if (sc >= 30) return { cls: 'signal-warn',       txt: 'Attenzione',     short: 'Attenzione' };
    return              { cls: 'signal-caution',     txt: 'Forte Attenzione', short: 'Forte Att.' };
}

// ─── TREND & WARNINGS ────────────────────────────────────────────────────────
function baGetTrend(price, ma20, ma50) {
    if (!ma20 || !ma50 || !price) return null;
    const aM20 = price > ma20, aM50 = price > ma50, m20gM50 = ma20 > ma50;
    if ( m20gM50 &&  aM20)           return { arrow:'↑', cls:'trend-up',      title:'Trend rialzista' };
    if ( m20gM50 && !aM20 &&  aM50) return { arrow:'↗', cls:'trend-up-weak', title:'Uptrend con correzione' };
    if (!m20gM50 &&  aM50)           return { arrow:'→', cls:'trend-neutral', title:'Laterale' };
    if (!m20gM50 &&  aM20 && !aM50) return { arrow:'↘', cls:'trend-down-weak', title:'Rimbalzo in downtrend' };
    return                            { arrow:'↓', cls:'trend-down',     title:'Trend ribassista' };
}

function baGetWarnings(rsi, currentPrice, high52w, low52w, beta, dividendYield) {
    const warns = [];
    if (rsi != null) {
        if (rsi < 25)      warns.push({ cls:'wb-green',  text:'RSI basso', title:'RSI ' + rsi.toFixed(1) + ' — possibile ipervenduto' });
        else if (rsi > 75) warns.push({ cls:'wb-red',    text:'RSI alto',  title:'RSI ' + rsi.toFixed(1) + ' — possibile ipercomprato' });
    }
    if (currentPrice && high52w && currentPrice / high52w >= 0.97)
        warns.push({ cls:'wb-yellow', text:'↑ Max 52w', title:'Vicino al massimo annuale' });
    if (currentPrice && low52w && currentPrice / low52w <= 1.05)
        warns.push({ cls:'wb-yellow', text:'↓ Min 52w', title:'Vicino al minimo annuale' });
    if (beta && beta > 1.8) warns.push({ cls:'wb-orange', text:'β ' + beta.toFixed(1), title:'Alta volatilità' });
    if (dividendYield && dividendYield > 0.025)
        warns.push({ cls:'wb-blue', text:'Div ' + (dividendYield * 100).toFixed(1) + '%', title:'Rendimento dividendo elevato' });
    return warns;
}

// ─── RUNNER BASKET (Analisi 3 completa) ──────────────────────────────────────
async function baAnalyzeBasket(items, onProgress) {
    const tasks = items.map(asset => async () => {
        try {
            const equity = baIsEquity(asset.symbol);
            const [priceData, fundData, news] = await Promise.all([
                baFetchPriceHistory(asset.symbol),
                equity ? baFetchFundamentals(asset.symbol) : Promise.resolve(null),
                baFetchNewsSignal(asset.symbol, asset.name)
            ]);
            if (onProgress) onProgress();
            if (!priceData) return null;
            const tech3 = baCalcTechScore3(priceData.closes, priceData.currentPrice);
            const fund3 = baCalcFundScore3(fundData);
            const adv3  = baCalcAnalysis3Score(tech3, fund3, equity, priceData.closes, fundData?.beta ?? null, news);
            const sig   = baGetSignal(adv3.overall);
            return {
                symbol: asset.symbol,
                name:   asset.name,
                score:  adv3.overall,
                signal: sig,
                rsi:    tech3.rsi,
                trend:  baGetTrend(priceData.currentPrice, tech3.ma20, tech3.ma50),
                tech:   tech3.score,
                fund:   fund3?.score ?? null,
                risk:   adv3.riskScore,
                mom:    adv3.momScore,
                news:   news,
                adv3,
                currentPrice: priceData.currentPrice,
                currency:     priceData.currency || '',
                high52w:      priceData.high52w,
                low52w:       priceData.low52w,
                beta:         fundData?.beta ?? null,
                dividendYield: fundData?.dividendYield ?? null,
                equity,
                warnings: baGetWarnings(tech3.rsi, priceData.currentPrice, priceData.high52w,
                    priceData.low52w, fundData?.beta ?? null, fundData?.dividendYield ?? null)
            };
        } catch(e) {
            if (onProgress) onProgress();
            return null;
        }
    });
    return (await baRunWithConcurrency(tasks, 6)).filter(Boolean);
}
