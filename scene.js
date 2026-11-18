/* 可修改设置：网页中的祝福文字也可直接输入。纯本地绘制，无外部依赖。 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else root.createChristmasScene=factory;})(typeof globalThis!=='undefined'?globalThis:this,function(canvas,makeCanvas){
'use strict';
const W=1080,H=1920,TAU=Math.PI*2;
canvas.width=W;canvas.height=H;const ctx=canvas.getContext('2d');
let seed=1225;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
const pts=[],snow=[],glyphs='.*+:x#@%o=|/AMWY';
const hues=[142,157,172,119,192,42,28,347,211,276,0,177];
function add(x,y,z,tone,ch,size=1,kind=0,id=0){pts.push({x,y,z,tone,ch:ch||glyphs[Math.floor(rand()*glyphs.length)],size,kind,id,phase:rand()*TAU});}
// Five overlapping whorls, each a real 3D surface, not a flat triangular mask.
for(let k=0;k<5;k++){
 const bottom=1.38+k*1.03,height=1.88-k*.055,radius=2.62-k*.46;
 for(let row=0;row<31;row++){
  const u=row/31,y=bottom+u*height,r=radius*Math.pow(1-u,.86);
  const n=Math.max(8,Math.round(153*r/2.62));
  for(let j=0;j<n;j++){
   const a=TAU*(j+rand()*.38)/n,rr=r*(.97+rand()*.055)*(1+.025*Math.sin(a*9+k));
   const tone=rand()<.7?k%3:Math.floor(rand()*5);
   add(Math.cos(a)*rr,y+(rand()-.5)*.028,Math.sin(a)*rr,tone,'x+*:.#AMY'[Math.floor(rand()*9)],.92,0,k);
  }
 }
}
// Luminous gold helix on the OUTSIDE of the layered canopy.
function surfaceRadius(y){let r=.02;for(let k=0;k<5;k++){let u=(y-(1.38+k*1.03))/(1.88-k*.055);if(u>=0&&u<=1)r=Math.max(r,(2.62-k*.46)*Math.pow(1-u,.86));}return r;}
for(let i=0;i<690;i++){
 const q=i/689,y=1.48+q*5.77,a=q*TAU*4.9,r=surfaceRadius(y)+.065;
 add(Math.cos(a)*r,y,Math.sin(a)*r,5,i%4===0?'@':i%2?'*':'+',1.05,1);
}
// Colored baubles are miniature spherical clouds of ASCII, not bitmap circles.
for(let i=0;i<34;i++){
 let y=1.65+rand()*5.03,a=rand()*TAU,r=surfaceRadius(y)+.07,tone=[7,8,9,5,11][i%5];
 for(let p=0;p<15;p++){const v=1-2*(p+.5)/15,ang=p*2.39996,rr=.075*Math.sqrt(1-v*v);add(Math.cos(a)*r+rr*Math.cos(ang),y+v*.075,Math.sin(a)*r+rr*Math.sin(ang),tone,p%3?'o':'@',1.12,2);}
}
// Visible cylindrical trunk and six tapering, branching roots.
for(let y=.34;y<1.58;y+=.057)for(let j=0;j<22;j++){let a=j*TAU/22;add(.20*Math.cos(a),y,.20*Math.sin(a),6,j%4?'|':'#',1.1,3);}
for(let k=0;k<7;k++)for(let j=0;j<24;j++){
 const q=j/23,a=k*TAU/7+.15*Math.sin(q*3),r=.16+q*.94;
 for(let b=-1;b<=1;b++)add(Math.cos(a)*r+b*.034,.35*(1-q)+.10,Math.sin(a)*r,6,j%3?'=':'#',1.03,3);
 if(j>12&&j%2===0)add(Math.cos(a+.25)*r,.13,Math.sin(a+.25)*r,6,'/',.9,3);
}
// Extruded five-point star: front/back filled faces, perimeter and side-wall glyphs.
const star=[];for(let k=0;k<10;k++){let a=-Math.PI/2+k*Math.PI/5,r=k%2?.24:.57;star.push([Math.cos(a)*r,-Math.sin(a)*r]);}
function inside(x,y){let hit=false;for(let i=0,j=9;i<10;j=i++){const a=star[i],b=star[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
for(let x=-.56;x<=.56;x+=.083)for(let y=-.51;y<=.58;y+=.083)if(inside(x,y))for(const z of [-.14,.14])add(x,7.66+y,z,5,'*+'[Math.floor(rand()*2)],1.02,4);
for(let k=0;k<10;k++){const a=star[k],b=star[(k+1)%10];for(let q=0;q<=1;q+=.08)for(let z=-.14;z<=.15;z+=.07)add(a[0]+(b[0]-a[0])*q,7.66+a[1]+(b[1]-a[1])*q,z,5,'#',1.16,4);}
// Six volumetric gift boxes. Separate faces, lids, crossed gold ribbon and ASCII bows.
const gifts=[[-2.23,.42,1.45,.72,.74,.65,7],[-1.15,.33,2.12,.55,.56,.58,8],[.15,.28,2.36,.55,.46,.53,5],[1.38,.42,1.94,.79,.75,.69,9],[2.45,.32,.89,.57,.55,.57,11],[-2.28,.29,-.78,.55,.52,.55,7]];
gifts.forEach((g,id)=>{
 const [gx,gy,gz,bw,bh,bd,tone]=g,ang=.22+id*.31;
 function giftPoint(x,y,z,c,ch,kind=5){const xx=x*Math.cos(ang)+z*Math.sin(ang),zz=-x*Math.sin(ang)+z*Math.cos(ang);add(gx+xx,gy+y,gz+zz,c,ch,.94,kind,id);}
 for(let x=-bw/2;x<=bw/2+.001;x+=.062)for(let y=-bh/2;y<=bh/2+.001;y+=.065)for(let face of [-1,1])giftPoint(x,y,face*bd/2,Math.abs(x)<.075?5:tone,Math.abs(x)<.075?'#':'+',Math.abs(x)<.075?6:5);
 for(let z=-bd/2;z<=bd/2+.001;z+=.062)for(let y=-bh/2;y<=bh/2+.001;y+=.065)for(let face of [-1,1])giftPoint(face*bw/2,y,z,Math.abs(z)<.075?5:tone,Math.abs(z)<.075?'#':'x',Math.abs(z)<.075?6:5);
 for(let x=-bw/2;x<=bw/2+.001;x+=.06)for(let z=-bd/2;z<=bd/2+.001;z+=.06)giftPoint(x,bh/2+.025,z,Math.abs(x)<.065||Math.abs(z)<.065?5:tone,Math.abs(x)<.065||Math.abs(z)<.065?'#':'=',6);
 for(let a=0;a<TAU;a+=.15)for(let side of [-1,1])giftPoint(side*(.12+.13*Math.cos(a)),bh/2+.1+.09*Math.sin(a),.08*Math.sin(a),5,'*',6);
});
for(let i=0;i<240;i++)snow.push({x:rand()*W,y:rand()*H,speed:22+rand()*72,size:8+rand()*14,phase:rand()*TAU,ch:i%4?'.':'*'});
// Pre-render glowing ASCII glyph sprites once; both video and website use this same renderer.
const cell=40,cols=glyphs.length,levels=6,atlas=makeCanvas(cols*cell,hues.length*levels*cell),ac=atlas.getContext('2d');
ac.font='bold 15px Consolas, monospace';ac.textAlign='center';ac.textBaseline='middle';
for(let h=0;h<hues.length;h++)for(let l=0;l<levels;l++)for(let c=0;c<cols;c++){
 const x=c*cell+cell/2,y=(h*levels+l)*cell+cell/2,light=24+l*11,sat=h===5?96:h===6?65:77;
 ac.fillStyle='hsl('+hues[h]+' '+sat+'% '+light+'%)';ac.shadowColor=ac.fillStyle;ac.shadowBlur=h===5?4.5:2.2;ac.fillText(glyphs[c],x,y);ac.shadowBlur=0;ac.fillText(glyphs[c],x,y);
}
const spriteSource=makeCanvas.freeze?makeCanvas.freeze(atlas):atlas;
function glyph(ch,x,y,tone,level,size=1,alpha=1){let idx=glyphs.indexOf(ch);if(idx<0)idx=0;ctx.globalAlpha=alpha;const ss=cell*size;ctx.drawImage(spriteSource,idx*cell,(tone*levels+Math.max(0,Math.min(5,level)))*cell,cell,cell,x-ss/2,y-ss/2,ss,ss);}
function text(str,x,y,size,color,font='Consolas, monospace'){ctx.globalAlpha=1;ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=size+'px '+font;ctx.fillText(str,x,y);}
function tracked(str,y,size,spacing,color){ctx.font=size+'px Consolas, monospace';ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';let span=(str.length-1)*spacing;[...str].forEach((s,i)=>ctx.fillText(s,W/2-span/2+i*spacing,y));}
function draw(t,options={}){
 const angle=(options.angle===undefined?t*TAU/20:options.angle),ca=Math.cos(angle),sa=Math.sin(angle);
 ctx.globalAlpha=1;ctx.fillStyle='#040910';ctx.fillRect(0,0,W,H);
 let bg=ctx.createRadialGradient(540,965,20,540,965,790);bg.addColorStop(0,'#07211f');bg.addColorStop(.68,'#071219');bg.addColorStop(1,'#040910');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 // Snow remains ASCII as well.
 for(const s of snow){let sy=(s.y+t*s.speed)%H,sx=(s.x+Math.sin(t*.4+s.phase)*22+W)%W;glyph(s.ch,sx,sy,8,4,s.size/15,.22+.24*Math.sin(s.phase)**2);}
 ctx.globalAlpha=.65;tracked('A LITTLE MAGIC, JUST FOR YOU',110,17,21,'#90aaa9');ctx.globalAlpha=1;
 text('Merry Christmas',540,194,59,'#f6e3af','Georgia, serif');
 tracked('A S C I I   /   2 0 2 6',263,16,17,'#7da69b');
 // Ground is dotted ASCII, with a readable spread of tree roots above it.
 for(let ring=0;ring<8;ring++)for(let j=0;j<60;j++){let a=j*TAU/60,r=.5+ring*.42;glyph('.',540+Math.cos(a)*r*133,1480+Math.sin(a)*r*24,5,1,.75,.12);}
 const projected=[];
 for(const p of pts){
  let x=p.x,y=p.y,z=p.z;
  if(p.kind===4){const a=angle*.55+.16,sx=x*Math.cos(a)+z*Math.sin(a),sz=-x*Math.sin(a)+z*Math.cos(a);x=sx;z=sz;}
  else {const sx=x*ca+z*sa,sz=-x*sa+z*ca;x=sx;z=sz;}
  const perspective=10/(10-z*.43),px=540+x*127*perspective,py=1490-y*137*perspective+z*25*perspective;
  const front=(z+2.9)/5.8,twinkle=.5+.5*Math.sin(t*2.1+p.phase),gold=p.tone===5;
  let level=Math.round(1.2+front*2.3+(gold?1.1:0));if(p.kind===3)level=3+Math.round(front);
  if(gold&&twinkle>.86)level=5;
  projected.push({p,z,px,py,level,perspective,front,twinkle});
 }
 projected.sort((a,b)=>a.z-b.z);
 for(const a of projected){const p=a.p;let alpha=.52+.46*Math.max(0,a.front);if(p.kind===4||p.kind===6)alpha=.86+.14*a.twinkle;glyph(p.ch,a.px,a.py,p.tone,a.level,p.size*a.perspective,alpha);}
 // Rare gold sparkle glyphs on the spiral and thick star, with no non-ASCII geometry.
 for(let i=0;i<projected.length;i+=7){const a=projected[i];if(a.p.tone===5&&a.twinkle>.985&&a.z>-.5)glyph('+',a.px,a.py,5,5,1.65,.86);}
 ctx.globalAlpha=1;
 tracked('M A Y  Y O U R  D A Y S  B E  B R I G H T',1645,17,21,'#c8b889');
 text(options.message||'愿每一份期待，都闪闪发光',540,1726,36,'#f3e5c4','Microsoft YaHei, sans-serif');
 text(options.dedication||'今年的圣诞，也想和你一起过。',540,1790,24,'#9dbbb2','Microsoft YaHei, sans-serif');
 tracked('*  M E R R Y  C H R I S T M A S  *',1863,15,17,'#839d94');
 ctx.globalAlpha=1;
 return {points:pts.length,time:t,angle};
}
return {draw,width:W,height:H,pointCount:pts.length};
});
