import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'about', pathMatch: 'full'},
  {path: 'about', loadChildren: () => import('../about/about.module').then(m => m.AboutModule)},
  {path: 'register', loadChildren: () => import('../registration/registration.module').then(m => m.RegistrationModule)},
  /*{path: 'game', loadChildren: () => import('../game-host/game-host.module').then(m => m.GameHostModule)},
  {path: 'rules', loadChildren: () => import('../rules/rules.module').then(m => m.RulesModule)},*/
  {path: '**', redirectTo: 'about'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRootRoutingModule { }
