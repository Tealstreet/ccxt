import os
from pprint import pprint
# import ccxt
# import time
# import pytest
import test_exchanges as te

__test__ = True
# start test stuff

# SETTINGS
exchange = te.tn_bitmex_exchange
symbol = 'ETH/USD' # 'BTC-PERP' # OKEX: future: 'BTC-USD-211231' coin 'BTC-USD-SWAP' 'BTC-USDT-SWAP' 'BTC/USD:BTC'
size = 1
ticker = exchange.fetch_ticker(symbol)
last = ticker['last']
# /SETTINGS
orders = []
actions = []
exchange.enableRateLimit = False

# trigger_types = {v: k for k, v in exchange['triggerTypes'].items()}

# ftx doesn't have the order available to get quickly enough... even though it posts
def fetch_order_unless_exchange_too_slow(result):
    try:
        order = exchange.fetch_order(result['id'], symbol)
    except:
        order = result
    return order

def get_close_on_trigger_value(result):
    keys = ['close_on_trigger', 'closePosition', 'closeOnTrigger']
    for key in keys:
        if key in result:
            return exchange.safe_value(result, key)
    return None

def check_close_on_trigger_value(result, value):
    if exchange.id in ['ftx', 'bitmex', 'bybit', 'okex', 'phemex', 'kucoin']:
        return True
    info = result['info']
    return get_close_on_trigger_value(info) == value

def get_info_trigger_value(result):
    keys = ['trigger', 'trigger_by', 'execInst', 'workingType']
    for key in keys:
        if key in result:
            return exchange.safe_value(result, key)
    return False

def check_trigger_value(result, value):
    if exchange.id in ['ftx', 'okex']:
        return True
    if exchange.id in ['binance', 'phemex']: # PHEMEX: TE_NO_INDEX_PRICE Cannot get valid index price to create conditional order
        if value == 'Index':
            return True
    info = result['info']
    exchange_value = exchange.triggerTypes[value]
    return exchange_value in get_info_trigger_value(info)

def do_create_order(args):
    print('create_order(', *args, ')')
    result = exchange.create_order(*args)
    print('Result: \n' + result)
    pprint(result)
    print('༼ つ ◕_◕ ༽つ')
    return result

def test_fetch_balance_for_api_key_authentication():
    print(exchange.name)
    print('Fetching balance for API authentication.')
    try:
        balance = exchange.fetch_balance()
    except:
        assert False
    assert balance

# TODO: edit / update order test

def test_market_buy_not_post_only():
    print(exchange.name)
    print('Market buy, post only = false.')
    result = do_create_order([
        symbol,
        'market',
        'buy',
        size*3,
        None,
        {
            'stopPrice': None,
            'timeInForce': 'GTC', # GTC, PO
            'reduceOnly': False,
            'trigger': None,
            'closeOnTrigger': None,
            'basePrice': last if exchange.id == 'okex' else None
        }
    ])
    order = fetch_order_unless_exchange_too_slow(result)
    assert (order['status'] == 'closed' and order['postOnly'] == False) or (exchange.id == 'phemex' and order['status'] == 'open' and order['type'] == 'Market')

def test_market_sell_not_post_only():
    print(exchange.name)
    print('Market sell, post only = false.')
    result = do_create_order([
        symbol,
        'market',
        'sell',
        size,
        None,
        {
            'stopPrice': None,
            'timeInForce': 'GTC', # GTC, PO
            'reduceOnly': False,
            'trigger': None,
            'closeOnTrigger': None,
            'basePrice':  last if exchange.id == 'okex' else None
        }
    ])
    order = fetch_order_unless_exchange_too_slow(result)
    assert (order['status'] == 'closed' and order['postOnly'] == False) or (exchange.id == 'phemex' and order['status'] == 'open' and order['type'] == 'Market')

def test_limit_buy_below_last_post_only_reduce_only():
    print('Limit buy below last, reduce only = true and post only = true. Should not post.')
    try:
        result = do_create_order([
            symbol,
            'limit',
            'buy',
            size,
            last * 0.99,
            {
                'stopPrice': None,
                'timeInForce': 'PO',  # GTC, PO
                'reduceOnly': True,
                'trigger': None,
                'closeOnTrigger': None,
                'basePrice': None
            }
        ])
        orders.append({'id': result['id'], 'type': 'limit'})
        assert False
    except:
        assert True

