import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TournamentComponent } from './tournament/tournament.component';
import { BracketComponent } from './bracket/bracket/bracket.component';

const routes: Routes = [
  {
    path: '', component: TournamentComponent, children: [
      { path: '', redirectTo: 'FINALS', pathMatch: 'full' },
      { path: 'FINALS', component: BracketComponent, data: { key: '8dcacwho' } },
      { path: 'CSM', component: BracketComponent, data: { key: 'mo72318d' } },
      { path: 'TTU', component: BracketComponent, data: { key: 'l6pneeks' } },
      { path: 'UMaine', component: BracketComponent, data: { key: 'z3i2dq68' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentRoutingModule { }
