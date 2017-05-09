function zoom() {
    console.log("zoooom");
    gGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

zoomListener = d3.behavior.zoom(); //use a zoom listener to preserve the scale accross the program.

var svgContainer = d3.select("#tree-container").append("svg")
                                    .attr("width", $(document).width())
                                    .attr("height", $(document).height())
                                    .attr("class", "overlay")
                                    .call(zoomListener.scaleExtent([.2, 5]).on("zoom", zoom)).on("dblclick.zoom", null)

var gGroup = d3.select("svg").append("g");


window.addEventListener("keydown", keyPressed, false);


function save(root) {
	// FIXME: to implement!
}

function keyPressed(e) {
	console.log(e.keyCode);
    switch (e.keyCode) {
    		case 78:
    			// 0
		     console.log("The 'n' key is pressed.");
		case 83:
			console.log("The 's' key is pressed.");
			if (typeof(root) == 'undefined') {
				console.log('Cannot save with null root');
			}
			else {
				save(root);
			}
			break;

         //Fetch the current active node.
         curr = getCurrentNode();
         var txt = prompt("Enter new node text.", "Lorem Ipsum");
         var tmp = new Node(root.x, 0, txt);

		     add( curr, tmp );

         update(root);
         onSelect( tmp );

		     return 0;

    		case 69:
    			// 1
		     console.log("The 'e' key is pressed.");

         //Fetch the node corresponding to the currently selected svg element
         curr = getCurrentNode()
         var txt = prompt("Enter new node text.", curr.data);
         curr.data = txt;

         update(root);
         onSelect( curr );

		     return 1;
    		case 82:
	           console.log("The 'r' key is pressed.");
	           return 2;
    		case 68:
			console.log("The 'd' key is pressed.");
			return 3;
        case 32:
              console.log("The '(space)' key is pressed.");
              toggleSubtree( getCurrentNode() );
              update( root );

              onSelect( getCurrentNode() );
              return 4;

        case 38:
              console.log("The 'up arrow' key is pressed.");

              if (getCurrentNode().parent != null) {

                onSelect( getCurrentNode().parent );

              }
              return 5;
        case 40:
              console.log("The 'down arrow' key is pressed.");

              if (getCurrentNode().children.length > 0) {

                onSelect( getCurrentNode().children[0] );

              }
              return 6;
        case 37:
              console.log("The 'left arrow' key is pressed.");

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

              return 7;

          case 39:
              console.log("The 'right arrow' key is pressed.");

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

              return 8;

          case 90:

              console.log("The 'z' key is pressed.");

              var revived = null;

              if (removedNodes.length > 0) {

                revived = removedNodes[removedNodes.length - 1]
                add( revived.parent, revived);
                update( root );
                onSelect( revived );
                removedNodes.pop();

              }

              return 9;

		case 8:
			console.log("The 'delete' key is pressed.");

      remove( getCurrentNode() );
      update( root );
      onSelect( getCurrentNode().parent );

			return 10;
    		default:
    			console.log("Pressed an unrecognized key!");
    			return -1;
    }
}

function getClickedNode(clicked) {

  var temp = d3.select(clicked).attr("id");
  var temp = temp.substr(1);
  var selected = node_map["" + temp];
  console.log(selected);
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

//////////////////////////////////// BEGIN HERE /////////////////////////////////////////////
var root;
var currentNode;
$(function() {
	if (App.RESULT != -1) {
		root = App.RESULT;
		root = JSON.parse(root.data);
		root = root[0];
	}
	else {
		root = new Node($(document).width() / 2, 50, "Enter your text here.");
	}

	console.log(root);
	hydrateData(root);
	root.depth = 0;
	currentNode = root;

	update(root);
	console.log("Done");
	onSelect(root);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Constructor for Nodes
function Node(x, y, data) {
    this.x = x;
    this.y = y;

    this.data = data;

    this.depth = null;
    this.parent = null;
    this.id = null;

    this.children = [];

    this.toggle = 0;
}


function saveToJSON(node_in) {
	var obj = JSONHelper(root, []);
	console.log(obj);
	// write to JSON
      $.post('/data', {data: JSON.stringify(obj)}, function(data, status, xhr) {
          console.log(data);
          console.log(status);
      })
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

function drawNode(node) {

	  if (node.children) {
      for (var i = 0; i < node.children.length; ++i) {
	    var line = gGroup.append("line")
	    					   .attr("x1", node.x-10)
	    					   .attr("y1", node.y-5)
	    					   .attr("x2", node.children[i].x-10)
	    					   .attr("y2", node.children[i].y-5)
	    					   .attr("stroke-width", 2)
	    					   .attr("stroke", "black");
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

    if (node.textsize) {
      return node.textsize + 20;
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

function update(root){


  node_map = new Array();	// clear node_map

  id = 0; //clear id
  gGroup.selectAll("*").remove();

  traverseAndDo(root, drawNode);

  gGroup.selectAll("*").remove();


  postTraverseAndDo(root, calculateSubtreeWidths);

  balance(root, root.x - root.subtreeWidth/2);

  traverseAndDo(root, drawNode);

  gGroup.selectAll("circle")
  	.on("mouseover", function() {
  		this.style.cursor = "pointer";
  		d3.select(this).attr('fill', '#302E1C');
  	})
  	.on("mouseout", function() {
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

      });
}

function getColor(node) {

  if (node.toggle == 1) {
    console.log("#ADD8E6");
    return "#ADD8E6";
  }
  else if (node == getCurrentNode()) {
    console.log("#302E1C");
    return "#302E1C";
  }
  else {
    console.log("white");
    return "white";
  }

}

function getCurrentNode() {

  return currentNode;

}

function setCurrentNode(n) {

  currentNode = n;

}

function getNodeById( id ) {

  return node_map[ "" + id ];

}

function center( node ) {

    var source = d3.select("#a" + node.id);
    console.log(source)
    scale = zoomListener.scale();
    x = -source.property("cx").baseVal.value;
    y = -source.property("cy").baseVal.value;
    x = x * scale + $(document).width() / 2;
    y = y * scale + $(document).height() / 8;
    d3.select('g').transition()
        .duration(250)
        .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    zoomListener.scale(scale);
    zoomListener.translate([x, y]);
    console.log( d3.select("#a" + root.id).property("cy").baseVal.value );
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

}

//set up tree with empty root node
// var root = new Node($(document).width() / 2, 50, "I am Root.");


var removedNodes = [];

// add(root, new Node(root.x - 50, 100, "I'm a kid."));

// add(root, new Node(root.x + 50, 100, "I'm a kid 2."));

// add(root.children[0], new Node(root.x, 150, "I'm a Grandson."));

// add(root.children[0], new Node(root.x, 200, "I'm a Granddaughter."))

// add(root.children[0].children[1], new Node(root.x, 250, "I'm a Great-Grandson."));

// add(root.children[0].children[1], new Node(root.x, 300, "I'm a Great-Granddaughter."))

// add(root.children[1], new Node(root.x, 350, "I'm a niece."));

// add(root.children[1], new Node(root.x, 400, "I'm a nephew."))

// add(root.children[1].children[0], new Node(root.x, 450, "I'm a Great-niece."));

// add(root.children[1].children[0], new Node(root.x, 500, "I'm a Great-nephew."));

