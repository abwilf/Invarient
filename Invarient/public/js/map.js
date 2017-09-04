 // console.log("MAPDATA IS: " + $('#mapData').val());
 // console.log(typeof(mapData));
 // console.log("MAPID IS: " + $('#mapId').val());
 // console.log(typeof($('#mapId').val()))




// SCRIPT BELOW HERE
// what I changed: got rid of all socket stuff, altered saveMap(), createMap(), "begin here" section


function zoom() {
    //console.log("zoooom");
    gGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

zoomListener = d3.behavior.zoom(); //use a zoom listener to preserve the scale accross the program.

var svgContainer = d3.select("#tree-container").append("svg")
                                    .attr("width", $(document).width())
                                    .attr("height", $(document).height())
                                    .attr("class", "overlay")
                                    .call(zoomListener.scaleExtent([.2, 5]).on("zoom", zoom)).on("dblclick.zoom", null)

var gGroup = d3.select("svg").append("g");

function rightRoundedRect(x, y, width, height, radius) {
  return "M" + (x+width) + "," + y
       + "h" + (x + radius)
       + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
       + "v" + (height - 2 * radius)
       + "h" + (radius - width)
       + "z";
}

function drawToolbar() {
  var buttonWidth = 4;
  var toolbarPlacement = 1;
  var buttonSpacing = 4.15;

  svgContainer.append("defs")
    .append("pattern")
    .attr("id", "add_button")
    .attr('patternUnits', 'userSpaceOnUse')
    .attr("width", buttonWidth+"em")
    .attr("height", buttonWidth+"em")
    .append("image")
    // .attr("fill", "#00EADE")
    .attr("xlink:href", '/icons/add-button.svg')
    .attr("width", buttonWidth+"em")
    .attr("height", buttonWidth+"em");

  // svgContainer.append("image")

  // console.log("toolbar function");
  // svgContainer.append("svg:pattern")
  //   .attr("id", "add_icon")
  //   .attr("width", "5%")
  //   .attr("height", "5%")
  //   .attr("patternUnits", "userSpaceOnUse")
  //   .append("svg:image")
  //   .attr("xlink:href", "icons/add-button.svg")
  //   .attr("width", "5%")
  //   .attr("height", "5%")
  //   .attr("x", 10)
  //   .attr("y", 10);

  // svgContainer.append("svg:image")
  //   .attr('x',10)
  //   .attr('y',10)
  //   .attr('width', 30)
  //   .attr('height', 30)
  //   .attr("xlink:href","icons/add-button.svg")
    // .attr("xlink:href","public/icons/add-button.svg")

  // var rect00 = svgContainer.append("path")
  //   .attr("d", rightRoundedRect(10, 10, 40, 40, 10))

    // .attr("d", rightRoundedRect(toolbarPlacement+"em", toolbarPlacement+"em", buttonWidth+"em", buttonWidth+"em", 20));
    // .attr("fill", "#00EADE")
    // .on("click", function() {
    //   eventNewComesFromNode()
    // });
  var rect00 = svgContainer.append("rect")
    .attr("x", toolbarPlacement+"em")
    .attr("y", toolbarPlacement+"em")
    .attr("width", buttonWidth+"em")
    .attr("height", buttonWidth+"em")
    .attr("fill", "#00EADE")
    .attr("fill", "url(#add_button)")
    .on("click", function() {
      eventNewComesFromNode()
    });

  var rect01 = svgContainer.append("rect")
    .attr("x", toolbarPlacement+buttonSpacing+"em")
    .attr("y", toolbarPlacement+"em")
    .attr("width", buttonWidth+"em")
    .attr("height", buttonWidth+"em")
    .attr("fill", "#00EADE")
    .on("click", function() {
      // TODO: put appropriate function here
    });

  var rect02 = svgContainer.append("rect")
    .attr("x", toolbarPlacement+2*buttonSpacing+"em")
    .attr("y", toolbarPlacement+"em")
    .attr("width", buttonWidth+"em")
    .attr("height", buttonWidth+"em")
    .attr("fill", "#00EADE")
    .on("click", function() {
      // TODO: put appropriate function here
    });

  var rect03 = svgContainer.append("rect")
    .attr("x", toolbarPlacement+3*buttonSpacing+"em")
    .attr("y", toolbarPlacement+"em")
    .attr("width", buttonWidth+"em")
    .attr("height", buttonWidth+"em")
    .attr("fill", "#00EADE")
    .on("click", function() {
      // TODO: put appropriate function here
    });

  var rect10 = svgContainer.append("rect")
    .attr("x", toolbarPlacement+"em")
    .attr("y", toolbarPlacement+buttonSpacing+"em")
    .attr("width", buttonWidth+"em")
    .attr("height", buttonWidth+"em")
    .attr("fill", "#00EADE")
    .on("click", function() {
      // TODO: put appropriate function here
    });

  var rect11 = svgContainer.append("rect")
    .attr("x", toolbarPlacement+buttonSpacing+"em")
    .attr("y", toolbarPlacement+buttonSpacing+"em")
    .attr("width", buttonWidth+"em")
    .attr("height", buttonWidth+"em")
    .attr("fill", "#00EADE")
    .on("click", function() {
      // TODO: put appropriate function here
    });

  var rect12 = svgContainer.append("rect")
    .attr("x", toolbarPlacement+2*buttonSpacing+"em")
    .attr("y", toolbarPlacement+buttonSpacing+"em")
    .attr("width", buttonWidth+"em")
    .attr("height", buttonWidth+"em")
    .attr("fill", "#00EADE")
    .on("click", function() {
      // TODO: put appropriate function here
    });

  var rect13 = svgContainer.append("rect")
    .attr("x", toolbarPlacement+3*buttonSpacing+"em")
    .attr("y", toolbarPlacement+buttonSpacing+"em")
    .attr("width", buttonWidth+"em")
    .attr("height", buttonWidth+"em")
    .attr("fill", "#00EADE")
    .on("click", function() {
      // TODO: put appropriate function here
    });
}

dragListener = d3.behavior.drag()
  .on("dragstart", function(){
    console.log("Drag starting.");
    var node = getClickedNode( this );

    // for filterByNode
    if (filtersDict.filterByNodeOn) {
        filtersDict.nodeFilteredBy = node;
        m_helper();
    }

    if (node == root) {
        return;
    }

    //console.log(d3.select(this).attr("cx"));
    //console.log(d3.select(this).attr("cy"));
    node.x = Number(d3.select(this).attr("cx"));
    node.y = Number(d3.select(this).attr("cy"));


    dragStarted = true;

    d3.event.sourceEvent.stopPropagation();
  })
  .on("drag", function(){
    console.log("Dragging.");
    var node = getClickedNode( this );

    if (node == root) {
        return;
    }

    if (dragStarted == true) {
      // d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
      dragStarted = false;
    }

    var svgnode = d3.select(this);

    scale = zoomListener.scale();


    node.x += d3.event.dx;
    node.y += d3.event.dy;

    //svgnode.attr("transform", "translate(" + node.x + "," + node.y +")");

  })
  .on("dragend", function() {
    var node = getClickedNode(this);

    if (node == root) {
        return;
    }

    if (dragTarget && dragTarget != node){
        console.log("Drag target present!")
        //Remove node from previous parent
        for (var i = 0; i < node.parent.children.length; i++) {
            if (node.parent.children[i] === node) {
                node.parent.children.splice(i, 1);
            }
        }
        node.parent = null;

        if (node.connection == "neoroot"){
            node.connection = "arrow";
        }

        add(dragTarget, node);

        dragTarget = null;
    }

    else if (!dragTarget){
        for (var i = 0; i < node.parent.children.length; i++) {
            if (node.parent.children[i] === node) {
                node.parent.children.splice(i, 1);
            }
        }
        node.parent = null;

        node.connection = "neoroot";

        add(root, node);

        dragTarget = null;
    }
    else{
        console.log("Weird!");
        console.log(dragTarget);
    }

    if (nodeInitialState == 0) {
        toggleSubtree(node);
        nodeInitialState = -1;
    }

    if (dragStarted == false){
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
        update( root );

    }
    onSelect( node );
});

function eventNewComesFromNode() {

    //Fetch the current active node.
    var curr = getCurrentNode();
    var txt = prompt("", "Enter comes from node text");

    if (txt) {
        var tmp = new Node(root.x, 0, txt);

        tmp.connection = "arrow";

        add(curr, tmp);

        update(root);
        onSelect(tmp);
    }
}

function eventSave() {

    if (typeof(root) == 'undefined') {
        console.log('Cannot save with null root');
    }
    else {
        saveMap();
    }
}

function eventEdit() {

    //Fetch the node corresponding to the currently selected svg element
    curr = getCurrentNode()
    var oldTxt = curr.data;
    var txt = prompt("Enter new node text.", curr.data);

    if ( txt ){
        //console.log("Wasn't null.");
        curr.data = txt;
    }
    else {
        curr.data = oldTxt;
    }

    update(root);
    onSelect( curr );
}

function eventNewDefinitionNode() {

    //Fetch the current active node.
    curr = getCurrentNode();
    var txt = prompt("", "Enter definition node text.");
    if (txt) {
        var tmp = new Node(root.x, 0, txt);

        add(curr, tmp);

        update(root);
        onSelect( tmp );
    }
}

function eventToggleSubtree() {

    toggleSubtree( getCurrentNode() );
    update( root );
    onSelect( getCurrentNode() );
}

function eventTraverseUp() {

    if (getCurrentNode().parent != root) {
        onSelect( getCurrentNode().parent );
    }
}

function eventTraverseDown() {

    if (getCurrentNode().children.length > 0) {
        onSelect( getCurrentNode().children[0] );
    }
}

function eventTraverseLeft() {

    var depth = getCurrentNode().depth;

    var nodesAtDepth = [];

    traverseAndDo(root, function (d) {
        if (d.depth == depth) {
            nodesAtDepth.push(d);
        }
    });

    for (var i = 1; i < nodesAtDepth.length; i++ ) {
        if (nodesAtDepth[i] == getCurrentNode()) {
            onSelect( nodesAtDepth[i-1] );
            break;
        }
    }
}

function eventTraverseRight() {

    var depth = getCurrentNode().depth;

    var nodesAtDepth = [];

    traverseAndDo(root, function (d) {
        if (d.depth == depth) {
            nodesAtDepth.push(d);
        }
    });

    for (var i = 0; i < nodesAtDepth.length-1; i++ ) {
        if (nodesAtDepth[i] == getCurrentNode()) {
            onSelect( nodesAtDepth[i+1] );
            break;
        }
    }
}

function eventUndo() {

    var revived = null;

    if (removedNodes.length > 0) {
        revived = removedNodes[removedNodes.length - 1]
        add(revived.parent, revived);
        update(root);
        onSelect(revived);
        removedNodes.pop();
    }
}

function eventDelete() {

    remove( getCurrentNode() );
    update(root);
    onSelect(getCurrentNode().parent);
}

function eventNeoroot() {

    var txt = prompt("", "Enter node text here");

    if (txt) {
        var tmp = new Node(root.x, 0, txt);

        tmp.connection = "neoroot";

        add(root, tmp);
        update(root);
        onSelect( tmp);
    }
}

function eventEditConnection() {

    curr = getCurrentNode();

    var lbl = prompt("", "Enter label connection type. [comes from], [definition], [custom]");
    if (!lbl){
        lbl = curr.connection;
    }
    else if (lbl == "comes from" || lbl == "n") {
        lbl = "arrow";
    }
    else if (lbl == "d" || lbl == "definition") {
        lbl = "line";
    }
    else if (lbl == "custom" || lbl == "c") {
        var lbl = prompt("", "Enter custom connection type");
    }

    curr.connection = lbl;

    update(root);
    onSelect(curr);
}

function eventNewCustomNode() {

    curr = getCurrentNode();

    var lbl = prompt("", "Enter custom connection label");
    if (!lbl){
        lbl = "line";
    }

    var txt = prompt("", "Enter custom node text");
    if (txt) {
        var tmp = new Node(root.x, 0, txt);

        tmp.connection = lbl;

        add(curr, tmp);
        update(root);
        onSelect(tmp);
    }
}

function eventLinkNode() {

    curr = getCurrentNode();

    var txt = prompt("", "Enter the link to the tree.");
    if (txt) {
        curr.link = txt;
        update(root);
    }
}

function isLocalId(id) {
  var arr = id.split("/");

  //If the link is a local id
  if (arr[0] === uniqueId){
    return true;
  }
  else{
    return false;
  }
}

function getParsedId(id){
  var arr = id.split("/");
  return arr;
}

function eventLinkClicked() {

    var node = getCurrentNode();

    if (!isLocalId(node.link)){
        openNewTabId(node.link);
    }
    else {
        var localId = getParsedId(node.link)[1];
        node = getNodeByPermId(localId);
        setCurrentNode(node);
        onSelect(node);
        update(root);
    }
}

function eventModal() {

    curr = getCurrentNode();
    console.log(curr.link);
    modalopen = true;
    $('#myModal').modal('show');  // pop up window

    // set modal elements
    curr.data ? (document.getElementById("title").value = curr.data) :  (document.getElementById("title").value = "");
    curr.comment ? (document.getElementById("comment").value = curr.comment) : (document.getElementById("comment").value = "");
    curr.link ? (document.getElementById("linkToText").value = curr.link) : (document.getElementById("linkToText").value = "");

    //////////////////////////////////////////////////////// MATTYB //////////////////////////////////////////////////////////////////////
    $("#getLinkText").empty();
    $("#getLinkText").append(uniqueId + "/" + curr.permId);    // appends node's link

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // curr.assigned ? (document.getElementById("assigned_peeps").value = curr.assigned) : (document.getElementById("assigned_peeps").value = "");
    // curr.priority ? (document.getElementById("priority").value = curr.priority.toString()) : (document.getElementById("priority").value = 5);
    // curr.date ? (document.getElementById("date").value = curr.date) : (document.getElementById("date").value = "");
    // if (curr.actionable) {
    //   document.getElementById("act_1").checked = true;
    //   document.getElementById("act_2").checked = false;
    // }
    // else {
    //     document.getElementById("act_2").checked = true;
    //     document.getElementById("act_1").checked = false;
    // }

}

window.addEventListener("keydown", keyPressed, false);

function keyPressed(e) {

    if (modalopen) {
        return;
    }

    console.log(e.keyCode);
    switch (e.keyCode) {

        case 78:
            console.log("The 'n' key is pressed.");
            eventNewComesFromNode();
            break;

        case 79:
            console.log("The 'o' key is pressed.");
            eventModal();
            break;

        case 83:
            console.log("The 's' key is pressed.");
            eventSave();
            break;

        case 69:
            // 1
            console.log("The 'e' key is pressed.");
            eventEdit();
            break;

        case 68:
            console.log("The 'd' key is pressed.");
            eventNewDefinitionNode();
            break;

        case 32:
            console.log("The '(space)' key is pressed.");
            e.preventDefault();
            eventToggleSubtree();
            break;

        case 38:
            console.log("The 'up arrow' key is pressed.");
            eventTraverseUp();
            break;

        case 40:
            console.log("The 'down arrow' key is pressed.");
            eventTraverseDown();
            break;

        case 37:
            console.log("The 'left arrow' key is pressed.");
            eventTraverseLeft();
            break;

        case 39:
            console.log("The 'right arrow' key is pressed.");
            eventTraverseRight();
            break;

        case 90:
            console.log("The 'z' key is pressed.");
            eventUndo();
            break;

        case 8:
            console.log("The 'delete' key is pressed.");
            eventDelete();
            break;

        case 70:
            console.log("The 'f' key is pressed.");
            eventNeoroot();
            break;

        case 89:
            console.log("The 'y' key is pressed.");
            eventEditConnection();
            break;

        case 67:
            console.log("The 'c' key is pressed.");
            eventNewCustomNode();
            break;

        default:
            console.log("Pressed an unrecognized key!");
            break;
    }
    // console.log("about to run list actions!");
          // console.log("Pressed an unrecognized key!");
}

function getClickedNode(clicked) {

    var temp = d3.select(clicked).attr("id");
    var temp = temp.substr(1);
    var selected = node_map["" + temp];
    return selected
}

function hydrateData(data) {

    traverseAndDo(data, function(d) {
        if( typeof(d.children) !== 'undefined') {
            d.children.forEach(function(child, elem){
                child.parent = d;
            })
        }
    })
}

var root;
var _csrf;
var currentNode;
var dragStarted;
var dragTarget;
var nodeOriginalState;
var modalopen = false;
var filteredlist = new Array();
var sortByPriorityOn = false;
var sortByDateOn = false;
var filtersDict = {actionableFilterOn: false, notActionableFilterOn: false, completedFilterOn: false, notCompletedFilterOn: false, peopleOn: false, people: [], filterByNodeOn: false, nodeFilteredBy: null};
var uniqueId; // for finding map in db
var nodeId; // for centering on a certain node when linked to           // MATT - HERE'S THE NODE ID <3
var permId = 0;

var nodeWidthPercent = 16
var nodeWidthMargin = $(document).width()*(nodeWidthPercent/700)
var nodeHeightPercent = nodeWidthPercent/6
var nodeHeightScale = 20;

var nodeWidth = $(document).width()*(nodeWidthPercent/100)
var nodeHalfWidth = ($(document).width()*(nodeWidthPercent/100)) / 2
var nodeHeightPadding = $(document).width()*(nodeHeightPercent/100)

// BEGIN HERE
$(function() {

    if ($('#mapData').val()) {
        console.log("Loaded!");
        root = JSON.parse($('#mapData').val());
        console.log(typeof(root));
        uniqueId =$('#mapId').val();
        console.log('UNIQUE ID: ' + uniqueId);
        _csrf = $('#_csrf').val();
        console.log("CSRF IS: " + _csrf);
        nodeId = $('#nodeId').val();
        console.log("NODE ID : " + nodeId);
    }
    else {
        console.log("ERROR: Didn't load correctly'");
        root = new Node($(document).width() / 2, 50, "Enter your text here.");
    }

    hydrateData(root);
    root.depth = 0;
    setCurrentNode(root.children[0]);
    // drawToolbar();
    update(root);
    onSelect(root.children[0]);

    if (nodeId){
      var temp = getNodeByPermId(nodeId);
      setCurrentNode(temp);
      onSelect(temp);
      update(root);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Constructor for Nodes
function Node(x, y, data) {

    this.x = x;
    this.y = y;

    this.connection = "line"; //types: line, arrow, custom

    this.data = data; // title

    this.depth = null;
    this.parent = null;
    this.id = null;
    this.permId = permId;
    permId++;
    this.link = null;

    this.children = [];

    this.toggle = 0;

    this.numLines = 1;
    this.height = null;
}

// remember that it has to be saved as an array because you get it as an array (root = root[0] on get)
function saveToJSON(node_in) {

    var obj = JSONHelper(root, []);
    obj = JSON.stringify(obj);
        //console.log(root);
    hydrateData(root);
    return obj;
}

// call with root
function JSONHelper(node_in, nodes) {

    newNodes = dehydrateNode(node_in);
    nodes.push(newNodes);
    return nodes;
}

function dehydrateNode(node_in) {

    // console.log("Dehydrating node:");
    node_in.parent = null;
    if (typeof(node_in.children) !== 'undefined')  {
        node_in.children.forEach(function(child, elem) {
            child.parent = null;
            dehydrateNode(child);
        });
    }
    return node_in;
}

//Helper function, iterates through tree and calls d on each node
function traverseAndDo(node, d) {
    temp = traverseAndDo;

    d(node);
    traverseAndDo = function(node) {
        d(node);
        if (node.children) {
            node.children.forEach(traverseAndDo);
        }
    }

    if (node.children) {
      node.children.forEach(traverseAndDo);
    }

    traverseAndDo = temp;
}

//Helper function, iterates through tree and calls d on each node AFTER children
function postTraverseAndDo(node, d) {

    temp = postTraverseAndDo;

    postTraverseAndDo = function(node) {
        if (node.children) {
            node.children.forEach(postTraverseAndDo);
        }
        d(node);
    }

    if (node.children) {
        node.children.forEach(postTraverseAndDo);
    }
    d(node);

    postTraverseAndDo = temp;
}

//Given a node pointer, attach a node to it
function add(parent, child) {

    if (parent == root){
        child.connection = "neoroot";
    }

    if (parent.toggle == 0) {
        child.parent = parent;
        parent.children.push(child);
        child.depth = parent.depth + 1;
    }
    else {
        child.parent = parent;
        parent._children.push(child);
        child.depth = parent.depth + 1;
    }
}

function remove(node) {

    for (var i = 0; i < node.parent.children.length; i++) {
        if (node.parent.children[i] === node) {
            node.parent.children.splice(i, 1);
            removedNodes.push( node );
            return;
        }
    }
}

id = 0;
var nodeInitialState;

function dragOn(node) {

    //If children are visible hide them.
    if (node.toggle == 0) {
        toggleSubtree( node );
        nodeInitialState = 0;
    }

    dragStarted = false;

    var source = d3.select("#a" + node.id);
}

// define marker
d3.select("svg").append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
    // .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

function drawNode(node) {

    if (node.children) {
        for (var i = 0; i < node.children.length; ++i) {
            if (node.children[i].connection != "neoroot") {

                var line = gGroup.append("line")
                   .attr("x1", node.x)
                   .attr("y1", node.y + node.height/2)
                   .attr("x2", node.children[i].x)
                   .attr("y2", node.children[i].y + node.children[i].height/2)
                   .attr("stroke-width", 2)
                   .attr("stroke", "#00CEF4");
                //Arrow connection
                if (node.children[i].connection == "arrow") {
                    line.attr("marker-end", "url(#end)");
                }
                //Custom connection
                else if (node.children[i].connection != "line"){
                    line.attr("marker-end", "url(#end)");
                    var lbl = gGroup.append("text")
                                     .attr("x", (node.x + node.children[i].x)/2 + 5)
                                     .attr("y", (node.y + node.children[i].y)/2 - 20)
                                     .attr("font-family", "sans-serif")
                                     .attr("font-size", "15px")
                                     .attr("font-style", "italic")
                                     .text( function(d) { return node.children[i].connection });
                }
            }
        }
    }

    //TODO: do we want a visual drag indicator? Maybe a rounded rectangle around the node
    // var circle = gGroup.append("circle")
    //    .attr("cx", node.x - 10)
    //    .attr("cy", node.y - 5)
    //    .attr("r", 5)
    //    .attr("fill", function (d) {
    //      return getColor(node);
    //    })
    //    .attr("stroke", "black")
    //    .attr("stroke-width", 1)
    //    .attr("id", "a" + id)
    //
    //
    // if (node == root){
    //     circle.attr("display", "none");
    // }

    node_map["" + id] = node;
    node.id = id;

    console.log(node.numLines);

    var text = gGroup.append("text")
                           .attr("x", node.x)
                           .attr("y", node.y - (node.numLines - 1)*(nodeHeightScale/2))
                          //  .attr("y", node.y - (node.numLines-1)*(nodeHeightScale/2))
                           .attr("text-anchor", "middle")
                           // FIXME: change font
                           .attr("font-family", "sans-serif")
                           .attr("font-size", "14px")
                           .attr("font-color", "white")
                           .attr("fill", "white")
                           .attr("id", "b" + id)
                           .text( function(d) { return node.data });

    //TODO: compute height and where to wrap
    node.textsize = document.getElementById("b" + id).getComputedTextLength();
    var wrapTuple = wrap(text, nodeWidth-nodeWidthMargin, node.numLines);
    text = wrapTuple[0];
    node.numLines = wrapTuple[1]
    node.height = wrapTuple[1]*nodeHeightScale+nodeHeightPadding;
    // text = wrap(text, nodeWidth, node.numLines);

    if (node.textsize > nodeWidth) {
        //TODO: what is this for?
        node.textsize = nodeWidth;
        // node.height = 40*()
    }

    var roundedRectangle = gGroup.append("rect")
        //TODO: calculate numerical equivalent of 6%
        // .attr("x", node.x - node.textsize/2)

        // .attr("width", node.textsize)
        .attr("width", nodeWidthPercent+"%")
        // .attr("x", node.x - node.textsize/2)
        .attr("x", node.x - nodeHalfWidth)

        // console.log(window.innerWidth)
        // .attr("x", node.x - width/2)

        .attr("y", node.y - node.height/2)
        //TODO: variable height based on numRows
        //FIXME
        // .attr("height", node.height)
        .attr("height", node.height)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("fill", function (d) {
          return getColor(node);
        })

        .attr("id", "a" + id)

    if (node==root){
        roundedRectangle.attr("display", "none");
    }

    if (node != root) {
      var ghost = gGroup.append("circle")
          .attr("cx", node.x - 10)
          .attr("cy", node.y - 5)
          .attr('class', 'ghostCircle')
          .attr("r", 30)
          .attr("opacity", 0.2) // change this to zero to hide the target area
          .attr("id", "a" + id)
          .style("fill", "red")
          //.attr("pointer-events", "none");
    }

    id++;
}


d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};

function drawTree(node){
  traverseAndDo(node, drawNode);
}

//Hide/Show the subtree of the selected node
function toggleSubtree(node) {

    if (node.toggle == 0) {
        node._children = node.children;
        node.children = [];
        node.toggle = 1;
    }
    else {
        node.children = node._children;
        node._children = [];
        node.toggle = 0;
    }
}

function __calculateSubtreeWidths(node, nodeWidthFunctor) {

    var sum = 0;
    if (node.children) {
        //console.log("Has children: " + node.children.length);
        for (var i = 0; i < node.children.length; i++) {
            //console.log("child " + i + ": has width: " + node.children[i].width);
            //console.log("child " + i + ": has subtreeWidth" + node.children[i].subtreeWidth);
            sum += Math.max(node.children[i].width, node.children[i].subtreeWidth);
        }
    }
    node.subtreeWidth = sum;
    // node.width = nodeWidthFunctor(node
    node.width = nodeWidth*1.5;
    node.subtreeWidth = Math.max(node.subtreeWidth, node.width);
}

function nodeWidthFunctor(node) {
    // console.log(node.textsize);
    // if (node.textsize) {
    //     if (node.textsize>300){
    //         // console.log("Case A");
    //         return 355;
    //     }
    //     else{
    //         // console.log("Case B");
    //         return node.textsize + 45;
    //     }
    // }
    // else{
    //     // console.log("Case C");
    //     return 20;
    // }
    return nodeWidth;
}

function calculateSubtreeWidths(node){
    postTraverseAndDo(root, function(node){
        __calculateSubtreeWidths(node, nodeWidthFunctor);
    });
}

function balance(root){

    calculateSubtreeWidths(root);

    //toggling the root or its subtrees can move it around the page
    //instead we'll find the difference in position and then shift the whole
    //tree back in the end
    anchorx = root.x
    anchory = root.y

    function __balance__(node, start){
        _start = start

        //tree is built from the bottom up, so balance all children first
        for (var i = 0; i < node.children.length; i++){
            __balance__(node.children[i], start);
            start += node.children[i].subtreeWidth;
        }

        if (node.children.length > 1){ //balance the node between its children
            node.x = (node.children[0].x + node.children[node.children.length-1].x) /2;
            node.y = (node.depth+1) * 100;
        }
        else if (node.children.length == 1){ //place node directly above its child
            node.x = node.children[0].x
            node.y = (node.depth+1) * 100;
        }
        else{ //leaf, just place the node
            node.x = _start;
            node.y = (node.depth+1) * 100;
        }
    }

    __balance__(root, root.x - root.subtreeWidth/2);

    //Now we shift the tree so that the root remains at the same location
    var diffx = anchorx - root.x;
    var diffy = anchory - root.y;

    traverseAndDo(root, function(node) {
        node.x = node.x + diffx;
        node.y = node.y + diffy;
    })
}

function updateDepths(root) {

    root.depth = 0;

    traverseAndDo(root, function(node) {
        if (node.parent) {
            node.depth = node.parent.depth + 1;
        }
    });
}

function getNodeByPermId(id) {

    var result = null;
    traverseAndDo(root, function(node){
        if (node.permId == id) {
            result = node;
        }
    });
    return result;
}

function sortByConnection(root) {

    traverseAndDo(root, function(node){

        node.children.sort(function(a,b){

            if (a.connection == "arrow" && b.connection == "line"){
                return 1;
            }
            else if(a.connection == "line" && b.connection == "arrow"){
                return -1;
            }
            else if(a.connection == "arrow"){
                return -1;
            }
            else if(a.connection == "line"){
                return -1;
            }
            else if(b.connection == "arrow"){
                return 1;
            }
            else if(b.connection == "line"){
                return 1;
            }

            return a.connection.localeCompare(b.connection);
        })
    })
}

function update(root){

    node_map = new Array(); // clear node_map

    id = 0; //clear id
    gGroup.selectAll("*").remove();

    // drawTree(root);

    gGroup.selectAll("*").remove();

    updateDepths(root);

    sortByConnection(root);

    calculateSubtreeWidths(root);

    balance(root, root.x - root.subtreeWidth/2);

    id = 0;

    drawTree(root);

    //gGroup.selectAll("circle")
    gGroup.selectAll("rect")
        .on("mouseover", function() {
            this.style.cursor = "pointer";
            //TODO: pick a color for mouseover
            // d3.select(this).attr('fill', '#302E1C');
            dragTarget = getClickedNode(this);
        })
        .on("mouseout", function() {
            dragTarget = null;
            if (getCurrentNode() != getClickedNode( this )) {
                d3.select(this).attr('fill', function (d) {
                    return getColor(getClickedNode(this));
                });
            }
        })
        .on("click", function() {
            var node = getClickedNode( this );
            onSelect(node);
            setCurrentNode(node);
            console.log(node.link);

            if (node.link) {
              eventLinkClicked();
            }
            // center( node );
        })
        // TODO: change from toggling subtree to modal view
        .on("dblclick", function() {

            var node = getClickedNode( this );
            onSelect(node);
            setCurrentNode(node);

            toggleSubtree( getCurrentNode() );

            update(root);

            // center( node );
        })
        .call(dragListener);

        gGroup.selectAll("text").moveToFront();

        gGroup.selectAll(".ghostcircle")
            .on("mouseover", function() {
                this.style.cursor = "pointer";

                console.log("MOUSED OVER GHOST CIRCLE.");
                dragTarget = getClickedNode( this );
            })
            .on("mouseout", function() {
                console.log("MOUSEOUT GHOST CIRCLE.");
                dragTarget = null;
            })
}

function getColor(node) {

    //If the node has a toggled subtree
    if (node.toggle == 1) {
        //console.log("#ADD8E6");
        return "#ADD8E6";
    }
    //If the node is currently selected
    else if (node == getCurrentNode()) {
        //console.log("#302E1C");
        return "#24A5F4";
    }
    //If the node is a definition node
    else if (node.connection == "line") {
        return "#03EB9B"
    }
    //Otherwise, fill white
    else {
        //console.log("white");
        return "#00CEF4";
    }
}

function getCurrentNode() {

    return currentNode;
}

function setCurrentNode(n) {

    currentNode = n;
}

function wrap(text, width) {

    text.attr("dy",0);
    var x = text.attr("x");
    var numberLines = 1;
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
          //console.log(dy);
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                numberLines = 1 + lineNumber;
            }
        }
    });

    return [text, numberLines];
}

