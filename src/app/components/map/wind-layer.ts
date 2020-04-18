import { MercatorCoordinate } from 'mapbox-gl';
import * as f from 'src/assets/js/functions.js';

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

  drawVert: string;
  drawFrag: string;
  updateVert: string;
  updateFrag: string;

  programUpdate: any;
  updateBuffer: any;
  frameBuffer: any;

  textures: any[];
  stateTexture: any;

  particleRes = 512;
  updateParticleNbr = 0;
  map: any;
  gl: any;
  particleNbr: number = this.particleRes * this.particleRes;
  particleSize: number = 1.0;
  particleSpeed: number = 0.0001;
  dropFreq: number = 0.001;
  xmin: number = -19.38;
  xmax: number = 25.56;
  ymin: number = -21.19;
  ymax: number = 22.77;

  constructor(vertexSource, textures) {
    this.id = 'custommap';
    this.type = 'custom';
    this.update = false;
    this.drawVert = vertexSource[0];
    this.drawFrag = vertexSource[1];
    this.updateVert = vertexSource[2];
    this.updateFrag = vertexSource[3];
    this.textures = textures;
    this.textures.push(this.textures[1]);
  }


  onAdd(map, gl) {

    // create shader programs
    this.program = f.initShaders(gl, this.drawVert, this.drawFrag);
    this.programUpdate = f.initShaders(gl, this.updateVert, this.updateFrag);


    /*
    Frame used when updating particles 
    */
    this.updateBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.updateBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);

    this.textures = f.genTexture(gl, this.textures);
    this.stateTexture = this.textures[2];
    this.frameBuffer = gl.createFramebuffer();
    this.setParticles(gl, this.particleRes);
    this.map = map;
  }
  render(gl, matrix) {

    /*
      Update shader program when changes are applied
    */


    if (this.updateParticleNbr) {
      this.setParticles(gl, this.particleRes);
      this.updateParticleNbr = 0;
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);

    // render to screen
    this.renderScreen(gl, matrix);

    // render to texture 
    this.updateTexture(gl, matrix);

    this.map.triggerRepaint();
    this.gl = gl;

  }

  renderScreen(gl, matrix) {
    // render to screen
    this.updateProgram(gl);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(this.program);
    var u_image0Location = gl.getUniformLocation(this.program, "u_particles");
    var u_image1Location = gl.getUniformLocation(this.program, "u_wind");
    var u_particle_size = gl.getUniformLocation(this.program, "u_particle_size");
    var u_wind_min = gl.getUniformLocation(this.program, "u_wind_min");
    var u_wind_max = gl.getUniformLocation(this.program, "u_wind_max");
    var u_particles_res = gl.getUniformLocation(this.program, "u_particles_res");

    var a_index = gl.getAttribLocation(this.program, "a_index");

    gl.uniform1i(u_image0Location, 0);
    gl.uniform1i(u_image1Location, 1);
    gl.uniform1f(u_particle_size, this.particleSize);
    gl.uniform2f(u_wind_min, this.xmin, this.ymin);
    gl.uniform2f(u_wind_max, this.xmax, this.ymax);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(a_index);
    gl.vertexAttribPointer(a_index, 1, gl.FLOAT, false, 0, 0);
    gl.uniform1f(u_particles_res, this.particleRes);

    gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "u_matrix"), false, matrix);
    gl.drawArrays(gl.POINTS, 0, this.particleNbr); // nbr of points
    gl.disable(gl.BLEND);

  }

  updateTexture(gl, matrix) {

    f.bindFramebuffer(gl, this.frameBuffer, this.stateTexture);

    // set viewport to math nbr particles
    gl.viewport(0, 0, this.particleRes, this.particleRes);

    gl.useProgram(this.programUpdate);
    var u_image0Location = gl.getUniformLocation(this.programUpdate, "u_particles");
    var u_image1Location = gl.getUniformLocation(this.programUpdate, "u_wind");
    var u_wind_res = gl.getUniformLocation(this.programUpdate, "u_wind_res");
    var u_wind_min = gl.getUniformLocation(this.programUpdate, "u_wind_min");
    var u_wind_max = gl.getUniformLocation(this.programUpdate, "u_wind_max");
    var u_random = gl.getUniformLocation(this.programUpdate, "u_random");
    var u_speed = gl.getUniformLocation(this.programUpdate, "u_speed");
    var u_drop_frequency = gl.getUniformLocation(this.programUpdate, "u_drop_frequency");


    gl.uniform1i(u_image0Location, 0);
    gl.uniform1i(u_image1Location, 1);

    //wind texture res
    //gl.uniform2f(u_wind_res, 180,271);
    gl.uniform2f(u_wind_res, 612, 752);

    gl.uniform2f(u_wind_min, this.xmin, this.ymin);
    gl.uniform2f(u_wind_max, this.xmax, this.ymax);
    gl.uniform2f(u_random, Math.random(), Math.random());
    gl.uniform1f(u_speed, this.particleSpeed);
    gl.uniform1f(u_drop_frequency, this.dropFreq);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.updateBuffer);
    var a_quad_pos = gl.getAttribLocation(this.programUpdate, "a_pos");
    gl.enableVertexAttribArray(a_quad_pos);
    gl.vertexAttribPointer(a_quad_pos, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // swap textures
    var tmp = this.stateTexture;
    this.stateTexture = this.textures[0];
    this.textures[0] = tmp;
    this.gl = gl;

  }
  // when editor changes
  updateProgram(gl) {

    if (this.update) {
      this.vertexSource = '' +
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
  }

  setParticles(gl: any, nbr: number) {
    this.particleRes = nbr;
    this.particleNbr = nbr * nbr //particleRes * particleRes;
    const particleState = new Uint8Array(this.particleNbr * 4);

    for (let i = 0; i < particleState.length; i++) {
      particleState[i] = Math.floor(Math.random() * 256); // randomize the initial particle positions
    }

    this.textures[0] = f.createTexture(gl, gl.NEAREST, particleState, this.particleRes, this.particleRes);
    this.stateTexture = f.createTexture(gl, gl.NEAREST, particleState, this.particleRes, this.particleRes);

    const particleIndices = new Float32Array(this.particleNbr);
    for (let i = 0; i < this.particleNbr; i++) {
      particleIndices[i] = i;
    }
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, particleIndices, gl.STATIC_DRAW);
    this.gl = gl;
  }
}
