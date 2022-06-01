pragma solidity ^0.5.16;

contract ERC20Token {
    string public name = "Token";
    string public symbol = "TK";
    string public standard = "Token v1.0";
    uint256 public totalSupply;
   

    // EIP's
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowed;

    // Events
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function allSupply() public view returns (uint256) {
        return totalSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        payable
        returns (bool success)
    {
        // Check if the admin account has more tokens than specified
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        // Tranfer Event
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    // Approves a spender(another wallet) to withdraw money from msg.sender(owner)
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowed[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    // returns the current approved number of tokens by an owner to a specific spender
    function allowance(address owner, address _spender)
        public
        view
        returns (uint256)
    {
        return allowed[owner][_spender];
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public payable returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowed[_from][msg.sender]);

        balanceOf[_from] -= _value; 
        balanceOf[_to] += _value; 

        allowed[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }
}
 