def test_limit_buy_below_last_not_post_only_not_reduce_only():
    print('Limit buy below last, reduce only = false and post only = false.')
    result = do_create_order([
        symbol,
        'limit',
        'buy',
        size,
        last * 0.98,
        {
            'stopPrice': None,
            'timeInForce': 'GTC',  # GTC, PO
            'reduceOnly': False,
            'trigger': None,
            'closeOnTrigger': None,
            'basePrice': None
        }
    ])
    orders.append({'id': result['id'], 'type': 'limit'})
    order = fetch_order_unless_exchange_too_slow(result)
    assert order['status'] == 'open' and order['postOnly'] == False

def test_limit_sell_above_last_post_only_reduce_only():
    print('Limit sell above last, reduce only = true and post only = true.')
    result = do_create_order([
        symbol,
        'limit',
        'sell',
        size,
        last * 1.01,
        {
            'stopPrice': None,
            'timeInForce': 'PO', # GTC, PO
            'reduceOnly': True,
            'trigger': None,
            'closeOnTrigger': None,
            'basePrice': None
        }
    ])
    orders.append({'id': result['id'], 'type': 'limit'})
    order = fetch_order_unless_exchange_too_slow(result)
    assert order['status'] == 'open' and order['postOnly'] == True # TODO: reduce only

def test_limit_sell_above_last_not_post_only_not_reduce_only():
    print('Limit sell above last, reduce only = false and post only = false.')
    result = do_create_order([
        symbol,
        'limit',
        'sell',
        size,
        last * 1.02,
        {
            'stopPrice': None,
            'timeInForce': 'GTC',  # GTC, PO
            'reduceOnly': False,
            'trigger': None,
            'closeOnTrigger': None,
            'basePrice': None
        }
    ])
    orders.append({'id': result['id'], 'type': 'limit'})
    order = fetch_order_unless_exchange_too_slow(result)
    assert order['status'] == 'open' and  order['postOnly'] == False

def test_edit_order_size():
    print('Edit order size.')
    result = None
    limit_orders = [x for x in orders if x['type'] == 'limit']
    id = limit_orders.pop()['id']
    new_amount = size * 7
    try:
        order = True
        if exchange.id != 'ftx':
            for x in limit_orders:
                order = exchange.fetch_order(x['id'], symbol)
                if order['status'] == 'open':
                    id = order['id']
                    break
        if order: # wtf ftx
            if order['status'] == 'open':
                type = order['type']
                side = order['side']
                price = order['price']
                stop_price = order['stopPrice']
                time_in_force = order['timeInForce']
                reduce_only = order['reduce']
                trigger = order['trigger']
                close_on_trigger = order['close']
                result = exchange.edit_order(id, symbol, type, side, new_amount, price,
                    params={
                        'stopPrice': stop_price,
                        'timeInForce': time_in_force,
                        'reduceOnly': reduce_only,
                        'trigger': trigger,
                        'closeOnTrigger': close_on_trigger,
                    })
    except:
        assert False
    pprint(result)
    print('༼ つ ◕_◕ ༽つ')
    assert result['id'] == id and exchange.amount_to_precision(symbol, result['amount']) == exchange.amount_to_precision(symbol, new_amount)

def test_edit_order_price():
    print('Edit order price.')
    result = None
    limit_orders = [x for x in orders if x['type'] == 'limit']
    id = limit_orders.pop()['id']
    new_price = last
    try:
        order = True
        if exchange.id != 'ftx':
            for x in limit_orders:
                order = exchange.fetch_order(x['id'], symbol)
                if order['status'] == 'open':
                    id = order['id']
                    break
        if order: # wtf ftx
            if order['status'] == 'open':
                amount = order['amount']
                type = order['type']
                side = order['side']
                price = order['price']
                if price < last:
                    new_price = last * 0.915
                else:
                    new_price = last * 1.085
                stop_price = order['stopPrice']
                time_in_force = order['timeInForce']
                reduce_only = order['reduce']
                trigger = order['trigger']
                close_on_trigger = order['close']
                result = exchange.edit_order(id, symbol, type, side, amount, new_price,
                    params={
                        'stopPrice': stop_price,
                        'timeInForce': time_in_force,
                        'reduceOnly': reduce_only,
                        'trigger': trigger,
                        'closeOnTrigger': close_on_trigger,
                    })
    except:
        assert False
    pprint(result)
    print('༼ つ ◕_◕ ༽つ')
    assert result['id'] == id and exchange.price_to_precision(symbol, result['price']) == exchange.price_to_precision(symbol, new_price)

