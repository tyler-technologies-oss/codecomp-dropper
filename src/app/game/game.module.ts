import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameContainerComponent } from './game-container/game-container.component';
import { PhaserGameComponent } from './phaser-game/phaser-game.component';


@NgModule({
  declarations: [GameContainerComponent, PhaserGameComponent],
  imports: [
    CommonModule,
    GameRoutingModule
  ]
})
export class GameModule { }
