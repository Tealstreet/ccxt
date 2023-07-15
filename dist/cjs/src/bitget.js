'use strict';

var Exchange = require('./base/Exchange.js');
var errors = require('./base/errors.js');
var Precise = require('./base/Precise.js');
var number = require('./base/functions/number.js');

//  ---------------------------------------------------------------------------
//  ---------------------------------------------------------------------------
class bitget extends Exchange["default"] {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bitget',
            'name': 'Bitget',
            'countries': ['SG'],
            'version': 'v1',
            'rateLimit': 50,
            'certified': true,
            'pro': true,
            'userAgent': undefined,
            'origin': 'https://open-api.bingx.com',
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': false,
                'swap': true,
                'future': false,
                'option': false,
                'addMargin': true,
                'cancelAllOrders': true,
                'cancelOrder': true,
                'cancelOrders': true,
                'createOrder': true,
                'createReduceOnlyOrder': false,
                'fetchAccounts': false,
                'fetchBalance': true,
                'fetchBorrowRate': false,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchBorrowRates': false,
                'fetchBorrowRatesPerSymbol': false,
                'fetchClosedOrders': true,
                'fetchCurrencies': true,
                'fetchDepositAddress': true,
                'fetchDepositAddresses': false,
                'fetchDeposits': true,
                'fetchFundingHistory': false,
                'fetchFundingRate': true,
                'fetchFundingRateHistory': true,
                'fetchFundingRates': false,
                'fetchIndexOHLCV': false,
                'fetchLedger': true,
                'fetchLeverage': true,
                'fetchLeverageTiers': false,
                'fetchMarginMode': undefined,
                'fetchMarketLeverageTiers': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenInterest': true,
                'fetchOpenInterestHistory': false,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrderTrades': true,
                'fetchPosition': true,
                'fetchPositionMode': false,
                'fetchPositions': true,
                'fetchPositionsRisk': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': true,
                'fetchTrades': true,
                'fetchTradingFee': true,
                'fetchTradingFees': true,
                'fetchTransfer': false,
                'fetchTransfers': undefined,
                'fetchWithdrawal': false,
                'fetchWithdrawals': true,
                'reduceMargin': true,
                'setLeverage': true,
                'setMarginMode': true,
                'setPositionMode': false,
                'transfer': true,
                'withdraw': false,
            },
            'timeframes': {
                '1m': '1m',
                '5m': '5m',
                '15m': '15m',
                '30m': '30m',
                '1h': '1h',
                '4h': '4h',
                '6h': '6h',
                '12h': '12h',
                '1d': '1d',
                '3d': '3d',
                '1w': '1w',
                '1M': '1M',
            },
            'hostname': 'bitget.com',
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/195989417-4253ddb0-afbe-4a1c-9dea-9dbcd121fa5d.jpg',
                'api': {
                    'spot': 'https://api.{hostname}',
                    'mix': 'https://api.{hostname}',
                },
                'www': 'https://www.bitget.com',
                'doc': [
                    'https://bitgetlimited.github.io/apidoc/en/mix',
                    'https://bitgetlimited.github.io/apidoc/en/spot',
                    'https://bitgetlimited.github.io/apidoc/en/broker',
                ],
                'fees': 'https://www.bitget.cc/zh-CN/rate?tab=1',
                'referral': 'https://www.bitget.com/expressly?languageType=0&channelCode=ccxt&vipCode=tg9j',
            },
            'api': {
                'public': {
                    'spot': {
                        'get': {
                            'public/time': 1,
                            'public/currencies': 1,
                            'public/products': 1,
                            'public/product': 1,
                            'market/ticker': 1,
                            'market/tickers': 1,
                            'market/fills': 1,
                            'market/candles': 1,
                            'market/depth': 1,
                        },
                    },
                    'mix': {
                        'get': {
                            'market/contracts': 1,
                            'market/depth': 1,
                            'market/ticker': 1,
                            'market/tickers': 1,
                            'market/fills': 1,
                            'market/candles': 1,
                            'market/index': 1,
                            'market/funding-time': 1,
                            'market/history-fundRate': 1,
                            'market/current-fundRate': 1,
                            'market/open-interest': 1,
                            'market/mark-price': 1,
                            'market/symbol-leverage': 1,
                        },
                    },
                },
                'private': {
                    'spot': {
                        'get': {
                            'account/getInfo': 20,
                            'account/assets': 2,
                            'account/transferRecords': 4,
                            'wallet/deposit-address': 4,
                            'wallet/withdrawal-inner': 4,
                            'wallet/withdrawal-list': 1,
                            'wallet/deposit-list': 1,
                        },
                        'post': {
                            'account/bills': 2,
                            'account/sub-account-spot-assets': 200,
                            'trade/orders': 2,
                            'trade/batch-orders': 4,
                            'trade/cancel-order': 2,
                            'trade/cancel-batch-orders': 4,
                            'trade/orderInfo': 1,
                            'trade/open-orders': 1,
                            'trade/history': 1,
                            'trade/fills': 1,
                            'wallet/transfer': 4,
                            'wallet/withdrawal': 4,
                            'wallet/subTransfer': 10,
                        },
                    },
                    'mix': {
                        'get': {
                            'account/account': 2,
                            'account/accounts': 2,
                            'account/open-count': 1,
                            'order/current': 2,
                            'order/history': 2,
                            'order/detail': 2,
                            'order/fills': 2,
                            'order/historyProductType': 8,
                            'order/allFills': 2,
                            'plan/currentPlan': 2,
                            'plan/historyPlan': 2,
                            'position/singlePosition': 2,
                            'position/allPosition': 2,
                            'trace/currentTrack': 2,
                            'trace/followerOrder': 2,
                            'trace/historyTrack': 2,
                            'trace/summary': 2,
                            'trace/profitSettleTokenIdGroup': 2,
                            'trace/profitDateGroupList': 2,
                            'trade/profitDateList': 2,
                            'trace/waitProfitDateList': 2,
                            'trace/traderSymbols': 2,
                            'order/marginCoinCurrent': 2,
                        },
                        'post': {
                            'account/setLeverage': 8,
                            'account/setPositionMode': 8,
                            'account/setMargin': 8,
                            'account/setMarginMode': 8,
                            'order/placeOrder': 2,
                            'order/batch-orders': 2,
                            'order/cancel-order': 2,
                            'order/cancel-all-orders': 2,
                            'order/cancel-batch-orders': 2,
                            'plan/placePlan': 2,
                            'plan/modifyPlan': 2,
                            'plan/modifyPlanPreset': 2,
                            'plan/placeTPSL': 2,
                            'plan/placePositionsTPSL': 2,
                            'plan/modifyTPSLPlan': 2,
                            'plan/cancelPlan': 2,
                            'plan/cancelAllPlan': 2,
                            'trace/closeTrackOrder': 2,
                            'trace/setUpCopySymbols': 2,
                        },
                    },
                },
            },
            'fees': {
                'spot': {
                    'taker': this.parseNumber('0.002'),
                    'maker': this.parseNumber('0.002'),
                },
                'swap': {
                    'taker': this.parseNumber('0.0006'),
                    'maker': this.parseNumber('0.0004'),
                },
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
                'password': true,
            },
            'exceptions': {
                // http error codes
                // 400 Bad Request — Invalid request format
                // 401 Unauthorized — Invalid API Key
                // 403 Forbidden — You do not have access to the requested resource
                // 404 Not Found
                // 500 Internal Server Error — We had a problem with our server
                'exact': {
                    '1': errors.ExchangeError,
                    // undocumented
                    'failure to get a peer from the ring-balancer': errors.ExchangeNotAvailable,
                    '4010': errors.PermissionDenied,
                    // common
                    // '0': ExchangeError, // 200 successful,when the order placement / cancellation / operation is successful
                    '4001': errors.ExchangeError,
                    '4002': errors.ExchangeError,
                    // --------------------------------------------------------
                    '30001': errors.AuthenticationError,
                    '30002': errors.AuthenticationError,
                    '30003': errors.AuthenticationError,
                    '30004': errors.AuthenticationError,
                    '30005': errors.InvalidNonce,
                    '30006': errors.AuthenticationError,
                    '30007': errors.BadRequest,
                    '30008': errors.RequestTimeout,
                    '30009': errors.ExchangeError,
                    '30010': errors.AuthenticationError,
                    '30011': errors.PermissionDenied,
                    '30012': errors.AuthenticationError,
                    '30013': errors.AuthenticationError,
                    '30014': errors.DDoSProtection,
                    '30015': errors.AuthenticationError,
                    '30016': errors.ExchangeError,
                    '30017': errors.ExchangeError,
                    '30018': errors.ExchangeError,
                    '30019': errors.ExchangeNotAvailable,
                    '30020': errors.BadRequest,
                    '30021': errors.BadRequest,
                    '30022': errors.PermissionDenied,
                    '30023': errors.BadRequest,
                    '30024': errors.BadSymbol,
                    '30025': errors.BadRequest,
                    '30026': errors.DDoSProtection,
                    '30027': errors.AuthenticationError,
                    '30028': errors.PermissionDenied,
                    '30029': errors.AccountSuspended,
                    '30030': errors.ExchangeError,
                    '30031': errors.BadRequest,
                    '30032': errors.BadSymbol,
                    '30033': errors.BadRequest,
                    '30034': errors.ExchangeError,
                    '30035': errors.ExchangeError,
                    '30036': errors.ExchangeError,
                    '30037': errors.ExchangeNotAvailable,
                    // '30038': AuthenticationError, // { "code": 30038, "message": "user does not exist" }
                    '30038': errors.OnMaintenance,
                    // futures
                    '32001': errors.AccountSuspended,
                    '32002': errors.PermissionDenied,
                    '32003': errors.CancelPending,
                    '32004': errors.ExchangeError,
                    '32005': errors.InvalidOrder,
                    '32006': errors.InvalidOrder,
                    '32007': errors.InvalidOrder,
                    '32008': errors.InvalidOrder,
                    '32009': errors.InvalidOrder,
                    '32010': errors.ExchangeError,
                    '32011': errors.ExchangeError,
                    '32012': errors.ExchangeError,
                    '32013': errors.ExchangeError,
                    '32014': errors.ExchangeError,
                    '32015': errors.ExchangeError,
                    '32016': errors.ExchangeError,
                    '32017': errors.ExchangeError,
                    '32018': errors.ExchangeError,
                    '32019': errors.ExchangeError,
                    '32020': errors.ExchangeError,
                    '32021': errors.ExchangeError,
                    '32022': errors.ExchangeError,
                    '32023': errors.ExchangeError,
                    '32024': errors.ExchangeError,
                    '32025': errors.ExchangeError,
                    '32026': errors.ExchangeError,
                    '32027': errors.ExchangeError,
                    '32028': errors.AccountSuspended,
                    '32029': errors.ExchangeError,
                    '32030': errors.InvalidOrder,
                    '32031': errors.ArgumentsRequired,
                    '32038': errors.AuthenticationError,
                    '32040': errors.ExchangeError,
                    '32044': errors.ExchangeError,
                    '32045': errors.ExchangeError,
                    '32046': errors.ExchangeError,
                    '32047': errors.ExchangeError,
                    '32048': errors.InvalidOrder,
                    '32049': errors.ExchangeError,
                    '32050': errors.InvalidOrder,
                    '32051': errors.InvalidOrder,
                    '32052': errors.ExchangeError,
                    '32053': errors.ExchangeError,
                    '32057': errors.ExchangeError,
                    '32054': errors.ExchangeError,
                    '32055': errors.InvalidOrder,
                    '32056': errors.ExchangeError,
                    '32058': errors.ExchangeError,
                    '32059': errors.InvalidOrder,
                    '32060': errors.InvalidOrder,
                    '32061': errors.InvalidOrder,
                    '32062': errors.InvalidOrder,
                    '32063': errors.InvalidOrder,
                    '32064': errors.ExchangeError,
                    '32065': errors.ExchangeError,
                    '32066': errors.ExchangeError,
                    '32067': errors.ExchangeError,
                    '32068': errors.ExchangeError,
                    '32069': errors.ExchangeError,
                    '32070': errors.ExchangeError,
                    '32071': errors.ExchangeError,
                    '32072': errors.ExchangeError,
                    '32073': errors.ExchangeError,
                    '32074': errors.ExchangeError,
                    '32075': errors.ExchangeError,
                    '32076': errors.ExchangeError,
                    '32077': errors.ExchangeError,
                    '32078': errors.ExchangeError,
                    '32079': errors.ExchangeError,
                    '32080': errors.ExchangeError,
                    '32083': errors.ExchangeError,
                    // token and margin trading
                    '33001': errors.PermissionDenied,
                    '33002': errors.AccountSuspended,
                    '33003': errors.InsufficientFunds,
                    '33004': errors.ExchangeError,
                    '33005': errors.ExchangeError,
                    '33006': errors.ExchangeError,
                    '33007': errors.ExchangeError,
                    '33008': errors.InsufficientFunds,
                    '33009': errors.ExchangeError,
                    '33010': errors.ExchangeError,
                    '33011': errors.ExchangeError,
                    '33012': errors.ExchangeError,
                    '33013': errors.InvalidOrder,
                    '33014': errors.OrderNotFound,
                    '33015': errors.InvalidOrder,
                    '33016': errors.ExchangeError,
                    '33017': errors.InsufficientFunds,
                    '33018': errors.ExchangeError,
                    '33020': errors.ExchangeError,
                    '33021': errors.BadRequest,
                    '33022': errors.InvalidOrder,
                    '33023': errors.ExchangeError,
                    '33024': errors.InvalidOrder,
                    '33025': errors.InvalidOrder,
                    '33026': errors.ExchangeError,
                    '33027': errors.InvalidOrder,
                    '33028': errors.InvalidOrder,
                    '33029': errors.InvalidOrder,
                    '33034': errors.ExchangeError,
                    '33035': errors.ExchangeError,
                    '33036': errors.ExchangeError,
                    '33037': errors.ExchangeError,
                    '33038': errors.ExchangeError,
                    '33039': errors.ExchangeError,
                    '33040': errors.ExchangeError,
                    '33041': errors.ExchangeError,
                    '33042': errors.ExchangeError,
                    '33043': errors.ExchangeError,
                    '33044': errors.ExchangeError,
                    '33045': errors.ExchangeError,
                    '33046': errors.ExchangeError,
                    '33047': errors.ExchangeError,
                    '33048': errors.ExchangeError,
                    '33049': errors.ExchangeError,
                    '33050': errors.ExchangeError,
                    '33051': errors.ExchangeError,
                    '33059': errors.BadRequest,
                    '33060': errors.BadRequest,
                    '33061': errors.ExchangeError,
                    '33062': errors.ExchangeError,
                    '33063': errors.ExchangeError,
                    '33064': errors.ExchangeError,
                    '33065': errors.ExchangeError,
                    // account
                    '21009': errors.ExchangeError,
                    '34001': errors.PermissionDenied,
                    '34002': errors.InvalidAddress,
                    '34003': errors.ExchangeError,
                    '34004': errors.ExchangeError,
                    '34005': errors.ExchangeError,
                    '34006': errors.ExchangeError,
                    '34007': errors.ExchangeError,
                    '34008': errors.InsufficientFunds,
                    '34009': errors.ExchangeError,
                    '34010': errors.ExchangeError,
                    '34011': errors.ExchangeError,
                    '34012': errors.ExchangeError,
                    '34013': errors.ExchangeError,
                    '34014': errors.ExchangeError,
                    '34015': errors.ExchangeError,
                    '34016': errors.PermissionDenied,
                    '34017': errors.AccountSuspended,
                    '34018': errors.AuthenticationError,
                    '34019': errors.PermissionDenied,
                    '34020': errors.PermissionDenied,
                    '34021': errors.InvalidAddress,
                    '34022': errors.ExchangeError,
                    '34023': errors.PermissionDenied,
                    '34026': errors.ExchangeError,
                    '34036': errors.ExchangeError,
                    '34037': errors.ExchangeError,
                    '34038': errors.ExchangeError,
                    '34039': errors.ExchangeError,
                    // swap
                    '35001': errors.ExchangeError,
                    '35002': errors.ExchangeError,
                    '35003': errors.ExchangeError,
                    '35004': errors.ExchangeError,
                    '35005': errors.AuthenticationError,
                    '35008': errors.InvalidOrder,
                    '35010': errors.InvalidOrder,
                    '35012': errors.InvalidOrder,
                    '35014': errors.InvalidOrder,
                    '35015': errors.InvalidOrder,
                    '35017': errors.ExchangeError,
                    '35019': errors.InvalidOrder,
                    '35020': errors.InvalidOrder,
                    '35021': errors.InvalidOrder,
                    '35022': errors.ExchangeError,
                    '35024': errors.ExchangeError,
                    '35025': errors.InsufficientFunds,
                    '35026': errors.ExchangeError,
                    '35029': errors.OrderNotFound,
                    '35030': errors.InvalidOrder,
                    '35031': errors.InvalidOrder,
                    '35032': errors.ExchangeError,
                    '35037': errors.ExchangeError,
                    '35039': errors.ExchangeError,
                    '35040': errors.InvalidOrder,
                    '35044': errors.ExchangeError,
                    '35046': errors.InsufficientFunds,
                    '35047': errors.InsufficientFunds,
                    '35048': errors.ExchangeError,
                    '35049': errors.InvalidOrder,
                    '35050': errors.InvalidOrder,
                    '35052': errors.InsufficientFunds,
                    '35053': errors.ExchangeError,
                    '35055': errors.InsufficientFunds,
                    '35057': errors.ExchangeError,
                    '35058': errors.ExchangeError,
                    '35059': errors.BadRequest,
                    '35060': errors.BadRequest,
                    '35061': errors.BadRequest,
                    '35062': errors.InvalidOrder,
                    '35063': errors.InvalidOrder,
                    '35064': errors.InvalidOrder,
                    '35066': errors.InvalidOrder,
                    '35067': errors.InvalidOrder,
                    '35068': errors.InvalidOrder,
                    '35069': errors.InvalidOrder,
                    '35070': errors.InvalidOrder,
                    '35071': errors.InvalidOrder,
                    '35072': errors.InvalidOrder,
                    '35073': errors.InvalidOrder,
                    '35074': errors.InvalidOrder,
                    '35075': errors.InvalidOrder,
                    '35076': errors.InvalidOrder,
                    '35077': errors.InvalidOrder,
                    '35078': errors.InvalidOrder,
                    '35079': errors.InvalidOrder,
                    '35080': errors.InvalidOrder,
                    '35081': errors.InvalidOrder,
                    '35082': errors.InvalidOrder,
                    '35083': errors.InvalidOrder,
                    '35084': errors.InvalidOrder,
                    '35085': errors.InvalidOrder,
                    '35086': errors.InvalidOrder,
                    '35087': errors.InvalidOrder,
                    '35088': errors.InvalidOrder,
                    '35089': errors.InvalidOrder,
                    '35090': errors.ExchangeError,
                    '35091': errors.ExchangeError,
                    '35092': errors.ExchangeError,
                    '35093': errors.ExchangeError,
                    '35094': errors.ExchangeError,
                    '35095': errors.BadRequest,
                    '35096': errors.ExchangeError,
                    '35097': errors.ExchangeError,
                    '35098': errors.ExchangeError,
                    '35099': errors.ExchangeError,
                    // option
                    '36001': errors.BadRequest,
                    '36002': errors.BadRequest,
                    '36005': errors.ExchangeError,
                    '36101': errors.AuthenticationError,
                    '36102': errors.PermissionDenied,
                    '36103': errors.AccountSuspended,
                    '36104': errors.PermissionDenied,
                    '36105': errors.PermissionDenied,
                    '36106': errors.AccountSuspended,
                    '36107': errors.PermissionDenied,
                    '36108': errors.InsufficientFunds,
                    '36109': errors.PermissionDenied,
                    '36201': errors.PermissionDenied,
                    '36202': errors.PermissionDenied,
                    '36203': errors.InvalidOrder,
                    '36204': errors.ExchangeError,
                    '36205': errors.BadRequest,
                    '36206': errors.BadRequest,
                    '36207': errors.InvalidOrder,
                    '36208': errors.InvalidOrder,
                    '36209': errors.InvalidOrder,
                    '36210': errors.InvalidOrder,
                    '36211': errors.InvalidOrder,
                    '36212': errors.InvalidOrder,
                    '36213': errors.InvalidOrder,
                    '36214': errors.ExchangeError,
                    '36216': errors.OrderNotFound,
                    '36217': errors.InvalidOrder,
                    '36218': errors.InvalidOrder,
                    '36219': errors.InvalidOrder,
                    '36220': errors.InvalidOrder,
                    '36221': errors.InvalidOrder,
                    '36222': errors.InvalidOrder,
                    '36223': errors.InvalidOrder,
                    '36224': errors.InvalidOrder,
                    '36225': errors.InvalidOrder,
                    '36226': errors.InvalidOrder,
                    '36227': errors.InvalidOrder,
                    '36228': errors.InvalidOrder,
                    '36229': errors.InvalidOrder,
                    '36230': errors.InvalidOrder,
                    // --------------------------------------------------------
                    // swap
                    '400': errors.BadRequest,
                    '401': errors.AuthenticationError,
                    '403': errors.PermissionDenied,
                    '404': errors.BadRequest,
                    '405': errors.BadRequest,
                    '415': errors.BadRequest,
                    '429': errors.DDoSProtection,
                    '500': errors.ExchangeNotAvailable,
                    '1001': errors.RateLimitExceeded,
                    '1002': errors.ExchangeError,
                    '1003': errors.ExchangeError,
                    // '00000': ExchangeError, // success
                    '40001': errors.AuthenticationError,
                    '40002': errors.AuthenticationError,
                    '40003': errors.AuthenticationError,
                    '40004': errors.InvalidNonce,
                    '40005': errors.InvalidNonce,
                    '40006': errors.AuthenticationError,
                    '40007': errors.BadRequest,
                    '40008': errors.InvalidNonce,
                    '40009': errors.AuthenticationError,
                    '40010': errors.AuthenticationError,
                    '40011': errors.AuthenticationError,
                    '40012': errors.AuthenticationError,
                    '40013': errors.ExchangeError,
                    '40014': errors.PermissionDenied,
                    '40015': errors.ExchangeError,
                    '40016': errors.PermissionDenied,
                    '40017': errors.ExchangeError,
                    '40018': errors.PermissionDenied,
                    '40102': errors.BadRequest,
                    '40103': errors.BadRequest,
                    '40104': errors.ExchangeError,
                    '40105': errors.ExchangeError,
                    '40106': errors.ExchangeError,
                    '40107': errors.ExchangeError,
                    '40108': errors.InvalidOrder,
                    '40109': errors.OrderNotFound,
                    '40200': errors.OnMaintenance,
                    '40201': errors.InvalidOrder,
                    '40202': errors.ExchangeError,
                    '40203': errors.BadRequest,
                    '40204': errors.BadRequest,
                    '40205': errors.BadRequest,
                    '40206': errors.BadRequest,
                    '40207': errors.BadRequest,
                    '40208': errors.BadRequest,
                    '40209': errors.BadRequest,
                    '40300': errors.ExchangeError,
                    '40301': errors.PermissionDenied,
                    '40302': errors.BadRequest,
                    '40303': errors.BadRequest,
                    '40304': errors.BadRequest,
                    '40305': errors.BadRequest,
                    '40306': errors.ExchangeError,
                    '40308': errors.OnMaintenance,
                    '40309': errors.BadSymbol,
                    '40400': errors.ExchangeError,
                    '40401': errors.ExchangeError,
                    '40402': errors.BadRequest,
                    '40403': errors.BadRequest,
                    '40404': errors.BadRequest,
                    '40405': errors.BadRequest,
                    '40406': errors.BadRequest,
                    '40407': errors.ExchangeError,
                    '40408': errors.ExchangeError,
                    '40409': errors.ExchangeError,
                    '40500': errors.InvalidOrder,
                    '40501': errors.ExchangeError,
                    '40502': errors.ExchangeError,
                    '40503': errors.ExchangeError,
                    '40504': errors.ExchangeError,
                    '40505': errors.ExchangeError,
                    '40506': errors.AuthenticationError,
                    '40507': errors.AuthenticationError,
                    '40508': errors.ExchangeError,
                    '40509': errors.ExchangeError,
                    '40600': errors.ExchangeError,
                    '40601': errors.ExchangeError,
                    '40602': errors.ExchangeError,
                    '40603': errors.ExchangeError,
                    '40604': errors.ExchangeNotAvailable,
                    '40605': errors.ExchangeError,
                    '40606': errors.ExchangeError,
                    '40607': errors.ExchangeError,
                    '40608': errors.ExchangeError,
                    '40609': errors.ExchangeError,
                    '40700': errors.BadRequest,
                    '40701': errors.ExchangeError,
                    '40702': errors.ExchangeError,
                    '40703': errors.ExchangeError,
                    '40704': errors.ExchangeError,
                    '40705': errors.BadRequest,
                    '40706': errors.InvalidOrder,
                    '40707': errors.BadRequest,
                    '40708': errors.BadRequest,
                    '40709': errors.ExchangeError,
                    '40710': errors.ExchangeError,
                    '40711': errors.InsufficientFunds,
                    '40712': errors.InsufficientFunds,
                    '40713': errors.ExchangeError,
                    '40714': errors.ExchangeError,
                    '45110': errors.InvalidOrder,
                    // spot
                    'invalid sign': errors.AuthenticationError,
                    'invalid currency': errors.BadSymbol,
                    'invalid symbol': errors.BadSymbol,
                    'invalid period': errors.BadRequest,
                    'invalid user': errors.ExchangeError,
                    'invalid amount': errors.InvalidOrder,
                    'invalid type': errors.InvalidOrder,
                    'invalid orderId': errors.InvalidOrder,
                    'invalid record': errors.ExchangeError,
                    'invalid accountId': errors.BadRequest,
                    'invalid address': errors.BadRequest,
                    'accesskey not null': errors.AuthenticationError,
                    'illegal accesskey': errors.AuthenticationError,
                    'sign not null': errors.AuthenticationError,
                    'req_time is too much difference from server time': errors.InvalidNonce,
                    'permissions not right': errors.PermissionDenied,
                    'illegal sign invalid': errors.AuthenticationError,
                    'user locked': errors.AccountSuspended,
                    'Request Frequency Is Too High': errors.RateLimitExceeded,
                    'more than a daily rate of cash': errors.BadRequest,
                    'more than the maximum daily withdrawal amount': errors.BadRequest,
                    'need to bind email or mobile': errors.ExchangeError,
                    'user forbid': errors.PermissionDenied,
                    'User Prohibited Cash Withdrawal': errors.PermissionDenied,
                    'Cash Withdrawal Is Less Than The Minimum Value': errors.BadRequest,
                    'Cash Withdrawal Is More Than The Maximum Value': errors.BadRequest,
                    'the account with in 24 hours ban coin': errors.PermissionDenied,
                    'order cancel fail': errors.BadRequest,
                    'base symbol error': errors.BadSymbol,
                    'base date error': errors.ExchangeError,
                    'api signature not valid': errors.AuthenticationError,
                    'gateway internal error': errors.ExchangeError,
                    'audit failed': errors.ExchangeError,
                    'order queryorder invalid': errors.BadRequest,
                    'market no need price': errors.InvalidOrder,
                    'limit need price': errors.InvalidOrder,
                    'userid not equal to account_id': errors.ExchangeError,
                    'your balance is low': errors.InsufficientFunds,
                    'address invalid cointype': errors.ExchangeError,
                    'system exception': errors.ExchangeError,
                    '50003': errors.ExchangeError,
                    '50004': errors.BadSymbol,
                    '50006': errors.PermissionDenied,
                    '50007': errors.PermissionDenied,
                    '50008': errors.RequestTimeout,
                    '50009': errors.RateLimitExceeded,
                    '50010': errors.ExchangeError,
                    '50014': errors.InvalidOrder,
                    '50015': errors.InvalidOrder,
                    '50016': errors.InvalidOrder,
                    '50017': errors.InvalidOrder,
                    '50018': errors.InvalidOrder,
                    '50019': errors.InvalidOrder,
                    '50020': errors.InsufficientFunds,
                    '50021': errors.InvalidOrder,
                    '50026': errors.InvalidOrder,
                    'invalid order query time': errors.ExchangeError,
                    'invalid start time': errors.BadRequest,
                    'invalid end time': errors.BadRequest,
                    '20003': errors.ExchangeError,
                    '01001': errors.ExchangeError,
                    '43111': errors.PermissionDenied, // {"code":"43111","msg":"参数错误 address not in address book","requestTime":1665394201164,"data":null}
                },
                'broad': {
                    'invalid size, valid range': errors.ExchangeError,
                },
            },
            'precisionMode': number.TICK_SIZE,
            'commonCurrencies': {
                'JADE': 'Jade Protocol',
            },
            'options': {
                'timeframes': {
                    'spot': {
                        '1m': '1min',
                        '5m': '5min',
                        '15m': '15min',
                        '30m': '30min',
                        '1h': '1h',
                        '4h': '4h',
                        '6h': '6h',
                        '12h': '12h',
                        '1d': '1day',
                        '3d': '3day',
                        '1w': '1week',
                        '1M': '1M',
                    },
                    'swap': {
                        '1m': '1m',
                        '3m': '3m',
                        '5m': '5m',
                        '15m': '15m',
                        '30m': '15m',
                        '1h': '1H',
                        '4h': '4H',
                        '6h': '6H',
                        '12h': '12H',
                        '1d': '1Dutc',
                        '3d': '3Dutc',
                        '1w': '1Wutc',
                        '1M': '1Mutc',
                    },
                },
                'fetchMarkets': [
                    'spot',
                    'swap',
                ],
                'defaultType': 'swap',
                'defaultSubType': 'linear',
                'subTypes': ['umcbl', 'dmcbl', 'cmcbl'],
                'createMarketBuyOrderRequiresPrice': true,
                'brokerId': {
                // 'spot': 'CCXT#',
                // 'swap': 'CCXT#',
                },
                'withdraw': {
                    'fillResponseFromRequest': true,
                },
            },
        });
    }
    setSandboxMode(enabled) {
        const currSubTypes = this.getSubTypes();
        if (enabled) {
            this.options['subTypesBackup'] = currSubTypes;
            const newSubTypes = [];
            for (let i = 0; i < currSubTypes.length; i++) {
                newSubTypes.push('s' + currSubTypes[i]);
            }
            this.options['subTypes'] = newSubTypes;
        }
        else if ('subTypesBackup' in this.options) {
            this.options['subTypes'] = this.options['subTypesBackup'];
            delete this.options['subTypesBackup'];
        }
    }
    getSubTypes() {
        return this.safeValue(this.options, 'subTypes', ['umcbl', 'dmcbl', 'cmcbl']);
    }
    getSupportedMapping(key, mapping = {}) {
        // swap and future use same api for bitget
        if (key === 'future') {
            key = 'swap';
        }
        if (key in mapping) {
            return mapping[key];
        }
        else {
            throw new errors.NotSupported(this.id + ' ' + key + ' does not have a value in mapping');
        }
    }
    getSubTypeFromMarketId(marketId) {
        if (!marketId) {
            return undefined;
        }
        const subTypeParts = marketId.split('_');
        if (subTypeParts.length > 1) {
            return subTypeParts[1].toLowerCase();
        }
        else {
            return '';
        }
    }
    async setPositionMode(hedged, symbol = undefined, params = {}) {
        /**
         * @method
         * @name binance#setPositionMode
         * @description set hedged to true or false for a market
         * @param {bool} hedged set to true to use dualSidePosition
         * @param {string|undefined} symbol not used by binance setPositionMode ()
         * @param {object} params extra parameters specific to the binance api endpoint
         * @returns {object} response from the exchange
         */
        if (!symbol) {
            throw new errors.ArgumentsRequired(this.id + ' setPositionMode requires a symbol argument');
        }
        const market = this.market(symbol);
        const subType = this.getSubTypeFromMarketId(market['id']);
        const request = {
            'productType': subType,
            'holdMode': hedged ? 'double_hold' : 'single_hold',
        };
        const response = await this.privateMixPostAccountSetPositionMode(this.extend(request, params));
        return response;
    }
    async fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        let subTypes = [];
        const request = {};
        let market = undefined;
        if (symbol) {
            market = this.market(symbol);
            subTypes = [this.getSubTypeFromMarketId(market['id'])];
            request['symbol'] = market['id'];
        }
        else {
            subTypes = this.getSubTypes();
        }
        const stop = this.safeValue(params, 'stop');
        if (stop) {
            params = this.omit(params, 'stop');
            let promises = [];
            for (let i = 0; i < subTypes.length; i++) {
                const subType = subTypes[i];
                request['productType'] = subType;
                request['isPlan'] = 'plan';
                promises.push(this.privateMixGetPlanCurrentPlan(this.extend(request, params)));
                request['isPlan'] = 'profit_loss';
                promises.push(this.privateMixGetPlanCurrentPlan(this.extend(request, params)));
            }
            promises = await Promise.all(promises);
            let orders = [];
            for (let i = 0; i < promises.length; i++) {
                const response = promises[i];
                const data = this.safeValue(response, 'data');
                orders = this.arrayConcat(orders, data);
            }
            return this.parseOrders(orders, undefined, since, limit);
        }
        else {
            let promises = [];
            for (let i = 0; i < subTypes.length; i++) {
                const subType = subTypes[i];
                request['productType'] = subType;
                promises.push(this.privateMixGetOrderMarginCoinCurrent(this.extend(request, params)));
            }
            promises = await Promise.all(promises);
            let orders = [];
            for (let i = 0; i < promises.length; i++) {
                const response = promises[i];
                const data = this.safeValue(response, 'data');
                orders = this.arrayConcat(orders, data);
            }
            return this.parseOrders(orders, undefined, since, limit);
        }
    }
    async fetchTime(params = {}) {
        /**
         * @method
         * @name bitget#fetchTime
         * @description fetches the current integer timestamp in milliseconds from the exchange server
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {int} the current integer timestamp in milliseconds from the exchange server
         */
        const response = await this.publicSpotGetPublicTime(params);
        //
        //     {
        //       code: '00000',
        //       msg: 'success',
        //       requestTime: 1645837773501,
        //       data: '1645837773501'
        //     }
        //
        return this.safeInteger(response, 'data');
    }
    async fetchMarkets(params = {}) {
        /**
         * @method
         * @name bitget#fetchMarkets
         * @description retrieves data on all markets for bitget
         * @param {object} params extra parameters specific to the exchange api endpoint
         * @returns {[object]} an array of objects representing market data
         */
        const types = this.safeValue(this.options, 'fetchMarkets', ['spot', 'swap']);
        let result = [];
        for (let i = 0; i < types.length; i++) {
            const type = types[i];
            if (type === 'swap') {
                const subTypes = this.getSubTypes();
                let promises = [];
                for (let j = 0; j < subTypes.length; j++) {
                    promises.push(this.fetchMarketsByType(type, this.extend(params, {
                        'productType': subTypes[j],
                    })));
                }
                promises = await Promise.all(promises);
                let result = [];
                for (let j = 0; j < promises.length; j++) {
                    result = this.arrayConcat(result, promises[j]);
                }
                return result;
            }
            else {
                const markets = await this.fetchMarketsByType(types[i], params);
                result = this.arrayConcat(result, markets);
            }
        }
        return result;
    }
    parseMarkets(markets) {
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            result.push(this.parseMarket(markets[i]));
        }
        return result;
    }
    parseMarket(market) {
        //
        // spot
        //
        //    {
        //        symbol: 'ALPHAUSDT_SPBL',
        //        symbolName: 'ALPHAUSDT',
        //        baseCoin: 'ALPHA',
        //        quoteCoin: 'USDT',
        //        minTradeAmount: '2',
        //        maxTradeAmount: '0',
        //        takerFeeRate: '0.001',
        //        makerFeeRate: '0.001',
        //        priceScale: '4',
        //        quantityScale: '4',
        //        status: 'online'
        //    }
        //
        // swap
        //
        //    {
        //        symbol: 'BTCUSDT_UMCBL',
        //        makerFeeRate: '0.0002',
        //        takerFeeRate: '0.0006',
        //        feeRateUpRatio: '0.005',
        //        openCostUpRatio: '0.01',
        //        quoteCoin: 'USDT',
        //        baseCoin: 'BTC',
        //        buyLimitPriceRatio: '0.01',
        //        sellLimitPriceRatio: '0.01',
        //        supportMarginCoins: [ 'USDT' ],
        //        minTradeNum: '0.001',
        //        priceEndStep: '5',
        //        volumePlace: '3',
        //        pricePlace: '1'
        //    }
        //
        const marketId = this.safeString(market, 'symbol');
        let quoteId = this.safeString(market, 'quoteCoin');
        if (marketId.slice(-6) === 'SCMCBL') {
            quoteId = 'SUSDC';
        }
        else if (marketId.slice(-5) === 'CMCBL') {
            quoteId = 'USDC';
        }
        const baseId = this.safeString(market, 'baseCoin');
        const quote = this.safeCurrencyCode(quoteId);
        const base = this.safeCurrencyCode(baseId);
        const supportMarginCoins = this.safeValue(market, 'supportMarginCoins', []);
        const settleId = this.safeString(supportMarginCoins, 0);
        const settle = this.safeCurrencyCode(settleId);
        let symbol = base + '/' + quote;
        const parts = marketId.split('_');
        const typeId = this.safeString(parts, 1);
        let type = undefined;
        let swap = false;
        let spot = false;
        let future = false;
        let contract = false;
        let pricePrecision = undefined;
        let amountPrecision = undefined;
        let linear = undefined;
        let inverse = undefined;
        let expiry = undefined;
        let expiryDatetime = undefined;
        if (typeId === 'SPBL') {
            type = 'spot';
            spot = true;
            pricePrecision = this.parseNumber(this.parsePrecision(this.safeString(market, 'priceScale')));
            amountPrecision = this.parseNumber(this.parsePrecision(this.safeString(market, 'quantityScale')));
        }
        else {
            const expiryString = this.safeString(parts, 2);
            if (expiryString !== undefined) {
                const year = '20' + expiryString.slice(0, 2);
                const month = expiryString.slice(2, 4);
                const day = expiryString.slice(4, 6);
                expiryDatetime = year + '-' + month + '-' + day + 'T00:00:00Z';
                expiry = this.parse8601(expiryDatetime);
                type = 'future';
                future = true;
                symbol = symbol + ':' + settle + '-' + expiryString;
            }
            else {
                type = 'swap';
                swap = true;
                symbol = symbol + ':' + settle;
            }
            contract = true;
            const sumcbl = (typeId === 'SUMCBL');
            const sdmcbl = (typeId === 'SDMCBL');
            const scmcbl = (typeId === 'SCMCBL');
            linear = (typeId === 'UMCBL') || (typeId === 'CMCBL') || sumcbl || scmcbl;
            inverse = !linear;
            if (sumcbl || sdmcbl || scmcbl) {
                symbol = marketId;
            }
            const priceDecimals = this.safeInteger(market, 'pricePlace');
            const amountDecimals = this.safeInteger(market, 'volumePlace');
            const priceStep = this.safeString(market, 'priceEndStep');
            const amountStep = this.safeString(market, 'minTradeNum');
            const precisePrice = new Precise["default"](priceStep);
            precisePrice.decimals = Math.max(precisePrice.decimals, priceDecimals);
            precisePrice.reduce();
            const priceString = precisePrice.toString();
            pricePrecision = this.parseNumber(priceString);
            const preciseAmount = new Precise["default"](amountStep);
            preciseAmount.decimals = Math.max(preciseAmount.decimals, amountDecimals);
            preciseAmount.reduce();
            const amountString = preciseAmount.toString();
            amountPrecision = this.parseNumber(amountString);
        }
        const status = this.safeString(market, 'status');
        let active = undefined;
        if (status !== undefined) {
            active = status === 'online';
        }
        return {
            'id': marketId,
            'symbol': symbol,
            'base': base,
            'quote': quote,
            'settle': settle,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': settleId,
            'type': type,
            'spot': spot,
            'margin': false,
            'swap': swap,
            'future': future,
            'option': false,
            'active': active,
            'contract': contract,
            'linear': linear,
            'inverse': inverse,
            'taker': this.safeNumber(market, 'takerFeeRate'),
            'maker': this.safeNumber(market, 'makerFeeRate'),
            'contractSize': 1,
            'expiry': expiry,
            'expiryDatetime': expiryDatetime,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': amountPrecision,
                'price': pricePrecision,
            },
            'limits': {
                'leverage': {
                    'min': undefined,
                    'max': undefined,
                },
                'amount': {
                    'min': this.safeNumber(market, 'minTradeNum'),
                    'max': undefined,
                },
                'price': {
                    'min': undefined,
                    'max': undefined,
                },
                'cost': {
                    'min': undefined,
                    'max': undefined,
                },
            },
            'info': market,
        };
    }
    async fetchMarketsByType(type, params = {}) {
        const method = this.getSupportedMapping(type, {
            'spot': 'publicSpotGetPublicProducts',
            'swap': 'publicMixGetMarketContracts',
        });
        const response = await this[method](params);
        //
        // spot
        //
        //    {
        //        code: '00000',
        //        msg: 'success',
        //        requestTime: 1645840064031,
        //        data: [
        //            {
        //                symbol: 'ALPHAUSDT_SPBL',
        //                symbolName: 'ALPHAUSDT',
        //                baseCoin: 'ALPHA',
        //                quoteCoin: 'USDT',
        //                minTradeAmount: '2',
        //                maxTradeAmount: '0',
        //                takerFeeRate: '0.001',
        //                makerFeeRate: '0.001',
        //                priceScale: '4',
        //                quantityScale: '4',
        //                status: 'online'
        //            }
        //        ]
        //    }
        //
        // swap
        //
        //    {
        //        code: '00000',
        //        msg: 'success',
        //        requestTime: 1645840821493,
        //        data: [
        //            {
        //                symbol: 'BTCUSDT_UMCBL',
        //                makerFeeRate: '0.0002',
        //                takerFeeRate: '0.0006',
        //                feeRateUpRatio: '0.005',
        //                openCostUpRatio: '0.01',
        //                quoteCoin: 'USDT',
        //                baseCoin: 'BTC',
        //                buyLimitPriceRatio: '0.01',
        //                sellLimitPriceRatio: '0.01',
        //                supportMarginCoins: [Array],
        //                minTradeNum: '0.001',
        //                priceEndStep: '5',
        //                volumePlace: '3',
        //                pricePlace: '1'
        //            }
        //        ]
        //    }
        //
        const data = this.safeValue(response, 'data', []);
        return this.parseMarkets(data);
    }
    async fetchCurrencies(params = {}) {
        /**
         * @method
         * @name bitget#fetchCurrencies
         * @description fetches all available currencies on an exchange
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} an associative dictionary of currencies
         */
        const response = await this.publicSpotGetPublicCurrencies(params);
        //
        //     {
        //       code: '00000',
        //       msg: 'success',
        //       requestTime: 1645935668288,
        //       data: [
        //         {
        //           coinId: '230',
        //           coinName: 'KIN',
        //           transfer: 'false',
        //           chains: [
        //             {
        //               chain: 'SOL',
        //               needTag: 'false',
        //               withdrawable: 'true',
        //               rechargeable: 'true',
        //               withdrawFee: '187500',
        //               depositConfirm: '100',
        //               withdrawConfirm: '100',
        //               minDepositAmount: '12500',
        //               minWithdrawAmount: '250000',
        //               browserUrl: 'https://explorer.solana.com/tx/'
        //             }
        //           ]
        //         }
        //       ]
        //     }
        //
        const result = {};
        const data = this.safeValue(response, 'data', []);
        for (let i = 0; i < data.length; i++) {
            const entry = data[i];
            const id = this.safeString(entry, 'coinId');
            const code = this.safeCurrencyCode(this.safeString(entry, 'coinName'));
            const chains = this.safeValue(entry, 'chains', []);
            const networks = {};
            for (let j = 0; j < chains.length; j++) {
                const chain = chains[j];
                const networkId = this.safeString(chain, 'chain');
                const network = this.safeCurrencyCode(networkId);
                const withdrawEnabled = this.safeString(chain, 'withdrawable');
                const depositEnabled = this.safeString(chain, 'rechargeable');
                networks[network] = {
                    'info': chain,
                    'id': networkId,
                    'network': network,
                    'limits': {
                        'withdraw': {
                            'min': this.safeNumber(chain, 'minWithdrawAmount'),
                            'max': undefined,
                        },
                        'deposit': {
                            'min': this.safeNumber(chain, 'minDepositAmount'),
                            'max': undefined,
                        },
                    },
                    'active': undefined,
                    'withdraw': withdrawEnabled === 'true',
                    'deposit': depositEnabled === 'true',
                    'fee': this.safeNumber(chain, 'withdrawFee'),
                    'precision': undefined,
                };
            }
            result[code] = {
                'info': entry,
                'id': id,
                'code': code,
                'networks': networks,
                'type': undefined,
                'name': undefined,
                'active': undefined,
                'deposit': undefined,
                'withdraw': undefined,
                'fee': undefined,
                'precision': undefined,
                'limits': {
                    'amount': { 'min': undefined, 'max': undefined },
                    'withdraw': { 'min': undefined, 'max': undefined },
                },
            };
        }
        return result;
    }
    async fetchDeposits(code = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bitget#fetchDeposits
         * @description fetch all deposits made to an account
         * @url https://bitgetlimited.github.io/apidoc/en/spot/#get-deposit-list
         * @param {string|undefined} code unified currency code
         * @param {int} since the earliest time in ms to fetch deposits for
         * @param {int|undefined} limit the maximum number of deposits structures to retrieve
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @param {string|undefined} params.pageNo pageNo default 1
         * @param {string|undefined} params.pageSize pageSize default 20. Max 100
         * @returns {[object]} a list of [transaction structures]{@link https://docs.ccxt.com/en/latest/manual.html#transaction-structure}
         */
        await this.loadMarkets();
        if (code === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchDeposits() requires a `code` argument');
        }
        const currency = this.currency(code);
        if (since === undefined) {
            since = this.milliseconds() - 31556952000; // 1yr
        }
        const request = {
            'coin': currency['code'],
            'startTime': since,
            'endTime': this.milliseconds(),
        };
        if (limit !== undefined) {
            request['pageSize'] = limit;
        }
        const response = await this.privateSpotGetWalletDepositList(this.extend(request, params));
        //
        //      {
        //          "code": "00000",
        //          "msg": "success",
        //          "requestTime": 0,
        //          "data": [{
        //              "id": "925607360021839872",
        //              "txId": "f73a4ac034da06b729f49676ca8801f406a093cf90c69b16e5a1cc9080df4ccb",
        //              "coin": "USDT",
        //              "type": "deposit",
        //              "amount": "19.44800000",
        //              "status": "success",
        //              "toAddress": "TRo4JMfZ1XYHUgnLsUMfDEf8MWzcWaf8uh",
        //              "fee": null,
        //              "chain": "TRC20",
        //              "confirm": null,
        //              "cTime": "1656407912259",
        //              "uTime": "1656407940148"
        //          }]
        //      }
        //
        const rawTransactions = this.safeValue(response, 'data', []);
        return this.parseTransactions(rawTransactions, currency, since, limit);
    }
    async withdraw(code, amount, address, tag = undefined, params = {}) {
        /**
         * @method
         * @name bitget#withdraw
         * @description make a withdrawal
         * @param {string} code unified currency code
         * @param {float} amount the amount to withdraw
         * @param {string} address the address to withdraw to
         * @param {string|undefined} tag
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @param {string} params.chain the chain to withdraw to
         * @returns {object} a [transaction structure]{@link https://docs.ccxt.com/en/latest/manual.html#transaction-structure}
         */
        this.checkAddress(address);
        const chain = this.safeString(params, 'chain');
        if (chain === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' withdraw() requires a chain parameter');
        }
        await this.loadMarkets();
        const currency = this.currency(code);
        const request = {
            'coin': currency['code'],
            'address': address,
            'chain': chain,
            'amount': amount,
        };
        if (tag !== undefined) {
            request['tag'] = tag;
        }
        const response = await this.privateSpotPostWalletWithdrawal(this.extend(request, params));
        //
        //     {
        //         "code": "00000",
        //         "msg": "success",
        //         "data": "888291686266343424"
        //     }
        //
        const result = {
            'id': this.safeString(response, 'data'),
            'info': response,
            'txid': undefined,
            'timestamp': undefined,
            'datetime': undefined,
            'network': undefined,
            'addressFrom': undefined,
            'address': undefined,
            'addressTo': undefined,
            'amount': undefined,
            'type': 'withdrawal',
            'currency': undefined,
            'status': undefined,
            'updated': undefined,
            'tagFrom': undefined,
            'tag': undefined,
            'tagTo': undefined,
            'comment': undefined,
            'fee': undefined,
        };
        const withdrawOptions = this.safeValue(this.options, 'withdraw', {});
        const fillResponseFromRequest = this.safeValue(withdrawOptions, 'fillResponseFromRequest', true);
        if (fillResponseFromRequest) {
            result['currency'] = code;
            result['timestamp'] = this.milliseconds();
            result['datetime'] = this.iso8601(this.milliseconds());
            result['amount'] = amount;
            result['tag'] = tag;
            result['address'] = address;
            result['addressTo'] = address;
            result['network'] = chain;
        }
        return result;
    }
    async fetchWithdrawals(code = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bitget#fetchWithdrawals
         * @description fetch all withdrawals made from an account
         * @url https://bitgetlimited.github.io/apidoc/en/spot/#get-withdraw-list
         * @param {string|undefined} code unified currency code
         * @param {int} since the earliest time in ms to fetch withdrawals for
         * @param {int|undefined} limit the maximum number of withdrawals structures to retrieve
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @param {string|undefined} params.pageNo pageNo default 1
         * @param {string|undefined} params.pageSize pageSize default 20. Max 100
         * @returns {[object]} a list of [transaction structures]{@link https://docs.ccxt.com/en/latest/manual.html#transaction-structure}
         */
        await this.loadMarkets();
        if (code === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchWithdrawals() requires a `code` argument');
        }
        const currency = this.currency(code);
        if (since === undefined) {
            since = this.milliseconds() - 31556952000; // 1yr
        }
        const request = {
            'coin': currency['code'],
            'startTime': since,
            'endTime': this.milliseconds(),
        };
        if (limit !== undefined) {
            request['pageSize'] = limit;
        }
        const response = await this.privateSpotGetWalletWithdrawalList(this.extend(request, params));
        //
        //      {
        //          "code": "00000",
        //          "msg": "success",
        //          "requestTime": 0,
        //          "data": [{
        //              "id": "925607360021839872",
        //              "txId": "f73a4ac034da06b729f49676ca8801f406a093cf90c69b16e5a1cc9080df4ccb",
        //              "coin": "USDT",
        //              "type": "deposit",
        //              "amount": "19.44800000",
        //              "status": "success",
        //              "toAddress": "TRo4JMfZ1XYHUgnLsUMfDEf8MWzcWaf8uh",
        //              "fee": null,
        //              "chain": "TRC20",
        //              "confirm": null,
        //              "cTime": "1656407912259",
        //              "uTime": "1656407940148"
        //          }]
        //      }
        //
        const rawTransactions = this.safeValue(response, 'data', []);
        return this.parseTransactions(rawTransactions, currency, since, limit);
    }
    parseTransaction(transaction, currency = undefined) {
        //
        //     {
        //         "id": "925607360021839872",
        //         "txId": "f73a4ac034da06b729f49676ca8801f406a093cf90c69b16e5a1cc9080df4ccb",
        //         "coin": "USDT",
        //         "type": "deposit",
        //         "amount": "19.44800000",
        //         "status": "success",
        //         "toAddress": "TRo4JMfZ1XYHUgnLsUMfDEf8MWzcWaf8uh",
        //         "fee": null,
        //         "chain": "TRC20",
        //         "confirm": null,
        //         "cTime": "1656407912259",
        //         "uTime": "1656407940148"
        //     }
        //
        const timestamp = this.safeInteger(transaction, 'cTime');
        const networkId = this.safeString(transaction, 'chain');
        const currencyId = this.safeString(transaction, 'coin');
        const status = this.safeString(transaction, 'status');
        return {
            'id': this.safeString(transaction, 'id'),
            'info': transaction,
            'txid': this.safeString(transaction, 'txId'),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'network': networkId,
            'addressFrom': undefined,
            'address': this.safeString(transaction, 'toAddress'),
            'addressTo': this.safeString(transaction, 'toAddress'),
            'amount': this.safeNumber(transaction, 'amount'),
            'type': this.safeString(transaction, 'type'),
            'currency': this.safeCurrencyCode(currencyId),
            'status': this.parseTransactionStatus(status),
            'updated': this.safeNumber(transaction, 'uTime'),
            'tagFrom': undefined,
            'tag': undefined,
            'tagTo': undefined,
            'comment': undefined,
            'fee': undefined,
        };
    }
    parseTransactionStatus(status) {
        const statuses = {
            'success': 'ok',
            'Pending': 'pending',
            'pending_review': 'pending',
            'pending_review_fail': 'failed',
            'reject': 'failed',
        };
        return this.safeString(statuses, status, status);
    }
    async fetchDepositAddress(code, params = {}) {
        /**
         * @method
         * @name bitget#fetchDepositAddress
         * @description fetch the deposit address for a currency associated with this account
         * @param {string} code unified currency code
         * @param {object} params extra parameters specific to the binance api endpoint
         * @returns {object} an [address structure]{@link https://docs.ccxt.com/en/latest/manual.html#address-structure}
         */
        await this.loadMarkets();
        const currency = this.currency(code);
        const request = {
            'coin': currency['code'],
        };
        const response = await this.privateSpotGetWalletDepositAddress(this.extend(request, params));
        //
        //     {
        //         "code": "00000",
        //         "msg": "success",
        //         "data": {
        //             "address": "1HPn8Rx2y6nNSfagQBKy27GB99Vbzg89wv",
        //             "chain": "BTC-Bitcoin",
        //             "coin": "BTC",
        //             "tag": "",
        //             "url": "https://btc.com/1HPn8Rx2y6nNSfagQBKy27GB99Vbzg89wv"
        //         }
        //     }
        //
        const data = this.safeValue(response, 'data', {});
        return this.parseDepositAddress(data, currency);
    }
    parseDepositAddress(depositAddress, currency = undefined) {
        //
        //    {
        //        "address": "1HPn8Rx2y6nNSfagQBKy27GB99Vbzg89wv",
        //        "chain": "BTC-Bitcoin",
        //        "coin": "BTC",
        //        "tag": "",
        //        "url": "https://btc.com/1HPn8Rx2y6nNSfagQBKy27GB99Vbzg89wv"
        //    }
        //
        const currencyId = this.safeString(depositAddress, 'coin');
        const networkId = this.safeString(depositAddress, 'chain');
        return {
            'currency': this.safeCurrencyCode(currencyId, currency),
            'address': this.safeString(depositAddress, 'address'),
            'tag': this.safeString(depositAddress, 'tag'),
            'network': networkId,
            'info': depositAddress,
        };
    }
    async fetchOrderBook(symbol, limit = undefined, params = {}) {
        /**
         * @method
         * @name bitget#fetchOrderBook
         * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
         * @param {string} symbol unified symbol of the market to fetch the order book for
         * @param {int|undefined} limit the maximum amount of order book entries to return
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/en/latest/manual.html#order-book-structure} indexed by market symbols
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const [marketType, query] = this.handleMarketTypeAndParams('fetchOrderBook', market, params);
        const method = this.getSupportedMapping(marketType, {
            'spot': 'publicSpotGetMarketDepth',
            'swap': 'publicMixGetMarketDepth',
        });
        const request = {
            'symbol': market['id'],
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this[method](this.extend(request, query));
        //
        //     {
        //       code: '00000',
        //       msg: 'success',
        //       requestTime: 1645854610294,
        //       data: {
        //         asks: [ [ '39102', '11.026' ] ],
        //         bids: [ [ '39100.5', '1.773' ] ],
        //         timestamp: '1645854610294'
        //       }
        //     }
        //
        const data = this.safeValue(response, 'data');
        const timestamp = this.safeInteger(data, 'timestamp');
        return this.parseOrderBook(data, symbol, timestamp);
    }
    parseTicker(ticker, market = undefined) {
        //
        // spot
        //
        //     {
        //         symbol: 'BTCUSDT',
        //         high24h: '40252.43',
        //         low24h: '38548.54',
        //         close: '39102.16',
        //         quoteVol: '67295596.1458',
        //         baseVol: '1723.4152',
        //         usdtVol: '67295596.14578',
        //         ts: '1645856170030',
        //         buyOne: '39096.16',
        //         sellOne: '39103.99'
        //     }
        //
        // swap
        //
        //     {
        //         symbol: 'BTCUSDT_UMCBL',
        //         last: '39086',
        //         bestAsk: '39087',
        //         bestBid: '39086',
        //         high24h: '40312',
        //         low24h: '38524.5',
        //         timestamp: '1645856591864',
        //         priceChangePercent: '-0.00861',
        //         baseVolume: '142251.757',
        //         quoteVolume: '5552388715.9215',
        //         usdtVolume: '5552388715.9215'
        //     }
        //
        let marketId = this.safeString(ticker, 'symbol');
        if (!(marketId in this.markets_by_id)) {
            marketId += '_SPBL';
        }
        const symbol = this.safeSymbol(marketId, market);
        const high = this.safeString(ticker, 'high24h');
        const low = this.safeString(ticker, 'low24h');
        const close = this.safeString2(ticker, 'close', 'last');
        const quoteVolume = this.safeString2(ticker, 'quoteVol', 'quoteVolume');
        const baseVolume = this.safeString2(ticker, 'baseVol', 'baseVolume');
        const timestamp = this.safeInteger2(ticker, 'ts', 'timestamp');
        const datetime = this.iso8601(timestamp);
        const bid = this.safeString2(ticker, 'buyOne', 'bestBid');
        const ask = this.safeString2(ticker, 'sellOne', 'bestAsk');
        const percentage = Precise["default"].stringMul(this.safeString(ticker, 'priceChangePercent'), '100');
        return this.safeTicker({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': datetime,
            'high': high,
            'low': low,
            'bid': bid,
            'bidVolume': undefined,
            'ask': ask,
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': close,
            'last': undefined,
            'previousClose': undefined,
            'change': undefined,
            'percentage': percentage,
            'average': undefined,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'info': ticker,
        }, market);
    }
    async fetchTicker(symbol, params = {}) {
        /**
         * @method
         * @name bitget#fetchTicker
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/en/latest/manual.html#ticker-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        const [marketType, query] = this.handleMarketTypeAndParams('fetchTicker', market, params);
        const method = this.getSupportedMapping(marketType, {
            'spot': 'publicSpotGetMarketTicker',
            'swap': 'publicMixGetMarketTicker',
        });
        const response = await this[method](this.extend(request, query));
        //
        //     {
        //         code: '00000',
        //         msg: 'success',
        //         requestTime: '1645856138576',
        //         data: {
        //             symbol: 'BTCUSDT',
        //             high24h: '40252.43',
        //             low24h: '38548.54',
        //             close: '39104.65',
        //             quoteVol: '67221762.2184',
        //             baseVol: '1721.527',
        //             usdtVol: '67221762.218361',
        //             ts: '1645856138031',
        //             buyOne: '39102.55',
        //             sellOne: '39110.56'
        //         }
        //     }
        //
        const data = this.safeValue(response, 'data');
        return this.parseTicker(data, market);
    }
    async fetchTickers(symbols = undefined, params = {}) {
        /**
         * @method
         * @name bitget#fetchTickers
         * @description fetches price tickers for multiple markets, statistical calculations with the information calculated over the past 24 hours each market
         * @see https://bitgetlimited.github.io/apidoc/en/spot/#get-all-tickers
         * @see https://bitgetlimited.github.io/apidoc/en/mix/#get-all-symbol-ticker
         * @param {[string]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} an array of [ticker structures]{@link https://docs.ccxt.com/en/latest/manual.html#ticker-structure}
         */
        await this.loadMarkets();
        let type = undefined;
        let market = undefined;
        if (symbols !== undefined) {
            const symbol = this.safeValue(symbols, 0);
            market = this.market(symbol);
        }
        [type, params] = this.handleMarketTypeAndParams('fetchTickers', market, params);
        const method = this.getSupportedMapping(type, {
            'spot': 'publicSpotGetMarketTickers',
            'swap': 'publicMixGetMarketTickers',
        });
        const request = {};
        if (method === 'publicMixGetMarketTickers') {
            const defaultSubType = this.safeString(this.options, 'defaultSubType');
            request['productType'] = (defaultSubType === 'linear') ? 'UMCBL' : 'DMCBL';
        }
        const response = await this[method](this.extend(request, params));
        //
        // spot
        //
        //     {
        //         "code":"00000",
        //         "msg":"success",
        //         "requestTime":1653237548496,
        //         "data":[
        //             {
        //                 "symbol":"LINKUSDT",
        //                 "high24h":"7.2634",
        //                 "low24h":"7.1697",
        //                 "close":"7.2444",
        //                 "quoteVol":"330424.2366",
        //                 "baseVol":"46401.3116",
        //                 "usdtVol":"330424.2365573",
        //                 "ts":"1653237548026",
        //                 "buyOne":"7.2382",
        //                 "sellOne":"7.2513"
        //             },
        //         ]
        //     }
        //
        // swap
        //
        //     {
        //         "code":"00000",
        //         "msg":"success",
        //         "requestTime":1653237819762,
        //         "data":[
        //             {
        //                 "symbol":"BTCUSDT_UMCBL",
        //                 "last":"29891.5",
        //                 "bestAsk":"29891.5",
        //                 "bestBid":"29889.5",
        //                 "high24h":"29941.5",
        //                 "low24h":"29737.5",
        //                 "timestamp":"1653237819761",
        //                 "priceChangePercent":"0.00163",
        //                 "baseVolume":"127937.56",
        //                 "quoteVolume":"3806276573.6285",
        //                 "usdtVolume":"3806276573.6285"
        //             },
        //         ]
        //     }
        //
        const data = this.safeValue(response, 'data');
        return this.parseTickers(data, symbols);
    }
    parseTrade(trade, market = undefined) {
        //
        // spot
        //
        //     {
        //         symbol: 'BTCUSDT_SPBL',
        //         tradeId: '881371996363608065',
        //         side: 'sell',
        //         fillPrice: '39123.05',
        //         fillQuantity: '0.0363',
        //         fillTime: '1645861379709'
        //     }
        //
        // swap
        //
        //     {
        //         tradeId: '881373204067311617',
        //         price: '39119.0',
        //         size: '0.001',
        //         side: 'buy',
        //         timestamp: '1645861667648',
        //         symbol: 'BTCUSDT_UMCBL'
        //     }
        //
        // private
        //
        //     {
        //         accountId: '6394957606',
        //         symbol: 'LTCUSDT_SPBL',
        //         orderId: '864752115272552448',
        //         fillId: '864752115685969921',
        //         orderType: 'limit',
        //         side: 'buy',
        //         fillPrice: '127.92000000',
        //         fillQuantity: '0.10000000',
        //         fillTotalAmount: '12.79200000',
        //         feeCcy: 'LTC',
        //         fees: '0.00000000',
        //         cTime: '1641898891373'
        //     }
        //
        //     {
        //         tradeId: '881640729552281602',
        //         symbol: 'BTCUSDT_UMCBL',
        //         orderId: '881640729145409536',
        //         price: '38429.50',
        //         sizeQty: '0.001',
        //         fee: '0',
        //         side: 'open_long',
        //         fillAmount: '38.4295',
        //         profit: '0',
        //         cTime: '1645925450694'
        //     }
        //
        const marketId = this.safeString(trade, 'symbol');
        const symbol = this.safeSymbol(marketId, market);
        const id = this.safeStringN(trade, ['tradeId', 'fillId', 'orderId'], '');
        const order = this.safeString(trade, 'orderId');
        const rawSide = this.safeString(trade, 'side', '');
        let side = undefined;
        if (rawSide.indexOf('open_long') !== -1 || rawSide.indexOf('close_short') !== -1 || rawSide.indexOf('buy_single') !== -1 || rawSide.indexOf('buy') !== -1) {
            side = 'buy';
        }
        else if (rawSide.indexOf('open_short') !== -1 || rawSide.indexOf('close_long') !== -1 || rawSide.indexOf('sell') !== -1) {
            side = 'sell';
        }
        let isClose = undefined;
        if (rawSide.indexOf('close_long') !== -1 || rawSide.indexOf('close_short') !== -1) {
            isClose = true;
        }
        const price = this.safeString2(trade, 'priceAvg', 'price');
        let amount = this.safeString2(trade, 'fillQuantity', 'size');
        amount = this.safeString(trade, 'sizeQty', amount);
        let timestamp = this.safeInteger2(trade, 'fillTime', 'timestamp');
        timestamp = this.safeInteger(trade, 'cTime', timestamp);
        let fee = undefined;
        let feeAmount = this.safeString2(trade, 'fees', 'fee');
        const type = this.safeString(trade, 'orderType');
        if (feeAmount !== undefined) {
            feeAmount = Precise["default"].stringNeg(feeAmount);
            const currencyCode = this.safeCurrencyCode(this.safeString(trade, 'feeCcy'));
            fee = {
                'code': currencyCode,
                'currency': currencyCode,
                'cost': feeAmount,
            };
        }
        const datetime = this.iso8601(timestamp);
        return this.safeTrade({
            'info': trade,
            'id': id,
            'order': order,
            'symbol': symbol,
            'side': side,
            'type': type,
            'takerOrMaker': undefined,
            'price': price,
            'amount': amount,
            'cost': this.safeString(fee, 'cost'),
            'fee': fee,
            'timestamp': timestamp,
            'datetime': datetime,
            'isClose': isClose,
        }, market);
    }
    async fetchTrades(symbol, limit = undefined, since = undefined, params = {}) {
        /**
         * @method
         * @name bitget#fetchTrades
         * @description get the list of most recent trades for a particular symbol
         * @param {string} symbol unified symbol of the market to fetch trades for
         * @param {int|undefined} since timestamp in ms of the earliest trade to fetch
         * @param {int|undefined} limit the maximum amount of trades to fetch
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {[object]} a list of [trade structures]{@link https://docs.ccxt.com/en/latest/manual.html?#public-trades}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const [marketType, query] = this.handleMarketTypeAndParams('fetchTrades', market, params);
        const method = this.getSupportedMapping(marketType, {
            'spot': 'publicSpotGetMarketFills',
            'swap': 'publicMixGetMarketFills',
        });
        const response = await this[method](this.extend(request, query));
        //
        //     {
        //       code: '00000',
        //       msg: 'success',
        //       requestTime: '1645861382032',
        //       data: [
        //         {
        //           symbol: 'BTCUSDT_SPBL',
        //           tradeId: '881371996363608065',
        //           side: 'sell',
        //           fillPrice: '39123.05',
        //           fillQuantity: '0.0363',
        //           fillTime: '1645861379709'
        //         }
        //       ]
        //     }
        //
        const data = this.safeValue(response, 'data', []);
        return this.parseTrades(data, market, since, limit);
    }
    async fetchTradingFee(symbol, params = {}) {
        /**
         * @method
         * @name bitget#fetchTradingFee
         * @description fetch the trading fees for a market
         * @param {string} symbol unified market symbol
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} a [fee structure]{@link https://docs.ccxt.com/en/latest/manual.html#fee-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.publicSpotGetPublicProduct(this.extend(request, params));
        //
        //     {
        //         code: '00000',
        //         msg: 'success',
        //         requestTime: '1646255374000',
        //         data: {
        //           symbol: 'ethusdt_SPBL',
        //           symbolName: null,
        //           baseCoin: 'ETH',
        //           quoteCoin: 'USDT',
        //           minTradeAmount: '0',
        //           maxTradeAmount: '0',
        //           takerFeeRate: '0.002',
        //           makerFeeRate: '0.002',
        //           priceScale: '2',
        //           quantityScale: '4',
        //           status: 'online'
        //         }
        //     }
        //
        const data = this.safeValue(response, 'data', {});
        return this.parseTradingFee(data, market);
    }
    async fetchTradingFees(params = {}) {
        /**
         * @method
         * @name bitget#fetchTradingFees
         * @description fetch the trading fees for multiple markets
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} a dictionary of [fee structures]{@link https://docs.ccxt.com/en/latest/manual.html#fee-structure} indexed by market symbols
         */
        await this.loadMarkets();
        const response = await this.publicSpotGetPublicProducts(params);
        //
        //     {
        //         code: '00000',
        //         msg: 'success',
        //         requestTime: '1646255662391',
        //         data: [
        //           {
        //             symbol: 'ALPHAUSDT_SPBL',
        //             symbolName: 'ALPHAUSDT',
        //             baseCoin: 'ALPHA',
        //             quoteCoin: 'USDT',
        //             minTradeAmount: '2',
        //             maxTradeAmount: '0',
        //             takerFeeRate: '0.001',
        //             makerFeeRate: '0.001',
        //             priceScale: '4',
        //             quantityScale: '4',
        //             status: 'online'
        //           },
        //           ...
        //         ]
        //     }
        //
        const data = this.safeValue(response, 'data', []);
        const result = {};
        for (let i = 0; i < data.length; i++) {
            const feeInfo = data[i];
            const fee = this.parseTradingFee(feeInfo);
            const symbol = fee['symbol'];
            result[symbol] = fee;
        }
        return result;
    }
    parseTradingFee(data, market = undefined) {
        const marketId = this.safeString(data, 'symbol');
        return {
            'info': data,
            'symbol': this.safeSymbol(marketId, market),
            'maker': this.safeNumber(data, 'makerFeeRate'),
            'taker': this.safeNumber(data, 'takerFeeRate'),
        };
    }
    parseOHLCV(ohlcv, market = undefined, timeframe = '1m') {
        //
        // spot
        //
        //     {
        //         open: '57882.31',
        //         high: '58967.24',
        //         low: '57509.56',
        //         close: '57598.96',
        //         quoteVol: '439160536.605821',
        //         baseVol: '7531.2927',
        //         usdtVol: '439160536.605821',
        //         ts: '1637337600000'
        //     }
        //
        // swap
        //
        //     [
        //         "1645911960000",
        //         "39406",
        //         "39407",
        //         "39374.5",
        //         "39379",
        //         "35.526",
        //         "1399132.341"
        //     ]
        //
        return [
            this.safeInteger2(ohlcv, 0, 'ts'),
            this.safeNumber2(ohlcv, 1, 'open'),
            this.safeNumber2(ohlcv, 2, 'high'),
            this.safeNumber2(ohlcv, 3, 'low'),
            this.safeNumber2(ohlcv, 4, 'close'),
            this.safeNumber2(ohlcv, 5, 'baseVol'),
        ];
    }
    async fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bitget#fetchOHLCV
         * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
         * @param {string} symbol unified symbol of the market to fetch OHLCV data for
         * @param {string} timeframe the length of time each candle represents
         * @param {int|undefined} since timestamp in ms of the earliest candle to fetch
         * @param {int|undefined} limit the maximum amount of candles to fetch
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @param {int|undefined} params.until timestamp in ms of the latest candle to fetch
         * @returns {[[int]]} A list of candles ordered as timestamp, open, high, low, close, volume
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        const [marketType, query] = this.handleMarketTypeAndParams('fetchOHLCV', market, params);
        const method = this.getSupportedMapping(marketType, {
            'spot': 'publicSpotGetMarketCandles',
            'swap': 'publicMixGetMarketCandles',
        });
        const until = this.safeInteger2(params, 'until', 'till');
        params = this.omit(params, ['until', 'till']);
        if (limit === undefined) {
            limit = 1000;
        }
        if (market['type'] === 'spot') {
            request['period'] = this.options['timeframes']['spot'][timeframe];
            request['limit'] = limit;
            if (since !== undefined) {
                request['after'] = since;
                if (until === undefined) {
                    const millisecondsPerTimeframe = this.options['timeframes']['swap'][timeframe] * 1000;
                    request['before'] = this.sum(since, millisecondsPerTimeframe * limit);
                }
            }
            if (until !== undefined) {
                request['before'] = until;
            }
        }
        else if (market['type'] === 'swap') {
            request['granularity'] = this.options['timeframes']['swap'][timeframe];
            request['limit'] = limit + 1;
            const duration = this.parseTimeframe(timeframe);
            const now = this.milliseconds();
            if (since === undefined) {
                request['startTime'] = now - (limit - 1) * (duration * 1000);
                request['endTime'] = now;
            }
            else {
                request['startTime'] = this.sum(since, -1 * duration * 1000);
                if (until !== undefined) {
                    request['endTime'] = until;
                }
                else {
                    request['endTime'] = this.sum(since, limit * duration * 1000);
                }
            }
        }
        const response = await this[method](this.extend(request, query));
        //  [ ["1645911960000","39406","39407","39374.5","39379","35.526","1399132.341"] ]
        const data = this.safeValue(response, 'data', response);
        return this.parseOHLCVs(data, market, timeframe, since, limit);
    }
    async fetchBalance(params = {}) {
        /**
         * @method
         * @name bitget#fetchBalance
         * @description query for balance and get the amount of funds available for trading or funds locked in orders
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} a [balance structure]{@link https://docs.ccxt.com/en/latest/manual.html?#balance-structure}
         */
        await this.loadMarkets();
        const [marketType, query] = this.handleMarketTypeAndParams('fetchBalance', undefined, params);
        const method = this.getSupportedMapping(marketType, {
            'spot': 'privateSpotGetAccountAssets',
            'swap': 'privateMixGetAccountAccounts',
        });
        if (marketType === 'swap') {
            const subTypes = this.getSubTypes();
            let promises = [];
            for (let i = 0; i < subTypes.length; i++) {
                const subType = subTypes[i];
                const request = {
                    'productType': subType,
                };
                promises.push(this[method](this.extend(request, query)));
            }
            promises = await Promise.all(promises);
            let result = {};
            for (let i = 0; i < promises.length; i++) {
                const response = promises[i];
                const data = this.safeValue(response, 'data');
                const parsedBalance = this.parseBalance(data);
                result = this.deepExtend(result, parsedBalance);
            }
            return result;
        }
        else {
            const request = {};
            const response = await this[method](this.extend(request, query));
            // spot
            //     {
            //       code: '00000',
            //       msg: 'success',
            //       requestTime: 1645928868827,
            //       data: [
            //         {
            //           coinId: 1,
            //           coinName: 'BTC',
            //           available: '0.00070000',
            //           frozen: '0.00000000',
            //           lock: '0.00000000',
            //           uTime: '1645921706000'
            //         }
            //       ]
            //     }
            //
            // swap
            //     {
            //       code: '00000',
            //       msg: 'success',
            //       requestTime: 1645928929251,
            //       data: [
            //         {
            //           marginCoin: 'USDT',
            //           locked: '0',
            //           available: '8.078525',
            //           crossMaxAvailable: '8.078525',
            //           fixedMaxAvailable: '8.078525',
            //           maxTransferOut: '8.078525',
            //           equity: '10.02508',
            //           usdtEquity: '10.02508',
            //           btcEquity: '0.00026057027'
            //         }
            //       ]
            //     }
            const data = this.safeValue(response, 'data');
            return this.parseBalance(data);
        }
    }
    parseBalance(balance) {
        const result = { 'info': {} };
        //
        //     {
        //       coinId: '1',
        //       coinName: 'BTC',
        //       available: '0.00099900',
        //       frozen: '0.00000000',
        //       lock: '0.00000000',
        //       uTime: '1661595535000'
        //     }
        //
        // {
        //   'marginCoin': 'USDT',
        //   'locked': '0',
        //   'available': '25',
        //   'crossMaxAvailable': '25',
        //   'fixedMaxAvailable': '25',
        //   'maxTransferOut': '25',
        //   'equity': '25',
        //   'usdtEquity': '25',
        //   'btcEquity': '0.00152089221',
        //   'unrealizedPL': None
        // }
        for (let i = 0; i < balance.length; i++) {
            const entry = balance[i];
            const currencyId = this.safeString2(entry, 'coinId', 'marginCoin');
            const code = this.safeCurrencyCode(currencyId);
            const info = this.safeValue(entry, 'info', {});
            const infoForCode = this.safeValue(info, code, {});
            result['info'][code] = this.deepExtend(infoForCode, entry);
            const account = this.account();
            const free = this.safeString2(entry, 'crossMaxAvailable', 'available', '0');
            const total = this.safeString2(entry, 'equity', 'available', '0');
            const used = Precise["default"].stringSub(total, free);
            account['used'] = used;
            account['free'] = free;
            account['total'] = total;
            result[code] = account;
        }
        return this.safeBalance(result);
    }
    parseOrderStatus(status) {
        const statuses = {
            'new': 'open',
            'init': 'open',
            'full_fill': 'closed',
            'filled': 'closed',
            'not_trigger': 'untriggered',
        };
        return this.safeString(statuses, status, status);
    }
    parseStopTrigger(status) {
        const statuses = {
            'market_price': 'mark',
            'fill_price': 'last',
            'index_price': 'index',
        };
        return this.safeString(statuses, status, status);
    }
    parseOrder(order, market = undefined) {
        //
        // spot
        //     {
        //       accountId: '6394957606',
        //       symbol: 'BTCUSDT_SPBL',
        //       orderId: '881623995442958336',
        //       clientOrderId: '135335e9-b054-4e43-b00a-499f11d3a5cc',
        //       price: '39000.000000000000',
        //       quantity: '0.000700000000',
        //       orderType: 'limit',
        //       side: 'buy',
        //       status: 'new',
        //       fillPrice: '0.000000000000',
        //       fillQuantity: '0.000000000000',
        //       fillTotalAmount: '0.000000000000',
        //       cTime: '1645921460972'
        //     }
        //
        // swap
        //     {
        //       symbol: 'BTCUSDT_UMCBL',
        //       size: 0.001,
        //       orderId: '881640729145409536',
        //       clientOid: '881640729204129792',
        //       filledQty: 0.001,
        //       fee: 0,
        //       price: null,
        //       priceAvg: 38429.5,
        //       state: 'filled',
        //       side: 'open_long',
        //       timeInForce: 'normal',
        //       totalProfits: 0,
        //       posSide: 'long',
        //       marginCoin: 'USDT',
        //       filledAmount: 38.4295,
        //       orderType: 'market',
        //       cTime: '1645925450611',
        //       uTime: '1645925450746'
        //     }
        //
        // stop
        //
        //     {
        //         'orderId': '989690453925896192',
        //       'symbol': 'AAVEUSDT_UMCBL',
        //       'marginCoin': 'USDT',
        //       'size': '0.6',
        //       'executePrice': '0',
        //       'triggerPrice': '54.781',
        //       'status': 'not_trigger',
        //       'orderType': 'market',
        //       'planType': 'normal_plan',
        //       'side': 'open_short',
        //       'triggerType': 'market_price',
        //       'presetTakeProfitPrice': '0',
        //       'presetTakeLossPrice': '0',
        //       'rangeRate': '',
        //       'cTime': '1671686512452'
        //     }
        //
        const marketId = this.safeString(order, 'symbol');
        const instType = this.getSubTypeFromMarketId(marketId);
        market = this.safeMarket(marketId);
        const symbol = market['symbol'];
        const id = this.safeString(order, 'orderId');
        const price = this.safeString2(order, 'price', 'executePrice');
        const amount = this.safeString2(order, 'quantity', 'size');
        const filled = this.safeString2(order, 'fillQuantity', 'filledQty');
        const cost = this.safeString2(order, 'fillTotalAmount', 'filledAmount');
        const average = this.safeString(order, 'fillPrice');
        let type = this.safeString(order, 'orderType');
        const timestamp = this.safeInteger(order, 'cTime');
        const rawStopTrigger = this.safeString(order, 'triggerType');
        const trigger = this.parseStopTrigger(rawStopTrigger);
        let side = this.safeString2(order, 'side', 'posSide');
        let reduce = this.safeValue(order, 'reduceOnly', false);
        let close = reduce;
        const planType = this.safeString(order, 'planType');
        if (planType === 'sl' || planType === 'pos_loss' || planType === 'loss_plan' || planType === 'psl') {
            reduce = true;
            close = true;
        }
        if (side && side.split('_')[0] === 'close') {
            reduce = true;
            close = true;
        }
        if ((side === 'open_long') || (side === 'close_short') || (side === 'buy_single')) {
            side = 'buy';
        }
        else if ((side === 'close_long') || (side === 'open_short') || (side === 'sell_single')) {
            side = 'sell';
        }
        if (rawStopTrigger) {
            if (type === 'market') {
                type = 'stop';
            }
            else {
                type = 'stopLimit';
            }
        }
        else {
            if (type === 'market') {
                type = 'market';
            }
            else {
                type = 'limit';
            }
        }
        const clientOrderId = this.safeString2(order, 'clientOrderId', 'clientOid');
        const fee = undefined;
        const rawStatus = this.safeString2(order, 'status', 'state');
        const status = this.parseOrderStatus(rawStatus);
        const lastTradeTimestamp = this.safeInteger(order, 'uTime');
        const timeInForce = this.safeString(order, 'timeInForce');
        const postOnly = timeInForce === 'postOnly';
        const stopPrice = this.safeNumber(order, 'triggerPrice');
        return this.safeOrder({
            'info': order,
            'id': id,
            'instType': instType,
            'clientOrderId': clientOrderId,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'lastTradeTimestamp': lastTradeTimestamp,
            'symbol': symbol,
            'type': type,
            'timeInForce': 'GTC',
            'postOnly': postOnly,
            'side': side,
            'price': price,
            'stopPrice': stopPrice,
            'average': average,
            'cost': cost,
            'amount': amount,
            'filled': filled,
            'remaining': undefined,
            'status': status,
            'fee': fee,
            'trades': undefined,
            'reduce': reduce,
            'close': close,
            'trigger': trigger, // TEALSTREET
        }, market);
    }
    async createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        /**
         * @method
         * @name bitget#createOrder
         * @description create a trade order
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much of currency you want to trade in units of base currency
         * @param {float|undefined} price the price at which the order is to be fullfilled, in units of the quote currency, ignored in market orders
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/en/latest/manual.html#order-structure}
         */
        // {
        //     'stopPrice': 0.3866,
        //   'timeInForce': 'GTC',
        //   'reduceOnly': None,
        //   'trigger': 'Last',
        //   'closeOnTrigger': True,
        //   'basePrice': 0.3894
        // }
        await this.loadMarkets();
        const market = this.market(symbol);
        const [marketType, query] = this.handleMarketTypeAndParams('createOrder', market, params);
        const triggerPrice = this.safeValue2(params, 'stopPrice', 'triggerPrice');
        const positionMode = this.safeValue(params, 'positionMode', 'hedged');
        let isTriggerOrder = triggerPrice !== undefined;
        let stopLossPrice = undefined;
        let isStopLossOrder = undefined;
        let takeProfitPrice = undefined;
        let isTakeProfitOrder = undefined;
        const reduceOnly = this.safeValue2(params, 'close', 'reduceOnly', false);
        const basePrice = this.safeValue(params, 'basePrice');
        if (triggerPrice !== undefined && basePrice !== undefined) {
            // triggerOrder is NOT stopOrder
            isTriggerOrder = !reduceOnly;
            type = 'market';
            if (!isTriggerOrder) {
                if (side === 'buy') {
                    if (triggerPrice > basePrice) {
                        isStopLossOrder = true;
                        stopLossPrice = triggerPrice;
                    }
                    else {
                        isTakeProfitOrder = true;
                        takeProfitPrice = triggerPrice;
                    }
                }
                else {
                    if (triggerPrice < basePrice) {
                        isStopLossOrder = true;
                        stopLossPrice = triggerPrice;
                    }
                    else {
                        isTakeProfitOrder = true;
                        takeProfitPrice = triggerPrice;
                    }
                }
            }
        }
        else {
            stopLossPrice = this.safeValue(params, 'stopLossPrice');
            isStopLossOrder = stopLossPrice !== undefined;
            takeProfitPrice = this.safeValue(params, 'takeProfitPrice');
            isTakeProfitOrder = takeProfitPrice !== undefined;
        }
        const request = {
            'symbol': market['id'],
            'orderType': type,
        };
        const isMarketOrder = type === 'market';
        const isStopOrder = isStopLossOrder || isTakeProfitOrder;
        if (this.sum(isTriggerOrder, isStopLossOrder, isTakeProfitOrder) > 1) {
            throw new errors.ExchangeError(this.id + ' createOrder() params can only contain one of triggerPrice, stopLossPrice, takeProfitPrice');
        }
        if ((type === 'limit') && (triggerPrice === undefined)) {
            request['price'] = this.priceToPrecision(symbol, price);
        }
        let clientOrderId = this.safeString2(params, 'client_oid', 'clientOrderId');
        if (clientOrderId === undefined) {
            const broker = this.safeValue(this.options, 'brokerId');
            if (broker !== undefined) {
                const brokerId = this.safeString(broker, market['type']);
                if (brokerId !== undefined) {
                    clientOrderId = brokerId + this.uuid22();
                }
            }
        }
        let method = this.getSupportedMapping(marketType, {
            'spot': 'privateSpotPostTradeOrders',
            'swap': 'privateMixPostOrderPlaceOrder',
        });
        const exchangeSpecificParam = this.safeString2(params, 'force', 'timeInForceValue');
        const postOnly = this.isPostOnly(isMarketOrder, exchangeSpecificParam === 'post_only', params);
        if (marketType === 'spot') {
            if (isStopOrder) {
                throw new errors.InvalidOrder(this.id + ' createOrder() does not support stop orders on spot markets, only swap markets');
            }
            const createMarketBuyOrderRequiresPrice = this.safeValue(this.options, 'createMarketBuyOrderRequiresPrice', true);
            if (createMarketBuyOrderRequiresPrice && isMarketOrder && (side === 'buy')) {
                if (price === undefined) {
                    throw new errors.InvalidOrder(this.id + ' createOrder() requires price argument for market buy orders on spot markets to calculate the total amount to spend (amount * price), alternatively set the createMarketBuyOrderRequiresPrice option to false and pass in the cost to spend into the amount parameter');
                }
                else {
                    const amountString = this.numberToString(amount);
                    const priceString = this.numberToString(price);
                    const cost = this.parseNumber(Precise["default"].stringMul(amountString, priceString));
                    request['quantity'] = this.priceToPrecision(symbol, cost);
                }
            }
            else {
                request['quantity'] = this.amountToPrecision(symbol, amount);
            }
            request['clientOrderId'] = clientOrderId;
            request['side'] = side;
            if (postOnly) {
                request['force'] = 'post_only';
            }
            else {
                request['force'] = 'gtc';
            }
        }
        else {
            request['clientOid'] = clientOrderId;
            let isCloseOrder = true;
            if (amount && amount > 0) {
                request['size'] = this.amountToPrecision(symbol, amount);
                isCloseOrder = false;
            }
            if (postOnly) {
                request['timeInForceValue'] = 'post_only';
            }
            if (isTriggerOrder || isStopOrder) {
                let triggerType = this.safeString2(params, 'triggerType', 'trigger', 'fill_price');
                if (triggerType === 'Mark' || triggerType === 'market_price') {
                    triggerType = 'market_price';
                }
                else {
                    triggerType = 'fill_price';
                }
                request['triggerType'] = triggerType;
            }
            if (isTriggerOrder) {
                request['triggerPrice'] = this.priceToPrecision(symbol, triggerPrice);
                if (price) {
                    request['executePrice'] = this.priceToPrecision(symbol, price);
                }
                method = 'privateMixPostPlanPlacePlan';
            }
            if (isStopOrder) {
                if (!isMarketOrder) {
                    throw new errors.ExchangeError(this.id + ' createOrder() bitget stopLoss or takeProfit orders must be market orders');
                }
                if (isStopLossOrder) {
                    request['triggerPrice'] = this.priceToPrecision(symbol, stopLossPrice);
                    request['planType'] = 'loss_plan';
                }
                else if (isTakeProfitOrder) {
                    request['triggerPrice'] = this.priceToPrecision(symbol, takeProfitPrice);
                    request['planType'] = 'profit_plan';
                }
                request['holdSide'] = (side === 'buy') ? 'short' : 'long';
                if (isCloseOrder) {
                    method = 'privateMixPostPlanPlacePositionsTPSL';
                }
                else {
                    method = 'privateMixPostPlanPlaceTPSL';
                }
            }
            else {
                if (positionMode === 'oneway') {
                    request['side'] = (side === 'buy') ? 'buy_single' : 'sell_single';
                    if (reduceOnly) {
                        request['reduceOnly'] = true;
                    }
                }
                else {
                    if (reduceOnly) {
                        request['side'] = (side === 'buy') ? 'close_short' : 'close_long';
                    }
                    else {
                        request['side'] = (side === 'buy') ? 'open_long' : 'open_short';
                    }
                }
                if (reduceOnly) {
                    request['cancelOrder'] = true;
                }
            }
            request['marginCoin'] = market['settleId'];
        }
        const omitted = this.omit(query, ['stopPrice', 'triggerType', 'stopLossPrice', 'takeProfitPrice', 'postOnly', 'positionMode', 'marginMode', 'reduceOnly', 'close']);
        const response = await this[method](this.extend(request, omitted));
        //
        //     {
        //         "code": "00000",
        //         "msg": "success",
        //         "requestTime": 1645932209602,
        //         "data": {
        //             "orderId": "881669078313766912",
        //             "clientOrderId": "iauIBf#a45b595f96474d888d0ada"
        //         }
        //     }
        //
        const data = this.safeValue(response, 'data');
        return this.parseOrder(data, market);
    }
    async cancelOrder(id, symbol = undefined, params = {}) {
        /**
         * @method
         * @name bitget#cancelOrder
         * @description cancels an open order
         * @param {string} id order id
         * @param {string} symbol unified symbol of the market the order was made in
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} An [order structure]{@link https://docs.ccxt.com/en/latest/manual.html#order-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' cancelOrder() requires a symbol argument for spot orders');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        // const orderType = this.safeString (params, 'type');
        params = this.omit(params, ['type']);
        const [marketType, query] = this.handleMarketTypeAndParams('cancelOrder', market, params);
        let method = this.getSupportedMapping(marketType, {
            'spot': 'privateSpotPostTradeCancelOrder',
            'swap': 'privateMixPostOrderCancelOrder',
        });
        const stop = this.safeValue(params, 'stop');
        let planType = this.safeString(params, 'planType');
        const idComponents = id.split(':');
        const formattedId = idComponents[0];
        if (!planType && (idComponents.length > 1)) {
            planType = idComponents[1];
        }
        const request = {
            'symbol': market['id'],
            'orderId': formattedId,
        };
        if (stop || planType) {
            if (planType === undefined) {
                throw new errors.ArgumentsRequired(this.id + ' cancelOrder() requires a planType parameter for stop orders, either normal_plan, profit_plan or loss_plan');
            }
            request['planType'] = planType;
            method = 'privateMixPostPlanCancelPlan';
            params = this.omit(params, ['stop', 'planType']);
        }
        if (marketType === 'swap') {
            request['marginCoin'] = market['settleId'];
        }
        const response = await this[method](this.extend(request, query));
        return this.parseOrder(response, market);
    }
    async cancelOrders(ids, symbol = undefined, params = {}) {
        /**
         * @method
         * @name bitget#cancelOrders
         * @description cancel multiple orders
         * @param {[string]} ids order ids
         * @param {string} symbol unified market symbol, default is undefined
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} an list of [order structures]{@link https://docs.ccxt.com/en/latest/manual.html#order-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' cancelOrders() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const type = this.safeString(params, 'type', market['type']);
        if (type === undefined) {
            throw new errors.ArgumentsRequired(this.id + " cancelOrders() requires a type parameter (one of 'spot', 'swap').");
        }
        params = this.omit(params, 'type');
        const request = {};
        let method = undefined;
        if (type === 'spot') {
            method = 'apiPostOrderOrdersBatchcancel';
            request['method'] = 'batchcancel';
            const jsonIds = this.json(ids);
            const parts = jsonIds.split('"');
            request['order_ids'] = parts.join('');
        }
        else if (type === 'swap') {
            method = 'privateMixPostOrderCancelBatchOrders';
            request['symbol'] = market['id'];
            request['marginCoin'] = market['quote'];
            request['orderIds'] = ids;
        }
        const response = await this[method](this.extend(request, params));
        //
        //     spot
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "success": [
        //                 "673451224205135872",
        //             ],
        //             "failed": [
        //                 {
        //                 "err-msg": "invalid record",
        //                 "order-id": "673451224205135873",
        //                 "err-code": "base record invalid"
        //                 }
        //             ]
        //         }
        //     }
        //
        //     swap
        //
        //     {
        //         "result":true,
        //         "symbol":"cmt_btcusdt",
        //         "order_ids":[
        //             "258414711",
        //             "478585558"
        //         ],
        //         "fail_infos":[
        //             {
        //                 "order_id":"258414711",
        //                 "err_code":"401",
        //                 "err_msg":""
        //             }
        //         ]
        //     }
        //
        return response;
    }
    async cancelAllOrders(symbol = undefined, params = {}) {
        /**
         * @method
         * @name bitget#cancelAllOrders
         * @description cancel all open orders
         * @see https://bitgetlimited.github.io/apidoc/en/mix/#cancel-all-order
         * @see https://bitgetlimited.github.io/apidoc/en/mix/#cancel-all-trigger-order-tpsl
         * @param {string|undefined} symbol unified market symbol
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @param {string} params.code marginCoin unified currency code
         * @returns {[object]} a list of [order structures]{@link https://docs.ccxt.com/en/latest/manual.html#order-structure}
         */
        await this.loadMarkets();
        const market = undefined;
        const defaultSubType = this.safeString(this.options, 'defaultSubType');
        if (symbol !== undefined) {
            return await this.cancelAllOrdersForSymbol(symbol, params);
        }
        const productType = (defaultSubType === 'linear') ? 'UMCBL' : 'DMCBL';
        const [marketType, query] = this.handleMarketTypeAndParams('cancelAllOrders', market, params);
        if (marketType === 'spot') {
            throw new errors.NotSupported(this.id + ' cancelAllOrders () does not support spot markets');
        }
        const request = {
            'productType': productType,
        };
        let method = undefined;
        const stop = this.safeValue(params, 'stop');
        const planType = this.safeString(params, 'planType');
        if (stop !== undefined || planType !== undefined) {
            if (planType === undefined) {
                throw new errors.ArgumentsRequired(this.id + ' cancelOrder() requires a planType parameter for stop orders, either normal_plan, profit_plan, loss_plan, pos_profit, pos_loss, moving_plan or track_plan');
            }
            method = 'privateMixPostPlanCancelAllPlan';
            params = this.omit(params, ['stop']);
        }
        else {
            const code = this.safeString2(params, 'code', 'marginCoin');
            if (code === undefined) {
                throw new errors.ArgumentsRequired(this.id + ' cancelAllOrders () requires a code argument [marginCoin] in the params');
            }
            const currency = this.currency(code);
            request['marginCoin'] = this.safeCurrencyCode(code, currency);
            method = 'privateMixPostOrderCancelAllOrders';
        }
        params = this.omit(query, ['code', 'marginCoin']);
        const response = await this[method](this.extend(request, params));
        //
        //     {
        //         "code": "00000",
        //         "msg": "success",
        //         "requestTime": 1663312535998,
        //         "data": {
        //             "result": true,
        //             "order_ids": ["954564352813969409"],
        //             "fail_infos": [
        //                 {
        //                     "order_id": "",
        //                     "err_code": "",
        //                     "err_msg": ""
        //                 }
        //             ]
        //         }
        //     }
        //
        return response;
    }
    async cancelAllOrdersForSymbol(symbol, params = {}) {
        const market = this.market(symbol);
        const ordersForSymbol = await this.fetchOpenOrders(symbol);
        const orderIds = this.pluck(ordersForSymbol, 'id');
        const request = {
            'symbol': market['id'],
            'orderIds': orderIds,
            'marginCoin': market['settleId'],
        };
        return await this.privateMixPostOrderCancelBatchOrders(this.extend(request, params));
    }
    async fetchOrder(id, symbol = undefined, params = {}) {
        /**
         * @method
         * @name bitget#fetchOrder
         * @description fetches information on an order made by the user
         * @param {string} symbol unified symbol of the market the order was made in
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} An [order structure]{@link https://docs.ccxt.com/en/latest/manual.html#order-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchOrder() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const [marketType, query] = this.handleMarketTypeAndParams('fetchOrder', market, params);
        const method = this.getSupportedMapping(marketType, {
            'spot': 'privateSpotPostTradeOrderInfo',
            'swap': 'privateMixGetOrderDetail',
        });
        const request = {
            'symbol': market['id'],
            'orderId': id,
        };
        const response = await this[method](this.extend(request, query));
        // spot
        //     {
        //       code: '00000',
        //       msg: 'success',
        //       requestTime: '1645926849436',
        //       data: [
        //         {
        //           accountId: '6394957606',
        //           symbol: 'BTCUSDT_SPBL',
        //           orderId: '881626139738935296',
        //           clientOrderId: '525890c8-767e-4cd6-8585-38160ed7bb5e',
        //           price: '38000.000000000000',
        //           quantity: '0.000700000000',
        //           orderType: 'limit',
        //           side: 'buy',
        //           status: 'new',
        //           fillPrice: '0.000000000000',
        //           fillQuantity: '0.000000000000',
        //           fillTotalAmount: '0.000000000000',
        //           cTime: '1645921972212'
        //         }
        //       ]
        //     }
        //
        // swap
        //     {
        //       code: '00000',
        //       msg: 'success',
        //       requestTime: '1645926587877',
        //       data: {
        //         symbol: 'BTCUSDT_UMCBL',
        //         size: '0.001',
        //         orderId: '881640729145409536',
        //         clientOid: '881640729204129792',
        //         filledQty: '0.001',
        //         fee: '0E-8',
        //         price: null,
        //         priceAvg: '38429.50',
        //         state: 'filled',
        //         side: 'open_long',
        //         timeInForce: 'normal',
        //         totalProfits: '0E-8',
        //         posSide: 'long',
        //         marginCoin: 'USDT',
        //         filledAmount: '38.4295',
        //         orderType: 'market',
        //         cTime: '1645925450611',
        //         uTime: '1645925450746'
        //       }
        //     }
        //
        const data = this.safeValue(response, 'data');
        const first = this.safeValue(data, 0, data);
        return this.parseOrder(first, market);
    }
    async fetchOpenOrders2(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bitget#fetchOpenOrders
         * @description fetch all unfilled currently open orders
         * @param {string} symbol unified market symbol
         * @param {int|undefined} since the earliest time in ms to fetch open orders for
         * @param {int|undefined} limit the maximum number of  open orders structures to retrieve
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {[object]} a list of [order structures]{@link https://docs.ccxt.com/en/latest/manual.html#order-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchOpenOrders() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const [marketType, query] = this.handleMarketTypeAndParams('fetchOpenOrders', market, params);
        const request = {
            'symbol': market['id'],
        };
        let method = this.getSupportedMapping(marketType, {
            'spot': 'privateSpotPostTradeOpenOrders',
            'swap': 'privateMixGetOrderCurrent',
        });
        const stop = this.safeValue(params, 'stop');
        if (stop) {
            method = 'privateMixGetPlanCurrentPlan';
            params = this.omit(params, 'stop');
        }
        const response = await this[method](this.extend(request, query));
        //
        //  spot
        //     {
        //       code: '00000',
        //       msg: 'success',
        //       requestTime: 1645921640193,
        //       data: [
        //         {
        //           accountId: '6394957606',
        //           symbol: 'BTCUSDT_SPBL',
        //           orderId: '881623995442958336',
        //           clientOrderId: '135335e9-b054-4e43-b00a-499f11d3a5cc',
        //           price: '39000.000000000000',
        //           quantity: '0.000700000000',
        //           orderType: 'limit',
        //           side: 'buy',
        //           status: 'new',
        //           fillPrice: '0.000000000000',
        //           fillQuantity: '0.000000000000',
        //           fillTotalAmount: '0.000000000000',
        //           cTime: '1645921460972'
        //         }
        //       ]
        //     }
        //
        // swap
        //     {
        //       code: '00000',
        //       msg: 'success',
        //       requestTime: 1645922324630,
        //       data: [
        //         {
        //           symbol: 'BTCUSDT_UMCBL',
        //           size: 0.001,
        //           orderId: '881627074081226752',
        //           clientOid: '881627074160918528',
        //           filledQty: 0,
        //           fee: 0,
        //           price: 38000,
        //           state: 'new',
        //           side: 'open_long',
        //           timeInForce: 'normal',
        //           totalProfits: 0,
        //           posSide: 'long',
        //           marginCoin: 'USDT',
        //           filledAmount: 0,
        //           orderType: 'limit',
        //           cTime: '1645922194995',
        //           uTime: '1645922194995'
        //         }
        //       ]
        //     }
        //
        // stop
        //
        //     {
        //         "code": "00000",
        //         "msg": "success",
        //         "requestTime": 1652745815697,
        //         "data": [
        //             {
        //                 "orderId": "910246821491617792",
        //                 "symbol": "BTCUSDT_UMCBL",
        //                 "marginCoin": "USDT",
        //                 "size": "16",
        //                 "executePrice": "20000",
        //                 "triggerPrice": "24000",
        //                 "status": "not_trigger",
        //                 "orderType": "limit",
        //                 "planType": "normal_plan",
        //                 "side": "open_long",
        //                 "triggerType": "market_price",
        //                 "presetTakeProfitPrice": "0",
        //                 "presetTakeLossPrice": "0",
        //                 "cTime": "1652745674488"
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue(response, 'data', []);
        return this.parseOrders(data, market, since, limit);
    }
    async fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bitget#fetchClosedOrders
         * @description fetches information on multiple closed orders made by the user
         * @param {string} symbol unified market symbol of the market orders were made in
         * @param {int|undefined} since the earliest time in ms to fetch orders for
         * @param {int|undefined} limit the maximum number of  orde structures to retrieve
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {[object]} a list of [order structures]{@link https://docs.ccxt.com/en/latest/manual.html#order-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchClosedOrders() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const [marketType, query] = this.handleMarketTypeAndParams('fetchClosedOrders', market, params);
        const request = {
            'symbol': market['id'],
        };
        const method = this.getSupportedMapping(marketType, {
            'spot': 'privateSpotPostTradeHistory',
            'swap': 'privateMixGetOrderHistory',
        });
        if (marketType === 'swap') {
            if (limit === undefined) {
                limit = 100;
            }
            request['pageSize'] = limit;
            if (since === undefined) {
                since = 0;
            }
            request['startTime'] = since;
            request['endTime'] = this.milliseconds();
        }
        const response = await this[method](this.extend(request, query));
        //
        //  spot
        //     {
        //       code: '00000',
        //       msg: 'success',
        //       requestTime: 1645925335553,
        //       data: [
        //         {
        //           accountId: '6394957606',
        //           symbol: 'BTCUSDT_SPBL',
        //           orderId: '881623995442958336',
        //           clientOrderId: '135335e9-b054-4e43-b00a-499f11d3a5cc',
        //           price: '39000.000000000000',
        //           quantity: '0.000700000000',
        //           orderType: 'limit',
        //           side: 'buy',
        //           status: 'full_fill',
        //           fillPrice: '39000.000000000000',
        //           fillQuantity: '0.000700000000',
        //           fillTotalAmount: '27.300000000000',
        //           cTime: '1645921460972'
        //         }
        //       ]
        //     }
        //
        // swap
        //     {
        //       code: '00000',
        //       msg: 'success',
        //       requestTime: 1645925688701,
        //       data: {
        //         nextFlag: false,
        //         endId: '881640729145409536',
        //         orderList: [
        //           {
        //             symbol: 'BTCUSDT_UMCBL',
        //             size: 0.001,
        //             orderId: '881640729145409536',
        //             clientOid: '881640729204129792',
        //             filledQty: 0.001,
        //             fee: 0,
        //             price: null,
        //             priceAvg: 38429.5,
        //             state: 'filled',
        //             side: 'open_long',
        //             timeInForce: 'normal',
        //             totalProfits: 0,
        //             posSide: 'long',
        //             marginCoin: 'USDT',
        //             filledAmount: 38.4295,
        //             orderType: 'market',
        //             cTime: '1645925450611',
        //             uTime: '1645925450746'
        //           }
        //         ]
        //       }
        //     }
        //
        const data = this.safeValue(response, 'data');
        const orderList = this.safeValue(data, 'orderList', data);
        return this.parseOrders(orderList, market, since, limit);
    }
    async fetchLedger(code = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bitget#fetchLedger
         * @description fetch the history of changes, actions done by the user or operations that altered balance of the user
         * @param {string|undefined} code unified currency code, default is undefined
         * @param {int|undefined} since timestamp in ms of the earliest ledger entry, default is undefined
         * @param {int|undefined} limit max number of ledger entrys to return, default is undefined
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} a [ledger structure]{@link https://docs.ccxt.com/en/latest/manual.html#ledger-structure}
         */
        await this.loadMarkets();
        let currency = undefined;
        const request = {};
        if (code !== undefined) {
            currency = this.currency(code);
            request['coinId'] = currency['id'];
        }
        const response = await this.privateSpotPostAccountBills(this.extend(request, params));
        //
        //     {
        //       code: '00000',
        //       msg: 'success',
        //       requestTime: '1645929886887',
        //       data: [
        //         {
        //           billId: '881626974170554368',
        //           coinId: '2',
        //           coinName: 'USDT',
        //           groupType: 'transfer',
        //           bizType: 'transfer-out',
        //           quantity: '-10.00000000',
        //           balance: '73.36005300',
        //           fees: '0.00000000',
        //           cTime: '1645922171146'
        //         }
        //       ]
        //     }
        //
        const data = this.safeValue(response, 'data');
        return this.parseLedger(data, currency, since, limit);
    }
    parseLedgerEntry(item, currency = undefined) {
        //
        //     {
        //       billId: '881626974170554368',
        //       coinId: '2',
        //       coinName: 'USDT',
        //       groupType: 'transfer',
        //       bizType: 'transfer-out',
        //       quantity: '-10.00000000',
        //       balance: '73.36005300',
        //       fees: '0.00000000',
        //       cTime: '1645922171146'
        //     }
        //
        const id = this.safeString(item, 'billId');
        const currencyId = this.safeString(item, 'coinId');
        const code = this.safeCurrencyCode(currencyId);
        const amount = this.parseNumber(Precise["default"].stringAbs(this.safeString(item, 'quantity')));
        const timestamp = this.safeInteger(item, 'cTime');
        const bizType = this.safeString(item, 'bizType');
        let direction = undefined;
        if (bizType !== undefined && bizType.indexOf('-') >= 0) {
            const parts = bizType.split('-');
            direction = parts[1];
        }
        const type = this.safeString(item, 'groupType');
        const fee = this.safeNumber(item, 'fees');
        const after = this.safeNumber(item, 'balance');
        return {
            'info': item,
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'direction': direction,
            'account': undefined,
            'referenceId': undefined,
            'referenceAccount': undefined,
            'type': type,
            'currency': code,
            'amount': amount,
            'before': undefined,
            'after': after,
            'status': undefined,
            'fee': fee,
        };
    }
    async fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bitget#fetchMyTrades
         * @description fetch all trades made by the user
         * @param {string} symbol unified market symbol
         * @param {int|undefined} since the earliest time in ms to fetch trades for
         * @param {int|undefined} limit the maximum number of trades structures to retrieve
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {[object]} a list of [trade structures]{@link https://docs.ccxt.com/en/latest/manual.html#trade-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchMyTrades() requires a symbol argument');
        }
        this.checkRequiredSymbol('fetchMyTrades', symbol);
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
            'pageSize': 20,
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        request['endTime'] = this.milliseconds().toString();
        const response = await this.privateMixGetOrderHistory(this.extend(request, params));
        // {
        //     "symbol": "SOLUSDT_UMCBL",
        //     "size": 1,
        //     "orderId": "963544804144852112",
        //     "clientOid": "963544804144852113",
        //     "filledQty": 1,
        //     "fee": -0.00629204,
        //     "price": 31.4602,
        //     "priceAvg": 31.4602,
        //     "state": "filled",
        //     "side": "close_short",
        //     "timeInForce": "normal",
        //     "totalProfits": 0.00760000,
        //     "posSide": "short",
        //     "marginCoin": "USDT",
        //     "filledAmount": 31.4602,
        //     "orderType": "limit",
        //     "leverage": "5",
        //     "marginMode": "crossed",
        //     "reduceOnly": false,
        //     "enterPointSource": "WEB",
        //     "tradeSide": "open_long",
        //     "holdMode": "double_hold",
        //     "cTime": "1665452903781",
        //     "uTime": "1665452917467"
        // }
        const data = this.safeValue(response, 'data');
        const orderList = this.safeValue(data, 'orderList', []);
        return this.parseTrades(orderList, market, since, limit);
    }
    async fetchOrderTrades(id, symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bitget#fetchOrderTrades
         * @description fetch all the trades made from a single order
         * @param {string} id order id
         * @param {string} symbol unified market symbol
         * @param {int|undefined} since the earliest time in ms to fetch trades for
         * @param {int|undefined} limit the maximum number of trades to retrieve
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {[object]} a list of [trade structures]{@link https://docs.ccxt.com/en/latest/manual.html#trade-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchOrderTrades() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const [marketType, query] = this.handleMarketTypeAndParams('fetchOrderTrades', market, params);
        const method = this.getSupportedMapping(marketType, {
            'spot': 'privateSpotPostTradeFills',
            'swap': 'privateMixGetOrderFills',
        });
        const request = {
            'symbol': market['id'],
            'orderId': id,
        };
        const response = await this[method](this.extend(request, query));
        // spot
        //
        // swap
        //     {
        //       code: '00000',
        //       msg: 'success',
        //       requestTime: 1645927862710,
        //       data: [
        //         {
        //           tradeId: '881640729552281602',
        //           symbol: 'BTCUSDT_UMCBL',
        //           orderId: '881640729145409536',
        //           price: '38429.50',
        //           sizeQty: '0.001',
        //           fee: '0',
        //           side: 'open_long',
        //           fillAmount: '38.4295',
        //           profit: '0',
        //           cTime: '1645925450694'
        //         }
        //       ]
        //     }
        //
        const data = this.safeValue(response, 'data');
        return await this.parseTrades(data, market, since, limit);
    }
    async fetchPosition(symbol, params = {}) {
        /**
         * @method
         * @name bitget#fetchPosition
         * @description fetch data on a single open contract trade position
         * @param {string} symbol unified market symbol of the market the position is held in, default is undefined
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} a [position structure]{@link https://docs.ccxt.com/en/latest/manual.html#position-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
            'marginCoin': market['settleId'],
        };
        const response = await this.privateMixGetPositionSinglePosition(this.extend(request, params));
        //
        //     {
        //       code: '00000',
        //       msg: 'success',
        //       requestTime: '1645933957584',
        //       data: [
        //         {
        //           marginCoin: 'USDT',
        //           symbol: 'BTCUSDT_UMCBL',
        //           holdSide: 'long',
        //           openDelegateCount: '0',
        //           margin: '1.921475',
        //           available: '0.001',
        //           locked: '0',
        //           total: '0.001',
        //           leverage: '20',
        //           achievedProfits: '0',
        //           averageOpenPrice: '38429.5',
        //           marginMode: 'fixed',
        //           holdMode: 'double_hold',
        //           unrealizedPL: '0.1634',
        //           liquidationPrice: '0',
        //           keepMarginRate: '0.004',
        //           cTime: '1645922194988'
        //         }
        //       ]
        //     }
        //
        const data = this.safeValue(response, 'data', []);
        return this.parsePosition(data[0], market);
    }
    async fetchPositions(symbols = undefined, params = {}) {
        /**
         * @method
         * @name bitget#fetchPositions
         * @description fetch all open positions
         * @param {[string]|undefined} symbols list of unified market symbols
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {[object]} a list of [position structure]{@link https://docs.ccxt.com/en/latest/manual.html#position-structure}
         */
        await this.loadMarkets();
        const defaultSubType = this.safeString(this.options, 'defaultSubType');
        const request = {
            'productType': (defaultSubType === 'linear') ? 'UMCBL' : 'DMCBL',
        };
        const response = await this.privateMixGetPositionAllPosition(this.extend(request, params));
        //
        //     {
        //       code: '00000',
        //       msg: 'success',
        //       requestTime: '1645933905060',
        //       data: [
        //         {
        //           marginCoin: 'USDT',
        //           symbol: 'BTCUSDT_UMCBL',
        //           holdSide: 'long',
        //           openDelegateCount: '0',
        //           margin: '1.921475',
        //           available: '0.001',
        //           locked: '0',
        //           total: '0.001',
        //           leverage: '20',
        //           achievedProfits: '0',
        //           averageOpenPrice: '38429.5',
        //           marginMode: 'fixed',
        //           holdMode: 'double_hold',
        //           unrealizedPL: '0.14869',
        //           liquidationPrice: '0',
        //           keepMarginRate: '0.004',
        //           cTime: '1645922194988'
        //         }
        //       ]
        //     }
        //
        const position = this.safeValue(response, 'data', []);
        const result = [];
        for (let i = 0; i < position.length; i++) {
            result.push(this.parsePosition(position[i]));
        }
        symbols = this.marketSymbols(symbols);
        return this.filterByArray(result, 'symbol', symbols, false);
    }
    parsePosition(position, market = undefined) {
        //
        //     {
        //         marginCoin: 'USDT',
        //         symbol: 'BTCUSDT_UMCBL',
        //         holdSide: 'long',
        //         openDelegateCount: '0',
        //         margin: '1.921475',
        //         available: '0.001',
        //         locked: '0',
        //         total: '0.001',
        //         leverage: '20',
        //         achievedProfits: '0',
        //         averageOpenPrice: '38429.5',
        //         marginMode: 'fixed',
        //         holdMode: 'double_hold',
        //         unrealizedPL: '0.14869',
        //         liquidationPrice: '0',
        //         keepMarginRate: '0.004',
        //         cTime: '1645922194988'
        //     }
        //
        const marketId = this.safeString(position, 'symbol');
        const instType = this.getSubTypeFromMarketId(marketId);
        market = this.safeMarket(marketId, market);
        const timestamp = this.safeInteger(position, 'cTime');
        let marginMode = this.safeString(position, 'marginMode');
        if (marginMode === 'fixed') {
            marginMode = 'isolated';
        }
        else if (marginMode === 'crossed') {
            marginMode = 'cross';
        }
        let hedged = this.safeString(position, 'holdMode');
        if (hedged === 'double_hold') {
            hedged = true;
        }
        else if (hedged === 'single_hold') {
            hedged = false;
        }
        const side = this.safeString(position, 'holdSide');
        let contracts = this.safeFloat2(position, 'total', 'openDelegateCount');
        let liquidation = this.safeNumber2(position, 'liquidationPrice', 'liqPx');
        if (contracts === 0) {
            contracts = undefined;
        }
        else if (side === 'short' && contracts > 0) {
            contracts = -1 * contracts;
        }
        if (liquidation === 0) {
            liquidation = undefined;
        }
        const initialMargin = this.safeNumber(position, 'margin');
        const markPrice = this.safeNumber(position, 'markPrice');
        return {
            'info': position,
            'id': market['symbol'] + ':' + side,
            'instType': instType,
            'symbol': market['symbol'],
            'notional': undefined,
            'marginMode': marginMode,
            'liquidationPrice': liquidation,
            'entryPrice': this.safeNumber(position, 'averageOpenPrice'),
            'unrealizedPnl': this.safeNumber(position, 'upl'),
            'realizedPnl': this.safeNumber(position, 'achievedProfits'),
            'percentage': undefined,
            'contracts': contracts,
            'contractSize': this.safeNumber(position, 'total'),
            'markPrice': markPrice,
            'side': side,
            'hedged': hedged,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'maintenanceMargin': undefined,
            'maintenanceMarginPercentage': this.safeNumber(position, 'keepMarginRate'),
            'collateral': this.safeNumber(position, 'margin'),
            'initialMargin': initialMargin,
            'initialMarginPercentage': undefined,
            'leverage': this.safeNumber(position, 'leverage'),
            'marginRatio': undefined,
        };
    }
    async fetchFundingRateHistory(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bitget#fetchFundingRateHistory
         * @description fetches historical funding rate prices
         * @param {string|undefined} symbol unified symbol of the market to fetch the funding rate history for
         * @param {int|undefined} since timestamp in ms of the earliest funding rate to fetch
         * @param {int|undefined} limit the maximum amount of [funding rate structures]{@link https://docs.ccxt.com/en/latest/manual.html?#funding-rate-history-structure} to fetch
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {[object]} a list of [funding rate structures]{@link https://docs.ccxt.com/en/latest/manual.html?#funding-rate-history-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchFundingRateHistory() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
            // 'pageSize': limit, // default 20
            // 'pageNo': 1,
            // 'nextPage': false,
        };
        if (limit !== undefined) {
            request['pageSize'] = limit;
        }
        const response = await this.publicMixGetMarketHistoryFundRate(this.extend(request, params));
        //
        //     {
        //         "code": "00000",
        //         "msg": "success",
        //         "requestTime": 1652406728393,
        //         "data": [
        //             {
        //                 "symbol": "BTCUSDT",
        //                 "fundingRate": "-0.0003",
        //                 "settleTime": "1652396400000"
        //             },
        //         ]
        //     }
        //
        const data = this.safeValue(response, 'data', []);
        const rates = [];
        for (let i = 0; i < data.length; i++) {
            const entry = data[i];
            const marketId = this.safeString(entry, 'symbol');
            const symbol = this.safeSymbol(marketId, market);
            const timestamp = this.safeInteger(entry, 'settleTime');
            rates.push({
                'info': entry,
                'symbol': symbol,
                'fundingRate': this.safeString(entry, 'fundingRate'),
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
            });
        }
        const sorted = this.sortBy(rates, 'timestamp');
        return this.filterBySymbolSinceLimit(sorted, market['symbol'], since, limit);
    }
    async fetchFundingRate(symbol, params = {}) {
        /**
         * @method
         * @name bitget#fetchFundingRate
         * @description fetch the current funding rate
         * @param {string} symbol unified market symbol
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} a [funding rate structure]{@link https://docs.ccxt.com/en/latest/manual.html#funding-rate-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        if (!market['swap']) {
            throw new errors.BadSymbol(this.id + ' fetchFundingRate() supports swap contracts only');
        }
        const request = {
            'symbol': market['id'],
        };
        const response = await this.publicMixGetMarketCurrentFundRate(this.extend(request, params));
        //
        //     {
        //         "code": "00000",
        //         "msg": "success",
        //         "requestTime": 1652401684275,
        //         "data": {
        //             "symbol": "BTCUSDT_UMCBL",
        //             "fundingRate": "-0.000182"
        //         }
        //     }
        //
        const data = this.safeValue(response, 'data', {});
        return this.parseFundingRate(data, market);
    }
    parseFundingRate(contract, market = undefined) {
        //
        //     {
        //         "symbol": "BTCUSDT_UMCBL",
        //         "fundingRate": "-0.000182"
        //     }
        //
        const marketId = this.safeString(contract, 'symbol');
        const symbol = this.safeSymbol(marketId, market);
        return {
            'info': contract,
            'symbol': symbol,
            'markPrice': undefined,
            'indexPrice': undefined,
            'interestRate': undefined,
            'estimatedSettlePrice': undefined,
            'timestamp': undefined,
            'datetime': undefined,
            'fundingRate': this.safeNumber(contract, 'fundingRate'),
            'fundingTimestamp': undefined,
            'fundingDatetime': undefined,
            'nextFundingRate': undefined,
            'nextFundingTimestamp': undefined,
            'nextFundingDatetime': undefined,
            'previousFundingRate': undefined,
            'previousFundingTimestamp': undefined,
            'previousFundingDatetime': undefined,
        };
    }
    async modifyMarginHelper(symbol, amount, type, params = {}) {
        await this.loadMarkets();
        const holdSide = this.safeString(params, 'holdSide');
        const market = this.market(symbol);
        const marginCoin = (market['linear']) ? market['quote'] : market['base'];
        const request = {
            'symbol': market['id'],
            'marginCoin': marginCoin,
            'amount': this.amountToPrecision(symbol, amount),
            'holdSide': holdSide, // long or short
        };
        params = this.omit(params, 'holdSide');
        const response = await this.privateMixPostAccountSetMargin(this.extend(request, params));
        //
        //     {
        //         "code": "00000",
        //         "msg": "success",
        //         "requestTime": 1652483636792,
        //         "data": {
        //             "result": true
        //         }
        //     }
        //
        return this.extend(this.parseMarginModification(response, market), {
            'amount': this.parseNumber(amount),
            'type': type,
        });
    }
    parseMarginModification(data, market = undefined) {
        const errorCode = this.safeString(data, 'code');
        const status = (errorCode === '00000') ? 'ok' : 'failed';
        const code = (market['linear']) ? market['quote'] : market['base'];
        return {
            'info': data,
            'type': undefined,
            'amount': undefined,
            'code': code,
            'symbol': market['symbol'],
            'status': status,
        };
    }
    async reduceMargin(symbol, amount, params = {}) {
        /**
         * @method
         * @name bitget#reduceMargin
         * @description remove margin from a position
         * @param {string} symbol unified market symbol
         * @param {float} amount the amount of margin to remove
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} a [margin structure]{@link https://docs.ccxt.com/en/latest/manual.html#reduce-margin-structure}
         */
        if (amount > 0) {
            throw new errors.BadRequest(this.id + ' reduceMargin() amount parameter must be a negative value');
        }
        const holdSide = this.safeString(params, 'holdSide');
        if (holdSide === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' reduceMargin() requires a holdSide parameter, either long or short');
        }
        return await this.modifyMarginHelper(symbol, amount, 'reduce', params);
    }
    async addMargin(symbol, amount, params = {}) {
        /**
         * @method
         * @name bitget#addMargin
         * @description add margin
         * @param {string} symbol unified market symbol
         * @param {float} amount amount of margin to add
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} a [margin structure]{@link https://docs.ccxt.com/en/latest/manual.html#add-margin-structure}
         */
        const holdSide = this.safeString(params, 'holdSide');
        if (holdSide === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' addMargin() requires a holdSide parameter, either long or short');
        }
        return await this.modifyMarginHelper(symbol, amount, 'add', params);
    }
    async fetchLeverage(symbol, params = {}) {
        /**
         * @method
         * @name bitget#fetchLeverage
         * @description fetch the set leverage for a market
         * @param {string} symbol unified market symbol
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} a [leverage structure]{@link https://docs.ccxt.com/en/latest/manual.html#leverage-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.publicMixGetMarketSymbolLeverage(this.extend(request, params));
        //
        //     {
        //         "code": "00000",
        //         "msg": "success",
        //         "requestTime": 1652347673483,
        //         "data": {
        //             "symbol": "BTCUSDT_UMCBL",
        //             "minLeverage": "1",
        //             "maxLeverage": "125"
        //         }
        //     }
        //
        return response;
    }
    async setLeverage(leverage, symbol = undefined, params = {}) {
        /**
         * @method
         * @name bitget#setLeverage
         * @description set the level of leverage for a market
         * @param {float} leverage the rate of leverage
         * @param {string} symbol unified market symbol
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} response from the exchange
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' setLeverage() requires a symbol argument');
        }
        const buyLeverage = this.safeNumber(params, 'buyLeverage', leverage);
        const sellLeverage = this.safeNumber(params, 'sellLeverage', leverage);
        await this.loadMarkets();
        const market = this.market(symbol);
        const marginMode = this.safeString(params, 'marginMode');
        params = this.omit(params, ['marginMode', 'positionMode']);
        if (marginMode === 'isolated') {
            let promises = [];
            const request = {
                'symbol': market['id'],
                'marginCoin': market['settleId'],
            };
            if (buyLeverage !== undefined) {
                request['leverage'] = buyLeverage;
                request['holdSide'] = 'long';
                promises.push(this.privateMixPostAccountSetLeverage(this.extend(request, params)));
            }
            if (sellLeverage !== undefined) {
                request['leverage'] = sellLeverage;
                request['holdSide'] = 'short';
                promises.push(this.privateMixPostAccountSetLeverage(this.extend(request, params)));
            }
            promises = await Promise.all(promises);
            if (promises.length === 1) {
                return promises[0];
            }
            else {
                return promises;
            }
        }
        else {
            const request = {
                'symbol': market['id'],
                'marginCoin': market['settleId'],
                'leverage': buyLeverage,
                // 'holdSide': 'long',
            };
            return await this.privateMixPostAccountSetLeverage(this.extend(request, params));
        }
    }
    async switchIsolated(symbol, isIsolated, buyLeverage, sellLeverage, params = {}) {
        if (isIsolated) {
            await this.setMarginMode('fixed', symbol, params);
        }
        else {
            await this.setMarginMode('crossed', symbol, params);
        }
    }
    async setMarginMode(marginMode, symbol = undefined, params = {}) {
        /**
         * @method
         * @name bitget#setMarginMode
         * @description set margin mode to 'cross' or 'isolated'
         * @param {string} marginMode 'cross' or 'isolated'
         * @param {string} symbol unified market symbol
         * @param {object} params extra parameters specific to the bitget api endpoint
         * @returns {object} response from the exchange
         */
        marginMode = marginMode.toLowerCase();
        if (marginMode === 'isolated') {
            marginMode = 'fixed';
        }
        else if (marginMode === 'cross') {
            marginMode = 'crossed';
        }
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' setMarginMode() requires a symbol argument');
        }
        if ((marginMode !== 'fixed') && (marginMode !== 'crossed')) {
            throw new errors.ArgumentsRequired(this.id + ' setMarginMode() marginMode must be "fixed" or "crossed" (or "isolated" or "cross")');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
            'marginCoin': market['settleId'],
            'marginMode': marginMode,
        };
        params = this.omit(params, ['leverage', 'buyLeverage', 'sellLeverage']);
        try {
            return await this.privateMixPostAccountSetMarginMode(this.extend(request, params));
        }
        catch (e) {
            // bitget {"code":"45117","msg":"当前持有仓位或委托，无法调整保证金模式","requestTime":1671924219093,"data":null}
            if (e instanceof errors.ExchangeError) {
                if (e.toString().indexOf('45117') >= 0) {
                    throw new errors.ExchangeError(this.id + ' ' + this.json({ 'code': 45117, 'msg': 'Cannot switch Margin Type for market with open positions or orders.' }));
                }
            }
            throw e;
        }
    }
    async fetchAccountConfiguration(symbol, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
            'marginCoin': market['settleId'],
        };
        const response = await this.privateMixGetAccountAccount(this.extend(request, params));
        const data = this.safeValue(response, 'data');
        return this.parseAccountConfiguration(data, market);
    }
    parseAccountConfiguration(data, market) {
        // {
        //     "marginCoin":"USDT",
        //   "locked":0,
        //   "available":13168.86110692,
        //   "crossMaxAvailable":13168.86110692,
        //   "fixedMaxAvailable":13168.86110692,
        //   "maxTransferOut":13168.86110692,
        //   "equity":13178.86110692,
        //   "usdtEquity":13178.861106922,
        //   "btcEquity":0.344746495477,
        //   "crossRiskRate":0,
        //   "crossMarginLeverage":20,
        //   "fixedLongLeverage":20,
        //   "fixedShortLeverage":20,
        //   "marginMode":"crossed",
        //   "holdMode":"double_hold"
        // }
        const marginMode = this.safeString(data, 'marginMode');
        const isIsolated = (marginMode === 'fixed');
        let leverage = this.safeFloat(data, 'crossMarginLeverage');
        const buyLeverage = this.safeFloat(data, 'fixedLongLeverage');
        const sellLeverage = this.safeFloat(data, 'fixedShortLeverage');
        const marginCoin = this.safeString(data, 'marginCoin');
        const holdMode = this.safeString(data, 'holdMode');
        let positionMode = 'hedged';
        if (holdMode === 'single_hold') {
            positionMode = 'oneway';
            if (isIsolated) {
                leverage = buyLeverage;
            }
        }
        const accountConfig = {
            'info': data,
            'markets': {},
            'positionMode': positionMode,
            'marginMode': isIsolated ? 'isolated' : 'cross',
        };
        const leverageConfigs = accountConfig['markets'];
        leverageConfigs[market['symbol']] = {
            'marginMode': isIsolated ? 'isolated' : 'cross',
            'isIsolated': isIsolated,
            'leverage': leverage,
            'buyLeverage': buyLeverage,
            'sellLeverage': sellLeverage,
            'marginCoin': marginCoin,
            'positionMode': positionMode,
        };
        return accountConfig;
    }
    async fetchOpenInterest(symbol, params = {}) {
        /**
         * @method
         * @name bitget#fetchOpenInterest
         * @description Retrieves the open interest of a currency
         * @see https://bitgetlimited.github.io/apidoc/en/mix/#get-open-interest
         * @param {string} symbol Unified CCXT market symbol
         * @param {object} params exchange specific parameters
         * @returns {object} an open interest structure{@link https://docs.ccxt.com/en/latest/manual.html#interest-history-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        if (!market['contract']) {
            throw new errors.BadRequest(this.id + ' fetchOpenInterest() supports contract markets only');
        }
        const request = {
            'symbol': market['id'],
        };
        const response = await this.publicMixGetMarketOpenInterest(this.extend(request, params));
        //
        //     {
        //         "code": "00000",
        //         "msg": "success",
        //         "requestTime": 0,
        //         "data": {
        //             "symbol": "BTCUSDT_UMCBL",
        //             "amount": "130818.967",
        //             "timestamp": "1663399151127"
        //         }
        //     }
        //
        const data = this.safeValue(response, 'data', {});
        return this.parseOpenInterest(data, market);
    }
    async transfer(code, amount, fromAccount, toAccount, params = {}) {
        /**
         * @method
         * @name bitget#transfer
         * @see https://bitgetlimited.github.io/apidoc/en/spot/#transfer
         * @description transfer currency internally between wallets on the same account
         * @param {string} code unified currency code
         * @param {float} amount amount to transfer
         * @param {string} fromAccount account to transfer from
         * @param {string} toAccount account to transfer to
         * @param {object} params extra parameters specific to the bitget api endpoint
         *
         * EXCHANGE SPECIFIC PARAMS
         * @param {string} params.clientOid custom id
         * @returns {object} a [transfer structure]{@link https://docs.ccxt.com/en/latest/manual.html#transfer-structure}
         */
        await this.loadMarkets();
        const currency = this.currency(code);
        const fromSwap = fromAccount === 'swap';
        const toSwap = toAccount === 'swap';
        const usdt = currency['code'] === 'USDT';
        if (fromSwap) {
            fromAccount = usdt ? 'mix_usdt' : 'mix_usd';
        }
        else if (toSwap) {
            toAccount = usdt ? 'mix_usdt' : 'mix_usd';
        }
        const request = {
            'fromType': fromAccount,
            'toType': toAccount,
            'amount': amount,
            'coin': currency['info']['coinName'],
        };
        const response = await this.privateSpotPostWalletTransfer(this.extend(request, params));
        //
        //    {
        //        "code": "00000",
        //        "msg": "success",
        //        "requestTime": 1668119107154,
        //        "data": "SUCCESS"
        //    }
        //
        return this.parseTransfer(response, currency);
    }
    parseTransfer(transfer, currency = undefined) {
        //
        //    {
        //        "code": "00000",
        //        "msg": "success",
        //        "requestTime": 1668119107154,
        //        "data": "SUCCESS"
        //    }
        //
        const timestamp = this.safeInteger(transfer, 'requestTime');
        const msg = this.safeString(transfer, 'msg');
        return {
            'info': transfer,
            'id': this.safeString(transfer, 'id'),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'currency': this.safeString(currency, 'code'),
            'amount': this.safeNumber(transfer, 'size'),
            'fromAccount': undefined,
            'toAccount': undefined,
            'status': (msg === 'success') ? 'ok' : msg,
        };
    }
    parseTransferStatus(status) {
        const statuses = {
            'success': 'ok',
        };
        return this.safeString(statuses, status, status);
    }
    parseOpenInterest(interest, market = undefined) {
        //
        //     {
        //         "symbol": "BTCUSDT_UMCBL",
        //         "amount": "130818.967",
        //         "timestamp": "1663399151127"
        //     }
        //
        const timestamp = this.safeInteger(interest, 'timestamp');
        const id = this.safeString(interest, 'symbol');
        market = this.safeMarket(id, market);
        const amount = this.safeNumber(interest, 'amount');
        return {
            'symbol': this.safeSymbol(id),
            'baseVolume': amount,
            'quoteVolume': undefined,
            'openInterestAmount': amount,
            'openInterestValue': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'info': interest,
        };
    }
    handleErrors(code, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (!response) {
            return; // fallback to default error handler
        }
        //
        // spot
        //
        //     {"status":"fail","err_code":"01001","err_msg":"系统异常，请稍后重试"}
        //     {"status":"error","ts":1595594160149,"err_code":"invalid-parameter","err_msg":"invalid size, valid range: [1,2000]"}
        //     {"status":"error","ts":1595684716042,"err_code":"invalid-parameter","err_msg":"illegal sign invalid"}
        //     {"status":"error","ts":1595700216275,"err_code":"bad-request","err_msg":"your balance is low!"}
        //     {"status":"error","ts":1595700344504,"err_code":"invalid-parameter","err_msg":"invalid type"}
        //     {"status":"error","ts":1595703343035,"err_code":"bad-request","err_msg":"order cancel fail"}
        //     {"status":"error","ts":1595704360508,"err_code":"invalid-parameter","err_msg":"accesskey not null"}
        //     {"status":"error","ts":1595704490084,"err_code":"invalid-parameter","err_msg":"permissions not right"}
        //     {"status":"error","ts":1595711862763,"err_code":"system exception","err_msg":"system exception"}
        //     {"status":"error","ts":1595730308979,"err_code":"bad-request","err_msg":"20003"}
        //
        // swap
        //
        //     {"code":"40015","msg":"","requestTime":1595698564931,"data":null}
        //     {"code":"40017","msg":"Order id must not be blank","requestTime":1595702477835,"data":null}
        //     {"code":"40017","msg":"Order Type must not be blank","requestTime":1595698516162,"data":null}
        //     {"code":"40301","msg":"","requestTime":1595667662503,"data":null}
        //     {"code":"40017","msg":"Contract code must not be blank","requestTime":1595703151651,"data":null}
        //     {"code":"40108","msg":"","requestTime":1595885064600,"data":null}
        //     {"order_id":"513468410013679613","client_oid":null,"symbol":"ethusd","result":false,"err_code":"order_no_exist_error","err_msg":"订单不存在！"}
        //
        const message = this.safeString(response, 'err_msg');
        const errorCode = this.safeString2(response, 'code', 'err_code');
        const feedback = this.id + ' ' + body;
        const nonEmptyMessage = ((message !== undefined) && (message !== ''));
        if (nonEmptyMessage) {
            this.throwExactlyMatchedException(this.exceptions['exact'], message, feedback);
            this.throwBroadlyMatchedException(this.exceptions['broad'], message, feedback);
        }
        const nonZeroErrorCode = (errorCode !== undefined) && (errorCode !== '00000');
        if (nonZeroErrorCode) {
            this.throwExactlyMatchedException(this.exceptions['exact'], errorCode, feedback);
        }
        if (nonZeroErrorCode || nonEmptyMessage) {
            throw new errors.ExchangeError(feedback); // unknown message
        }
    }
    sign(path, api = [], method = 'GET', params = {}, headers = undefined, body = undefined) {
        const signed = api[0] === 'private';
        const endpoint = api[1];
        const pathPart = (endpoint === 'spot') ? '/api/spot/v1' : '/api/mix/v1';
        const request = '/' + this.implodeParams(path, params);
        const payload = pathPart + request;
        let url = this.implodeHostname(this.urls['api'][endpoint]) + payload;
        const query = this.omit(params, this.extractParams(path));
        if (!signed && (method === 'GET')) {
            const keys = Object.keys(query);
            const keysLength = keys.length;
            if (keysLength > 0) {
                url = url + '?' + this.urlencode(query);
            }
        }
        if (signed) {
            this.checkRequiredCredentials();
            const timestamp = this.milliseconds().toString();
            let auth = timestamp + method + payload;
            if (method === 'POST') {
                body = this.json(params);
                auth += body;
            }
            else {
                if (Object.keys(params).length) {
                    const query = '?' + this.urlencode(this.keysort(params));
                    url += query;
                    auth += query;
                }
            }
            const signature = this.hmac(this.encode(auth), this.encode(this.secret), 'sha256', 'base64');
            headers = {
                'ACCESS-KEY': this.apiKey,
                'ACCESS-SIGN': signature,
                'ACCESS-TIMESTAMP': timestamp,
                'ACCESS-PASSPHRASE': this.password,
            };
            if (method === 'POST') {
                headers['Content-Type'] = 'application/json';
            }
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}

module.exports = bitget;
