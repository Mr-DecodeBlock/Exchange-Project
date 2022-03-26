from brownie import Exchange, RALA_Token
from scripts.helpfull_script import get_account, get_contract, ADDRESS_ZERO
from web3 import Web3


def main():
    account = get_account()
    user1 = get_account(userNumber=1)
    exchange = Exchange[-1]
    rala_token = RALA_Token[-1]

    exchange.depositEther({"from": user1, "value": Web3.toWei(0.02, "ether")})
    tx_makeOrder = exchange.makeOrder(
        rala_token.address, ADDRESS_ZERO, Web3.toWei(0.009, "ether"), {"from": user1}
    )
    tx_makeOrder.wait(1)
    order = (
        id,
        user,
        tokenGet,
        amountGet,
        tokenGive,
        amountGive,
        timestamp,
    ) = exchange.id_to_order(1, {"from": account})
    print(order)
