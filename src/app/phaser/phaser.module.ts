import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaserGameComponent } from './phaser-game/phaser-game.component';


@NgModule({
  declarations: [PhaserGameComponent],
  exports: [PhaserGameComponent],
  imports: [
    CommonModule
  ]
})
export class PhaserModule { }
