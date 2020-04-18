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

  loadedTextures;
  shaderSource;
  shader; 
  constructor(private smhiService: SmhiService) { }

  ngOnInit() {
    this.zoom = 3;
    this.center = new LngLat(18, 60);

    this.smhiService.getWindLayerData().subscribe((res) => {
      this.shaderSource = [res[0], res[1], res[2], res[3]];
      this.loadedTextures = [res[4], res[5], res[5]];
      this.shader = res[0];
    });
  }

  update() {
    //this.windLayer.update = true;
    //this.map.repaint = true;
  }


  loadMap(map) {
    this.map = map;
    map.resize()

    this.windLayer = new WindLayer(this.shaderSource, this.loadedTextures);
    map.addLayer(this.windLayer);
  }

}
