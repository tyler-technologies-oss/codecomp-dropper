import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class RoundManagerService {
    public numRounds: number = 5;
    public completedRounds: number = 0;

    public homeRoundWins: number = 0;
    public awayRoundWins: number = 0;
    public roundDraws: number = 0;

    public useDefaultMapRotation:boolean = true;

    private roundMapping = ["Default", "I(n) The Middle", "WaffleTown", "Hourglass", "Default"];

    reset() {
        this.completedRounds = 0;
        this.homeRoundWins = 0;
        this.awayRoundWins = 0;
        this.roundDraws = 0;
    }

    public getRoundMapName():string{
        return this.roundMapping[(this.completedRounds + 1) % this.roundMapping.length];
    }

}
