(() => {
 'use strict';
 const $=id=>document.getElementById(id), key='cat-steps-v1';
 let state={day:0,completed:[],notes:{}}, timerId=null,endTime=0,remaining=120,saveTimer=null;
 try { const saved=JSON.parse(localStorage.getItem(key)); if(saved&&Number.isInteger(saved.day)&&saved.day>=0&&saved.day<30){state.day=saved.day;state.completed=Array.isArray(saved.completed)?[...new Set(saved.completed.filter(n=>Number.isInteger(n)&&n>=0&&n<30))]:[];state.notes=saved.notes&&typeof saved.notes==='object'&&!Array.isArray(saved.notes)?saved.notes:{};} } catch { $('save-status').textContent='Progress storage is unavailable. You can still use every lesson.'; }
 function save(){try{localStorage.setItem(key,JSON.stringify(state));$('save-status').textContent='Saved in this browser.';}catch{$('save-status').textContent='This browser cannot save progress. Keep a separate note.';}}
 function show(view){document.querySelectorAll('.view').forEach(e=>e.hidden=e.id!==view);document.querySelectorAll('nav button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));}
 function displayTime(){ $('timer').textContent=`${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`; }
 function resetTimer(){clearInterval(timerId);timerId=null;remaining=120;$('timer-start').textContent='Start 2-minute timer';$('timer-status').textContent='';displayTime();}
 function render(){
  const d=CAT_DAYS[state.day],s=CAT_SKILLS[d.skill];
  $('day-select').value=state.day;$('phase').textContent=s.phase;$('lesson-title').textContent=`Day ${d.number}: ${d.title}`;$('goal').textContent=s.goal;$('focus').textContent=d.focus;$('duration').textContent='1–3 minutes · 3–5 attempts';$('equipment').textContent=s.equipment;
  $('steps').replaceChildren(...s.steps.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));$('ready').textContent=s.ready;$('easier').textContent=`Make it easier: ${s.easier}`;
  $('video').href=s.video;$('video').textContent=s.videoLabel;$('video-note').textContent=s.videoNote;
  $('practiced').checked=state.completed.includes(state.day);$('notes').value=typeof state.notes[state.day]==='string'?state.notes[state.day]:'';$('previous').disabled=state.day===0;$('next').disabled=state.day===29;
  $('progress').textContent=`${state.completed.length} of 30 days practiced`;$('bar').value=state.completed.length;
  [...$('days').children].forEach((b,i)=>{b.textContent=`${i+1}${state.completed.includes(i)?' ✓':''}`;b.classList.toggle('complete',state.completed.includes(i));b.setAttribute('aria-current',i===state.day?'step':'false');});
 }
 function selectDay(n){clearTimeout(saveTimer);state.day=n;resetTimer();render();save();}
 CAT_DAYS.forEach((d,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`${i+1} · ${d.title}`;$('day-select').append(o);const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Day ${i+1}: ${d.title}`);b.addEventListener('click',()=>selectDay(i));$('days').append(b);});
 ['click','target','sit','come','mat','carrier'].forEach(k=>{const s=CAT_SKILLS[k],sec=document.createElement('section'),h=document.createElement('h3'),p=document.createElement('p'),b=document.createElement('button');h.textContent=`${s.picture}. ${s.name}`;p.textContent=s.goal;b.textContent='Open first lesson';b.addEventListener('click',()=>{selectDay(CAT_DAYS.findIndex(d=>d.skill===k));show('today');window.scrollTo({top:0,behavior:'smooth'});});sec.append(h,p,b);$('skill-list').append(sec);});
 document.querySelectorAll('nav button').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));
 $('day-select').addEventListener('change',()=>selectDay(Number($('day-select').value)));
 $('previous').addEventListener('click',()=>{if(state.day>0)selectDay(state.day-1);});$('next').addEventListener('click',()=>{if(state.day<29)selectDay(state.day+1);});
 $('practiced').addEventListener('change',()=>{state.completed=$('practiced').checked?[...new Set([...state.completed,state.day])]:state.completed.filter(n=>n!==state.day);render();save();});
 $('notes').addEventListener('input',()=>{state.notes[state.day]=$('notes').value;clearTimeout(saveTimer);saveTimer=setTimeout(save,350);});
 $('timer-start').addEventListener('click',()=>{if(timerId){remaining=Math.max(0,Math.ceil((endTime-Date.now())/1000));clearInterval(timerId);timerId=null;$('timer-start').textContent='Resume timer';displayTime();return;}if(remaining===0)remaining=120;endTime=Date.now()+remaining*1000;$('timer-start').textContent='Pause timer';$('timer-status').textContent='Timer running. Your cat can stop sooner.';timerId=setInterval(()=>{remaining=Math.max(0,Math.ceil((endTime-Date.now())/1000));displayTime();if(remaining===0){clearInterval(timerId);timerId=null;$('timer-start').textContent='Start again';$('timer-status').textContent='Time for a break. Finish with an easy success if your cat is willing.';}},200);});
 $('timer-reset').addEventListener('click',resetTimer);$('print').addEventListener('click',()=>{show('today');window.print();});$('begin').addEventListener('click',()=>{selectDay(0);show('today');});
 render();
})();
