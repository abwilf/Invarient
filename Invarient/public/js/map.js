 // console.log("MAPDATA IS: " + $('#mapData').val());
 // console.log(typeof(mapData));
 // console.log("MAPID IS: " + $('#mapId').val());
 // console.log(typeof($('#mapId').val()))




// SCRIPT BELOW HERE
// what I changed: got rid of all socket stuff, altered saveMap(), createMap(), "begin here" section

// Credit: http://jsfiddle.net/nrabinowitz/NvynC/
function resizeInput() {
    $(this).attr('size', $(this).val().length);
}

$('input[type="text"]')
    // event handler
    .keyup(resizeInput)
    // resize on page load
    .each(resizeInput);

// ~~~~~~~~~~~~~~


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


function goodToEdit() {
    if (canEdit == "false" && sandbox != "true") {
        alert('You do not have permission to edit this map.  Please contact the owner of this map - ' + mapUser + '- for permission.');
        return false;
    }
    return true;
}


function eventNewComesFromNode() {

    if (!goodToEdit()) return;
    //Fetch the current active node.
    var curr = getCurrentNode();
    var txt = prompt("", "Enter comes from node text");

    if (txt) {
        // unhide if subtree hidden
        if (curr.toggle) {
            eventToggleSubtree();
        }
        var tmp = new Node(root.x, 0, txt);

        tmp.connection = "arrow";

        add(curr, tmp);

        onSelect(tmp);
        update(root)

    }
}

function eventSave() {

    if (typeof(root) == 'undefined') {
        console.log('Cannot save with null root');
    }

    // console.log('MAP.JS SANDBOX: ' + sandbox);

    if (sandbox == "true") {
        alert('Saving is not supported in sandbox.  If you want to save your map, please log in or sign up, and create a new map.')
        return;
    }
    else {
        saveMap();
    }
}

function eventPaste(e) {
    console.log("Paste Event");
    var curr = getCurrentNode();

    /* Guard against modal open, alert open? */
    paste(curr);
}

function eventCut() {
    console.log("Cut Event");
    var curr = getCurrentNode();

    /* Guard against modal open, alert open? */
    cut(curr);
}

function eventCopy() {
    console.log("Copy Event");
    var curr = getCurrentNode();

    /* Guard against modal open, alert open? */
    copy(curr);
}

/* Abstract away from future clipboard implementation */
function storeToClipboard(obj) {
    
    clipboard = obj;

    // /* Internet Explorer */
    // if (window.clipboardData) {
    //     window.clipboard.setData('text/plain', obj)
    // } 
    // /* Non Internet Explorer */
    // else {
    //     e.clipboardData.setData('text/plain', obj);
    // }
    
}

/* Abstract away from future clipboard implementation */
function getFromClipboard() {
    var data = "";

    // /* Internet Explorer */
    // if (window.clipboardData) {
    //     data = window.clipboardData.getData('Text');
    // } 
    // /* Non Internet Explorer */
    // else {
    //     data = e.clipboardData.getData('text');
    // }
    
    return clipboard;
}

function copy(nodeIn) {

    /*Toggle cut/paste flags? */
    var clone = JSON.parse(saveToJSON(nodeIn));
    hydrateData(clone);

    /* For a copy we null out permIds. These will have to be reassigned at paste. */
    /* This allows multiple pastes to work off one copy. */
    traverseAndDo(clone, function(node) {
        node.permId = -1;
    });

    clone = saveToJSON(clone);
    storeToClipboard(clone);

}

function cut(nodeIn) {
    /* Toggle cut/paste flags? */
    var clone = JSON.parse(saveToJSON(nodeIn)); /* Cut preserves permId */
    hydrateData(clone);
    clone = saveToJSON(clone);

    if (nodeIn.link == "neoroot") {
        var parent = nodeIn.parent;
    }
    else {
        var parent = root;
    }
    
    remove(nodeIn);
    storeToClipboard(clone);
    update(root);
    onSelect(parent);
}

function paste(nodeIn) {
    if (!nodeIn) {
        return
    }

    var clone = JSON.parse(getFromClipboard())[0][0];
    console.log(clone);
    hydrateData(clone);

    /* Assign permIds if copy */
    traverseAndDo(clone, function(node) {
        if (node.permId == -1) {
            node.permId = permId;
            permId++;
        }
    });

    add(nodeIn, clone);
    console.log(root);
    update(root);
    onSelect(clone);
}

