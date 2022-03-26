from logging import exception
from operator import truediv
from brownie import network, config
from scripts.helpfull_script import (
    get_account,
    get_contract,
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
)
from scripts.deploy import deploy
from web3 import Web3
import pytest

AddressZero = "0x0000000000000000000000000000000000000000"


def test_can_depositeTokens():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("You are not in Local Blockchain environment.")
    # Arrange
    account = get_account()
    rala_token, exchange = deploy()
    # So, When I am deploying Rala_Token, I am minting all the tokens to account. So now if i want to spend it from account
    # i need to call approve first as inside Exchange.sol we are using transferFrom function
    # Act
    rala_token.approve(exchange.address, Web3.toWei(1, "ether"), {"from": account})
    exchange.depositToken(rala_token, Web3.toWei(1, "ether"), {"from": account})

    expected = Web3.toWei(1, "ether")
    result = exchange.token_depositer_amount(rala_token, account)

    # Assert
    assert result > expected


def test_can_depositEther():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("You are not in Local Blockchain environment.")
    # Arrange
    account = get_account()
    rala_token, exchange = deploy()

    # Act
    exchange.depositEther({"from": account, "value": Web3.toWei(2, "ether")})

    # Assert
    assert exchange.token_depositer_amount(AddressZero, account) == Web3.toWei(
        2, "ether"
    )


def test_can_withdrawEther():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("You are not in Local Blockchain environment.")
    # Arrange
    account = get_account()
    rala_token, exchange = deploy()
    exchange.depositEther({"from": account, "value": Web3.toWei(2, "ether")})

    # Act
    with pytest.raises(Exception):
        exchange.withdrawEther(Web3.toWei(3, "ether"), {"from": account})

    exchange.withdrawEther(Web3.toWei(2, "ether"), {"from": account})

    # Assert
    assert exchange.token_depositer_amount(AddressZero, account) == 0


def test_can_withdrawToken():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("You are not in Local Blockchain environment.")
    # Arrange
    account = get_account()
    user1 = get_account(index=2)
    rala_token, exchange = deploy()
    rala_token.approve(user1, Web3.toWei(2, "ether"), {"from": account})
    rala_token.transfer(user1, Web3.toWei(2, "ether"), {"from": account})

    rala_token.approve(exchange.address, Web3.toWei(2, "ether"), {"from": user1})
    exchange.depositToken(rala_token, Web3.toWei(2, "ether"), {"from": user1})

    # Act
    with pytest.raises(Exception):
        exchange.withdrawToken(rala_token, Web3.toWei(3, "ether"), {"from": user1})

    exchange.withdrawToken(rala_token, Web3.toWei(2, "ether"), {"from": user1})

    # Assert
    assert exchange.token_depositer_amount(rala_token, user1) == 0


def test_can_make_Orders():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("You are not in Local Blockchain environment.")
    # Arrange
    account = get_account()
    user1 = get_account(index=2)
    rala_token, exchange = deploy()
    tx = exchange.depositEther({"from": user1, "value": Web3.toWei(5, "ether")})
    tx.wait(1)
    exchange.setTokenPriceFeedMapping(
        AddressZero, get_contract("eth-usd-price-feed"), {"from": account}
    )

    # Act
    exchange.makeOrder(rala_token, AddressZero, Web3.toWei(3, "ether"), {"from": user1})

    (id, user, *args) = exchange.id_to_order(1, {"from": account})

    assert user == user1
    assert id == 1
    assert args[1] == Web3.toWei(3, "ether") * (2000000000000000000000 / 10**18)


def test_getTokenValue():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("You are not in Local Blockchain environment.")
    account = get_account()
    rala_token, exchange = deploy()
    exchange.setTokenPriceFeedMapping(AddressZero, get_contract("eth-usd-price-feed"))
    price, decimals = exchange.getTokenValue(AddressZero, {"from": account})

    assert price == 2000000000000000000000
    assert decimals == 18


def test_cancelOrder():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("You are not in Local Blockchain environment.")
    # Arrange
    account = get_account()
    user1 = get_account(index=2)
    rala_token, exchange = deploy()
    tx = exchange.depositEther({"from": user1, "value": Web3.toWei(5, "ether")})
    tx.wait(1)
    exchange.setTokenPriceFeedMapping(
        AddressZero, get_contract("eth-usd-price-feed"), {"from": account}
    )

    # Act
    exchange.makeOrder(rala_token, AddressZero, Web3.toWei(3, "ether"), {"from": user1})

    (id, user, *args) = exchange.id_to_order(1, {"from": account})

    with pytest.raises(Exception):
        exchange.cancelOrder(id, {"from": account})
    exchange.cancelOrder(id, {"from": user1})

    # Assert

    assert exchange.id_to_cancelOrder(id) == True


def test_can_fillOrder():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("You are not in Local Blockchain environment.")
    # Arrange
    account = get_account()
    user1 = get_account(index=2)
    rala_token, exchange = deploy()
    print("Depositing ralaToken")
    tx = exchange.depositEther({"from": user1, "value": Web3.toWei(5, "ether")})
    tx.wait(1)
    print("Setting Token Price Feed Address....")
    exchange.setTokenPriceFeedMapping(
        AddressZero, get_contract("eth-usd-price-feed"), {"from": account}
    )

    # Act

    tx_makeOrder = exchange.makeOrder(
        rala_token.address, AddressZero, Web3.toWei(0.3, "ether"), {"from": user1}
    )
    tx_makeOrder.wait(1)
    print("Placing your Orders........")

    (
        id,
        user,
        tokenGet,
        amountGet,
        tokenGive,
        amountGive,
        timestamp,
    ) = exchange.id_to_order(1, {"from": account})
    ddj = exchange.id_to_cancelOrder(id, {"from": user1})

    assert ddj != True
    assert user == user1
    assert tokenGet == rala_token.address
    # assert amountGive == 3

    exchange.fillOrder(id, {"from": account})

    assert (
        exchange.token_depositer_amount(AddressZero, account, {"from": account})
        == (amountGive * 20) / 100
    )

    assert (
        exchange.token_depositer_amount(rala_token, user, {"from": user})
        == Web3.toWei(0.3, "ether") * 2000
    )

    assert exchange.id_to_fillOrder(id, {"from": account}) == True

    with pytest.raises(Exception):
        exchange.fillOrder(id, {"from": account})
    with pytest.raises(Exception):
        exchange.cancelOrder(id, {"from": user1})
