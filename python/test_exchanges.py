import ccxtpro
import ccxt
import os
from python_utils.read_env import read_env
read_env()

username = os.environ.get('PROXY_USER')
password = os.environ.get('PROXY_PASS')
proxy = f'http://{username}:{password}@gate.smartproxy.com:7000'

proxy_params = {'proxy': proxy}

# BINANCE BINANCE BINANCE BINANCE BINANCE BINANCE BINANCE BINANCE BINANCE BINANCE #
mn_binance_params = {
    'apiKey': os.environ.get('mn_binance_key'),
    'secret': os.environ.get('mn_binance_secret'),
    'enableRateLimit': True,
    'options': {
        'leverageBrackets': None,
    }
}
mn_binance_coinm_exchange_pro = ccxtpro.binancecoinm(mn_binance_params)
mn_binance_usdm_exchange_pro = ccxtpro.binanceusdm(mn_binance_params)
mn_binance_coinm_exchange = ccxt.binancecoinm(mn_binance_params)
mn_binance_usdm_exchange = ccxt.binanceusdm(mn_binance_params)

# BITMEX BITMEX BITMEX BITMEX BITMEX BITMEX BITMEX BITMEX BITMEX BITMEX #
mn_bitmex_params = {
    'apiKey': os.environ.get('mn_bitmex_key'),
    'secret': os.environ.get('mn_bitmex_secret'),
    # 'enableRateLimit': True,
    # 'wsproxy': proxy,
}
mn_bitmex_exchange_pro = ccxtpro.bitmex(mn_bitmex_params)
mn_bitmex_exchange = ccxt.bitmex(mn_bitmex_params)
tn_bitmex_params = {
    'apiKey': os.environ.get('tn_bitmex_key'),
    'secret': os.environ.get('tn_bitmex_secret'),
    'enableRateLimit': True,
    # 'wsproxy': proxy,
}
tn_bitmex_exchange_pro = ccxtpro.bitmex(tn_bitmex_params)
tn_bitmex_exchange_pro.set_sandbox_mode(True)
tn_bitmex_exchange = ccxt.bitmex(tn_bitmex_params)
tn_bitmex_exchange.set_sandbox_mode(True)

# BYBIT BYBIT BYBIT BYBIT BYBIT BYBIT BYBIT BYBIT BYBIT BYBIT #
mn_bybit_params = {
    'apiKey': os.environ.get('mn_bybit_key'),
    'secret': os.environ.get('mn_bybit_secret'),
    'enableRateLimit': False,
}
mn_bybit_inverse_exchange = ccxt.bybitinverse(mn_bybit_params)
mn_bybit_linear_exchange = ccxt.bybitlinear(mn_bybit_params)
mn_bybit_inverse_exchange_pro = ccxtpro.bybitinverse(mn_bybit_params)
mn_bybit_linear_exchange_pro = ccxtpro.bybitlinear(mn_bybit_params)

tn_bybit_params = {
    'apiKey': os.environ.get('tn_bybit_key'),
    'secret': os.environ.get('tn_bybit_secret'),
    'enableRateLimit': False,
}
tn_bybit_inverse_exchange = ccxt.bybitinverse(tn_bybit_params)
tn_bybit_inverse_exchange.set_sandbox_mode(True)
tn_bybit_linear_exchange = ccxt.bybitlinear(tn_bybit_params)
tn_bybit_linear_exchange.set_sandbox_mode(True)
tn_bybit_inverse_exchange_pro = ccxtpro.bybitinverse(tn_bybit_params)
tn_bybit_inverse_exchange_pro.set_sandbox_mode(True)
tn_bybit_linear_exchange_pro = ccxtpro.bybitlinear(tn_bybit_params)
tn_bybit_linear_exchange_pro.set_sandbox_mode(True)

