# -*- coding: utf-8 -*-

"""CCXT: CryptoCurrency eXchange Trading Library (Async)"""

# ----------------------------------------------------------------------------

__version__ = '3.0.22'

# ----------------------------------------------------------------------------

from ccxt.base.exchange import Exchange  # noqa: F401

# CCXT Pro exchanges (now this is mainly used for importing exchanges in WS tests)

from ccxt.pro.binance import binance                                      # noqa: F401
from ccxt.pro.binancecoinm import binancecoinm                            # noqa: F401
from ccxt.pro.binanceusdm import binanceusdm                              # noqa: F401
from ccxt.pro.bingx import bingx                                          # noqa: F401
from ccxt.pro.bitget import bitget                                        # noqa: F401
from ccxt.pro.bitmex import bitmex                                        # noqa: F401
from ccxt.pro.blofin import blofin                                        # noqa: F401
from ccxt.pro.bybit import bybit                                          # noqa: F401
from ccxt.pro.okex import okex                                            # noqa: F401
from ccxt.pro.okx import okx                                              # noqa: F401
from ccxt.pro.phemex import phemex                                        # noqa: F401
from ccxt.pro.woo import woo                                              # noqa: F401

exchanges = [
    'binance',
    'binancecoinm',
    'binanceusdm',
    'bingx',
    'bitget',
    'bitmex',
    'blofin',
    'bybit',
    'okex',
    'okx',
    'phemex',
    'woo',
]
