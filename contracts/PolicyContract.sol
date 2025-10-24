// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

interface IPremiumTreasury {
    function sendPayout(
        uint256 tokenId,
        address recipient,
        uint256 amount
    ) external;
}

interface IOracleConsumer {
    function isClaimable(
        uint256 policyId,
        uint256 tokenId // users policy nft token id
    ) external view returns (bool);
}

contract PolicyContract is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    ERC721Burnable,
    AccessControl
{
    using Strings for uint256;

    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct Policy {
        address owner; // owner of the premium
        uint256 expiry; // if 0 then no expiry
        bool premiumPaid; // to track if user is paying premium
        bool claimed;
    }

    string public policyName;
    string public policyDescription;
    string public policySlug;
    string public imageUrl;
    uint256 public policyId;
    address public oracle;
    address public treasury;
    address public mUSDC;
    uint256 public premiumAmount;
    uint256 public payoutAmount;
    uint256 public tokenIdCounter;

    mapping(uint256 => Policy) public policies;
    mapping(uint256 => uint256) public lastPremiumPaid; // Uinx timestamp of when last premium is paid by the owner

    event PolicyPurchased(
        uint256 tokenId,
        address owner,
        uint256 expiry,
        uint256 amount,
        string tokenURI,
        string policySlug
    );
    event PremiumPaid(uint256 tokenId, uint256 amount, string policySlug);
    event ClaimProcessed(
        uint256 tokenId,
        address owner,
        uint256 amount,
        bool success,
        string policySlug
    );
    event ParamsUpdated(
        uint256 premiumAmount,
        uint256 payoutAmount,
        string policySlug
    );

    constructor(
        string memory _name,
        string memory _slug,
        string memory _policyDescription,
        string memory _imageUrl,
        uint256 _policyId,
        address _oracle,
        address _treasury,
        address _mUSDC,
        uint256 _premiumAmount,
        uint256 _payoutAmount
    ) ERC721(_name, "DERISK") {
        policyName = _name;
        policySlug = _slug;
        policyDescription = _policyDescription;
        imageUrl = _imageUrl;
        policyId = _policyId;
        oracle = _oracle;
        treasury = _treasury;
        mUSDC = _mUSDC;
        premiumAmount = _premiumAmount;
        payoutAmount = _payoutAmount;

        // assign roles
        _grantRole(ORACLE_ROLE, _oracle);
        _grantRole(ADMIN_ROLE, msg.sender); // deployer (InsuranceFactory)
    }

    function buyPolicy(
        address owner,
        uint256 expiryDuration // timestamp
    ) external {
        require(
            IERC20(mUSDC).transferFrom(msg.sender, treasury, premiumAmount),
            "Initial premium failed"
        );

        uint256 tokenId = tokenIdCounter++;
        uint256 expiry = expiryDuration == 0
            ? 0
            : block.timestamp + expiryDuration;

        policies[tokenId] = Policy({
            owner: owner,
            expiry: expiry,
            premiumPaid: true,
            claimed: false
        });

        lastPremiumPaid[tokenId] = block.timestamp;
        string memory tokenUri = _buildTokenURI(tokenId, expiry);

        _safeMint(owner, tokenId);
        _setTokenURI(tokenId, tokenUri);

        emit PolicyPurchased(
            tokenId,
            owner,
            expiry,
            premiumAmount,
            tokenUri,
            policySlug
        );
    }

    function payPremium(uint256 tokenId) external {
        require(_ownerOf(tokenId) != address(0), "Policy does not exists");
        require(policies[tokenId].premiumPaid, "Policy inactive");
        require(
            block.timestamp <= policies[tokenId].expiry ||
                policies[tokenId].expiry == 0,
            "Policy expired"
        );

        require(
            IERC20(mUSDC).transferFrom(msg.sender, treasury, premiumAmount),
            "Premium payment failed"
        );

        lastPremiumPaid[tokenId] = block.timestamp;
        policies[tokenId].premiumPaid = true;

        emit PremiumPaid(tokenId, premiumAmount, policySlug);
    }

    function claim(uint256 tokenId) external {
        require(_ownerOf(tokenId) == msg.sender, "Not policy owner");
        require(policies[tokenId].premiumPaid, "Premiums not paid");
        require(
            block.timestamp <= policies[tokenId].expiry ||
                policies[tokenId].expiry == 0,
            "Policy expired"
        );
        require(!policies[tokenId].claimed, "Already claimed");
        require(
            IOracleConsumer(oracle).isClaimable(policyId, tokenId),
            "Claim conditions not met"
        );

        IPremiumTreasury(treasury).sendPayout(
            tokenId,
            policies[tokenId].owner,
            payoutAmount
        );

        policies[tokenId].claimed = true;
        _burn(tokenId); // Single-claim policy
        emit ClaimProcessed(
            tokenId,
            msg.sender,
            payoutAmount,
            true,
            policySlug
        );
    }

    function updateClaimStatus(
        uint256 tokenId,
        bool claimable
    ) external onlyRole(ORACLE_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Policy does not exist");
        policies[tokenId].claimed = !claimable; // If claimable, mark as not claimed to allow payout
        if (
            claimable &&
            policies[tokenId].premiumPaid &&
            (block.timestamp <= policies[tokenId].expiry ||
                policies[tokenId].expiry == 0)
        ) {
            // To auto-trigger payout
            IPremiumTreasury(treasury).sendPayout(
                tokenId,
                policies[tokenId].owner,
                payoutAmount
            );

            policies[tokenId].claimed = true;
            _burn(tokenId);
            emit ClaimProcessed(
                tokenId,
                policies[tokenId].owner,
                payoutAmount,
                true,
                policySlug
            );
        }
    }

    function _buildTokenURI(
        uint256 tokenId,
        uint256 expiry
    ) internal view returns (string memory) {
        string memory tokenName = string(
            abi.encodePacked(policyName, " #", tokenId.toString())
        );
        string memory tokenExpiry = expiry.toString();

        // Build metadata JSON
        string memory json = string(
            abi.encodePacked(
                '{"name":"',
                tokenName,
                '","description":"',
                policyDescription,
                '","image":"',
                imageUrl,
                '","expiry":"',
                tokenExpiry,
                '"}'
            )
        );

        string memory encodedJson = Base64.encode(bytes(json));

        return
            string(
                abi.encodePacked("data:application/json;base64,", encodedJson)
            );
    }

    function updateParams(
        // to update the premium and payout amounts of policy that already exists
        uint256 _premiumAmount,
        uint256 _payoutAmount
    ) external onlyRole(ADMIN_ROLE) {
        require(_premiumAmount > 0 && _payoutAmount > 0, "Invalid amounts");
        premiumAmount = _premiumAmount;
        payoutAmount = _payoutAmount;
        emit ParamsUpdated(_premiumAmount, _payoutAmount, policySlug);
    }

    // The following functions are overrides required by Solidity.
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
