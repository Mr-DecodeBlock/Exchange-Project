from brownie import Exchange
from scripts.helpfull_script import get_account


def main():

    account = get_account()
    exchange = Exchange[-1]
    id = exchange.orderCounter({"from": account})
    tx = exchange.fillOrder(id, {"from": account})

    order = tx.events

    print(order)
