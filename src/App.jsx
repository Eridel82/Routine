import { useState, useEffect, useRef } from "react";

// ─── Paleta & tokens ───────────────────────────────────────────────────────
const C = {
  bg:      "#0A0A0F",
  surface: "#12121A",
  card:    "#1A1A26",
  primary: "#7B6EF6",
  pLight:  "#A99DF8",
  pDark:   "#5648D4",
  accent:  "#F06292",
  green:   "#2DD4BF",
  amber:   "#FBBF24",
  red:     "#F87171",
  text:    "#F0EFF8",
  muted:   "#7B7A94",
  border:  "#2A2A3E",
};

// ════════════════════════════════════════════════════════════
// MICRO COMPONENTS
// ════════════════════════════════════════════════════════════
const Tag = ({ children, color = C.primary }) => (
  <span style={{
    display: "inline-block", padding: "2px 8px", borderRadius: 20,
    fontSize: 9, fontWeight: 600, letterSpacing: "0.5px",
    background: color + "22", color, border: `1px solid ${color}44`,
  }}>{children}</span>
);

const Avatar = ({ size = 32, initials = "CG", color = C.primary }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%", flexShrink: 0,
    background: `linear-gradient(135deg, ${color}, ${C.pDark})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.35, fontWeight: 700, color: "#fff",
    border: `2px solid ${color}44`,
  }}>{initials}</div>
);

const ProgressRing = ({ pct, size = 56, stroke = 4, color = C.primary }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }}/>
    </svg>
  );
};

const Pill = ({ icon, label, value, color = C.primary }) => (
  <div style={{
    background: C.card, borderRadius: 12, padding: "10px 12px",
    display: "flex", flexDirection: "column", gap: 2, flex: 1,
    border: `1px solid ${C.border}`,
  }}>
    <span style={{ fontSize: 16 }}>{icon}</span>
    <span style={{ fontSize: 15, fontWeight: 700, color, fontFamily: "'DM Mono', monospace" }}>{value}</span>
    <span style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
  </div>
);

// ════════════════════════════════════════════════════════════
// NAV BAR
// ════════════════════════════════════════════════════════════
const NavBar = ({ active, setActive }) => {
  const items = [
    { id: "home",      icon: "⌂", label: "Inicio" },
    { id: "workout",   icon: "▶", label: "Entrena" },
    { id: "progress",  icon: "↗", label: "Progreso" },
    { id: "community", icon: "⊕", label: "Social" },
  ];
  return (
    <div style={{
      display: "flex", justifyContent: "space-around",
      padding: "10px 0 6px", borderTop: `1px solid ${C.border}`,
      background: C.surface, flexShrink: 0,
    }}>
      {items.map(it => (
        <button key={it.id} onClick={() => setActive(it.id)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "2px 12px",
        }}>
          <span style={{ fontSize: 18, color: active===it.id ? C.primary : C.muted, transition: "color .2s" }}>{it.icon}</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: active===it.id ? C.primary : C.muted, letterSpacing: "0.4px", transition: "color .2s" }}>{it.label}</span>
          {active===it.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.primary, marginTop: -2 }}/>}
        </button>
      ))}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// SCREEN: ONBOARDING
// ════════════════════════════════════════════════════════════
const OnboardingScreen = ({ onDone }) => {
  const [step, setStep]   = useState(0);
  const [goal, setGoal]   = useState(null);
  const [level, setLevel] = useState(null);
  const [equip, setEquip] = useState([]);
  const [animIn, setAnim] = useState(true);

  const goals = [
    { id:"muscle",  icon:"💪", label:"Ganar músculo",  color:C.primary },
    { id:"fat",     icon:"🔥", label:"Perder grasa",   color:C.accent  },
    { id:"cardio",  icon:"🏃", label:"Resistencia",    color:C.green   },
    { id:"wellness",icon:"🧘", label:"Bienestar",      color:C.amber   },
  ];
  const levels = [
    { id:"beginner",     icon:"🌱", label:"Principiante", sub:"0–6 meses"    },
    { id:"intermediate", icon:"⚡", label:"Intermedio",   sub:"6 m – 2 años" },
    { id:"advanced",     icon:"🏆", label:"Avanzado",     sub:"+2 años"       },
  ];
  const equipList = [
    { id:"gym",       icon:"🏋️", label:"Gym completo" },
    { id:"home",      icon:"🏠", label:"En casa"      },
    { id:"dumbbells", icon:"🪃", label:"Mancuernas"   },
    { id:"none",      icon:"🤲", label:"Sin equipo"   },
  ];

  const next = () => { setAnim(false); setTimeout(()=>{ setStep(s=>s+1); setAnim(true); }, 220); };

  const btnStyle = (active) => ({
    width:"100%", padding:"14px", borderRadius:14, marginTop:16,
    background: active ? `linear-gradient(135deg,${C.primary},${C.pDark})` : C.border,
    border:"none", color: active ? "#fff" : C.muted, fontSize:13, fontWeight:700,
    cursor: active ? "pointer" : "not-allowed", transition:"all .2s",
    boxShadow: active ? `0 8px 24px ${C.primary}44` : "none",
  });

  const steps = [
    // 0 – Welcome
    <div key="0" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 20px", gap:20 }}>
      <div style={{ width:72, height:72, borderRadius:20, background:`linear-gradient(135deg,${C.primary},${C.pDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, boxShadow:`0 0 40px ${C.primary}55` }}>⚡</div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:26, fontWeight:800, color:C.text, fontFamily:"'Syne',sans-serif", lineHeight:1.1 }}>
          Bienvenido a<br/><span style={{ color:C.primary }}>Routine</span>
        </div>
        <div style={{ fontSize:12, color:C.muted, marginTop:10, lineHeight:1.6 }}>Tu entrenador personal con IA.<br/>Rutinas que se adaptan a ti.</div>
      </div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center" }}>
        {["Personalizado","Adaptativo","Con IA"].map(t=><Tag key={t}>{t}</Tag>)}
      </div>
      <button onClick={next} style={{ ...btnStyle(true), marginTop:10 }}>Comenzar →</button>
    </div>,

    // 1 – Goal
    <div key="1" style={{ flex:1, display:"flex", flexDirection:"column", padding:"16px 16px 0" }}>
      <div style={{ fontSize:10, color:C.muted, letterSpacing:"1px", textTransform:"uppercase", marginBottom:6 }}>Paso 1 de 3</div>
      <div style={{ fontSize:18, fontWeight:800, color:C.text, fontFamily:"'Syne',sans-serif", marginBottom:4 }}>¿Cuál es tu objetivo?</div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>Generaremos tu plan perfectamente adaptado.</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, flex:1 }}>
        {goals.map(g=>(
          <button key={g.id} onClick={()=>setGoal(g.id)} style={{
            background: goal===g.id ? g.color+"22" : C.card,
            border:`2px solid ${goal===g.id ? g.color : C.border}`,
            borderRadius:16, padding:"18px 12px",
            display:"flex", flexDirection:"column", alignItems:"center", gap:8,
            cursor:"pointer", transition:"all .2s",
            boxShadow: goal===g.id ? `0 0 20px ${g.color}33` : "none",
          }}>
            <span style={{ fontSize:26 }}>{g.icon}</span>
            <span style={{ fontSize:12, fontWeight:700, color:goal===g.id ? g.color : C.text }}>{g.label}</span>
          </button>
        ))}
      </div>
      <button onClick={next} disabled={!goal} style={btnStyle(!!goal)}>Continuar →</button>
    </div>,

    // 2 – Level
    <div key="2" style={{ flex:1, display:"flex", flexDirection:"column", padding:"16px 16px 0" }}>
      <div style={{ fontSize:10, color:C.muted, letterSpacing:"1px", textTransform:"uppercase", marginBottom:6 }}>Paso 2 de 3</div>
      <div style={{ fontSize:18, fontWeight:800, color:C.text, fontFamily:"'Syne',sans-serif", marginBottom:4 }}>Tu nivel de experiencia</div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>Ajustamos la intensidad a tu condición actual.</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, flex:1 }}>
        {levels.map(l=>(
          <button key={l.id} onClick={()=>setLevel(l.id)} style={{
            background: level===l.id ? C.primary+"22" : C.card,
            border:`2px solid ${level===l.id ? C.primary : C.border}`,
            borderRadius:14, padding:"14px 16px",
            display:"flex", alignItems:"center", gap:14,
            cursor:"pointer", transition:"all .2s", textAlign:"left",
          }}>
            <span style={{ fontSize:24 }}>{l.icon}</span>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:level===l.id ? C.primary : C.text }}>{l.label}</div>
              <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{l.sub}</div>
            </div>
            {level===l.id && <span style={{ marginLeft:"auto", color:C.primary, fontSize:16 }}>✓</span>}
          </button>
        ))}
      </div>
      <button onClick={next} disabled={!level} style={btnStyle(!!level)}>Continuar →</button>
    </div>,

    // 3 – Equipment
    <div key="3" style={{ flex:1, display:"flex", flexDirection:"column", padding:"16px 16px 0" }}>
      <div style={{ fontSize:10, color:C.muted, letterSpacing:"1px", textTransform:"uppercase", marginBottom:6 }}>Paso 3 de 3</div>
      <div style={{ fontSize:18, fontWeight:800, color:C.text, fontFamily:"'Syne',sans-serif", marginBottom:4 }}>¿Qué equipo tienes?</div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>Elige todo lo que aplique.</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, flex:1 }}>
        {equipList.map(e=>{
          const sel = equip.includes(e.id);
          return (
            <button key={e.id} onClick={()=>setEquip(p=>sel?p.filter(x=>x!==e.id):[...p,e.id])} style={{
              background: sel ? C.green+"22" : C.card,
              border:`2px solid ${sel ? C.green : C.border}`,
              borderRadius:14, padding:"16px 10px",
              display:"flex", flexDirection:"column", alignItems:"center", gap:8,
              cursor:"pointer", transition:"all .2s",
            }}>
              <span style={{ fontSize:22 }}>{e.icon}</span>
              <span style={{ fontSize:11, fontWeight:600, color:sel ? C.green : C.text }}>{e.label}</span>
            </button>
          );
        })}
      </div>
      <button onClick={onDone} style={btnStyle(true)}>Crear mi rutina IA ✨</button>
    </div>,
  ];

  return (
    <div style={{
      flex:1, display:"flex", flexDirection:"column", background:C.bg, overflow:"hidden",
      opacity:animIn?1:0, transform:animIn?"translateY(0)":"translateY(12px)", transition:"all .22s ease",
    }}>
      <div style={{ display:"flex", justifyContent:"center", gap:6, padding:"14px 0 0" }}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{ width:i===step?20:6, height:6, borderRadius:3, background:i<=step?C.primary:C.border, transition:"all .3s" }}/>
        ))}
      </div>
      {steps[step]}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// SCREEN: HOME
