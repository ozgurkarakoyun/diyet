import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from './api.js';

// ── CONSTANTS ────────────────────────────────────────────
const STAGES = [
  { id:1, name:'1. Etap', days:4,  color:'#FFD700', label:'Saf Protein' },
  { id:2, name:'2. Etap', days:5,  color:'#00BFFF', label:'Protein + Çiğ Sebze' },
  { id:3, name:'3. Etap', days:5,  color:'#FFD700', label:'Tam Program' },
  { id:4, name:'4. Etap', days:7,  color:'#00BFFF', label:'Çalma + Protein' },
];

// ── FULL FOOD DATABASE ────────────────────────────────
const FOOD_DATABASE = {
  ok: [
    { etap: [1,2,3,4], item: 'Tavuk (ızgara/haşlama)' },
    { etap: [1,2,3,4], item: 'Hindi eti' },
    { etap: [1,2,3,4], item: 'Kırmızı et çeşitleri (dana, kuzu, sığır)' },
    { etap: [1,2,3,4], item: 'Ton balığı (Dardanel)' },
    { etap: [1,2,3,4], item: 'Taze balık (alabalık, çipura, çinekop)' },
    { etap: [1,2,3,4], item: 'Pastırma' },
    { etap: [1,2,3,4], item: 'Sucuk' },
    { etap: [1,2,3,4], item: 'Kavurma' },
    { etap: [1,2,3,4], item: 'Köfte (unsuz, ekmeksiz)' },
    { etap: [1,2,3,4], item: 'Yumurta (haşlanmış, çıkırıkta, omlet)' },
    { etap: [1,2,3,4], item: 'Mantar (ızgara, haşlanmış, sautéed)' },
    { etap: [1,2,3,4], item: 'Yoğurt (her öğüne, unsweetened)' },
    { etap: [1,2,3,4], item: 'Yulaf ezmesi (sabah — Vitalif)' },
    { etap: [2,3,4], item: 'Roka' },
    { etap: [2,3,4], item: 'Tere' },
    { etap: [2,3,4], item: 'Nane' },
    { etap: [2,3,4], item: 'Maydanoz' },
    { etap: [2,3,4], item: 'Salatalık' },
    { etap: [2,3,4], item: 'Turp' },
    { etap: [2,3,4], item: 'Biber (tatlı, az acı)' },
    { etap: [2,3,4], item: 'Marul (tüm çeşitleri)' },
    { etap: [2,3,4], item: 'Kıvırcık marul' },
    { etap: [2,3,4], item: 'Az domates (2-3 dilim)' },
    { etap: [2,3,4], item: 'Avokado' },
    { etap: [2,3,4], item: 'Semizotu' },
    { etap: [2,3,4], item: 'Kereviz yaprakları' },
    { etap: [2,3,4], item: 'Yeşil soğan' },
    { etap: [2,3,4], item: 'Lahana (mor, beyaz)' },
    { etap: [3,4], item: 'Peynir (sabah)' },
    { etap: [3,4], item: 'Zeytin (sabah)' },
    { etap: [3,4], item: '3 ceviz + 7 badem (sabah snack)' },
    { etap: [3,4], item: 'Kabak yemeği (pişmiş)' },
    { etap: [3,4], item: 'Patlıcan yemeği (pişmiş)' },
    { etap: [3,4], item: 'Biber yemeği (pişmiş)' },
    { etap: [3,4], item: 'Yeşil fasulye' },
    { etap: [3,4], item: 'Bamya' },
    { etap: [3,4], item: 'Enginar' },
    { etap: [3,4], item: 'Unsuz mercimek çorbası' },
    { etap: [4], item: 'Bakliyat (3 kaşık) + bulgur/pilav (çalma günü)' },
    { etap: [4], item: 'Küçük meyve (çalma günü)' },
    { etap: [4], item: 'Fındık lahmacun (çalma günü)' },
    { etap: [4], item: 'İnce ekmek dilimi (çalma günü)' },
    { etap: [4], item: '3 kuru kayısı (çalma kahvaltısı)' },
  ],
  no: [
    { etap: [1,2,3,4], item: 'Ekmek (tüm çeşitleri)' },
    { etap: [1,2,3,4], item: 'Pirinç' },
    { etap: [1,2,3,4], item: 'Makarna' },
    { etap: [1,2,3,4], item: 'Patates' },
    { etap: [1,2,3,4], item: 'Meyve' },
    { etap: [1,2,3,4], item: 'Soda (Coca-Cola, Sprite, vb.)' },
    { etap: [1,2,3,4], item: 'Asitli içecekler (limon suyu çok)' },
    { etap: [1,2,3,4], item: 'Sakız' },
    { etap: [1,2,3,4], item: 'Şeker ve tatlandırıcılar' },
    { etap: [1], item: 'Çay (ilk 4 gün)' },
    { etap: [1], item: 'Kahve (ilk 4 gün)' },
    { etap: [1], item: 'Peynir' },
    { etap: [1], item: 'Zeytin' },
    { etap: [1], item: 'Sebze (hiçbiri)' },
    { etap: [1,2], item: 'Havuç' },
    { etap: [1,2], item: 'Dereotu' },
    { etap: [3], item: 'Kızartma (yağda)' },
    { etap: [3], item: 'Bezelye' },
  ],
};

