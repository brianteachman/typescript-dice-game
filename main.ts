import * as _ from 'lodash';
import dieRoller from './dieRoller.js';

//@link https://github.com/systemjs/systemjs/blob/master/docs/config-api.md
//@link https://lodash.com/docs/4.17.4

/**
 * Self-Assessment 4: Further Extend Dice Rolling Game
 * 
 * @author Brian Teachman
 * 
 * Aside from external libraries (chance and lodash), all work is my own.
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
        this.score = 0;

        this.buildScreen();
        this.gameRound = 1;

        console.log("Game started, let's play!");
        return this.score;
    }

    play(): number {
        this.clearPage();
        this.buildScreen();
        console.log("The dice are down.\n\tYou rolled a "+this.throwCount+'. Current Score: '+this.score+'.');
        this.gameRound += 1;
        return this.score;
    }

    buildScreen(): void {
        this.addDiceBox();
        this.addScoreBox();
        if (this.gameRound == 0) {
            this.addPlayButton('Start Game');
        }
        else {
            this.addPlayButton('Roll Again');
        }
    }

    addDiceBox(elementId:string='dicebox'): void {
        let dicebox: Element = document.createElement('div');
        (dicebox as HTMLElement).id = elementId;
        this.gameContainer.appendChild(dicebox);

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
        }

        if ( ! this.loadDice()) {
            this.dice[0].div.appendChild(this.dice[0].p);
            this.dice[1].div.appendChild(this.dice[1].p);
            dicebox.appendChild(this.dice[0].div);
            dicebox.appendChild(this.dice[1].div);
        }

        if (_.isEmpty(this.dice)) {
            console.log("Dice loading failed!");
        }
        else {
            console.log(`[${this.dice.length}] dice loaded.`);
        }
    }

    loadDice(isLogged:boolean=false): boolean {
        this.throwCount = 0;
        let die: dieRoller = new dieRoller();
        let diceLog: string;
        let gamebox = document.getElementById('dicebox');

        if (this.gameRound == 0) {
            return false;
        }

        _.each(this.dice, (elem) => {
            die.rollDie();
            let s_roll: string = die.getString();
            let n_roll: number = die.getNumber();

            elem.p.textContent = s_roll;
            (elem.img as HTMLImageElement).src = 'imgs/'+n_roll+'.png';
            elem.img.className = s_roll;
            // img.width = 80;

            elem.div.appendChild(elem.img);
            elem.div.appendChild(elem.p);
            gamebox.appendChild(elem.div);

            this.throwCount += n_roll;
            console.log('Throw: '+n_roll+'\t Total: '+this.throwCount);

            // logging
            diceLog += elem.p.textContent + " ";
        });

        // update score
        if (this.gameRound > 0) {
            this.score += this.throwCount;
        }
        console.log('Score: '+this.score);

        if (isLogged) {
            console.log(`${diceLog}`);
        }

        return true;
    }

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

    addScoreBox(elementId:string='scorebox'): void {
        let scoreBox: Element = document.createElement('div');
        scoreBox.className = elementId;

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