function eventEdit() {
    //Fetch the node corresponding to the currently selected svg element
    var curr = getCurrentNode();
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

    if (!goodToEdit()) return;
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
    if (!goodToEdit()) return;
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

    if (!goodToEdit()) return;
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
    if (!goodToEdit()) return;
    remove( getCurrentNode() );
    update(root);
    onSelect(getCurrentNode().parent);
}

function eventNeoroot() {
    if (!goodToEdit()) return;
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
    if (!goodToEdit()) return;
    curr = getCurrentNode();

    if (curr.connection == "neoroot") return;

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

    update(root);
    onSelect(curr);
}

function eventNewCustomNode() {
    if (!goodToEdit()) return;
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
    if (!goodToEdit()) return;
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
    if (!goodToEdit()) return;
    var node = getCurrentNode();

    if (!isLocalId(node.link)){
        openNewTabId(node.link);
    }
    else {
        var localId = getParsedId(node.link)[1];
        node = getNodeByPermId(localId);

        if (isHidden(node)) {
            console.log("It's hidden!");
            show(node);
        } else {
            console.log("It's not hidden :'(");
        }

        setCurrentNode(node);
        onSelect(node);
        update(root);
    }
}

function eventModal() {
    if (!goodToEdit()) return;
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

var editingText = false;
$("#mapTitleIn").on("focus", function(){
    editingText = true;
})
$("#mapTitleIn").on("focusout", function(){
    editingText = false;
})

window.addEventListener("keydown", keyPressed, false);

function keyPressed(e) {

    console.log('editing text: ' + editingText)
    if (modalopen || editingText) {
        return;
    }

    console.log(e.keyCode);
    switch (e.keyCode) {

        case 78:
            console.log("The 'n' key is pressed.");
            eventNewComesFromNode();
            eventSave();
            break;

        case 79:
            console.log("The 'o' key is pressed.");
            eventModal();
            eventSave();
            break;

        case 83:
            console.log("The 's' key is pressed.");
            eventSave();
            break;

        case 69:
            // 1
            console.log("The 'e' key is pressed.");
            eventEdit();
            eventSave();
            break;

        case 68:
            console.log("The 'd' key is pressed.");
            eventNewDefinitionNode();
            eventSave();
            break;

        case 32:
            console.log("The '(space)' key is pressed.");
            e.preventDefault();
            eventToggleSubtree();
            eventSave();
            break;

        case 38:
            console.log("The 'up arrow' key is pressed.");
            eventTraverseUp();
            eventSave();
            break;

        case 40:
            console.log("The 'down arrow' key is pressed.");
            eventTraverseDown();
            eventSave();
            break;

        case 37:
            console.log("The 'left arrow' key is pressed.");
            eventTraverseLeft();
            eventSave();
            break;

        case 39:
            console.log("The 'right arrow' key is pressed.");
            eventTraverseRight();
            eventSave();
            break;

        case 90:
            console.log("The 'z' key is pressed.");
            eventUndo();
            eventSave();
            break;

        case 8:
            console.log("The 'delete' key is pressed.");
            eventDelete();
            eventSave();
            break;

        case 70:
            console.log("The 'f' key is pressed.");
            eventNeoroot();
            eventSave();
            break;

        case 89:
            console.log("The 'y' key is pressed.");
            eventEditConnection();
            eventSave();
            break;

        case 86:
            if (e.ctrlKey || e.metaKey) {
                console.log("'Ctrl+v' or 'Cmd+v' pressed.");
                eventPaste();
            }
            break;

        case 88: 
            if (e.ctrlKey || e.metaKey) {
                console.log("'Ctrl+x' or 'Cmd+x' pressed.");
                eventCut();
            }
            break;

        case 67:
            if (e.ctrlKey || e.metaKey) {
                console.log("'Ctrl+c' or 'Cmd+c' pressed.");
                eventCopy();
            } 
            else {
                console.log("The 'c' key is pressed.");
                eventNewCustomNode();
                eventSave();
            }
            break;

        default:
            console.log("Pressed an unrecognized key!");
            eventSave(); //Why not
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
        if( typeof(d._children) !== 'undefined') {
            d._children.forEach(function(child, elem){
                child.parent = d;
            })
        }
    })
}

// // auto save every 1s
// function autoSave() {
//     setTimeout(function() {
//         eventSave();
//         autoSave();
//     }, 1000);
// }

// disable enter input for title form
$('#mapTitleIn').on('keyup keypress', function(e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
    e.preventDefault();
    return false;
  }
});

