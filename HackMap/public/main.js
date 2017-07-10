// for web socket
var socket = io();

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

    if (node == root) {
        return;
    }

    //console.log(d3.select(this).attr("cx"));
    //console.log(d3.select(this).attr("cy"));
    node.x = Number(d3.select(this).attr("cx"));
    node.y = Number(d3.select(this).attr("cy"));

    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');

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

      ( node );
    }

    var svgnode = d3.select(this);

    scale = zoomListener.scale();


    node.x += d3.event.dx;
    node.y += d3.event.dy;

    //svgnode.attr("transform", "translate(" + node.x + "," + node.y +")");

  })
  .on("dragend", function() {

    var node = getClickedNode( this );

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
      toggleSubtree( node );
      nodeInitialState = -1;
    }

    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');

    update( root );
    onSelect( node );
});

window.addEventListener("keydown", keyPressed, false);


  function u_key() {
    sortByPriority(filteredlist);
    update(root);
  }

  function i_key(){
    sortByDate(filteredlist);
    update(root);
  }

  function g_key() {

    populateList(filteredlist, root);
    update(root);

  }

  function h_key() {
    filterActionableList(filteredlist);
    update(root);
  }

  function j_key() {
    filterCompletedList(filteredlist);
    update(root);
  }

  function n_key() {
           //Fetch the current active node.
            curr = getCurrentNode();
             var txt = prompt("Edit node text.", "Lorem Ipsum");

              if (txt) {
                var tmp = new Node(root.x, 0, txt);

                tmp.connection = "arrow";

                add( curr, tmp );

                update(root);
                onSelect( tmp );
            }
  }

function s_key() {
      if (typeof(root) == 'undefined') {
        console.log('Cannot save with null root');
      }
      else {
        saveToJSON(root);
      }
}

