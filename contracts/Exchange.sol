// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Exchange is Ownable {
    //Zero address account for Ether
    address constant ETHER = address(0);
    address feeAccount;
    uint256 feePercentage;
    address token;
    uint256 public orderCounter = 0;
    address[] public stakers;
    address[] public allowedToken;

    // Model for Order
    struct _Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }

    //Mapping for how much token a individual has deposited
    mapping(address => mapping(address => uint256))
        public token_depositer_amount;
    mapping(uint256 => _Order) public id_to_order;
    mapping(uint256 => bool) public id_to_cancelOrder;
    mapping(uint256 => bool) public id_to_fillOrder;
    mapping(address => address) public tokenPriceFeedMapping;
    mapping(address => bool) public allowedToken_to_bool;
    mapping(address => uint256) public staker_uniqueTokenStaked;
    mapping(address => mapping(address => uint256)) public token_staker_amount;

    //Events
    event Deposited(address token, uint256 _amount, address depositer);
    event Withdraw(address withdrawer, address token, uint256 amount);
    event Order(_Order Order);
    event OrderCanceled(_Order Order);
    event OrderFilled(_Order Order);

    constructor(
        address _feeAccount,
        uint256 _feePercentage,
        address _token
    ) public {
        feeAccount = _feeAccount;
        feePercentage = _feePercentage;
        token = _token;
        allowedToken_to_bool[_token] = true;
        allowedToken_to_bool[ETHER] = true;
        allowedToken = [_token, ETHER];
    }

    // Deposit Token
    function depositToken(address _token, uint256 _amount) public {
        require(ERC20(_token).transferFrom(msg.sender, address(this), _amount));
        token_depositer_amount[_token][msg.sender] =
            token_depositer_amount[_token][msg.sender] +
            _amount;
        emit Deposited(_token, _amount, msg.sender);
    }

    // Deposite Ether
    function depositEther() public payable {
        token_depositer_amount[ETHER][msg.sender] =
            token_depositer_amount[ETHER][msg.sender] +
            msg.value;
        emit Deposited(ETHER, msg.value, msg.sender);
    }

    // Withdrawing ether
    function withdrawEther(uint256 _amount) public {
        require(token_depositer_amount[ETHER][msg.sender] >= _amount);
        address payable withdrawer = payable(msg.sender);
        withdrawer.transfer(_amount);
        token_depositer_amount[ETHER][msg.sender] =
            token_depositer_amount[ETHER][msg.sender] -
            _amount;
        emit Withdraw(withdrawer, ETHER, _amount);
    }

    function withdrawToken(address _token, uint256 _amount) public {
        require(_token != ETHER);
        require(token_depositer_amount[_token][msg.sender] >= _amount);
        require(ERC20(_token).transfer(msg.sender, _amount));
        token_depositer_amount[_token][msg.sender] =
            token_depositer_amount[_token][msg.sender] -
            _amount;
        emit Withdraw(msg.sender, _token, _amount);
    }

    function balanceOf(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return token_depositer_amount[_token][_user];
    }

    // Make function for making orders
    function makeOrder(
        address _tokenGet,
        address _tokenGive,
        uint256 _amountGive
    ) public returns (uint256) {
        require(
            token_depositer_amount[_tokenGive][msg.sender] >= _amountGive,
            "You need to have balance in the exchange to make order."
        );
        (uint256 price, uint256 decimal) = getTokenValue(_tokenGive);
        //     // Here _amountGive should be in wei form --> 10 **18
        uint256 amountGet = _amountGive * (price / 10**decimal);
        orderCounter = orderCounter + 1;
        _Order memory order = _Order(
            orderCounter,
            msg.sender,
            _tokenGet,
            amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
        id_to_order[orderCounter] = order;
        emit Order(order);
        return amountGet;
    }

    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        address priceFeedAddress = tokenPriceFeedMapping[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 decimals = uint256(priceFeed.decimals());
        return (uint256(price), decimals);
    }

    // Setting the price feed address to the corresponding token
    function setTokenPriceFeedMapping(address _token, address _priceFeedAddress)
        public
        onlyOwner
    {
        tokenPriceFeedMapping[_token] = _priceFeedAddress;
    }

    function cancelOrder(uint256 _id) public {
        require(id_to_fillOrder[_id] != true);
        _Order storage order = id_to_order[_id];
        require(
            order.user == msg.sender,
            "You can not cancel someone else's order."
        );
        id_to_cancelOrder[_id] = true;
        emit OrderCanceled(order);
    }

    function fillOrder(uint256 _id) public {
        require(id_to_fillOrder[_id] != true, "The Order has already filled");
        require(
            id_to_cancelOrder[_id] != true,
            "The Order has been canceled by the order owner."
        );

        _Order storage order = id_to_order[_id];

        uint256 feeAmount = (order.amountGive * feePercentage) / 100;
        // Token Given
        // Here all the assest is in this contract so we don't need to transfer the assest any where
        // we can just update their mapping
        token_depositer_amount[order.tokenGive][order.user] =
            token_depositer_amount[order.tokenGive][order.user] -
            (order.amountGive + feeAmount);
        token_depositer_amount[order.tokenGive][msg.sender] =
            token_depositer_amount[order.tokenGive][msg.sender] +
            order.amountGive;

        // // Token Get
        token_depositer_amount[order.tokenGet][msg.sender] =
            token_depositer_amount[order.tokenGet][msg.sender] -
            order.amountGet;
        token_depositer_amount[order.tokenGet][order.user] =
            token_depositer_amount[order.tokenGet][order.user] +
            order.amountGet;

        // // FeeAmount to FeeAccount
        token_depositer_amount[order.tokenGive][feeAccount] = feeAmount;
        id_to_fillOrder[_id] = true;
        emit OrderFilled(order);
    }

    function stake(address _token, uint256 _amount) public {
        // Which token to stake
        // How much to stake
        uint256 depositBalance = balanceOf(_token, msg.sender);
        require(allowedToken_to_bool[_token], "This Token not allowed.");
        require(depositBalance >= _amount, "Need more.");
        updateUniqueTokenStaked(msg.sender);
        uint256 feeAmount = (_amount * feePercentage) / 100;
        token_depositer_amount[_token][msg.sender] =
            token_depositer_amount[_token][msg.sender] -
            (_amount + feeAmount);
        token_staker_amount[_token][msg.sender] =
            token_staker_amount[_token][msg.sender] +
            _amount;
        token_depositer_amount[_token][feeAccount] = feeAmount;

        if (staker_uniqueTokenStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
    }

    function updateUniqueTokenStaked(address user) internal {
        staker_uniqueTokenStaked[user] = staker_uniqueTokenStaked[user] + 1;
    }

    function addAllowedToken(address _token) public onlyOwner {
        allowedToken_to_bool[_token] = true;
        allowedToken.push(_token);
    }

    function unstakeTokens(address _token) public {
        uint256 balance = token_staker_amount[_token][msg.sender];

        require(balance > 0, "You don't have Tokens to unstake.");
        staker_uniqueTokenStaked[msg.sender] =
            staker_uniqueTokenStaked[msg.sender] -
            1;
        token_staker_amount[_token][msg.sender] = 0;
        token_depositer_amount[_token][msg.sender] =
            token_depositer_amount[_token][msg.sender] +
            balance;
        if (staker_uniqueTokenStaked[msg.sender] == 0) {
            for (
                uint256 stakersIndex = 0;
                stakersIndex < stakers.length;
                stakersIndex++
            ) {
                if (stakers[stakersIndex] == msg.sender) {
                    stakers[stakersIndex] = stakers[stakers.length - 1];
                    stakers.pop();
                }
            }
        }
    }

    // Update this as such --> That user can claim there reward according to the timeStamp
    function issueToken() public onlyOwner {
        // issue a reward to all the staker according to the amount they have staked

        for (
            uint256 stakersIndex = 0;
            stakersIndex < stakers.length;
            stakersIndex++
        ) {
            address staker = stakers[stakersIndex];
            uint256 reward = (getStakerTotalValue(staker) * feePercentage) /
                100;

            token_depositer_amount[token][feeAccount] =
                token_depositer_amount[token][feeAccount] -
                reward;

            token_depositer_amount[token][staker] =
                token_depositer_amount[token][staker] +
                reward;
        }
    }

    function getStakerTotalValue(address _staker)
        public
        view
        returns (uint256)
    {
        uint256 totalValue = 0;
        require(
            staker_uniqueTokenStaked[_staker] > 0,
            "User don't have any value staked."
        );
        for (
            uint256 allowedTokenIndex = 0;
            allowedTokenIndex < allowedToken.length;
            allowedTokenIndex++
        ) {
            if (
                token_staker_amount[allowedToken[allowedTokenIndex]][_staker] >
                0
            ) {
                totalValue =
                    totalValue +
                    getStakersSingleTokenValue(
                        _staker,
                        allowedToken[allowedTokenIndex]
                    );
            }
        }
        return totalValue;
    }

    function getStakersSingleTokenValue(address _staker, address _token)
        public
        view
        returns (uint256)
    {
        require(
            staker_uniqueTokenStaked[_staker] > 0,
            "User don't have any value staked."
        );

        (uint256 price, uint256 decimals) = getTokenValue(_token);
        return ((token_staker_amount[_token][_staker] * price) /
            (10**decimals));
    }
}
