const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

const header=$('[data-header]');
const onScroll=()=>header?.classList.toggle('scrolled',scrollY>40);
addEventListener('scroll',onScroll,{passive:true}); onScroll();

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}
}),{threshold:.13,rootMargin:'0px 0px -5%'});
$$('.reveal').forEach(el=>observer.observe(el));

const pathCopy={
  existing:'Ihre bestehende PV-Anlage erzeugt bereits Energie. Wir sorgen dafür, dass mehr davon dann arbeitet, wenn Ihr Betrieb sie wirklich braucht.',
  planning:'Wer Erzeugung, Speicher und Verbrauch gemeinsam plant, vermeidet teure Umwege. GEBA dimensioniert das System von Anfang an nach Ihrem Betrieb.'
};
$$('[data-path]').forEach(button=>button.addEventListener('click',()=>{
  $$('[data-path]').forEach(b=>b.classList.toggle('active',b===button));
  const key=button.dataset.path;
  $('[data-path-copy]').textContent=pathCopy[key];
  const radio=$(`input[name="situation"][value="${key}"]`);
  if(radio) radio.checked=true;
  $('#position').scrollIntoView({behavior:'smooth'});
}));

const phases=[
  {h:0,pv:0,load:22,grid:22,bat:0,soc:42,phase:'Nachtbetrieb',insight:'Der Betrieb wird ruhig aus dem Netz versorgt. Der Speicher hält Reserve für den nächsten Lastanstieg.'},
  {h:6,pv:5,load:42,grid:12,bat:-25,soc:38,phase:'Anlaufspitze glätten',insight:'Wenn der Betrieb hochfährt, deckt der Speicher den steilen Leistungsanstieg und begrenzt die Netzspitze.'},
  {h:9,pv:49,load:68,grid:19,bat:0,soc:26,phase:'Solarstrom direkt nutzen',insight:'Die PV versorgt große Teile des laufenden Betriebs direkt. Nur die Differenz kommt aus dem Netz.'},
  {h:12,pv:86,load:64,grid:0,bat:22,soc:68,phase:'Solarstrom speichern',insight:'Der Solarüberschuss lädt den Speicher. Energie, die heute Abend nicht teuer aus dem Netz bezogen werden muss.'},
  {h:16,pv:38,load:72,grid:4,bat:-30,soc:72,phase:'Lastspitze vermeiden',insight:'PV und Speicher arbeiten zusammen. Trotz hoher Betriebslast bleibt der Netzbezug kontrolliert.'},
  {h:20,pv:0,load:41,grid:9,bat:-32,soc:46,phase:'Gespeicherte Energie nutzen',insight:'Nach Sonnenuntergang versorgt der Speicher den Betrieb weiter mit selbst erzeugter Energie.'},
  {h:23,pv:0,load:24,grid:24,bat:0,soc:42,phase:'System in Bereitschaft',insight:'Das System hält den optimalen Ladezustand für den nächsten Betriebstag.'}
];
let hour=6, playing=true, timer;
const energyFilm=$('[data-energy-film]');
const lerp=(a,b,t)=>Math.round(a+(b-a)*t);
function stateAt(h){let a=phases[0],b=phases.at(-1);for(let i=0;i<phases.length-1;i++)if(h>=phases[i].h&&h<=phases[i+1].h){a=phases[i];b=phases[i+1];break}const t=(h-a.h)/(b.h-a.h||1);return {pv:lerp(a.pv,b.pv,t),load:lerp(a.load,b.load,t),grid:lerp(a.grid,b.grid,t),bat:lerp(a.bat,b.bat,t),soc:lerp(a.soc,b.soc,t),phase:t<.5?a.phase:b.phase,insight:t<.5?a.insight:b.insight}}
function renderEnergy(){const s=stateAt(hour);$('[data-clock]').textContent=`${String(hour).padStart(2,'0')}:00`;$('[data-phase]').textContent=s.phase;$('[data-pv]').textContent=`${s.pv} kW`;$('[data-load]').textContent=`${s.load} kW`;$('[data-grid]').textContent=`${s.grid} kW`;$('[data-battery]').textContent=`${s.bat>0?'+':''}${s.bat} kW`;$('[data-soc]').style.width=`${s.soc}%`;$('[data-insight]').textContent=s.insight;$('[data-time]').value=hour}
function run(){clearInterval(timer);if(energyFilm){if(playing)energyFilm.play().catch(()=>{});else energyFilm.pause();return}if(playing)timer=setInterval(()=>{hour=(hour+1)%24;renderEnergy()},1700)}
energyFilm?.addEventListener('timeupdate',()=>{if(!playing||!energyFilm.duration)return;const next=Math.min(23,Math.floor(energyFilm.currentTime/energyFilm.duration*24));if(next!==hour){hour=next;renderEnergy()}});
$('[data-time]')?.addEventListener('input',e=>{hour=+e.target.value;if(energyFilm?.duration)energyFilm.currentTime=hour/24*energyFilm.duration;renderEnergy()});
$('[data-play]')?.addEventListener('click',e=>{playing=!playing;e.currentTarget.textContent=playing?'Ⅱ':'▶';e.currentTarget.setAttribute('aria-label',playing?'Simulation pausieren':'Simulation starten');run()});
renderEnergy();run();

