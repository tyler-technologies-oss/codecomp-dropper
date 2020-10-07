import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { GameHostContainerComponent } from './game-host-container/game-host-container.component';
import { GameHostRoutingModule } from './game-host-routing.module';



@NgModule({
  declarations: [GameHostContainerComponent],
  imports: [
    CommonModule,
    GameHostRoutingModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule
  ]
})
export class GameHostModule { }
