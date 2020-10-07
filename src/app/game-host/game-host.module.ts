import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameHostRoutingModule } from './game-host-routing.module';
import { GameHostContainerComponent } from './game-host-container/game-host-container.component';
import { MatCardModule } from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';


@NgModule({
  declarations: [GameHostContainerComponent],
  imports: [
    CommonModule,
    GameHostRoutingModule,
    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule
  ]
})
export class GameHostModule { }
