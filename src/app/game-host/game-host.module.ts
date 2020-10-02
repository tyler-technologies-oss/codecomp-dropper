import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'
import { MatSelectModule } from '@angular/material/select'

import { GameHostRoutingModule } from './game-host-routing.module';
import { GameHostContainerComponent } from './game-host-container/game-host-container.component';


@NgModule({
  declarations: [GameHostContainerComponent],
  imports: [
    CommonModule,
    GameHostRoutingModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class GameHostModule { }
