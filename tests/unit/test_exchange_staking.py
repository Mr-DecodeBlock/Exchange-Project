from brownie import network
from scripts.helpfull_script import (
    get_account,
    ADDRESS_ZERO,
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
)
from scripts.deploy import deploy
from web3 import Web3
import pytest


def test_can_stake():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("You are not in Local Blockchain environment.")
    # Arrange
    user1 = get_account(index=1)
    rala_token, exchange = deploy()

    exchange.depositEther({"from": user1, "value": Web3.toWei(3, "ether")})

    exchange.stake(ADDRESS_ZERO, Web3.toWei(2, "ether"), {"from": user1})

    assert exchange.balanceOf(ADDRESS_ZERO, user1) == Web3.toWei(0.6, "ether")
    assert exchange.token_staker_amount(
        ADDRESS_ZERO, user1, {"from": user1}
    ) == Web3.toWei(2, "ether")
    assert exchange.stakers(0) == user1
    assert exchange.staker_uniqueTokenStaked(user1) == 1


def test_can_unstake():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("You are not in Local Blockchain environment.")
    user1 = get_account(index=1)
    rala_token, exchange = deploy()

    exchange.depositEther({"from": user1, "value": Web3.toWei(3, "ether")})

    exchange.stake(ADDRESS_ZERO, Web3.toWei(2, "ether"), {"from": user1})
    exchange.unstakeTokens(ADDRESS_ZERO, {"from": user1})

    assert exchange.token_staker_amount(ADDRESS_ZERO, user1) == 0
    assert exchange.token_depositer_amount(ADDRESS_ZERO, user1) == Web3.toWei(
        2.6, "ether"
    )


def test_can_issueToken():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("You are not in Local Blockchain environment.")
    account = get_account()
    user1 = get_account(index=1)
    rala_token, exchange = deploy()

    accountBalance = exchange.token_depositer_amount(rala_token, account)

    exchange.depositEther({"from": user1, "value": Web3.toWei(3, "ether")})

    exchange.stake(ADDRESS_ZERO, Web3.toWei(0.2, "ether"), {"from": user1})
    exchange.issueToken({"from": account})

    assert (
        exchange.token_depositer_amount(rala_token, user1)
        == Web3.toWei(400, "ether") * 0.2
    )

    assert exchange.token_depositer_amount(rala_token, account) == accountBalance - (
        Web3.toWei(400, "ether") * 0.2
    )


def test_can_getStakerTotalValue():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("You are not in Local Blockchain environment.")
    account = get_account()
    user1 = get_account(index=1)
    rala_token, exchange = deploy()

    accountBalance = exchange.token_depositer_amount(rala_token, account)

    exchange.depositEther({"from": user1, "value": Web3.toWei(3, "ether")})

    t = exchange.stake(ADDRESS_ZERO, Web3.toWei(0.2, "ether"), {"from": user1})
    t.wait(1)
    tx = exchange.getStakerTotalValue(user1)

    assert tx == Web3.toWei(400, "ether")
    assert exchange.staker_uniqueTokenStaked(user1) == 1


# 400,000,000,000,000,000,000