# FTX FTX FTX FTX FTX FTX FTX FTX FTX FTX #
mn_ftx_params = {
    'apiKey': os.environ.get('mn_ftx_key'),
    'secret': os.environ.get('mn_ftx_secret'),
    'headers': {
        'FTX-SUBACCOUNT': os.environ.get('mn_ftx_subaccount_name'),
        # 'authorization': 'jwt eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyfGt5bGVqc2lta29AZ21haWwuY29tIiwiaXNzIjoiZnR4LmNvbSIsIm5iZiI6MTYyOTkwMDY1MSwiZXhwIjoxNjMyNDkyNzExLCJhdWQiOiJodHRwczovL2Z0ZXhjaGFuZ2UuY29tL2FwaS8iLCJpYXQiOjE2Mjk5MDA3MTEsIm1mYSI6dHJ1ZSwib25seUFsbG93U3VwcG9ydE9ubHkiOmZhbHNlLCJ3aXRoZHJhd2Fsc0Rpc2FibGVkIjpmYWxzZSwiaW50ZXJuYWxUcmFuc2ZlcnNEaXNhYmxlZCI6ZmFsc2UsInJlYWRPbmx5IjpudWxsfQ.WDJ1g7f52Ph6lOkedbDggRaXESolfmh0fmaYo8F3JNWSCdjPPVL8XsM1173wVa-fuPohHNl3TecfJ-tQ4IruG0aSQ7nQeZQxYExe35p7xaIZ6u_ecQfpwUwuHM2GXoieedvTWqXJzYwxvtLx8u0Zb49guCPFNbJ7McDsaFxLgZvynmbyPIj_YLuYqZkZ-KWrj-QkuyJY_o3XfUQflAxPmCzlbZgHtKaF_4BalAM6hsRqWX4qcSX9eY9V55NVGUmFHEVocV84XqsA_0fSo5tLga0WjebVfJ1ZIHT6qauOpgcH5sTqy7qkDV7tDnWi1E-EQbzOboSElPrZLgV5CnldQg'
    },
    'enableRateLimit': True,
    # 'proxy': 'http://localhost/api/proxy/',
}
mn_ftx_exchange_pro = ccxtpro.ftx(mn_ftx_params)
mn_ftx_exchange = ccxt.ftx(mn_ftx_params)
mnc_ftx_params = {
    'apiKey': os.environ.get('mnc_ftx_key'),
    'secret': os.environ.get('mnc_ftx_secret'),
    'headers': {
        'FTX-SUBACCOUNT': os.environ.get('mnc_ftx_subaccount_name'),
        # 'authorization': 'jwt eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyfGt5bGVqc2lta29AZ21haWwuY29tIiwiaXNzIjoiZnR4LmNvbSIsIm5iZiI6MTYyOTkwMDY1MSwiZXhwIjoxNjMyNDkyNzExLCJhdWQiOiJodHRwczovL2Z0ZXhjaGFuZ2UuY29tL2FwaS8iLCJpYXQiOjE2Mjk5MDA3MTEsIm1mYSI6dHJ1ZSwib25seUFsbG93U3VwcG9ydE9ubHkiOmZhbHNlLCJ3aXRoZHJhd2Fsc0Rpc2FibGVkIjpmYWxzZSwiaW50ZXJuYWxUcmFuc2ZlcnNEaXNhYmxlZCI6ZmFsc2UsInJlYWRPbmx5IjpudWxsfQ.WDJ1g7f52Ph6lOkedbDggRaXESolfmh0fmaYo8F3JNWSCdjPPVL8XsM1173wVa-fuPohHNl3TecfJ-tQ4IruG0aSQ7nQeZQxYExe35p7xaIZ6u_ecQfpwUwuHM2GXoieedvTWqXJzYwxvtLx8u0Zb49guCPFNbJ7McDsaFxLgZvynmbyPIj_YLuYqZkZ-KWrj-QkuyJY_o3XfUQflAxPmCzlbZgHtKaF_4BalAM6hsRqWX4qcSX9eY9V55NVGUmFHEVocV84XqsA_0fSo5tLga0WjebVfJ1ZIHT6qauOpgcH5sTqy7qkDV7tDnWi1E-EQbzOboSElPrZLgV5CnldQg'
    },
    'enableRateLimit': True,
    # 'proxy': 'http://localhost/api/proxy/',
}
mnc_ftx_exchange_pro = ccxtpro.ftx(mnc_ftx_params)
mnc_ftx_exchange = ccxt.ftx(mnc_ftx_params)

# GATE.IO GATE.IO GATE.IO GATE.IO GATE.IO GATE.IO GATE.IO GATE.IO GATE.IO GATE.IO #
mn_gateio_params = {
    'apiKey': os.environ.get('mn_gateio_key'),
    'secret': os.environ.get('mn_gateio_secret'),
    'enableRateLimit': True,
    # 'proxy': 'http://localhost/api/proxy/',
}
mn_gateio_exchange_pro = ccxtpro.gateio(mn_gateio_params)
mn_gateio_exchange = ccxt.gateio(mn_gateio_params)

