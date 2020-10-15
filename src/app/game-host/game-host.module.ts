import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { GameHostContainerComponent } from './game-host-container/game-host-container.component';
import { GameHostRoutingModule } from './game-host-routing.module';
import { TeamConfigAdderComponent } from './team-config-adder/team-config-adder.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [GameHostContainerComponent, TeamConfigAdderComponent],
  imports: [
    CommonModule,
    GameHostRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ]
})
export class GameHostModule { }
