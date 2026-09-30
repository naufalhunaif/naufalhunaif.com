"""Original procedural meshes for botanical and geological dot scenes."""
import numpy as np

def grid(vertices,rows,cols):
    faces=[]
    for i in range(rows-1):
        for j in range(cols-1):
            a=i*cols+j;faces.extend([[a,a+cols,a+1],[a+1,a+cols,a+cols+1]])
    return np.array(vertices),np.array(faces),[]

def flower():
    vertices=[];faces=[]
    def add(v,f):
        offset=len(vertices);vertices.extend(v);faces.extend(np.array(f)+offset)
    rng=np.random.default_rng(19)
    for petal in range(36):
        phi=petal*2*np.pi/36
        length=.36+rng.random()*.08
        v=[]
        for i in range(17):
            t=i/16
            for j in range(9):
                u=(j/8-.5)*2
                radial=.18+length*t
                width=.054*np.sin(np.pi*t)**.65
                y=.38+.10*np.sin(t*np.pi)-.06*t*t+.035*u*u*np.sin(np.pi*t)
                y+=.004*np.sin(u*20)*t
                v.append([radial*np.cos(phi)-u*width*np.sin(phi),y,radial*np.sin(phi)+u*width*np.cos(phi)])
        vv,ff,_=grid(v,17,9);add(vv,ff)
    # Domed seed head; its tiny height changes produce natural surface shading.
    v=[]
    for i in range(26):
        theta=i/25*np.pi
        for j in range(65):
            phi=j/64*2*np.pi
            r=.215*np.sin(theta)
            ripple=.005*np.sin(phi*24+theta*39)*np.sin(theta*31)
            v.append([r*np.cos(phi),.38+.07*np.cos(theta)+ripple,r*np.sin(phi)])
    vv,ff,_=grid(v,26,65);add(vv,ff)
    # A naturally bowed stem and two tapered leaves.
    v=[]
    for i in range(24):
        t=i/23;y=-1.03+t*1.48
        for j in range(9):
            a=j/8*2*np.pi;v.append([.038*np.sin(t*3)+.018*np.cos(a),y,.018*np.sin(a)])
    vv,ff,_=grid(v,24,9);add(vv,ff)
    for sign,base in [(-1,-.45),(1,-.12)]:
        v=[]
        for i in range(19):
            t=i/18
            for j in range(9):
                u=(j/8-.5)*2
                v.append([sign*t*.61,base+.30*np.sin(t*1.8)+.09*u*u*np.sin(np.pi*t),u*.15*np.sin(np.pi*t)])
        vv,ff,_=grid(v,19,9);add(vv,ff)
    return np.array(vertices),np.array(faces),[]

def mountains():
    n=110;x,z=np.meshgrid(np.linspace(-1.4,1.4,n),np.linspace(-.8,1.1,n))
    h=.78*np.exp(-((x+.55)**2/.19+(z+.18)**2/.16))+.99*np.exp(-((x-.28)**2/.12+(z+.28)**2/.22))+.63*np.exp(-((x-.90)**2/.1+(z-.1)**2/.24))
    for f,amp in [(8,.12),(17,.055),(39,.024),(85,.013)]:
        h+=amp*np.sin(x*f+np.sin(z*f*.7))*np.cos(z*f*.87+x*2)
    h=np.maximum(.01,h)*(1-.16*z)
    return grid(np.stack([x,h-.32,z],axis=-1).reshape(-1,3),n,n)

def tree():
    rng=np.random.default_rng(231);verts=[];faces=[]
    def unit(v): return v/max(1e-8,np.linalg.norm(v))
    def branch(origin,direction,length,radius,depth,root=False):
        d=unit(direction);p=origin.copy();points=[]
        for i in range(5):
            points.append(p.copy());d=unit(d+rng.normal(0,.09,3));p=p+d*length/4
        offset=len(verts)
        for i,p in enumerate(points):
            tangent=unit(points[min(i+1,4)]-points[max(i-1,0)])
            side=unit(np.cross(tangent,[0,0,1]));other=np.cross(tangent,side)
            r=radius*(1-i*.10)
            for j in range(7):
                angle=j/6*2*np.pi;verts.append(p+r*(side*np.cos(angle)+other*np.sin(angle)))
        for i in range(4):
            for j in range(6):
                a=offset+i*7+j;faces.extend([[a,a+7,a+1],[a+1,a+7,a+8]])
        if depth<=0:return
        for k in range(2):
            random=rng.normal(0,1,3);random[1]=(-.30 if root else .4)+abs(random[1])*(0 if root else .2)
            child=unit(d*.8+unit(random)*(.75 if root else .67))
            branch(points[-1],child,length*rng.uniform(.64,.78),radius*.64,depth-1,root)
    branch(np.array([0.,-.29,0.]),np.array([.06,1.,0.]),.30,.065,8)
    for i in range(6):
        a=i/6*2*np.pi
        branch(np.array([0.,-.29,0.]),np.array([np.cos(a)*.8,-.6,np.sin(a)*.8]),.20,.038,6,True)
    return np.array(verts),np.array(faces),[]
