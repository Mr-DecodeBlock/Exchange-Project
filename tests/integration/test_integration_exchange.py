from brownie import network
from scripts.deploy import deploy
from scripts.helpfull_script import (
    get_account,
    get_contract,
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
)
from web3 import Web3
import pytest

ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"


def test_integration_exchange():
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("You are not in Local Blockchain environment.")
    account = get_account()
    user1 = get_account(userNumber=1)
    rala_token, exchange = deploy()
    tx = exchange.depositEther({"from": user1, "value": Web3.toWei(0.04, "ether")})
    tx.wait(1)
    exchange.setTokenPriceFeedMapping(
        ADDRESS_ZERO, get_contract("eth-usd-price-feed"), {"from": account}
    )

    # Act
    # ------> Making Orders
    tx_makeOrder = exchange.makeOrder(
        rala_token.address, ADDRESS_ZERO, Web3.toWei(0.009, "ether"), {"from": user1}
    )
    tx_makeOrder.wait(1)
    (
        id,
        user,
        tokenGet,
        amountGet,
        tokenGive,
        amountGive,
        timestamp,
    ) = exchange.id_to_order(1, {"from": account})
    ddj = exchange.id_to_cancelOrder(id, {"from": account})

    assert ddj != True
    assert user == user1
    assert tokenGet == rala_token.address

    # ------> Filling Orders
    exchange.fillOrder(id, {"from": account})

    assert (
        exchange.token_depositer_amount(ADDRESS_ZERO, account, {"from": account})
        == (amountGive * 20) / 100
    )

    assert exchange.id_to_fillOrder(id, {"from": account}) == True

    with pytest.raises(Exception):
        exchange.fillOrder(id, {"from": account})
    with pytest.raises(Exception):
        exchange.cancelOrder(id, {"from": user1})

    # ------> Staking Tokens
    user1EtherBalance = exchange.balanceOf(ADDRESS_ZERO, user1)
    exchange.stake(ADDRESS_ZERO, Web3.toWei(0.01, "ether"), {"from": user1})

    assert exchange.balanceOf(ADDRESS_ZERO, user1) == user1EtherBalance - Web3.toWei(
        0.012, "ether"
    )
    assert exchange.token_staker_amount(
        ADDRESS_ZERO, user1, {"from": user1}
    ) == Web3.toWei(0.01, "ether")
    assert exchange.stakers(0) == user1
    assert exchange.staker_uniqueTokenStaked(user1) == 1

    # ------> Unstake Tokens

    exchange.unstakeTokens(ADDRESS_ZERO, {"from": user1})
    assert exchange.token_staker_amount(ADDRESS_ZERO, user1) == 0
    assert exchange.token_depositer_amount(
        ADDRESS_ZERO, user1
    ) == user1EtherBalance - Web3.toWei(0.002, "ether")

    # ------> Issue Tokens
    accountBalance = exchange.token_depositer_amount(rala_token, account)
    UseraccountBalance = exchange.token_depositer_amount(rala_token, user1)
    exchange.stake(ADDRESS_ZERO, Web3.toWei(0.01, "ether"), {"from": user1})
    exchange.issueToken({"from": account})

    assert exchange.token_depositer_amount(rala_token, user1) > UseraccountBalance
    assert exchange.token_depositer_amount(rala_token, account) < accountBalance
