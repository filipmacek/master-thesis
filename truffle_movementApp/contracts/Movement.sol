// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.7.0;

import "./lib/vendor/Ownable.sol";
import "./lib/ChainlinkClient.sol";


contract Movement is ChainlinkClient,Ownable{
    
    // Global config
    // Agent is entity who is recording and listening on our android app for user UI event
    // He is not responsible for knowing is user completed the route or any data related to route
    // He only record on blockchain UI events that happend
    // He assign Chainlink nodes with responsibilty for data extraction,filtering,mining coordinates data
    
    
    address private agent;
    
    uint constant private ORACLE_PAYMENT = 1*LINK; 
    
    address constant LINK_TOKEN_ADDRESS =0xa36085F69e2889c224210F603D836748e7dC0088;
    
     
    // Constants related to states that can happen with started route
     uint constant USER_CANCELED = 1;
     uint constant USER_SUBMITED_ROUTE = 2;
                                    
                                    
                                         
    struct User {
        uint userId;
        string username;
        string password;
        address addr;
        bool isExist;
        uint routesStarted;
        uint routesCanceled;
        uint routesFinished;
        uint routesCompleted;
    }
    // mapping from user address to userId
    mapping(string =>bool) userExistsByUsername;
    mapping(address => bool) userExistsByAddress;
    mapping(string => uint) userIndexByUsername;
    // Users array
    User[] public users;
    
    
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
     // Routes array
    Route[] public routes;
    

    struct RouteStartEvent{
        uint routeStartId;
        uint routeId;  // which route
        string username;    // who started this route
        uint timestamp;   // when the event has been published
        bool node1Status;
        bool node2Status;
    }
    RouteStartEvent[] public routeStartEvents;
       
       
    struct RouteEndEvent{
        uint routeEndId;
        uint routeId;
        string username;
        uint timestamp;     // when the event has been published
        uint dataPoints;    // how many coordinate data points the app recorded
        uint node1DataPoints;
        uint node2DataPoints;
        uint userStatus;  // state in which route finished - did user cancel route, or sumbited it 
    } 
    RouteEndEvent[] public routeEndEvents; 
  
     
     
    struct CheckStatusEvent{
        uint checkStatusId;
        uint routeId;
        string username; // for which user we are checking if he completed the route;
        uint timestamp;
        uint node1Distance;
        uint node1Time;
        bool node1Status;
        uint node2Distance;
        uint node2Time;
        bool node2Status;
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
    
    

    
    struct Node {
        uint nodeId;
        string nodeName;
        string ip;
        string data_endpoint;
        address oracleContractAddress;
        uint routesChecked;
        string jobIdDistance;
        string jobIdTime;
        string jobIdStatus;
        }
    // Nodes array
    Node[] public nodes;
    


    
    
    constructor(address _agent)public Ownable(){
        agent = _agent;
        //sets the stored address for LINK token and initializes proper interface for LINK so we can send and receive token
        setChainlinkToken(LINK_TOKEN_ADDRESS);
        
        
        // init madin User
        addUser("Madin","pass");
        
        // init routes 
        addRoute("45.812806, 15.997851","45.812279, 15.996553","Simple test route #1");
        addRoute("45.812788, 15.997867","45.814575, 15.997341","Simple test route #2");
        addRoute("45.814485, 15.996837","45.812638, 15.994187","Simple test route #3");
        
        
      
        // init nodes
        addNode("Koala","100.26.234.183","api",0x289263696E145BE938c70859371ED0E1a23c9b0C,
                "b0706441803646aaa630a0f10d1fa554",
                "b785755641924c4da504345eb01f87d3",
                "7fbd91ca2ece4sc79991a80c6e090493d3");
        addNode("Lion","52.91.148.208","api",0x2eF56656657601993EcdDE122B286E2d001196dA,
                "58af0011d85f47e287fdd2c73c1e9b27",
                "56a5f2427dfa4666b2b379531060fddf",
                "f1a81e713519493697bfec51331e7d42");
    }


  //============= Events =======================

    event UserCreated(uint userIndex);
    
    event RouteCreated(uint routeIndex);
    
    event StartRouteEvent(uint routeStartId);
    
    event EndRouteEvent(uint routeEndId);
    
    event StatusCheckEvent(uint checkStatusId);
    
    event StatusCheckFulfilled(uint checkStatusId);
    
    event CompletedRouteEvent(uint routeCompletedId);


    

    
    function addUser(string memory _username, string memory _password) public {
        users.push(User(users.length+1,_username,_password,msg.sender,true,0,0,0,0));
        userExistsByUsername[_username]=true;
        userExistsByAddress[msg.sender]=true;
        userIndexByUsername[_username]=users.length-1;
        emit UserCreated(users.length-1);
    }
    
    function addRoute(string memory _startLocation,string memory _endLocation,string memory _description)public {
        string memory taker = '';
        routes.push(Route(routes.length+1,msg.sender,taker,_startLocation,_endLocation,false,false,false,_description));
        emit RouteCreated(routes.length-1);
    }
    
    
    function addNode(string memory _name,string memory _ip,string memory _data_endpoint,
                    address _oracleContractAddress,
                    string memory _jobIdDistance,
                    string memory _jobIdTime,
                    string memory _jobIdStatus) private {
        nodes.push(Node(nodes.length+1,_name,_ip,_data_endpoint,_oracleContractAddress,0,_jobIdDistance,_jobIdTime,_jobIdStatus));
    }
    
    
    // Get Count funkcije
    
    function getUsersCount() public view returns(uint) {
        return users.length;
    }
    
    function getRoutesCount() public view returns(uint) {
        return routes.length;
    }
    
    function getNodesCount()public view returns(uint){
        return nodes.length;
    
    }   
    function getRouteStartEventCount() public view returns(uint){
        return routeStartEvents.length;
    }
    function getRouteEndEventCount() public view returns(uint){
        return routeEndEvents.length;
    }
    function getCheckStatusEventCount () public view returns(uint){
        return checkStatusEvents.length;
    }
    
    
    
    // Agents functions
    function startRouteEvent(uint _routeId,string memory _username,bool _node1Status,bool _node2Status) public onlyAgent{
        // require that user is registerd and exists
        require(userExistsByUsername[_username],"User doesnt exists");
        
        // Change route status
        // Dont forget to add -1 because its index of array
        routes[_routeId-1].isStarted = true;
        routes[_routeId-1].taker =_username;
        users[userIndexByUsername[_username]].routesStarted+=1;
        

        // Add info to routesStartEvents
        routeStartEvents.push(RouteStartEvent(routeStartEvents.length+1,_routeId,_username,now,_node1Status,_node2Status));
        
        emit StartRouteEvent(routeStartEvents.length-1);    
        
        
    }
 
  
    
    function endRouteEvent(uint _routeId,string memory _username,uint user_event,uint _dataPoints,uint _node1DataPoints,uint _node2DataPoints)public onlyAgent{
        uint len = routeEndEvents.length;
        if(user_event == USER_CANCELED){
            // User canceled so we dont care about any other data
            // we init both dataPoints and node data to 0
            
            routeEndEvents.push(RouteEndEvent(len+1,_routeId,_username,now,0,0,0,USER_CANCELED));
            routes[_routeId-1].isStarted = false;
            routes[_routeId-1].taker ='';
            users[userIndexByUsername[_username]].routesCanceled+=1;
            emit EndRouteEvent(routeEndEvents.length-1);

        }else if(user_event == USER_SUBMITED_ROUTE){
            // User sumbited route
            routeEndEvents.push(RouteEndEvent(len+1,_routeId,_username,now,_dataPoints,_node1DataPoints,_node2DataPoints,USER_SUBMITED_ROUTE));
           routes[_routeId-1].isFinished =true;
           users[userIndexByUsername[_username]].routesFinished+=1;
           
           
           // User submited route - call requestRouteStatus to ask chainlink nodes about route status
           requestRouteStatus(_routeId,_username);
           
           
           emit EndRouteEvent(routeEndEvents.length-1);
            
        }
        
    }
    
   
    
    // Request route status by user on dapp
    function requestRouteStatus(uint _routeId,string memory _username) private {
        
        string memory _routeIdString = uintToString(_routeId);

    
        // Init CheckStatusEvent data -- we will write to this variable all our results
        checkStatusEvents.push(CheckStatusEvent(checkStatusEvents.length+1,_routeId,_username,now,0,0,false,0,0,false));
        emit StatusCheckEvent(checkStatusEvents.length);
        
        
        //--------------Node 1 -----------------------
            // Distance Data Request
            Chainlink.Request memory req1 = buildChainlinkRequest(stringToBytes32(nodes[0].jobIdDistance),address(this),this.fulfillDistanceRequest1.selector);
            req1.add("extPath",_routeIdString);
            sendChainlinkRequestTo(nodes[0].oracleContractAddress,req1,ORACLE_PAYMENT);
            
            // // Time Data Request
             Chainlink.Request memory req2 = buildChainlinkRequest(stringToBytes32(nodes[0].jobIdTime),address(this),this.fulfillTimeRequest1.selector);
            req2.add("extPath",_routeIdString);
            sendChainlinkRequestTo(nodes[0].oracleContractAddress,req2,ORACLE_PAYMENT);
            
            // Status Data Request
             Chainlink.Request memory req3 = buildChainlinkRequest(stringToBytes32(nodes[0].jobIdStatus),address(this),this.fulfillStatusRequest1.selector);
            req3.add("extPath",_routeIdString);
            sendChainlinkRequestTo(nodes[0].oracleContractAddress,req3,ORACLE_PAYMENT);
        
       
       
        // -------------------- Node 2 -------------------------------
           // Distance Data Request
            Chainlink.Request memory req4 = buildChainlinkRequest(stringToBytes32(nodes[1].jobIdDistance),address(this),this.fulfillDistanceRequest2.selector);
            req4.add("extPath",_routeIdString);
            sendChainlinkRequestTo(nodes[1].oracleContractAddress,req4,ORACLE_PAYMENT);
            
            // // Time Data Request
             Chainlink.Request memory req5 = buildChainlinkRequest(stringToBytes32(nodes[1].jobIdTime),address(this),this.fulfillTimeRequest2.selector);
            req5.add("extPath",_routeIdString);
            sendChainlinkRequestTo(nodes[1].oracleContractAddress,req5,ORACLE_PAYMENT);
            
            //Status Data Request
             Chainlink.Request memory req6 = buildChainlinkRequest(stringToBytes32(nodes[1].jobIdStatus),address(this),this.fulfillStatusRequest2.selector);
            req6.add("extPath",_routeIdString);
            sendChainlinkRequestTo(nodes[1].oracleContractAddress,req6,ORACLE_PAYMENT);
            
            emit StatusCheckFulfilled(checkStatusEvents.length);

    }

    
    // Distance Callback for node1 && node2
    
    function fulfillDistanceRequest1(bytes32 _requestId,uint _distance)public recordChainlinkFulfillment(_requestId){
        checkStatusEvents[checkStatusEvents.length-1].node1Distance = _distance;
        
    }
     function fulfillDistanceRequest2(bytes32 _requestId,uint _distance)public recordChainlinkFulfillment(_requestId){
        checkStatusEvents[checkStatusEvents.length-1].node2Distance = _distance;
        
    }
    
    
    
    // Time Callbacks for node1 && node2
    
    function fulfillTimeRequest1(bytes32 _requestId,uint _time)public recordChainlinkFulfillment(_requestId){
        checkStatusEvents[checkStatusEvents.length-1].node1Time=_time;

    }
     function fulfillTimeRequest2(bytes32 _requestId,uint _time)public recordChainlinkFulfillment(_requestId){
        checkStatusEvents[checkStatusEvents.length-1].node2Time=_time;

    }
    
    
    
    // Status Callbacks for node1 && node2
    
     function fulfillStatusRequest1(bytes32 _requestId,bool _status)public recordChainlinkFulfillment(_requestId){
        checkStatusEvents[checkStatusEvents.length-1].node1Status = _status;
        
    }
        function fulfillStatusRequest2(bytes32 _requestId,bool _status)public recordChainlinkFulfillment(_requestId){
        checkStatusEvents[checkStatusEvents.length-1].node2Status = _status;
        
    }
    
    
    
    
    
  
    
 
    function getRouteCompletedEventCount() public view returns (uint){
        return routeCompletedEvents.length;
    }

    
    
    // function deleteUser(string memory _username) public returns(bool) {
    //     // require(users.length>0);
        
    //     // for(uint i=0;i<users.length;i++){
    //     //     if(compareStrings(users[i].username,_username)){
    //     //         users[i].username=users[users.length-1].username;
    //     //         users[i].password=users[users.length-1].password;
    //     //         users[i].addr=users[users.length-1].addr;
    //     //          users.pop();
    //     //         emit UserDeleted(_username);
    //     //         return true;
    //     //     }
    //     // }
       
    //     // return false;
        
        
    // }
    
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
    
    // function deleteNode(uint _nodeId) public returns(bool){
    //     // require(nodes.length>0);
    //     // uint len = nodes.length;
    //     // for(uint i=0;i<len;i++){
    //     //     if(nodes[i].nodeId == _nodeId){
    //     //         nodes[i].nodeId = nodes[len-1].nodeId;
    //     //         nodes[i].nodeName = nodes[len-1].nodeName;
    //     //         nodes[i].ip = nodes[len-1].ip;
    //     //         nodes[i].data_endpoint = nodes[len-1].data_endpoint;
    //     //         nodes[i].oracleContractAddress = nodes[len-1].oracleContractAddress;
    //     //         nodes.pop();
    //     //         emit NodeDeleted(_nodeId);
    //     //         return true;
    //     //     }
    //     // }
    //     // return false;
    // }
    
    
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
    
     function uintToString(uint _i) internal pure returns (string memory _uintAsString) {
    if (_i == 0) {
        return "0";
    }
    uint j = _i;
    uint len;
    while (j != 0) {
        len++;
        j /= 10;
    }
    bytes memory bstr = new bytes(len);
    uint k = len - 1;
    while (_i != 0) {
        bstr[k--] = byte(uint8(48 + _i % 10));
        _i /= 10;
    }
    return string(bstr);
}
    


    // modifiers
    modifier onlyAgent(){
        require(msg.sender == agent);
        _;
    }
    
    
    
}