import { useState, useEffect, useRef } from "react";

const C = {
  bg:"#0A0A0F", surface:"#12121A", card:"#1A1A26",
  primary:"#7B6EF6", pLight:"#A99DF8", pDark:"#5648D4",
  accent:"#F06292", green:"#2DD4BF", amber:"#FBBF24",
  red:"#F87171", text:"#F0EFF8", muted:"#7B7A94", border:"#2A2A3E",
};

const Tag = ({ children, color=C.primary }) => (
  <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:20, fontSize:9, fontWeight:600, letterSpacing:"0.5px", background:color+"22", color, border:`1px solid ${color}44` }}>{children}</span>
);
const Avatar = ({ size=32, initials="CG", color=C.primary }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", flexShrink:0, background:`linear-gradient(135deg,${color},${C.pDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.35, fontWeight:700, color:"#fff", border:`2px solid ${color}44` }}>{initials}</div>
);
const ProgressRing = ({ pct, size=56, stroke=4, color=C.primary }) => {
  const r=(size-stroke)/2, circ=2*Math.PI*r;
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)} strokeLinecap="round" style={{ transition:"stroke-dashoffset 1s ease" }}/>
    </svg>
  );
};
const Pill = ({ icon, label, value, color=C.primary }) => (
  <div style={{ background:C.card, borderRadius:12, padding:"10px 12px", display:"flex", flexDirection:"column", gap:2, flex:1, border:`1px solid ${C.border}` }}>
    <span style={{ fontSize:16 }}>{icon}</span>
    <span style={{ fontSize:15, fontWeight:700, color, fontFamily:"'DM Mono',monospace" }}>{value}</span>
    <span style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.5px" }}>{label}</span>
  </div>
);

// NavBar 6 tabs
const NavBar = ({ active, setActive }) => {
  const items = [
    { id:"home",      icon:"⌂",  label:"Inicio"   },
    { id:"workout",   icon:"▶",  label:"Entrena"  },
    { id:"nutrition", icon:"🥗", label:"Nutrición"},
    { id:"progress",  icon:"↗",  label:"Progreso" },
    { id:"community", icon:"⊕",  label:"Social"   },
    { id:"profile",   icon:"◉",  label:"Perfil"   },
  ];
  return (
    <div style={{ display:"flex", justifyContent:"space-around", padding:"8px 0 4px", borderTop:`1px solid ${C.border}`, background:C.surface, flexShrink:0 }}>
      {items.map(it=>(
        <button key={it.id} onClick={()=>setActive(it.id)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, padding:"2px 4px" }}>
          <span style={{ fontSize:15, color:active===it.id?C.primary:C.muted, transition:"color .2s" }}>{it.icon}</span>
          <span style={{ fontSize:7.5, fontWeight:600, color:active===it.id?C.primary:C.muted }}>{it.label}</span>
          {active===it.id && <div style={{ width:3, height:3, borderRadius:"50%", background:C.primary }}/>}
        </button>
      ))}
    </div>
  );
};