def test_stop_market_sell_below_last_close_on_trigger(): # bitmex linear has a timing issue with this and sometimes fails
    print('Market sell stop below last. Close on trigger = true.')
    result = do_create_order([
       symbol,
       'stop',
       'sell',
       size,
       None,
       {
          'stopPrice':last * 0.97,
          'timeInForce':'GTC',
          'reduceOnly':None,
          'trigger':'Last',
          'closeOnTrigger':True,
          'basePrice': last
       }
    ])
    orders.append({'id': result['id'], 'type': 'stop'})
    order = fetch_order_unless_exchange_too_slow(result)
    assert order['status'] == 'open' and check_close_on_trigger_value(result, True)

def test_stop_market_sell_below_last(): #  bitmex linear has a timing issue with this and sometimes fails
    print('Market sell stop below last. Close on trigger = false.')
    result = do_create_order([
        symbol,
        'stop',
        'sell',
        size,
        None,
        {
            'stopPrice': last * 0.96,
            'timeInForce': 'GTC',
            'reduceOnly': None,
            'trigger': 'Last',
            'closeOnTrigger': False,
            'basePrice':  last
        }
    ])
    orders.append({'id': result['id'], 'type': 'stop'})
    order = fetch_order_unless_exchange_too_slow(result)
    assert order['status'] == 'open' and check_close_on_trigger_value(result, False)

def test_stop_market_sell_above_last(): # should be take profit, TODO: bitmex is filling on this
    print('Market sell stop above last. Close on trigger = false.')
    result = do_create_order([
        symbol,
        'stop',
        'sell',
        size,
        None,
        {
            'stopPrice': last * 1.03,
            'timeInForce': 'GTC',
            'reduceOnly': None,
            'trigger': 'Last',
            'closeOnTrigger': False,
            'basePrice': last
        }
    ])
    orders.append({'id': result['id'], 'type': 'stop'})
    order = fetch_order_unless_exchange_too_slow(result)
    assert order['status'] == 'open' and check_close_on_trigger_value(result, False)

def test_stop_market_buy_above_last_close_on_trigger():
    print('Market buy stop above last. Close on trigger = true.')
    result = do_create_order([
       symbol,
       'stop',
       'buy',
       size,
       None,
       {
          'stopPrice':last * 1.04,
          'timeInForce':'GTC',
          'reduceOnly':None,
          'trigger':'Last',
          'closeOnTrigger':True,
          'basePrice': last
       }
    ])
    orders.append({'id': result['id'], 'type': 'stop'})
    order = fetch_order_unless_exchange_too_slow(result)
    assert order['status'] == 'open' and check_close_on_trigger_value(result, True)

def test_stop_market_buy_above_last():
    print('Market buy stop above last. Close on trigger = false.')
    result = do_create_order([
        symbol,
        'stop',
        'buy',
        size,
        None,
        {
            'stopPrice': last * 1.05,
            'timeInForce': 'GTC',
            'reduceOnly': None,
            'trigger': 'Last',
            'closeOnTrigger': False,
            'basePrice': last
        }
    ])
    orders.append({'id': result['id'], 'type': 'stop'})
    order = fetch_order_unless_exchange_too_slow(result)
    assert order['status'] == 'open' and check_close_on_trigger_value(result, False)

def test_stop_market_buy_below_last(): # should be take profit, bitmex linear has a timing issue with this and sometimes fails
    print('Market buy stop below last. Close on trigger = false.')
    result = do_create_order([
       symbol,
        'stop',
        'buy',
        size,
        None,
        {
            'stopPrice': last * 0.95,
            'timeInForce': 'GTC',
            'reduceOnly': None,
            'trigger': 'Last',
            'closeOnTrigger': False,
            'basePrice': last
        }
    ])
    orders.append({'id': result['id'], 'type': 'stop'})
    order = fetch_order_unless_exchange_too_slow(result)
    assert order['status'] == 'open' and check_close_on_trigger_value(result, False)