# KUCOIN KUCOIN KUCOIN KUCOIN KUCOIN KUCOIN KUCOIN KUCOIN KUCOIN KUCOIN #
mn_kucoin_params = {
    'apiKey': os.environ.get('mn_kucoin_key'),
    'secret': os.environ.get('mn_kucoin_secret'),
    'password': os.environ.get('mn_kucoin_password'),
    'enableRateLimit': True
}
mn_kucoin_exchange_pro = ccxtpro.kucoin(mn_kucoin_params)
mn_kucoin_exchange = ccxt.kucoin(mn_kucoin_params)

tn_kucoin_params = {
    'apiKey': os.environ.get('tn_kucoin_key'),
    'secret': os.environ.get('tn_kucoin_secret'),
    'password': os.environ.get('tn_kucoin_password'),
    'enableRateLimit': True
}
tn_kucoin_exchange_pro = ccxtpro.kucoin(tn_kucoin_params)
tn_kucoin_exchange_pro.set_sandbox_mode(True)
tn_kucoin_exchange = ccxt.kucoin(tn_kucoin_params)
tn_kucoin_exchange.set_sandbox_mode(True)

# PHEMEX PHEMEX PHEMEX PHEMEX PHEMEX PHEMEX PHEMEX PHEMEX PHEMEX PHEMEX #
mn_phemex_params = {
    'apiKey': os.environ.get('mn_phemex_key'),
    'secret': os.environ.get('mn_phemex_secret'),
    'enableRateLimit': True,
    # 'headers': {
    #     'authorization': 'jwt eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHRyYSI6IjQwYjUzNmYwLTFjZDktNDM5NS1hZGQ0LWFlOGFlZDAwYjllMy0xNjI5MzM5NzAxODUwIiwiaXNzIjoiUEhFTUVYIiwiZXhwIjoxNjMwNzExODE0LCJzdWJqIjo5MjcxNDEsImJvZHkiOiLwqJm-8Kq7ruqPh-WRrPChgZ3wo6yu65Og5ryJ6K-Cwojsl7MiLCJpYXQiOjE2Mjk1MDIyMTR9.30eMEoWjsLgQ6mZSaYDeG04xMThaOm3zNMFTydRPhKg'
    # },
    # 'proxy': 'http://localhost/api/proxy/',
}
mn_phemex_exchange_pro = ccxtpro.phemex(mn_phemex_params)
mn_phemex_exchange = ccxt.phemex(mn_phemex_params)
tn_phemex_params = {
    'apiKey': os.environ.get('tn_phemex_key'),
    'secret': os.environ.get('tn_phemex_secret'),
    'enableRateLimit': True,
    # 'headers': {
    #     'authorization': 'jwt eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHRyYSI6IjQwYjUzNmYwLTFjZDktNDM5NS1hZGQ0LWFlOGFlZDAwYjllMy0xNjI5MzM5NzAxODUwIiwiaXNzIjoiUEhFTUVYIiwiZXhwIjoxNjMwNzExODE0LCJzdWJqIjo5MjcxNDEsImJvZHkiOiLwqJm-8Kq7ruqPh-WRrPChgZ3wo6yu65Og5ryJ6K-Cwojsl7MiLCJpYXQiOjE2Mjk1MDIyMTR9.30eMEoWjsLgQ6mZSaYDeG04xMThaOm3zNMFTydRPhKg'
    # },
    # 'proxy': 'http://localhost/api/proxy/',
}
tn_phemex_exchange_pro = ccxtpro.phemex(tn_phemex_params)
tn_phemex_exchange_pro.set_sandbox_mode(True)
tn_phemex_exchange = ccxt.phemex(tn_phemex_params)
tn_phemex_exchange.set_sandbox_mode(True)

# OKEX OKEX OKEX OKEX OKEX OKEX OKEX OKEX OKEX OKEX #
tn_okex_params = {
    'apiKey': os.environ.get('tn_okex_key'),
    'secret': os.environ.get('tn_okex_secret'),
    'password': os.environ.get('tn_okex_password'),
    'enableRateLimit': True,
    'headers': {
        'x-simulated-trading': '1',
    },
}
tn_okex_exchange_pro = ccxtpro.okex(tn_okex_params)
tn_okex_exchange_pro.set_sandbox_mode(True)
tn_okex_exchange = ccxt.okex(tn_okex_params)
tn_okex_exchange.set_sandbox_mode(True)
