import { Component, OnInit, ElementRef } from '@angular/core';
import { SmhiService } from 'src/app/services/smhi.service';
import { Map, LngLat, MercatorCoordinate } from 'mapbox-gl';
import { WindLayer } from './wind-layer';

declare var GlslEditor: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})


export class MapComponent {

  zoom: number;
  center: LngLat;
  windLayer: any;
  program: any;
  map: Map; 
  constructor(private smhiService: SmhiService) { }

  ngOnInit() {
    //this.windImage = this.smhiService.getWindImg(); 
    this.zoom = 3;
    this.center = new LngLat(18, 60);
    this.windLayer = new WindLayer();
  }

  update(){
    this.windLayer.update = true; 
    this.map.repaint = true;
  }
  
  loadMap(map) {
    this.map = map; 
    map.resize()
    map.addLayer(this.windLayer);
  }
}