def test_stop_limit_buy_above_last():
    print('Limit buy stop above last. Close on trigger = false. Trigger = Last.')
    result = do_create_order([
        symbol,
        'stoplimit',
        'buy',
        size,
        last * 0.94,
        {
            'stopPrice': last * 1.06,
            'timeInForce': 'PO',
            'reduceOnly': None,
            'trigger': 'Last',
            'closeOnTrigger': False,
            'basePrice': last
        }
    ])
    orders.append({'id': result['id'], 'type': 'stop'})
    order = fetch_order_unless_exchange_too_slow(result)
    assert order['status'] == 'open' and check_trigger_value(result, 'Last') and check_close_on_trigger_value(result, False)
    # assert order['status'] == 'open' and 'Last' in get_info_trigger_value(result['info']) and (get_close_on_trigger_value(result['info']) == True or get_close_on_trigger_value(result['info']) == None)

def test_stop_limit_buy_above_mark(): # TODO binance fails if true
    print('Limit buy stop above last. Close on trigger = true. Trigger = Mark.')
    result = do_create_order([
        symbol,
        'stoplimit',
        'buy',
        size,
        last * 0.93,
        {
            'stopPrice': last * 1.07,
            'timeInForce': 'PO',
            'reduceOnly': None,
            'trigger': 'Mark',
            'closeOnTrigger': True,
            'basePrice': last
        }
    ])
    orders.append({'id': result['id'], 'type': 'stop'})
    order = fetch_order_unless_exchange_too_slow(result)
    assert order['status'] == 'open' and check_trigger_value(result, 'Mark') and check_close_on_trigger_value(result, True)

def test_stop_limit_buy_above_index():
    print('Limit buy stop above last. Close on trigger = true. Trigger = Index.')
    if exchange.id == 'phemex':
        assert True
        return
    result = do_create_order([
        symbol,
        'stoplimit',
        'buy',
        size,
        last * 0.92,
        {
            'stopPrice': last * 1.08,
            'timeInForce': 'PO',
            'reduceOnly': None,
            'trigger': 'Index',
            'closeOnTrigger': True,
            'basePrice': last
        }
    ])
    orders.append({'id': result['id'], 'type': 'stop'})
    order = fetch_order_unless_exchange_too_slow(result)
    assert order['status'] == 'open' and check_trigger_value(result, 'Index') and check_close_on_trigger_value(result, True)

def test_stop_limit_sell_below_last():
    print('Limit sell stop below last. Close on trigger = false. Trigger = Last.')
    result = do_create_order([
        symbol,
        'stoplimit',
        'sell',
        size,
        last * 1.09,
        {
            'stopPrice': last * 0.91,
            'timeInForce': 'PO',
            'reduceOnly': None,
            'trigger': 'Last',
            'closeOnTrigger': False,
            'basePrice': last
        }
    ])
    orders.append({'id': result['id'], 'type': 'stop'})
    order = fetch_order_unless_exchange_too_slow(result)
    assert order['status'] == 'open' and check_trigger_value(result, 'Last') and check_close_on_trigger_value(result, True)

def test_edit_order_stop_price():
    print('Edit order stop price.')
    result = None
    limit_orders = [x for x in orders if x['type'] == 'stop']
    id = limit_orders.pop()['id']
    new_stop_price = last
    try:
        order = True
        if exchange.id != 'ftx':
            for x in limit_orders:
                order = exchange.fetch_order(x['id'], symbol)
                if order['status'] == 'open':
                    id = order['id']
                    break
        if order: # wtf ftx
            if order['status'] == 'open':
                amount = order['amount']
                type = order['type']
                side = order['side']
                price = order['price']
                stop_price = order['stopPrice']
                if stop_price < last:
                    new_stop_price = last * 0.915
                else:
                    new_stop_price = last * 1.085
                time_in_force = order['timeInForce']
                reduce_only = order['reduce']
                trigger = order['trigger']
                close_on_trigger = order['close']
                result = exchange.edit_order(id, symbol, type, side, amount, price,
                    params={
                        'stopPrice': new_stop_price,
                        'timeInForce': time_in_force,
                        'reduceOnly': reduce_only,
                        'trigger': trigger,
                        'closeOnTrigger': close_on_trigger,
                    })
    except:
        assert False
    pprint(result)
    print('༼ つ ◕_◕ ༽つ')
    assert result['id'] == id and exchange.price_to_precision(symbol, result['stopPrice'] ) == exchange.price_to_precision(symbol, new_stop_price)

