import React, { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════════════════════════════
// EXPERTCELL SALES ACADEMY — AI-Powered Training Platform
// Standalone version for GitHub Pages deployment
// ══════════════════════════════════════════════════════════════════

// ─── Default Knowledge Base ───────────────────────────────
const DEFAULT_KB = {
  objeciones: [
    { id:"ob1", q:"El cliente dice que está muy caro", a:"Técnica ACE: Acepta la preocupación ('Entiendo que el precio es importante'), Compara el valor ('¿Sabía que incluye X, Y, Z sin costo adicional?'), Ejemplifica ('Clientes como usted ahorran en promedio $X al mes vs. su plan actual'). Nunca discutas el precio directamente — redirige al valor total." },
    { id:"ob2", q:"No me interesa / No quiero cambiar", a:"Técnica del espejo: 'Entiendo perfectamente que no quiera cambiar, y precisamente por eso le llamo — para que NO pierda los beneficios que ya tiene. Déjeme hacerle una pregunta rápida: ¿está satisfecho con la velocidad de datos?' Busca un punto de dolor con preguntas abiertas." },
    { id:"ob3", q:"Ya tengo otra compañía y estoy contento", a:"'Me alegra que esté contento con su servicio. Muchos de nuestros clientes más satisfechos nos dijeron lo mismo antes de comparar. ¿Me permite 2 minutos para mostrarle qué incluye su renovación sin compromiso?' Genera curiosidad, no ataques a la competencia." },
    { id:"ob4", q:"Necesito pensarlo / consultarlo", a:"Técnica de urgencia suave: 'Por supuesto, es una decisión importante. Esta promoción tiene vigencia limitada. ¿Qué información adicional necesitaría para decidir hoy?' Si insiste: '¿Le parece si le llamo mañana a esta hora para resolver dudas?'" },
    { id:"ob5", q:"No tengo dinero ahorita", a:"Reformulación: 'Entiendo la situación. Precisamente, esta renovación puede REDUCIR lo que paga actualmente. ¿Cuánto paga hoy? [escucha] Con esta oferta pagaría $X menos. ¿Le interesaría ahorrar esa diferencia?' Convierte objeción de precio en ahorro." },
    { id:"ob6", q:"Tuve mala experiencia con AT&T", a:"Empatía + solución: 'Lamento esa experiencia, ¿me puede contar qué sucedió? [escucha activa] Eso no debió pasar. Precisamente estamos mejorando y como muestra, le ofrezco [beneficio especial]. ¿Me da la oportunidad de demostrarle el cambio?'" },
    { id:"ob7", q:"Voy a cancelar mi línea", a:"Retención: '¿Me permite entender qué lo llevó a considerar cancelar? [escucha] Tengo una solución exacta para eso. [oferta retención]. ¿Probamos por un mes y si no queda satisfecho, yo personalmente le ayudo con el proceso?'" },
    { id:"ob8", q:"No confío en las llamadas telefónicas", a:"Validación: 'Tiene razón en ser precavido. Soy [nombre] de ExpertCell, distribuidor autorizado AT&T con número de agente [X]. Puede verificar esta llamada marcando *611. ¿Continuamos?'" },
  ],
  procesos: [
    { id:"pr1", q:"Proceso de renovación", a:"1) Verificar identidad (nombre, últimos 4 dígitos IMEI o cuenta). 2) Revisar plan actual y vencimiento. 3) Presentar opciones de renovación. 4) Confirmar selección. 5) Procesar con doble verificación. 6) Entregar folio. 7) Recapitular beneficios y fecha de activación." },
    { id:"pr2", q:"Upgrade de plan", a:"1) Confirmar elegibilidad. 2) Explicar diferencias entre plan actual y superior. 3) Detallar costos adicionales. 4) Obtener autorización verbal. 5) Procesar cambio. 6) Confirmar activación. 7) Informar período de reflexión." },
    { id:"pr3", q:"Protocolo de llamada", a:"Apertura (30s): Saludo + identificación + motivo. Sondeo (60s): Preguntas sobre satisfacción. Presentación (90s): Oferta personalizada. Objeciones (variable): Máx 3 intentos de cierre. Cierre (60s): Confirmación + resumen. Despedida (15s): Agradecimiento. Total: 5-8 min." },
    { id:"pr4", q:"Sistema caído / problemas técnicos", a:"1) NO cerrar sesión. 2) Informar cliente: 'Estamos en actualización, ¿me permite un momento?' 3) Notificar supervisor por chat. 4) Si <3 min, continuar. 5) Si más, tomar datos y programar callback. 6) Registrar incidencia con hora." },
    { id:"pr5", q:"Transferencia a supervisor", a:"1) Agotar herramientas (mín 2 intentos). 2) 'Con gusto le comunico, ¿me permite?' 3) Hold con música. 4) Briefear supervisor: nombre, situación, objeciones, qué se ofreció. 5) Transferir. 6) Registrar motivo de escalación." },
  ],
  cierres: [
    { id:"ci1", q:"Cierre directo", a:"'¿Procedemos con la renovación? Solo necesito confirmar unos datos.' Funciona con interés claro. No preguntes '¿qué le parece?' — cierra con acción." },
    { id:"ci2", q:"Cierre alternativo", a:"'¿Prefiere el plan de 10GB o el de 15GB?' Dos opciones donde ambas son venta. El cliente elige entre opciones, no entre comprar o no." },
    { id:"ci3", q:"Cierre por resumen", a:"'Recapitulando: datos ilimitados, 100 min a cualquier compañía, HBO Max incluido, todo por $X menos de lo que paga hoy. ¿Le confirmo?' Lista beneficios antes de cerrar." },
    { id:"ci4", q:"Cierre de urgencia", a:"'Esta promoción está disponible solo hasta [fecha]. Después sería $X más. ¿Aprovechamos?' Solo si la urgencia es real." },
    { id:"ci5", q:"Cierre por concesión", a:"'Normalmente no puedo, pero déjeme ver... [pausa] Sí, le puedo incluir [extra]. ¿Con esto procedemos?' Hazlo sentir exclusivo." },
  ],
  tips: [
    "Sonríe al hablar — se nota en tu voz.",
    "Usa el nombre del cliente al menos 3 veces.",
    "Escucha 60%, habla 40%.",
    "Toma notas para personalizar tu cierre.",
    "Nunca interrumpas al cliente.",
    "Usa pausas después del precio — deja que el silencio trabaje.",
    "Prepara tu espacio antes del turno.",
    "Cada 'no' te acerca a un 'sí'. Promedio: 5 contactos para cerrar.",
    "Practica tu pitch en voz alta antes de empezar.",
    "Registra tus mejores frases y compártelas.",
  ],
  instrucciones_ia: "Eres el asistente de entrenamiento de ventas de ExpertCell, distribuidor autorizado de AT&T en México. Tu trabajo es ayudar a los agentes de ventas a mejorar sus habilidades de venta telefónica. Responde de forma directa, práctica y motivadora. Usa ejemplos reales del contexto de ventas telefónicas de planes AT&T (renovaciones, upgrades, retención). Cuando des consejos, sé específico con frases textuales que el agente pueda usar en llamada. Si el agente pregunta algo fuera de tu base de conocimiento, usa tu criterio para dar la mejor respuesta basándote en mejores prácticas de ventas telefónicas en México."
};

const ROLEPLAY_SCENARIOS = [
  { id:1, title:"Cliente indeciso por precio", difficulty:"Fácil", persona:"María, 35 años, ama de casa. Plan básico $299. Le interesa upgrade pero preocupa gasto extra. 2 hijos, usa mucho YouTube Kids.", personality:"Amable pero indecisa. Dice 'déjeme pensarlo'. Responde bien a ahorro y beneficios familiares.", goal:"Renovar y upgrade al plan familiar $499." },
  { id:2, title:"Cliente molesto por servicio", difficulty:"Medio", persona:"Roberto, 52 años, empresario. 3 fallas de red en el mes. Considera cambiarse a Telcel. Plan $599.", personality:"Impaciente, directo. Quiere soluciones, no disculpas. Respeta honestidad y acción.", goal:"Retener con beneficio compensatorio." },
  { id:3, title:"Cliente que quiere cancelar", difficulty:"Difícil", persona:"Ana, 28 años, freelancer. Quiere cancelar para ahorrar. Plan $399. Usa 8GB/mes.", personality:"Decidida, investigó opciones. Menciona Bait. No le gusta presión.", goal:"Mantener con plan ajustado a su uso real." },
  { id:4, title:"Cliente comparando competencia", difficulty:"Medio", persona:"Carlos, 41 años, ingeniero. Cotización Telcel mejor precio. Plan $499.", personality:"Analítico, compara datos. Quiere hechos. Le importa cobertura en carretera.", goal:"Demostrar valor superior y cerrar renovación." },
  { id:5, title:"Cliente desconfiado", difficulty:"Difícil", persona:"Doña Lupita, 67 años, jubilada. No confía en llamadas. Nieto configuró teléfono. Plan $199, vence en 5 días.", personality:"Desconfiada pero educada. Necesita explicaciones simples. Valora paciencia.", goal:"Generar confianza, renovar y ofrecer plan con más datos para videollamadas." },
];

const DAILY_EXERCISES = [
  { title:"Práctica de Apertura", type:"speech", desc:"Graba tu apertura. Máx 30 seg, nombre, empresa, motivo. Repite hasta que suene natural.", criteria:["≤ 30 seg","Tono seguro","Info completa","Sin muletillas"] },
  { title:"Maratón de Objeciones", type:"objection", desc:"Responde 5 objeciones aleatorias en <15 seg cada una.", criteria:["<15 seg","Sin titubeo","Técnica correcta","Tono empático"] },
  { title:"Cierre en 60 Segundos", type:"closing", desc:"Lleva conversación al cierre en máx 60 seg. Usa cierre por resumen.", criteria:["Resumen beneficios","Pregunta de cierre","Manejo última objeción","Confirmar datos"] },
  { title:"Escucha Activa", type:"listening", desc:"Escucha grabación: anota 3 señales de compra, 2 objeciones no resueltas, 1 oportunidad perdida.", criteria:["Señales de compra","Objeciones ocultas","Proponer mejoras","Análisis objetivo"] },
  { title:"Pitch de Valor", type:"pitch", desc:"Pitch de 45 seg del plan más vendido. 3 beneficios clave + diferenciador.", criteria:["3 beneficios","Diferenciador","Call to action","≤ 45 seg"] },
  { title:"Rapport Express", type:"rapport", desc:"3 formas de generar conexión en 15 seg. Usa datos del sistema para personalizar.", criteria:["Personalización","Naturalidad","Calidez","Brevedad"] },
  { title:"Recuperación de Llamada", type:"recovery", desc:"Cliente molesto → revierte y convierte en oportunidad de venta.", criteria:["Empatía genuina","No defensivo","Ofrecer solución","Cierre suave"] },
];

// ─── Colors ───────────────────────────────────────────────
const C = {
  bg:"#06090f", surface:"#0c1220", surfaceAlt:"#101829",
  card:"#121c2e", cardHover:"#182540",
  border:"#1a2744", borderLight:"#243352",
  accent:"#00b4d8", accentDark:"#0090b0", accentDeep:"#006d8a",
  accentGlow:"rgba(0,180,216,0.12)", accentGlow2:"rgba(0,180,216,0.06)",
  success:"#22c55e", successGlow:"rgba(34,197,94,0.12)",
  warning:"#eab308", warningGlow:"rgba(234,179,8,0.12)",
  danger:"#ef4444", dangerGlow:"rgba(239,68,68,0.12)",
  text:"#e8edf5", textSec:"#8b9ec2", textMuted:"#5a6f96",
  white:"#fff", admin:"#a855f7", adminGlow:"rgba(168,85,247,0.12)",
};

// ─── Storage (localStorage) ──────────────────────────────
function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) { console.error(e); }
}

