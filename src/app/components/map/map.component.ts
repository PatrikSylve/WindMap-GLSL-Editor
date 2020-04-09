import { Component, OnInit, ElementRef } from '@angular/core';
import { SmhiService } from 'src/app/services/smhi.service';
import { Map, LngLat, MercatorCoordinate } from 'mapbox-gl';

declare var GlslEditor: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})


export class MapComponent {

  zoom: number;
  center: LngLat;
  highlightLayer: any;
  program: any
  constructor(private smhiService: SmhiService) { }

  ngOnInit() {
    //this.windImage = this.smhiService.getWindImg(); 
    this.zoom = 3;
    this.center = new LngLat(18, 60);
    this.highlightLayer = {
      id: 'highlight',
      type: 'custom',

      // method called when the layer is added to the map
      // https://docs.mapbox.com/mapbox-gl-js/api/#styleimageinterface#onadd
      onAdd: function (map, gl) {
        // create GLSL source for vertex shader
        this.vertexSource =
          '' +
          'uniform mat4 u_matrix;' +
          'attribute vec2 a_pos;' +
          'void main() {' +
          '    gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);' +
          '}';

        // create GLSL source for fragment shader
        this.fragmentSource =
          '' +
          'void main() {' +
          '    gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);' +
          '}';

        // create a vertex shader
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this.vertexShader, this.vertexSource);
        gl.compileShader(this.vertexShader);

        // create a fragment shader
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.fragmentShader, this.fragmentSource);
        gl.compileShader(this.fragmentShader);

        // link the two shaders into a WebGL program
        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);

        this.aPos = gl.getAttribLocation(this.program, 'a_pos');

        // define vertices of the triangle to be rendered in the custom style layer
        this.helsinki = MercatorCoordinate.fromLngLat({
          lng: 25.004,
          lat: 60.239
        });
        this.berlin = MercatorCoordinate.fromLngLat({
          lng: 13.403,
          lat: 52.562
        });
        this.kyiv = MercatorCoordinate.fromLngLat({
          lng: 30.498,
          lat: 50.541
        });

        // create and initialize a WebGLBuffer to store vertex and color data
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([
            this.helsinki.x,
            this.helsinki.y,
            this.berlin.x,
            this.berlin.y,
            this.kyiv.x,
            this.kyiv.y
          ]),
          gl.STATIC_DRAW
        );
      },

      // method fired on each animation frame
      // https://docs.mapbox.com/mapbox-gl-js/api/#map.event:render
      render: function (gl, matrix) {
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(
          gl.getUniformLocation(this.program, 'u_matrix'),
          false,
          matrix
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.enableVertexAttribArray(this.aPos);
        gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
      }
    };
  }

  loadMap(map) {
    map.resize()
    map.addLayer(this.highlightLayer);
  }
}
