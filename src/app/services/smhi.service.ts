import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, forkJoin, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SmhiService {

  constructor(private http: HttpClient) { }
  getValidTime() {
    return this.http.get('https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/validtime.json');
  }

  getWindData() {
    //this.getValidTime().subscribe( (json) => {
    //format json 
    /*
    let a = "formattedJSON";
    forkJoin(this.http.get("speed"), this.http.get("j")).subscribe([data1,data2]) => {

    } 
 });
 */
  }


  getWindImg() {
    //return this.http.get('https://jsonplaceholder.typicode.com/albums');
    return 0;//this.getValidTime();
  }

  getDefaulShader() {
    let drawVert = this.http.get('./../assets/shaders/drawVert.txt', { responseType: 'text' });
    return drawVert;
  }
  getWindLayerData() {
    let drawVert = this.http.get('./../assets/shaders/drawVert.txt', { responseType: 'text' });
    let drawFrag = this.http.get('./../assets/shaders/drawFrag.txt', { responseType: 'text' });
    let updateVert = this.http.get('./../assets/shaders/updateVert.txt', { responseType: 'text' });
    let updateFrag = this.http.get('./../assets/shaders/updateFrag.txt', { responseType: 'text' });

    let coordTexturePath = './../assets/textures/acoordRandom.png';
    let windTexturePath = './../assets/textures/windtexture.png';

    return forkJoin([drawVert, drawFrag, updateVert, updateFrag, this.loadImage(coordTexturePath), this.loadImage(windTexturePath)]);
  }

  loadImage(path) {
    return Observable.create(observer => {
      var img = new Image();
      img.src = path;
      img.onload = () => {
        observer.next(img);
        observer.complete();
      }
      img.onerror = (error) => {
        observer.onError(error);
      }
    });
  }
}
