import * as _ from 'lodash';
import dieRoller from './dieRoller.js';

//@link https://github.com/systemjs/systemjs/blob/master/docs/config-api.md
//@link https://lodash.com/docs/4.17.4

/**
 * Self-Assessment 4: Further Extend Dice Rolling App
 */

interface DiceElement {
    div: Element;
    p: Element;
}

const diceGameContainerElement = 'dice-game';

// 2. Add a Type Guard to your application
// 3. Use a Union Type or an Intersection Type in your application

class Game {
// class Game implements dieRoller {
    // protected rolledValue: number
    // rollDie: () => void
    // showString: () => string
    // showNumber: () => number

    protected parentName: string = '';
    private gameContainer: HTMLElement;

    dice: Array<DiceElement> = [];

    throwCount: number;

    constructor(parentName?: string) {
        if  (parentName == undefined) {
            this.parentName = diceGameContainerElement;
        }
        else {
            this.parentName = parentName;
        }
        this.gameContainer = document.getElementById(this.parentName);
        this.buildGameElements();
        console.log('Game started: in element having a id="'+this.parentName+'" .');
    }

    play(): void {
        console.log("Let's play!");
        this.throwCount = 0;
        this.clearPage();

        _.each(this.dice, (elem) => {
            let die: dieRoller = new dieRoller();
            elem.p.textContent = die.showString();

            let img = document.createElement('img');
            img.src = 'imgs/'+die.showNumber()+'.png'
            img.className = die.showString();
            // img.width = 80;

            elem.div.appendChild(img);
            elem.div.appendChild(elem.p);
            this.gameContainer.appendChild(elem.div);
            this.throwCount += die.showNumber();
        });
        this.logDice();
        this.addPlayButton("Roll the dice");
        this.addScoreBox('score-box');
        console.log("Screen building complete.");
    }

    buildGameElements(): void {
        for (let index: number = 0; index < 4; index++) {
            //
            let p: Element = document.createElement('p');
            let div: Element = document.createElement('div');
            (div as HTMLElement).className = 'dice-holder';
            (div as HTMLElement).onmouseover = () => {
                (div as HTMLElement).className = 'dice-holder hover';
            }
            (div as HTMLElement).onmouseout = () => {
                (div as HTMLElement).className = 'dice-holder';
            }
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
                'p': p
            });
        }
        if (_.isEmpty(this.dice)) {
            console.log("Dice loading failed!");
        }
        else {
            console.log(`[${this.dice.length}] Dice loaded.`);
        }
    }

    addScoreBox(className?: string): void {
        let scoreBox: Element = document.createElement('div');
        let scoreTitle: Element = document.createElement('h2');
        let scoreText: Element = document.createElement('p');

        scoreTitle.textContent = 'Score';
        scoreText.textContent = this.throwCount.toString();
        scoreBox.className = className;

        scoreBox.appendChild(scoreTitle);
        scoreBox.appendChild(scoreText);
        this.gameContainer.appendChild(scoreBox);
    }

    logDice(): void {
        let diceLog: string = '';
        _.each(this.dice, (elem) => {  diceLog += elem.p.textContent + " " })
        console.log(`${diceLog}`);
    }

    // Cleanup page for rewrite
    clearPage(): void {
        while (this.gameContainer.firstChild) {
            this.gameContainer.removeChild(this.gameContainer.firstChild);
        }
    }

    // Button to roll all the dice at once
    addPlayButton(buttonText: string = "Press"): void {
        let button: Element = document.createElement('button');
        button.textContent = buttonText;
        (button as HTMLElement).className = 'play-button';
        (button as HTMLElement).onclick = (event) => {
            // Reroll the dice with recursive type magic
            game = new Game();
            game.play();
        }
        this.gameContainer.appendChild(button);
    }
}

let game: Game = new Game();
game.play();

// Compile using CommonJS (SystemJS)
// $ tsc main.ts

// which is the default to
// $ tsc --module System main.ts

// or AMD (RequireJS)
// $ tsc --module amd main.ts

// or, press: ctrl + shift + b