// ════════════════════════════════════════════════════════════
const HomeScreen = () => {
  const exercises = [
    { name:"Press de banca", sets:"4 × 10", kg:"70 kg", done:true,  muscle:"Pecho"    },
    { name:"Press militar",  sets:"3 × 12", kg:"50 kg", done:true,  muscle:"Hombros"  },
    { name:"Aperturas",      sets:"3 × 15", kg:"16 kg", done:false, muscle:"Pecho"    },
    { name:"Fondos",         sets:"3 × 12", kg:"—",     done:false, muscle:"Tríceps"  },
  ];
  const days = ["L","M","X","J","V","S","D"];
  const done = [true,true,true,false,false,false,false];

  return (
    <div style={{ flex:1, overflowY:"auto", background:C.bg }}>
      {/* Header */}
      <div style={{ padding:"16px 16px 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:11, color:C.muted }}>Lunes, 21 de abril</div>
          <div style={{ fontSize:20, fontWeight:800, color:C.text, fontFamily:"'Syne',sans-serif", lineHeight:1.2, marginTop:2 }}>
            Hola, <span style={{ color:C.primary }}>Carlos</span> 👋
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, background:"#2A1500", border:`1px solid ${C.amber}44`, borderRadius:20, padding:"5px 10px" }}>
            <span style={{ fontSize:14 }}>🔥</span>
            <span style={{ fontSize:12, fontWeight:700, color:C.amber }}>12</span>
          </div>
          <Avatar size={36} initials="CG"/>
        </div>
      </div>

      {/* Week strip */}
      <div style={{ padding:"14px 16px 0", display:"flex", gap:6 }}>
        {days.map((d,i)=>(
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <span style={{ fontSize:9, color:C.muted, fontWeight:600 }}>{d}</span>
            <div style={{
              width:28, height:28, borderRadius:10,
              background: done[i] ? C.primary : (i===3 ? C.primary+"33" : C.surface),
              border: i===3 ? `2px solid ${C.primary}` : "none",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, color: done[i] ? "#fff" : (i===3 ? C.primary : C.muted), fontWeight:700,
            }}>{done[i]?"✓":d}</div>
          </div>
        ))}
      </div>

      {/* Today card */}
      <div style={{ margin:"14px 16px 0", borderRadius:20, overflow:"hidden", position:"relative" }}>
        <div style={{ background:`linear-gradient(135deg,${C.primary}CC,${C.pDark})`, padding:"16px", position:"relative" }}>
          <div style={{ position:"absolute", right:-20, top:-20, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }}/>
          <div style={{ position:"absolute", right:20, top:20, width:60, height:60, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
          <Tag color="#fff">Hoy</Tag>
          <div style={{ fontSize:18, fontWeight:800, color:"#fff", fontFamily:"'Syne',sans-serif", marginTop:6, lineHeight:1.2 }}>
            Tren Superior<br/>Push Day A
          </div>
          <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
            {["⏱ 45 min","6 ejercicios","📊 Moderado"].map(t=>(
              <span key={t} style={{ fontSize:10, color:"rgba(255,255,255,0.85)", background:"rgba(255,255,255,0.15)", borderRadius:20, padding:"3px 10px" }}>{t}</span>
            ))}
          </div>
          <button style={{ marginTop:12, background:"#fff", borderRadius:12, padding:"10px 20px", border:"none", color:C.pDark, fontSize:12, fontWeight:800, cursor:"pointer" }}>Comenzar →</button>
        </div>
      </div>

      {/* Stats pills */}
      <div style={{ display:"flex", gap:8, padding:"14px 16px 0" }}>
        <Pill icon="🏋️" label="Semana" value="4"    color={C.primary}/>
        <Pill icon="⏱"  label="Tiempo" value="3h20" color={C.green}/>
        <Pill icon="🔥"  label="kcal"   value="1840" color={C.accent}/>
      </div>

      {/* Exercise list */}
      <div style={{ padding:"14px 16px 0" }}>
        <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"1px", marginBottom:10, fontWeight:700 }}>Ejercicios de hoy</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {exercises.map((ex,i)=>(
            <div key={i} style={{ background:C.card, borderRadius:14, padding:"12px 14px", display:"flex", alignItems:"center", gap:12, border:`1px solid ${ex.done?C.green+"33":C.border}` }}>
              <div style={{ width:36, height:36, borderRadius:10, background:ex.done?C.green+"22":C.surface, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🏋️</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{ex.name}</div>
                <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{ex.sets} · {ex.kg} · <span style={{ color:C.primary }}>{ex.muscle}</span></div>
              </div>
              <div style={{ width:22, height:22, borderRadius:"50%", background:ex.done?C.green:"transparent", border:`2px solid ${ex.done?C.green:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", flexShrink:0 }}>{ex.done?"✓":""}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI tip */}
      <div style={{ margin:"14px 16px 16px", background:C.primary+"18", borderRadius:16, padding:"12px 14px", border:`1px solid ${C.primary}33` }}>
        <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
          <span style={{ fontSize:18 }}>🤖</span>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.pLight, marginBottom:3 }}>Sugerencia IA</div>
            <div style={{ fontSize:10, color:C.muted, lineHeight:1.6 }}>Dormiste 6.5h — ajusté la intensidad al 85% para optimizar recuperación muscular.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// SCREEN: WORKOUT (ACTIVE)
// ════════════════════════════════════════════════════════════
const WorkoutScreen = () => {
  const [activeSet, setActiveSet] = useState(2);
  const [timer, setTimer]         = useState(37);
  const [resting, setResting]     = useState(true);
  const sets = [
    { w:"70 kg", reps:10, done:true  },
    { w:"70 kg", reps:10, done:true  },
    { w:"70 kg", reps:10, done:false },
    { w:"70 kg", reps:10, done:false },
  ];

  useEffect(()=>{
    if (!resting) return;
    const t = setInterval(()=>setTimer(s=>s>0?s-1:0),1000);
    return ()=>clearInterval(t);
  },[resting]);

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:C.bg, overflow:"hidden" }}>
      {/* Top bar */}
      <div style={{ background:C.surface, padding:"12px 16px", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, color:C.muted, letterSpacing:"0.5px" }}>TREN SUPERIOR — PUSH DAY</div>
            <div style={{ fontSize:15, fontWeight:800, color:C.text, fontFamily:"'Syne',sans-serif", marginTop:2 }}>
              Ejercicio 3 <span style={{ color:C.muted, fontWeight:400 }}>/ 6</span>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10, color:C.muted }}>Tiempo total</div>
            <div style={{ fontSize:16, fontWeight:700, color:C.green, fontFamily:"'DM Mono',monospace" }}>18:34</div>
          </div>
        </div>
        <div style={{ marginTop:10, background:C.border, borderRadius:4, height:4 }}>
          <div style={{ width:"45%", background:`linear-gradient(90deg,${C.primary},${C.pLight})`, height:4, borderRadius:4, transition:"width 1s ease" }}/>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"16px" }}>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:22, fontWeight:800, color:C.text, fontFamily:"'Syne',sans-serif", lineHeight:1.2 }}>Aperturas con<br/>mancuernas</div>
          <div style={{ fontSize:11, color:C.muted, marginTop:6, lineHeight:1.6 }}>Codos ligeramente flexionados. Contrae el pecho en la cima del movimiento.</div>
          <div style={{ display:"flex", gap:6, marginTop:8 }}>
            <Tag color={C.primary}>Pectoral mayor</Tag>
            <Tag color={C.accent}>Deltoides ant.</Tag>
          </div>
        </div>

        {/* Rest timer */}
        {resting && (
          <div style={{ background:C.card, borderRadius:18, padding:"16px", marginBottom:16, border:`1px solid ${C.green}44`, textAlign:"center" }}>
            <div style={{ fontSize:10, color:C.green, textTransform:"uppercase", letterSpacing:"1px", marginBottom:8 }}>⏸ Descansando</div>
            <div style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
              <ProgressRing pct={timer/60*100} size={72} stroke={5} color={C.green}/>
              <div style={{ position:"absolute", textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:800, color:C.green, fontFamily:"'DM Mono',monospace", lineHeight:1 }}>{timer}</div>
                <div style={{ fontSize:8, color:C.muted }}>seg</div>
              </div>
            </div>
            <button onClick={()=>setResting(false)} style={{ display:"block", margin:"10px auto 0", background:"none", border:`1px solid ${C.green}`, borderRadius:20, padding:"5px 16px", color:C.green, fontSize:11, cursor:"pointer" }}>Saltar descanso</button>
          </div>
        )}

        {/* Sets grid */}
        <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"1px", marginBottom:8, fontWeight:700 }}>Series</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, marginBottom:16 }}>
          {sets.map((s,i)=>(
            <button key={i} onClick={()=>setActiveSet(i)} style={{
              background: s.done?C.green+"22":(i===activeSet?C.primary+"33":C.surface),
              border:`2px solid ${s.done?C.green:(i===activeSet?C.primary:C.border)}`,
              borderRadius:14, padding:"12px 6px", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:3, transition:"all .2s",
            }}>
              <span style={{ fontSize:8, color:C.muted }}>SERIE {i+1}</span>
              <span style={{ fontSize:13, fontWeight:700, color:s.done?C.green:(i===activeSet?C.primary:C.text), fontFamily:"'DM Mono',monospace" }}>{s.done?"✓":s.w}</span>
              {!s.done && <span style={{ fontSize:9, color:C.muted }}>{s.reps} reps</span>}
            </button>
          ))}
        </div>

        <button onClick={()=>{ setActiveSet(s=>Math.min(s+1,3)); setTimer(60); setResting(true); }} style={{
          width:"100%", padding:"15px", borderRadius:16,
          background:`linear-gradient(135deg,${C.green},#0d9488)`,
          border:"none", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer",
          boxShadow:`0 8px 24px ${C.green}44`, marginBottom:8,
        }}>Serie completada ✓</button>
        <button style={{ width:"100%", padding:"10px", background:"none", border:`1px solid ${C.border}`, borderRadius:12, color:C.muted, fontSize:11, cursor:"pointer" }}>Saltar ejercicio</button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// SCREEN: PROGRESS
// ════════════════════════════════════════════════════════════
const ProgressScreen = () => {
  const weeks = ["S1","S2","S3","S4","S5","S6","S7"];
  const vals  = [2,4,3,5,4,6,4];
  const max   = Math.max(...vals);
  const badges = [
    { icon:"🔥", label:"12 días seguidos", color:C.amber   },
    { icon:"💪", label:"100 kg press",     color:C.primary },
    { icon:"🏃", label:"Primera semana",   color:C.green   },
    { icon:"⭐", label:"30 entrenamientos",color:C.accent  },
  ];

  return (
    <div style={{ flex:1, overflowY:"auto", background:C.bg, padding:"16px" }}>
      <div style={{ fontSize:20, fontWeight:800, color:C.text, fontFamily:"'Syne',sans-serif", marginBottom:4 }}>Tu progreso</div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>Últimas 7 semanas · Programa Push/Pull/Legs</div>

      {/* Rings */}
      <div style={{ display:"flex", justifyContent:"space-around", background:C.card, borderRadius:20, padding:"16px", marginBottom:14, border:`1px solid ${C.border}` }}>
        {[
          { label:"Semana",  pct:60,  val:"3/5",  color:C.primary },
          { label:"Volumen", pct:78,  val:"78%",  color:C.green   },
          { label:"Racha",   pct:100, val:"12d",  color:C.amber   },
        ].map(it=>(
          <div key={it.label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
            <div style={{ position:"relative", display:"inline-flex" }}>
              <ProgressRing pct={it.pct} size={60} stroke={5} color={it.color}/>
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:12, fontWeight:700, color:it.color, fontFamily:"'DM Mono',monospace" }}>{it.val}</span>
              </div>
            </div>
            <span style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.5px" }}>{it.label}</span>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ background:C.card, borderRadius:20, padding:"14px", marginBottom:14, border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:12 }}>Entrenamientos por semana</div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:80 }}>
          {vals.map((v,i)=>(
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <span style={{ fontSize:9, color:C.muted, fontFamily:"'DM Mono',monospace" }}>{v}</span>
              <div style={{ width:"100%", borderRadius:"4px 4px 0 0", height:`${(v/max)*60}px`, background:i===6?`linear-gradient(180deg,${C.primary},${C.pDark})`:C.surface, border:`1px solid ${i===6?C.primary:C.border}`, transition:"height 0.8s ease" }}/>
              <span style={{ fontSize:8, color:C.muted }}>{weeks[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PBs */}
      <div style={{ background:C.card, borderRadius:20, padding:"14px", marginBottom:14, border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:10 }}>Récords personales</div>
        {[
          { name:"Press banca", val:"90 kg",  prev:"+5 kg",  color:C.primary },
          { name:"Sentadilla",  val:"120 kg", prev:"+10 kg", color:C.green   },
          { name:"Peso muerto", val:"140 kg", prev:"+15 kg", color:C.accent  },
        ].map(pb=>(
          <div key={pb.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontSize:12, color:C.text }}>{pb.name}</span>
            <div style={{ textAlign:"right" }}>
              <span style={{ fontSize:14, fontWeight:800, color:pb.color, fontFamily:"'DM Mono',monospace" }}>{pb.val}</span>
              <span style={{ fontSize:9, color:C.green, marginLeft:6, background:C.green+"22", borderRadius:10, padding:"1px 6px" }}>{pb.prev}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:10 }}>Logros</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {badges.map((b,i)=>(
          <div key={i} style={{ background:C.card, borderRadius:14, padding:"12px", border:`1px solid ${b.color}33`, display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:22 }}>{b.icon}</span>
            <span style={{ fontSize:10, color:C.text, fontWeight:600, lineHeight:1.4 }}>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// COMMUNITY SUB-COMPONENTS
// ════════════════════════════════════════════════════════════
const StoryBubble = ({ user, initials, color, isOwn }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, flexShrink:0 }}>
    <div style={{ width:52, height:52, borderRadius:"50%", padding:2, background:isOwn?C.border:`linear-gradient(135deg,${color||C.primary},${C.pDark})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
      {isOwn
        ? <div style={{ width:44, height:44, borderRadius:"50%", background:C.card, border:`2px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:C.muted }}>+</div>
        : <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${color}66,${C.pDark}44)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff" }}>{initials}</div>
      }
    </div>
    <span style={{ fontSize:9, color:C.muted, maxWidth:52, textAlign:"center", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
      {isOwn ? "Tu historia" : user}
    </span>
  </div>
);

const PostCard = ({ post }) => {
  const [liked, setLiked]           = useState(post.liked||false);
  const [likes, setLikes]           = useState(post.likes);
  const [showComments, setShowCom]  = useState(false);
  const [comment, setComment]       = useState("");
  const [comments, setComments]     = useState(post.comments||[]);

  const handleLike = () => { setLiked(l=>!l); setLikes(n=>liked?n-1:n+1); };
  const sendComment = () => {
    if (!comment.trim()) return;
    setComments(c=>[...c,{ user:"Tú", initials:"TÚ", color:C.primary, text:comment, time:"ahora" }]);
    setComment("");
  };

  const typeColors  = { photo:C.green, tip:C.amber, pr:C.primary, video:C.accent, routine:C.pLight };
  const typeLabels  = { photo:"📸 Foto", tip:"💡 Tip", pr:"🏆 PR", video:"🎥 Video", routine:"📋 Rutina" };

  return (
    <div style={{ background:C.card, borderRadius:20, overflow:"hidden", border:`1px solid ${C.border}`, marginBottom:12 }}>
      {/* Header */}
      <div style={{ padding:"12px 14px 10px", display:"flex", alignItems:"center", gap:10 }}>
        <Avatar size={38} initials={post.initials} color={post.color}/>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{post.user}</span>
            {post.verified && <span style={{ fontSize:10, color:C.primary }}>✓</span>}
          </div>
          <div style={{ fontSize:9, color:C.muted, marginTop:1 }}>{post.time} · <span style={{ color:typeColors[post.type]||C.muted }}>{typeLabels[post.type]||post.type}</span></div>
        </div>
        <button style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, fontSize:16 }}>···</button>
      </div>

      {/* Text */}
      {post.text && (
        <div style={{ padding:"0 14px 10px", fontSize:12, color:C.muted, lineHeight:1.7 }}>
          {post.text}
          {post.tags && post.tags.map(t=><span key={t} style={{ color:C.pLight, marginLeft:4 }}>#{t}</span>)}
        </div>
      )}

      {/* Image placeholder */}
      {post.image && (
        <div style={{ width:"100%", aspectRatio:"4/3", background:post.imageBg||`linear-gradient(135deg,${post.color}33,${C.pDark}44)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:48, position:"relative" }}>
          <span style={{ opacity:0.6 }}>{post.imageEmoji||"🏋️"}</span>
          {post.imageLabel && (
            <div style={{ position:"absolute", bottom:10, left:10, background:"rgba(0,0,0,0.65)", borderRadius:8, padding:"4px 10px", fontSize:10, color:"#fff", fontWeight:600 }}>{post.imageLabel}</div>
          )}
        </div>
      )}

      {/* PR card */}
      {post.type==="pr" && post.prData && (
        <div style={{ margin:"0 14px 10px", background:`linear-gradient(135deg,${C.primary}22,${C.pDark}22)`, border:`1px solid ${C.primary}44`, borderRadius:14, padding:"12px 14px", display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:32 }}>🏆</span>
          <div>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"1px" }}>Nuevo récord personal</div>
            <div style={{ fontSize:18, fontWeight:800, color:C.primary, fontFamily:"'DM Mono',monospace" }}>{post.prData.value}</div>
            <div style={{ fontSize:11, color:C.muted }}>{post.prData.exercise} <span style={{ color:C.green }}>+{post.prData.improvement}</span></div>
          </div>
        </div>
      )}

      {/* Tip card */}
      {post.type==="tip" && post.tipData && (
        <div style={{ margin:"0 14px 10px", background:C.amber+"15", border:`1px solid ${C.amber}33`, borderRadius:14, padding:"12px 14px" }}>
          <div style={{ fontSize:10, color:C.amber, textTransform:"uppercase", letterSpacing:"1px", marginBottom:6 }}>💡 Consejo</div>
          <div style={{ fontSize:12, color:C.text, lineHeight:1.6 }}>{post.tipData}</div>
        </div>
      )}

      {/* Routine card */}
      {post.type==="routine" && post.routineData && (
        <div style={{ margin:"0 14px 10px", background:C.surface, borderRadius:14, padding:"12px 14px", border:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{post.routineData.name}</div>
            <Tag color={C.pLight}>{post.routineData.level}</Tag>
          </div>
          {post.routineData.exercises.map((ex,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:i<post.routineData.exercises.length-1?`1px solid ${C.border}`:"none" }}>
              <span style={{ fontSize:14 }}>{ex.icon}</span>
              <span style={{ fontSize:11, color:C.muted, flex:1 }}>{ex.name}</span>
              <span style={{ fontSize:10, color:C.pLight, fontFamily:"'DM Mono',monospace" }}>{ex.sets}</span>
            </div>
          ))}
          <button style={{ marginTop:10, width:"100%", padding:"8px", borderRadius:10, background:C.primary+"22", border:`1px solid ${C.primary}44`, color:C.primary, fontSize:11, fontWeight:700, cursor:"pointer" }}>Guardar rutina ↓</button>
        </div>
      )}

      {/* Actions */}
      <div style={{ padding:"8px 14px 10px", display:"flex", alignItems:"center", gap:4, borderTop:`1px solid ${C.border}` }}>
        <button onClick={handleLike} style={{ background:liked?C.accent+"18":"transparent", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:5, padding:"6px 10px", borderRadius:20, transition:"all .15s" }}>
          <span style={{ fontSize:15, transform:liked?"scale(1.2)":"scale(1)", transition:"transform .15s", display:"inline-block" }}>{liked?"❤️":"🤍"}</span>
          <span style={{ fontSize:11, color:liked?C.accent:C.muted, fontWeight:liked?700:400 }}>{likes}</span>
        </button>
        <button onClick={()=>setShowCom(s=>!s)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:5, padding:"6px 10px", borderRadius:20 }}>
          <span style={{ fontSize:15 }}>💬</span>
          <span style={{ fontSize:11, color:C.muted }}>{comments.length}</span>
        </button>
        <button style={{ background:"none", border:"none", cursor:"pointer", padding:"6px 10px", borderRadius:20, display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ fontSize:15 }}>↗</span>
          <span style={{ fontSize:11, color:C.muted }}>Compartir</span>
        </button>
        <button style={{ background:"none", border:"none", cursor:"pointer", padding:"6px 10px", borderRadius:20, marginLeft:"auto" }}>
          <span style={{ fontSize:15 }}>🔖</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div style={{ borderTop:`1px solid ${C.border}`, padding:"10px 14px 12px" }}>
          {comments.length>0 && (
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:10 }}>
              {comments.map((c,i)=>(
                <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                  <Avatar size={24} initials={c.initials} color={c.color}/>
                  <div style={{ background:C.surface, borderRadius:10, padding:"6px 10px", flex:1 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.text, marginBottom:2 }}>{c.user}</div>
                    <div style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <Avatar size={26} initials="TÚ" color={C.primary}/>
            <div style={{ flex:1, display:"flex", background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, overflow:"hidden" }}>
              <input value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendComment()} placeholder="Escribe un comentario..." style={{ flex:1, background:"transparent", border:"none", outline:"none", padding:"8px 12px", fontSize:11, color:C.text }}/>
              <button onClick={sendComment} style={{ background:"none", border:"none", cursor:"pointer", padding:"0 12px", color:C.primary, fontSize:14, fontWeight:700 }}>↑</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CreatePostModal = ({ onClose, onPost }) => {
  const [text, setText]        = useState("");
  const [type, setType]        = useState("photo");
  const [imgPreview, setImg]   = useState(null);
  const fileRef                = useRef();

  const types = [
    { id:"photo",   label:"📸 Foto",   color:C.green   },
    { id:"tip",     label:"💡 Tip",    color:C.amber   },
    { id:"pr",      label:"🏆 PR",     color:C.primary },
    { id:"routine", label:"📋 Rutina", color:C.pLight  },
    { id:"video",   label:"🎥 Video",  color:C.accent  },
  ];

  const placeholders = {
    tip:     "Comparte un consejo de entrenamiento o nutrición...",
    pr:      "¿Cuál fue tu récord? Cuéntanos los detalles...",
    routine: "Describe tu rutina favorita...",
    video:   "Agrega una descripción a tu video...",
    photo:   "¿Qué quieres compartir hoy?",
  };

  const handleFile = (e) => {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader(); r.onload=ev=>setImg(ev.target.result); r.readAsDataURL(f);
  };

  const submit = () => {
    if (!text.trim() && !imgPreview) return;
    onPost({ text, type, image:!!imgPreview, imageEmoji:"🏋️", initials:"TÚ", color:C.primary, user:"Tú", time:"ahora mismo", likes:0, comments:[] });
    onClose();
  };

  const canPost = text.trim() || imgPreview;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:100, display:"flex", alignItems:"flex-end" }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ width:"100%", background:C.surface, borderRadius:"24px 24px 0 0", padding:"20px 16px 32px", border:`1px solid ${C.border}` }}>
        <div style={{ width:36, height:4, background:C.border, borderRadius:2, margin:"0 auto 16px" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontSize:15, fontWeight:800, color:C.text, fontFamily:"'Syne',sans-serif" }}>Nueva publicación</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, fontSize:18 }}>✕</button>
        </div>

        {/* Type selector */}
        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:12, marginBottom:12 }}>
          {types.map(t=>(
            <button key={t.id} onClick={()=>setType(t.id)} style={{
              flexShrink:0, padding:"6px 12px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer",
              background:type===t.id?t.color+"22":C.card, border:`1px solid ${type===t.id?t.color:C.border}`,
              color:type===t.id?t.color:C.muted, transition:"all .15s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Composer */}
        <div style={{ display:"flex", gap:10, marginBottom:14 }}>
          <Avatar size={36} initials="TÚ" color={C.primary}/>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={placeholders[type]}
            style={{ flex:1, background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"10px 12px", fontSize:12, color:C.text, resize:"none", outline:"none", minHeight:80, lineHeight:1.6 }}/>
        </div>

        {/* Image preview */}
        {imgPreview && (
          <div style={{ position:"relative", marginBottom:12, borderRadius:14, overflow:"hidden" }}>
            <img src={imgPreview} alt="" style={{ width:"100%", maxHeight:180, objectFit:"cover" }}/>
            <button onClick={()=>setImg(null)} style={{ position:"absolute", top:8, right:8, width:28, height:28, borderRadius:"50%", background:"rgba(0,0,0,0.7)", border:"none", cursor:"pointer", color:"#fff", fontSize:12 }}>✕</button>
          </div>
        )}

        {/* Attach */}
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display:"none" }} onChange={handleFile}/>
          {[
            { icon:"🖼", label:"Imagen", action:()=>fileRef.current.click() },
            { icon:"🎥", label:"Video",  action:()=>fileRef.current.click() },
            { icon:"📍", label:"Lugar",  action:()=>{} },
            { icon:"💪", label:"Ejerc.", action:()=>{} },
          ].map(btn=>(
            <button key={btn.label} onClick={btn.action} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"8px 12px", cursor:"pointer", flex:1 }}>
              <span style={{ fontSize:16 }}>{btn.icon}</span>
              <span style={{ fontSize:9, color:C.muted }}>{btn.label}</span>
            </button>
          ))}
        </div>

        <button onClick={submit} style={{
          width:"100%", padding:"14px", borderRadius:14,
          background: canPost?`linear-gradient(135deg,${C.primary},${C.pDark})`:C.border,
          border:"none", color:canPost?"#fff":C.muted, fontSize:13, fontWeight:700, cursor:"pointer",
          boxShadow:canPost?`0 8px 24px ${C.primary}44`:"none", transition:"all .2s",
        }}>Publicar</button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// SCREEN: COMMUNITY (RED SOCIAL)
// ════════════════════════════════════════════════════════════
const CommunityScreen = () => {
  const [tab, setTab]           = useState("feed");
  const [showCreate, setCreate] = useState(false);
  const [posts, setPosts]       = useState([
    {
      id:1, user:"María G.", initials:"MG", color:C.accent, time:"hace 2h",
      type:"pr", text:"¡Nuevo PR en sentadilla después de 6 meses de trabajo! 🎉 La constancia siempre gana.",
      tags:["sentadilla","pr","powerlifting"],
      prData:{ value:"100 kg", exercise:"Sentadilla", improvement:"10 kg" },
      likes:24, liked:false,
      comments:[
        { user:"Luis R.", initials:"LR", color:C.green,   text:"¡Increíble María! Eso es dedicación pura 💪", time:"hace 1h"   },
        { user:"Ana K.",  initials:"AK", color:C.primary, text:"¡Qué inspiración! Meta personal desbloqueada 🏆", time:"hace 40min" },
      ],
    },
    {
      id:2, user:"Coach Luis", initials:"CL", color:C.green, time:"hace 4h", verified:true,
      type:"tip", text:"Hilo rápido de nutrición post-entrenamiento:",
      tags:["nutricion","recuperacion"],
      tipData:"Come proteína dentro de los 30–45 min después de entrenar. Lo ideal es 20–40g de proteína de alta calidad. Combínala con carbohidratos de rápida absorción para maximizar la síntesis muscular.",
      likes:67, liked:false, comments:[],
    },
    {
      id:3, user:"Sofía M.", initials:"SM", color:C.amber, time:"hace 6h",
      type:"photo", text:"Día de piernas completado 🔥 No hay excusas cuando los resultados son así.",
      tags:["piernas","gym","progreso"],
      image:true, imageEmoji:"🦵", imageBg:`linear-gradient(135deg,${C.amber}33,${C.pDark}55)`,
      imageLabel:"Día de piernas · 5:30 AM",
      likes:41, liked:true,
      comments:[{ user:"María G.", initials:"MG", color:C.accent, text:"¡Esas piernas! 😍🔥", time:"hace 5h" }],
    },
    {
      id:4, user:"Carlos T.", initials:"CT", color:C.pLight, time:"hace 1d",
      type:"routine", text:"Mi rutina de empuje favorita. Llevo 3 meses con ella y los resultados son increíbles:",
      tags:["push","rutinaempuje"],
      routineData:{
        name:"Push Day — Tren Superior", level:"Intermedio",
        exercises:[
          { icon:"🏋️", name:"Press de banca",  sets:"4×10" },
          { icon:"💪",  name:"Press inclinado", sets:"3×12" },
          { icon:"🔁",  name:"Aperturas",       sets:"3×15" },
          { icon:"⬆️", name:"Press militar",   sets:"4×10" },
          { icon:"🔽",  name:"Fondos",          sets:"3×12" },
        ],
      },
      likes:89, liked:false, comments:[],
    },
  ]);

  const challenges = [
    { name:"30 días Push", icon:"💪", pct:70, color:C.primary, members:234, days:9  },
    { name:"500 flexiones", icon:"🏆", pct:45, color:C.amber,  members:112, days:3  },
    { name:"Correr 5k",    icon:"🏃", pct:20, color:C.green,  members:78,  days:21 },
  ];

  const topUsers = [
    { name:"María G.",   initials:"MG", color:C.accent,  pts:1240, badge:"🔥" },
    { name:"Coach Luis", initials:"CL", color:C.green,   pts:1180, badge:"⭐" },
    { name:"Sofía M.",   initials:"SM", color:C.amber,   pts:980,  badge:"💪" },
    { name:"Carlos T.",  initials:"CT", color:C.pLight,  pts:870,  badge:"🏃" },
    { name:"Ana K.",     initials:"AK", color:C.primary, pts:760,  badge:"🧘" },
  ];

  const stories = [
    { user:"María G.", initials:"MG", color:C.accent  },
    { user:"Luis R.",  initials:"LR", color:C.green   },
    { user:"Sofía",    initials:"SM", color:C.amber   },
    { user:"Carlos",   initials:"CT", color:C.pLight  },
    { user:"Ana K.",   initials:"AK", color:C.primary },
  ];

  const addPost = p => setPosts(prev=>[{ ...p, id:Date.now() }, ...prev]);

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:C.bg, overflow:"hidden" }}>
      {/* Header */}
      <div style={{ background:C.surface, padding:"14px 16px 0", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:20, fontWeight:800, color:C.text, fontFamily:"'Syne',sans-serif" }}>Comunidad</span>
          <div style={{ display:"flex", gap:8 }}>
            <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:C.muted }}>🔔</button>
            <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:C.muted }}>🔍</button>
          </div>
        </div>
        <div style={{ display:"flex" }}>
          {[["feed","Feed"],["retos","Retos"],["ranking","Top"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setTab(id)} style={{
              flex:1, background:"none", border:"none", cursor:"pointer",
              padding:"8px 0", fontSize:12, fontWeight:tab===id?700:400,
              color:tab===id?C.primary:C.muted,
              borderBottom:`2px solid ${tab===id?C.primary:"transparent"}`,
              transition:"all .2s",
            }}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto" }}>

        {/* ── FEED ── */}
        {tab==="feed" && (
          <div>
            {/* Stories */}
            <div style={{ padding:"14px 16px 10px", display:"flex", gap:12, overflowX:"auto" }}>
              <StoryBubble isOwn/>
              {stories.map((s,i)=><StoryBubble key={i} {...s}/>)}
            </div>

            {/* Create bar */}
            <div style={{ margin:"0 16px 14px", background:C.card, borderRadius:16, padding:"12px 14px", border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10 }}>
              <Avatar size={34} initials="TÚ" color={C.primary}/>
              <button onClick={()=>setCreate(true)} style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:"10px 14px", textAlign:"left", fontSize:12, color:C.muted, cursor:"pointer" }}>
                ¿Qué quieres compartir hoy?
              </button>
              <button onClick={()=>setCreate(true)} style={{ background:C.primary, border:"none", borderRadius:20, padding:"8px 12px", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", flexShrink:0 }}>+ Post</button>
            </div>

            {/* Quick actions */}
            <div style={{ padding:"0 16px 14px", display:"flex", gap:8 }}>
              {[
                { icon:"📸", label:"Foto",   color:C.green   },
                { icon:"💡", label:"Tip",    color:C.amber   },
                { icon:"🏆", label:"PR",     color:C.primary },
                { icon:"📋", label:"Rutina", color:C.pLight  },
              ].map(a=>(
                <button key={a.label} onClick={()=>setCreate(true)} style={{ flex:1, background:a.color+"15", border:`1px solid ${a.color}33`, borderRadius:12, padding:"8px 4px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                  <span style={{ fontSize:16 }}>{a.icon}</span>
                  <span style={{ fontSize:9, color:a.color, fontWeight:600 }}>{a.label}</span>
                </button>
              ))}
            </div>

            {/* Posts */}
            <div style={{ padding:"0 16px 80px" }}>
              {posts.map(p=><PostCard key={p.id} post={p}/>)}
            </div>
          </div>
        )}

        {/* ── RETOS ── */}
        {tab==="retos" && (
          <div style={{ padding:"16px", paddingBottom:80 }}>
            <div style={{ fontSize:12, color:C.muted, marginBottom:16 }}>Únete a retos colectivos y gana puntos</div>
            {challenges.map((ch,i)=>(
              <div key={i} style={{ background:C.card, borderRadius:20, padding:"16px", marginBottom:12, border:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:ch.color+"22", border:`1px solid ${ch.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{ch.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{ch.name}</div>
                    <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{ch.members} participantes · {ch.days} días restantes</div>
                  </div>
                  <Tag color={ch.color}>{ch.pct}%</Tag>
                </div>
                <div style={{ background:C.surface, borderRadius:4, height:6, marginBottom:12, overflow:"hidden" }}>
                  <div style={{ width:`${ch.pct}%`, background:`linear-gradient(90deg,${ch.color},${ch.color}99)`, height:6, borderRadius:4, transition:"width 0.8s ease" }}/>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  {[-4,-3,-2,-1,0].map(d=>(
                    <div key={d} style={{ flex:1, height:36, borderRadius:8, background:d<0?ch.color+"33":C.surface, border:`1px solid ${d<0?ch.color+"55":C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:d<0?14:11, color:d<0?ch.color:C.muted }}>
                      {d<0?"✓":"·"}
                    </div>
                  ))}
                </div>
                <button style={{ marginTop:12, width:"100%", padding:"10px", borderRadius:12, background:`linear-gradient(135deg,${ch.color},${ch.color}99)`, border:"none", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  Ver reto completo →
                </button>
              </div>
            ))}
            <div style={{ background:C.card, borderRadius:20, padding:"16px", border:`1px solid ${C.border}`, textAlign:"center" }}>
              <div style={{ fontSize:24, marginBottom:8 }}>🎯</div>
              <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:6 }}>Crea tu propio reto</div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:14, lineHeight:1.6 }}>Invita a tu comunidad a un reto personalizado</div>
              <button style={{ width:"100%", padding:"12px", borderRadius:12, background:C.primary+"22", border:`1px solid ${C.primary}44`, color:C.primary, fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Crear reto</button>
            </div>
          </div>
        )}

        {/* ── RANKING ── */}
        {tab==="ranking" && (
          <div style={{ padding:"16px", paddingBottom:80 }}>
            {/* Podium */}
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:8, marginBottom:24, padding:"20px 0" }}>
              {[topUsers[1],topUsers[0],topUsers[2]].map((u,i)=>{
                const heights=["110px","140px","90px"];
                const medals=["🥈","🥇","🥉"];
                return (
                  <div key={u.name} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, flex:1 }}>
                    <span style={{ fontSize:20 }}>{medals[i]}</span>
                    <Avatar size={i===1?48:38} initials={u.initials} color={u.color}/>
                    <span style={{ fontSize:10, fontWeight:700, color:C.text, textAlign:"center" }}>{u.name.split(" ")[0]}</span>
                    <div style={{
                      width:"100%", height:heights[i], borderRadius:"10px 10px 0 0",
                      background:i===1?`linear-gradient(180deg,${C.primary},${C.pDark})`:C.card,
                      border:`1px solid ${i===1?C.primary:C.border}`,
                      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2,
                    }}>
                      <span style={{ fontSize:11, fontWeight:800, color:i===1?"#fff":C.pLight, fontFamily:"'DM Mono',monospace" }}>{u.pts}</span>
                      <span style={{ fontSize:8, color:i===1?"rgba(255,255,255,0.6)":C.muted }}>pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* List */}
            <div style={{ background:C.card, borderRadius:20, padding:"14px", border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:12 }}>Ranking semanal</div>
              {topUsers.map((u,i)=>(
                <div key={u.name} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<topUsers.length-1?`1px solid ${C.border}`:"none" }}>
                  <span style={{ fontSize:12, color:C.muted, fontFamily:"'DM Mono',monospace", width:16, textAlign:"center" }}>#{i+1}</span>
                  <Avatar size={36} initials={u.initials} color={u.color}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{u.name} {u.badge}</div>
                    <div style={{ fontSize:10, color:C.muted, marginTop:1 }}>{u.pts} puntos esta semana</div>
                  </div>
                  {i<3 && <div style={{ width:8, height:8, borderRadius:"50%", background:[C.amber,C.muted,"#cd7f32"][i] }}/>}
                </div>
              ))}
              <div style={{ marginTop:10, padding:"10px 12px", background:C.primary+"18", borderRadius:12, border:`1px solid ${C.primary}33`, display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:12, color:C.primary, fontFamily:"'DM Mono',monospace", width:16 }}>#12</span>
                <Avatar size={36} initials="TÚ" color={C.primary}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:C.primary }}>Tú</div>
                  <div style={{ fontSize:10, color:C.muted }}>340 puntos · +3 posiciones esta semana</div>
                </div>
                <Tag color={C.primary}>↑3</Tag>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCreate && <CreatePostModal onClose={()=>setCreate(false)} onPost={addPost}/>}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// PHONE FRAME
// ════════════════════════════════════════════════════════════
const PhoneFrame = ({ children, label }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
    <div style={{ width:240, background:"#111118", borderRadius:44, padding:"0 6px 6px", boxShadow:"0 0 0 1px #2A2A3E, 0 30px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)" }}>
      <div style={{ display:"flex", justifyContent:"center", paddingTop:10, paddingBottom:4 }}>
        <div style={{ width:72, height:24, background:"#000", borderRadius:20 }}/>
      </div>
      <div style={{ background:C.bg, borderRadius:36, overflow:"hidden", height:480, display:"flex", flexDirection:"column" }}>
        {children}
      </div>
    </div>
    <div style={{ marginTop:12, fontSize:10, color:"#555", letterSpacing:"1px", textTransform:"uppercase", fontFamily:"'DM Mono',monospace" }}>{label}</div>
  </div>
);

// ════════════════════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════════════════════
export default function RoutineApp() {
  const [mode, setMode]           = useState("multi");
  const [singleScreen, setSingle] = useState("home");
  const [showOnboard, setOnboard] = useState(false);

  useEffect(()=>{
    const link = document.createElement("link");
    link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
  },[]);

  const screenMap = {
    home:      <HomeScreen/>,
    workout:   <WorkoutScreen/>,
    progress:  <ProgressScreen/>,
    community: <CommunityScreen/>,
  };

  const allScreens = [
    { id:"home",      label:"Home",          screen:<HomeScreen/>      },
    { id:"workout",   label:"Entrenamiento", screen:<WorkoutScreen/>   },
    { id:"progress",  label:"Progreso",      screen:<ProgressScreen/>  },
    { id:"community", label:"Comunidad",     screen:<CommunityScreen/> },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#07070E", fontFamily:"'Inter',sans-serif", padding:"24px 16px" }}>

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${C.primary},${C.pDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:`0 0 20px ${C.primary}44` }}>⚡</div>
          <span style={{ fontSize:22, fontWeight:800, color:C.text, fontFamily:"'Syne',sans-serif" }}>Routine</span>
          <Tag>Prototipo v2</Tag>
        </div>
        <div style={{ fontSize:12, color:C.muted }}>Tu entrenador personal con IA · Toca cualquier pantalla para interactuar</div>
      </div>

      {/* Mode toggle */}
      <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:28, flexWrap:"wrap" }}>
        {[["multi","Vista completa"],["single","Pantalla individual"],["onboard","Onboarding"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>{ if(id==="onboard"){setOnboard(true);setMode("onboard");}else{setMode(id);setOnboard(false);} }} style={{
            padding:"7px 14px", borderRadius:20, border:`1px solid ${mode===id?C.primary:C.border}`,
            background:mode===id?C.primary+"22":C.surface,
            color:mode===id?C.primary:C.muted, fontSize:11, cursor:"pointer", fontWeight:600,
          }}>{lbl}</button>
        ))}
      </div>

      {/* Onboarding */}
      {showOnboard && (
        <div style={{ display:"flex", justifyContent:"center" }}>
          <PhoneFrame label="Onboarding">
            <OnboardingScreen onDone={()=>{ setOnboard(false); setMode("multi"); }}/>
          </PhoneFrame>
        </div>
      )}

      {/* Multi */}
      {!showOnboard && mode==="multi" && (
        <div style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap" }}>
          {allScreens.map(s=>(
            <PhoneFrame key={s.id} label={s.label}>
              {s.screen}
              <NavBar active={s.id} setActive={()=>{}}/>
            </PhoneFrame>
          ))}
        </div>
      )}

      {/* Single */}
      {!showOnboard && mode==="single" && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
            {["home","workout","progress","community"].map(s=>(
              <button key={s} onClick={()=>setSingle(s)} style={{
                padding:"6px 14px", borderRadius:20, border:`1px solid ${singleScreen===s?C.primary:C.border}`,
                background:singleScreen===s?C.primary+"22":C.surface,
                color:singleScreen===s?C.primary:C.muted, fontSize:11, cursor:"pointer", fontWeight:600, textTransform:"capitalize",
              }}>{s}</button>
            ))}
          </div>
          <PhoneFrame label={singleScreen}>
            {screenMap[singleScreen]}
            <NavBar active={singleScreen} setActive={setSingle}/>
          </PhoneFrame>
        </div>
      )}

      <div style={{ textAlign:"center", marginTop:40, fontSize:10, color:"#333", letterSpacing:"0.5px" }}>
        ROUTINE APP · PROTOTIPO INTERACTIVO · 2025
      </div>
    </div>
  );
}