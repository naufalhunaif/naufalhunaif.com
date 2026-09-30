// Software 3D surface projection. Only the resulting scalar light field is sampled
// by the native circle renderer. There are no textures, photographs or image files.
(() => {
  const cache = new Map();
  function decode(text, Type) {
    const binary = atob(text), bytes = new Uint8Array(binary.length);
    for (let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
    return new Type(bytes.buffer);
  }
  function model(name) {
    if (!cache.has(name)) {
      const source=window.DOT_MODELS[name];
      cache.set(name, {
        count:source.count,
        indices:decode(source.indices,Uint16Array),
        positions:source.positions.map(s=>decode(s,Int16Array)),
        normals:source.normals.map(s=>decode(s,Int8Array))
      });
    }
    return cache.get(name);
  }
  window.drawAnatomy = (ink, size, name, phase=0) => {
    const m=model(name), frames=m.positions.length;
    const frame=((phase%frames)+frames)%frames, a=Math.floor(frame), b=(a+1)%frames, blend=frame-a;
    const p=m.positions[a], q=m.positions[b], n=m.normals[a], o=m.normals[b];
    const yaw=({horse:1.37,human:-.32,bird:.85,mountains:-.16,flower:.28,tree:.32})[name]??.12;
    const pitch=({horse:-.10,human:.02,bird:.15,flower:.67,mountains:.43,tree:.04})[name]??-.015;
    const cy=Math.cos(yaw),sy=Math.sin(yaw),cx=Math.cos(pitch),sx=Math.sin(pitch);
    const scale=({horse:.435,human:.454,bird:.46,flower:.37,mountains:.46,tree:.46})[name]??.50;
    const vertices=new Float32Array(m.count*6);
    for(let i=0;i<m.count;i++) {
      const j=i*3,k=i*6;
      let x=(p[j]+(q[j]-p[j])*blend)/30000;
      let y=(p[j+1]+(q[j+1]-p[j+1])*blend)/30000;
      let z=(p[j+2]+(q[j+2]-p[j+2])*blend)/30000;
      let nx=(n[j]+(o[j]-n[j])*blend)/127,ny=(n[j+1]+(o[j+1]-n[j+1])*blend)/127,nz=(n[j+2]+(o[j+2]-n[j+2])*blend)/127;
      const rx=x*cy+z*sy,rz=z*cy-x*sy;
      const ry=y*cx-rz*sx,rzz=rz*cx+y*sx;
      const rnx=nx*cy+nz*sy,rnz=nz*cy-nx*sy;
      const rny=ny*cx-rnz*sx,rnzz=rnz*cx+ny*sx;
      vertices[k]=size*(.5+rx*scale);vertices[k+1]=size*(.49-ry*scale);vertices[k+2]=rzz;
      vertices[k+3]=rnx;vertices[k+4]=rny;vertices[k+5]=rnzz;
    }
    const depth=new Float32Array(size*size);depth.fill(-Infinity);
    const light=new Float32Array(size*size);
    for(let i=0;i<m.indices.length;i+=3) {
      const a=m.indices[i]*6,b=m.indices[i+1]*6,c=m.indices[i+2]*6;
      const ax=vertices[a],ay=vertices[a+1],bx=vertices[b],by=vertices[b+1],cx=vertices[c],cy=vertices[c+1];
      const denom=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy);
      if(Math.abs(denom)<.001)continue;
      const minX=Math.max(0,Math.floor(Math.min(ax,bx,cx))),maxX=Math.min(size-1,Math.ceil(Math.max(ax,bx,cx)));
      const minY=Math.max(0,Math.floor(Math.min(ay,by,cy))),maxY=Math.min(size-1,Math.ceil(Math.max(ay,by,cy)));
      for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++) {
        const u=((by-cy)*(x+.5-cx)+(cx-bx)*(y+.5-cy))/denom;
        const v=((cy-ay)*(x+.5-cx)+(ax-cx)*(y+.5-cy))/denom,w=1-u-v;
        if(u<-.001||v<-.001||w<-.001)continue;
        const z=u*vertices[a+2]+v*vertices[b+2]+w*vertices[c+2],pixel=y*size+x;
        if(z<=depth[pixel])continue;
        depth[pixel]=z;
        let nx=u*vertices[a+3]+v*vertices[b+3]+w*vertices[c+3];
        let ny=u*vertices[a+4]+v*vertices[b+4]+w*vertices[c+4];
        let nz=u*vertices[a+5]+v*vertices[b+5]+w*vertices[c+5];
        const length=Math.hypot(nx,ny,nz)||1;nx/=length;ny/=length;nz/=length;
        if(nz<0){nx=-nx;ny=-ny;nz=-nz;}
        const key=Math.max(0,-nx*.48+ny*.57+nz*.66);
        const fill=Math.max(0,nx*.79-ny*.1+nz*.46);
        light[pixel]=.025+.91*key+.10*fill;
      }
    }
    const image=ink.createImageData(size,size),data=image.data;
    for(let y=0;y<size;y++)for(let x=0;x<size;x++) {
      const p=y*size+x,z=depth[p];
      let value=light[p];
      if(z!==-Infinity) {
        // Small local depth comparisons bring out eyelids, nostrils and folds.
        let occlusion=0;
        for(const [dx,dy] of [[-4,-4],[4,-4],[-8,0],[8,0]]) {
          const xx=x+dx,yy=y+dy;
          if(xx>=0&&xx<size&&yy>=0&&yy<size){const dz=depth[yy*size+xx]-z;if(dz>.018&&dz<.18)occlusion+=.13;}
        }
        value*=1-occlusion;
        value=Math.pow(Math.max(0,value),1.2);
      }
      const v=Math.min(255,Math.round(value*255));
      data[p*4]=data[p*4+1]=data[p*4+2]=v;data[p*4+3]=255;
    }
    ink.putImageData(image,0,0);
  };
})();
