from brownie import RALA_Token, network
from scripts.helpfull_script import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
import pytest


def test_RALAToken_deployment():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("You are not in Local Blockchain environment.")
    account = get_account()
    rala_token = RALA_Token.deploy({"from": account})

    assert rala_token.name() == "RALA Token"
    assert rala_token.symbol() == "RL"
