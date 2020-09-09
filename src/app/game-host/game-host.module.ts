import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhaserModule } from '../phaser/phaser.module';

import { GameHostRoutingModule } from './game-host-routing.module';
import { GameHostContainerComponent } from './game-host-container/game-host-container.component';


@NgModule({
  declarations: [GameHostContainerComponent],
  imports: [
    CommonModule,
    GameHostRoutingModule,
    PhaserModule,
  ]
})
export class GameHostModule { }
