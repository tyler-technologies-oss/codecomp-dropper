import { Injectable } from '@angular/core';
import { ITeamConfig, MonsterType, Side, } from 'src/app/game/objects/interfaces';
import { wanderScript, tileStatusScript } from 'src/app/game/ai';
import { parse } from 'papaparse';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TeamConfigsService {

  // const path = 'https://www.dropbox.com/s/u88xk27egffpvr8/CodeSubmission.csv?dl=0';
  url = '/assets/matchSetup/CodeSubmission.csv';

  config1: ITeamConfig = {
    name: 'Mock Config 1',
    org: 'Mock Org 1',
    preferredMonsters: {
      [Side.Home]: MonsterType.Bobo,
      [Side.Away]: MonsterType.Triclops,
    },
    aiSrc: wanderScript,
  };

  config2: ITeamConfig = {
    name: 'Mock Config 2',
    org: 'Mock Org 2',
    preferredMonsters: {
      [Side.Home]: MonsterType.Goldy,
      [Side.Away]: MonsterType.Pinky,
    },
    aiSrc: tileStatusScript,
  };

  constructor() { }

  getTeamConfigs(): Observable<ITeamConfig[]> {
    let teamConfigs: ITeamConfig[] = [];

    teamConfigs.push(this.config1);
    teamConfigs.push(this.config2);

    parse(this.url, {
      header: true,
      download: true,
      error(error, file) {
        console.log('Error parsing file: ' + file);
        console.log(error);
      },
      complete(results) {
        console.log('Completed Parse:' + results);
        results.data.forEach(element => {
          let team: ITeamConfig = {
            name: element['Team Name'],
            preferredMonsters: {
              [Side.Home]: element['Home Monster Choice'].toLowerCase() as MonsterType,
              [Side.Away]: element['Away Monster Choice'].toLowerCase() as MonsterType,
            },
            aiSrc: element['URL/Code'],
            org: element['School']
          };
          teamConfigs.push(team);
        });
        console.log(teamConfigs);
        return of(teamConfigs);
      }
    });
    return of(teamConfigs);
  }
}

