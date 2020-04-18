import { Component, OnInit, ViewChild, ElementRef, Input, Output } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import * as codeMirror from 'codemirror'; 
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { SmhiService } from 'src/app/services/smhi.service';

@Component({
  selector: 'app-glsl-editor',
  templateUrl: './glsl-editor.component.html',
  styleUrls: ['./glsl-editor.component.css']
})

export class GlslEditorComponent implements OnInit {
  @ViewChild('editor') editor: CodemirrorComponent;

  content: string;
  options: any = {
    lineNumbers: true,
    theme: 'monokai',
    mode: 'text/x-c',
    name: "hejsan"
  }



  constructor(private smhiService: SmhiService) {
    smhiService.getDefaulShader().subscribe( shader => {
      this.content = shader; 
      this.setDefault();
    }); 
  }

  ngOnInit() {
        
  }
  ngAfterViewInit(){
    
  }

  setDefault() {
    this.editor.writeValue(this.content);
  }
 
  updateShaderProgram() {
    //this.testP.emit()
    if (this.content !== this.editor.value){
          console.log("hej");
    }
  }

}