function center(node) {

    var source = d3.select("#a" + node.id);
    //console.log(source)
    scale = zoomListener.scale();
    x = -source.property("cx").baseVal.value;
    y = -source.property("cy").baseVal.value;
    x = x * scale + $(document).width() / 2;
    y = y * scale + $(document).height() / 4;
    d3.select('g').transition()
        .duration(250)
        .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    zoomListener.scale(scale);
    zoomListener.translate([x, y]);
    //console.log( d3.select("#a" + root.id).property("cy").baseVal.value );
}

function onSelect(node) {

    var temp = currentNode;
    currentNode = node;

    if (temp != node) {
        // clear last node
        d3.select("#a" + temp.id).attr('fill', function (d) {
            return getColor(temp);
        });
    }
    d3.select("#a" + getCurrentNode().id).attr('fill', '#24A5F4');
    // center(node);
}

//set up tree with empty root node
// var root = new Node($(document).width() / 2, 50, "I am Root.");


var removedNodes = [];

// FORM SCRIPT
// this is just for the date input
$(document).ready(function() {
    var date_input=$('input[name="date"]'); //our date input has the name "date"
    var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
    var options={
        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    };
    date_input.datepicker(options);
})

  // set node values: triggered when modal window closes
$('#myModal').on('hidden.bs.modal', function() {

    var curr = getCurrentNode();
    modalopen = false;//when modal closes, stop suppressing keypresses
    var title = document.getElementById("title").value;
    var comment = document.getElementById("comment").value;
    var newLink = $("#linkToText").val();

    curr["data"] = title; // str
    curr["comment"] = comment;  // str
    curr["link"] = newLink;

    console.log('title is: ' + curr.data);
    console.log('comment is: ' + curr.comment);
    console.log('link is: ' + curr.link);
    // console.log("link to node url is: ");

    //Update tree to display the changes.
    update(root);
});


function saveMap() {
    var dataTemp = saveToJSON(root);
    var URL = window.location.pathname;
    $.post(URL,
    {
        _csrf: _csrf,
        type: "save", // save or create
        data: dataTemp,
        id: uniqueId
    },
    function(data, status){
        console.log("client side check save");
    });
};

function createMap() {

    var URL = window.location.pathname ;
    $.post(URL,
    {
        _csrf: _csrf,
        type: "create", // save or create
    },
    function(data, status){
        // REDIRECT
        window.location.pathname = data.redirect;
    });
};

function openNewTabId(id) {
  window.open(id, "_blank");
}
