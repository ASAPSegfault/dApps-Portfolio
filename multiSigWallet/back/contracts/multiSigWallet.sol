pragma solidity >=0.4.21 <0.9.0;
pragma experimental ABIEncoderV2;

contract multiSigWallet {
    struct Transfer {
        uint id;
        uint amount;
        uint approvals;
        bool is_sent;
        address payable to;
    }
    address[] public approvers;
    uint public quorum;
    Transfer[] public transfers;
    mapping(address => mapping(uint => bool)) public approvals;
    
    constructor(address[] memory _approvers, uint _quorum) public {
        approvers = _approvers;
        quorum = _quorum;
    }
    
    function getApprovers() external view returns(address[] memory) {
        return approvers;
    }
    
    function getTransfers() external view returns(Transfer[] memory) {
        return transfers;
    }
    
    function approveTransfer(uint id) external onlyApprovedAddresses() {
        require(transfers[id].is_sent == false, 'transfer already sent');
        require(approvals[msg.sender][id] == false, 'transfer already approved');
        
        approvals[msg.sender][id] = true;
        transfers[id].approvals++;
        if (transfers[id].approvals > quorum) {
            transfers[id].is_sent = true;
            address payable to = transfers[id].to;
            uint amount = transfers[id].amount;
            to.transfer(amount);
        }
    }
    
    function transferEther(address payable _to, uint _amount) external onlyApprovedAddresses() {
        transfers.push(Transfer(
            transfers.length,
            _amount,
            0,
            false,
            _to
        ));
    }

    receive() external payable {
    
    }
    
    modifier onlyApprovedAddresses()  {
        bool is_allowed = false;
        for(uint i = 0; i < approvers.length; i++) {
            if (approvers[i] == msg.sender) {
                is_allowed = true;
            }
        }
        require(is_allowed == true, 'Only approvers addresses allowed');
        _;
    }
}