// ── SUPPLEMENTS ───────────────────────────────────────────
const SUPPLEMENTS = [
  { id: 'restore', name: 'Restore', category: 'Elektrolit' },
  { id: 'acti', name: 'Acti', category: 'Enerji' },
];

const MFIELDS = [
  {key:'boyun',    label:'Boyun'},
  {key:'ust_gogus',label:'Üst Göğüs'},
  {key:'gogus',    label:'Göğüs'},
  {key:'alt_gogus',label:'Alt Göğüs'},
  {key:'kol',      label:'Sağ-Sol Kol'},
  {key:'bel',      label:'Bel'},
  {key:'gobek',    label:'Karın-Göbek'},
  {key:'kalca',    label:'Kalça'},
  {key:'bacak',    label:'Sağ-Sol Bacak'},
];

const DIET_RULES = `ANA KURALLAR: Liste dışı çıkılmayacak. Aralarda hiçbir şey yenilmeyecek. Öğünler arası en az 4 saat.
Asitli içecekler yasak. İlk 4 gün çay/kahve yasak. İlk 4 gün tuzsuz (Himalaya tuzu).
Şekersiz yeşil çay serbest. Yatmadan 4 saat önce son öğün. Sakız çiğnenmeyecek.
25 kg başına 1 lt su. 4 ETAP DÖNGÜ + 1 SERBEST GÜN tekrar eder.`;

