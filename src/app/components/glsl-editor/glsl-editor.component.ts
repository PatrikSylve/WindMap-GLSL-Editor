import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  somemodel:any = "hejs";

  content: string;
  options: any = {
    lineNumbers: true,
    theme: 'monokai',
    mode: 'text/x-c'
  }

  constructor(private smhiService: SmhiService) {
  }

  ngOnInit() {
    this.smhiService.getDefaultShader().subscribe((data) => {
      this.content = data;
      this.editor.writeValue(this.content);
      
 
    });
  }
  ngAfterViewInit(){
  }
 

}
