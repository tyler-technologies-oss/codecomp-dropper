import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {  MonsterType } from 'src/app/game/objects/interfaces';

@Component({
  selector: 'tyl-team-config-adder',
  templateUrl: './team-config-adder.component.html',
  styleUrls: ['./team-config-adder.component.scss']
})
export class TeamConfigAdderComponent implements OnInit {

  monsters:string[]=Object.keys(MonsterType);

  teamForm = new FormGroup({
    teamName: new FormControl('',Validators.required),
    schoolName: new FormControl('',Validators.required),
    script: new FormControl ('',Validators.required),
    monsterChoice1: new FormControl ('',Validators.required),
    monsterChoice2: new FormControl ('',Validators.required)
  });

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.teamForm.value);
  }
}
