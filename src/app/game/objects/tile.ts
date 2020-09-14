export class Tile{
    stepsRemaining:number;
    constructor(stepsRemaining:number){
        this.stepsRemaining = stepsRemaining;
    }

    getStepsRemaining(){
        return this.stepsRemaining;
    }
}