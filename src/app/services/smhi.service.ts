import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, forkJoin } from 'rxjs';


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
}
