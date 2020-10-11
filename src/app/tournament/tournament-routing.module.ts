import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TournamentComponent } from './tournament/tournament.component';
import { CsmBracketComponent } from './bracket/csm-bracket/csm-bracket.component';
import { TtuBracketComponent } from './bracket/ttu-bracket/ttu-bracket.component';
import { GrandFinalComponent } from './bracket/grand-final/grand-final.component';

const routes: Routes = [
  {path: '', component: TournamentComponent, children: [
    { path:'', redirectTo: 'FINALS', pathMatch: 'full' },
    { path: 'FINALS', component: GrandFinalComponent},
    { path: 'CSM', component: CsmBracketComponent },
    { path: 'TTU', component: TtuBracketComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentRoutingModule { }
