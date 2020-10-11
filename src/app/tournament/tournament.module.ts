import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

import { TournamentRoutingModule } from './tournament-routing.module';
import { TournamentComponent } from './tournament/tournament.component';
import { CsmBracketComponent } from './bracket/csm-bracket/csm-bracket.component';
import { TtuBracketComponent } from './bracket/ttu-bracket/ttu-bracket.component';
import { GrandFinalComponent } from './bracket/grand-final/grand-final.component';
import { BracketComponent } from './bracket/bracket/bracket.component';



@NgModule({
  declarations: [TournamentComponent, CsmBracketComponent, TtuBracketComponent, GrandFinalComponent, BracketComponent],
  imports: [
    MatTabsModule,
    TournamentRoutingModule,
    CommonModule
  ],
  entryComponents: [TournamentComponent]
})
export class TournamentModule { }
