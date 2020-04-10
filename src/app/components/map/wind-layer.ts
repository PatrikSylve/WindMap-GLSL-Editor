import { MercatorCoordinate } from 'mapbox-gl';

export class WindLayer {
    id: string; 
    type: string;
    vertexSource: any; 
    fragmentSource: any; 
    vertexShader: any;
    fragmentShader: any;
    program: any;
    aPos: any;
    berlin: any;
    helsinki: MercatorCoordinate;
    kyiv: MercatorCoordinate;
    buffer: any;
    update: boolean; 

    constructor() {
        this.id = 'custommap'; 
        this.type = 'custom'; 
        this.update = false; 
    }

    onAdd(map, gl) {
        this.vertexSource =  '' +
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
      }

      // method fired on each animation frame
      // https://docs.mapbox.com/mapbox-gl-js/api/#map.event:render
    render(gl:any, matrix) {
        if(this.update) {
            this.vertexSource =  '' +
            'uniform mat4 u_matrix;' +
            'attribute vec2 a_pos;' +
            'void main() {' +
            '    gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);' +
            '}';
    
    
        
            // create GLSL source for fragment shader
            this.fragmentSource =
              '' +
              'void main() {' +
              '    gl_FragColor = vec4(0.0, 1.0, 0.0, 0.5);' +
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
            this.update = false; 
        }
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

      updateProgram() {

      }
}