function e_key() {
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

function d_key() {
                    //Fetch the current active node.
                         curr = getCurrentNode();
                         var txt = prompt("Enter new node text.", "Lorem Ipsum");
                         if (txt) {
                           var tmp = new Node(root.x, 0, txt);

                           add( curr, tmp );

                           update(root);
                           onSelect( tmp );
                         }
}

function space_key() {
              toggleSubtree( getCurrentNode() );
              update( root );

              onSelect( getCurrentNode() );
}

function up_key() {
              if (getCurrentNode().parent != root) {

                onSelect( getCurrentNode().parent );

              }
}

function down_key() {
              if (getCurrentNode().children.length > 0) {

                onSelect( getCurrentNode().children[0] );

              }
}
function left_key() {
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

function right_key() {
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
function z_key() {
              var revived = null;

              if (removedNodes.length > 0) {

                revived = removedNodes[removedNodes.length - 1]
                add( revived.parent, revived);
                update( root );
                onSelect( revived );
                removedNodes.pop();

              }
}

function del_key() {
      remove( getCurrentNode() );
      update( root );
      onSelect( getCurrentNode().parent );
}

function f_key() {
        var txt = prompt("Enter forested node text.", "Lorem Ipsum");

        if (txt) {
          var tmp = new Node(root.x, 0, txt);

          tmp.connection = "neoroot";

          add( root, tmp );

          update(root);
          onSelect( tmp );
        }
}

function y_key() {
            curr = getCurrentNode();

            var lbl = prompt("Enter label connection type. [comes from], [definition], [custom]", "custom");
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
              var lbl = prompt("Enter custom connection type.", "Lorem Ipsum");
            }

            curr.connection = lbl;

            update(root);

            onSelect( curr );
}
function c_key() {
                    curr = getCurrentNode();

                    var lbl = prompt("Enter custom connection label.", "Lorem Ipsum");
                    if (!lbl){
                      lbl = "line";
                    }
                    var txt = prompt("Enter new node text.", "Lorem Ipsum");

                    if (txt) {
                      var tmp = new Node(root.x, 0, txt);

                      tmp.connection = lbl;

                      add( curr, tmp );

                      update(root);
                      onSelect( tmp );
                    }
}

// blah123
function o_key() {
    curr = getCurrentNode();
    modalopen = true;
    $('#myModal').modal('show');  // pop up window

    // set modal elements
    curr.data ? (document.getElementById("title").value = curr.data) :  (document.getElementById("title").value = "");
    curr.comment ? (document.getElementById("comment").value = curr.comment) : (document.getElementById("comment").value = "");
    curr.assigned ? (document.getElementById("assigned_peeps").value = curr.assigned) : (document.getElementById("assigned_peeps").value = "");
    curr.priority ? (document.getElementById("priority").value = curr.priority.toString()) : (document.getElementById("priority").value = 1);
    curr.date ? (document.getElementById("date").value = curr.date) : (document.getElementById("date").value = "");
    if (curr.actionable) {
      document.getElementById("act_1").checked = true;
      document.getElementById("act_2").checked = false;
    }
    else {
        document.getElementById("act_2").checked = true;
        document.getElementById("act_1").checked = false;
    }

    if (curr.completed) {
      document.getElementById("comp_1").checked = true;
      document.getElementById("comp_2").checked = false;
    }
    else {
        document.getElementById("comp_2").checked = true;
        document.getElementById("comp_1").checked = false;
    }
}

// END blah123

function keyPressed(e) {
  if (modalopen) {
    return;
  }


  console.log(e.keyCode);
    switch (e.keyCode) {

        case 71:
        console.log("The 'g' key is pressed.");
        g_key();
        return 71;

        case 72:
        console.log("The 'h' key is pressed.");
        h_key();
        return 72;

        case 74:
        console.log("The 'j' key is pressed.");
        j_key();
        return 74;

        case 73:
        console.log("The 'i' key is pressed.");
        i_key();
        return 73;

        case 85:
        console.log("The 'u' key is pressed.");
        u_key();
        return 85;



        case 78:
          // 0
         console.log("The 'n' key is pressed.");
              n_key();
         return 0;

         case 79:
          console.log("The 'o' key is pressed.");
          o_key();
          return 100;  // arbitrary lol

case 83:
      console.log("The 's' key is pressed.");
      s_key();
      return 100;

        case 69:
          // 1
         console.log("The 'e' key is pressed.");
         e_key();
         return 1;
        case 82:
             console.log("The 'r' key is pressed.");
             return 2;
        case 68:
      console.log("The 'd' key is pressed.");
      d_key();
      return 3;
        case 32:
              console.log("The '(space)' key is pressed.");
              space_key();
              return 4;

        case 38:
              console.log("The 'up arrow' key is pressed.");
              up_key();
              return 5;
        case 40:
              console.log("The 'down arrow' key is pressed.");
              down_key();
              return 6;
        case 37:
              console.log("The 'left arrow' key is pressed.");
              left_key();
              return 7;

          case 39:
              console.log("The 'right arrow' key is pressed.");
              right_key();
              return 8;

          case 90:
              console.log("The 'z' key is pressed.");
              z_key();
              return 9;

    case 8:
      console.log("The 'delete' key is pressed.");
      del_key();
      return 10;

    case 65:
      console.log("The 'a' key is pressed.");
      return 11;

    case 70:
        console.log("The 'f' key is pressed.");
        f_key();
        return 12;

    case 77:
            console.log("The 'm' key is pressed.");
            return 13;

    case 89:
            console.log("The 'y' key is pressed.");
            y_key();
            return 14;

            case 67:
              console.log("The 'c' key is pressed.");
                      c_key();
              return 100;
        default:
          console.log("Pressed an unrecognized key!");
          return -1;
    }
}

// catches from server side to redirect
socket.on('created', function(id) {
  window.location.href = id;
});

function getClickedNode(clicked) {

  var temp = d3.select(clicked).attr("id");
  var temp = temp.substr(1);
  var selected = node_map["" + temp];
  return selected

}

// function getMapById(id, callback) {
//   $.getJSON('/data/' + id, function(data, status) {
//     callback(data);
//   });
// }

function hydrateData(data) {
  console.log("Hydrating node (stay thirsty):" , data);

  traverseAndDo(data, function(d) {
    if( typeof(d.children) !== 'undefined') {
      d.children.forEach(function(child, elem){
        child.parent = d;
      })
    }
  })
}

function populateList(filteredlist, node){
  filteredlist.length = 0;
  traverseAndDo(node, function(d){
      filteredlist.push(d);
  });
}

function filterCompletedList(filteredlist){
  result = new Array();
  filteredlist.forEach(function(d){
    if (d.completed){
      result.push(d);
    }
  });
}

function filterActionableList(filteredlist){
  result = new Array();
  filteredlist.forEach(function(d){
    if (d.actionable){
      result.push(d);
    }
  });
}

function sortByPriority(filteredlist){
  filteredlist.sort(function(a,b){
    if (a.priority > b.priority){
      return -1;
    }
    else {
      return 1;
    }
  });
}

function sortByDate(filteredlist){
  filteredlist.sort(function(a,b){

    return new Date(b.date) - new Date(a.date);

  });
}



//////////////////////////////////// BEGIN HERE /////////////////////////////////////////////
var root;
var currentNode;
var dragStarted;
var dragTarget;
var nodeOriginalState;
var modalopen = false;
var filteredlist = new Array();

$(function() {
  if (App.RESULT != -1) {
    root = App.RESULT;
    root = JSON.parse(root.data);
    root = root[0];
  }
  else {
    ///////////////////////////// TODO: REMOVE THIS //////////////////////////////////////
    root = new Node($(document).width() / 2, 50, "Enter your text here.");
  }

  //console.log(root);
  hydrateData(root);

  root.depth = 0;
  currentNode = root;

  update(root);
  console.log("Done");
  onSelect(root.children[0]);
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

    this.children = [];

    this.toggle = 0;

    // blah123
    this.comment = "";  // comment box
    this.assigned = "";    // who is assigned to this node - separated by commas (FIXME: we'll want to separate this out into an array at some point)
    this.priority = 1;
    this.date = "";
    this.actionable = false;
    this.completed = false;
    // END blah123
}




// remember that it has to be saved as an array because you get it as an array (root = root[0] on get)
function saveToJSON(node_in) {
  var obj = JSONHelper(root, []);
      obj = JSON.stringify(obj);
      console.log(obj);
      socket.emit('save', obj);

  // // write to JSON
 //      $.post('/data', {data: JSON.stringify(obj)}, function(data, status, xhr) {
 //          console.log(data);
 //          console.log(status);
 //      })
}
// call with root
function JSONHelper(node_in, nodes) {
    newNodes = dehydrateNode(node_in);
    nodes.push(newNodes);
    return nodes;
}

function dehydrateNode(node_in) {
    console.log("Dehydrating node:" , node_in);
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
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

function drawList(filteredlist, startx, starty){

  filteredlist.forEach(function(node){

    var text = gGroup.append("text")
                           .attr("x", startx)
                           .attr("y", starty)
                           .attr("font-family", "sans-serif")
                           .attr("font-size", "15px")
                           .attr("id", "c" + id)
                           .text( function(d) { return node.data });

    node.textsize = document.getElementById("c" + id).getComputedTextLength();
    text = wrap(text, 200);

    var text2 = gGroup.append("text")
                           .attr("x", startx)
                           .attr("y", starty + 20)
                           .attr("font-family", "sans-serif")
                           .attr("font-size", "15px")
                           .attr("id", "d" + id)
                           .text( function(d) { return node.priority });

   var text3 = gGroup.append("text")
                          .attr("x", startx)
                          .attr("y", starty + 40)
                          .attr("font-family", "sans-serif")
                          .attr("font-size", "15px")
                          .attr("id", "e" + id)
                          .text( function(d) { return node.date });
  starty = starty + 70;
  })
}

function drawNode(node) {

    if (node.children) {
      for (var i = 0; i < node.children.length; ++i) {
        if (node.children[i].connection != "neoroot") {

           var line = gGroup.append("line")
                   .attr("x1", node.x-10)
                   .attr("y1", node.y-5)
                   .attr("x2", node.children[i].x-10)
                   .attr("y2", node.children[i].y-5)
                   .attr("stroke-width", 2)
                   .attr("stroke", "black");

            if (node.children[i].connection == "arrow") {
              line.attr("marker-end", "url(#end)");
            }

            else if (node.children[i].connection != "line"){
                line.attr("marker-end", "url(#end)");
                var lbl = gGroup.append("text")
                                     .attr("x", (node.x + node.children[i].x)/2 + 5)
                                     .attr("y", (node.y + node.children[i].y)/2)
                                     .attr("font-family", "sans-serif")
                                     .attr("font-size", "15px")
                                     .attr("font-style", "italic")
                                     .text( function(d) { return node.children[i].connection });
            }
      }
    }
  }

    var circle = gGroup.append("circle")
                             .attr("cx", node.x - 10)
                             .attr("cy", node.y - 5)
                             .attr("r", 5)
                             .attr("fill", function (d) {
                               return getColor( node );
                             })
                             .attr("stroke", "black")
                             .attr("stroke-width", 1)
                             .attr("id", "a" + id);

    if (node == root){
        circle.attr("display", "none");
    }

    node_map["" + id] = node;
    node.id = id;


    var text = gGroup.append("text")
                           .attr("x", node.x)
                           .attr("y", node.y)
                           .attr("font-family", "sans-serif")
                           .attr("font-size", "15px")
                           .attr("id", "b" + id)
                           .text( function(d) { return node.data });

    node.textsize = document.getElementById("b" + id).getComputedTextLength();
    text = wrap(text, 200);

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
      node.width = nodeWidthFunctor(node);
      node.subtreeWidth = Math.max(node.subtreeWidth, node.width);

}

function nodeWidthFunctor(node) {

    console.log(node.textsize);
    if (node.textsize) {
      if (node.textsize>300){
        console.log("Case A");
        return 355;
      }
      else{
        console.log("Case B");
        return node.textsize + 55;
      }
    }
    else{
      console.log("Case C");
      return 20;
    }

}

function calculateSubtreeWidths(node){
  __calculateSubtreeWidths(node, nodeWidthFunctor);
}

function balance(root){

  calculateSubtreeWidths(root, nodeWidthFunctor);

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

  traverseAndDo(root, drawNode);

  gGroup.selectAll("*").remove();

  updateDepths(root);

  sortByConnection(root);

  postTraverseAndDo(root, calculateSubtreeWidths);

  balance(root, root.x - root.subtreeWidth/2);

  traverseAndDo(root, drawNode);

  gGroup.selectAll("circle")
    .on("mouseover", function() {
      this.style.cursor = "pointer";
      d3.select(this).attr('fill', '#302E1C');
      dragTarget = getClickedNode( this );
    })
    .on("mouseout", function() {
      dragTarget = null;
      if (getCurrentNode() != getClickedNode( this )) {
        d3.select(this).attr('fill', function (d) {
          return getColor(getClickedNode( this ));
        });
      }
    })
     .on("click", function() {

       var node = getClickedNode( this );
       onSelect( node );
       setCurrentNode( node );
       center( node );

    })
    .on("dblclick", function() {

      var node = getClickedNode( this );
      onSelect( node );
      setCurrentNode( node );

      toggleSubtree( getCurrentNode() );

      update(root);

      center( node );

      })
    .call(dragListener);

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

    drawList(filteredlist, $(document).width()-250, 200);

}

function getColor(node) {

  if (node.toggle == 1) {
    //console.log("#ADD8E6");
    return "#ADD8E6";
  }
  else if (node == getCurrentNode()) {
    //console.log("#302E1C");
    return "#302E1C";
  }
  else {
    //console.log("white");
    return "white";
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
  //console.log(x);

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
      }
    }
  });
}

function getNodeById( id ) {

  return node_map[ "" + id ];

}

function center( node ) {

    var source = d3.select("#a" + node.id);
    //console.log(source)
    scale = zoomListener.scale();
    x = -source.property("cx").baseVal.value;
    y = -source.property("cy").baseVal.value;
    x = x * scale + $(document).width() / 2;
    y = y * scale + $(document).height() / 3;
    d3.select('g').transition()
        .duration(250)
        .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    zoomListener.scale(scale);
    zoomListener.translate([x, y]);
    //console.log( d3.select("#a" + root.id).property("cy").baseVal.value );
}

function onSelect( node ) {

  var temp = currentNode;
  currentNode = node;

  if (temp != node) {
    // clear last node
    d3.select("#a" + temp.id).attr('fill', function (d) {
      return getColor(temp);
    });
  }
  d3.select("#a" + getCurrentNode().id).attr('fill', '#302E1C');

  center( node );

}

//set up tree with empty root node
// var root = new Node($(document).width() / 2, 50, "I am Root.");


var removedNodes = [];



// blah123
// FORM SCRIPT
 $(document).ready(function(){
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

        // triggered when modal window closes
      $('#myModal').on('hidden.bs.modal', function() {
          modalopen = false;//when modal closes, stop suppressing keypresses
          var title = document.getElementById("title").value;
          var comment = document.getElementById("comment").value;
          var assigned = document.getElementById("assigned_peeps").value;
          var priority = document.getElementById("priority").value;
          priority = parseInt(priority);
          var date = document.getElementById("date").value;
          var act_value;
          if (document.getElementById('act_1').checked) {
              act_value = true;
           }
          else if (document.getElementById('act_2').checked) {
            act_value = false;
          }
          else assert(false); // one of yes or no should always be checked

          var comp_value;
           if (document.getElementById('comp_1').checked) {
              comp_value = true;
           }
          else if (document.getElementById('comp_2').checked) {
            comp_value = false;
          }
          else assert(false); // one of yes or no should always be checked

          curr["data"] = title; // str
          curr["comment"] = comment;  // str
          curr["assigned"] = assigned;  // str (with commas)
          curr["priority"] = priority;  // int
          curr["date"] = date;  // str
          curr["actionable"] = act_value;
          curr["completed"] = comp_value;

          console.log('title is: ' + curr.data);
          console.log("priority is: " + curr.priority);
          console.log('comment is: ' + curr.comment);
          console.log('assigned string is: ' + curr.assigned);
          console.log('date is: ' + curr.date);
          console.log('actionable: ' + curr.actionable);
          console.log('completed: ' + curr.completed);

          //Update tree to display the changes.
          update(root);
      });

      // END blah123
