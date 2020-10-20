import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ITeamConfig, MonsterType, Side } from 'src/app/game/objects/interfaces';
import { GameService } from '../game.service';
import { TeamConfigsService } from '../team-configs.service';

@Component({
  selector: 'tyl-simple-run',
  templateUrl: './simple-run.component.html',
  styleUrls: ['./simple-run.component.scss']
})
export class SimpleRunComponent implements OnInit {

  simpleRunForm = new FormGroup({
    script: new FormControl ('',Validators.required),
    awayTeamConfig: new FormControl ('',Validators.required)
  });

  // teamConfigs: ITeamConfig[] = [];

  constructor(private configService: TeamConfigsService, private gameService: GameService) { }

  ngOnInit(): void {
    //this.configService.getTeamConfigs().subscribe(teamConfigs => this.teamConfigs = teamConfigs);
  }

  // Needed for html binding to actually store object in component on selection of config
  compareConfigs(o1: any, o2: any): boolean {
    return o1.name === o2.name;
  }

  getTeamConfigs(){
   return this.configService.teamConfigs;
  }

  onStart(){
    let teamConfig: ITeamConfig = {
      name: "Test",
      org: "Test",
      preferredMonsters: {
        [Side.Home]: MonsterType.Spike,
        [Side.Away]: MonsterType.Pinky,
      },
      aiSrc: this.simpleRunForm.value.script
    }
    this.gameService.setTeamConfigs(teamConfig, this.simpleRunForm.value.awayTeamConfig);
  }

}