const advisor=$('[data-advisor]'), result=$('[data-result]'); let step=1;
const advice={situation:{existing:'Bei einer bestehenden PV-Anlage liegt der erste Hebel häufig in der zeitlichen Verschiebung Ihres Solarstroms.',planning:'Bei einer Neuplanung lassen sich Erzeugung und Speicher wirtschaftlich als Gesamtsystem dimensionieren.',storage:'Für die richtige Speichergröße zählen Lastgang und Aufgabe — nicht ein pauschaler kWh-Wert.'},profile:{day:'Ein Tagesprofil passt oft gut zur PV. Der Speicher fängt Überschüsse und kurze Lastspitzen ab.',mixed:'Ein gemischtes Profil erhöht den Wert zeitlicher Verschiebung über mehrere Betriebsphasen.',peaks:'Deutliche Spitzen sind ein starkes Signal für gezieltes Peak Shaving.'},usage:{small:'Auch kleinere Betriebe können profitieren, wenn PV-Überschüsse oder ausgeprägte Lastspitzen vorliegen.',medium:'In dieser Verbrauchsklasse bestehen oft mehrere wirtschaftliche Hebel gleichzeitig.',large:'Hoher Verbrauch verlangt eine belastbare Lastganganalyse und bietet meist relevantes Optimierungspotenzial.'},goal:{self:'Für mehr Eigenverbrauch sind Erzeugungs- und Verbrauchszeiten der entscheidende Ausgangspunkt.',peaks:'Für Lastspitzenmanagement sind Viertelstundenwerte besonders aussagekräftig.',resilience:'Ein intelligentes Energiemanagement schafft Transparenz und mehr Planbarkeit.'}};
function showStep(){ $$('.advisor-step',advisor).forEach(s=>s.classList.toggle('active',+s.dataset.step===step));$('[data-step-number]').textContent=step;$('[data-progress]').style.width=`${step*25}%`;$('[data-back]').disabled=step===1;$('[data-next]').innerHTML=step===4?'Auswertung zeigen <span>→</span>':'Weiter <span>→</span>' }
function updateAdvice(input){const text=advice[input.name]?.[input.value];if(text)$('[data-live-advice]').textContent=text}
$$('input',advisor).forEach(i=>i.addEventListener('change',()=>updateAdvice(i)));
$('[data-back]')?.addEventListener('click',()=>{step=Math.max(1,step-1);showStep()});
$('[data-next]')?.addEventListener('click',()=>{if(step<4){step++;showStep();return}showResult()});
function showResult(){const data=Object.fromEntries(new FormData($('form',advisor)));let score=48;if(data.situation==='existing')score+=9;if(data.situation==='planning')score+=7;if(data.profile==='peaks')score+=14;if(data.profile==='mixed')score+=7;if(data.usage==='medium')score+=8;if(data.usage==='large')score+=13;if(data.goal==='peaks')score+=7;score=Math.min(score,94);const values={self:58,peaks:48,planning:66};if(data.situation==='existing')values.self+=25;if(data.profile==='peaks')values.peaks+=40;if(data.goal==='self')values.self+=12;if(data.goal==='peaks')values.peaks+=12;if(data.goal==='resilience')values.planning+=22;advisor.hidden=true;result.hidden=false;$('[data-score]').textContent=score;$('.score-ring').style.setProperty('--score',score);Object.entries(values).forEach(([k,v])=>{v=Math.min(v,96);$(`[data-bar="${k}"]`).style.width=`${v}%`;$(`[data-val="${k}"]`).textContent=v>78?'hoch':v>58?'gut':'prüfbar'});result.scrollIntoView({behavior:'smooth',block:'center'})}
$('[data-restart]')?.addEventListener('click',()=>{result.hidden=true;advisor.hidden=false;step=1;showStep();advisor.scrollIntoView({behavior:'smooth',block:'center'})});
showStep();

$('[data-year]').textContent=new Date().getFullYear();
if(matchMedia('(prefers-reduced-motion: reduce)').matches){playing=false;clearInterval(timer);$$('video').forEach(video=>video.pause());$$('.reveal').forEach(el=>el.classList.add('visible'))}
