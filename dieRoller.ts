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

// 4. Make a method to call the Australian National University's Random Number API for your random number using the Async/Await method.
// 5. Make a decorator function to replace your classes random number function with the API method
async function randomNumber(target: Object, propertyKey: string, descriptor: Promise<any>) {
    let rnCall = await fetch('https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint8');
    let rnum = await rnCall.json();
    target.constructor.prototype.rolledValue = rnum.data[0];
    console.log(target);
    console.log(propertyKey);
    console.log(rnum.data[0]);
}

// 1. Convert your dieRoller class to be a compositional or Mixin class
class dieRoller {

    protected rolledValue: number;

    constructor() {
        this.rollDie();
        console.log('New dieRoller init. '+this.rolledValue+' rolled');
    }

    @randomNumber
    rollDie(): void {
        this.rolledValue = chance().d6()
        // this.rolledValue = chance().natural({min: 1, max: 6});
    }
    showString(): string {
        return RolledValue[ this.rolledValue-1 ];
    }
    showNumber(): number {
        return this.rolledValue;
        // return this.rolledValue + 1;
    }
}

// export default new dieRoller;
export default dieRoller;
