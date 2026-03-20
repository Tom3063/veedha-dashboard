import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from "recharts";

if (typeof document !== "undefined" && !document.getElementById("vds")) {
  const s = document.createElement("style");
  s.id = "vds";
  s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');*,*::before,*::after{box-sizing:border-box;}`;
  document.head.appendChild(s);
}

const T = {
  primary:"#00987B", pDark:"#007A63", gray:"#828586", grayLt:"#C4C7C9",
  blue:"#009FE3", lime:"#BCCF00", dkGray:"#606262",
  bg:"#ECEEF2", card:"#FFFFFF", txt:"#1E2330", muted:"#9DA0A3",
};

const PRIO_C = { Alta:T.blue, Média:T.primary, Baixa:T.gray };
const PHASES = ["Preparação de Material","Roadshow","Due Diligence","Contratos","Signing","Closing"];
const PHASE_C = {
  "Preparação de Material":T.grayLt, "Roadshow":T.blue,
  "Due Diligence":T.primary, "Contratos":"#F0A500",
  "Signing":T.dkGray, "Closing":T.pDark,
};
const MOS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

// Mapeamento de originadores para filiais — substituir por chamada à API Lista de Contatos
const FILIAL = {
  "M&A":"M&A","Caio Elias Raupp":"São Paulo","Breno Reis":"Curitiba",
  "Mila Cirello":"São Paulo","João Albino":"Curitiba",
  "Alexandre Mangano":"São Paulo","Rodrigo Marcatti":"Florianópolis",
  "Raissa M. Melo":"Balneário Camboriú","Fabio Frade":"São Paulo",
};

// ─── DADOS FICTÍCIOS — substituir por chamada à API do Monday ────────────────
const PIPE = [
  {el:"Neptune",  etapa:"Conquistado",fee:11000,prio:"Alta", pr:"2026-01-08",ep:"2026-01-22",ap:"2026-02-05",orig:"M&A"},
  {el:"Faraday",  etapa:"Conquistado",fee:7428, prio:"Alta", pr:"2026-02-10",ep:"2026-02-25",ap:"2026-03-10",orig:"M&A"},
  {el:"Argos",    etapa:"Conquistado",fee:4727, prio:"Média",pr:"2025-11-10",ep:"2025-11-25",ap:"2025-12-08",orig:"Breno Reis"},
  {el:"Deméter",  etapa:"Conquistado",fee:5064, prio:"Média",pr:"2025-10-05",ep:"2025-10-20",ap:"2025-11-03",orig:"M&A"},
  {el:"Celsius",  etapa:"Conquistado",fee:450,  prio:"Baixa",pr:"2025-08-14",ep:"2025-08-28",ap:"2025-09-12",orig:"Caio Elias Raupp"},
  {el:"Boyle",    etapa:"Conquistado",fee:1350, prio:"Baixa",pr:"2025-09-03",ep:"2025-09-18",ap:"2025-10-04",orig:"M&A"},
  {el:"Tahoe",    etapa:"Conquistado",fee:1575, prio:"Baixa",pr:"2025-07-22",ep:"2025-08-06",ap:"2025-08-22",orig:"João Albino"},
  {el:"Lyra",     etapa:"Conquistado",fee:2100, prio:"Média",pr:"2026-03-04",ep:"2026-03-14",ap:"2026-03-19",orig:"M&A"},
  {el:"Solis",    etapa:"Proposta",   fee:3200, prio:"Alta", pr:"2026-02-10",ep:"2026-03-01",ap:null,orig:"M&A"},
  {el:"Delta",    etapa:"Proposta",   fee:2800, prio:"Média",pr:"2026-02-15",ep:"2026-03-05",ap:null,orig:"Caio Elias Raupp"},
  {el:"Velvet",   etapa:"Proposta",   fee:950,  prio:"Baixa",pr:"2026-01-20",ep:"2026-02-10",ap:null,orig:"Mila Cirello"},
  {el:"Arco",     etapa:"Proposta",   fee:1800, prio:"Média",pr:"2026-03-02",ep:null,         ap:null,orig:"M&A"},
  {el:"Vulcan",   etapa:"1a Reunião", fee:0,prio:null,pr:"2026-03-05",ep:null,ap:null,orig:"M&A"},
  {el:"Orion",    etapa:"1a Reunião", fee:0,prio:null,pr:"2026-03-10",ep:null,ap:null,orig:"Breno Reis"},
  {el:"Polaris",  etapa:"1a Reunião", fee:0,prio:null,pr:"2026-03-12",ep:null,ap:null,orig:"M&A"},
  {el:"Helios",   etapa:"Prop. Env.", fee:0,prio:null,pr:"2026-02-20",ep:"2026-03-08",ap:null,orig:"Caio Elias Raupp"},
  {el:"Taurus",   etapa:"Prop. Env.", fee:0,prio:null,pr:"2026-03-01",ep:"2026-03-15",ap:null,orig:"M&A"},
  {el:"Cygnus",   etapa:"Prop. Env.", fee:0,prio:null,pr:"2026-01-25",ep:"2026-03-18",ap:null,orig:"Mila Cirello"},
  {el:"Vega",     etapa:"1a Reunião", fee:0,prio:null,pr:"2026-02-14",ep:null,ap:null,orig:"Alexandre Mangano"},
  {el:"Sirius",   etapa:"Prop. Env.", fee:0,prio:null,pr:"2026-01-18",ep:"2026-02-05",ap:null,orig:"Rodrigo Marcatti"},
  {el:"Atlas",    etapa:"1a Reunião", fee:0,prio:null,pr:"2026-02-28",ep:null,ap:null,orig:"M&A"},
  {el:"Capella",  etapa:"1a Reunião", fee:0,prio:null,pr:"2026-01-15",ep:null,ap:null,orig:"M&A"},
];

