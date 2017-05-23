(function($) {
	var Utils = {
		getRandomInt : function(min, max) {
		    return min + Math.floor(Math.random() * (max - min + 1));
		}
	}
	// define Agent
	function Agent( sudoku ){
		this.board = sudoku;
		var b      = this.board.export(),
			result = this.search(b);
		if( result )
			this.board.import(result);
	}
	Agent.prototype = {
		search : function (b){
		    var openList = [];

		    openList.unshift(b);

		    while (openList.length != 0)
		    {
		        var T = openList[0];
		        if (this.isGoal(T)){
		            return T;
		        }

		        openList.shift();
		        var arr = this.successor(T);
		        for(var i =0;i<arr.length;i++)
		            openList.unshift(arr[i]);
		    }
		    return false;
		},
		isGoal :function (b){
		    for (var i = 0; i < this.board.len; i++)
		        for (var j = 0; j < this.board.len; j++)
		            if (b[i][j] == 0)
		                return false;

		    return true;
		},
		isValid :function ( b, num, x, y){
		    for (var k = 0; k < this.board.len; k++)
		        if (k != x && num == b[k][y])
		            return false;
		        else if (k != y && num == b[x][k])
		            return false;

		    var iStart 	= parseInt(x / 3) * 3,
		    	jStart 	= parseInt(y / 3) * 3,
		    	iEnd 	= iStart + 3,
		    	jEnd 	= jStart + 3;
	    	try{
	    		for (var i = iStart; i < iEnd; i++)
			        for (var j = jStart; j < jEnd; j++)
			            if (b[i][j] == num && i != x && j != y)
			                return false;
	        }catch( err ){
	        	console.log(i,j,b);
	        }
		    

		    return true;
		},
		successor :function ( b ){
		    var r 		= [],
		    	emptyX 	= -1,
		    	emptyY  = -1;

		    for (var i = 0; i < this.board.len && emptyX == -1; i++){
		        for (var j = 0; j < this.board.len && emptyY == -1; j++)
		        {
		            if (b[i][j] == 0){
		                emptyX = i;
		                emptyY = j;
		            }
		        }
		    }

		    if (emptyX != -1)
		    {
		        for (var k = 1; k <= 9; k++){

		            if (this.isValid(b, k, emptyX, emptyY)){
		                var newBoard = [];
		                for (var row = 0; row < this.board.len; row++){
		                	newBoard[row] = [];
		                    for (var col = 0; col < this.board.len; col++)
		                        newBoard[row][col] = b[row][col];
		                }

		                newBoard[emptyX][emptyY] = k;
		                r.push(newBoard);
		            }
		        }
		    }

		    return r;
		}
	};

	// define Board Object
	function Sudoku( el ){
		this.board 	= el;
		this.$tiles = $(this.board).find(".tile");
		this.len 	= 9;
		// this.commix();
	}
	Sudoku.prototype = {
		setVal : function( row, column, val ){
			var el = this.getTile(row, column);
			$( el ).val( val );
		},
		getVal : function( row, column ){
			var el = this.getTile(row, column);
			return $( el ).val();
		},
		export : function(){
			var self = this,
				out  = [];
			for(var row = 0;row < this.len ; row++){
				out[row] = [];
				for(var column = 0;column < this.len ; column++){
					out[row][column] = this.getVal(row, column );
				}

			}
			return out;
		},
		import  : function( data ){

			for(var row = 0;row < this.len ; row++)
				for(var column = 0;column < this.len ; column++)
					this.setVal(row, column, data[row][column] );
		},
		getTile : function(row, column){
			row++;
			column++;
			var tableIndex = ( Math.ceil( row / 3 ) * 3 ) - ( 3 - Math.ceil( column / 3 ) ),
				xPoint 	   = Math.ceil( ( ( column / 3  ) % 1 + '').substr(0,3) * 3 ),
				yPoint     = Math.ceil( ( ( row / 3  ) % 1 + '').substr(0,3) * 3 );
				
			xPoint = xPoint === 0 ? 3 : xPoint;
			yPoint = yPoint === 0 ? 3 : yPoint;

			var indexItem  = ( ( tableIndex - 1 ) * this.len ) + ( ( yPoint  - 1  ) * 3 ) + xPoint;

			return this.$tiles.get( indexItem - 1 );
		},
		commix : function( count ){
			count = count || 10;
			new Agent(this);
			var self 	= this,	
				go 		= function( rowChange ){
					if( rowChange <= 0 )
						return false;
					var row = Utils.getRandomInt(0,self.len),
						col = Utils.getRandomInt(0,self.len),
						val = self.getVal( row, col );
					if( val > 0 ){
						rowChange--;
						self.setVal( row, col, '' );
					}
					go(rowChange);
				};
			go(count);
		}
	};
    $.fn.Sudoku = function() {
        var obj = $(this).data("sudoku");
    	if( !obj ){
    		obj = new Sudoku(this);
    		$(this).data({"sudoku" : obj });
    	}
    	return obj;
    }
    $(document).ready(function() {
		var board = $("#main_table").Sudoku();
		$("#search_result").click(function(event) {
			new Agent( board );
		});
		$("#commix_board").click(function(event) {
			board.commix();
		});
	});
})(jQuery);