// ─── API Key Manager ─────────────────────────────────────
function getApiKey() { return localStorage.getItem("ec_api_key") || ""; }
function setApiKey(key) { localStorage.setItem("ec_api_key", key); }

// ─── Rate Limiting ──────────────────────────────────────
function getDailyLimit() { return parseInt(localStorage.getItem("ec_daily_limit") || "30"); }
function setDailyLimit(n) { localStorage.setItem("ec_daily_limit", String(n)); }

function getUsageToday(agentId) {
  const today = new Date().toISOString().slice(0,10);
  const usage = load("ec_usage", {});
  return (usage[agentId] && usage[agentId].date === today) ? usage[agentId].count : 0;
}

function incrementUsage(agentId) {
  const today = new Date().toISOString().slice(0,10);
  const usage = load("ec_usage", {});
  if (!usage[agentId] || usage[agentId].date !== today) {
    usage[agentId] = { date: today, count: 1 };
  } else {
    usage[agentId].count += 1;
  }
  save("ec_usage", usage);
  return usage[agentId].count;
}

function canUseAI(agentId) {
  if (agentId === "admin") return true;
  const limit = getDailyLimit();
  if (limit === 0) return true; // 0 = unlimited
  return getUsageToday(agentId) < limit;
}

function getRemainingMessages(agentId) {
  if (agentId === "admin") return Infinity;
  const limit = getDailyLimit();
  if (limit === 0) return Infinity;
  return Math.max(0, limit - getUsageToday(agentId));
}

// ─── AI Call ─────────────────────────────────────────────
async function callAI(systemPrompt, userMessage, kb, agentId) {
  const apiKey = getApiKey();
  if (!apiKey) return "⚠️ No hay API key configurada. El administrador debe configurarla en el panel de admin → Instrucciones IA.";
  
  // Check rate limit
  if (agentId && agentId !== "admin") {
    if (!canUseAI(agentId)) {
      const limit = getDailyLimit();
      return `⚠️ Alcanzaste tu límite de ${limit} mensajes de IA por hoy. El límite se reinicia mañana. Mientras tanto, puedes revisar los ejercicios o la base de conocimiento.`;
    }
    incrementUsage(agentId);
  }
  
  const kbContext = `\nBASE DE CONOCIMIENTO:\n\nOBJECIONES:\n${kb.objeciones.map(o=>`P: ${o.q}\nR: ${o.a}`).join("\n\n")}\n\nPROCESOS:\n${kb.procesos.map(p=>`P: ${p.q}\nR: ${p.a}`).join("\n\n")}\n\nCIERRES:\n${kb.cierres.map(c=>`P: ${c.q}\nR: ${c.a}`).join("\n\n")}\n\nTIPS:\n${kb.tips.map((t,i)=>`${i+1}. ${t}`).join("\n")}`;
  
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model:"claude-sonnet-4-20250514",
        max_tokens:1000,
        system: systemPrompt + "\n\n" + kbContext,
        messages:[{role:"user",content:userMessage}]
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({}));
      if (res.status === 401) return "⚠️ API key inválida. Revisa la configuración en el panel de admin.";
      return `⚠️ Error de API: ${err.error?.message || res.statusText}`;
    }
    const data = await res.json();
    return data.content?.map(b => b.text || "").join("") || "No pude procesar la pregunta.";
  } catch(e) {
    return "⚠️ Error de conexión. Verifica tu internet e intenta de nuevo.";
  }
}

// ─── Small Components ─────────────────────────────────────
function Badge({text,color=C.accent,bg=C.accentGlow}) {
  return <span style={{display:"inline-block",padding:"3px 10px",borderRadius:"6px",fontSize:"11px",fontWeight:600,background:bg,color,letterSpacing:"0.5px"}}>{text}</span>;
}

function ProgressBar({pct,color=C.accent}) {
  return <div style={{height:"6px",borderRadius:"3px",background:C.surface,overflow:"hidden"}}>
    <div style={{height:"100%",width:`${Math.min(100,Math.max(0,pct))}%`,borderRadius:"3px",background:color,transition:"width 0.8s"}} />
  </div>;
}

const inputStyle = {width:"100%",padding:"10px 14px",borderRadius:"8px",border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:"13px",fontFamily:"'Outfit',sans-serif",outline:"none",boxSizing:"border-box"};
const textareaStyle = {...inputStyle, minHeight:"80px",resize:"vertical",lineHeight:1.6};

