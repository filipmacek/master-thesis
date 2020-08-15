// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.7.0;

import "./lib/vendor/Ownable.sol";
import "./lib/ChainlinkClient.sol";


contract Movement is ChainlinkClient,Ownable {
    
    // Global config
    // Agent is entity who is recording and listening on our android app for user UI event
    // He is not responsible for knowing is user completed the route or any data related to route
    // He only record on blockchain UI events that happend
    // He assign Chainlink nodes with responsibilty for data extraction,filtering,mining coordinates data
    address private agent;
    
    uint constant private ORACLE_PAYMENT = 1 *LINK;
    address constant LINK_TOKEN_ADDRESS =0xa36085F69e2889c224210F603D836748e7dC0088;
                                         
    struct User {
        uint userId;
        string username;
        string password;
        address addr;
        bool isExist;
        uint routesStarted;
        uint routesFinished;
        uint routesCompleted;
    }
    // mapping from user address to userId
    mapping(address =>bool) userExistsByAddress;
    
    struct Route {
        uint routeId;
        address maker;
        address taker;
        string startLocation;
        string endLocation;
        bool isStarted;
        bool isFinished;
    }
    
    struct RouteStartEvent{
        uint routeStartId;
        uint routeId;  // which route
        string username;    // who started this route
        uint timestamp;   // when the event has been published
        uint[] nodes; // which nodes started the route
    }
    
    struct RouteEndEvent{
        uint routeEndId;
        uint routeStartId;  // link to proper RouteStartEvent
        uint timestamp;     // when the event has been published
        uint dataPoints;    // how many coordinate data points the app recorded
        uint[] nodesDataReceived;   // of that dataPoints record how many points each node recored
        uint user_status;  // state in which route finished - did user cancel route, or sumbited it 
        
    }
    
    // Constants related to states that can happen with started route
     uint constant USER_CANCELED = 1;
     uint constant USER_SUBMITED_ROUTE = 2;
    
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
    
    // Route start event
    RouteStartEvent[] routeStartEvents;
    
    // Route end events
    RouteEndEvent[] routeEndEvents;
    
    
    constructor(address _agent)public Ownable(){
        agent = _agent;
        //sets the stored address for LINK token and initializes proper interface for LINK so we can send and receive tokens
        setChainlinkToken(LINK_TOKEN_ADDRESS);
        
        // init madin User
        addUser("Madin","pass");
        
        // init route 
        addRoute("45.812806, 15.997851","45.812279, 15.996553");
        
        // init node Koala
        addNode("Koala","52.201.220.65","api",0xa5CB721FC436796b22D322cc2eC2DBc562C3C67e);
    }


    // User events
    event NewUserCreated(uint index,string username,address addr);
    
    event UserDeleted(string username);

    // Routes events
    event NewRouteCreated(uint routeId,address maker,string startLocation,string endLocation);
    
    event RouteStarted(uint routeId);
    
    event RouteFinished(uint routeId);
    
    event RouteStatusFulfilled(bytes32 indexed requestId,bool status);

    // nodes
    event NewNodeAdded(uint nodeId,string name);
    event NodeDeleted(uint nodeId);
    

    
    function addUser(string memory _username, string memory _password) public {
        users.push(User(users.length+1,_username,_password,msg.sender,true,0,0,0));
        userExistsByAddress[msg.sender] = true;
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
    
    // Agents functions
    function startRouteEvent(uint _routeId,string memory _username,uint[] memory _nodes) public onlyAgent{
        // require that user is registerd and exists
        require(userExistsByAddress[msg.sender]);
        
        // Change route status
        // Dont forget to add -1 because its index of array
        routes[_routeId-1].isStarted = true;
        routes[_routeId-1].taker = msg.sender;
        

        // Add info to routesStartEvents
        routeStartEvents.push(RouteStartEvent(routeStartEvents.length+1,_routeId,_username,now,_nodes));
        
        emit RouteStarted(_routeId);    
        
        
    }
    function endRouteEvent(uint _routeStartId,uint user_event,uint _dataPoints,uint[] memory _nodeData)public onlyAgent{
        uint len = routeEndEvents.length;
        if(user_event == USER_CANCELED){
            // User canceled so we dont care about any other data
            // we init both dataPoints and node data to 0
            uint[] memory nodeData= new uint[](0);
            routeEndEvents.push(RouteEndEvent(len+1,_routeStartId,now,
            0,nodeData,
            USER_CANCELED));

        }else if(user_event == USER_SUBMITED_ROUTE){
            // User sumbited route
            routeEndEvents.push(RouteEndEvent(
                len+1,_routeStartId,now,_dataPoints,
                _nodeData,
                USER_SUBMITED_ROUTE));
           
            
        }
        
    }
    
    
    // Request route status by user on dapp
    function requestRouteStatus(uint _routeId,string memory _jobID,address _oracleAddress) public onlyOwner {
    

        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobID),address(this),this.fulfillRouteStatus.selector);
        req.add("extPath","1");
        sendChainlinkRequestTo(_oracleAddress,req,ORACLE_PAYMENT);
        
        
    }
    function fulfillRouteStatus(bytes32 _requestId,bool _status) public recordChainlinkFulfillment(_requestId){
        emit RouteStatusFulfilled(_requestId,_status);
        routes[0].isFinished = _status;
        
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
    
    modifier onlyUser(uint routeId){
        // First check if user is reqistered and his address exists in our data
        require(userExistsByAddress[msg.sender]);
        
        // Then check if user is taker - he started the route
        require(routes[routeId-1].taker == msg.sender);
        _;
    }
    
    
    
}