// CREDIT: http://jsfiddle.net/MadLittleMods/2LG8f/
var timeoutId;
$('form input, form textarea').on('input propertychange change', function() {
    console.log('Textarea Change');

    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        eventSave();
    }, 0);
});

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
var nodeId; // for centering on a certain node when linked to
var permId = 0;
var sandbox = 'false';
var canEdit = 'false';
var mapUser = "";
var clipboard = "";

var maxDepth = 1;

let nodeTextSize = 14;
let nodeWidth = 300;
let nodeHalfWidth = nodeWidth / 2;
let nodeWidthPadding = 20;
let nodeHeight = 61;
let nodeHeightScale = nodeTextSize * 1.1;
let nodeHeightPadding = 40;
let horizontalNodeSpacingScalar = 1.1;

var maxNodeHeightForEachDepth = [nodeHeightPadding + nodeHeightScale];
var yCoordForEachDepth = [50];

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

        sandbox = $('#sandBox').val();
        console.log("MAP JS SANDBOX: " + sandbox)

        canEdit = $('#canEdit').val();
        console.log('CAN EDIT?: ' + canEdit);

        mapUser = $('#mapUser').val();
        console.log('MAP USER: ' + mapUser);
    }
    else {
        console.log("ERROR: Didn't load correctly'");
        root = new Node($(document).width() / 2, 50, "Enter your text here.");
    }

    hydrateData(root);
    root.depth = 0;
    setCurrentNode(root.children[0]);
    update(root);
    onSelect(root.children[0]);
    // autoSave();

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
function saveToJSON(nodeIn) {

    var obj = JSONHelper(nodeIn, []);
    obj = JSON.stringify(obj);
    hydrateData(root);
    return obj;
}

// call with root
function JSONHelper(nodeIn, nodes) {

    newNodes = dehydrateNode(nodeIn);
    nodes.push(newNodes);
    return nodes;
}

function show(node) {
    if (node == root) return ;

    /* Find the highest level node with a toggled subtree */
    if (isHidden(node)) {
        // console.log("Doing the stuff");
        show(node.parent)
    }
    else {
        toggleSubtree(node);
    }
}

function isHidden(node) {
    /* Protect against root */
    if (node == root) return false;

    if (node.parent.toggle == 1 || isHidden(node.parent)) {
        return true;
    }
    else {
        return false;
    }

}

