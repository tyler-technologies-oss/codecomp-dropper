import { Injectable } from '@angular/core';
import { Grid } from 'matter';
import * as mapsJSON from '../../assets/maps/maps.json'
import { GridMap } from '../game/objects/interfaces';

@Injectable({
    providedIn: 'root'
})

export class MapConfigsService {
    private maps: GridMap[] = [];
    public currentMap: GridMap;

    public parseMaps() {
        if (this.maps.length > 0) {
            return;
        }
        mapsJSON.maps.forEach(map => {
            this.maps.push(map);
        });
        if (this.maps.length > 0) {
            this.currentMap = this.maps[0];
        }
    }

    public getMaps() {
        return this.maps;
    }

    public setCurrentMapByName(name: string){
        let map = this.maps.find(map => map.name === name);
        if(map){
            this.currentMap = map;
        }else{
            console.error("No map found with name " + name + " falling back to default map.");
            this.currentMap = this.maps[0];
        }
    }
}