// Board: Controle Financeiro — substituir por chamada à API do Monday
const FIN_2025 = 361.6;
const FIN_MOS_2026 = [26.4,26.4,19.7,19.7,15.8,6.8,0,0,0,0,0,0];
// ─────────────────────────────────────────────────────────────────────────────

const mmy = (d,m,y) => { if(!d) return false; const dt=new Date(d); return dt.getFullYear()===y&&dt.getMonth()+1===m; };
const my  = (d,y)   => { if(!d) return false; return new Date(d).getFullYear()===y; };
const fBRL = n => n.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
const fAxis = n => n>=1 ? n.toLocaleString("pt-BR",{maximumFractionDigits:0})+"K" : "0";

const Card = ({children,style={}}) => (
  <div style={{background:T.card,borderRadius:14,padding:"18px 22px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",...style}}>
    {children}
  </div>
);

const STitle = ({children,extra}) => (
  <div style={{fontSize:10,fontWeight:700,color:T.primary,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14,paddingLeft:9,borderLeft:`3px solid ${T.primary}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
    <span>{children}</span>
    {extra||null}
  </div>
);

const Lgd = ({items}) => (
  <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginTop:10}}>
    {items.map(({c,l})=>(
      <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:10}}>
        <div style={{width:10,height:8,borderRadius:2,background:c}}/>
        <span style={{color:T.muted,fontWeight:500}}>{l}</span>
      </div>
    ))}
  </div>
);

function Donut({value,max,color,editing,id,onChange}){
  const R=27,sz=60,cx=30,cy=30,circ=2*Math.PI*R,off=circ*(1-Math.min(value/Math.max(max,1),1));
  return (
    <div style={{flexShrink:0,width:60,height:60,position:"relative"}}>
      <svg width={60} height={60} viewBox="0 0 60 60" style={{transform:"rotate(-90deg)"}}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#E5EAF0" strokeWidth={6}/>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{transition:"stroke-dashoffset .4s ease"}}/>
      </svg>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",lineHeight:1.1}}>
        {editing
          ? <input type="number" value={max} onChange={e=>onChange(id,+e.target.value)}
              style={{width:32,textAlign:"center",fontFamily:"Montserrat",fontSize:8,fontWeight:700,border:`1.5px solid ${color}`,borderRadius:3,color:color,padding:"1px 0",background:"white"}}/>
          : <span style={{fontSize:8,fontWeight:700,color:T.txt}}>
              {value}<span style={{color:T.muted,fontWeight:500}}>/{max}</span>
            </span>
        }
      </div>
    </div>
  );
}

const VeedhaLogo = () => (
  <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
    <div style={{color:"#fff",fontWeight:800,fontSize:20,letterSpacing:"0.02em",lineHeight:1.1}}>veedha</div>
    <div style={{color:"rgba(255,255,255,0.7)",fontSize:8,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",marginTop:2}}>M&A · Pipeline Dashboard</div>
  </div>
);

function EditLabelPanel({items,labels,setLabels,onClose}){
  return (
    <div style={{background:T.bg,borderRadius:10,padding:"12px 14px",marginTop:8,border:`1px solid ${T.primary}40`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:10,fontWeight:700,color:T.txt}}>Editar Labels</span>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>setLabels({})} style={{padding:"4px 10px",borderRadius:6,fontSize:9,cursor:"pointer",border:"none",background:"#E3E6EA",color:T.dkGray,fontFamily:"Montserrat",fontWeight:600}}>↺ Reset</button>
          <button onClick={onClose} style={{padding:"4px 10px",borderRadius:6,fontSize:9,cursor:"pointer",border:"none",background:T.primary,color:"white",fontFamily:"Montserrat",fontWeight:600}}>✓ Fechar</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:8}}>
        {items.map(orig=>(
          <div key={orig}>
            <div style={{fontSize:8,color:T.muted,marginBottom:2,fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{orig}</div>
            <input value={labels[orig]!==undefined?labels[orig]:orig}
              onChange={e=>setLabels(p=>({...p,[orig]:e.target.value}))}
              style={{width:"100%",fontFamily:"Montserrat",fontSize:10,padding:"4px 6px",borderRadius:4,border:`1px solid ${T.grayLt}`,outline:"none"}}/>
          </div>
        ))}
      </div>
    </div>
  );
}

const TTS = {fontFamily:"Montserrat",fontSize:10,borderRadius:8};

export default function Dashboard(){
  const [mo,setMo]       = useState(3);
  const [yr,setYr]       = useState(2026);
  const [goals,setGoals] = useState({leads:100,prop:36,mand:10});
  const [editGoals,setEditGoals] = useState(false);
  const [phases,setPhases] = useState({
    Neptune:"Roadshow",Faraday:"Roadshow",Argos:"Preparação de Material",
    Deméter:"Due Diligence",Celsius:"Closing",Boyle:"Contratos",Tahoe:"Signing",Lyra:"Roadshow",
  });
  const [selPhase,setSelPhase] = useState(null);
  const [g3Labels,setG3Labels] = useState({});
  const [g5Labels,setG5Labels] = useState({});
  const [editG3,setEditG3]     = useState(false);
  const [editG5,setEditG5]     = useState(false);

  // ── G1: FUNIL ──────────────────────────────────────────────────────────────
  const valid = p => p.etapa !== "Em Análise";
  const leadsM = PIPE.filter(p=>valid(p)&&mmy(p.pr,mo,yr)).length;
  const propoM = PIPE.filter(p=>valid(p)&&mmy(p.ep,mo,yr)).length;
  const mandM  = PIPE.filter(p=>valid(p)&&mmy(p.ap,mo,yr)).length;
  const leadsY = PIPE.filter(p=>valid(p)&&my(p.pr,yr)).length;
  const propoY = PIPE.filter(p=>valid(p)&&my(p.ep,yr)).length;
  const mandY  = PIPE.filter(p=>valid(p)&&my(p.ap,yr)).length;

  // ── G2: LEADS ───────────────────────────────────────────────────────────────
  const leadsYr = PIPE.filter(p=>valid(p)&&my(p.pr,yr));
  const byOrig={},byFil={};
  leadsYr.forEach(p=>{
    byOrig[p.orig]=(byOrig[p.orig]||0)+1;
    const f=FILIAL[p.orig]||p.orig;
    byFil[f]=(byFil[f]||0)+1;
  });
  const topOrig = Object.entries(byOrig).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([n,v])=>({n,v}));
  const topFil  = Object.entries(byFil).sort((a,b)=>b[1]-a[1]).map(([n,v])=>({n,v}));

  // ── G3: PROPOSTAS ───────────────────────────────────────────────────────────
  const propItems = PIPE.filter(p=>p.etapa==="Proposta"&&p.fee>0);
  const totProp   = propItems.reduce((s,p)=>s+p.fee,0);
  const g3Grp     = {Alta:[],Média:[],Baixa:[]};
  propItems.forEach(p=>g3Grp[p.prio]?.push(p));
  const g3Data = [];
  ["Alta","Média","Baixa"].forEach(pr=>{
    g3Grp[pr].sort((a,b)=>b.fee-a.fee).forEach(p=>g3Data.push({origName:p.el,name:g3Labels[p.el]||p.el,v:+(p.fee/1000),prio:pr}));
  });
  g3Data.push({origName:"Total",name:"Total",v:+(totProp/1000),prio:"__total__"});
  const g3Sum = ["Alta","Média","Baixa"].map(pr=>{
    const tot=g3Grp[pr].reduce((s,p)=>s+p.fee,0);
    return{pr,tot,pct:totProp>0?((tot/totProp)*100).toFixed(1):"0"};
  });
  const g3Orig = propItems.map(p=>p.el);

  // ── G4: RECEITA ─────────────────────────────────────────────────────────────
  const finMos = yr===2026 ? FIN_MOS_2026 : new Array(12).fill(0);
  const g4Data = [
    {name:`Total ${yr-1}`,v:yr===2026?FIN_2025:0,tipo:"anterior"},
    ...MOS.map((mn,i)=>({name:`${mn.toLowerCase()}-${String(yr).slice(2)}`,v:finMos[i],tipo:i+1<=mo?"faturada":"contratada"})),
    {name:"Total Acum.",v:+finMos.reduce((s,v)=>s+v,0).toFixed(1),tipo:"totalAno"},
  ];
  const barC = t => t==="anterior"?T.gray:t==="faturada"?T.primary:T.blue;

  // ── G5: POTENCIAL ───────────────────────────────────────────────────────────
  const conqs    = PIPE.filter(p=>p.etapa==="Conquistado");
  const totConqs = conqs.reduce((s,p)=>s+p.fee,0);
  const g5Data   = [
    ...conqs.sort((a,b)=>a.fee-b.fee).map(p=>({origName:p.el,name:g5Labels[p.el]||p.el,v:+(p.fee/1000),fase:phases[p.el]||"Roadshow"})),
    {origName:"Receita Potencial",name:"Rec. Potencial",v:+(totConqs/1000),fase:"__total__"},
  ];
  const g5Orig = conqs.map(p=>p.el);

  const funil = [
    {label:"Leads Novos",       val:leadsM,bg:T.grayLt,color:T.grayLt,real:leadsY,id:"leads",goal:goals.leads},
    {label:"Propostas Enviadas",val:propoM, bg:T.gray,  color:T.gray,  real:propoY,id:"prop", goal:goals.prop},
    {label:"Mandatos Assinados",val:mandM,  bg:T.primary,color:T.primary,real:mandY,id:"mand",goal:goals.mand},
  ];

  const EditBtn = (active,onClick) => (
    <button onClick={onClick} style={{background:"none",border:`1px solid ${T.primary}`,borderRadius:5,fontSize:9,color:T.primary,padding:"2px 8px",cursor:"pointer",fontFamily:"Montserrat",fontWeight:600}}>
      {active?"✓ Fechar":"✎ Labels"}
    </button>
  );

  const SEL = {fontFamily:"Montserrat",fontSize:11,fontWeight:600,padding:"6px 10px",borderRadius:7,border:"1px solid rgba(255,255,255,0.35)",background:"#007A63",color:"white",outline:"none",appearance:"none",WebkitAppearance:"none",cursor:"pointer",paddingRight:24};

  return (
    <div style={{fontFamily:"Montserrat,sans-serif",background:T.bg,minHeight:"100vh"}}>

      {/* HEADER */}
      <div style={{background:"#00987B",padding:"11px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 3px 20px rgba(0,0,0,0.18)",position:"sticky",top:0,zIndex:99}}>
        <VeedhaLogo/>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:"rgba(255,255,255,0.7)",fontSize:10,fontWeight:600}}>Período</span>
          <div style={{position:"relative",display:"inline-block"}}>
            <select value={mo} onChange={e=>setMo(+e.target.value)} style={SEL}>
              {MOS.map((m,i)=><option key={m} value={i+1} style={{background:"#007A63",color:"white"}}>{m}</option>)}
            </select>
            <span style={{position:"absolute",right:7,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"white",fontSize:9}}>▾</span>
          </div>
          <div style={{position:"relative",display:"inline-block"}}>
            <select value={yr} onChange={e=>setYr(+e.target.value)} style={SEL}>
              {[2024,2025,2026].map(y=><option key={y} value={y} style={{background:"#007A63",color:"white"}}>{y}</option>)}
            </select>
            <span style={{position:"absolute",right:7,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"white",fontSize:9}}>▾</span>
          </div>
          <button style={{background:T.lime,color:"#1E2330",border:"none",borderRadius:7,padding:"7px 16px",fontFamily:"Montserrat",fontSize:11,fontWeight:700,cursor:"pointer"}}>↻ Refresh</button>
        </div>
      </div>

      {/* BODY */}
      <div style={{padding:"18px 22px",display:"flex",flexDirection:"column",gap:14}}>

        {/* ROW 1 — Funil + Propostas */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1.55fr",gap:14}}>

          {/* G1 FUNIL */}
          <Card>
            <div style={{fontSize:10,fontWeight:700,color:T.primary,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14,paddingLeft:9,borderLeft:`3px solid ${T.primary}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span>{`Funil de Conversão · ${MOS[mo-1]}/${yr}`}</span>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:8,color:T.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em"}}>Meta Anual</span>
                <button onClick={()=>setEditGoals(!editGoals)} style={{background:"none",border:"none",cursor:"pointer",padding:0,color:editGoals?T.primary:T.muted,fontSize:13,lineHeight:1}}>✎</button>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {funil.map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{flex:1,marginLeft:i*13,marginRight:i*8}}>
                    <div style={{background:item.bg,borderRadius:7,padding:"13px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",minHeight:62}}>
                      <span style={{color:"#fff",fontSize:10,fontWeight:600}}>{item.label}</span>
                      <span style={{color:"#fff",fontSize:22,fontWeight:800,lineHeight:1}}>{item.val}</span>
                    </div>
                  </div>
                  <Donut value={item.real} max={item.goal} color={item.color} editing={editGoals} id={item.id} onChange={(k,v)=>setGoals(g=>({...g,[k]:v}))}/>
                </div>
              ))}
            </div>
          </Card>

          {/* G3 PROPOSTAS */}
          <Card>
            <STitle extra={EditBtn(editG3,()=>setEditG3(!editG3))}>Valor por Proposta (BRL K)</STitle>
            <div style={{display:"flex",gap:10,marginBottom:10,padding:"7px 10px",background:T.bg,borderRadius:8,flexWrap:"wrap",alignItems:"center"}}>
              {g3Sum.filter(s=>s.tot>0).map(({pr,tot,pct})=>(
                <div key={pr} style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:7,height:7,borderRadius:2,background:PRIO_C[pr]}}/>
                  <span style={{fontSize:9,fontWeight:700,color:PRIO_C[pr]}}>{pr}:</span>
                  <span style={{fontSize:9,color:T.muted}}>R${fBRL(tot/1000)}K</span>
                  <span style={{fontSize:8,color:T.muted,background:"#E5E7EB",borderRadius:10,padding:"1px 5px",fontWeight:600}}>{pct}%</span>
                </div>
              ))}
              <span style={{marginLeft:"auto",fontSize:9,fontWeight:700,color:T.txt}}>Total: R${fBRL(totProp/1000)}K</span>
            </div>
            <ResponsiveContainer width="100%" height={185}>
              <BarChart data={g3Data} margin={{top:16,right:6,left:0,bottom:44}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false}/>
                <XAxis dataKey="name" tick={{fontSize:9,fontFamily:"Montserrat",fill:T.gray}} angle={-40} textAnchor="end" interval={0} height={52}/>
                <YAxis tick={{fontSize:9,fontFamily:"Montserrat",fill:T.gray}} tickFormatter={fAxis} width={46}/>
                <Tooltip formatter={v=>[`R$ ${fBRL(v)}K`,"Fee Potencial"]} contentStyle={TTS}/>
                <Bar dataKey="v" radius={[4,4,0,0]} maxBarSize={30}>
                  <LabelList dataKey="v" position="top" formatter={v=>fBRL(v)} style={{fontSize:7,fontFamily:"Montserrat",fill:T.dkGray}}/>
                  {g3Data.map((d,i)=><Cell key={i} fill={d.prio==="__total__"?T.lime:(PRIO_C[d.prio]||T.gray)}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {editG3&&<EditLabelPanel items={g3Orig} labels={g3Labels} setLabels={setG3Labels} onClose={()=>setEditG3(false)}/>}
            <Lgd items={[{c:T.blue,l:"Alta"},{c:T.primary,l:"Média"},{c:T.gray,l:"Baixa"},{c:T.lime,l:"Total"}]}/>
          </Card>
        </div>

        {/* ROW 2 — KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <STitle>{`Top Geradores de Leads · ${yr}`}</STitle>
            {topOrig.length===0
              ? <div style={{color:T.muted,fontSize:11,textAlign:"center",padding:"20px 0",fontStyle:"italic"}}>Sem dados para o período</div>
              : <ResponsiveContainer width="100%" height={Math.max(130,topOrig.length*32)}>
                  <BarChart data={topOrig} layout="vertical" margin={{top:0,right:36,left:4,bottom:0}}>
                    <XAxis type="number" hide/>
                    <YAxis type="category" dataKey="n" tick={{fontSize:10,fontFamily:"Montserrat",fill:T.gray}} width={122}/>
                    <Tooltip formatter={v=>[v,"Leads"]} contentStyle={TTS}/>
                    <Bar dataKey="v" fill={T.primary} radius={[0,4,4,0]} maxBarSize={18}>
                      <LabelList dataKey="v" position="right" style={{fontSize:11,fontFamily:"Montserrat",fill:T.dkGray,fontWeight:700}}/>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
            }
          </Card>
          <Card>
            <STitle>{`Leads por Escritório · ${yr}`}</STitle>
            {topFil.length===0
              ? <div style={{color:T.muted,fontSize:11,textAlign:"center",padding:"20px 0",fontStyle:"italic"}}>Sem dados para o período</div>
              : <ResponsiveContainer width="100%" height={Math.max(130,topFil.length*32)}>
                  <BarChart data={topFil} layout="vertical" margin={{top:0,right:36,left:4,bottom:0}}>
                    <XAxis type="number" hide/>
                    <YAxis type="category" dataKey="n" tick={{fontSize:10,fontFamily:"Montserrat",fill:T.gray}} width={132}/>
                    <Tooltip formatter={v=>[v,"Leads"]} contentStyle={TTS}/>
                    <Bar dataKey="v" fill={T.blue} radius={[0,4,4,0]} maxBarSize={18}>
                      <LabelList dataKey="v" position="right" style={{fontSize:11,fontFamily:"Montserrat",fill:T.dkGray,fontWeight:700}}/>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
            }
          </Card>
        </div>

        {/* ROW 3 — RECEITA */}
        <Card>
          <STitle>{`Receita Faturada / Contratada (BRL K) · ${yr}`}</STitle>
          <Lgd items={[{c:T.gray,l:`Total ${yr-1}`},{c:T.primary,l:"Faturada"},{c:T.blue,l:"Contratada"},{c:T.blue,l:`Total ${yr}`}]}/>
          <ResponsiveContainer width="100%" height={215} style={{marginTop:8}}>
            <BarChart data={g4Data} margin={{top:18,right:6,left:2,bottom:4}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false}/>
              <XAxis dataKey="name" tick={{fontSize:9,fontFamily:"Montserrat",fill:T.gray}}/>
              <YAxis tick={{fontSize:9,fontFamily:"Montserrat",fill:T.gray}} tickFormatter={fAxis} width={46}/>
              <Tooltip formatter={(v,_,p)=>[`R$ ${fBRL(v)}K`,p.payload.tipo==="anterior"?`Total ${yr-1}`:p.payload.tipo==="faturada"?"Faturada":p.payload.tipo==="contratada"?"Contratada":"Total Acum."]} contentStyle={TTS}/>
              <Bar dataKey="v" radius={[4,4,0,0]} maxBarSize={34}>
                <LabelList dataKey="v" position="top" formatter={v=>v>0?fBRL(v):""} style={{fontSize:7,fontFamily:"Montserrat",fill:T.dkGray}}/>
                {g4Data.map((d,i)=><Cell key={i} fill={barC(d.tipo)}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* ROW 4 — POTENCIAL */}
        <Card>
          <STitle extra={EditBtn(editG5,()=>setEditG5(!editG5))}>Receita Potencial por Mandato (BRL K) · Conquistados</STitle>
          <div style={{fontSize:10,color:T.muted,marginBottom:8}}>💡 Clique numa barra para definir a fase do mandato</div>
          <ResponsiveContainer width="100%" height={235}>
            <BarChart data={g5Data} margin={{top:18,right:6,left:2,bottom:44}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false}/>
              <XAxis dataKey="name" tick={{fontSize:9,fontFamily:"Montserrat",fill:T.gray}} angle={-35} textAnchor="end" interval={0} height={52}/>
              <YAxis tick={{fontSize:9,fontFamily:"Montserrat",fill:T.gray}} tickFormatter={fAxis} width={46}/>
              <Tooltip formatter={(v,_,p)=>[`R$ ${fBRL(v)}K`,p.payload.fase==="__total__"?"Total Potencial":p.payload.fase]} contentStyle={TTS}/>
              <Bar dataKey="v" radius={[4,4,0,0]} maxBarSize={42}
                onClick={d=>{ if(d&&d.fase!=="__total__") setSelPhase(selPhase===d.origName?null:d.origName); }}>
                <LabelList dataKey="v" position="top" formatter={v=>fBRL(v)} style={{fontSize:7,fontFamily:"Montserrat",fill:T.dkGray}}/>
                {g5Data.map((d,i)=>(
                  <Cell key={i} fill={d.fase==="__total__"?T.lime:(PHASE_C[d.fase]||T.gray)}
                    cursor={d.fase!=="__total__"?"pointer":"default"}
                    stroke={selPhase===d.origName?"#333":"none"}
                    strokeWidth={selPhase===d.origName?2:0}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {selPhase&&(
            <div style={{background:T.bg,borderRadius:10,padding:"11px 14px",marginTop:8,border:`1px solid ${T.primary}40`}}>
              <div style={{fontSize:10,fontWeight:600,color:T.txt,marginBottom:8}}>
                Fase de <span style={{color:T.primary,fontWeight:700}}>{g5Labels[selPhase]||selPhase}</span>:
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {PHASES.map(ph=>{
                  const active=phases[selPhase]===ph;
                  return <button key={ph} onClick={()=>{setPhases(p=>({...p,[selPhase]:ph}));setSelPhase(null);}}
                    style={{padding:"4px 12px",borderRadius:20,fontSize:9,fontWeight:700,cursor:"pointer",border:"none",fontFamily:"Montserrat",background:active?PHASE_C[ph]:"#E3E6EA",color:active?"#fff":T.gray,boxShadow:active?"0 1px 4px rgba(0,0,0,0.15)":"none"}}>{ph}</button>;
                })}
                <button onClick={()=>setSelPhase(null)} style={{padding:"4px 11px",borderRadius:20,fontSize:9,cursor:"pointer",border:"none",background:"#E3E6EA",color:T.gray,fontFamily:"Montserrat",fontWeight:600}}>✕</button>
              </div>
            </div>
          )}

          {editG5&&<EditLabelPanel items={g5Orig} labels={g5Labels} setLabels={setG5Labels} onClose={()=>setEditG5(false)}/>}
          <Lgd items={[...PHASES.map(ph=>({c:PHASE_C[ph],l:ph})),{c:T.lime,l:"Total Potencial"}]}/>
        </Card>

      </div>
    </div>
  );
}
