from brownie import RALA_Token, Exchange
from scripts.helpfull_script import get_account, get_contract, ADDRESS_ZERO
from web3 import Web3

KEPT_BALANCE = Web3.toWei(10, "ether")


def deploy():
    account = get_account()
    print("Deploying the Rala Token......")
    rala_token = RALA_Token.deploy({"from": account})

    print("Deploying Exchange Contract....")
    exchange = Exchange.deploy(account, 20, rala_token, {"from": account})
    amount = rala_token.totalSupply({"from": account}) - KEPT_BALANCE

    rala_token.approve(exchange.address, amount, {"from": account})
    tx2 = exchange.depositToken(rala_token, amount, {"from": account})
    tx2.wait(1)

    exchange.setTokenPriceFeedMapping(
        ADDRESS_ZERO, get_contract("eth-usd-price-feed"), {"from": account}
    )

    return rala_token, exchange


def main():
    deploy()
