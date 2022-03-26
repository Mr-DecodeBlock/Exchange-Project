from brownie import Exchange, RALA_Token
from scripts.helpfull_script import get_account, get_contract, ADDRESS_ZERO
from web3 import Web3


def main():
    exchange = Exchange[-1]
    rala_Token = RALA_Token[-1]

    user1 = get_account(userNumber=1)
    print("Staking.....")
    exchange.stake(ADDRESS_ZERO, Web3.toWei(0.01, "ether"), {"from": user1})
    amount = Web3.toWei(0.01, "ether")
    print(f"Staked -->  {amount} Ether")
