/* Birthday song: plays song.mp3 if present, otherwise a built-in Happy Birthday melody */
let playing=false,timers=[],ctx=null;
function melody(){
  if(!playing)return;
  ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
  if(ctx.state==='suspended')ctx.resume();
  const notes=[[261.6,300],[261.6,300],[293.7,600],[261.6,600],[349.2,600],[329.6,1100],[261.6,300],[261.6,300],[293.7,600],[261.6,600],[392,600],[349.2,1100],[261.6,300],[261.6,300],[523.3,600],[440,600],[349.2,600],[329.6,600],[293.7,1000],[466.2,300],[466.2,300],[440,600],[349.2,600],[392,600],[349.2,1200]];
  let t=0;
  notes.forEach(([f,d])=>{timers.push(setTimeout(()=>{if(!playing)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.12,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+d/1000);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+d/1000)},t));t+=d+60});
  timers.push(setTimeout(melody,t+400));
}
function stopMusic(){playing=false;timers.forEach(clearTimeout);timers=[];try{$('audio').pause()}catch(e){}$('vinyl').classList.remove('spin');$('mbtn').textContent='▶ Play song'}
function toggleMusic(){
  if(playing){stopMusic();return}
  playing=true;$('vinyl').classList.add('spin');$('mbtn').textContent='⏸ Pause';
  const p=$('audio').play();
  if(p&&p.catch)p.catch(()=>melody());else melody();
}