// ── GLOBAL CSS ─────────────────────────────────────────
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 16px; -webkit-text-size-adjust: 100%; -webkit-tap-highlight-color: transparent; }
    body { font-family: 'Nunito', sans-serif; background: #1a1a2e; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: #FFD700; border-radius: 4px; }
    .fi { animation: fi .3s ease; }
    @keyframes fi { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    .su { animation: su .28s ease; }
    @keyframes su { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    .pl { animation: pl 1.6s infinite; }
    @keyframes pl { 0%,100%{ opacity:1 } 50%{ opacity:.35 } }
    button { touch-action: manipulation; }
    input, textarea, select { font-family: 'Nunito', sans-serif; font-size: 16px !important; -webkit-appearance: none; }
    input:focus, textarea:focus, select:focus { outline: none; border-color: #FFD700 !important; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; }
    @media (max-width: 360px) {
      .grid-3 { grid-template-columns: 1fr 1fr; }
      .grid-4 { grid-template-columns: 1fr 1fr; }
    }
    .tbl-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 10px; }
    .tbl-wrap table { min-width: 340px; border-collapse: collapse; width: 100%; font-size: 13px; }
    .tbl-wrap th { padding: 8px 6px; background: #0f0f1e; font-weight: 800; color: #FFD700; text-align: center; white-space: nowrap; }
    .tbl-wrap th:first-child { text-align: left; }
    .tbl-wrap td { padding: 9px 6px; text-align: center; border-bottom: 1px solid #2a2a3e; color: #e0e0e0; }
    .tbl-wrap td:first-child { text-align: left; white-space: nowrap; font-size: 12px; }
    .tbl-wrap tr:first-child td { font-weight: 800; background: #0f0f1e; }
    .card { background: #16213e; border-radius: 16px; padding: 18px 16px; box-shadow: 0 2px 16px rgba(0,0,0,.4); margin-bottom: 12px; border: 1px solid #2a2a3e; }
    .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: #16213e; border-top: 1px solid #2a2a3e; display: flex; box-shadow: 0 -2px 16px rgba(0,0,0,.4); z-index: 100; }
    .nav-btn { flex: 1; border: none; background: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 10px 4px; min-height: 56px; }
    .nav-btn span.icon { font-size: 22px; }
    .nav-btn span.lbl { font-size: 10px; font-family: 'Nunito', sans-serif; font-weight: 600; }
    .dash-header { background: linear-gradient(135deg,#8B0000,#FFD700,#00BFFF); padding: 20px 16px 60px; }
    .admin-header { background: linear-gradient(135deg,#8B0000,#FFD700); padding: 20px 16px 28px; }
    .page { padding: 0 12px; margin-top: -36px; padding-bottom: 80px; }
    .page-admin { padding: 12px; padding-bottom: 40px; }
    .stat-chip { background: rgba(255,215,0,.1); border-radius: 14px; padding: 10px 6px; text-align: center; border: 1px solid #FFD700; }
    .toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding: 10px 20px; border-radius: 12px; font-weight: 700; font-size: 14px; z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,.4); white-space: nowrap; animation: fi .25s ease; }
  `}</style>
);

// ── UI PRIMITIVES ────────────────────────────────────────
const Btn = ({ children, onClick, v='p', sz='m', disabled, full, style={} }) => {
  const base = { border:'none', cursor:disabled?'not-allowed':'pointer', borderRadius:12, fontFamily:"'Nunito',sans-serif", fontWeight:700, transition:'all .2s', opacity:disabled?.5:1, width:full?'100%':'auto', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, minHeight: sz==='l'?52:sz==='s'?36:44 };
  const sizes = { s:{padding:'6px 14px',fontSize:14}, m:{padding:'10px 20px',fontSize:15}, l:{padding:'14px 24px',fontSize:16} };
  const vs = {
    p:   { background:'linear-gradient(135deg,#FFD700,#00BFFF)', color:'#1a1a2e', boxShadow:'0 4px 14px rgba(255,215,0,.4)' },
    sec: { background:'transparent', color:'#FFD700', border:'2px solid #FFD700' },
    ok:  { background:'linear-gradient(135deg,#00BFFF,#0088CC)', color:'#fff' },
    dk:  { background:'linear-gradient(135deg,#8B0000,#FF0000)', color:'#FFD700' },
    red: { background:'linear-gradient(135deg,#8B0000,#DC143C)', color:'#fff' },
  };
  return <button onClick={onClick} disabled={disabled} style={{...base,...sizes[sz],...vs[v],...style}}>{children}</button>;
};

const Inp = ({ label, value, onChange, type='text', ph, style={} }) => (
  <div style={{marginBottom:13}}>
    {label && <label style={{display:'block',fontSize:13,fontWeight:700,color:'#FFD700',marginBottom:5}}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={ph} inputMode={type==='number'?'decimal':undefined} style={{width:'100%', padding:'12px 14px', border:'2px solid #FFD700', borderRadius:10, fontSize:16, background:'#0f0f1e', color:'#e0e0e0', WebkitAppearance:'none', ...style}}/>
  </div>
);

const Badge = ({ text, color='#FFD700' }) => <span style={{background:color+'30',color,border:`1px solid ${color}`,borderRadius:20,padding:'4px 12px',fontSize:12,fontWeight:700,whiteSpace:'nowrap',flexShrink:0}}>{text}</span>;

const H3 = ({ children }) => <h3 style={{fontWeight:800,color:'#FFD700',fontSize:16,marginBottom:14}}>{children}</h3>;

const Toast = ({ msg, ok }) => msg ? <div className="toast" style={{background:ok?'#00BFFF':'#8B0000',color:'#fff'}}>{msg}</div> : null;

function useToast() {
  const [t, setT] = useState(null);
  const show = (msg, ok=true) => { setT({msg,ok}); setTimeout(()=>setT(null), 2500); };
  return [t, show];
}

// ── AI CHAT ──────────────────────────────────────────────
function AIChat({ user, onClose }) {
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState('');
  const [loading, setLoading] = useState(false);
  const bot = useRef(null);

  useEffect(()=>{ api.getChat().then(rows => setMsgs(rows.map(r=>({role:r.role,content:r.content})))); },[]);
  useEffect(()=>{ bot.current?.scrollIntoView({behavior:'smooth'}); },[msgs]);

  const sys = `Sen "Diyet Asistanı" yapay zeka asistanısın. Doç. Dr. Özgür Karakoyun'un beslenme programı kapsamında yardım ediyorsun.
HASTA: ${user.name} | Etap: ${user.stage} | Kilo: ${user.weight||'?'}kg
${DIET_RULES}
Sadece bu program kapsamında cevap ver. Türkçe, kısa ve net ol. Motive et.`;

  const send = async () => {
    if (!inp.trim() || loading) return;
    const um = { role:'user', content:inp };
    const nm = [...msgs, um];
    setMsgs(nm); setInp(''); setLoading(true);
    api.saveChat(um);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:1000, system:sys, messages: nm.map(m=>({role:m.role==='ai'?'assistant':'user',content:m.content})) })
      });
      const data = await res.json();
      const txt = data.content?.find(b=>b.type==='text')?.text || 'Hata oluştu.';
      const am = { role:'ai', content:txt };
      setMsgs([...nm,am]);
      api.saveChat(am);
    } catch { setMsgs([...nm,{role:'ai',content:'Bağlantı hatası.'}]); }
    setLoading(false);
  };

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
      <div className="su" style={{width:'100%', maxWidth:520, height:'92vh', background:'#16213e', borderRadius:'20px 20px 0 0', display:'flex', flexDirection:'column', overflow:'hidden', border:'2px solid #FFD700'}}>
        <div style={{padding:'16px 18px',background:'linear-gradient(135deg,#8B0000,#FFD700)',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}><div style={{width:40,height:40,background:'rgba(0,0,0,.2)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>🤖</div><div><div style={{color:'#fff',fontWeight:800,fontSize:15}}>Diyet Asistanı</div><div style={{color:'rgba(255,255,255,.75)',fontSize:12}}>Program kapsamında yardım eder</div></div></div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',width:38,height:38,borderRadius:'50%',cursor:'pointer',fontSize:20,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>×</button>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:14,display:'flex',flexDirection:'column',gap:10}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
              <div style={{maxWidth:'85%', padding:'11px 15px', borderRadius:m.role==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px', background:m.role==='user'?'linear-gradient(135deg,#FFD700,#00BFFF)':'#0f0f1e', color:m.role==='user'?'#1a1a2e':'#e0e0e0', fontSize:14, lineHeight:1.65, whiteSpace:'pre-wrap', wordBreak:'break-word', border:m.role==='user'?'none':'1px solid #FFD700'}}>{m.content}</div>
            </div>
          ))}
          {loading && <div style={{display:'flex'}}><div style={{background:'#0f0f1e',borderRadius:'18px 18px 18px 4px',padding:'12px 16px',border:'1px solid #FFD700'}}><span className="pl" style={{color:'#FFD700',fontSize:13}}>Yazıyor...</span></div></div>}
          <div ref={bot}/>
        </div>
        <div style={{padding:'12px 14px',borderTop:'1px solid #2a2a3e',display:'flex',gap:10,alignItems:'flex-end',flexShrink:0}}>
          <textarea value={inp} onChange={e=>setInp(e.target.value)} placeholder="Sorunuzu yazın..." rows={1} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&(e.preventDefault(),send())} style={{flex:1,padding:'11px 13px',border:'2px solid #FFD700',borderRadius:12,resize:'none',fontFamily:"'Nunito',sans-serif",fontSize:16,minHeight:44,maxHeight:120,lineHeight:1.4,background:'#0f0f1e',color:'#e0e0e0'}}/>
          <button onClick={send} disabled={loading||!inp.trim()} style={{height:44,width:44,background:'linear-gradient(135deg,#FFD700,#00BFFF)',border:'none',borderRadius:12,color:'#1a1a2e',fontSize:18,cursor:'pointer',flexShrink:0,opacity:loading||!inp.trim()?.5:1,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900}}>➤</button>
        </div>
      </div>
    </div>
  );
}

// ── MEASUREMENT FORM ─────────────────────────────────────
function MeasureForm({ user, onSaved }) {
  const [vals, setVals] = useState({});
  const [kilo, setKilo] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, show] = useToast();

  const save = async () => {
    setLoading(true);
    try {
      await api.addMeasurement({ kilo: kilo||undefined, ...Object.fromEntries(MFIELDS.map(f=>[f.key, vals[f.key]||undefined])) });
      show('✓ Ölçümler kaydedildi!');
      setVals({}); setKilo('');
      onSaved?.();
    } catch(e) { show(e.message, false); }
    setLoading(false);
  };

  return (
    <div className="card">
      <Toast {...(toast||{msg:''})} />
      <H3>📏 Yeni Ölçüm Gir</H3>
      <p style={{color:'#999',fontSize:13,marginBottom:14}}>Tüm ölçümler santimetre (cm) cinsindendir.</p>
      <Inp label="⚖️ Kilo (kg)" value={kilo} onChange={setKilo} type="number" ph="ör: 82.5" />
      <div className="grid-2">
        {MFIELDS.map(f=><Inp key={f.key} label={f.label+' (cm)'} value={vals[f.key]||''} onChange={v=>setVals(p=>({...p,[f.key]:v}))} type="number" ph="cm"/>)}
      </div>
      <Btn onClick={save} disabled={loading} full sz="l">💾 Ölçümleri Kaydet</Btn>
    </div>
  );
}

// ── PATIENT DASHBOARD ────────────────────────────────────
function PatientDash({ user: initUser, onLogout }) {
  const [tab, setTab] = useState('home');
  const [chat, setChat] = useState(false);
  const [user, setUser] = useState(initUser);
  const [supplements, setSupplements] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, show] = useToast();

  const load = useCallback(async () => {
    try {
      const p = await api.getProfile();
      setUser(p);
    } catch {}
  }, []);

  useEffect(()=>{ load(); },[load]);

  const stage = STAGES.find(s=>s.id===user.stage)||STAGES[0];
  const allowedFood = FOOD_DATABASE.ok.filter(f=>f.etap.includes(user.stage)).map(f=>f.item);
  const forbiddenFood = FOOD_DATABASE.no.filter(f=>f.etap.includes(user.stage)).map(f=>f.item);

  const NAV = [
    {id:'home', label:'Ana Sayfa', icon:'🏠'},
    {id:'food', label:'Menü', icon:'🥗'},
    {id:'measure', label:'Ölçüm', icon:'📏'},
    {id:'supplement', label:'Ek Gıda', icon:'💊'},
  ];

  return (
    <div style={{minHeight:'100vh',background:'#1a1a2e'}}>
      <G/>
      <Toast {...(toast||{msg:''})} />

      <div className="dash-header" style={{padding:'20px 16px 60px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
          <div>
            <p style={{color:'rgba(255,255,255,.75)',fontSize:13}}>Hoş geldin,</p>
            <h2 style={{color:'#fff',fontSize:21,fontWeight:900,lineHeight:1.2}}>{user.name}</h2>
          </div>
          <div style={{display:'flex',gap:10}}>
            <button onClick={()=>setChat(true)} style={{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',width:44,height:44,borderRadius:'50%',cursor:'pointer',fontSize:22,display:'flex',alignItems:'center',justifyContent:'center'}}>🤖</button>
            <button onClick={onLogout} style={{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',width:44,height:44,borderRadius:'50%',cursor:'pointer',fontSize:17,display:'flex',alignItems:'center',justifyContent:'center'}}>🚪</button>
          </div>
        </div>

        <div className="grid-3">
          {[{label:'Etap',val:`${stage.id}. Etap`,sub:stage.label,icon:'📍'},{label:'Etap Günü',val:'2/4',sub:`${stage.label}`,icon:'📅'},{label:'Su Hedefi',val:'3 lt',sub:`${user.weight||'?'}kg için`,icon:'💧'}].map(s=>(
            <div key={s.label} style={{background:'rgba(255,215,0,.15)',borderRadius:14,padding:'10px 6px',textAlign:'center',border:'1px solid #FFD700'}}>
              <div style={{fontSize:18,marginBottom:2}}>{s.icon}</div>
              <div style={{color:'#FFD700',fontWeight:900,fontSize:13,lineHeight:1.2}}>{s.val}</div>
              <div style={{color:'rgba(255,255,255,.7)',fontSize:9,marginTop:2,lineHeight:1.3}}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="page">

        {tab==='home' && (
          <div className="fi">
            <div className="card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}><H3>Etap Durumu</H3><Badge text={stage.label} color="#FFD700"/></div>
              {STAGES.map(s=>(
                <div key={s.id} style={{marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:700,color:user.stage>=s.id?s.color:'#666'}}>{s.name} — {s.label}</span>
                    <span style={{fontSize:11,color:'#888',flexShrink:0}}>{s.days} gün</span>
                  </div>
                  <div style={{height:7,background:'#0f0f1e',borderRadius:4,overflow:'hidden',border:'1px solid #2a2a3e'}}>
                    <div style={{height:'100%',width:user.stage>=s.id?'100%':'0%',background:s.color,borderRadius:4,transition:'width .6s'}}/>
                  </div>
                </div>
              ))}
              <div style={{marginTop:14,padding:14,background:'#0f0f1e',borderRadius:10,border:'1px solid #FFD700'}}>
                <p style={{color:'#FFD700',fontWeight:800,fontSize:12}}>ℹ️ DÖNGÜ YAPISı</p>
                <p style={{color:'#e0e0e0',fontSize:12,lineHeight:1.6,marginTop:6}}>4 Etap (21 gün) + 1 Serbest Gün = 1 Döngü. Serbest günde istediğiniz her şeyi yiyebilirsiniz!</p>
              </div>
            </div>

            <div className="card">
              <H3>Ana Kurallar</H3>
              {[{icon:'⏰',t:'Öğünler arası en az 4 saat'},{icon:'🚫',t:'Asitli içecekler yasak'},{icon:'🧂',t:'İlk 4 gün tuzsuz — Himalaya tuzu'},{icon:'💧',t:'Günlük su: Kilo/25 litre'},{icon:'🍵',t:'Şekersiz yeşil çay serbest'},{icon:'🌙',t:'Yatmadan 4 saat önce son öğün'}].map(r=>(
                <div key={r.t} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'10px 0',borderBottom:'1px solid #2a2a3e'}}>
                  <span style={{fontSize:16,flexShrink:0}}>{r.icon}</span>
                  <span style={{color:'#e0e0e0',fontSize:13,lineHeight:1.4}}>{r.t}</span>
                </div>
              ))}
            </div>

            <button onClick={()=>setChat(true)} style={{width:'100%',padding:16,background:'linear-gradient(135deg,#8B0000,#FFD700,#00BFFF)',border:'none',borderRadius:16,color:'#1a1a2e',fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:15,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,boxShadow:'0 4px 20px rgba(255,215,0,.4)',minHeight:54}}>
              <span style={{fontSize:22}}>🤖</span> Diyet Asistanına Sor
            </button>
          </div>
        )}

        {tab==='food' && (
          <div className="fi">
            <div className="card">
              <H3>✅ Bu Etapta Yiyebilecekleriniz</H3>
              {allowedFood.map(f=>(
                <div key={f} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'9px 0',borderBottom:'1px solid #2a2a3e'}}>
                  <span style={{color:'#00BFFF',fontSize:16,flexShrink:0}}>✓</span>
                  <span style={{color:'#e0e0e0',fontSize:13}}>{f}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <H3>🚫 Bu Etapta Yasaklar</H3>
              {forbiddenFood.map(f=>(
                <div key={f} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'9px 0',borderBottom:'1px solid #2a2a3e'}}>
                  <span style={{color:'#8B0000',fontSize:16,flexShrink:0}}>✗</span>
                  <span style={{color:'#e0e0e0',fontSize:13}}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='measure' && (
          <div className="fi">
            <MeasureForm user={user} onSaved={load}/>
            <div className="card">
              <H3>📊 Ölçüm Geçmişi</H3>
              <p style={{color:'#999',fontSize:13,textAlign:'center'}}>Henüz kayıt yok</p>
            </div>
          </div>
        )}

        {tab==='supplement' && (
          <div className="fi">
            <div className="card">
              <H3>💊 Ek Gıdalar & Takviyeler</H3>
              {SUPPLEMENTS.map(s=>(
                <div key={s.id} style={{padding:14,background:'#0f0f1e',borderRadius:10,marginBottom:10,border:'1px solid #FFD700'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                    <span style={{fontWeight:800,color:'#FFD700',fontSize:14}}>{s.name}</span>
                    <span style={{background:'#00BFFF30',color:'#00BFFF',border:'1px solid #00BFFF',borderRadius:12,padding:'2px 8px',fontSize:11,fontWeight:700}}>{s.category}</span>
                  </div>
                  <label style={{display:'block',color:'#e0e0e0',fontSize:12,marginBottom:4}}>Tavsiye Edilen Dozaj</label>
                  <p style={{color:'#999',fontSize:11,fontStyle:'italic',padding:8,background:'#1a1a2e',borderRadius:6}}>Admin tarafından kişiye özel dozaj belirlenecektir</p>
                </div>
              ))}
              <p style={{color:'#999',fontSize:12,textAlign:'center',padding:14}}>Admin size kişiye özel dozaj ve kullanım talimatları gönderecektir.</p>
            </div>
          </div>
        )}
      </div>

      <nav className="bottom-nav">
        {NAV.map(n=>(
          <button key={n.id} className="nav-btn" onClick={()=>setTab(n.id)} style={{background:'none'}}>
            <span className="icon">{n.icon}</span>
            <span className="lbl" style={{color:tab===n.id?'#FFD700':'#888',fontWeight:tab===n.id?800:500}}>{n.label}</span>
          </button>
        ))}
      </nav>

      {chat && <AIChat user={user} onClose={()=>{setChat(false);load();}}/>}
    </div>
  );
}

// ── LOGIN ────────────────────────────────────────────────
function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [kilo, setKilo] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setErr('');
    try {
      if (mode==='register' && adminCode !== 'enli') {
        setErr('Admin kodu hatalı!');
        setLoading(false);
        return;
      }
      const res = mode==='login'
        ? await api.login({ email, password: pass })
        : await api.register({ name, email, password: pass, weight: kilo?+kilo:undefined });
      localStorage.setItem('dy_token', res.token);
      onLogin(res.user);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(145deg,#1a0f06,#2c1a14,#001a2c)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <G/>
      <div className="fi" style={{width:'100%',maxWidth:400}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{fontSize:52,marginBottom:8}}>🥗</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",color:'#FFD700',fontSize:28,marginBottom:4}}>Diyet Takip</h1>
          <p style={{color:'#00BFFF',fontSize:13}}>Doç. Dr. Özgür Karakoyun</p>
        </div>
        <div style={{background:'#16213e',borderRadius:22,padding:20,boxShadow:'0 8px 40px rgba(0,0,0,.4)',border:'2px solid #FFD700'}}>
          <div style={{display:'flex',background:'#0f0f1e',borderRadius:12,padding:4,marginBottom:18}}>
            {['login','register'].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setErr('');}} style={{flex:1,padding:'10px 0',border:'none',borderRadius:10,cursor:'pointer',fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:14,background:mode===m?'#FFD700':'transparent',color:mode===m?'#1a1a2e':'#888',boxShadow:mode===m?'0 2px 8px rgba(0,0,0,.3)':'none',minHeight:42}}>
                {m==='login'?'Giriş Yap':'Kayıt Ol'}
              </button>
            ))}
          </div>
          {mode==='register' && <Inp label="Ad Soyad *" value={name} onChange={setName} ph="Adınız Soyadınız"/>}
          <Inp label="E-posta *" value={email} onChange={setEmail} type="email" ph="ornek@mail.com"/>
          <Inp label="Şifre *" value={pass} onChange={setPass} type="password" ph="••••••••"/>
          {mode==='register' && (
            <>
              <Inp label="Başlangıç Kilo (kg) *" value={kilo} onChange={setKilo} type="number" ph="75"/>
              <Inp label="Admin Kodu *" value={adminCode} onChange={setAdminCode} type="password" ph="Özel kod" style={{borderColor:'#00BFFF'}}/>
            </>
          )}
          {err && <p style={{color:'#8B0000',fontSize:13,marginBottom:12,background:'#8B000030',padding:'10px 12px',borderRadius:8,lineHeight:1.4}}>{err}</p>}
          <Btn onClick={submit} disabled={loading} full sz="l">
            {loading ? 'Lütfen bekleyin...' : mode==='login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </Btn>
          {mode==='login' && (
            <div style={{marginTop:16,padding:12,background:'#0f0f1e',borderRadius:10,border:'1px dashed #FFD700'}}>
              <p style={{color:'#FFD700',fontWeight:800,fontSize:12,marginBottom:4}}>📌 Admin Giriş</p>
              <p style={{color:'#e0e0e0',fontSize:11,fontFamily:'monospace'}}>E-posta: admin@diyet.com</p>
              <p style={{color:'#e0e0e0',fontSize:11,fontFamily:'monospace'}}>Şifre: admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ADMIN DASHBOARD ──────────────────────────────────────
function AdminDash({ onLogout }) {
  const [tab, setTab] = useState('patients');
  const [patients, setPatients] = useState([{id:1,name:'Fatma Y.',email:'fatma@mail.com',weight:78,stage:2}]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedSupp, setSelectedSupp] = useState('restore');
  const [suppDose, setSuppDose] = useState('');
  const [toast, show] = useToast();

  return (
    <div style={{minHeight:'100vh',background:'#1a1a2e'}}>
      <G/>
      <div className="admin-header" style={{background:'linear-gradient(135deg,#8B0000,#FFD700)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
          <div>
            <p style={{color:'rgba(255,255,255,.55)',fontSize:12}}>Yönetim Paneli</p>
            <h2 style={{color:'#fff',fontSize:20,fontWeight:900}}>Admin Dashboard</h2>
          </div>
          <button onClick={onLogout} style={{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',padding:'10px 16px',borderRadius:10,cursor:'pointer',fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:14,minHeight:44}}>Çıkış</button>
        </div>
        <div className="grid-3">
          {[{l:'Hasta',v:1,i:'👥'},{l:'Ölçüm',v:3,i:'📏'},{l:'Öğün',v:12,i:'📋'}].map(s=>(
            <div key={s.l} style={{background:'rgba(255,255,255,.15)',borderRadius:14,padding:'10px 6px',textAlign:'center',border:'1px solid rgba(255,255,255,.3)'}}>
              <div style={{fontSize:18,marginBottom:2}}>{s.i}</div>
              <div style={{color:'#fff',fontWeight:900,fontSize:13}}>{s.v}</div>
              <div style={{color:'rgba(255,255,255,.6)',fontSize:9}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="page-admin">
        <div style={{display:'flex',gap:8,marginBottom:14}}>
          {[{id:'patients',l:'👥 Hastalar'},{id:'messages',l:'📧 Mesaj'},{id:'supplements',l:'💊 Takviye'}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'10px 14px',border:'none',borderRadius:10,cursor:'pointer',fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:12,background:tab===t.id?'linear-gradient(135deg,#FFD700,#00BFFF)':'#16213e',color:tab===t.id?'#1a1a2e':'#FFD700',boxShadow:'0 2px 8px rgba(0,0,0,.3)',flexShrink:0,minHeight:40}}>
              {t.l}
            </button>
          ))}
        </div>
        <Toast {...(toast||{msg:''})} />

        {tab==='patients' && (
          <div className="fi">
            {patients.map(u=>(
              <div key={u.id} className="card" onClick={()=>setSelectedPatient(u)} style={{cursor:'pointer',border:'2px solid #FFD700'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                  <div style={{flex:1,minWidth:0}}>
                    <h4 style={{fontWeight:800,color:'#FFD700',fontSize:15}}>{u.name}</h4>
                    <p style={{color:'#888',fontSize:11}}>{u.email}</p>
                  </div>
                  <Badge text={`${u.stage}. Etap`} color="#00BFFF"/>
                </div>
                <div style={{marginTop:10,display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  <div style={{background:'#0f0f1e',borderRadius:10,padding:'8px',textAlign:'center'}}>
                    <div style={{fontWeight:900,color:'#FFD700',fontSize:13}}>{u.weight}kg</div>
                    <div style={{color:'#888',fontSize:10}}>Kilo</div>
                  </div>
                  <div style={{background:'#0f0f1e',borderRadius:10,padding:'8px',textAlign:'center'}}>
                    <div style={{fontWeight:900,color:'#00BFFF',fontSize:13}}>5 gün</div>
                    <div style={{color:'#888',fontSize:10}}>Etap Günü</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='messages' && (
          <div className="fi">
            {selectedPatient ? (
              <div className="card">
                <h3 style={{color:'#FFD700',marginBottom:14}}>📧 {selectedPatient.name} Tavsiye & Mesaj</h3>
                <label style={{display:'block',color:'#FFD700',fontSize:12,fontWeight:700,marginBottom:6}}>Tavsiye/Mesaj</label>
                <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Hastaya tavsiye yazınız..." style={{width:'100%',padding:'12px',border:'2px solid #FFD700',borderRadius:10,fontSize:14,background:'#0f0f1e',color:'#e0e0e0',minHeight:100,fontFamily:"'Nunito',sans-serif",marginBottom:12}}/>
                <button onClick={()=>{show('✓ Mesaj gönderildi!'); setMessage('');}} style={{width:'100%',padding:12,background:'linear-gradient(135deg,#FFD700,#00BFFF)',border:'none',borderRadius:10,color:'#1a1a2e',fontWeight:800,cursor:'pointer',fontFamily:"'Nunito',sans-serif"}}>
                  📤 Gönder
                </button>
              </div>
            ) : (
              <div className="card" style={{textAlign:'center',padding:28}}>
                <p style={{color:'#888',fontSize:14}}>Mesaj gönderecek hastayı seçin 👈</p>
              </div>
            )}
          </div>
        )}

        {tab==='supplements' && (
          <div className="fi">
            {selectedPatient ? (
              <div className="card">
                <h3 style={{color:'#FFD700',marginBottom:14}}>💊 {selectedPatient.name} — Ek Gıda Takviyesi</h3>
                <div style={{marginBottom:16}}>
                  <label style={{display:'block',color:'#FFD700',fontSize:12,fontWeight:700,marginBottom:8}}>Ek Gıda Seçin</label>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    {SUPPLEMENTS.map(s=>(
                      <button key={s.id} onClick={()=>setSelectedSupp(s.id)} style={{padding:12,borderRadius:10,border:`2px solid ${selectedSupp===s.id?'#00BFFF':'#2a2a3e'}`,background:'#0f0f1e',color:selectedSupp===s.id?'#00BFFF':'#e0e0e0',fontWeight:700,cursor:'pointer',fontFamily:"'Nunito',sans-serif"}}>
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
                <label style={{display:'block',color:'#FFD700',fontSize:12,fontWeight:700,marginBottom:6}}>Kişiye Özel Dozaj</label>
                <input type="text" value={suppDose} onChange={e=>setSuppDose(e.target.value)} placeholder="ör: Günde 1 sos kaşığı, sabah kahvaltı sonrası" style={{width:'100%',padding:'12px',border:'2px solid #FFD700',borderRadius:10,fontSize:14,background:'#0f0f1e',color:'#e0e0e0',marginBottom:12,fontFamily:"'Nunito',sans-serif"}}/>
                <button onClick={()=>{show('✓ Takviye tavsiyesi gönderildi!'); setSuppDose('');}} style={{width:'100%',padding:12,background:'linear-gradient(135deg,#FFD700,#00BFFF)',border:'none',borderRadius:10,color:'#1a1a2e',fontWeight:800,cursor:'pointer',fontFamily:"'Nunito',sans-serif"}}>
                  💾 Takviye Ata
                </button>
              </div>
            ) : (
              <div className="card" style={{textAlign:'center',padding:28}}>
                <p style={{color:'#888',fontSize:14}}>Takviye atayacak hastayı seçin 👈</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── ROOT ─────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(()=>{
    const token = localStorage.getItem('dy_token');
    if (!token) { setChecking(false); return; }
    api.me().then(u=>{ setUser(u); setChecking(false); }).catch(()=>{ localStorage.removeItem('dy_token'); setChecking(false); });
  },[]);

  const logout = () => { localStorage.removeItem('dy_token'); setUser(null); };

  if (checking) return (
    <div style={{minHeight:'100vh',background:'linear-gradient(145deg,#1a0f06,#2c1a14)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
      <G/>
      <div style={{fontSize:48}}>🥗</div>
      <p style={{color:'#FFD700',fontFamily:"'Nunito',sans-serif",fontSize:16}}>Yükleniyor...</p>
    </div>
  );

  if (!user) return <Login onLogin={setUser}/>;
  if (user.role==='admin') return <AdminDash onLogout={logout}/>;
  return <PatientDash user={user} onLogout={logout}/>;
}
