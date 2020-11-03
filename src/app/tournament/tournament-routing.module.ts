import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TournamentComponent } from './tournament/tournament.component';
import { BracketComponent } from './bracket/bracket/bracket.component';

const routes: Routes = [
  {path: '', component: TournamentComponent, children: [
    { path:'', redirectTo: 'FINALS', pathMatch: 'full' },
    { path: 'FINALS', component: BracketComponent, data: { key: '8dcacwho' }},
    { path: 'CSM', component: BracketComponent, data: { key: 'ukl3zajm' }},
    { path: 'TTU', component: BracketComponent, data: { key: 'u0gzpost' }},
    { path: 'CSU', component: BracketComponent, data: {key: 'wb48fauk'}},
    { path: 'CU', component: BracketComponent, data: {key: 'd6t431mi'}},
    { path: 'UMaine', component: BracketComponent, data: {key: 'z3i2dq68'}},
    { path: 'UW', component: BracketComponent, data: {key: '518ltun5'}},
    { path: 'GATech', component: BracketComponent, data: {key: '28ktglbq'}},
    { path: 'MISC', component: BracketComponent, data: {key: '2prkbfhc'}}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentRoutingModule { }
