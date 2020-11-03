import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  editorOptions = { theme: 'vs-light', language: 'javascript' };
  simpleRunForm = new FormGroup({
    script: new FormControl("//NOTE: This is for development purposes only, final submission should be done through the submission tab Fill in the contents of main with your strategy The contents of gameState and side can be found by viewing interfaces.ts IGameState and Side interfaces gameState represents the current state of the game (all tiles, all teams) side will tell you which team is yours main should return an array of MoveDirection's (also found in interfaces.ts) with size = # of monsters on one team to start/*\r\rfunction main(gameState, side){\r\tconst myTeam = gameState.teamStates[side];\r\treturn ['none', 'none', 'none'];\r}", Validators.required),
    awayTeamConfig: new FormControl('', Validators.required)
  });

  codeMirrorOptions: any = {
    mode: 'javascript',
    lineNumbers: true,
    lineWrapping: true,
    gutters: ['CodeMirror-lint-markers'],
    theme:'darcula',
    lint: true
  };

  constructor(private configService: TeamConfigsService, private gameService: GameService) { }

  ngOnInit(): void {
    //This is not dynamic and is objectively terrible but works ¯\_(ツ)_/¯ 
    let editor = document.getElementById("editor");
    editor.setAttribute("style", "height:" + (document.getElementById("codeEditorForm").clientHeight - 100) + "px");
  }

  // Needed for html binding to actually store object in component on selection of config
  compareConfigs(o1: any, o2: any): boolean {
    return o1.name === o2.name;
  }

  getTeamConfigs() {
    return this.configService.teamConfigs;
  }

  onStart() {
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
