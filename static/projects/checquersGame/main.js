var settings = {
	svg_width: 60, //And height
	square_width: 0,
	radius: 0,
	stroke_width: 0,
	last_colour_square: 'black',
	game_speed: 400
}

var svg_container = document.getElementById('svg_goes_here')
settings.svg_width = d3.min([+svg_container.innerHeight, +window.innerHeight]) * 0.8; 
settings.square_width = settings.svg_width / 8; //8x8 board
settings.radius = settings.square_width / 2.8;
settings.stroke_width = settings.radius / 2.5;

var game_state = {
	available_moves: [],
	selected_marker: null,
	markers_numbers: {
		white: 0,
		red: 0
	}
}

//initialise the board
d3.select("#svg_goes_here")
	.append("svg")
	.attr('width', settings.svg_width)
	.attr('height', settings.svg_width);

//A virtual space for all markers, and black squares.
//It is an array (rows) of arrays (squares).
//Each square (board_mirror[j][i]) has a color (board_mirror[j][i][0]) and marker details (board_mirror[j][i][1])
//Marker details (board_mirror[j][i][1]) is an array, that contains the player colour (board_mirror[j][i][1][0]) and marker status (board_mirror[j][i][1][1])
var board_mirror = [
	[
		[],[],[],[],[],[],[],[]
	],
	[
		[],[],[],[],[],[],[],[]
	],
	[
		[],[],[],[],[],[],[],[]
	],
	[
		[],[],[],[],[],[],[],[]
	],
	[
		[],[],[],[],[],[],[],[]
	],
	[
		[],[],[],[],[],[],[],[]
	],
	[
		[],[],[],[],[],[],[],[]
	],
	[
		[],[],[],[],[],[],[],[]
	]						
]

//Alternates so you can have a chequered board
function square_change_colour(){
	if(settings.last_colour_square == 'black'){
		settings.last_colour_square = 'white';
	} else {
		settings.last_colour_square = 'black';
	}
}

//Sets the position, for squares
function square_get_pos(i){
	return settings.square_width * i;
}

function squares_add_to_board(){
	//j is row number
	for (var j = 0; j < 8; j++){
		//i is the square in row
		for (var i = 0; i < 8; i++){
			d3.select("svg")
				.append("rect")
				.attr('class', 'square')
				.attr('row', j)
				.attr('square', i)
				.attr("x", square_get_pos(i))
				.attr("y", square_get_pos(j))
				.attr("width", settings.square_width)
				.attr("height", settings.square_width)
				.style("fill", settings.last_colour_square)
				.on("click", function(){
					var j = +this.getAttribute("row");
					var i = +this.getAttribute("square");
					for (var k = 0; k < game_state.available_moves.length; k++){
						if (game_state.available_moves[k][0] == j && game_state.available_moves[k][1] == i){
							marker_move_this(game_state.selected_marker, j, i);
						}
					}
					//reset current marker to nill after square click
					game_state.selected_marker = null;
				});				
			//Adding the color of this square to the board matrix
			board_mirror[j][i][0] = settings.last_colour_square;
			board_mirror[j][i][1] = null;
			square_change_colour();
		}
		square_change_colour();
	}
}
squares_add_to_board();

//Status is whether it's king or normal
function marker_add_one(j, i, target, player_colour){
	var half_square = settings.square_width / 2 
	d3.select("svg")
		.append("circle")
		.attr('class', 'marker')
		.attr('row', j)
		.attr('square', i)
		.attr('target', target)
		.attr("cx", square_get_pos(i) + half_square)
		.attr("cy", square_get_pos(j) + half_square)
		.attr("r", settings.radius)
		.style("stroke", player_colour)
		.style("stroke-width", settings.stroke_width)
		.style("fill", player_colour)
		.on("click", function(){
			console.log(this)
			game_state.selected_marker = this;
			marker_get_available_moves(this);
		});
}

