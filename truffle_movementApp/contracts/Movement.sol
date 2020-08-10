// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.7.0;

import "./lib/vendor/Ownable.sol";
import "./lib/ChainlinkClient.sol";


contract Movement is ChainlinkClient,Ownable {
    
    struct User {
        string username;
        string password;
        address addr;
        bool isExist;
    }
    
    struct Route {
        uint routeId;
        address maker;
        address taker;
        string startLocation;
        string endLocation;
        bool isStarted;
        bool isFinished;
    }
    
    struct Node {
        uint nodeId;
        string nodeName;
        string ip;
        string data_endpoint;
        address oracleContractAddress;
    }
    
    
    // Users array
    User[] public users;

    // Routes array
    Route[] public routes;
    
    // Nodes array
    Node[] public nodes;


    // User events
    event NewUserCreated(uint index,string username,address addr);
    
    event UserDeleted(string username);

    // Routes events
    event NewRouteCreated(uint routeId,address maker,string startLocation,string endLocation);
    
    event RouteStarted(uint routeId);
    
    event RouteFinished(uint routeId);

    // nodes
    event NewNodeAdded(uint nodeId,string name);
    

    
    function addUser(string memory _username, string memory _password) public {
        users.push(User(_username,_password,msg.sender,true));
        emit NewUserCreated(users.length,_username,msg.sender);
    }
    
    function addRoute(string memory _startLocation,string memory _endLocation)public {
        routes.push(Route(routes.length+1,msg.sender,address(0),_startLocation,_endLocation,false,false));
        emit NewRouteCreated(routes.length,msg.sender,_startLocation,_endLocation);
    }
    
    function addNode(string memory _name,string memory _ip,string memory _data_endpoint,address _oracleContractAddress) public {
        nodes.push(Node(nodes.length+1,_name,_ip,_data_endpoint,_oracleContractAddress));
        emit NewNodeAdded(nodes.length,_name);
    }
    
    function getUsersCount() public view returns(uint) {
        return users.length;
    }
    
    function getRoutesCount() public view returns(uint) {
        return routes.length;
    }
    function getNodesCount()public view returns(uint){
        return nodes.length;
    }
    

    
    
    function deleteUser(string memory _username) public returns(bool) {
        require(users.length>0);
        
        for(uint i=0;i<users.length;i++){
            if(compareStrings(users[i].username,_username)){
                users[i].username=users[users.length-1].username;
                users[i].password=users[users.length-1].password;
                users[i].addr=users[users.length-1].addr;
                break;
            }
        }
        users.pop();
        emit UserDeleted(_username);
        return true;
        
        
    }
    
    function compareStrings (string memory a, string memory b) public view returns (bool) {
            return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
       }
    
    
    function getUsername(uint index) public view returns(string memory){
       return users[index].username;
    }
    
    function getPassword(uint index) public view returns(string memory){
            return users[index].password;
        }
    
    function getAddress(uint  index) public view returns(address){
            return users[index].addr;
        }



    
    
}