function dehydrateNode(node_in) {

   // console.log(“Dehydrating node:“);
    node_in.parent = null;
    if (typeof(node_in.children) !== 'undefined')  {
        node_in.children.forEach(function(child, elem) {
            child.parent = null;
            dehydrateNode(child);
        });
    }
    if (typeof(node_in._children) !== 'undefined')  {
        node_in._children.forEach(function(child, elem) {
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
        if (node._children) {
            node._children.forEach(traverseAndDo)
        }
    }

    if (node.children) {
        node.children.forEach(traverseAndDo);
    }
    if (node._children) {
        node._children.forEach(traverseAndDo);
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
        if (node._children) {
            node._children.forEach(postTraverseAndDo);
        }
        d(node);
    }

    if (node.children) {
        node.children.forEach(postTraverseAndDo);
    }
    if (node._children) {
        node._children.forEach(postTraverseAndDo);
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

    if (isHidden(node)) return;

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

    node_map["" + id] = node;
    node.id = id;
    var text = gGroup.append("text")
                           .attr("x", node.x)
                           .attr("y", node.y + (nodeTextSize / 2.3) - (node.numLines - 1) * nodeHeightScale / 2)
                        //    .attr("y", node.y + nodeTextSize / 2.3)
                        //    .attr("y", node.y - (node.numLines - 1)*(nodeHeightScale/2))
                           .attr("text-anchor", "middle")
                           .attr("alignment-baseline", "central")
                           // FIXME: change font
                           .attr("font-family", "sans-serif")
                           .attr("font-size", nodeTextSize + "px")
                           .attr("font-color", "white")
                           .attr("fill", "white")
                           .attr("id", "b" + id)
                           .attr('text-decoration', function(d){
                             if (node.link) {
                               return 'underline'
                             }
                              return null;
                            })
                           .text( function(d) { return node.data });

    // wrapTuple[0] is text and wrapTuple[1] is numLines
    var wrapTuple = wrap(text, nodeWidth-nodeWidthPadding, node.y);
    text = wrapTuple[0];
    node.numLines = wrapTuple[1]
    // node.height = wrapTuple[1]*nodeHeightScale+nodeHeightPadding;
    // text = wrap(text, nodeWidth);
    // node.height based on number of lines of text
    node.height = node.numLines * nodeHeightScale + nodeHeightPadding;
    if (node.height > maxNodeHeightForEachDepth[node.depth]) {
        maxNodeHeightForEachDepth[node.depth] = node.height;
        // TODO:
        // yCoordForEachDepth[node.depth] = calcYCoordForDepth()
    }

    var roundedRectangle = gGroup.append("rect")
        .attr("width", nodeWidth)
        .attr("x", node.x - nodeHalfWidth)
        .attr("y", node.y - node.height/2)
        .attr("height", node.height)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("fill", function (d) {
          return getColor(node);
        })
        .attr("id", "a" + id)

    // ---------------FOR TESTING---------------
    // var marker = gGroup.append("rect")
    //     .attr("x", node.x)
    //     .attr("y", node.y)
    //     .attr("height", 5)
    //     .attr("width", 5)
    //     .attr("fill", "black")
    // ---------------END TESTING---------------

    if (node==root){
        roundedRectangle.attr("display", "none");
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

// return 1 if node has no children
function noChildren(node) {
    if (node.children.length === 0) {
        if (node._children) {
            if (node._children.length === 0) {
                node.toggle = 0;
                return 1;
            }
            else {
                return 0;
            }
        }
        node.toggle = 0;
        return 1;
    }
    return 0;
}

//Hide/Show the subtree of the selected node
function toggleSubtree(node) {
    // don't toggle node with no children
    if (noChildren(node)) {
        return
    }
    else if (node.toggle == 0) {
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
    node.width = nodeWidth * horizontalNodeSpacingScalar;
    // node.width = nodeWidth*1.5;
    node.subtreeWidth = Math.max(node.subtreeWidth, node.width);
}

function nodeWidthFunctor(node) {
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

function updateSizeOfNodeHeightArrays() {

    var length = yCoordForEachDepth.length;
    if (maxDepth > length) {
        for (var i = length; i < maxDepth; ++i) {
            yCoordForEachDepth[i] = 0;
            maxNodeHeightForEachDepth[i] = 0;
        }
    }
    if (maxDepth < length) {
        for (i = length - 1; i > maxDepth; --i) {
            // pop end of array
            yCoordForEachDepth.splice(-1, 1);
            maxNodeHeightForEachDepth.splice(-1, 1);
        }
    }
}

function updateDepths(root) {

    root.depth = 0;

    traverseAndDo(root, function(node) {
        if (node.parent) {
            node.depth = node.parent.depth + 1;
            if (node.depth > maxDepth) {
              maxDepth = node.depth;
            }
        }
    });

    updateSizeOfNodeHeightArrays();
}
//
// function updateHeights(root) {
//
//     traverseAndDo(root, function(node) {
//         var tuple = wrap()
//     });
// }

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
    // called a second to fix text centering bug
    id = 0; //clear id
    gGroup.selectAll("*").remove();
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

            // toggleSubtree( getCurrentNode() );
            eventModal();

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

    //If the node is currently selected
    if (node == getCurrentNode()) {
        //Selected definition node
        if (node.connection == "line") {
          return "#00CC88"
        }
        return "#24A5F4";
    }
    //If the node has a toggled subtree
    else if (node.toggle == 1) {
      // toggled definition node
      if (node.connection == "line") {
        return "#ADE6BB"
      }
        //console.log("#ADD8E6");
        return "#ADD8E6";
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

// FIXME: account for long words
function wrap(text, width, yCoord) {

    text.attr("dy",0);
    var x = text.attr("x");
    var numberLines = 1;
    text.each(function() {
        var text = d3.select(this),
            words = text.text().trim().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            // check this
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
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
    // text.attr("y", yCoord + (nodeTextSize / 2.3) - (numberLines - 1) * nodeHeightScale / 2)
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
    d3.select("#a" + getCurrentNode().id).attr('fill', getColor(getCurrentNode()));
    // center(node);
}

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
    // date_input.datepicker(options);

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

})

function saveMap() {
    var dataTemp = saveToJSON(root);
    var URL = window.location.pathname;
    var title = $("#mapTitleIn").val();
    if (!title) title = "Untitled"
    console.log('TITLE IS: ' + title)
    $.post(URL,
    {
        _csrf: _csrf,
        type: "save", // save or create
        data: dataTemp,
        id: uniqueId,
        title: title
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