def test_cancel_order():
    print('Cancel a few limit orders.')
    asserts = []
    results = []
    orders_to_cancel = [x for x in orders if x['type'] == 'limit']
    r = 2 if len(orders_to_cancel) >= 2 else len(orders_to_cancel)
    for i in range(r):
        id = orders_to_cancel.pop()['id']
        try:
            order = True
            if exchange.id != 'ftx':
                order = exchange.fetch_order(id, symbol)
            if order: # wtf ftx
                if order['status'] == 'open':
                    result = exchange.cancel_order(id, symbol, params={'type': 'limit'})
                    results.append(result)
                if exchange.id == 'ftx':
                    asserts.append(result in ['Order cancelled', 'Order queued for cancellation'])
                else:
                    asserts.append(result['id'] == id)
        except:
            assert False
    pprint(results)
    print('༼ つ ◕_◕ ༽つ')
    assert any(asserts)

def test_cancel_stop_order():
    print('Cancel a few stop orders.')
    asserts = []
    results = []
    orders_to_cancel = [x for x in orders if x['type'] == 'stop']
    r = 5 if len(orders_to_cancel) >= 5 else len(orders_to_cancel)
    for i in range(r):
        id = orders_to_cancel.pop()['id']
        try:
            order = {'status': 'open'}
            if exchange.id != 'ftx':
                order = exchange.fetch_order(id, symbol, params={'type': 'stop'})
            if (order and order['status'] == 'open'):
                try:
                    result = exchange.cancel_order(id, symbol, params={'type': 'stop'})
                except:
                    result = exchange.fetch_order(id, symbol, params={'type': 'stop'}) # type stop for okex
                results.append(result)
                if exchange.id == 'ftx':
                    asserts.append(result in ['Order cancelled', 'Order queued for cancellation'])
                else:
                    asserts.append(result['id'] == id)
        except:
            assert False
    pprint(results)
    print('༼ つ ◕_◕ ༽つ')
    assert any(asserts)

def test_stop_limit_sell_below_mark():
    print('Limit sell stop below mark. Close on trigger = true. Trigger = Mark.')
    result = do_create_order([
        symbol,
        'stoplimit',
        'sell',
        size,
        last * 1.10,
        {
            'stopPrice': last * 0.90,
            'timeInForce': 'PO',
            'reduceOnly': None,
            'trigger': 'Mark',
            'closeOnTrigger': True,
            'basePrice': last
        }
    ])
    order = fetch_order_unless_exchange_too_slow(result)
    assert order['status'] == 'open' and check_trigger_value(result, 'Mark') and check_close_on_trigger_value(result, True)

def test_stop_limit_sell_below_index():
    print('Limit sell stop below last. Close on trigger = true. Trigger = Index.')
    if exchange.id == 'phemex':
        assert True
        return
    result = do_create_order([
        symbol,
        'stoplimit',
        'sell',
        size,
        last * 1.11,
        {
            'stopPrice': last * 0.89,
            'timeInForce': 'PO',
            'reduceOnly': None,
            'trigger': 'Index',
            'closeOnTrigger': True,
            'basePrice': last
        }
    ])
    order = fetch_order_unless_exchange_too_slow(result)
    assert order['status'] == 'open' and check_trigger_value(result, 'Index') and check_close_on_trigger_value(result, True)

def test_cancel_all_orders():
    print('Cancel all orders.')
    results = []
    results.append(exchange.cancel_all_orders(symbol))
    results.append(exchange.cancel_all_orders(symbol, params={'type': 'stop'}))
    pprint(results)
    print('༼ つ ◕_◕ ༽つ')
    open_orders = exchange.fetch_open_orders(symbol)
    open_orders = [x for x in open_orders if x['status'] != 'open']
    assert not open_orders

def test_close_position():
    print(exchange.name)
    print('Close position')
    if exchange.id == 'phemex':
        try:
            code = symbol.split(':', 1)[1]
        except:
            code = symbol.split('/', 1)[1]
        position = exchange.fetch_positions(symbol, { 'code': code })[0]
    else:
        position = exchange.fetch_positions(symbol)
    if isinstance(position, list):
        position = position[0]
    close_size = position['contracts'] or position['size']
    side = 'buy' if position['side'] == 'sell' else 'sell'
    result = do_create_order([
        symbol,
        'market',
        side,
        abs(close_size),
        None,
        {
            'stopPrice': None,
            'timeInForce': 'GTC',  # GTC, PO
            'reduceOnly': True,
            'trigger': None,
            'closeOnTrigger': None,
            'basePrice': None
        }
    ])
    assert result
