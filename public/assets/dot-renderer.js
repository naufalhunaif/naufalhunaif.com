// Native GPU points: the fragment shader makes each point a round, antialiased dot.
// A Canvas 2D path fallback supports devices where WebGL is unavailable.
(() => {
  const states=new WeakMap();
  function create(canvas){
    let gl=null;
    try {gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,preserveDrawingBuffer:false});} catch {}
    if(!gl)return {ctx:canvas.getContext('2d',{alpha:false})};
    const compile=(type,source)=>{
      const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader));
      return shader;
    };
    const program=gl.createProgram();
    gl.attachShader(program,compile(gl.VERTEX_SHADER,`
      attribute vec4 point;
      uniform vec2 resolution;
      uniform float density;
      varying float opacity;
      varying float diameter;
      void main(){
        gl_Position=vec4((point.xy/resolution*2.0-1.0)*vec2(1.0,-1.0),0.0,1.0);
        diameter=max(1.0,point.z*2.0*density);
        gl_PointSize=diameter;
        opacity=point.w;
      }
    `));
    gl.attachShader(program,compile(gl.FRAGMENT_SHADER,`
      precision mediump float;
      varying float opacity;
      varying float diameter;
      void main(){
        float distance=length(gl_PointCoord-vec2(0.5))*2.0;
        float edge=1.0-smoothstep(1.0-2.0/diameter,1.0,distance);
        gl_FragColor=vec4(vec3(1.0),opacity*edge);
      }
    `));
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
    const state={gl,program,buffer:gl.createBuffer(),point:gl.getAttribLocation(program,'point'),resolution:gl.getUniformLocation(program,'resolution'),density:gl.getUniformLocation(program,'density')};
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();});
    canvas.addEventListener('webglcontextrestored',()=>{states.delete(canvas);window.dispatchEvent(new Event('resize'));});
    return state;
  }
  window.drawNativeDots=(canvas,width,height,density,dots)=>{
    if(!states.has(canvas))states.set(canvas,create(canvas));
    const s=states.get(canvas);
    const pixelWidth=Math.round(width*density),pixelHeight=Math.round(height*density);
    if(canvas.width!==pixelWidth||canvas.height!==pixelHeight){canvas.width=pixelWidth;canvas.height=pixelHeight;}
    if(s.gl){
      const gl=s.gl;if(gl.isContextLost())return;
      gl.viewport(0,0,pixelWidth,pixelHeight);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(s.program);gl.bindBuffer(gl.ARRAY_BUFFER,s.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(dots),gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(s.point);gl.vertexAttribPointer(s.point,4,gl.FLOAT,false,0,0);
      gl.uniform2f(s.resolution,width,height);gl.uniform1f(s.density,density);
      gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.POINTS,0,dots.length/4);
      return;
    }
    const ctx=s.ctx;ctx.setTransform(density,0,0,density,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,width,height);
    const bands=Array.from({length:8},()=>[]);
    for(let i=0;i<dots.length;i+=4)bands[Math.min(7,Math.floor(dots[i+3]*8))].push(i);
    for(let band=0;band<8;band++){
      ctx.fillStyle=`rgba(255,255,255,${(band+.5)/8})`;const group=bands[band];
      for(let offset=0;offset<group.length;offset+=192){
        ctx.beginPath();
        for(let j=offset;j<Math.min(offset+192,group.length);j++){
          const i=group[j],x=dots[i],y=dots[i+1],radius=dots[i+2];ctx.moveTo(x+radius,y);ctx.arc(x,y,radius,0,Math.PI*2);
        }
        ctx.fill();
      }
    }
  };
})();
