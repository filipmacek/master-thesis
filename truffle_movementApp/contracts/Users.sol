pragma solidity >=0.4.22 <0.6.0;

contract Users {
    
    struct User {
        string username;
        string password;
        string wallet_address;
    }
    
    // Users mappings
    mapping(uint => User) public users;
    
    // Users count
    uint public usersCount;
    
    constructor () public {
        usersCount=0;
    }
    
    
    function addUser(string _username, string _password, string _wallet_address) public {
        usersCount++;
        users[usersCount]=User(_username,_password,_wallet_address);
    }
    
}