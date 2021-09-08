class MatchingGame{

    constructor(container, cardSection, matchesFound, progressBar, gameAudio, cardFlipAudio, cardMatchAudio, errorNoiseAudio, gameOverSection, gameOverScore){
        this.cardSection = cardSection;
        this.matchesFound = matchesFound;
        this.progressBar = progressBar;
        this.cardFlipAudio = cardFlipAudio;
        this.cardMatchAudio = cardMatchAudio;
        this.errorNoiseAudio = errorNoiseAudio;
        this.gameAudio = gameAudio;
        this.gameOverSection = gameOverSection;
        this.gameOverScore = gameOverScore;
        this.container = container;
        this.generateBoard();
    }

    startAudio(){
        if(this.count < 100.2){
            this.gameAudio.volume = 0.4;
            this.gameAudio.play();
        }
    }

    generateBoard(){
        this.arr_of_images = [
            {src: 'fish.png', id: 3},
            {src: 'garfield.png', id: 2},
            {src: 'billygoat.png', id: 4},
            {src: 'owl.png', id: 1},
            {src: 'billygoat.png', id: 4},
            {src: 'tiger.png', id: 7},
            {src: 'mammoth.png', id: 5},
            {src: 'fish.png', id: 3},
            {src: 'lion.png', id: 8},
            {src: 'rhino.png', id: 6},
            {src: 'dog.png', id: 9},
            {src: 'beaver.png', id: 10},
            {src: 'garfield.png', id: 2},
            {src: 'owl.png', id: 1},
            {src: 'tiger.png', id: 7},
            {src: 'beaver.png', id: 10},
            {src: 'rhino.png', id: 6},
            {src: 'mammoth.png', id: 5},
            {src: 'lion.png', id: 8},
            {src: 'dog.png', id: 9},
        ];

        this.count = 0;
        this.newSession = true;
        this.currentFlips = [null, null];
        this.wrongMatch = [];
        this.gameStarted = false;

        for(let i = this.arr_of_images.length - 1; i >= 0; i--){
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.arr_of_images[i];
            this.arr_of_images[i] = this.arr_of_images[j];
            this.arr_of_images[j] = temp;
        }
        for(let i = 0; i < this.arr_of_images.length; i++){
            this.cardSection.innerHTML += `
            <img src="question.png" id="${this.arr_of_images[i].id}" alt="question" data-card>
            `;
        }
    }

    flipCard(singleCard){
        if(this.gameStarted){
            let id = singleCard.path[0].id;
            if(!this.currentFlips[0]){
                cardFlipAudio.volume = 0.45;
                cardFlipAudio.play();
                for(let i = 0; i < this.arr_of_images.length - 1; i++){
                    if(this.arr_of_images[i].id == id){
                        singleCard.path[0].src = `https://camsteph.github.io/Card-Match-Application/img/${this.arr_of_images[i].src}`;
                        break;
                    }
                }

                 this.currentFlips[0] = id;
                 this.wrongMatch.push(singleCard);
            }
            else if(this.currentFlips[0] == id) {
                setTimeout(() => {
                    cardMatchAudio.volume = 0.45;
                    cardMatchAudio.play();
                }, 150);
                for(let i = 0; i < this.arr_of_images.length - 1; i++){
                    if(this.arr_of_images[i].id == id){
                        singleCard.path[0].src = `${this.arr_of_images[i].src}`;
                        break;
                    }
                }

                this.currentFlips[0] = null;
                this.currentFlips[1] = null;
                this.count += 1;
                this.matchesFound.innerHTML = this.count;
                this.wrongMatch.pop();
                if(this.count === 10) {
                    this.gameOverSection.style.display = 'flex';
                    this.container.style.display = 'none';
                    this.gameOverScore.innerText = this.count;
                    // alert('all matches found.');
                }
            }
            else{
                for(let i = 0; i < this.arr_of_images.length - 1; i++){
                    if(this.arr_of_images[i].id == id){
                        singleCard.path[0].src = `${this.arr_of_images[i].src}`;
                        break;
                    }
                }
                setTimeout(() => {
                    errorNoiseAudio.play();
                    singleCard.path[0].src = `question.png`;
                    return;
                }, 400);
                this.currentFlips[0] = null;
                this.currentFlips[1] = null;
                setTimeout(() => {
                    this.wrongMatch[0].path[0].src = `question.png`;
                    this.wrongMatch.pop();
                }, 400);
            }
            return;

        }
    }

    loadProgressBar(){
        if(!this.gameStarted){
            this.gameStarted = true;
            let i = 0;
                setInterval(() => {
                    if(i <= 100.2) {
                        this.progressBar.style.height = `${i}%`;
                        this.progressBar.innerHTML = `${i.toFixed(1)}%`
                        i += 0.2;
                    }
                    else{
                        if(this.gameAudio){
                            this.gameAudio.pause();
                        }
                        this.gameAudio = null;
                        this.gameOverSection.style.display = 'flex';
                        this.container.style.display = 'none';
                        this.gameOverScore.innerText = this.count;
                        // alert(`Oh, no. You ran out of time :(`);
                        // location.reload();
                    }
                }, 100);
        }
    }
}
const container = document.querySelector('[data-container]');
const cardSection = document.querySelector('[data-card-section]');
const matchesFound = document.querySelector('[data-matches-found]');
const progressBar = document.querySelector('[data-progress-bar]');
const startGameButton = document.querySelector('[data-start-game]');
const cardFlipAudio = new Audio('card-flip.mp3');
const cardMatchAudio = new Audio('bell_sound.mp3');
const errorNoiseAudio = new Audio('error-noise.mp3');
const gameAudio = new Audio('game_audio.mp3');
const gameOverSection = document.querySelector('[data-game-over-section]');
const gameOverScore = document.querySelector('[data-game-over-score]');
const playAgainBtn = document.querySelector('[data-play-again-btn]');

const newGame = new MatchingGame(container, cardSection, matchesFound, progressBar, gameAudio, cardFlipAudio, cardMatchAudio, errorNoiseAudio, gameOverSection, gameOverScore);
const cards = document.querySelectorAll('[data-card]');

cards.forEach(card => {
    card.addEventListener('click', singleCard => {
        // console.log(singleCard);
        newGame.flipCard(singleCard);
        // newGame.loadProgressBar();
    });
});

startGameButton.addEventListener('click', () => {
    newGame.loadProgressBar();
    newGame.startAudio();
});

gameAudio.addEventListener('ended', () => {
    console.log('song ended');
    newGame.startAudio();
});

playAgainBtn.addEventListener('click', () => {
    location.reload();
    gameOverSection.style.display = 'none';
});