// ══════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════
function LoginScreen({ onLogin, agents }) {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (!name.trim() || !pin.trim()) { setError("Ingresa tu nombre y PIN"); return; }
    if (name.trim().toLowerCase() === "admin" && pin === "7741") {
      onLogin({ id:"admin", name:"Administrador", role:"admin" }); return;
    }
    const agent = agents.find(a => a.name.toLowerCase() === name.trim().toLowerCase() && a.pin === pin);
    if (!agent) { setError("Credenciales incorrectas"); return; }
    if (!agent.active) { setError("Tu acceso está desactivado. Contacta a tu supervisor."); return; }
    onLogin({ ...agent, role:"agent" });
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`radial-gradient(ellipse at 30% 20%, rgba(0,180,216,0.08) 0%, ${C.bg} 60%)`,fontFamily:"'Outfit',sans-serif",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:"400px"}}>
        <div style={{textAlign:"center",marginBottom:"36px"}}>
          <div style={{width:"60px",height:"60px",borderRadius:"16px",background:`linear-gradient(135deg,${C.accent},${C.accentDeep})`,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"22px",fontWeight:900,color:C.white,boxShadow:`0 8px 32px ${C.accentGlow}`,marginBottom:"14px"}}>EC</div>
          <div style={{fontSize:"24px",fontWeight:800,color:C.white}}>Sales Academy</div>
          <div style={{fontSize:"11px",color:C.textMuted,letterSpacing:"3px",textTransform:"uppercase",marginTop:"4px"}}>ExpertCell × AT&T</div>
        </div>
        <div style={{background:C.card,borderRadius:"20px",border:`1px solid ${C.border}`,padding:"28px",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>
          <div style={{fontSize:"17px",fontWeight:700,color:C.white,marginBottom:"22px",textAlign:"center"}}>Iniciar Sesión</div>
          <div style={{marginBottom:"14px"}}>
            <label style={{fontSize:"11px",color:C.textMuted,textTransform:"uppercase",letterSpacing:"1.5px",fontWeight:600,display:"block",marginBottom:"6px"}}>Nombre</label>
            <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="Tu nombre completo" style={inputStyle} />
          </div>
          <div style={{marginBottom:"22px"}}>
            <label style={{fontSize:"11px",color:C.textMuted,textTransform:"uppercase",letterSpacing:"1.5px",fontWeight:600,display:"block",marginBottom:"6px"}}>PIN</label>
            <input type="password" value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="Tu PIN de acceso" style={inputStyle} />
          </div>
          {error && <div style={{color:C.danger,fontSize:"13px",marginBottom:"14px",textAlign:"center",padding:"8px",borderRadius:"8px",background:C.dangerGlow}}>{error}</div>}
          <button onClick={handleLogin} style={{width:"100%",padding:"13px",borderRadius:"12px",border:"none",background:`linear-gradient(135deg,${C.accent},${C.accentDark})`,color:C.white,fontSize:"15px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 4px 20px ${C.accentGlow}`}}>Entrar</button>
        </div>
        <div style={{textAlign:"center",marginTop:"14px",fontSize:"11px",color:C.textMuted}}>Contacta a tu supervisor si no tienes acceso</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// ADMIN PANEL
// ══════════════════════════════════════════════════════════
function AdminPanel({ agents, setAgents, kb, setKb, allProgress }) {
  const [adminTab, setAdminTab] = useState("agents");
  const [editingKb, setEditingKb] = useState(null);
  const [newAgent, setNewAgent] = useState({name:"",pin:"",active:true});
  const [newKbItem, setNewKbItem] = useState({category:"objeciones",q:"",a:""});
  const [iaInstructions, setIaInstructions] = useState(kb.instrucciones_ia);
  const [apiKey, setApiKeyState] = useState(getApiKey());
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [dailyLimit, setDailyLimitState] = useState(getDailyLimit());
  const [limitSaved, setLimitSaved] = useState(false);

  const saveAgents = (updated) => { setAgents(updated); save("ec_agents", updated); };
  const saveKb = (updated) => { setKb(updated); save("ec_kb", updated); };

  const toggleAgent = (id) => saveAgents(agents.map(a => a.id===id ? {...a,active:!a.active} : a));
  const removeAgent = (id) => saveAgents(agents.filter(a => a.id !== id));

  const addAgent = () => {
    if (!newAgent.name.trim() || !newAgent.pin.trim()) return;
    saveAgents([...agents, { id:"agent_"+Date.now(), ...newAgent }]);
    setNewAgent({name:"",pin:"",active:true});
  };

  const addKbItem = () => {
    if (!newKbItem.q.trim() || !newKbItem.a.trim()) return;
    const cat = newKbItem.category;
    const updated = { ...kb, [cat]: [...kb[cat], { id:cat.substring(0,2)+"_"+Date.now(), q:newKbItem.q, a:newKbItem.a }] };
    saveKb(updated);
    setNewKbItem({...newKbItem, q:"", a:""});
  };

  const removeKbItem = (cat, id) => saveKb({ ...kb, [cat]: kb[cat].filter(item => item.id !== id) });
  const updateKbItem = (cat, id, field, value) => saveKb({ ...kb, [cat]: kb[cat].map(item => item.id===id ? {...item,[field]:value} : item) });

  const saveIaInstructions = () => saveKb({ ...kb, instrucciones_ia: iaInstructions });
  
  const handleSaveApiKey = () => {
    setApiKey(apiKey);
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2000);
  };
  
  const handleSaveLimit = () => {
    setDailyLimit(dailyLimit);
    setLimitSaved(true);
    setTimeout(() => setLimitSaved(false), 2000);
  };

  const tabBtnStyle = (active) => ({padding:"9px 18px",borderRadius:"10px",border:"none",cursor:"pointer",fontSize:"12px",fontWeight:active?700:400,fontFamily:"inherit",color:active?C.white:C.textSec,background:active?C.admin:"transparent",transition:"all 0.2s"});

  return (
    <div>
      <div style={{display:"flex",gap:"3px",background:C.surface,borderRadius:"12px",padding:"3px",marginBottom:"24px",flexWrap:"wrap"}}>
        {[{id:"agents",label:"👥 Agentes"},{id:"knowledge",label:"📚 Conocimiento"},{id:"ai",label:"🤖 Config IA"},{id:"monitor",label:"📊 Monitor"}].map(t =>
          <button key={t.id} style={tabBtnStyle(adminTab===t.id)} onClick={()=>setAdminTab(t.id)}>{t.label}</button>
        )}
      </div>

      {/* AGENTS */}
      {adminTab === "agents" && (
        <div>
          <div style={{fontSize:"22px",fontWeight:800,color:C.white,marginBottom:"4px"}}>Gestión de Agentes</div>
          <p style={{fontSize:"13px",color:C.textSec,marginBottom:"20px"}}>Solo los agentes activos pueden ingresar a la plataforma.</p>
          
          <div style={{background:C.card,borderRadius:"14px",border:`1px solid ${C.border}`,padding:"18px",marginBottom:"18px"}}>
            <div style={{fontSize:"14px",fontWeight:700,color:C.white,marginBottom:"12px"}}>+ Nuevo Agente</div>
            <div style={{display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"end"}}>
              <div style={{flex:"1 1 180px"}}>
                <label style={{fontSize:"10px",color:C.textMuted,textTransform:"uppercase",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>Nombre</label>
                <input style={inputStyle} value={newAgent.name} onChange={e=>setNewAgent({...newAgent,name:e.target.value})} placeholder="Nombre completo" />
              </div>
              <div style={{flex:"1 1 120px"}}>
                <label style={{fontSize:"10px",color:C.textMuted,textTransform:"uppercase",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>PIN</label>
                <input style={inputStyle} value={newAgent.pin} onChange={e=>setNewAgent({...newAgent,pin:e.target.value})} placeholder="4 dígitos" maxLength={6} />
              </div>
              <button onClick={addAgent} style={{padding:"10px 18px",borderRadius:"8px",border:"none",background:C.success,color:C.white,fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",height:"40px",whiteSpace:"nowrap"}}>Agregar</button>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
            {agents.map(a => (
              <div key={a.id} style={{background:C.card,borderRadius:"10px",border:`1px solid ${C.border}`,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",opacity:a.active?1:0.5,flexWrap:"wrap",gap:"8px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <div style={{width:"32px",height:"32px",borderRadius:"8px",background:a.active?C.accentGlow:C.dangerGlow,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:700,color:a.active?C.accent:C.danger}}>{a.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{fontSize:"14px",fontWeight:600,color:C.white}}>{a.name}</div>
                    <div style={{fontSize:"11px",color:C.textMuted}}>PIN: {a.pin} · {a.active?"Activo":"Bloqueado"}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:"6px"}}>
                  <button onClick={()=>toggleAgent(a.id)} style={{padding:"5px 12px",borderRadius:"6px",border:`1px solid ${a.active?C.danger:C.success}`,background:"transparent",color:a.active?C.danger:C.success,fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{a.active?"Bloquear":"Activar"}</button>
                  <button onClick={()=>removeAgent(a.id)} style={{padding:"5px 12px",borderRadius:"6px",border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}}>Eliminar</button>
                </div>
              </div>
            ))}
            {agents.length===0 && <div style={{textAlign:"center",padding:"40px",color:C.textMuted}}>No hay agentes registrados</div>}
          </div>
        </div>
      )}

      {/* KNOWLEDGE BASE */}
      {adminTab === "knowledge" && (
        <div>
          <div style={{fontSize:"22px",fontWeight:800,color:C.white,marginBottom:"4px"}}>Base de Conocimiento</div>
          <p style={{fontSize:"13px",color:C.textSec,marginBottom:"20px"}}>Lo que escribas aquí es lo que la IA usará para responder. Tus respuestas entrenan al asistente.</p>
          
          <div style={{background:C.card,borderRadius:"14px",border:`1px solid ${C.border}`,padding:"18px",marginBottom:"20px"}}>
            <div style={{fontSize:"14px",fontWeight:700,color:C.white,marginBottom:"12px"}}>+ Agregar Entrada</div>
            <div style={{marginBottom:"10px"}}>
              <select value={newKbItem.category} onChange={e=>setNewKbItem({...newKbItem,category:e.target.value})} style={{...inputStyle,cursor:"pointer"}}>
                <option value="objeciones">Objeciones</option><option value="procesos">Procesos</option><option value="cierres">Cierres</option>
              </select>
            </div>
            <input style={{...inputStyle,marginBottom:"10px"}} value={newKbItem.q} onChange={e=>setNewKbItem({...newKbItem,q:e.target.value})} placeholder="Pregunta / Situación" />
            <textarea style={{...textareaStyle,marginBottom:"12px"}} value={newKbItem.a} onChange={e=>setNewKbItem({...newKbItem,a:e.target.value})} placeholder="Tu respuesta ideal — exactamente cómo quieres que el agente responda" />
            <button onClick={addKbItem} style={{padding:"10px 18px",borderRadius:"8px",border:"none",background:C.success,color:C.white,fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Guardar</button>
          </div>

          {["objeciones","procesos","cierres"].map(cat => (
            <div key={cat} style={{marginBottom:"20px"}}>
              <div style={{fontSize:"15px",fontWeight:700,color:C.accent,marginBottom:"10px"}}>{cat==="objeciones"?"🛡️ Objeciones":cat==="procesos"?"📋 Procesos":"🎯 Cierres"} ({kb[cat].length})</div>
              {kb[cat].map(item => (
                <div key={item.id} style={{background:C.card,borderRadius:"10px",border:`1px solid ${editingKb===item.id?C.accent:C.border}`,padding:"14px",marginBottom:"6px"}}>
                  {editingKb===item.id ? (
                    <div>
                      <input style={{...inputStyle,marginBottom:"8px",fontWeight:600}} value={item.q} onChange={e=>updateKbItem(cat,item.id,"q",e.target.value)} />
                      <textarea style={{...textareaStyle,marginBottom:"8px"}} value={item.a} onChange={e=>updateKbItem(cat,item.id,"a",e.target.value)} />
                      <button onClick={()=>setEditingKb(null)} style={{padding:"6px 14px",borderRadius:"6px",border:"none",background:C.accent,color:C.white,fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✓ Listo</button>
                    </div>
                  ) : (
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"10px"}}>
                        <div style={{fontSize:"13px",fontWeight:600,color:C.white,marginBottom:"4px",flex:1}}>{item.q}</div>
                        <div style={{display:"flex",gap:"4px",flexShrink:0}}>
                          <button onClick={()=>setEditingKb(item.id)} style={{padding:"3px 8px",borderRadius:"4px",border:`1px solid ${C.border}`,background:"transparent",color:C.textSec,fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}}>Editar</button>
                          <button onClick={()=>removeKbItem(cat,item.id)} style={{padding:"3px 8px",borderRadius:"4px",border:`1px solid ${C.border}`,background:"transparent",color:C.danger,fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}}>×</button>
                        </div>
                      </div>
                      <div style={{fontSize:"12px",color:C.textSec,lineHeight:1.5}}>{item.a.length>180?item.a.substring(0,180)+"...":item.a}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* AI CONFIG */}
      {adminTab === "ai" && (
        <div>
          <div style={{fontSize:"22px",fontWeight:800,color:C.white,marginBottom:"4px"}}>Configuración de IA</div>
          <p style={{fontSize:"13px",color:C.textSec,marginBottom:"20px"}}>Configura la API key y las instrucciones que guían al asistente.</p>
          
          {/* API Key */}
          <div style={{background:C.card,borderRadius:"14px",border:`1px solid ${C.border}`,padding:"20px",marginBottom:"18px"}}>
            <div style={{fontSize:"14px",fontWeight:700,color:C.white,marginBottom:"10px"}}>🔑 API Key de Anthropic</div>
            <p style={{fontSize:"12px",color:C.textSec,marginBottom:"12px",lineHeight:1.6}}>
              Necesitas una API key de Anthropic para que la IA funcione. Obtén una en <span style={{color:C.accent}}>console.anthropic.com</span>. La key se guarda solo en TU navegador.
            </p>
            <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
              <input type="password" value={apiKey} onChange={e=>setApiKeyState(e.target.value)} placeholder="sk-ant-..." style={{...inputStyle,flex:1}} />
              <button onClick={handleSaveApiKey} style={{padding:"10px 18px",borderRadius:"8px",border:"none",background:apiKeySaved?C.success:C.admin,color:C.white,fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                {apiKeySaved?"✓ Guardada":"Guardar"}
              </button>
            </div>
          </div>

          {/* Daily Limit */}
          <div style={{background:C.card,borderRadius:"14px",border:`1px solid ${C.border}`,padding:"20px",marginBottom:"18px"}}>
            <div style={{fontSize:"14px",fontWeight:700,color:C.white,marginBottom:"10px"}}>📊 Límite de Mensajes IA por Día</div>
            <p style={{fontSize:"12px",color:C.textSec,marginBottom:"12px",lineHeight:1.6}}>
              Controla cuántos mensajes de IA puede enviar cada agente por día. Aplica al chat y al roleplay. Pon <strong style={{color:C.accent}}>0</strong> para ilimitado.
            </p>
            <div style={{display:"flex",gap:"10px",alignItems:"center",marginBottom:"14px"}}>
              <input type="number" min="0" max="500" value={dailyLimit} onChange={e=>setDailyLimitState(parseInt(e.target.value)||0)} style={{...inputStyle,width:"120px",textAlign:"center",fontSize:"18px",fontWeight:700}} />
              <span style={{fontSize:"13px",color:C.textSec}}>mensajes / agente / día</span>
              <button onClick={handleSaveLimit} style={{padding:"10px 18px",borderRadius:"8px",border:"none",background:limitSaved?C.success:C.admin,color:C.white,fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",marginLeft:"auto"}}>
                {limitSaved?"✓ Guardado":"Guardar"}
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"8px"}}>
              {[10,20,30,50,0].map(n => (
                <button key={n} onClick={()=>setDailyLimitState(n)} style={{padding:"8px",borderRadius:"8px",border:`1px solid ${dailyLimit===n?C.accent:C.border}`,background:dailyLimit===n?C.accentGlow:"transparent",color:dailyLimit===n?C.accent:C.textMuted,fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>
                  {n===0?"♾️ Ilimitado":`${n} msgs/día`}
                </button>
              ))}
            </div>
            
            {/* Usage today per agent */}
            {agents.length > 0 && (
              <div style={{marginTop:"16px",borderTop:`1px solid ${C.border}`,paddingTop:"14px"}}>
                <div style={{fontSize:"12px",fontWeight:700,color:C.textSec,marginBottom:"10px",textTransform:"uppercase",letterSpacing:"1px"}}>Uso de hoy</div>
                <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                  {agents.map(a => {
                    const used = getUsageToday(a.id);
                    const limit = getDailyLimit();
                    const pct = limit > 0 ? (used/limit)*100 : 0;
                    return (
                      <div key={a.id} style={{display:"flex",alignItems:"center",gap:"10px"}}>
                        <span style={{fontSize:"12px",color:C.white,fontWeight:600,width:"100px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</span>
                        <div style={{flex:1,height:"6px",borderRadius:"3px",background:C.surface,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${Math.min(100,pct)}%`,borderRadius:"3px",background:pct>=90?C.danger:pct>=70?C.warning:C.accent,transition:"width 0.5s"}}/>
                        </div>
                        <span style={{fontSize:"11px",color:pct>=100?C.danger:C.textMuted,fontWeight:600,minWidth:"60px",textAlign:"right"}}>
                          {used}{limit>0?`/${limit}`:""} msgs
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div style={{background:C.card,borderRadius:"14px",border:`1px solid ${C.border}`,padding:"20px",marginBottom:"18px"}}>
            <div style={{fontSize:"14px",fontWeight:700,color:C.white,marginBottom:"10px"}}>🧠 Personalidad del Asistente</div>
            <textarea value={iaInstructions} onChange={e=>setIaInstructions(e.target.value)} style={{...textareaStyle,minHeight:"180px"}} placeholder="Describe cómo quieres que se comporte la IA..." />
            <div style={{marginTop:"12px"}}>
              <button onClick={saveIaInstructions} style={{padding:"10px 20px",borderRadius:"8px",border:"none",background:C.admin,color:C.white,fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>💾 Guardar Instrucciones</button>
            </div>
          </div>

          <div style={{background:C.card,borderRadius:"14px",border:`1px solid ${C.border}`,padding:"18px"}}>
            <div style={{fontSize:"14px",fontWeight:700,color:C.white,marginBottom:"10px"}}>💡 Tips para entrenar tu IA</div>
            <div style={{fontSize:"12px",color:C.textSec,lineHeight:1.8}}>
              • Sé específico: "responde como coach motivador con frases de acción"<br/>
              • Define tono: "Tutea, lenguaje coloquial mexicano, sé directo"<br/>
              • Restricciones: "Nunca recomiendes bajar precio sin autorización"<br/>
              • Contexto: "Cuando pregunten sobre Telcel, resalta cobertura AT&T"<br/>
              • La IA combina instrucciones + base de conocimiento para responder
            </div>
          </div>
        </div>
      )}

      {/* MONITOR */}
      {adminTab === "monitor" && (
        <div>
          <div style={{fontSize:"22px",fontWeight:800,color:C.white,marginBottom:"4px"}}>Monitor de Progreso</div>
          <p style={{fontSize:"13px",color:C.textSec,marginBottom:"20px"}}>Progreso de cada agente basado en sus datos registrados.</p>
          
          {agents.map(agent => {
            const prog = allProgress[agent.id] || [];
            const totalV = prog.reduce((a,b)=>a+b.ventas,0);
            const avgC = prog.length ? (prog.reduce((a,b)=>a+(b.ventas/b.intentos*100),0)/prog.length).toFixed(1) : "0";
            return (
              <div key={agent.id} style={{background:C.card,borderRadius:"12px",border:`1px solid ${C.border}`,padding:"18px",marginBottom:"10px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"12px"}}>
                  <div style={{width:"30px",height:"30px",borderRadius:"8px",background:agent.active?C.accentGlow:C.dangerGlow,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:700,color:agent.active?C.accent:C.danger}}>{agent.name.charAt(0).toUpperCase()}</div>
                  <span style={{fontSize:"14px",fontWeight:700,color:C.white}}>{agent.name}</span>
                  <span style={{fontSize:"11px",color:agent.active?C.success:C.danger}}>● {agent.active?"Activo":"Bloqueado"}</span>
                </div>
                {prog.length > 0 ? (
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}}>
                    <div style={{background:C.surface,borderRadius:"8px",padding:"10px",textAlign:"center"}}>
                      <div style={{fontSize:"20px",fontWeight:800,color:C.accent}}>{totalV}</div>
                      <div style={{fontSize:"10px",color:C.textMuted,textTransform:"uppercase",letterSpacing:"1px"}}>Ventas</div>
                    </div>
                    <div style={{background:C.surface,borderRadius:"8px",padding:"10px",textAlign:"center"}}>
                      <div style={{fontSize:"20px",fontWeight:800,color:parseFloat(avgC)>=20?C.success:C.warning}}>{avgC}%</div>
                      <div style={{fontSize:"10px",color:C.textMuted,textTransform:"uppercase",letterSpacing:"1px"}}>Cierre</div>
                    </div>
                    <div style={{background:C.surface,borderRadius:"8px",padding:"10px",textAlign:"center"}}>
                      <div style={{fontSize:"20px",fontWeight:800,color:C.white}}>{prog.length}</div>
                      <div style={{fontSize:"10px",color:C.textMuted,textTransform:"uppercase",letterSpacing:"1px"}}>Semanas</div>
                    </div>
                  </div>
                ) : <div style={{fontSize:"12px",color:C.textMuted,textAlign:"center",padding:"10px"}}>Sin datos aún</div>}
              </div>
            );
          })}
          {agents.length===0 && <div style={{textAlign:"center",padding:"50px",color:C.textMuted}}>Agrega agentes primero</div>}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// AI CHAT
// ══════════════════════════════════════════════════════════
function AIChat({ kb, agentName, agentId }) {
  const [messages, setMessages] = useState([{role:"bot",text:`¡Hola ${agentName}! 👋 Soy tu asistente de ventas con IA. Pregúntame sobre objeciones, procesos, cierres, o cualquier situación.`}]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(getRemainingMessages(agentId));
  const endRef = useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"})},[messages]);

  const send = async () => {
    if (!input.trim()||loading) return;
    if (!canUseAI(agentId)) {
      setMessages(p=>[...p,{role:"user",text:input.trim()},{role:"bot",text:`⚠️ Alcanzaste tu límite de mensajes IA por hoy (${getDailyLimit()}). El límite se reinicia mañana.`}]);
      setInput(""); return;
    }
    const msg = input.trim();
    setMessages(p=>[...p,{role:"user",text:msg}]);
    setInput("");
    setLoading(true);
    const sys = kb.instrucciones_ia + `\nEl agente se llama ${agentName}. Responde en español, práctico y directo. Usa la base de conocimiento como referencia. Formatea con saltos de línea.`;
    const response = await callAI(sys, msg, kb, agentId);
    setMessages(p=>[...p,{role:"bot",text:response}]);
    setRemaining(getRemainingMessages(agentId));
    setLoading(false);
  };

  const quickQ = ["¿Cómo manejo objeción de precio?","Técnicas de cierre","Protocolo de llamada","Cliente quiere cancelar","Tips de venta","¿Cómo genero confianza?"];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 180px)",maxHeight:"750px",background:C.surface,borderRadius:"18px",border:`1px solid ${C.border}`,overflow:"hidden"}}>
      <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <div style={{width:"8px",height:"8px",borderRadius:"50%",background:C.success,boxShadow:`0 0 8px ${C.success}`}} />
          <span style={{fontSize:"12px",fontWeight:600,color:C.textSec}}>Asistente IA — Entrenado por ExpertCell</span>
        </div>
        {remaining !== Infinity && <span style={{fontSize:"11px",color:remaining<=5?C.danger:remaining<=10?C.warning:C.textMuted,fontWeight:600,padding:"3px 10px",borderRadius:"12px",background:remaining<=5?C.dangerGlow:remaining<=10?C.warningGlow:"transparent"}}>
          {remaining} msgs restantes hoy
        </span>}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"18px",display:"flex",flexDirection:"column",gap:"12px"}}>
        {messages.map((m,i)=>(
          <div key={i} style={m.role==="user"?{alignSelf:"flex-end",background:`linear-gradient(135deg,${C.accent},${C.accentDark})`,color:C.white,padding:"11px 16px",borderRadius:"16px 16px 4px 16px",maxWidth:"78%",fontSize:"14px",lineHeight:1.5}:{alignSelf:"flex-start",background:C.card,color:C.text,padding:"12px 16px",borderRadius:"16px 16px 16px 4px",maxWidth:"82%",fontSize:"14px",lineHeight:1.7,border:`1px solid ${C.border}`}}>
            {m.text.split("\n").map((l,j)=><div key={j} style={{marginBottom:l===""?"8px":"2px"}}>{l}</div>)}
          </div>
        ))}
        {loading && <div style={{alignSelf:"flex-start",background:C.card,padding:"12px 20px",borderRadius:"16px",border:`1px solid ${C.border}`,display:"flex",gap:"5px"}}>{[0,1,2].map(i=><span key={i} style={{width:"6px",height:"6px",borderRadius:"50%",background:C.textMuted,animation:`pulse 1.4s infinite ${i*0.2}s`}}/>)}</div>}
        <div ref={endRef}/>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:"5px",padding:"0 14px 8px"}}>
        {quickQ.map((q,i)=><button key={i} onClick={()=>setInput(q)} style={{padding:"4px 10px",borderRadius:"14px",border:`1px solid ${C.borderLight}`,background:"transparent",color:C.textMuted,fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}} onMouseEnter={e=>{e.target.style.borderColor=C.accent;e.target.style.color=C.accent}} onMouseLeave={e=>{e.target.style.borderColor=C.borderLight;e.target.style.color=C.textMuted}}>{q}</button>)}
      </div>
      <div style={{display:"flex",gap:"8px",padding:"12px 14px",borderTop:`1px solid ${C.border}`}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Pregúntame lo que necesites..." style={{...inputStyle,flex:1}} />
        <button onClick={send} disabled={loading} style={{padding:"10px 20px",borderRadius:"10px",border:"none",background:loading?"#444":C.accent,color:C.white,fontSize:"14px",fontWeight:600,cursor:loading?"wait":"pointer",fontFamily:"inherit"}}>{loading?"...":"→"}</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// AI ROLEPLAY
// ══════════════════════════════════════════════════════════
function AIRoleplay({ kb, agentName, agentId }) {
  const [selected, setSelected] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [turnCount, setTurnCount] = useState(0);
  const endRef = useRef(null);
  const historyRef = useRef([]);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"})},[msgs]);

  const apiKey = getApiKey();

  const aiCall = async (sys, history) => {
    if (!apiKey) return "⚠️ API key no configurada.";
    if (agentId && agentId !== "admin" && !canUseAI(agentId)) {
      return `⚠️ Límite de mensajes alcanzado (${getDailyLimit()}/día). Intenta mañana.`;
    }
    if (agentId && agentId !== "admin") incrementUsage(agentId);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,system:sys,messages:history})
      });
      const data = await res.json();
      return data.content?.map(b=>b.text||"").join("")||"...";
    } catch { return "Error de conexión."; }
  };

  const startScenario = async (s) => {
    setSelected(s); setFeedback(null); setTurnCount(0);
    historyRef.current = [];
    setMsgs([{role:"system",text:`📋 ${s.title}\n🎭 ${s.persona}\n🎯 ${s.goal}\n\nTienes 6 turnos. ¡Comienza!`}]);
    setLoading(true);
    const sys = `Eres ${s.persona}. Personalidad: ${s.personality}. Actúa como este cliente en una llamada. Responde breve (1-3 oraciones). Contesta el teléfono. Habla en español mexicano coloquial.`;
    const reply = await aiCall(sys, [{role:"user",content:"El agente te llama. Contesta el teléfono."}]);
    historyRef.current = [{role:"assistant",content:reply}];
    setMsgs(p=>[...p,{role:"bot",text:reply}]);
    setLoading(false);
  };

  const sendRp = async () => {
    if (!input.trim()||loading||!selected) return;
    const msg = input.trim();
    setMsgs(p=>[...p,{role:"user",text:msg}]);
    setInput(""); setLoading(true);
    const newTurn = turnCount+1;
    setTurnCount(newTurn);
    historyRef.current.push({role:"user",content:msg});

    if (newTurn >= 6) {
      const convStr = historyRef.current.map(m=>`${m.role==="user"?"AGENTE":"CLIENTE"}: ${m.content}`).join("\n");
      const fbPrompt = `Evalúa este roleplay de ventas. Agente: "${agentName}". Escenario: "${selected.title}". Objetivo: ${selected.goal}.\n\nConversación:\n${convStr}\n\nResponde SOLO JSON: {"score":85,"strengths":["...","...","..."],"improvements":["...","...","..."],"recommendation":"..."}`;
      try {
        const fbReply = await aiCall("Responde SOLO JSON válido sin markdown.", [{role:"user",content:fbPrompt}]);
        setFeedback(JSON.parse(fbReply.replace(/```json|```/g,"").trim()));
      } catch { setFeedback({score:70,strengths:["Completaste el ejercicio"],improvements:["Practica cierres directos"],recommendation:"Repite enfocándote en cerrar antes."}); }
      setMsgs(p=>[...p,{role:"system",text:"🏁 ¡Roleplay completado!"}]);
      setLoading(false); return;
    }

    const sys = `Eres ${selected.persona}. Personalidad: ${selected.personality}. Responde breve en español mexicano. ${newTurn>=4?"Puedes ceder si fue convincente.":"Mantén postura."}`;
    const reply = await aiCall(sys, historyRef.current);
    historyRef.current.push({role:"assistant",content:reply});
    setMsgs(p=>[...p,{role:"bot",text:reply}]);
    setLoading(false);
  };

  if (!selected) return (
    <div>
      <div style={{fontSize:"24px",fontWeight:800,color:C.white,marginBottom:"4px"}}>Roleplay con IA</div>
      <p style={{fontSize:"13px",color:C.textSec,marginBottom:"20px"}}>Clientes simulados con IA. Se adaptan a lo que dices y te evalúan.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"12px"}}>
        {ROLEPLAY_SCENARIOS.map(s=>(
          <div key={s.id} onClick={()=>startScenario(s)} style={{background:C.card,borderRadius:"14px",border:`1px solid ${C.border}`,padding:"18px",cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}>
              <Badge text={s.difficulty} color={s.difficulty==="Fácil"?C.success:s.difficulty==="Medio"?C.warning:C.danger} bg={s.difficulty==="Fácil"?C.successGlow:s.difficulty==="Medio"?C.warningGlow:C.dangerGlow}/>
            </div>
            <div style={{fontSize:"15px",fontWeight:700,color:C.white,marginBottom:"4px"}}>{s.title}</div>
            <div style={{fontSize:"12px",color:C.textSec,lineHeight:1.5,marginBottom:"8px"}}>{s.persona.substring(0,80)}...</div>
            <div style={{fontSize:"11px",color:C.accent,fontWeight:600}}>🎯 {s.goal}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px",flexWrap:"wrap",gap:"10px"}}>
        <div>
          <div style={{fontSize:"18px",fontWeight:800,color:C.white}}>🎭 {selected.title}</div>
          <div style={{fontSize:"11px",color:C.textSec}}>Turno {Math.min(turnCount+1,6)}/6 · {selected.goal}</div>
        </div>
        <button onClick={()=>{setSelected(null);setMsgs([]);setFeedback(null)}} style={{padding:"6px 14px",borderRadius:"6px",border:`1px solid ${C.border}`,background:"transparent",color:C.textSec,fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}}>← Volver</button>
      </div>
      <div style={{display:"flex",gap:"3px",marginBottom:"12px"}}>{[...Array(6)].map((_,i)=><div key={i} style={{flex:1,height:"3px",borderRadius:"2px",background:i<turnCount?C.accent:C.border}}/>)}</div>
      
      {feedback && (
        <div style={{background:C.card,borderRadius:"14px",border:`1px solid ${feedback.score>=80?"rgba(34,197,94,0.3)":"rgba(234,179,8,0.3)"}`,padding:"20px",marginBottom:"14px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"14px"}}>
            <div style={{fontSize:"40px",fontWeight:900,color:feedback.score>=80?C.success:feedback.score>=60?C.warning:C.danger}}>{feedback.score}</div>
            <div><div style={{fontSize:"15px",fontWeight:700,color:C.white}}>Evaluación</div><div style={{fontSize:"12px",color:C.textSec}}>{feedback.score>=80?"¡Excelente!":feedback.score>=60?"Buen trabajo":"Más práctica"}</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px",marginBottom:"12px"}}>
            <div><div style={{fontSize:"11px",color:C.success,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:"6px"}}>✓ Fortalezas</div>{feedback.strengths?.map((s,i)=><div key={i} style={{fontSize:"12px",color:C.textSec,padding:"2px 0"}}>• {s}</div>)}</div>
            <div><div style={{fontSize:"11px",color:C.warning,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:"6px"}}>△ Mejora</div>{feedback.improvements?.map((s,i)=><div key={i} style={{fontSize:"12px",color:C.textSec,padding:"2px 0"}}>• {s}</div>)}</div>
          </div>
          {feedback.recommendation && <div style={{fontSize:"12px",color:C.accent,padding:"8px 12px",background:C.accentGlow2,borderRadius:"6px"}}>💡 {feedback.recommendation}</div>}
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",height:feedback?"350px":"calc(100vh - 300px)",maxHeight:"550px",background:C.surface,borderRadius:"16px",border:`1px solid ${C.border}`,overflow:"hidden"}}>
        <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:"10px"}}>
          {msgs.map((m,i)=><div key={i} style={m.role==="system"?{alignSelf:"center",background:C.accentGlow2,color:C.textSec,padding:"8px 14px",borderRadius:"10px",fontSize:"12px",lineHeight:1.5,textAlign:"center",maxWidth:"90%"}:m.role==="user"?{alignSelf:"flex-end",background:`linear-gradient(135deg,${C.accent},${C.accentDark})`,color:C.white,padding:"10px 14px",borderRadius:"14px 14px 4px 14px",maxWidth:"75%",fontSize:"13px",lineHeight:1.5}:{alignSelf:"flex-start",background:C.card,color:C.text,padding:"10px 14px",borderRadius:"14px 14px 14px 4px",maxWidth:"78%",fontSize:"13px",lineHeight:1.6,border:`1px solid ${C.border}`}}>{m.text.split("\n").map((l,j)=><div key={j} style={{marginBottom:l===""?"6px":"1px"}}>{l}</div>)}</div>)}
          {loading && <div style={{alignSelf:"flex-start",background:C.card,padding:"10px 18px",borderRadius:"14px",border:`1px solid ${C.border}`,display:"flex",gap:"4px"}}>{[0,1,2].map(i=><span key={i} style={{width:"5px",height:"5px",borderRadius:"50%",background:C.textMuted,animation:`pulse 1.4s infinite ${i*0.2}s`}}/>)}</div>}
          <div ref={endRef}/>
        </div>
        {!feedback && <div style={{display:"flex",gap:"8px",padding:"10px 14px",borderTop:`1px solid ${C.border}`}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendRp()} placeholder="Responde como agente..." style={{...inputStyle,flex:1}}/>
          <button onClick={sendRp} disabled={loading} style={{padding:"10px 18px",borderRadius:"8px",border:"none",background:loading?"#444":C.accent,color:C.white,fontSize:"13px",fontWeight:600,cursor:loading?"wait":"pointer",fontFamily:"inherit"}}>→</button>
        </div>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// EXERCISES
// ══════════════════════════════════════════════════════════
function AgentExercises() {
  const [completed, setCompleted] = useState(new Set());
  const todayEx = DAILY_EXERCISES[new Date().getDay() % DAILY_EXERCISES.length];

  return (
    <div>
      <div style={{fontSize:"24px",fontWeight:800,color:C.white,marginBottom:"4px"}}>Ejercicios</div>
      <p style={{fontSize:"13px",color:C.textSec,marginBottom:"20px"}}>Práctica diaria para mejorar</p>
      <div style={{background:`linear-gradient(135deg,${C.card},rgba(0,180,216,0.06))`,borderRadius:"16px",border:`1px solid rgba(0,180,216,0.2)`,padding:"22px",marginBottom:"24px"}}>
        <Badge text="EJERCICIO DEL DÍA"/>
        <div style={{fontSize:"18px",fontWeight:800,color:C.white,margin:"8px 0 6px"}}>{todayEx.title}</div>
        <p style={{fontSize:"13px",color:C.textSec,lineHeight:1.6,marginBottom:"12px"}}>{todayEx.desc}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{todayEx.criteria.map((c,i)=><span key={i} style={{padding:"3px 10px",borderRadius:"6px",background:C.accentGlow2,color:C.textSec,fontSize:"11px"}}>✓ {c}</span>)}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"12px"}}>
        {DAILY_EXERCISES.map((ex,i)=>(
          <div key={i} style={{background:C.card,borderRadius:"12px",border:`1px solid ${C.border}`,padding:"18px",opacity:completed.has(i)?0.5:1}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div><Badge text={ex.type}/><div style={{fontSize:"15px",fontWeight:700,color:C.white,marginTop:"6px"}}>{ex.title}</div></div>
              <button onClick={()=>setCompleted(p=>{const n=new Set(p);n.has(i)?n.delete(i):n.add(i);return n})} style={{padding:"5px 10px",borderRadius:"6px",border:"none",background:completed.has(i)?C.successGlow:C.accent,color:completed.has(i)?C.success:C.white,fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{completed.has(i)?"✓":"Hecho"}</button>
            </div>
            <p style={{fontSize:"12px",color:C.textSec,lineHeight:1.5,margin:"6px 0 8px"}}>{ex.desc}</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{ex.criteria.map((c,j)=><span key={j} style={{padding:"2px 8px",borderRadius:"4px",background:C.accentGlow2,color:C.textMuted,fontSize:"10px"}}>✓ {c}</span>)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// PROGRESS
// ══════════════════════════════════════════════════════════
function AgentProgress({ agentId, kb }) {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [entry, setEntry] = useState({week:"",ventas:"",intentos:"",meta:""});
  const [aiTip, setAiTip] = useState(null);
  const [loadingTip, setLoadingTip] = useState(false);

  useEffect(()=>{ setData(load(`ec_progress_${agentId}`,[])); },[agentId]);
  useEffect(()=>{ save(`ec_progress_${agentId}`,data); },[data,agentId]);

  const addEntry = () => {
    if(!entry.week||!entry.ventas||!entry.intentos) return;
    setData(p=>[...p,{week:entry.week,ventas:parseInt(entry.ventas),intentos:parseInt(entry.intentos),meta:parseInt(entry.meta)||20}]);
    setEntry({week:"",ventas:"",intentos:"",meta:""}); setShowForm(false);
  };

  const getAI = async () => {
    setLoadingTip(true);
    const str = data.map(d=>`${d.week}: ${d.ventas} ventas de ${d.intentos} intentos (meta: ${d.meta})`).join("\n");
    const r = await callAI(kb.instrucciones_ia+"\nEres coach de ventas analizando datos.",`Analiza y da 3 recomendaciones específicas:\n${str}`,kb,agentId);
    setAiTip(r); setLoadingTip(false);
  };

  const totalV=data.reduce((a,b)=>a+b.ventas,0);
  const avgC=data.length?(data.reduce((a,b)=>a+(b.intentos?b.ventas/b.intentos*100:0),0)/data.length).toFixed(1):"0";
  const last=data[data.length-1]; const prev=data.length>1?data[data.length-2]:null;
  const growth=prev?(((last.ventas-prev.ventas)/prev.ventas)*100).toFixed(0):"0";
  const maxV=Math.max(...data.map(d=>Math.max(d.ventas,d.meta)),1);

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"20px",flexWrap:"wrap",gap:"10px"}}>
        <div><div style={{fontSize:"24px",fontWeight:800,color:C.white}}>Mi Progreso</div><p style={{fontSize:"13px",color:C.textSec}}>Registra números y recibe análisis IA</p></div>
        <button onClick={getAI} disabled={loadingTip||data.length===0} style={{padding:"9px 18px",borderRadius:"8px",border:"none",background:`linear-gradient(135deg,${C.admin},#7c3aed)`,color:C.white,fontSize:"12px",fontWeight:700,cursor:loadingTip?"wait":"pointer",fontFamily:"inherit"}}>{loadingTip?"Analizando...":"🤖 Análisis IA"}</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"10px",marginBottom:"20px"}}>
        {[{v:totalV,l:"Ventas",c:C.accent},{v:avgC+"%",l:"Cierre",c:parseFloat(avgC)>=20?C.success:C.warning},{v:(growth>0?"+":"")+growth+"%",l:"Crec.",c:growth>0?C.success:C.danger},{v:last?.meta||20,l:"Meta",c:C.warning}].map((s,i)=>(
          <div key={i} style={{background:C.card,borderRadius:"12px",border:`1px solid ${C.border}`,padding:"16px"}}>
            <div style={{fontSize:"26px",fontWeight:800,color:s.c}}>{s.v}</div>
            <div style={{fontSize:"10px",color:C.textMuted,textTransform:"uppercase",letterSpacing:"1px"}}>{s.l}</div>
          </div>
        ))}
      </div>

      {aiTip && <div style={{background:`linear-gradient(135deg,${C.card},rgba(168,85,247,0.06))`,borderRadius:"12px",border:`1px solid rgba(168,85,247,0.2)`,padding:"18px",marginBottom:"18px"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:C.admin,marginBottom:"8px"}}>🤖 Análisis IA</div>
        {aiTip.split("\n").map((l,i)=><div key={i} style={{fontSize:"12px",color:C.textSec,lineHeight:1.7,marginBottom:l===""?"6px":"1px"}}>{l}</div>)}
      </div>}

      {data.length>0 && <div style={{background:C.card,borderRadius:"12px",border:`1px solid ${C.border}`,padding:"18px",marginBottom:"18px"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:C.white,marginBottom:"14px"}}>Evolución</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:"8px",height:"140px"}}>
          {data.map((d,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"3px"}}>
              <div style={{fontSize:"10px",fontWeight:700,color:C.accent}}>{d.ventas}</div>
              <div style={{width:"100%",maxWidth:"40px",display:"flex",gap:"2px",alignItems:"flex-end",height:"100px"}}>
                <div style={{flex:1,height:`${(d.ventas/maxV)*100}%`,background:C.accent,borderRadius:"3px 3px 1px 1px",minHeight:"2px"}}/>
                <div style={{flex:1,height:`${(d.meta/maxV)*100}%`,background:C.border,borderRadius:"3px 3px 1px 1px",minHeight:"2px",opacity:0.4}}/>
              </div>
              <div style={{fontSize:"9px",color:C.textMuted}}>{d.week}</div>
            </div>
          ))}
        </div>
      </div>}

      <div style={{background:C.card,borderRadius:"12px",border:`1px solid ${C.border}`,padding:"18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:showForm?"12px":"0"}}>
          <div style={{fontSize:"13px",fontWeight:700,color:C.white}}>Registro</div>
          <button onClick={()=>setShowForm(!showForm)} style={{padding:"6px 14px",borderRadius:"6px",border:showForm?`1px solid ${C.border}`:"none",background:showForm?"transparent":C.accent,color:showForm?C.textSec:C.white,fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{showForm?"Cancelar":"+ Agregar"}</button>
        </div>
        {showForm && <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"12px",alignItems:"end"}}>
          {[{k:"week",l:"Semana",p:"Sem 5"},{k:"ventas",l:"Ventas",p:"0",t:"number"},{k:"intentos",l:"Intentos",p:"0",t:"number"},{k:"meta",l:"Meta",p:"20",t:"number"}].map(f=><div key={f.k} style={{flex:"1 1 100px"}}>
            <label style={{fontSize:"9px",color:C.textMuted,textTransform:"uppercase",letterSpacing:"1px",display:"block",marginBottom:"3px"}}>{f.l}</label>
            <input style={inputStyle} type={f.t||"text"} placeholder={f.p} value={entry[f.k]} onChange={e=>setEntry({...entry,[f.k]:e.target.value})}/>
          </div>)}
          <button onClick={addEntry} style={{padding:"10px 14px",borderRadius:"6px",border:"none",background:C.success,color:C.white,fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✓</button>
        </div>}
        {data.length>0 && <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 3px"}}><thead><tr>
          {["Sem","Ventas","Int","% Cierre","Meta",""].map(h=><th key={h} style={{padding:"6px 10px",textAlign:"left",fontSize:"10px",color:C.textMuted,textTransform:"uppercase",letterSpacing:"1px"}}>{h}</th>)}
        </tr></thead><tbody>{data.map((d,i)=>{const c=d.intentos?(d.ventas/d.intentos*100).toFixed(1):"0";return <tr key={i}>
          <td style={{padding:"8px 10px",background:C.surface,borderRadius:"6px 0 0 6px",fontSize:"12px",fontWeight:600,color:C.white}}>{d.week}</td>
          <td style={{padding:"8px 10px",background:C.surface,fontSize:"12px",color:C.text}}>{d.ventas}</td>
          <td style={{padding:"8px 10px",background:C.surface,fontSize:"12px",color:C.text}}>{d.intentos}</td>
          <td style={{padding:"8px 10px",background:C.surface,fontSize:"12px",color:parseFloat(c)>=20?C.success:C.warning}}>{c}%</td>
          <td style={{padding:"8px 10px",background:C.surface,fontSize:"12px",color:C.text}}>{d.meta}</td>
          <td style={{padding:"8px 10px",background:C.surface,borderRadius:"0 6px 6px 0"}}>{d.ventas>=d.meta?<Badge text="✓" color={C.success} bg={C.successGlow}/>:<Badge text={`${(d.ventas/d.meta*100).toFixed(0)}%`} color={C.warning} bg={C.warningGlow}/>}</td>
        </tr>})}</tbody></table></div>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [agents, setAgents] = useState(load("ec_agents",[]));
  const [kb, setKb] = useState(load("ec_kb",DEFAULT_KB));
  const [tab, setTab] = useState("chat");

  const allProgress = {};
  agents.forEach(a => { allProgress[a.id] = load(`ec_progress_${a.id}`,[]); });

  const isAdmin = user?.role === "admin";

  if (!user) return <LoginScreen onLogin={setUser} agents={agents}/>;

  const agentTabs = [{id:"chat",label:"💬 Asistente"},{id:"exercises",label:"🏋️ Ejercicios"},{id:"roleplay",label:"🎭 Roleplay"},{id:"progress",label:"📊 Progreso"}];

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Outfit',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.borderLight};border-radius:3px}
        input:focus,textarea:focus,select:focus{border-color:${C.accent}!important;outline:none}
      `}</style>

      {/* NAV */}
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:`1px solid ${C.border}`,background:"rgba(6,9,15,0.9)",position:"sticky",top:0,zIndex:100,flexWrap:"wrap",gap:"8px",backdropFilter:"blur(16px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <div style={{width:"32px",height:"32px",borderRadius:"8px",background:`linear-gradient(135deg,${isAdmin?C.admin:C.accent},${isAdmin?"#7c3aed":C.accentDeep})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:900,color:C.white}}>EC</div>
          <div>
            <div style={{fontSize:"14px",fontWeight:700,color:C.white}}>Sales Academy</div>
            <div style={{fontSize:"9px",color:C.textMuted,letterSpacing:"2px",textTransform:"uppercase"}}>{isAdmin?"Admin":"ExpertCell"}</div>
          </div>
        </div>
        {!isAdmin && <div style={{display:"flex",gap:"2px",background:C.surface,borderRadius:"8px",padding:"2px",flexWrap:"wrap"}}>
          {agentTabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"6px 12px",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"11px",fontWeight:tab===t.id?700:400,fontFamily:"inherit",color:tab===t.id?C.white:C.textMuted,background:tab===t.id?C.accentDark:"transparent"}}>{t.label}</button>)}
        </div>}
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <span style={{fontSize:"11px",color:C.textSec}}>{user.name}</span>
          <button onClick={()=>{setUser(null);setTab("chat")}} style={{padding:"5px 12px",borderRadius:"6px",border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,fontSize:"10px",cursor:"pointer",fontFamily:"inherit"}}>Salir</button>
        </div>
      </nav>

      <main style={{maxWidth:"1050px",margin:"0 auto",padding:"24px 16px"}}>
        {isAdmin ? <AdminPanel agents={agents} setAgents={setAgents} kb={kb} setKb={setKb} allProgress={allProgress}/> : <>
          {tab==="chat" && <AIChat kb={kb} agentName={user.name} agentId={user.id}/>}
          {tab==="exercises" && <AgentExercises/>}
          {tab==="roleplay" && <AIRoleplay kb={kb} agentName={user.name} agentId={user.id}/>}
          {tab==="progress" && <AgentProgress agentId={user.id} kb={kb}/>}
        </>}
      </main>
    </div>
  );
}
