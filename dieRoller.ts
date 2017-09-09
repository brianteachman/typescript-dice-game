import * as chance from 'chance';

// Possible rolled values
enum RolledValue {
    One,
    Two,
    Three,
    Four,
    Five,
    Six
}

function getDiceThrow(num?: number): number {
    if (num === undefined) {
        randomNumberAPI().then( (response) => {
            num = response.json().data[0];
        })
    }
    if (num > 0 && num < 7) {
        return num;
    }
    getDiceThrow( Math.floor(num / 2) );
}

// 4. Make a method to call the Australian National University's Random Number API for your random number using the Async/Await method.
// 5. Make a decorator function to replace your classes random number function with the API method
// async function randomNumber(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
async function randomNumberAPI() {
    let rnCall = await fetch('https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint8');
    let rnum = await rnCall.json();
    console.log('Fetched: '+rnum.data[0]);
    return rnum.data[0];
}

// 1. Convert your dieRoller class to be a compositional or Mixin class
class dieRoller {

    protected rolledValue: number;

    constructor() {
        console.log('New dieRoller initialized.');
    }

    // @randomNumber
    rollDie(): void {
        // this.rolledValue = getDiceThrow();
        this.rolledValue = chance().d6();
        // this.rolledValue = chance().natural({min: 1, max: 6});
    }
    getString(): string {
        if (this.rolledValue == undefined) {
            this.rollDie();
        }
        return RolledValue[ this.rolledValue-1 ];
    }
    getNumber(): number {
        if (this.rolledValue == undefined) {
            this.rollDie();
        }
        return this.rolledValue;
    }
}

// export default new dieRoller;
export default dieRoller;
