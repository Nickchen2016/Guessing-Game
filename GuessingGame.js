function generateWinningNumber(){
    return Math.floor(Math.random()*100+1);
}

function shuffle(arr){
    var m=arr.length, t, i;
    while(m){
        i = Math.floor(Math.random()*m--);
        t = arr[i];
        arr[i]=arr[m];
        arr[m]=t;
    }
    return arr;
}
function Game(){
    this.playersGuess = null;
    this.pastGuesses =[];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess-this.winningNumber);
}
Game.prototype.isLower = function(){
    if(this.playersGuess<this.winningNumber){
        return true;
    }
    return false;
}
Game.prototype.playersGuessSubmission = function(num){
    if(!(num>=1&&num<=100)){
        $('#sub').text('That is an invalid guess.')
        throw 'That is an invalid guess.';
    }
    this.playersGuess = num;
    return this.checkGuess();
}
Game.prototype.checkGuess = function(){
    if(this.playersGuess===this.winningNumber){
        $('#hint, #submit').prop('disabled',true);
        $('#sub').text('Press the Reset button to play again!');
        return 'You Win!';
    }
    else{
        if(this.pastGuesses.indexOf(this.playersGuess) > -1){
            return 'You have already guessed that number.';
        }
        else{
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
            if(this.pastGuesses.length===5){
                $('#hint, #submit').prop('disabled',true);
                $('#sub').text('Press the Reset button to play again!');
                return "You Lose.";
            }
            else{
                var diff = this.difference();
                if(this.isLower()){
                    $('#sub').text('Guess Higher!')
                }else{
                    $('#sub').text('Guess Lower!')
                }
                if(diff < 10){
                    return 'You\'re burning up!';
                }
                if(diff < 25){
                    return 'You\'re lukewarm.';
                }
                if(diff < 50){
                    return 'You\'re a bit chilly.';
                }
                if(diff < 100){
                    return 'You\'re ice cold!';
                }
            }
        }
    }
}

function newGame(){
    return new Game();
}

Game.prototype.provideHint = function(){
    var hintArray = [this.winningNumber,generateWinningNumber(),generateWinningNumber()];
    return shuffle(hintArray);
}

function makeAGuess(game) {
    var guess = $('#player-input').val();
    $('#player-input').val('');
    var output = game.playersGuessSubmission(Number(guess));
    $('#CGValue').text(output);
}

$(document).ready(function(){
    var game = new Game();
  $('#submit').click(function(){
    makeAGuess(game);
  });

  $('#player-input').keypress(function(event) {
    if ( event.which == 13 ) {
       makeAGuess(game);
    }
});

  $('#hint').click(function(){
    var hints = game.provideHint();
    $('#CGValue').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
  });
  $('#reset').click(function(){
    game = newGame();
    $('#CGValue').text('Enter a number between 1~100');
    $('#sub').text('I\'m here to answer your guess')
    $('.guess').text('-');
    $('#hint, #submit').prop("disabled",true);
  });
});