//Selects the first three rows for the oppenent and the closest three rows for the player.
function markers_add_initial(rows_limits, player_colour, target){
	for (var j = rows_limits[0]; j <= rows_limits[1]; j++){
		for (var i = 0; i <= 7; i++){
			if (board_mirror[j][i][0] == 'black'){
				//Each marker has details of its row(j) and square(i), to identify it. The game itself and all logic is handled in the board_mirror array.
				marker_add_one(j, i, target, player_colour, 'normal')
				game_state.markers_numbers[player_colour] += 1;
				board_mirror[j][i][1] = [player_colour, status];
			}
		}
	}
}
//rows to add markers, this player colour, orientation (king me row)
markers_add_initial([0,2], 'white', 7);
markers_add_initial([5,7], 'red', 0);

function marker_check_this_move(j, i, y, x, opponent_colour, move_message){
	try {
		//bottom left available?
		if (board_mirror[j+y][i+x][1] == null){
			game_state.available_moves.push([j+y, i+x]);
			console.log(move_message + ' available move');
		} else if (board_mirror[j+y][i+x][1][0] == opponent_colour) {
			if (board_mirror[j+(y*2)][i+(x*2)][1] == null){
				game_state.available_moves.push([j+(y*2), i+(x*2)]);
				console.log(move_message + ' available jump');
			}
		}
	}
	catch(err){}
}

//Return squares that a marker can move to
function marker_get_available_moves(elem){
	game_state.available_moves = [];
	var j = +elem.getAttribute("row");
	var i = +elem.getAttribute("square");
	if (board_mirror[j][i][1][0] == 'white'){
		//Try statements ignore squares not on the board
		marker_check_this_move(j, i, 1, -1, 'red', 'bottom left')
		marker_check_this_move(j, i, 1, 1, 'red', 'bottom right')
		//Normal pieces only get to move towards the enemy's line, kings can do whatever
		if (board_mirror[j][i][1][1] == 'king'){
			marker_check_this_move(j, i, -1, -1, 'red', 'top left')
			marker_check_this_move(j, i, -1, 1, 'red', 'top right')
		}
	} else {
		marker_check_this_move(j, i, -1, -1, 'white', 'top left')
		marker_check_this_move(j, i, -1, 1, 'white', 'top right')
		if (board_mirror[j][i][1][1] == 'king'){
			marker_check_this_move(j, i, 1, -1, 'white', 'bottom left')
			marker_check_this_move(j, i, 1, 1, 'white', 'bottom right')
		}				
	}
}

function marker_delete_this(j_delete, i_delete){
	console.log('Deleting this, ', j_delete, i_delete);
	d3.selectAll('.marker')
		.each(function(){
			if (this.getAttribute("row") == j_delete && this.getAttribute("square") == i_delete){
				d3.select(this)
					.transition()
					.duration(settings.game_speed / 2.5)
					.remove();
				board_mirror[j_delete][i_delete][1] = null;
			}
		})
}

d3.selectAll('svg')
	.on('click', function(){
		console.log(svg_container)
	})

//Change element and array 
function marker_make_this_king(elem){
	//Should just be able to add a smaller marker on top of the existing one.
	//Update the array to contain details of this new king piece.
	var j = +elem.getAttribute("row");
	var i = +elem.getAttribute("square");
	var target = elem.getAttribute("target");
	var player_colour = elem.style.fill;
	setTimeout(function(){
		elem.style.fill = 'gold'
		board_mirror[j][i][1] = [player_colour, 'king'];	
	}, settings.game_speed)
}

//Listen for move order
function marker_move_this(elem, to_j, to_i){
	//cur_ - current, to_ - to be
	d3.select(elem)
		.transition()
		.duration(settings.game_speed)
		.attr("cx", square_get_pos(to_i) + settings.square_width / 2)
		.attr("cy", square_get_pos(to_j) + settings.square_width / 2);
	var cur_j = +elem.getAttribute("row");
	var cur_i = +elem.getAttribute("square");
	if (Math.abs(cur_j - to_j) == 2 && Math.abs(cur_i - to_i) == 2){
		var j_delete = (cur_j + to_j) / 2;
		var i_delete = (cur_i + to_i) / 2;
		console.log('Getting jumped ,', j_delete, i_delete);
		marker_delete_this(j_delete, i_delete);
	}
	board_mirror[to_j][to_i][1] = board_mirror[cur_j][cur_i][1];
	board_mirror[cur_j][cur_i][1]= null;
	elem.setAttribute("row", to_j);
	elem.setAttribute("square", to_i);
	if (to_j == +elem.getAttribute("target")){
		marker_make_this_king(elem)
	}
}