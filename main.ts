import * as _ from 'lodash';
import dieRoller from './dieRoller.js';

//@link https://github.com/systemjs/systemjs/blob/master/docs/config-api.md
//@link https://lodash.com/docs/4.17.4

/**
 * Self-Assessment 4: Further Extend Dice Rolling App
 */

interface DiceElement {
    div: Element;
    img: Element;
    p: Element;
}

// 2. Add a Type Guard to your application
// 3. Use a Union Type or an Intersection Type in your application

class Game {

    protected parentName: string = '';
    private gameContainer: HTMLElement;

    dice: Array<DiceElement> = [];
    numOfDice: number = 2;

    throwCount: number;
    gameRound: number;
    score: number;

    constructor(parentName:string='dice-game') {
        this.parentName = parentName;
        this.gameContainer = document.getElementById(this.parentName);
        this.gameRound = 0;
        console.log('Game instantiated: started in element id="'+this.parentName+'" .');
    }

    start(): number {
        this.gameRound = 1;
        this.throwCount = 0;
        this.score = 0;

        this.buildScreen();

        console.log("Game started, let's play!");
        return this.score;
    }

    play(): number {
        this.clearPage();
        this.buildScreen();
        console.log("The dice are down. You rolled a "+this.throwCount+'. Current Score: '+this.score+'.');
        this.gameRound += 1;
        return this.score;
    }

    buildScreen(): void {
        this.addDiceBox();
        if (this.gameRound == 0) {
            this.addPlayButton('Start Game');
        }
        else {
            this.addPlayButton('Play Again');
        }
        this.addScoreBox('score-box');
    }

    addDiceBox(): void {
        for (let index: number = 0; index < this.numOfDice; index++) {

            let div: Element = document.createElement('div');
            (div as HTMLElement).className = 'dice-holder';
            (div as HTMLElement).onmouseover = () => {
                (div as HTMLElement).className = 'dice-holder hover';
            }
            (div as HTMLElement).onmouseout = () => {
                (div as HTMLElement).className = 'dice-holder';
            }

            let img = document.createElement('img');

            let p: Element = document.createElement('p');
            (p as HTMLElement).onmousedown = () => {
                (p as HTMLElement).style.transform = 'rotate(360deg)';
                (p as HTMLElement).style.transition = "transform .5s ease";
            }
            (p as HTMLElement).onmouseup = () => {
                // (p as HTMLElement).style.transform = '';
                // (p as HTMLElement).style.transition = "";
                (p as HTMLElement).style.transform = 'rotate(-360deg)';
                (p as HTMLElement).style.transition = "transform 1s ease";
            }

            this.dice.push({
                'div': div,
                'img': img,
                'p': p
            });

            // this.loadDice(true);
            this.loadDice();
        }
        if (_.isEmpty(this.dice)) {
            console.log("Dice loading failed!");
        }
        else {
            console.log(`[${this.dice.length}] Dice loaded.`);
        }
    }

    loadDice(isLogged:boolean=false): void {
        let diceLog: string;
        _.each(this.dice, (elem) => {
            let die: dieRoller = new dieRoller();
            elem.p.textContent = die.showString();

            (elem.img as HTMLImageElement).src = 'imgs/'+die.showNumber()+'.png';
            elem.img.className = die.showString();
            // img.width = 80;

            // build dice DOM
            elem.div.appendChild(elem.img);
            elem.div.appendChild(elem.p);
            this.gameContainer.appendChild(elem.div);
            this.throwCount += die.showNumber();

            // logging
            diceLog += elem.p.textContent + " ";
        });
        this.score += this.throwCount;
        if (isLogged) {
            console.log(`${diceLog}`);
        }
    }

    // Button to roll all the dice at once
    addPlayButton(buttonText: string = "Press"): void {
        let button: Element = document.createElement('button');
        button.textContent = buttonText;
        (button as HTMLElement).className = 'play-button';
        (button as HTMLElement).onclick = (event) => {
            // Reroll the dice with recursive type magic
            this.play();
        }
        this.gameContainer.appendChild(button);
    }

    addScoreBox(className?: string): void {
        let scoreBox: Element = document.createElement('div');
        scoreBox.className = className;

        let scoreBoxTitle: Element = document.createElement('h2');
        scoreBoxTitle.textContent = 'Score';

        let throwText: Element = document.createElement('p');
        throwText.className = 'throw-text';
        throwText.textContent = this.throwCount.toString();

        let scoreText: Element = document.createElement('p');
        scoreText.className = 'score-text';
        // if (this.gameRound == 0) {}
        scoreText.textContent = 'TOTAL: ' + this.score.toString();

        scoreBox.appendChild(scoreBoxTitle);
        scoreBox.appendChild(throwText);
        scoreBox.appendChild(scoreText);
        this.gameContainer.appendChild(scoreBox);
    }

    // Cleanup page for rewrite
    clearPage(): void {
        console.log('Clear page: '+this.gameContainer);
        while (this.gameContainer.firstChild) {
            console.log(this.gameContainer.firstChild);
            this.gameContainer.removeChild(this.gameContainer.firstChild);
        }
        this.dice = [];
    }
}

let game: Game = new Game();
console.log('Game over! You scored '+game.start()+'.');

// Compile using CommonJS (SystemJS)
// $ tsc main.ts

// which is the default to
// $ tsc --module System main.ts

// or AMD (RequireJS)
// $ tsc --module amd main.ts

// or, press: ctrl + shift + b