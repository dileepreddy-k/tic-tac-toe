(function(){

    'use strict';
	
	//Polyfill Method for Equals Method
	// Warn if overriding existing method
	if(Array.prototype.equals)
		console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
	// attach the .equals method to Array's prototype to call it on any array
	Array.prototype.equals = function (array) {
		// if the other array is a falsy value, return
		if (!array)
			return false;

		// compare lengths - can save a lot of time 
		if (this.length != array.length)
			return false;

		for (var i = 0, l=this.length; i < l; i++) {
			// Check if we have nested arrays
			if (this[i] instanceof Array && array[i] instanceof Array) {
				// recurse into the nested arrays
				if (!this[i].equals(array[i]))
					return false;       
			}           
			else if (this[i] != array[i]) { 
				// Warning - two different object instances will never be equal: {x:20} != {x:20}
				return false;   
			}           
		}       
		return true;
	}
	// Hide method from for-in loops
	Object.defineProperty(Array.prototype, "equals", {enumerable: false});

    var game = {};
    //window Object
    //Access this with window.game
    window.game = window.game || new Object;

    //Player Objects
    game.player1 = game.player1 || new Object;
    game.player2 = game.player2 || new Object;
	game.possibleWinIndexes = game.possibleWinIndexes || new Object;

    game.player1 = {
        id: "1",
        name: "PLAYER 1",
        hits: 0,
        turn: true,
        icon: "&times;"
    }

    game.player2 = {
        id: "2",
        name: "PLAYER 2",
        hits: 0,
        turn: false,
        icon: "o"
    }

	game.possibleWinIndexes = [
		"0, 1, 2",
		"3, 4, 5",
		"6, 7, 8",
		"0, 3, 6",
		"1, 4, 7",
		"2, 5, 8",
		"0, 4, 8",
		"2, 4, 6",
	];
	
    var baseHits = 3;

    //Required selectors
    var startBtn = document.querySelector('#game-init'),
        gameControls = document.querySelector('.game-controls'),
        gameBoard = document.querySelector('#ttt-wrap'),
		boardCells = Array.prototype.slice.call(gameBoard.children),
        boardGrid = document.querySelectorAll('.grid'),
        playerNamePlaceholder = document.querySelector('.player'),
        playerState = {};

    //Event listener on Start Button
    startBtn.addEventListener('click', function(){
        game.init();
    });

    //init Method
    game.init = function(){
        var isControlsVisible = _isVisible(gameControls);
        if(isControlsVisible)
            gameControls.style.display = "none";
    }

    game.playerState = function(){
        return {
            activePlayer: game.player1.turn ? 'player1' : 'player2',
            inactivePlayer: !game.player1.turn ? 'player1' : 'player2',
        }
    }

    game.getPlayerHits = function(player){
        return game[player].hits;
    }
		
	game.checkGame = function(indexArray){	
		game.possibleWinIndexes.forEach(function(ele, index, array){
			game.possibleWinIndexesArray = ele.split(',').map(function(currentVal, i, arr){
				return parseInt(currentVal, 10);
			});
			console.log(game.possibleWinIndexesArray);
			if( game.possibleWinIndexesArray.equals(indexArray) === true ){
				game.checkWinner();
			}else{
				console.log(':)');
			}
		});	
	}
	
	game.checkWinner = function(){
		var playerState = game.playerState();
		console.log(game[playerState.inactivePlayer].name);
		playerNamePlaceholder.classList.add('gameOver');
		playerNamePlaceholder.innerHTML = game[playerState.inactivePlayer].name + 'WON';
	}
	
	game.getClickedCellIndex = function(){
		
		var playerState = game.playerState();
		
		var playerIdIndex = [];
		
		boardCells.forEach(function(cell, index, boardCells){
			var clickedPlayerId = cell.getAttribute('data-player');
			if(clickedPlayerId === game[playerState.inactivePlayer].id){
				playerIdIndex.push(index);
			}
		});
		return playerIdIndex;
	}

    // Attach Click Handler to each grid in Board 
    boardGrid.forEach(function(elem, index, boardGrid){
        elem.addEventListener('click', function(){
            var _isDisabled = _hasAttribute(this, "disabled");
            if(!_isDisabled){
                this.classList.add("active");
                this.setAttribute('disabled', 'true'); //to restrict from next click
				
                var playerState = game.playerState();
				this.setAttribute('data-player', game[playerState.activePlayer].id );
                this.children[0].innerHTML = game[playerState.activePlayer].icon;
                game[playerState.activePlayer].hits++;
                game[playerState.activePlayer].turn = false;
                game[playerState.inactivePlayer].turn = true;
                playerNamePlaceholder.innerHTML = playerState.inactivePlayer + ' Turn';

                var firstPlayerHits = game.getPlayerHits("player1");

                if(firstPlayerHits >= baseHits){
					var indexes = game.getClickedCellIndex();
					game.checkGame(indexes);
                }
            }
        });
    });
	
    //hasAttribute
    function _hasAttribute(element, attribute){
        return element.hasAttribute(attribute);
    }

    //isVisible function - JS
    function _isVisible(element){
        return element.offsetWidth > 0 && element.offsetHeight > 0;
    }

    //hasClass
    function _hasClass(element, className) {
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(element.className);
    }

}());