// ════════════════ ONBOARDING (5 pasos) ════════════════
const OnboardingScreen = ({ onDone }) => {
  const [step,setStep] = useState(0);
  const [data,setData] = useState({ goal:null, level:null, equip:[], injuries:[], sleep:6, energy:6 });
  const [anim,setAnim] = useState(true);

  const goals=[
    { id:"muscle",   icon:"💪", label:"Ganar músculo",   color:C.primary },
    { id:"fat",      icon:"🔥", label:"Perder grasa",    color:C.accent  },
    { id:"cardio",   icon:"🏃", label:"Resistencia",     color:C.green   },
    { id:"wellness", icon:"🧘", label:"Rehabilitación",  color:C.amber   },
  ];
  const levels=[
    { id:"beginner",     icon:"🌱", label:"Principiante", sub:"0–6 meses"    },
    { id:"intermediate", icon:"⚡", label:"Intermedio",   sub:"6 m – 2 años" },
    { id:"advanced",     icon:"🏆", label:"Avanzado",     sub:"+2 años"       },
  ];
  const equipList=[
    { id:"gym",       icon:"🏋️", label:"Gym completo" },
    { id:"home",      icon:"🏠", label:"En casa"      },
    { id:"dumbbells", icon:"🪃", label:"Mancuernas"   },
    { id:"none",      icon:"🤲", label:"Sin equipo"   },
  ];
  const injuryList=[
    { id:"knee",     label:"Rodilla" },
    { id:"shoulder", label:"Hombro"  },
    { id:"back",     label:"Espalda" },
    { id:"none",     label:"Ninguna" },
  ];

  const next = () => { setAnim(false); setTimeout(()=>{ setStep(s=>s+1); setAnim(true); },200); };
  const btn  = (ok) => ({
    width:"100%", padding:"13px", borderRadius:14, marginTop:12,
    background:ok?`linear-gradient(135deg,${C.primary},${C.pDark})`:C.border,
    border:"none", color:ok?"#fff":C.muted, fontSize:13, fontWeight:700,
    cursor:ok?"pointer":"not-allowed", transition:"all .2s",
    boxShadow:ok?`0 8px 24px ${C.primary}44`:"none",
  });

  const aiMsg = data.sleep<=4||data.energy<=4
    ? "Con poco descanso, reduciré intensidad un 25% para evitar lesiones."
    : data.sleep>=8&&data.energy>=8
      ? "¡Excelente estado! Activaré variante de alta intensidad hoy."
      : "Estado moderado — sesión equilibrada para mantener tu progreso.";

  const steps = [
    // 0 – Bienvenida
    <div key="0" style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 20px",gap:18 }}>
      <div style={{ width:76,height:76,borderRadius:22,background:`linear-gradient(135deg,${C.primary},${C.pDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,boxShadow:`0 0 40px ${C.primary}55` }}>⚡</div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:24,fontWeight:800,color:C.text,fontFamily:"'Syne',sans-serif",lineHeight:1.1 }}>Bienvenido a<br/><span style={{ color:C.primary }}>Routine</span></div>
        <div style={{ fontSize:11,color:C.muted,marginTop:10,lineHeight:1.7 }}>Tu entrenador personal con IA.<br/>Rutinas que se adaptan a cómo te sientes hoy.</div>
      </div>
      <div style={{ display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center" }}>
        {["Hiperpersonalizado","IA adaptativa","100% español"].map(t=><Tag key={t}>{t}</Tag>)}
      </div>
      <div style={{ background:C.card,borderRadius:14,padding:"12px 14px",border:`1px solid ${C.border}`,width:"100%" }}>
        <div style={{ fontSize:10,color:C.primary,fontWeight:700,marginBottom:4 }}>¿Por qué Routine?</div>
        <div style={{ fontSize:10,color:C.muted,lineHeight:1.6 }}>El 67% abandona el gym en 3 meses por rutinas genéricas. Nosotros ajustamos tu entrenamiento según cómo te sientes cada día. Precio: $89 MXN/mes.</div>
      </div>
      <button onClick={next} style={btn(true)}>Comenzar configuración →</button>
    </div>,

    // 1 – Objetivo
    <div key="1" style={{ flex:1,display:"flex",flexDirection:"column",padding:"14px 14px 0" }}>
      <div style={{ fontSize:9,color:C.muted,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4 }}>Paso 1 de 4</div>
      <div style={{ fontSize:17,fontWeight:800,color:C.text,fontFamily:"'Syne',sans-serif",marginBottom:3 }}>¿Cuál es tu objetivo?</div>
      <div style={{ fontSize:10,color:C.muted,marginBottom:14 }}>Tu plan se genera según tu meta específica.</div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,flex:1 }}>
        {goals.map(g=>(
          <button key={g.id} onClick={()=>setData(d=>({...d,goal:g.id}))} style={{ background:data.goal===g.id?g.color+"22":C.card,border:`2px solid ${data.goal===g.id?g.color:C.border}`,borderRadius:14,padding:"16px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:7,cursor:"pointer",transition:"all .2s",boxShadow:data.goal===g.id?`0 0 18px ${g.color}33`:"none" }}>
            <span style={{ fontSize:24 }}>{g.icon}</span>
            <span style={{ fontSize:11,fontWeight:700,color:data.goal===g.id?g.color:C.text }}>{g.label}</span>
          </button>
        ))}
      </div>
      <button onClick={next} disabled={!data.goal} style={btn(!!data.goal)}>Continuar →</button>
    </div>,

    // 2 – Nivel
    <div key="2" style={{ flex:1,display:"flex",flexDirection:"column",padding:"14px 14px 0" }}>
      <div style={{ fontSize:9,color:C.muted,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4 }}>Paso 2 de 4</div>
      <div style={{ fontSize:17,fontWeight:800,color:C.text,fontFamily:"'Syne',sans-serif",marginBottom:3 }}>Tu nivel de experiencia</div>
      <div style={{ fontSize:10,color:C.muted,marginBottom:14 }}>Ajustamos la intensidad a tu condición actual.</div>
      <div style={{ display:"flex",flexDirection:"column",gap:9,flex:1 }}>
        {levels.map(l=>(
          <button key={l.id} onClick={()=>setData(d=>({...d,level:l.id}))} style={{ background:data.level===l.id?C.primary+"22":C.card,border:`2px solid ${data.level===l.id?C.primary:C.border}`,borderRadius:13,padding:"13px 14px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",transition:"all .2s",textAlign:"left" }}>
            <span style={{ fontSize:22 }}>{l.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:700,color:data.level===l.id?C.primary:C.text }}>{l.label}</div>
              <div style={{ fontSize:10,color:C.muted,marginTop:1 }}>{l.sub}</div>
            </div>
            {data.level===l.id && <span style={{ color:C.primary,fontSize:14 }}>✓</span>}
          </button>
        ))}
      </div>
      <button onClick={next} disabled={!data.level} style={btn(!!data.level)}>Continuar →</button>
    </div>,

    // 3 – Equipo + Lesiones
    <div key="3" style={{ flex:1,display:"flex",flexDirection:"column",padding:"14px 14px 0",overflowY:"auto" }}>
      <div style={{ fontSize:9,color:C.muted,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4 }}>Paso 3 de 4</div>
      <div style={{ fontSize:17,fontWeight:800,color:C.text,fontFamily:"'Syne',sans-serif",marginBottom:3 }}>Equipo y condición</div>
      <div style={{ fontSize:10,color:C.muted,marginBottom:10 }}>Rutinas adaptadas a lo que tienes disponible.</div>
      <div style={{ fontSize:9,color:C.muted,fontWeight:700,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.5px" }}>Equipo disponible</div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:12 }}>
        {equipList.map(e=>{ const sel=data.equip.includes(e.id); return (
          <button key={e.id} onClick={()=>setData(d=>({...d,equip:sel?d.equip.filter(x=>x!==e.id):[...d.equip,e.id]}))} style={{ background:sel?C.green+"22":C.card,border:`2px solid ${sel?C.green:C.border}`,borderRadius:12,padding:"12px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer",transition:"all .2s" }}>
            <span style={{ fontSize:20 }}>{e.icon}</span>
            <span style={{ fontSize:10,fontWeight:600,color:sel?C.green:C.text }}>{e.label}</span>
          </button>
        ); })}
      </div>
      <div style={{ fontSize:9,color:C.muted,fontWeight:700,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.5px" }}>Lesiones previas</div>
      <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:8 }}>
        {injuryList.map(inj=>{ const sel=data.injuries.includes(inj.id); return (
          <button key={inj.id} onClick={()=>setData(d=>({...d,injuries:sel?d.injuries.filter(x=>x!==inj.id):[...d.injuries,inj.id]}))} style={{ background:sel?C.red+"22":C.card,border:`1px solid ${sel?C.red:C.border}`,borderRadius:20,padding:"5px 12px",fontSize:10,fontWeight:600,color:sel?C.red:C.muted,cursor:"pointer",transition:"all .2s" }}>{inj.label}</button>
        ); })}
      </div>
      <button onClick={next} style={btn(true)}>Continuar →</button>
    </div>,

    // 4 – Check-in diario (diferenciador clave)
    <div key="4" style={{ flex:1,display:"flex",flexDirection:"column",padding:"14px 14px 0" }}>
      <div style={{ fontSize:9,color:C.muted,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4 }}>Paso 4 de 4</div>
      <div style={{ fontSize:17,fontWeight:800,color:C.text,fontFamily:"'Syne',sans-serif",marginBottom:3 }}>¿Cómo amaneciste hoy?</div>
      <div style={{ fontSize:10,color:C.muted,marginBottom:14,lineHeight:1.6 }}>Nuestra ventaja única: ajustamos tu rutina según tu estado real cada día.</div>
      {[{ key:"sleep",icon:"🌙",label:"Calidad de sueño",low:"Dormí mal",high:"Dormí perfecto" },{ key:"energy",icon:"⚡",label:"Nivel de energía",low:"Sin energía",high:"Con todo" }].map(item=>(
        <div key={item.key} style={{ background:C.card,borderRadius:14,padding:"12px 14px",marginBottom:10,border:`1px solid ${C.border}` }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:9 }}>
            <span style={{ fontSize:15 }}>{item.icon}</span>
            <span style={{ fontSize:11,fontWeight:700,color:C.text }}>{item.label}</span>
            <span style={{ marginLeft:"auto",fontSize:13,fontWeight:800,color:C.primary,fontFamily:"'DM Mono',monospace" }}>{data[item.key]}/10</span>
          </div>
          <input type="range" min="1" max="10" value={data[item.key]} onChange={e=>setData(d=>({...d,[item.key]:+e.target.value}))} style={{ width:"100%",accentColor:C.primary }}/>
          <div style={{ display:"flex",justifyContent:"space-between",marginTop:4 }}>
            <span style={{ fontSize:8,color:C.muted }}>{item.low}</span>
            <span style={{ fontSize:8,color:C.muted }}>{item.high}</span>
          </div>
        </div>
      ))}
      <div style={{ background:C.primary+"18",borderRadius:12,padding:"10px 12px",border:`1px solid ${C.primary}33`,marginBottom:10 }}>
        <div style={{ fontSize:10,fontWeight:700,color:C.pLight,marginBottom:3 }}>🤖 IA dice:</div>
        <div style={{ fontSize:10,color:C.muted,lineHeight:1.6 }}>{aiMsg}</div>
      </div>
      <button onClick={onDone} style={btn(true)}>Crear mi rutina con IA ✨</button>
    </div>,
  ];

  return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",background:C.bg,overflow:"hidden",opacity:anim?1:0,transform:anim?"translateY(0)":"translateY(10px)",transition:"all .2s ease" }}>
      <div style={{ display:"flex",justifyContent:"center",gap:5,padding:"12px 0 0" }}>
        {[0,1,2,3,4].map(i=><div key={i} style={{ width:i===step?18:5,height:5,borderRadius:3,background:i<=step?C.primary:C.border,transition:"all .3s" }}/>)}
      </div>
      {steps[step]}
    </div>
  );
};

// ════════════════ HOME ════════════════
const HomeScreen = () => {
  const [checkin,setCheckin]   = useState(false);
  const [sleep,setSleep]       = useState(7);
  const [energy,setEnergy]     = useState(6);
  const [done,setDone]         = useState(false);
  const [notif,setNotif]       = useState(false);

  const intensity = sleep>=7&&energy>=7?"Alta":sleep<=4||energy<=4?"Moderada (–25%)":"Normal";
  const iColor    = sleep>=7&&energy>=7?C.green:sleep<=4||energy<=4?C.amber:C.primary;

  const exercises=[
    { name:"Press de banca", sets:"4×10", kg:"70 kg", done:true,  muscle:"Pecho"   },
    { name:"Press militar",  sets:"3×12", kg:"50 kg", done:true,  muscle:"Hombros" },
    { name:"Aperturas",      sets:"3×15", kg:"16 kg", done:false, muscle:"Pecho"   },
    { name:"Fondos",         sets:"3×12", kg:"—",     done:false, muscle:"Tríceps" },
  ];
  const days=["L","M","X","J","V","S","D"];
  const doneD=[true,true,true,false,false,false,false];

  return (
    <div style={{ flex:1,overflowY:"auto",background:C.bg }}>
      <div style={{ padding:"12px 14px 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:10,color:C.muted }}>Lunes · 5 de mayo de 2026</div>
          <div style={{ fontSize:18,fontWeight:800,color:C.text,fontFamily:"'Syne',sans-serif",lineHeight:1.2,marginTop:2 }}>Hola, <span style={{ color:C.primary }}>Daniel</span> 👋</div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:7 }}>
          <button onClick={()=>setNotif(n=>!n)} style={{ background:"none",border:"none",cursor:"pointer",position:"relative" }}>
            <span style={{ fontSize:17 }}>🔔</span>
            {!notif && <div style={{ width:6,height:6,borderRadius:"50%",background:C.accent,position:"absolute",top:0,right:0 }}/>}
          </button>
          <div style={{ display:"flex",alignItems:"center",gap:4,background:"#2A1500",border:`1px solid ${C.amber}44`,borderRadius:20,padding:"4px 8px" }}>
            <span style={{ fontSize:12 }}>🔥</span>
            <span style={{ fontSize:11,fontWeight:700,color:C.amber }}>12</span>
          </div>
          <Avatar size={32} initials="DH"/>
        </div>
      </div>

      {notif && <div style={{ margin:"8px 14px 0",background:C.primary+"22",borderRadius:11,padding:"9px 11px",border:`1px solid ${C.primary}44` }}><div style={{ fontSize:10,fontWeight:700,color:C.primary }}>🔔 Recordatorio</div><div style={{ fontSize:10,color:C.muted,marginTop:2 }}>Tu sesión Push Day A te espera. ¡No rompas la racha!</div></div>}

      {/* Check-in IA — diferenciador principal */}
      {!done ? (
        <div style={{ margin:"10px 14px 0",background:C.card,borderRadius:15,padding:"12px",border:`1px solid ${C.primary}44` }}>
          <div style={{ fontSize:10,color:C.primary,fontWeight:700,marginBottom:7 }}>🤖 Check-in diario — IA adaptativa</div>
          {!checkin ? (
            <>
              <div style={{ fontSize:10,color:C.muted,lineHeight:1.6,marginBottom:9 }}>Antes de tu rutina, dinos cómo amaneciste para adaptar la intensidad.</div>
              <button onClick={()=>setCheckin(true)} style={{ width:"100%",padding:"9px",borderRadius:11,background:`linear-gradient(135deg,${C.primary},${C.pDark})`,border:"none",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer" }}>¿Cómo amaneciste hoy? →</button>
            </>
          ):(
            <>
              {[{ key:"sleep",val:sleep,set:setSleep,label:"Calidad de sueño",icon:"🌙" },{ key:"energy",val:energy,set:setEnergy,label:"Nivel de energía",icon:"⚡" }].map(it=>(
                <div key={it.key} style={{ marginBottom:9 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}>
                    <span style={{ fontSize:10,color:C.muted }}>{it.icon} {it.label}</span>
                    <span style={{ fontSize:11,fontWeight:700,color:C.primary,fontFamily:"'DM Mono',monospace" }}>{it.val}/10</span>
                  </div>
                  <input type="range" min="1" max="10" value={it.val} onChange={e=>it.set(+e.target.value)} style={{ width:"100%",accentColor:C.primary }}/>
                </div>
              ))}
              <div style={{ background:iColor+"18",borderRadius:9,padding:"7px 9px",marginBottom:7,border:`1px solid ${iColor}33` }}>
                <span style={{ fontSize:10,fontWeight:700,color:iColor }}>Intensidad: {intensity}</span>
              </div>
              <button onClick={()=>setDone(true)} style={{ width:"100%",padding:"9px",borderRadius:11,background:`linear-gradient(135deg,${C.green},#0d9488)`,border:"none",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer" }}>Confirmar y generar rutina ✓</button>
            </>
          )}
        </div>
      ):(
        <div style={{ margin:"10px 14px 0",background:C.green+"18",borderRadius:11,padding:"9px 11px",border:`1px solid ${C.green}44` }}>
          <div style={{ display:"flex",gap:6,alignItems:"center" }}>
            <span style={{ fontSize:15 }}>🤖</span>
            <div><div style={{ fontSize:10,fontWeight:700,color:C.green }}>Rutina ajustada · {intensity}</div><div style={{ fontSize:10,color:C.muted }}>Sueño {sleep}/10 · Energía {energy}/10</div></div>
          </div>
        </div>
      )}

      {/* Semana */}
      <div style={{ padding:"10px 14px 0",display:"flex",gap:5 }}>
        {days.map((d,i)=>(
          <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
            <span style={{ fontSize:8,color:C.muted,fontWeight:600 }}>{d}</span>
            <div style={{ width:25,height:25,borderRadius:8,background:doneD[i]?C.primary:(i===0?C.primary+"33":C.surface),border:i===0?`2px solid ${C.primary}`:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:doneD[i]?"#fff":(i===0?C.primary:C.muted),fontWeight:700 }}>{doneD[i]?"✓":d}</div>
          </div>
        ))}
      </div>

      {/* Tarjeta rutina */}
      <div style={{ margin:"10px 14px 0",borderRadius:16,overflow:"hidden" }}>
        <div style={{ background:`linear-gradient(135deg,${C.primary}CC,${C.pDark})`,padding:"13px",position:"relative" }}>
          <div style={{ position:"absolute",right:-15,top:-15,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.07)" }}/>
          <Tag color="#fff">Hoy · Push Day A</Tag>
          <div style={{ fontSize:15,fontWeight:800,color:"#fff",fontFamily:"'Syne',sans-serif",marginTop:4,lineHeight:1.2 }}>Tren Superior</div>
          <div style={{ display:"flex",gap:5,marginTop:7,flexWrap:"wrap" }}>
            {["⏱ 45 min","4 ejercicios",`📊 ${intensity}`].map(t=>(
              <span key={t} style={{ fontSize:9,color:"rgba(255,255,255,0.85)",background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"2px 8px" }}>{t}</span>
            ))}
          </div>
          <button style={{ marginTop:9,background:"#fff",borderRadius:9,padding:"7px 16px",border:"none",color:C.pDark,fontSize:11,fontWeight:800,cursor:"pointer" }}>Comenzar →</button>
        </div>
      </div>

      {/* Pills */}
      <div style={{ display:"flex",gap:7,padding:"10px 14px 0" }}>
        <Pill icon="🏋️" label="Semana" value="4"    color={C.primary}/>
        <Pill icon="⏱"  label="Tiempo" value="3h20" color={C.green}/>
        <Pill icon="🔥"  label="kcal"   value="1840" color={C.accent}/>
      </div>

      {/* Ejercicios */}
      <div style={{ padding:"10px 14px 0" }}>
        <div style={{ fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"1px",marginBottom:7,fontWeight:700 }}>Ejercicios de hoy</div>
        {exercises.map((ex,i)=>(
          <div key={i} style={{ background:C.card,borderRadius:11,padding:"9px 11px",marginBottom:6,display:"flex",alignItems:"center",gap:9,border:`1px solid ${ex.done?C.green+"33":C.border}` }}>
            <div style={{ width:30,height:30,borderRadius:8,background:ex.done?C.green+"22":C.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0 }}>🏋️</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11,fontWeight:700,color:C.text }}>{ex.name}</div>
              <div style={{ fontSize:9,color:C.muted,marginTop:1 }}>{ex.sets} · {ex.kg} · <span style={{ color:C.primary }}>{ex.muscle}</span></div>
            </div>
            <div style={{ width:19,height:19,borderRadius:"50%",background:ex.done?C.green:"transparent",border:`2px solid ${ex.done?C.green:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",flexShrink:0 }}>{ex.done?"✓":""}</div>
          </div>
        ))}
      </div>

      {/* Gamificación logro */}
      <div style={{ margin:"10px 14px 12px",background:C.amber+"18",borderRadius:13,padding:"10px 11px",border:`1px solid ${C.amber}33` }}>
        <div style={{ display:"flex",gap:7,alignItems:"center" }}>
          <span style={{ fontSize:18 }}>🏆</span>
          <div><div style={{ fontSize:10,fontWeight:700,color:C.amber }}>¡Logro desbloqueado!</div><div style={{ fontSize:10,color:C.muted }}>Racha de 12 días seguidos — ¡Sigue así!</div></div>
        </div>
      </div>
    </div>
  );
};

// ════════════════ WORKOUT ACTIVO ════════════════
const WorkoutScreen = () => {
  const [activeSet,setSet] = useState(2);
  const [timer,setTimer]   = useState(45);
  const [rest,setRest]     = useState(true);
  const [weight,setWeight] = useState("70");
  const [reps,setReps]     = useState("10");

  const sets=[
    { w:"70 kg",reps:10,done:true  },
    { w:"70 kg",reps:10,done:true  },
    { w:"70 kg",reps:10,done:false },
    { w:"70 kg",reps:10,done:false },
  ];

  useEffect(()=>{ if(!rest)return; const t=setInterval(()=>setTimer(s=>s>0?s-1:0),1000); return()=>clearInterval(t); },[rest]);

  return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",background:C.bg,overflow:"hidden" }}>
      <div style={{ background:C.surface,padding:"10px 14px",borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div>
            <div style={{ fontSize:9,color:C.muted,textTransform:"uppercase" }}>Push Day — Tren Superior</div>
            <div style={{ fontSize:14,fontWeight:800,color:C.text,fontFamily:"'Syne',sans-serif",marginTop:1 }}>Ejercicio 3 <span style={{ color:C.muted,fontWeight:400 }}>/ 4</span></div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:9,color:C.muted }}>Tiempo total</div>
            <div style={{ fontSize:14,fontWeight:700,color:C.green,fontFamily:"'DM Mono',monospace" }}>18:34</div>
          </div>
        </div>
        <div style={{ marginTop:7,background:C.border,borderRadius:4,height:4 }}>
          <div style={{ width:"60%",background:`linear-gradient(90deg,${C.primary},${C.pLight})`,height:4,borderRadius:4 }}/>
        </div>
      </div>

      <div style={{ flex:1,overflowY:"auto",padding:"13px" }}>
        <div style={{ marginBottom:10 }}>
          <div style={{ fontSize:19,fontWeight:800,color:C.text,fontFamily:"'Syne',sans-serif",lineHeight:1.2 }}>Aperturas con<br/>mancuernas</div>
          <div style={{ fontSize:10,color:C.muted,marginTop:5,lineHeight:1.6 }}>Codos ligeramente flexionados. Contrae el pecho en la cima.</div>
          <div style={{ display:"flex",gap:5,marginTop:5 }}><Tag color={C.primary}>Pectoral mayor</Tag><Tag color={C.accent}>Deltoides ant.</Tag></div>
        </div>

        {/* Videotutorial */}
        <div style={{ background:C.card,borderRadius:13,padding:"11px",marginBottom:11,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:9 }}>
          <div style={{ width:44,height:44,borderRadius:9,background:C.primary+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>▶</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:700,color:C.text }}>Videotutorial — técnica correcta</div>
            <div style={{ fontSize:9,color:C.muted }}>1:23 min · En español · HD</div>
          </div>
          <Tag color={C.green}>HD</Tag>
        </div>

        {/* Timer descanso */}
        {rest && (
          <div style={{ background:C.card,borderRadius:15,padding:"13px",marginBottom:11,border:`1px solid ${C.green}44`,textAlign:"center" }}>
            <div style={{ fontSize:9,color:C.green,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6 }}>⏸ Descansando</div>
            <div style={{ position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center" }}>
              <ProgressRing pct={timer/60*100} size={64} stroke={5} color={C.green}/>
              <div style={{ position:"absolute",textAlign:"center" }}>
                <div style={{ fontSize:19,fontWeight:800,color:C.green,fontFamily:"'DM Mono',monospace",lineHeight:1 }}>{timer}</div>
                <div style={{ fontSize:8,color:C.muted }}>seg</div>
              </div>
            </div>
            <button onClick={()=>setRest(false)} style={{ display:"block",margin:"7px auto 0",background:"none",border:`1px solid ${C.green}`,borderRadius:20,padding:"4px 13px",color:C.green,fontSize:10,cursor:"pointer" }}>Saltar descanso</button>
          </div>
        )}

        {/* Registro */}
        <div style={{ background:C.card,borderRadius:13,padding:"11px",marginBottom:11,border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:9,color:C.muted,fontWeight:700,marginBottom:7,textTransform:"uppercase",letterSpacing:"0.5px" }}>Registrar serie {activeSet+1}</div>
          <div style={{ display:"flex",gap:7 }}>
            {[{ label:"Peso (kg)",val:weight,set:setWeight },{ label:"Repeticiones",val:reps,set:setReps }].map(f=>(
              <div key={f.label} style={{ flex:1 }}>
                <div style={{ fontSize:9,color:C.muted,marginBottom:4 }}>{f.label}</div>
                <input value={f.val} onChange={e=>f.set(e.target.value)} style={{ width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px",fontSize:14,fontWeight:700,color:C.text,textAlign:"center",fontFamily:"'DM Mono',monospace" }}/>
              </div>
            ))}
          </div>
        </div>

        {/* Series */}
        <div style={{ fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6,fontWeight:700 }}>Series</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:11 }}>
          {sets.map((s,i)=>(
            <button key={i} onClick={()=>setSet(i)} style={{ background:s.done?C.green+"22":(i===activeSet?C.primary+"33":C.surface),border:`2px solid ${s.done?C.green:(i===activeSet?C.primary:C.border)}`,borderRadius:11,padding:"9px 4px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"all .2s" }}>
              <span style={{ fontSize:7,color:C.muted }}>S{i+1}</span>
              <span style={{ fontSize:11,fontWeight:700,color:s.done?C.green:(i===activeSet?C.primary:C.text),fontFamily:"'DM Mono',monospace" }}>{s.done?"✓":s.w}</span>
              {!s.done && <span style={{ fontSize:8,color:C.muted }}>{s.reps}r</span>}
            </button>
          ))}
        </div>

        <button onClick={()=>{ setSet(s=>Math.min(s+1,3)); setTimer(60); setRest(true); }} style={{ width:"100%",padding:"12px",borderRadius:13,background:`linear-gradient(135deg,${C.green},#0d9488)`,border:"none",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",boxShadow:`0 8px 24px ${C.green}44`,marginBottom:6 }}>Serie completada ✓</button>
        <button style={{ width:"100%",padding:"8px",background:"none",border:`1px solid ${C.border}`,borderRadius:10,color:C.muted,fontSize:10,cursor:"pointer" }}>Saltar ejercicio</button>
      </div>
    </div>
  );
};

// ════════════════ NUTRITION ════════════════
const NutritionScreen = () => {
  const [log,setLog]     = useState([
    { name:"Avena con plátano",           cal:320, protein:12, meal:"Desayuno",    time:"07:30" },
    { name:"Pechuga a la plancha + arroz",cal:480, protein:42, meal:"Comida",      time:"13:00" },
    { name:"Whey protein",                cal:130, protein:26, meal:"Post-entreno",time:"18:00" },
  ]);
  const [showAdd,setAdd] = useState(false);
  const [newFood,setNew] = useState("");

  const totalCal=log.reduce((a,i)=>a+i.cal,0);
  const totalProt=log.reduce((a,i)=>a+i.protein,0);

  const tips=[
    "Come proteína en los primeros 30–45 min después de entrenar para maximizar síntesis muscular.",
    "Hidratación: toma al menos 500 ml de agua antes de tu sesión de hoy.",
    "Carbohidratos pre-entrenamiento mejoran rendimiento. Come 2h antes del gym.",
  ];

  return (
    <div style={{ flex:1,overflowY:"auto",background:C.bg,padding:"13px" }}>
      <div style={{ fontSize:18,fontWeight:800,color:C.text,fontFamily:"'Syne',sans-serif",marginBottom:2 }}>Nutrición</div>
      <div style={{ fontSize:10,color:C.muted,marginBottom:13 }}>Registro diario · Consejos personalizados en español</div>

      <div style={{ background:C.card,borderRadius:17,padding:"13px",marginBottom:11,border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:10,fontWeight:700,color:C.text,marginBottom:11 }}>Macros de hoy</div>
        <div style={{ display:"flex",justifyContent:"space-around" }}>
          {[
            { label:"Calorías", val:totalCal,  target:2200,color:C.accent  },
            { label:"Proteína", val:totalProt, target:140, color:C.primary },
            { label:"Agua (L)", val:1.8,       target:3,   color:C.green   },
          ].map(m=>(
            <div key={m.label} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
              <div style={{ position:"relative",display:"inline-flex" }}>
                <ProgressRing pct={Math.min(m.val/m.target*100,100)} size={54} stroke={5} color={m.color}/>
                <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <span style={{ fontSize:9,fontWeight:700,color:m.color,fontFamily:"'DM Mono',monospace" }}>{Math.round(m.val/m.target*100)}%</span>
                </div>
              </div>
              <span style={{ fontSize:9,color:C.muted,textAlign:"center" }}>{m.label}</span>
              <span style={{ fontSize:9,fontWeight:700,color:m.color,fontFamily:"'DM Mono',monospace" }}>{m.val}{m.label==="Agua (L)"?"L":m.label==="Proteína"?"g":" kcal"}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7 }}>
        <div style={{ fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"1px",fontWeight:700 }}>Alimentos de hoy</div>
        <button onClick={()=>setAdd(a=>!a)} style={{ background:C.primary+"22",border:`1px solid ${C.primary}44`,borderRadius:20,padding:"4px 10px",color:C.primary,fontSize:10,fontWeight:700,cursor:"pointer" }}>+ Agregar</button>
      </div>

      {showAdd && (
        <div style={{ background:C.card,borderRadius:11,padding:"10px",marginBottom:9,border:`1px solid ${C.primary}44` }}>
          <input value={newFood} onChange={e=>setNew(e.target.value)} placeholder="Nombre del alimento..." style={{ width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 10px",fontSize:11,color:C.text,marginBottom:6 }}/>
          <button onClick={()=>{ if(newFood.trim()){ setLog(l=>[...l,{ name:newFood,cal:200,protein:15,meal:"Cena",time:"20:00" }]); setNew(""); setAdd(false); } }} style={{ width:"100%",padding:"7px",borderRadius:9,background:`linear-gradient(135deg,${C.primary},${C.pDark})`,border:"none",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer" }}>Registrar</button>
        </div>
      )}

      {log.map((item,i)=>(
        <div key={i} style={{ background:C.card,borderRadius:11,padding:"9px 11px",marginBottom:6,border:`1px solid ${C.border}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
            <div><div style={{ fontSize:11,fontWeight:700,color:C.text }}>{item.name}</div><div style={{ fontSize:9,color:C.muted,marginTop:1 }}>{item.meal} · {item.time}</div></div>
            <div style={{ textAlign:"right" }}><div style={{ fontSize:11,fontWeight:700,color:C.accent,fontFamily:"'DM Mono',monospace" }}>{item.cal} kcal</div><div style={{ fontSize:9,color:C.primary }}>{item.protein}g prot.</div></div>
          </div>
        </div>
      ))}

      <div style={{ fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"1px",fontWeight:700,marginTop:8,marginBottom:7 }}>Consejos del día</div>
      {tips.map((tip,i)=>(
        <div key={i} style={{ background:C.amber+"15",borderRadius:11,padding:"9px 11px",marginBottom:6,border:`1px solid ${C.amber}33` }}>
          <div style={{ fontSize:9,color:C.amber,fontWeight:700,marginBottom:2 }}>💡 Consejo {i+1}</div>
          <div style={{ fontSize:10,color:C.muted,lineHeight:1.6 }}>{tip}</div>
        </div>
      ))}
    </div>
  );
};

// ════════════════ PROGRESS ════════════════
const ProgressScreen = () => {
  const weeks=["S1","S2","S3","S4","S5","S6","S7"];
  const vals=[2,4,3,5,4,6,4];
  const max=Math.max(...vals);

  const badges=[
    { icon:"🔥", label:"12 días de racha",  color:C.amber,  unlocked:true  },
    { icon:"💪", label:"100 kg press banca",color:C.primary,unlocked:true  },
    { icon:"🏃", label:"Primera semana",    color:C.green,  unlocked:true  },
    { icon:"⭐", label:"30 entrenamientos", color:C.accent, unlocked:true  },
    { icon:"🏆", label:"Reto 30 días",      color:C.amber,  unlocked:false },
    { icon:"💎", label:"50 sesiones",        color:C.pLight, unlocked:false },
  ];

  return (
    <div style={{ flex:1,overflowY:"auto",background:C.bg,padding:"13px" }}>
      <div style={{ fontSize:18,fontWeight:800,color:C.text,fontFamily:"'Syne',sans-serif",marginBottom:2 }}>Tu progreso</div>
      <div style={{ fontSize:10,color:C.muted,marginBottom:13 }}>Últimas 7 semanas · Push / Pull / Legs</div>

      <div style={{ display:"flex",justifyContent:"space-around",background:C.card,borderRadius:17,padding:"13px",marginBottom:11,border:`1px solid ${C.border}` }}>
        {[{ label:"Semana",pct:60,val:"3/5",color:C.primary },{ label:"Volumen",pct:78,val:"78%",color:C.green },{ label:"Racha",pct:100,val:"12d",color:C.amber }].map(it=>(
          <div key={it.label} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
            <div style={{ position:"relative",display:"inline-flex" }}>
              <ProgressRing pct={it.pct} size={54} stroke={5} color={it.color}/>
              <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
                <span style={{ fontSize:10,fontWeight:700,color:it.color,fontFamily:"'DM Mono',monospace" }}>{it.val}</span>
              </div>
            </div>
            <span style={{ fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.5px" }}>{it.label}</span>
          </div>
        ))}
      </div>

      <div style={{ background:C.card,borderRadius:17,padding:"11px",marginBottom:11,border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:10,fontWeight:700,color:C.text,marginBottom:9 }}>Sesiones por semana</div>
        <div style={{ display:"flex",alignItems:"flex-end",gap:5,height:68 }}>
          {vals.map((v,i)=>(
            <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
              <span style={{ fontSize:8,color:C.muted,fontFamily:"'DM Mono',monospace" }}>{v}</span>
              <div style={{ width:"100%",borderRadius:"4px 4px 0 0",height:`${(v/max)*52}px`,background:i===6?`linear-gradient(180deg,${C.primary},${C.pDark})`:C.surface,border:`1px solid ${i===6?C.primary:C.border}`,transition:"height 0.8s ease" }}/>
              <span style={{ fontSize:7,color:C.muted }}>{weeks[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:C.card,borderRadius:17,padding:"11px",marginBottom:11,border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:10,fontWeight:700,color:C.text,marginBottom:9 }}>Récords personales</div>
        {[
          { name:"Press banca",val:"90 kg", prev:"+5 kg", color:C.primary },
          { name:"Sentadilla", val:"120 kg",prev:"+10 kg",color:C.green   },
          { name:"Peso muerto",val:"140 kg",prev:"+15 kg",color:C.accent  },
        ].map(pb=>(
          <div key={pb.name} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontSize:11,color:C.text }}>{pb.name}</span>
            <div style={{ textAlign:"right" }}>
              <span style={{ fontSize:12,fontWeight:800,color:pb.color,fontFamily:"'DM Mono',monospace" }}>{pb.val}</span>
              <span style={{ fontSize:9,color:C.green,marginLeft:5,background:C.green+"22",borderRadius:10,padding:"1px 5px" }}>{pb.prev}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"1px",fontWeight:700,marginBottom:7 }}>Logros y gamificación</div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:6 }}>
        {badges.map((b,i)=>(
          <div key={i} style={{ background:C.card,borderRadius:12,padding:"10px",border:`1px solid ${b.unlocked?b.color+"33":C.border}`,opacity:b.unlocked?1:0.5,display:"flex",gap:7,alignItems:"center" }}>
            <span style={{ fontSize:18 }}>{b.icon}</span>
            <div>
              <span style={{ fontSize:9,color:b.unlocked?C.text:C.muted,fontWeight:600,lineHeight:1.3,display:"block" }}>{b.label}</span>
              <span style={{ fontSize:8,color:b.unlocked?b.color:C.muted }}>{b.unlocked?"Desbloqueado":"Bloqueado"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ════════════════ COMMUNITY ════════════════
const StoryBubble = ({ user, initials, color, isOwn }) => (
  <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0 }}>
    <div style={{ width:48,height:48,borderRadius:"50%",padding:2,background:isOwn?C.border:`linear-gradient(135deg,${color||C.primary},${C.pDark})`,display:"flex",alignItems:"center",justifyContent:"center" }}>
      {isOwn
        ? <div style={{ width:40,height:40,borderRadius:"50%",background:C.card,border:`2px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,color:C.muted }}>+</div>
        : <div style={{ width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${color}66,${C.pDark}44)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff" }}>{initials}</div>
      }
    </div>
    <span style={{ fontSize:8,color:C.muted,maxWidth:46,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{isOwn?"Tu historia":user}</span>
  </div>
);

const PostCard = ({ post }) => {
  const [liked,setLiked]     = useState(post.liked||false);
  const [likes,setLikes]     = useState(post.likes);
  const [showCom,setShow]    = useState(false);
  const [comment,setComment] = useState("");
  const [comments,setComs]   = useState(post.comments||[]);

  const tColors={ photo:C.green,tip:C.amber,pr:C.primary,video:C.accent,routine:C.pLight };
  const tLabels={ photo:"📸 Foto",tip:"💡 Tip",pr:"🏆 PR",video:"🎥 Video",routine:"📋 Rutina" };

  return (
    <div style={{ background:C.card,borderRadius:17,overflow:"hidden",border:`1px solid ${C.border}`,marginBottom:9 }}>
      <div style={{ padding:"9px 11px 7px",display:"flex",alignItems:"center",gap:8 }}>
        <Avatar size={32} initials={post.initials} color={post.color}/>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex",alignItems:"center",gap:5 }}>
            <span style={{ fontSize:11,fontWeight:700,color:C.text }}>{post.user}</span>
            {post.verified&&<span style={{ fontSize:9,color:C.primary }}>✓</span>}
          </div>
          <div style={{ fontSize:8,color:C.muted }}>{post.time} · <span style={{ color:tColors[post.type]||C.muted }}>{tLabels[post.type]||post.type}</span></div>
        </div>
        <button style={{ background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:13 }}>···</button>
      </div>

      {post.text && <div style={{ padding:"0 11px 7px",fontSize:10,color:C.muted,lineHeight:1.6 }}>{post.text}{post.tags&&post.tags.map(t=><span key={t} style={{ color:C.pLight,marginLeft:3 }}>#{t}</span>)}</div>}

      {post.image && (
        <div style={{ width:"100%",aspectRatio:"4/3",background:post.imageBg||`linear-gradient(135deg,${post.color}33,${C.pDark}44)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,position:"relative" }}>
          <span style={{ opacity:0.6 }}>{post.imageEmoji||"🏋️"}</span>
          {post.imageLabel && <div style={{ position:"absolute",bottom:7,left:7,background:"rgba(0,0,0,0.65)",borderRadius:6,padding:"2px 7px",fontSize:9,color:"#fff",fontWeight:600 }}>{post.imageLabel}</div>}
        </div>
      )}

      {post.type==="pr"&&post.prData&&(
        <div style={{ margin:"0 11px 7px",background:`linear-gradient(135deg,${C.primary}22,${C.pDark}22)`,border:`1px solid ${C.primary}44`,borderRadius:11,padding:"9px 11px",display:"flex",alignItems:"center",gap:9 }}>
          <span style={{ fontSize:26 }}>🏆</span>
          <div>
            <div style={{ fontSize:8,color:C.muted,textTransform:"uppercase",letterSpacing:"0.5px" }}>Récord personal</div>
            <div style={{ fontSize:15,fontWeight:800,color:C.primary,fontFamily:"'DM Mono',monospace" }}>{post.prData.value}</div>
            <div style={{ fontSize:9,color:C.muted }}>{post.prData.exercise} <span style={{ color:C.green }}>+{post.prData.improvement}</span></div>
          </div>
        </div>
      )}

      {post.type==="tip"&&post.tipData&&(
        <div style={{ margin:"0 11px 7px",background:C.amber+"15",border:`1px solid ${C.amber}33`,borderRadius:11,padding:"9px 11px" }}>
          <div style={{ fontSize:8,color:C.amber,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:3 }}>💡 Consejo</div>
          <div style={{ fontSize:10,color:C.text,lineHeight:1.6 }}>{post.tipData}</div>
        </div>
      )}

      {post.type==="routine"&&post.routineData&&(
        <div style={{ margin:"0 11px 7px",background:C.surface,borderRadius:11,padding:"9px 11px",border:`1px solid ${C.border}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
            <div style={{ fontSize:10,fontWeight:700,color:C.text }}>{post.routineData.name}</div>
            <Tag color={C.pLight}>{post.routineData.level}</Tag>
          </div>
          {post.routineData.exercises.map((ex,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:6,padding:"3px 0",borderBottom:i<post.routineData.exercises.length-1?`1px solid ${C.border}`:"none" }}>
              <span style={{ fontSize:11 }}>{ex.icon}</span>
              <span style={{ fontSize:9,color:C.muted,flex:1 }}>{ex.name}</span>
              <span style={{ fontSize:8,color:C.pLight,fontFamily:"'DM Mono',monospace" }}>{ex.sets}</span>
            </div>
          ))}
          <button style={{ marginTop:7,width:"100%",padding:"6px",borderRadius:8,background:C.primary+"22",border:`1px solid ${C.primary}44`,color:C.primary,fontSize:9,fontWeight:700,cursor:"pointer" }}>Guardar rutina ↓</button>
        </div>
      )}

      <div style={{ padding:"5px 11px 7px",display:"flex",alignItems:"center",gap:2,borderTop:`1px solid ${C.border}` }}>
        <button onClick={()=>{ setLiked(l=>!l); setLikes(n=>liked?n-1:n+1); }} style={{ background:liked?C.accent+"18":"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:3,padding:"4px 7px",borderRadius:16,transition:"all .15s" }}>
          <span style={{ fontSize:12,transform:liked?"scale(1.2)":"scale(1)",transition:"transform .15s",display:"inline-block" }}>{liked?"❤️":"🤍"}</span>
          <span style={{ fontSize:9,color:liked?C.accent:C.muted,fontWeight:liked?700:400 }}>{likes}</span>
        </button>
        <button onClick={()=>setShow(s=>!s)} style={{ background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:3,padding:"4px 7px",borderRadius:16 }}>
          <span style={{ fontSize:12 }}>💬</span>
          <span style={{ fontSize:9,color:C.muted }}>{comments.length}</span>
        </button>
        <button style={{ background:"none",border:"none",cursor:"pointer",padding:"4px 7px",display:"flex",alignItems:"center",gap:3,borderRadius:16 }}>
          <span style={{ fontSize:12 }}>↗</span><span style={{ fontSize:9,color:C.muted }}>Compartir</span>
        </button>
        <button style={{ background:"none",border:"none",cursor:"pointer",padding:"4px 7px",marginLeft:"auto" }}><span style={{ fontSize:12 }}>🔖</span></button>
      </div>

      {showCom && (
        <div style={{ borderTop:`1px solid ${C.border}`,padding:"7px 11px 9px" }}>
          {comments.map((c,i)=>(
            <div key={i} style={{ display:"flex",gap:5,alignItems:"flex-start",marginBottom:6 }}>
              <Avatar size={20} initials={c.initials} color={c.color}/>
              <div style={{ background:C.surface,borderRadius:8,padding:"4px 8px",flex:1 }}>
                <div style={{ fontSize:9,fontWeight:700,color:C.text,marginBottom:1 }}>{c.user}</div>
                <div style={{ fontSize:9,color:C.muted,lineHeight:1.4 }}>{c.text}</div>
              </div>
            </div>
          ))}
          <div style={{ display:"flex",gap:5,alignItems:"center" }}>
            <Avatar size={20} initials="TÚ" color={C.primary}/>
            <div style={{ flex:1,display:"flex",background:C.surface,borderRadius:16,border:`1px solid ${C.border}`,overflow:"hidden" }}>
              <input value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&comment.trim()){ setComs(c=>[...c,{ user:"Tú",initials:"TÚ",color:C.primary,text:comment }]); setComment(""); } }} placeholder="Comentar..." style={{ flex:1,background:"transparent",border:"none",outline:"none",padding:"6px 9px",fontSize:9,color:C.text }}/>
              <button onClick={()=>{ if(comment.trim()){ setComs(c=>[...c,{ user:"Tú",initials:"TÚ",color:C.primary,text:comment }]); setComment(""); } }} style={{ background:"none",border:"none",cursor:"pointer",padding:"0 9px",color:C.primary,fontSize:12,fontWeight:700 }}>↑</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CreatePostModal = ({ onClose, onPost }) => {
  const [text,setText]   = useState("");
  const [type,setType]   = useState("photo");
  const [imgPrev,setImg] = useState(null);
  const fileRef          = useRef();

  const types=[
    { id:"photo",  label:"📸 Foto",  color:C.green  },
    { id:"tip",    label:"💡 Tip",   color:C.amber  },
    { id:"pr",     label:"🏆 PR",    color:C.primary},
    { id:"routine",label:"📋 Rutina",color:C.pLight },
    { id:"video",  label:"🎥 Video", color:C.accent },
  ];
  const pholder={ photo:"¿Qué quieres compartir?",tip:"Comparte un consejo...",pr:"¿Cuál fue tu récord?",routine:"Describe tu rutina...",video:"Descripción del video..." };
  const handleFile=e=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>setImg(ev.target.result); r.readAsDataURL(f); };
  const canPost=text.trim()||imgPrev;

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:100,display:"flex",alignItems:"flex-end" }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ width:"100%",background:C.surface,borderRadius:"20px 20px 0 0",padding:"16px 13px 24px",border:`1px solid ${C.border}` }}>
        <div style={{ width:30,height:4,background:C.border,borderRadius:2,margin:"0 auto 12px" }}/>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
          <span style={{ fontSize:13,fontWeight:800,color:C.text,fontFamily:"'Syne',sans-serif" }}>Nueva publicación</span>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:15 }}>✕</button>
        </div>
        <div style={{ display:"flex",gap:5,overflowX:"auto",paddingBottom:9,marginBottom:9 }}>
          {types.map(t=>(
            <button key={t.id} onClick={()=>setType(t.id)} style={{ flexShrink:0,padding:"4px 9px",borderRadius:16,fontSize:10,fontWeight:600,cursor:"pointer",background:type===t.id?t.color+"22":C.card,border:`1px solid ${type===t.id?t.color:C.border}`,color:type===t.id?t.color:C.muted,transition:"all .15s" }}>{t.label}</button>
          ))}
        </div>
        <div style={{ display:"flex",gap:7,marginBottom:10 }}>
          <Avatar size={30} initials="TÚ" color={C.primary}/>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={pholder[type]} style={{ flex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:"8px 10px",fontSize:11,color:C.text,resize:"none",outline:"none",minHeight:66,lineHeight:1.6 }}/>
        </div>
        {imgPrev && (
          <div style={{ position:"relative",marginBottom:9,borderRadius:11,overflow:"hidden" }}>
            <img src={imgPrev} alt="" style={{ width:"100%",maxHeight:140,objectFit:"cover" }}/>
            <button onClick={()=>setImg(null)} style={{ position:"absolute",top:5,right:5,width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,0.7)",border:"none",cursor:"pointer",color:"#fff",fontSize:10 }}>✕</button>
          </div>
        )}
        <div style={{ display:"flex",gap:5,marginBottom:12 }}>
          <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display:"none" }} onChange={handleFile}/>
          {[{ icon:"🖼",label:"Imagen",fn:()=>fileRef.current.click() },{ icon:"🎥",label:"Video",fn:()=>fileRef.current.click() },{ icon:"📍",label:"Lugar",fn:()=>{} },{ icon:"💪",label:"Ejerc.",fn:()=>{} }].map(b=>(
            <button key={b.label} onClick={b.fn} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:C.card,border:`1px solid ${C.border}`,borderRadius:9,padding:"6px 9px",cursor:"pointer",flex:1 }}>
              <span style={{ fontSize:13 }}>{b.icon}</span>
              <span style={{ fontSize:8,color:C.muted }}>{b.label}</span>
            </button>
          ))}
        </div>
        <button onClick={()=>{ if(!canPost)return; onPost({ text,type,image:!!imgPrev,imageEmoji:"🏋️",initials:"TÚ",color:C.primary,user:"Tú",time:"ahora mismo",likes:0,comments:[] }); onClose(); }} style={{ width:"100%",padding:"12px",borderRadius:12,background:canPost?`linear-gradient(135deg,${C.primary},${C.pDark})`:C.border,border:"none",color:canPost?"#fff":C.muted,fontSize:12,fontWeight:700,cursor:canPost?"pointer":"not-allowed",transition:"all .2s" }}>Publicar</button>
      </div>
    </div>
  );
};

const CommunityScreen = () => {
  const [tab,setTab]           = useState("feed");
  const [showCreate,setCreate] = useState(false);
  const [posts,setPosts]       = useState([
    { id:1,user:"María G.",initials:"MG",color:C.accent,time:"hace 2h",type:"pr",text:"¡Nuevo PR en sentadilla después de 6 meses! 🎉 La constancia siempre gana.",tags:["sentadilla","pr"],prData:{ value:"100 kg",exercise:"Sentadilla",improvement:"10 kg" },likes:24,liked:false,comments:[{ user:"Luis R.",initials:"LR",color:C.green,text:"¡Increíble! 💪" }] },
    { id:2,user:"Coach Luis",initials:"CL",color:C.green,time:"hace 4h",verified:true,type:"tip",text:"Nutrición post-entrenamiento:",tags:["nutricion"],tipData:"Come 20–40g de proteína en los primeros 45 min post-entreno. Combínala con carbohidratos de rápida absorción para maximizar síntesis muscular.",likes:67,liked:false,comments:[] },
    { id:3,user:"Sofía M.",initials:"SM",color:C.amber,time:"hace 6h",type:"photo",text:"Día de piernas completado 🔥",tags:["piernas","gym"],image:true,imageEmoji:"🦵",imageBg:`linear-gradient(135deg,${C.amber}33,${C.pDark}55)`,imageLabel:"5:30 AM · Gym",likes:41,liked:true,comments:[{ user:"María G.",initials:"MG",color:C.accent,text:"¡Increíble! 🔥" }] },
    { id:4,user:"Carlos T.",initials:"CT",color:C.pLight,time:"hace 1d",type:"routine",text:"Mi Push Day favorito — 3 meses con resultados increíbles:",tags:["push"],routineData:{ name:"Push Day — Tren Superior",level:"Intermedio",exercises:[{ icon:"🏋️",name:"Press banca",sets:"4×10" },{ icon:"💪",name:"Press inclinado",sets:"3×12" },{ icon:"⬆️",name:"Press militar",sets:"4×10" },{ icon:"🔽",name:"Fondos",sets:"3×12" }] },likes:89,liked:false,comments:[] },
  ]);

  const challenges=[
    { name:"30 días Push",icon:"💪",pct:70,color:C.primary,members:234,days:9  },
    { name:"500 flexiones",icon:"🏆",pct:45,color:C.amber, members:112,days:3  },
    { name:"Correr 5k",   icon:"🏃",pct:20,color:C.green, members:78, days:21 },
  ];

  const topUsers=[
    { name:"María G.",  initials:"MG",color:C.accent, pts:1240,badge:"🔥" },
    { name:"Coach Luis",initials:"CL",color:C.green,  pts:1180,badge:"⭐" },
    { name:"Sofía M.",  initials:"SM",color:C.amber,  pts:980, badge:"💪" },
    { name:"Carlos T.", initials:"CT",color:C.pLight, pts:870, badge:"🏃" },
    { name:"Ana K.",    initials:"AK",color:C.primary,pts:760, badge:"🧘" },
  ];

  const stories=[
    { user:"María G.",initials:"MG",color:C.accent  },
    { user:"Luis R.", initials:"LR",color:C.green   },
    { user:"Sofía",   initials:"SM",color:C.amber   },
    { user:"Carlos",  initials:"CT",color:C.pLight  },
  ];

  return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",background:C.bg,overflow:"hidden" }}>
      <div style={{ background:C.surface,padding:"11px 13px 0",borderBottom:`1px solid ${C.border}`,flexShrink:0 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9 }}>
          <span style={{ fontSize:17,fontWeight:800,color:C.text,fontFamily:"'Syne',sans-serif" }}>Comunidad</span>
          <div style={{ display:"flex",gap:7 }}>
            <button style={{ background:"none",border:"none",cursor:"pointer",fontSize:15,color:C.muted }}>🔔</button>
            <button style={{ background:"none",border:"none",cursor:"pointer",fontSize:15,color:C.muted }}>🔍</button>
          </div>
        </div>
        <div style={{ display:"flex" }}>
          {[["feed","Feed"],["retos","Retos"],["ranking","Top"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setTab(id)} style={{ flex:1,background:"none",border:"none",cursor:"pointer",padding:"6px 0",fontSize:11,fontWeight:tab===id?700:400,color:tab===id?C.primary:C.muted,borderBottom:`2px solid ${tab===id?C.primary:"transparent"}`,transition:"all .2s" }}>{lbl}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1,overflowY:"auto" }}>
        {tab==="feed" && (
          <div>
            <div style={{ padding:"11px 13px 7px",display:"flex",gap:9,overflowX:"auto" }}>
              <StoryBubble isOwn/>
              {stories.map((s,i)=><StoryBubble key={i} {...s}/>)}
            </div>
            <div style={{ margin:"0 13px 10px",background:C.card,borderRadius:13,padding:"9px 11px",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:7 }}>
              <Avatar size={28} initials="TÚ" color={C.primary}/>
              <button onClick={()=>setCreate(true)} style={{ flex:1,background:C.surface,border:`1px solid ${C.border}`,borderRadius:17,padding:"7px 11px",textAlign:"left",fontSize:10,color:C.muted,cursor:"pointer" }}>¿Qué quieres compartir hoy?</button>
              <button onClick={()=>setCreate(true)} style={{ background:C.primary,border:"none",borderRadius:17,padding:"5px 9px",color:"#fff",fontSize:9,fontWeight:700,cursor:"pointer",flexShrink:0 }}>+ Post</button>
            </div>
            <div style={{ padding:"0 13px 7px",display:"flex",gap:5 }}>
              {[{ icon:"📸",label:"Foto",color:C.green },{ icon:"💡",label:"Tip",color:C.amber },{ icon:"🏆",label:"PR",color:C.primary },{ icon:"📋",label:"Rutina",color:C.pLight }].map(a=>(
                <button key={a.label} onClick={()=>setCreate(true)} style={{ flex:1,background:a.color+"15",border:`1px solid ${a.color}33`,borderRadius:9,padding:"6px 3px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2 }}>
                  <span style={{ fontSize:13 }}>{a.icon}</span>
                  <span style={{ fontSize:8,color:a.color,fontWeight:600 }}>{a.label}</span>
                </button>
              ))}
            </div>
            <div style={{ padding:"0 13px 60px" }}>
              {posts.map(p=><PostCard key={p.id} post={p}/>)}
            </div>
          </div>
        )}

        {tab==="retos" && (
          <div style={{ padding:"13px",paddingBottom:60 }}>
            <div style={{ fontSize:10,color:C.muted,marginBottom:11 }}>Únete a retos colectivos — gana XP y badges</div>
            {challenges.map((ch,i)=>(
              <div key={i} style={{ background:C.card,borderRadius:17,padding:"13px",marginBottom:9,border:`1px solid ${C.border}` }}>
                <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:9 }}>
                  <div style={{ width:38,height:38,borderRadius:11,background:ch.color+"22",border:`1px solid ${ch.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{ch.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11,fontWeight:700,color:C.text }}>{ch.name}</div>
                    <div style={{ fontSize:8,color:C.muted,marginTop:1 }}>{ch.members} participantes · {ch.days} días restantes</div>
                  </div>
                  <Tag color={ch.color}>{ch.pct}%</Tag>
                </div>
                <div style={{ background:C.surface,borderRadius:4,height:5,marginBottom:9,overflow:"hidden" }}>
                  <div style={{ width:`${ch.pct}%`,background:`linear-gradient(90deg,${ch.color},${ch.color}99)`,height:5,borderRadius:4,transition:"width 0.8s ease" }}/>
                </div>
                <div style={{ display:"flex",gap:4 }}>
                  {[-4,-3,-2,-1,0].map(d=>(
                    <div key={d} style={{ flex:1,height:30,borderRadius:6,background:d<0?ch.color+"33":C.surface,border:`1px solid ${d<0?ch.color+"55":C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:d<0?11:9,color:d<0?ch.color:C.muted }}>{d<0?"✓":"·"}</div>
                  ))}
                </div>
                <button style={{ marginTop:9,width:"100%",padding:"8px",borderRadius:9,background:`linear-gradient(135deg,${ch.color},${ch.color}99)`,border:"none",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer" }}>Ver reto completo →</button>
              </div>
            ))}
            <div style={{ background:C.card,borderRadius:17,padding:"13px",border:`1px solid ${C.border}`,textAlign:"center" }}>
              <div style={{ fontSize:20,marginBottom:5 }}>🎯</div>
              <div style={{ fontSize:12,fontWeight:700,color:C.text,marginBottom:4 }}>Crea tu propio reto</div>
              <div style={{ fontSize:10,color:C.muted,marginBottom:11,lineHeight:1.5 }}>Invita a tu comunidad a un desafío personalizado</div>
              <button style={{ width:"100%",padding:"9px",borderRadius:9,background:C.primary+"22",border:`1px solid ${C.primary}44`,color:C.primary,fontSize:10,fontWeight:700,cursor:"pointer" }}>+ Crear reto</button>
            </div>
          </div>
        )}

        {tab==="ranking" && (
          <div style={{ padding:"13px",paddingBottom:60 }}>
            <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"center",gap:6,marginBottom:18,padding:"14px 0" }}>
              {[topUsers[1],topUsers[0],topUsers[2]].map((u,i)=>{
                const heights=["95px","124px","75px"],medals=["🥈","🥇","🥉"];
                return (
                  <div key={u.name} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1 }}>
                    <span style={{ fontSize:17 }}>{medals[i]}</span>
                    <Avatar size={i===1?42:32} initials={u.initials} color={u.color}/>
                    <span style={{ fontSize:9,fontWeight:700,color:C.text,textAlign:"center" }}>{u.name.split(" ")[0]}</span>
                    <div style={{ width:"100%",height:heights[i],borderRadius:"8px 8px 0 0",background:i===1?`linear-gradient(180deg,${C.primary},${C.pDark})`:C.card,border:`1px solid ${i===1?C.primary:C.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1 }}>
                      <span style={{ fontSize:10,fontWeight:800,color:i===1?"#fff":C.pLight,fontFamily:"'DM Mono',monospace" }}>{u.pts}</span>
                      <span style={{ fontSize:7,color:i===1?"rgba(255,255,255,0.6)":C.muted }}>pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ background:C.card,borderRadius:17,padding:"11px",border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:10,fontWeight:700,color:C.text,marginBottom:9 }}>Ranking semanal</div>
              {topUsers.map((u,i)=>(
                <div key={u.name} style={{ display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:i<topUsers.length-1?`1px solid ${C.border}`:"none" }}>
                  <span style={{ fontSize:10,color:C.muted,fontFamily:"'DM Mono',monospace",width:13,textAlign:"center" }}>#{i+1}</span>
                  <Avatar size={30} initials={u.initials} color={u.color}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10,fontWeight:700,color:C.text }}>{u.name} {u.badge}</div>
                    <div style={{ fontSize:8,color:C.muted }}>{u.pts} pts esta semana</div>
                  </div>
                  {i<3&&<div style={{ width:6,height:6,borderRadius:"50%",background:[C.amber,C.muted,"#cd7f32"][i] }}/>}
                </div>
              ))}
              <div style={{ marginTop:8,padding:"8px 10px",background:C.primary+"18",borderRadius:9,border:`1px solid ${C.primary}33`,display:"flex",alignItems:"center",gap:9 }}>
                <span style={{ fontSize:10,color:C.primary,fontFamily:"'DM Mono',monospace",width:13 }}>#12</span>
                <Avatar size={30} initials="TÚ" color={C.primary}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10,fontWeight:700,color:C.primary }}>Tú</div>
                  <div style={{ fontSize:8,color:C.muted }}>340 pts · +3 posiciones</div>
                </div>
                <Tag color={C.primary}>↑3</Tag>
              </div>
            </div>
          </div>
        )}
      </div>
      {showCreate && <CreatePostModal onClose={()=>setCreate(false)} onPost={p=>setPosts(prev=>[{ ...p,id:Date.now() },...prev])}/>}
    </div>
  );
};

// ════════════════ PROFILE ════════════════
const ProfileScreen = () => {
  const [plan,setPlan] = useState("free");

  return (
    <div style={{ flex:1,overflowY:"auto",background:C.bg }}>
      <div style={{ background:`linear-gradient(180deg,${C.primary}33,transparent)`,padding:"18px 13px 13px",textAlign:"center" }}>
        <div style={{ width:60,height:60,borderRadius:"50%",background:`linear-gradient(135deg,${C.primary},${C.pDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:700,color:"#fff",margin:"0 auto 9px",border:`3px solid ${C.primary}66` }}>DH</div>
        <div style={{ fontSize:16,fontWeight:800,color:C.text,fontFamily:"'Syne',sans-serif" }}>Daniel Hernández</div>
        <div style={{ fontSize:9,color:C.muted,marginTop:2 }}>Principiante · Objetivo: Ganar músculo</div>
        <div style={{ display:"flex",justifyContent:"center",gap:5,marginTop:7 }}>
          <Tag color={plan==="premium"?C.amber:C.muted}>{plan==="premium"?"⭐ Premium":"Gratis"}</Tag>
          <Tag color={C.green}>12 días 🔥</Tag>
        </div>
      </div>

      <div style={{ padding:"0 13px 13px" }}>
        <div style={{ display:"flex",gap:6,marginBottom:11 }}>
          {[{ label:"Sesiones",val:"47" },{ label:"Horas",val:"138" },{ label:"Semanas",val:"12" }].map(s=>(
            <div key={s.label} style={{ flex:1,background:C.card,borderRadius:11,padding:"9px",textAlign:"center",border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:15,fontWeight:800,color:C.primary,fontFamily:"'DM Mono',monospace" }}>{s.val}</div>
              <div style={{ fontSize:8,color:C.muted,marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Freemium */}
        <div style={{ background:C.card,borderRadius:15,padding:"13px",marginBottom:11,border:`1px solid ${plan==="premium"?C.amber+"44":C.border}` }}>
          <div style={{ fontSize:10,fontWeight:700,color:C.text,marginBottom:9 }}>Plan actual</div>
          <div style={{ display:"flex",gap:7,marginBottom:9 }}>
            {[{ id:"free",label:"Gratis",price:"$0 MXN",color:C.muted },{ id:"premium",label:"Premium",price:"$89/mes",color:C.amber }].map(p=>(
              <button key={p.id} onClick={()=>setPlan(p.id)} style={{ flex:1,background:plan===p.id?p.color+"22":C.surface,border:`2px solid ${plan===p.id?p.color:C.border}`,borderRadius:11,padding:"9px",cursor:"pointer",transition:"all .2s" }}>
                <div style={{ fontSize:12,fontWeight:800,color:plan===p.id?p.color:C.muted,fontFamily:"'DM Mono',monospace" }}>{p.price}</div>
                <div style={{ fontSize:9,color:plan===p.id?p.color:C.muted,marginTop:1 }}>{p.label}</div>
              </button>
            ))}
          </div>
          {plan==="free" && <div style={{ fontSize:10,color:C.muted,lineHeight:1.6,marginBottom:9 }}>Premium: IA completa, rutinas avanzadas, análisis detallados, sin publicidad.</div>}
          <button style={{ width:"100%",padding:"10px",borderRadius:11,background:plan==="premium"?`linear-gradient(135deg,${C.amber},#d97706)`:`linear-gradient(135deg,${C.primary},${C.pDark})`,border:"none",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",boxShadow:`0 6px 20px ${C.primary}44` }}>
            {plan==="premium"?"Gestionar suscripción":"Obtener Premium — $89 MXN/mes"}
          </button>
        </div>

        {/* Datos */}
        <div style={{ background:C.card,borderRadius:15,padding:"13px",marginBottom:11,border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:10,fontWeight:700,color:C.text,marginBottom:9 }}>Datos físicos</div>
          {[
            { label:"Objetivo",  val:"Ganar músculo", icon:"🎯" },
            { label:"Nivel",     val:"Principiante",  icon:"🌱" },
            { label:"Equipo",    val:"Gym completo",  icon:"🏋️" },
            { label:"Lesiones",  val:"Ninguna",       icon:"💚" },
          ].map(item=>(
            <div key={item.label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:10,color:C.muted }}>{item.icon} {item.label}</span>
              <span style={{ fontSize:10,fontWeight:700,color:C.text }}>{item.val}</span>
            </div>
          ))}
          <button style={{ marginTop:9,width:"100%",padding:"7px",background:"none",border:`1px solid ${C.border}`,borderRadius:9,color:C.muted,fontSize:10,cursor:"pointer" }}>Editar datos</button>
        </div>

        {/* Config */}
        <div style={{ background:C.card,borderRadius:15,padding:"13px",border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:10,fontWeight:700,color:C.text,marginBottom:9 }}>Configuración</div>
          {[
            { label:"Notificaciones push",            val:"Activadas" },
            { label:"Recordatorio de entrenamiento",  val:"8:00 AM"   },
            { label:"Privacidad y datos",             val:"Aceptada"  },
            { label:"Idioma",                         val:"Español"   },
          ].map((s,i)=>(
            <div key={s.label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:i<3?`1px solid ${C.border}`:"none" }}>
              <span style={{ fontSize:10,color:C.muted }}>{s.label}</span>
              <span style={{ fontSize:10,fontWeight:600,color:C.green }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ════════════════ PREMIUM PAYWALL ════════════════
const PremiumPaywallScreen = ({ onSubscribe }) => {
  const [plan, setPlan] = useState("monthly");

  const features = [
    { icon:"🤖", label:"IA adaptativa completa",       free:false, premium:true  },
    { icon:"📊", label:"Análisis avanzado de progreso", free:false, premium:true  },
    { icon:"🥗", label:"Plan nutricional personalizado",free:false, premium:true  },
    { icon:"🎥", label:"Videotutoriales HD ilimitados",  free:"3/día", premium:true  },
    { icon:"🏆", label:"Retos exclusivos Premium",      free:false, premium:true  },
    { icon:"📋", label:"Rutinas base",                  free:true,  premium:true  },
    { icon:"⊕",  label:"Comunidad",                    free:true,  premium:true  },
    { icon:"🔔", label:"Recordatorios",                 free:true,  premium:true  },
    { icon:"📢", label:"Sin publicidad",                free:false, premium:true  },
  ];

  return (
    <div style={{ flex:1, overflowY:"auto", background:C.bg }}>
      {/* Header con gradiente dorado */}
      <div style={{ background:`linear-gradient(160deg,#1A1400,#2A1F00,${C.bg})`, padding:"22px 14px 16px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, left:"50%", transform:"translateX(-50%)", width:180, height:180, borderRadius:"50%", background:C.amber+"11", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", width:100, height:100, borderRadius:"50%", background:C.amber+"18", pointerEvents:"none" }}/>
        <div style={{ fontSize:34, marginBottom:8 }}>⭐</div>
        <div style={{ fontSize:20, fontWeight:800, color:C.amber, fontFamily:"'Syne',sans-serif", lineHeight:1.1 }}>Routine Premium</div>
        <div style={{ fontSize:10, color:C.muted, marginTop:6, lineHeight:1.6 }}>Desbloquea tu entrenador personal con IA completo.<br/>6× más barato que la competencia internacional.</div>
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:10 }}>
          <Tag color={C.amber}>$89 MXN/mes</Tag>
          <Tag color={C.green}>TIR 36.29%</Tag>
          <Tag color={C.primary}>IA completa</Tag>
        </div>
      </div>

      <div style={{ padding:"0 13px 14px" }}>
        {/* Selector de plan */}
        <div style={{ display:"flex", gap:7, margin:"14px 0 14px", background:C.card, borderRadius:16, padding:"5px", border:`1px solid ${C.border}` }}>
          {[
            { id:"monthly", label:"Mensual",   price:"$89",  sub:"MXN/mes",   badge:null         },
            { id:"annual",  label:"Anual",      price:"$900", sub:"MXN/año",   badge:"Ahorra 16%" },
          ].map(p=>(
            <button key={p.id} onClick={()=>setPlan(p.id)} style={{
              flex:1, background:plan===p.id?C.amber+"22":"transparent",
              border:`2px solid ${plan===p.id?C.amber:"transparent"}`,
              borderRadius:12, padding:"10px 6px", cursor:"pointer", transition:"all .2s", textAlign:"center", position:"relative",
            }}>
              {p.badge && <div style={{ position:"absolute", top:-8, right:4, background:C.green, color:"#000", fontSize:7, fontWeight:800, borderRadius:10, padding:"2px 6px" }}>{p.badge}</div>}
              <div style={{ fontSize:16, fontWeight:800, color:plan===p.id?C.amber:C.text, fontFamily:"'DM Mono',monospace" }}>{p.price}</div>
              <div style={{ fontSize:8, color:plan===p.id?C.amber:C.muted, marginTop:1 }}>{p.sub}</div>
              <div style={{ fontSize:9, fontWeight:700, color:plan===p.id?C.amber:C.muted, marginTop:3 }}>{p.label}</div>
            </button>
          ))}
        </div>

        {/* Comparativa libre vs premium */}
        <div style={{ background:C.card, borderRadius:16, padding:"12px", marginBottom:14, border:`1px solid ${C.border}` }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 60px 60px", gap:0, marginBottom:8 }}>
            <div style={{ fontSize:9, color:C.muted, fontWeight:700 }}>FUNCIONALIDAD</div>
            <div style={{ fontSize:9, color:C.muted, fontWeight:700, textAlign:"center" }}>GRATIS</div>
            <div style={{ fontSize:9, color:C.amber, fontWeight:700, textAlign:"center" }}>⭐ PRO</div>
          </div>
          {features.map((f,i)=>(
            <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 60px 60px", gap:0, padding:"6px 0", borderBottom:i<features.length-1?`1px solid ${C.border}`:"none", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ fontSize:13 }}>{f.icon}</span>
                <span style={{ fontSize:9, color:C.text }}>{f.label}</span>
              </div>
              <div style={{ textAlign:"center" }}>
                {f.free===true
                  ? <span style={{ color:C.green, fontSize:12 }}>✓</span>
                  : f.free===false
                    ? <span style={{ color:C.red, fontSize:12 }}>✗</span>
                    : <span style={{ color:C.amber, fontSize:8, fontWeight:700 }}>{f.free}</span>
                }
              </div>
              <div style={{ textAlign:"center" }}>
                <span style={{ color:C.amber, fontSize:12 }}>✓</span>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonios */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"1px", fontWeight:700, marginBottom:8 }}>Lo que dicen nuestros usuarios</div>
          {[
            { user:"María G.", init:"MG", color:C.accent, text:"Bajé 4 kg en 30 días. La IA realmente se adapta a cómo me siento cada día.", stars:5 },
            { user:"Carlos T.", init:"CT", color:C.primary, text:"6× más barato que Fitbod y funciona mejor. 100% en español.", stars:5 },
          ].map((t,i)=>(
            <div key={i} style={{ background:C.card, borderRadius:14, padding:"11px 12px", marginBottom:7, border:`1px solid ${C.amber}22` }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <Avatar size={28} initials={t.init} color={t.color}/>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:C.text }}>{t.user}</div>
                  <div style={{ fontSize:10, color:C.amber }}>{"★".repeat(t.stars)}</div>
                </div>
              </div>
              <div style={{ fontSize:10, color:C.muted, lineHeight:1.6, fontStyle:"italic" }}>"{t.text}"</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={onSubscribe} style={{
          width:"100%", padding:"15px", borderRadius:16,
          background:`linear-gradient(135deg,${C.amber},#d97706)`,
          border:"none", color:"#000", fontSize:13, fontWeight:800, cursor:"pointer",
          boxShadow:`0 10px 30px ${C.amber}44`, marginBottom:8,
        }}>
          {plan==="monthly" ? "Suscribirme — $89 MXN/mes ⭐" : "Suscribirme — $900 MXN/año ⭐"}
        </button>
        <div style={{ fontSize:9, color:C.muted, textAlign:"center", lineHeight:1.6 }}>
          Cancela cuando quieras · Sin compromisos · Pago seguro con Stripe / MercadoPago
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:10, marginTop:9 }}>
          {["Stripe","MercadoPago","PayPal"].map(p=>(
            <div key={p} style={{ background:C.card, borderRadius:8, padding:"4px 9px", border:`1px solid ${C.border}` }}>
              <span style={{ fontSize:9, color:C.muted, fontWeight:600 }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ════════════════ HOME PREMIUM ════════════════
const HomePremiumScreen = () => {
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMsg, setAiMsg]   = useState("");
  const [chat, setChat]     = useState([
    { from:"ai", text:"¡Hola Daniel! 💪 Hoy tienes Push Day. Detecté que dormiste bien (8/10). Tu intensidad es ALTA. ¿Tienes alguna duda sobre tu entrenamiento de hoy?" },
  ]);

  const suggestions = [
    "¿Cuántas calorías debería consumir hoy?",
    "¿Puedo cambiar las aperturas por otro ejercicio?",
    "¿Cómo mejoro mi press de banca?",
  ];

  const sendMsg = (msg) => {
    const text = msg || aiMsg;
    if (!text.trim()) return;
    const responses = {
      "calorías": "Con tu objetivo de ganar músculo y hoy siendo día de entreno, recomiendo 2,400–2,600 kcal con al menos 140g de proteína. ¡Tu sesión quema aprox. 380 kcal!",
      "cambiar": "¡Claro! Puedes sustituir aperturas por cruces en polea, que activa el pectoral de forma similar. Mismo volumen: 3×15.",
      "press": "Para mejorar tu press: 1) Trabaja la técnica — arco leve y pies firmes. 2) Añade series de 4×6 con más peso 1 vez/semana. 3) Fortalece tríceps y deltoides anteriores.",
    };
    const key = Object.keys(responses).find(k => text.toLowerCase().includes(k));
    const reply = key ? responses[key] : "Excelente pregunta. Según tu historial de 47 sesiones, te recomiendo mantener tu cadencia actual y aumentar carga un 5% cada 2 semanas.";
    setChat(c=>[...c, { from:"user", text }, { from:"ai", text:reply }]);
    setAiMsg("");
  };

  const exercises = [
    { name:"Press de banca",  sets:"4×10", kg:"70 kg", done:true,  muscle:"Pecho",   trend:"+5kg vs mes pasado" },
    { name:"Press inclinado", sets:"3×12", kg:"55 kg", done:true,  muscle:"Pecho",   trend:"nuevo ejercicio" },
    { name:"Aperturas",       sets:"3×15", kg:"16 kg", done:false, muscle:"Pecho",   trend:"técnica mejorada" },
    { name:"Press militar",   sets:"4×10", kg:"50 kg", done:false, muscle:"Hombros", trend:"+2.5kg vs mes pasado" },
    { name:"Fondos",          sets:"3×12", kg:"—",     done:false, muscle:"Tríceps", trend:"peso corporal" },
  ];

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:C.bg, overflow:"hidden" }}>
      {/* Header Premium */}
      <div style={{ padding:"12px 13px 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexShrink:0 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ fontSize:10, color:C.muted }}>Lunes, 5 de mayo</div>
            <div style={{ background:C.amber+"22", border:`1px solid ${C.amber}44`, borderRadius:10, padding:"1px 6px", display:"flex", alignItems:"center", gap:3 }}>
              <span style={{ fontSize:8 }}>⭐</span>
              <span style={{ fontSize:8, fontWeight:700, color:C.amber }}>Premium</span>
            </div>
          </div>
          <div style={{ fontSize:17, fontWeight:800, color:C.text, fontFamily:"'Syne',sans-serif", lineHeight:1.2, marginTop:2 }}>Hola, <span style={{ color:C.amber }}>Daniel</span> ⭐</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <div style={{ display:"flex", alignItems:"center", gap:4, background:"#2A1500", border:`1px solid ${C.amber}44`, borderRadius:20, padding:"4px 8px" }}>
            <span style={{ fontSize:12 }}>🔥</span>
            <span style={{ fontSize:11, fontWeight:700, color:C.amber }}>12</span>
          </div>
          <Avatar size={32} initials="DH" color={C.amber}/>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto" }}>
        {/* IA Check-in completado (premium muestra más detalle) */}
        <div style={{ margin:"10px 13px 0", background:`linear-gradient(135deg,${C.amber}18,${C.primary}12)`, borderRadius:15, padding:"12px", border:`1px solid ${C.amber}33` }}>
          <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:10, background:C.amber+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.amber, marginBottom:4 }}>IA Premium · Análisis completo de hoy</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, marginBottom:7 }}>
                {[
                  { label:"Sueño",    val:"8/10 😴", color:C.green   },
                  { label:"Energía",  val:"9/10 ⚡",  color:C.green   },
                  { label:"Intensidad",val:"ALTA 🔥", color:C.amber   },
                  { label:"VO₂ est.", val:"42.3",    color:C.primary },
                ].map(m=>(
                  <div key={m.label} style={{ background:"rgba(0,0,0,0.25)", borderRadius:8, padding:"5px 7px" }}>
                    <div style={{ fontSize:8, color:C.muted }}>{m.label}</div>
                    <div style={{ fontSize:10, fontWeight:800, color:m.color }}>{m.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:10, color:C.muted, lineHeight:1.6, marginBottom:7 }}>
                Excelente estado hoy. He ajustado el volumen al 110% y añadido una serie extra de press inclinado para maximizar hipertrofia pectoral, tu grupo muscular prioritario.
              </div>
              <button onClick={()=>setAiOpen(a=>!a)} style={{ background:C.amber+"22", border:`1px solid ${C.amber}44`, borderRadius:10, padding:"5px 10px", color:C.amber, fontSize:10, fontWeight:700, cursor:"pointer" }}>
                {aiOpen ? "Cerrar chat ↑" : "💬 Preguntar a la IA →"}
              </button>
            </div>
          </div>
        </div>

        {/* Chatbot IA 24/7 */}
        {aiOpen && (
          <div style={{ margin:"8px 13px 0", background:C.card, borderRadius:15, border:`1px solid ${C.primary}44`, overflow:"hidden" }}>
            <div style={{ padding:"9px 11px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ width:24, height:24, borderRadius:7, background:C.primary+"33", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12 }}>🤖</div>
              <span style={{ fontSize:10, fontWeight:700, color:C.primary }}>Chatbot IA 24/7</span>
              <Tag color={C.amber}>Premium</Tag>
            </div>
            <div style={{ height:130, overflowY:"auto", padding:"9px 11px", display:"flex", flexDirection:"column", gap:7 }}>
              {chat.map((m,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:m.from==="user"?"flex-end":"flex-start" }}>
                  <div style={{
                    maxWidth:"82%", borderRadius:m.from==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px",
                    background:m.from==="user"?C.primary:C.surface,
                    padding:"7px 10px",
                    border:m.from==="ai"?`1px solid ${C.border}`:"none",
                  }}>
                    <div style={{ fontSize:9, color:m.from==="user"?"#fff":C.muted, lineHeight:1.55 }}>{m.text}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Sugerencias rápidas */}
            <div style={{ padding:"6px 9px", display:"flex", gap:5, overflowX:"auto", borderTop:`1px solid ${C.border}` }}>
              {suggestions.map((s,i)=>(
                <button key={i} onClick={()=>sendMsg(s)} style={{ flexShrink:0, background:C.primary+"18", border:`1px solid ${C.primary}33`, borderRadius:12, padding:"4px 9px", fontSize:8, color:C.pLight, cursor:"pointer", whiteSpace:"nowrap" }}>{s}</button>
              ))}
            </div>
            <div style={{ display:"flex", padding:"7px 9px", gap:6, borderTop:`1px solid ${C.border}` }}>
              <input value={aiMsg} onChange={e=>setAiMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Pregunta lo que quieras..." style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"6px 10px", fontSize:10, color:C.text, outline:"none" }}/>
              <button onClick={()=>sendMsg()} style={{ background:C.primary, border:"none", borderRadius:10, width:30, height:30, cursor:"pointer", color:"#fff", fontSize:13, fontWeight:700 }}>↑</button>
            </div>
          </div>
        )}

        {/* Análisis avanzado (solo premium) */}
        <div style={{ margin:"10px 13px 0", background:C.card, borderRadius:15, padding:"12px", border:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:9 }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.text }}>Análisis premium de esta semana</div>
            <Tag color={C.amber}>⭐ Exclusivo</Tag>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {[
              { label:"Volumen total", val:"18,450 kg", sub:"↑12% vs semana ant.", color:C.green   },
              { label:"Fatiga acum.",  val:"Óptima",    sub:"zona de adaptación",  color:C.primary },
            ].map(m=>(
              <div key={m.label} style={{ flex:1, background:C.surface, borderRadius:10, padding:"9px" }}>
                <div style={{ fontSize:11, fontWeight:800, color:m.color, fontFamily:"'DM Mono',monospace", lineHeight:1.2 }}>{m.val}</div>
                <div style={{ fontSize:8, color:C.muted, marginTop:3 }}>{m.label}</div>
                <div style={{ fontSize:8, color:m.color, marginTop:2 }}>{m.sub}</div>
              </div>
            ))}
          </div>
          {/* Mini gráfica de carga semanal */}
          <div style={{ marginTop:9 }}>
            <div style={{ fontSize:8, color:C.muted, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.5px" }}>Carga de entrenamiento · 7 días</div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:40 }}>
              {[55,70,45,80,60,95,0].map((v,i)=>(
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                  <div style={{ width:"100%", borderRadius:"3px 3px 0 0", height:`${(v/100)*34}px`, background:i===5?C.amber:(v>0?C.primary+"66":C.surface), border:`1px solid ${i===5?C.amber:v>0?C.primary+"44":C.border}` }}/>
                  <span style={{ fontSize:7, color:C.muted }}>{"LMXJVSD"[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rutina del día — versión premium con tendencias */}
        <div style={{ margin:"10px 13px 0", borderRadius:15, overflow:"hidden" }}>
          <div style={{ background:`linear-gradient(135deg,${C.amber}BB,#d97706)`, padding:"13px", position:"relative" }}>
            <div style={{ position:"absolute", right:-15, top:-15, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }}/>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
              <Tag color="#000">⭐ Push Day Premium</Tag>
            </div>
            <div style={{ fontSize:15, fontWeight:800, color:"#000", fontFamily:"'Syne',sans-serif", lineHeight:1.2 }}>Tren Superior<br/>+1 serie extra · IA ajustada</div>
            <div style={{ display:"flex", gap:5, marginTop:7, flexWrap:"wrap" }}>
              {["⏱ 55 min","5 ejercicios","💪 Alta intensidad","🎯 Máx. hipertrofia"].map(t=>(
                <span key={t} style={{ fontSize:8, color:"rgba(0,0,0,0.75)", background:"rgba(0,0,0,0.12)", borderRadius:20, padding:"2px 7px" }}>{t}</span>
              ))}
            </div>
            <button style={{ marginTop:9, background:"#000", borderRadius:9, padding:"7px 15px", border:"none", color:C.amber, fontSize:10, fontWeight:800, cursor:"pointer" }}>Comenzar →</button>
          </div>
        </div>

        {/* Lista ejercicios con tendencias (solo premium) */}
        <div style={{ padding:"10px 13px 14px" }}>
          <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"1px", marginBottom:7, fontWeight:700 }}>Ejercicios + análisis IA</div>
          {exercises.map((ex,i)=>(
            <div key={i} style={{ background:C.card, borderRadius:12, padding:"9px 11px", marginBottom:6, border:`1px solid ${ex.done?C.amber+"33":C.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                <div style={{ width:30, height:30, borderRadius:8, background:ex.done?C.amber+"22":C.surface, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>🏋️</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.text }}>{ex.name}</div>
                  <div style={{ fontSize:8, color:C.muted, marginTop:1 }}>{ex.sets} · {ex.kg} · <span style={{ color:C.amber }}>{ex.muscle}</span></div>
                  <div style={{ fontSize:8, color:C.green, marginTop:1 }}>📈 {ex.trend}</div>
                </div>
                <div style={{ width:18, height:18, borderRadius:"50%", background:ex.done?C.amber:"transparent", border:`2px solid ${ex.done?C.amber:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, color:"#000", flexShrink:0 }}>{ex.done?"✓":""}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ════════════════ PHONE FRAME ════════════════
const PhoneFrame = ({ children, label }) => (
  <div style={{ display:"flex",flexDirection:"column",alignItems:"center" }}>
    <div style={{ width:240,background:"#111118",borderRadius:44,padding:"0 6px 6px",boxShadow:"0 0 0 1px #2A2A3E, 0 30px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)" }}>
      <div style={{ display:"flex",justifyContent:"center",paddingTop:10,paddingBottom:4 }}>
        <div style={{ width:72,height:24,background:"#000",borderRadius:20 }}/>
      </div>
      <div style={{ background:C.bg,borderRadius:36,overflow:"hidden",height:480,display:"flex",flexDirection:"column" }}>
        {children}
      </div>
    </div>
    <div style={{ marginTop:12,fontSize:10,color:"#555",letterSpacing:"1px",textTransform:"uppercase",fontFamily:"'DM Mono',monospace" }}>{label}</div>
  </div>
);

// ════════════════ ROOT ════════════════
export default function RoutineApp() {
  const [mode,setMode]       = useState("single");
  const [screen,setScreen]   = useState("home");
  const [showOnb,setOnb]     = useState(false);
  const [isPremium,setPrem]  = useState(false);
  const [premScreen,setPScr] = useState("paywall");

  useEffect(()=>{
    const link=document.createElement("link");
    link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
  },[]);

  const freeScreenMap={
    home:      <HomeScreen/>,
    workout:   <WorkoutScreen/>,
    nutrition: <NutritionScreen/>,
    progress:  <ProgressScreen/>,
    community: <CommunityScreen/>,
    profile:   <ProfileScreen/>,
  };

  const premiumScreenMap={
    paywall:  <PremiumPaywallScreen onSubscribe={()=>{ setPrem(true); setPScr("home_premium"); }}/>,
    home_premium: <HomePremiumScreen/>,
  };

  const freeScreens=[
    { id:"home",      label:"Inicio"    },
    { id:"workout",   label:"Entrena"   },
    { id:"nutrition", label:"Nutrición" },
    { id:"progress",  label:"Progreso"  },
    { id:"community", label:"Comunidad" },
    { id:"profile",   label:"Perfil"    },
  ];

  const premScreens=[
    { id:"paywall",      label:"Paywall"       },
    { id:"home_premium", label:"Home Premium"  },
  ];

  const modeButtons=[
    ["single",  "Pantalla individual" ],
    ["multi",   "Todas las pantallas" ],
    ["onboard", "Onboarding"          ],
    ["premium", "⭐ Vista Premium"    ],
  ];

  return (
    <div style={{ minHeight:"100vh",background:"#07070E",fontFamily:"'Inter',sans-serif",padding:"18px 13px" }}>

      {/* Header */}
      <div style={{ textAlign:"center",marginBottom:22 }}>
        <div style={{ display:"inline-flex",alignItems:"center",gap:8,marginBottom:7 }}>
          <div style={{ width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${C.primary},${C.pDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:`0 0 16px ${C.primary}44` }}>⚡</div>
          <span style={{ fontSize:19,fontWeight:800,color:C.text,fontFamily:"'Syne',sans-serif" }}>Routine</span>
          <Tag>v3 · Informe Ejecutivo</Tag>
        </div>
        <div style={{ fontSize:10,color:C.muted }}>App de rutinas hiperpersonalizadas con IA · $89 MXN/mes</div>
        <div style={{ fontSize:10,color:C.muted,marginTop:2 }}>Daniel Hernández · Edgar Sánchez · Eleazar Espinoza — Función Informática 2026</div>
      </div>

      {/* Mode tabs */}
      <div style={{ display:"flex",justifyContent:"center",gap:6,marginBottom:20,flexWrap:"wrap" }}>
        {modeButtons.map(([id,lbl])=>(
          <button key={id} onClick={()=>{
            if(id==="onboard"){ setOnb(true); setMode("onboard"); }
            else{ setMode(id); setOnb(false); }
          }} style={{
            padding:"6px 12px", borderRadius:17,
            border:`1px solid ${mode===id?(id==="premium"?C.amber:C.primary):C.border}`,
            background:mode===id?(id==="premium"?C.amber+"22":C.primary+"22"):C.surface,
            color:mode===id?(id==="premium"?C.amber:C.primary):C.muted,
            fontSize:10, cursor:"pointer", fontWeight:600,
          }}>{lbl}</button>
        ))}
      </div>

      {/* Onboarding */}
      {showOnb && (
        <div style={{ display:"flex",justifyContent:"center" }}>
          <PhoneFrame label="Onboarding">
            <OnboardingScreen onDone={()=>{ setOnb(false); setMode("single"); setScreen("home"); }}/>
          </PhoneFrame>
        </div>
      )}

      {/* Single — versión gratuita */}
      {!showOnb && mode==="single" && (
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:13 }}>
          <div style={{ display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center" }}>
            {freeScreens.map(s=>(
              <button key={s.id} onClick={()=>setScreen(s.id)} style={{ padding:"5px 11px",borderRadius:17,border:`1px solid ${screen===s.id?C.primary:C.border}`,background:screen===s.id?C.primary+"22":C.surface,color:screen===s.id?C.primary:C.muted,fontSize:10,cursor:"pointer",fontWeight:600 }}>{s.label}</button>
            ))}
          </div>
          <PhoneFrame label={freeScreens.find(s=>s.id===screen)?.label||screen}>
            {freeScreenMap[screen]}
            <NavBar active={screen} setActive={setScreen}/>
          </PhoneFrame>
        </div>
      )}

      {/* Multi — todas las pantallas gratuitas */}
      {!showOnb && mode==="multi" && (
        <div style={{ display:"flex",gap:18,justifyContent:"center",flexWrap:"wrap" }}>
          {freeScreens.map(s=>(
            <PhoneFrame key={s.id} label={s.label}>
              {freeScreenMap[s.id]}
              <NavBar active={s.id} setActive={()=>{}}/>
            </PhoneFrame>
          ))}
        </div>
      )}

      {/* Premium — paywall + home premium side by side */}
      {!showOnb && mode==="premium" && (
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:16 }}>
          {/* Badge explicativo */}
          <div style={{ background:C.amber+"18",border:`1px solid ${C.amber}44`,borderRadius:14,padding:"10px 18px",textAlign:"center",maxWidth:560 }}>
            <div style={{ fontSize:11,fontWeight:700,color:C.amber,marginBottom:4 }}>⭐ Flujo del modelo Freemium</div>
            <div style={{ fontSize:10,color:C.muted,lineHeight:1.6 }}>
              El usuario gratuito encuentra el <b style={{ color:C.text }}>Paywall</b> al intentar acceder a funciones avanzadas. Al suscribirse por $89 MXN/mes, desbloquea la experiencia <b style={{ color:C.amber }}>Home Premium</b> con IA completa, chatbot 24/7 y análisis avanzado.
            </div>
          </div>

          {/* Selector de sub-pantalla */}
          <div style={{ display:"flex",gap:8 }}>
            {premScreens.map(s=>(
              <button key={s.id} onClick={()=>setPScr(s.id)} style={{ padding:"6px 14px",borderRadius:17,border:`1px solid ${premScreen===s.id?C.amber:C.border}`,background:premScreen===s.id?C.amber+"22":C.surface,color:premScreen===s.id?C.amber:C.muted,fontSize:10,cursor:"pointer",fontWeight:600 }}>{s.label}</button>
            ))}
          </div>

          {/* Comparativa lado a lado */}
          {premScreen==="home_premium" ? (
            <div style={{ display:"flex",gap:20,flexWrap:"wrap",justifyContent:"center",alignItems:"flex-start" }}>
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
                <div style={{ fontSize:10,color:C.muted,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase" }}>👤 Usuario Gratis</div>
                <PhoneFrame label="Home — Gratis">
                  <HomeScreen/>
                  <NavBar active="home" setActive={()=>{}}/>
                </PhoneFrame>
              </div>
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
                <div style={{ fontSize:10,color:C.amber,fontWeight:700,letterSpacing:"0.5px",textTransform:"uppercase" }}>⭐ Usuario Premium</div>
                <PhoneFrame label="Home — Premium">
                  <HomePremiumScreen/>
                  <NavBar active="home" setActive={()=>{}}/>
                </PhoneFrame>
              </div>
            </div>
          ):(
            <PhoneFrame label="Paywall — Suscripción">
              <PremiumPaywallScreen onSubscribe={()=>setPScr("home_premium")}/>
              <NavBar active="profile" setActive={()=>{}}/>
            </PhoneFrame>
          )}
        </div>
      )}

      <div style={{ textAlign:"center",marginTop:32,fontSize:9,color:"#2A2A3E",letterSpacing:"0.5px" }}>
        ROUTINE APP · PROTOTIPO INTERACTIVO v3 · 2026 · Nova Universitas
      </div>
    </div>
  );
}