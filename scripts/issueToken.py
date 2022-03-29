from brownie import RALA_Token, Exchange
from scripts.helpfull_script import get_account, get_contract, ADDRESS_ZERO
from web3 import Web3
import time


def main():
    exchange = Exchange[-1]
    rala_token = RALA_Token[-1]
    user1 = get_account(userNumber=1)

    exchange.depositEther({"from": user1, "value": Web3.toWei(0.02, "ether")})

    print(f"Issued Token ---> {exchange.token_depositer_amount(rala_token, user1)}")

    print("Staking.....")
    exchange.stake(ADDRESS_ZERO, Web3.toWei(0.01, "ether"), {"from": user1})

    time.sleep(100)
    exchange.issueTokenAdvanced({"from": user1})

    print(f"Issued Token ---> {exchange.token_depositer_amount(rala_token, user1)}")

    # 10000000000000000
    # 37609185046420400256
