// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.7.0;

import "./lib/vendor/Ownable.sol";
import "./lib/ChainlinkClient.sol";
import './DataServiceAgreement.sol';

contract Movement is ChainlinkClient,Ownable {
    
    // Global config
    // Agent is entity who is recording and listening on our android app for user UI event
    // He is not responsible for knowing is user completed the route or any data related to route
    // He only record on blockchain UI events that happend
    // He assign Chainlink nodes with responsibilty for data extraction,filtering,mining coordinates data
    address private agent;
    
    uint constant private ORACLE_PAYMENT = 1 *LINK;
    address constant LINK_TOKEN_ADDRESS =0xa36085F69e2889c224210F603D836748e7dC0088;
    
    DataServiceAgreement private dataServiceAgreement;
                                    
                                    
                                         
    struct User {
        uint userId;
        string username;
        string password;
        address addr;
        bool isExist;
        uint routesStarted;
        uint routesCanceled;
        uint routesCompleted;
    }
    // mapping from user address to userId
    mapping(string =>bool) userExistsByUsername;
    mapping(address => bool) userExistsByAddress;
    mapping(string => uint) userIndexByUsername;
    
    struct Route {
        uint routeId;
        address maker;
        string taker;
        string startLocation;
        string endLocation;
        bool isStarted;
        bool isFinished;
        bool isCompleted;
        string description;
    }
    
    struct RouteStartEvent{
        uint routeStartId;
        uint routeId;  // which route
        string username;    // who started this route
        uint timestamp;   // when the event has been published
        uint nodeId; // which nodes started the route
    }
    RouteStartEvent[] public routeStartEvents;
       
       
    struct RouteEndEvent{
        uint routeEndId;
        uint routeId;
        string username;
        uint timestamp;     // when the event has been published
        uint dataPoints;    // how many coordinate data points the app recorded
        uint nodeId;
        uint userStatus;  // state in which route finished - did user cancel route, or sumbited it 
    } 
    RouteEndEvent[] public routeEndEvents; 
  
     
     
    struct CheckStatusEvent{
        uint checkStatusId;
        uint routeId;
        string username; // for which user we are checking if he completed the route;
        uint timestamp;
        
    }
    CheckStatusEvent[] public checkStatusEvents;  
       
       
    struct RouteCompletedEvent{
        uint routeCompletedId;
        uint routeId;
        string username;
        string timestamp;
        uint time;
    }
    RouteCompletedEvent[] public routeCompletedEvents;
    
    
    
    // Constants related to states that can happen with started route
     uint constant USER_CANCELED = 1;
     uint constant USER_SUBMITED_ROUTE = 2;
    
    struct Node {
        uint nodeId;
        string nodeName;
        string ip;
        string data_endpoint;
        address oracleContractAddress;
        uint routesChecked;
    }
    
    
    // Users array
    User[] public users;

    // Routes array
    Route[] public routes;
    
    // Nodes array
    Node[] public nodes;
    


    
    
    constructor(address _agent,DataServiceAgreement _addr))public Ownable(){
        agent = _agent;
        dataServiceAgreement = _addr;
        //sets the stored address for LINK token and initializes proper interface for LINK so we can send and receive token
        
        // init madin User
        addUser("Madin","pass");
        
        // init route 
        addRoute("45.812806, 15.997851","45.812279, 15.996553","Simple test route");
        
        // init node Koala
        addNode("Koala","54.147.250.55","api",0xa5CB721FC436796b22D322cc2eC2DBc562C3C67e);
    }


  //============= Events =======================

    // User events
    event UserCreated(uint userIndex);
    
    // Routes events
    event RouteCreated(uint routeIndex);
    
    event StartRouteEvent(uint routeStartId);
    
    event EndRouteEvent(uint routeEndId);
    
    event StatusCheckEvent(uint checkStatusId);
    
    event CompletedRouteEvent(uint routeCompletedId);


    

    
    function addUser(string memory _username, string memory _password) public {
        users.push(User(users.length+1,_username,_password,msg.sender,true,0,0,0));
        userExistsByUsername[_username]=true;
        userExistsByAddress[msg.sender]=true;
        userByUsername[_username]=users.length-1;
        emit UserCreated(users.length-1);
    }
    
    function addRoute(string memory _startLocation,string memory _endLocation,string memory _description)public {
        string memory taker = '';
        routes.push(Route(routes.length+1,msg.sender,taker,_startLocation,_endLocation,false,false,false,_description));
        emit RouteCreated(routes.length-1);
    }
    
    
    function addNode(string memory _name,string memory _ip,string memory _data_endpoint,address _oracleContractAddress) private {
        nodes.push(Node(nodes.length+1,_name,_ip,_data_endpoint,_oracleContractAddress,0));
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
    
    // Agents functions
    function startRouteEvent(uint _routeId,string memory _username,uint _nodeId) public onlyAgent{
        // require that user is registerd and exists
        require(userExistsByUsername[_username],"User doesnt exists");
        
        // Change route status
        // Dont forget to add -1 because its index of array
        routes[_routeId-1].isStarted = true;
        routes[_routeId-1].taker =_username;
        users[userIndexByUsername[_username]].routesStarted+=1;
        

        // Add info to routesStartEvents
        routeStartEvents.push(RouteStartEvent(routeStartEvents.length+1,_routeId,_username,now,_nodeId));
        
        emit RouteStarted(routeStartEvents.length-1);    
        
        
    }
    function getRouteStartEventCount() public view returns(uint){
        return routeStartEvents.length;
    }
    
  
    
    function endRouteEvent(uint _routeId,string memory _username,uint user_event,uint _dataPoints,uint _nodeId)public onlyAgent{
        uint len = routeEndEvents.length;
        if(user_event == USER_CANCELED){
            // User canceled so we dont care about any other data
            // we init both dataPoints and node data to 0
            
            routeEndEvents.push(RouteEndEvent(len+1,_routeId,_username,now,0,_nodeId,USER_CANCELED));
            routes[_routeId-1].isStarted = false;
            routes[_routeId-1].taker ='';
            users[userIndexByUsername[_username]].routesCanceled+=1;

        }else if(user_event == USER_SUBMITED_ROUTE){
            // User sumbited route
            routeEndEvents.push(RouteEndEvent(len+1,_routeId,_username,now,_dataPoints,_nodeId,USER_SUBMITED_ROUTE));
           routes[_routeId-1].isFinished =true;
           users[userByUsername[_username]-1].routesFinished+=1;
           requestRouteStatus(_routeId)

            
        }
        
    }
    
      function getRouteEndEventCount() public view returns(uint){
        return routeEndEvents.length;
    }
    
    // Request route status by user on dapp
    function requestRouteStatus(uint _routeId) private {
    

        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobID),address(this),this.fulfillRouteStatus.selector);
        req.add("extPath","1");
        sendChainlinkRequestTo(_oracleAddress,req,ORACLE_PAYMENT);
        
        
    }
    
    function getStatusEventCount () public view returns(uint){
        return checkStatusEvents.length;
    }
    
    
    function fulfillRouteStatus(bytes32 _requestId,bool _status) public recordChainlinkFulfillment(_requestId){
        emit RouteStatusFulfilled(_requestId,_status);
        routes[0].isFinished = _status;
        
    }
    function getRouteCompletedEventCount() public view returns (uint){
        return routeCompletedEvents.length;
    }

    
    
    function deleteUser(string memory _username) public returns(bool) {
        require(users.length>0);
        
        for(uint i=0;i<users.length;i++){
            if(compareStrings(users[i].username,_username)){
                users[i].username=users[users.length-1].username;
                users[i].password=users[users.length-1].password;
                users[i].addr=users[users.length-1].addr;
                 users.pop();
                emit UserDeleted(_username);
                return true;
            }
        }
       
        return false;
        
        
    }
    
    function getUserIdWithAddress(address _address)private view returns(uint){
        require(users.length>0);
        uint len = users.length;
        for(uint i=0;i<len;i++){
            if(users[i].addr == _address){
                return users[i].userId;
            }
        }
        
        revert('User with this address doesnt exist');
    }
    
    function deleteNode(uint _nodeId) public returns(bool){
        require(nodes.length>0);
        uint len = nodes.length;
        for(uint i=0;i<len;i++){
            if(nodes[i].nodeId == _nodeId){
                nodes[i].nodeId = nodes[len-1].nodeId;
                nodes[i].nodeName = nodes[len-1].nodeName;
                nodes[i].ip = nodes[len-1].ip;
                nodes[i].data_endpoint = nodes[len-1].data_endpoint;
                nodes[i].oracleContractAddress = nodes[len-1].oracleContractAddress;
                nodes.pop();
                emit NodeDeleted(_nodeId);
                return true;
            }
        }
        return false;
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
        
    // Helper functions
    function stringToBytes32(string memory source) private pure returns(bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if(tempEmptyStringTest.length == 0){
            return 0x0;
            
        }
        assembly {
            result := mload(add(source,32))
            
        }
    }


    // modifiers
    modifier onlyAgent(){
        require(msg.sender == agent);
        _;
    }
    
    
    
}