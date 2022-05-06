// SPDX-License-Identifier: GPLv3
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "./CarlCoin.sol";

contract VoteHandler is Initializable, OwnableUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    address public CC;
    mapping(string => uint) public vote_count;
    bool public is_paused;

    event Vote(address from, string identifier, uint256 amount);

    modifier onlyActiveContract {
        require(is_paused == false, "This contract is paused, most functions are unavailable");
        _;
    }

    function initialize(address token_address) initializer public {
        __Ownable_init();
        is_paused = true;
        CC = token_address;
    }

    function pause(bool do_pause) external onlyOwner {
        is_paused = do_pause;
    }

    function vote(uint amount, string calldata token) external onlyActiveContract returns ( bool ) {
        vote_count[token] += amount;
        IERC20Upgradeable( CC ).safeTransferFrom(msg.sender, address(this), amount);
        _burn(amount);
        emit Vote(msg.sender, token, amount);
        return true;
    }

    function burn(uint amount) external onlyOwner {
        return _burn(amount);
    }
    function _burn(uint amount) internal {
        return CarlCoin( CC ).burn(amount);
    }

    function getVoteCount(string calldata token) external view returns ( uint ) {
        return vote_count[token];
    }
    function getVoteCounts(string[] calldata tokens) external view returns ( uint[] memory ) {
        uint[] memory ans = new uint[](tokens.length);
        for (uint i = 0; i < tokens.length; i++) {
            ans[i] = vote_count[tokens[i]];
        }
        return ans;
    }
}
