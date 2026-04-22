import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from './api.js';

// ── CONSTANTS ────────────────────────────────────────────
const STAGES = [
  { id:1, name:'1. Etap', days:4,  color:'#e74c3c', label:'Saf Protein' },
  { id:2, name:'2. Etap', days:5,  color:'#e67e22', label:'Protein + Çiğ Sebze' },
  { id:3, name:'3. Etap', days:5,  color:'#27ae60', label:'Tam Program' },
  { id:4, name:'4. Etap', days:7,  color:'#2980b9', label:'Çalma + Protein' },
];
const FOOD = {
  1:{ ok:['Tavuk (ızgara/haşlama)','Hindi eti','Kırmızı et çeşitleri','Ton balığı (Dardanel)','Taze balık','Pastırma','Sucuk','Kavurma','Köfte (unsuz, ekmeksiz)','Yumurta','Mantar','Yoğurt (her öğüne)','Yulaf ezmesi (sabah – Vitalif)'], no:['Ekmek','Pirinç / makarna','Sebze','Meyve','Peynir','Zeytin','Çay & kahve (ilk 4 gün)'] },
  2:{ ok:["Etap 1'deki her şey",'Roka, tere, nane, maydanoz','Salatalık, turp, biber','Marul, kıvırcık','Az domates','Avokado','Semizotu, kereviz','Yeşil soğan','Lahana (mor/beyaz)'], no:['Havuç','Dereotu','Ekmek/karbonhidrat'] },
  3:{ ok:["Etap 1+2'deki her şey",'Peynir (sabah)','Zeytin (sabah)','3 ceviz + 7 badem','Kabak, patlıcan, biber yemeği','Yeşil fasulye, bamya, enginar','Unsuz mercimek çorbası'], no:['Patates','Havuç','Bezelye','Kızartma'] },
  4:{ ok:['Çalma: 3 kaşık bakliyat + bulgur/pilav','Küçük meyve veya fındık lahmacun','İnce ekmek dilimi (çalma günü)','3 kuru kayısı (çalma kahvaltısı)','Saf protein günleri: Etap 1 gibi'], no:['Aşırı porsiyon','Soda/asitli içecekler'] },
};
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
const DIET_RULES = `ANA KURALLAR: Liste dışı çıkılmayacak. Aralarda hiçbir şey yenilmeyecek. Öğünler arası en az 4 saat. Asitli içecekler yasak. İlk 4 gün çay/kahve yasak. İlk 4 gün tuzsuz (Himalaya tuzu). Şekersiz yeşil çay serbest. Yatmadan 4 saat önce son öğün. Sakız çiğnenmeyecek. 25 kg başına 1 lt su.
ETAP 1 (4 gün): Saf protein – et, balık, yumurta, yoğurt, mantar.
ETAP 2 (5 gün): Etap 1 + çiğ sebzeler.
ETAP 3 (5 gün): Etap 1+2 + peynir/zeytin/ceviz/badem + pişmiş sebze.
ETAP 4 (7 gün): 4 çalma + 3 saf protein dönüşümlü.`;

// ── GLOBAL CSS (mobile-first) ─────────────────────────────
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html {
      font-size: 16px;
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      font-family: 'Nunito', sans-serif;
      background: #f8f5f0;
      overscroll-behavior: none;
      -webkit-font-smoothing: antialiased;
    }

    /* iOS safe area */
    .safe-bottom { padding-bottom: env(safe-area-inset-bottom, 16px); }
    .safe-top    { padding-top:    env(safe-area-inset-top,    0px);  }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: #c0a882; border-radius: 4px; }

    /* Animations */
    .fi { animation: fi .3s ease; }
    @keyframes fi { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

    .su { animation: su .28s ease; }
    @keyframes su { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

    .pl { animation: pl 1.6s infinite; }
    @keyframes pl { 0%,100%{ opacity:1 } 50%{ opacity:.35 } }

    /* Touch targets min 44px */
    button { touch-action: manipulation; }

    /* Inputs */
    input, textarea, select {
      font-family: 'Nunito', sans-serif;
      font-size: 16px !important; /* prevent iOS zoom */
      -webkit-appearance: none;
    }
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #c0a882 !important;
    }

    /* Responsive grid helpers */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; }

    @media (max-width: 360px) {
      .grid-3 { grid-template-columns: 1fr 1fr; }
      .grid-4 { grid-template-columns: 1fr 1fr; }
      .hide-xs { display: none !important; }
    }

    /* Scrollable table wrapper */
    .tbl-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 10px; }
    .tbl-wrap table { min-width: 340px; border-collapse: collapse; width: 100%; font-size: 13px; }
    .tbl-wrap th { padding: 8px 6px; background: #f8f5f0; font-weight: 800; color: #5a4a3a; text-align: center; white-space: nowrap; }
    .tbl-wrap th:first-child { text-align: left; }
    .tbl-wrap td { padding: 9px 6px; text-align: center; border-bottom: 1px solid #f5f2ee; font-weight: 600; color: #3a2e22; }
    .tbl-wrap td:first-child { text-align: left; white-space: nowrap; font-size: 12px; }
    .tbl-wrap tr:first-child td { font-weight: 800; background: #fffdf9; }
    .delta-dn { font-size: 10px; color: #27ae60; display: block; }
    .delta-up { font-size: 10px; color: #e74c3c; display: block; }

    /* Card */
    .card {
      background: #fff;
      border-radius: 16px;
      padding: 18px 16px;
      box-shadow: 0 2px 16px rgba(0,0,0,.06);
      margin-bottom: 12px;
    }

    /* Bottom nav */
    .bottom-nav {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: #fff;
      border-top: 1px solid #f0ebe3;
      display: flex;
      padding-bottom: env(safe-area-inset-bottom, 10px);
      box-shadow: 0 -2px 16px rgba(0,0,0,.06);
      z-index: 100;
    }
    .nav-btn {
      flex: 1;
      border: none;
      background: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 10px 4px;
      min-height: 56px;
    }
    .nav-btn span.icon { font-size: 22px; }
    .nav-btn span.lbl { font-size: 10px; font-family: 'Nunito', sans-serif; font-weight: 600; }

    /* Header */
    .dash-header {
      background: linear-gradient(135deg,#8b6f47,#c0a882);
      padding: 20px 16px 60px;
      padding-top: calc(20px + env(safe-area-inset-top, 0px));
    }
    .admin-header {
      background: linear-gradient(135deg,#2c1e0f,#5a3e28);
      padding: 20px 16px 28px;
      padding-top: calc(20px + env(safe-area-inset-top, 0px));
    }

    /* Page content */
    .page { padding: 0 12px; margin-top: -36px; padding-bottom: 80px; }
    .page-admin { padding: 12px; padding-bottom: 40px; }

    /* Stat chip */
    .stat-chip {
      background: rgba(255,255,255,.18);
      border-radius: 14px;
      padding: 10px 6px;
      text-align: center;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    /* Stage pills */
    .stage-btn {
      padding: 12px 8px;
      border-radius: 12px;
      cursor: pointer;
      font-family: 'Nunito', sans-serif;
      font-weight: 700;
      font-size: 13px;
      text-align: center;
      transition: all .2s;
      min-height: 72px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
    }

    /* Measure grid cards */
    .m-card {
      background: #fff;
      border-radius: 10px;
      padding: 10px 8px;
      text-align: center;
    }
    .m-card .lbl { font-size: 10px; color: #bbb; margin-bottom: 2px; }
    .m-card .val { font-weight: 800; color: #3a2e22; font-size: 14px; }
    .m-card .dl  { font-size: 10px; }

    /* Food list item */
    .food-row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px 0;
      border-bottom: 1px solid #f5f2ee;
      font-size: 14px;
      color: #3a2e22;
      line-height: 1.4;
    }
    .food-row .ic { flex-shrink: 0; margin-top: 2px; font-size: 16px; }

    /* Meal log row */
    .meal-row {
      padding: 11px 0;
      border-bottom: 1px solid #f5f2ee;
    }
    .meal-row .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 4px; }
    .meal-row .name { font-weight: 700; color: #3a2e22; font-size: 14px; flex: 1; }
    .meal-row .meta { display: flex; justify-content: space-between; }
    .meal-row .note { color: #999; font-size: 12px; }
    .meal-row .date { color: #bbb; font-size: 11px; margin-left: auto; }

    /* Toast */
    .toast {
      position: fixed;
      top: calc(20px + env(safe-area-inset-top, 0px));
      left: 50%;
      transform: translateX(-50%);
      padding: 10px 20px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 4px 20px rgba(0,0,0,.2);
      white-space: nowrap;
      animation: fi .25s ease;
    }
  `}</style>
);

// ── UI PRIMITIVES ────────────────────────────────────────
const Btn = ({ children, onClick, v='p', sz='m', disabled, full, style={}, cls='' }) => {
  const base = {
    border:'none', cursor:disabled?'not-allowed':'pointer', borderRadius:12,
    fontFamily:"'Nunito',sans-serif", fontWeight:700, transition:'all .2s',
    opacity:disabled?.5:1, width:full?'100%':'auto',
    display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
    minHeight: sz==='l'?52:sz==='s'?36:44, // touch-friendly min heights
  };
  const sizes = { s:{padding:'6px 14px',fontSize:14}, m:{padding:'10px 20px',fontSize:15}, l:{padding:'14px 24px',fontSize:16} };
  const vs = {
    p:   { background:'linear-gradient(135deg,#c0a882,#8b6f47)', color:'#fff', boxShadow:'0 4px 14px rgba(139,111,71,.3)' },
    sec: { background:'#fff', color:'#8b6f47', border:'2px solid #c0a882' },
    ok:  { background:'linear-gradient(135deg,#27ae60,#1e8449)', color:'#fff' },
    dk:  { background:'linear-gradient(135deg,#2c1e0f,#5a3e28)', color:'#fff' },
    red: { background:'linear-gradient(135deg,#e74c3c,#c0392b)', color:'#fff' },
  };
  return <button onClick={onClick} disabled={disabled} className={cls} style={{...base,...sizes[sz],...vs[v],...style}}>{children}</button>;
};

const Inp = ({ label, value, onChange, type='text', ph, style={} }) => (
  <div style={{marginBottom:13}}>
    {label && <label style={{display:'block',fontSize:13,fontWeight:700,color:'#5a4a3a',marginBottom:5}}>{label}</label>}
    <input
      type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={ph}
      inputMode={type==='number'?'decimal':undefined}
      style={{
        width:'100%', padding:'12px 14px', border:'2px solid #e8e0d4', borderRadius:10,
        fontSize:16, background:'#fdfcfa', color:'#3a2e22',
        WebkitAppearance:'none', ...style
      }}
    />
  </div>
);

const Badge = ({ text, color='#8b6f47' }) => (
  <span style={{background:color+'18',color,border:`1px solid ${color}40`,borderRadius:20,padding:'4px 12px',fontSize:12,fontWeight:700,whiteSpace:'nowrap',flexShrink:0}}>
    {text}
  </span>
);

const H3 = ({ children }) => <h3 style={{fontWeight:800,color:'#3a2e22',fontSize:16,marginBottom:14}}>{children}</h3>;

const Toast = ({ msg, ok }) => msg
  ? <div className="toast" style={{background:ok?'#27ae60':'#e74c3c',color:'#fff'}}>{msg}</div>
  : null;

function useToast() {
  const [t, setT] = useState(null);
  const show = (msg, ok=true) => { setT({msg,ok}); setTimeout(()=>setT(null), 2500); };
  return [t, show];
}

// ── AI CHAT ──────────────────────────────────────────────
function AIChat({ user, onClose }) {
  const [msgs,    setMsgs]    = useState([]);
  const [inp,     setInp]     = useState('');
  const [loading, setLoading] = useState(false);
  const bot = useRef(null);

  useEffect(()=>{
    api.getChat().then(rows => setMsgs(rows.map(r=>({role:r.role,content:r.content}))));
  },[]);
  useEffect(()=>{ bot.current?.scrollIntoView({behavior:'smooth'}); },[msgs]);

  const sys = `Sen "Diyet Asistanı" yapay zeka asistanısın. Doç. Dr. Özgür Karakoyun'un beslenme programı kapsamında yardım ediyorsun.
HASTA: ${user.name} | Etap: ${user.stage} | Kilo: ${user.weight||'?'}kg
${DIET_RULES}
Sadece bu program kapsamında cevap ver. Türkçe, kısa ve net ol. Motive et. Tıbbi tavsiye verme.`;

  const send = async () => {
    if (!inp.trim() || loading) return;
    const um = { role:'user', content:inp };
    const nm = [...msgs, um];
    setMsgs(nm); setInp(''); setLoading(true);
    api.saveChat(um);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:1000, system:sys,
          messages: nm.map(m=>({role:m.role==='ai'?'assistant':'user',content:m.content}))
        })
      });
      const data = await res.json();
      const txt = data.content?.find(b=>b.type==='text')?.text || 'Hata oluştu.';
      const am = { role:'ai', content:txt };
      setMsgs([...nm,am]);
      api.saveChat(am);
    } catch {
      setMsgs([...nm,{role:'ai',content:'Bağlantı hatası.'}]);
    }
    setLoading(false);
  };

  const quick = ['Bugün ne yiyebilirim?','Açlık hissediyorum','Su içmeyi unuttum','Etabım bitti ne yapacağım?'];

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
      <div className="su" style={{
        width:'100%', maxWidth:520,
        height:'92vh',
        background:'#fff', borderRadius:'20px 20px 0 0',
        display:'flex', flexDirection:'column', overflow:'hidden'
      }}>
        {/* Header */}
        <div style={{padding:'16px 18px',background:'linear-gradient(135deg,#8b6f47,#c0a882)',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:40,height:40,background:'rgba(255,255,255,.2)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>🤖</div>
            <div>
              <div style={{color:'#fff',fontWeight:800,fontSize:15}}>Diyet Asistanı</div>
              <div style={{color:'rgba(255,255,255,.75)',fontSize:12}}>Program kapsamında yardım eder</div>
            </div>
          </div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',width:38,height:38,borderRadius:'50%',cursor:'pointer',fontSize:20,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>×</button>
        </div>

        {/* Messages */}
        <div style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch',padding:14,display:'flex',flexDirection:'column',gap:10}}>
          {msgs.length===0 && (
            <div style={{textAlign:'center',padding:'20px 12px'}}>
              <div style={{fontSize:40,marginBottom:10}}>👋</div>
              <p style={{color:'#8b6f47',fontWeight:700,marginBottom:6,fontSize:15}}>Merhaba {user.name}!</p>
              <p style={{color:'#999',fontSize:13,marginBottom:16}}>Diyet programın hakkında soru sorabilirsin.</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center'}}>
                {quick.map(q=>(
                  <button key={q} onClick={()=>setInp(q)}
                    style={{background:'#f8f5f0',border:'1px solid #e8e0d4',borderRadius:20,padding:'8px 14px',fontSize:13,cursor:'pointer',color:'#8b6f47',fontWeight:600,fontFamily:"'Nunito',sans-serif"}}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {msgs.map((m,i)=>(
            <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
              <div style={{
                maxWidth:'85%', padding:'11px 15px',
                borderRadius: m.role==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px',
                background: m.role==='user'?'linear-gradient(135deg,#8b6f47,#c0a882)':'#f8f5f0',
                color: m.role==='user'?'#fff':'#3a2e22',
                fontSize:14, lineHeight:1.65, whiteSpace:'pre-wrap', wordBreak:'break-word'
              }}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div style={{display:'flex'}}>
              <div style={{background:'#f8f5f0',borderRadius:'18px 18px 18px 4px',padding:'12px 16px'}}>
                <span className="pl" style={{color:'#8b6f47',fontSize:13}}>Yazıyor...</span>
              </div>
            </div>
          )}
          <div ref={bot}/>
        </div>

        {/* Input */}
        <div style={{padding:'12px 14px',borderTop:'1px solid #f0ebe3',display:'flex',gap:10,alignItems:'flex-end',flexShrink:0,paddingBottom:'max(12px,env(safe-area-inset-bottom))'}}>
          <textarea
            value={inp} onChange={e=>setInp(e.target.value)}
            placeholder="Sorunuzu yazın..."
            rows={1}
            onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&(e.preventDefault(),send())}
            style={{flex:1,padding:'11px 13px',border:'2px solid #e8e0d4',borderRadius:12,resize:'none',fontFamily:"'Nunito',sans-serif",fontSize:16,minHeight:44,maxHeight:120,lineHeight:1.4}}
          />
          <button onClick={send} disabled={loading||!inp.trim()}
            style={{height:44,width:44,background:'linear-gradient(135deg,#c0a882,#8b6f47)',border:'none',borderRadius:12,color:'#fff',fontSize:18,cursor:'pointer',flexShrink:0,opacity:loading||!inp.trim()?.5:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
            ➤
          </button>
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
      await api.addMeasurement({
        kilo: kilo||undefined,
        ...Object.fromEntries(MFIELDS.map(f=>[f.key, vals[f.key]||undefined]))
      });
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
      {/* Kilo full width */}
      <Inp label="⚖️ Kilo (kg)" value={kilo} onChange={setKilo} type="number" ph="ör: 82.5" />
      {/* 2-col grid for measurements */}
      <div className="grid-2">
        {MFIELDS.map(f=>(
          <Inp key={f.key} label={f.label+' (cm)'} value={vals[f.key]||''} onChange={v=>setVals(p=>({...p,[f.key]:v}))} type="number" ph="cm"/>
        ))}
      </div>
      <Btn onClick={save} disabled={loading} full sz="l">💾 Ölçümleri Kaydet</Btn>
    </div>
  );
}

// ── MEASUREMENT HISTORY ──────────────────────────────────
function MeasureHistory({ measures }) {
  const [expanded, setExpanded] = useState(false);

  if (!measures.length) return (
    <div className="card"><p style={{color:'#999',fontSize:14,textAlign:'center'}}>Henüz ölçüm kaydı yok.</p></div>
  );

  const last = measures[0], prev = measures[1];
  const shown = expanded ? measures : measures.slice(0, 5);

  const delta = (a, b) => {
    if (!a || !b) return null;
    const d = (a - b).toFixed(1);
    return d == 0 ? null : { d, dn: d < 0 };
  };

  return (
    <div className="card">
      <H3>📊 Ölçüm Geçmişi</H3>

      {/* Delta summary */}
      {prev && (
        <div style={{background:'linear-gradient(135deg,#f0fff4,#e8f5e9)',borderRadius:14,padding:14,marginBottom:16}}>
          <p style={{fontWeight:800,color:'#27ae60',fontSize:13,marginBottom:12}}>🏆 Son Değişim</p>
          <div className="grid-3" style={{gap:8}}>
            {last.kilo&&prev.kilo&&(()=>{
              const d=(last.kilo-prev.kilo).toFixed(1);
              return (
                <div className="m-card">
                  <div className="lbl">Kilo</div>
                  <div className="val" style={{color:d<0?'#27ae60':d>0?'#e74c3c':'#999'}}>{d<0?`↓${Math.abs(d)}`:d>0?`↑${d}`:'—'} kg</div>
                </div>
              );
            })()}
            {MFIELDS.map(f=>{
              if (!last[f.key] && !prev[f.key]) return null;
              const d = ((last[f.key]||0)-(prev[f.key]||0)).toFixed(1);
              return (
                <div key={f.key} className="m-card">
                  <div className="lbl">{f.label}</div>
                  <div className="val" style={{color:d<0?'#27ae60':d>0?'#e74c3c':'#999',fontSize:13}}>{d<0?`↓${Math.abs(d)}`:d>0?`↑${d}`:'—'} cm</div>
                </div>
              );
            }).filter(Boolean)}
          </div>
        </div>
      )}

      {/* Scrollable table */}
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Kilo</th>
              {MFIELDS.map(f=><th key={f.key}>{f.label.split('-')[0].split(' ')[0]}</th>)}
            </tr>
          </thead>
          <tbody>
            {shown.map((m,i)=>{
              const p = measures[i+1];
              return (
                <tr key={m.id}>
                  <td>{new Date(m.recorded_at).toLocaleDateString('tr-TR')}</td>
                  <td>
                    {m.kilo||'—'}
                    {p?.kilo&&m.kilo&&(()=>{const d=(m.kilo-p.kilo).toFixed(1);return d!=0?<span className={d<0?'delta-dn':'delta-up'}>{d<0?`↓${Math.abs(d)}`:`↑${d}`}</span>:null})()}
                  </td>
                  {MFIELDS.map(f=>(
                    <td key={f.key}>
                      {m[f.key]||'—'}
                      {p?.[f.key]&&m[f.key]&&(()=>{const d=(m[f.key]-p[f.key]).toFixed(0);return d!=0?<span className={d<0?'delta-dn':'delta-up'}>{d<0?`↓${Math.abs(d)}`:`↑${d}`}</span>:null})()}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {measures.length > 5 && (
        <button onClick={()=>setExpanded(e=>!e)}
          style={{width:'100%',marginTop:10,padding:'10px',border:'none',background:'#f8f5f0',borderRadius:10,cursor:'pointer',color:'#8b6f47',fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:13}}>
          {expanded ? '▲ Daha az göster' : `▼ Tümünü göster (${measures.length})`}
        </button>
      )}
    </div>
  );
}

// ── PATIENT DASHBOARD ────────────────────────────────────
function PatientDash({ user: initUser, onLogout }) {
  const [tab,      setTab]     = useState('home');
  const [chat,     setChat]    = useState(false);
  const [user,     setUser]    = useState(initUser);
  const [weights,  setWeights] = useState([]);
  const [measures, setMeasures]= useState([]);
  const [meals,    setMeals]   = useState([]);
  const [meal,     setMeal]    = useState('');
  const [mNote,    setMNote]   = useState('');
  const [loading,  setLoading] = useState(false);
  const [toast,    show]       = useToast();

  const load = useCallback(async () => {
    try {
      const [p, ws, ms, ml] = await Promise.all([api.getProfile(), api.getWeights(), api.getMeasurements(), api.getMeals()]);
      setUser(p); setWeights(ws); setMeasures(ms); setMeals(ml);
    } catch {}
  }, []);

  useEffect(()=>{ load(); },[load]);

  const stage = STAGES.find(s=>s.id===user.stage)||STAGES[0];
  const iW  = weights[0]?.weight || user.weight || 0;
  const cW  = user.weight || 0;
  const lost = (iW - cW).toFixed(1);
  const wtr = Math.ceil(cW / 25) || 3;

  const saveLog = async () => {
    if (!meal) return;
    setLoading(true);
    try {
      await api.addMeal({ meal, note: mNote });
      show('✓ Kaydedildi!');
      setMeal(''); setMNote(''); load();
    } catch(e) { show(e.message, false); }
    setLoading(false);
  };

  const NAV = [
    {id:'home',    label:'Ana Sayfa', icon:'🏠'},
    {id:'food',    label:'Menü',      icon:'🥗'},
    {id:'measure', label:'Ölçüm',    icon:'📏'},
    {id:'log',     label:'Günlük',   icon:'📋'},
  ];

  return (
    <div style={{minHeight:'100vh',background:'#f8f5f0'}}>
      <G/>
      <Toast {...(toast||{msg:''})} />

      {/* Header */}
      <div className="dash-header">
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

        {/* Stats */}
        <div className="grid-3">
          {[
            {label:'Etap',      val:`${stage.id}. Etap`, sub:stage.label,      icon:'📍'},
            {label:'Kilo Kaybı',val:`${lost>0?'-':''}${lost}kg`, sub:`Başlangıç: ${iW}kg`, icon:'⚖️'},
            {label:'Su Hedefi', val:`${wtr} lt`,          sub:`${cW}kg için`,   icon:'💧'},
          ].map(s=>(
            <div key={s.label} className="stat-chip">
              <div style={{fontSize:18,marginBottom:2}}>{s.icon}</div>
              <div style={{color:'#fff',fontWeight:900,fontSize:14,lineHeight:1.2}}>{s.val}</div>
              <div style={{color:'rgba(255,255,255,.7)',fontSize:10,marginTop:2,lineHeight:1.3}}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="page">

        {/* HOME */}
        {tab==='home' && (
          <div className="fi">
            <div className="card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <H3>Etap Durumu</H3>
                <Badge text={stage.label} color={stage.color}/>
              </div>
              {STAGES.map(s=>(
                <div key={s.id} style={{marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:700,color:user.stage>=s.id?s.color:'#ccc'}}>{s.name} — {s.label}</span>
                    <span style={{fontSize:11,color:'#bbb',flexShrink:0}}>{s.days} gün</span>
                  </div>
                  <div style={{height:7,background:'#f0ebe3',borderRadius:4,overflow:'hidden'}}>
                    <div style={{height:'100%',width:user.stage>=s.id?'100%':'0%',background:s.color,borderRadius:4,transition:'width .6s'}}/>
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <H3>Ana Kurallar</H3>
              {[
                {icon:'⏰',t:'Öğünler arası en az 4 saat'},
                {icon:'🚫',t:'Asitli içecekler yasak (soda dahil)'},
                {icon:'🧂',t:'İlk 4 gün tuzsuz — Himalaya tuzu'},
                {icon:'💧',t:`Günlük ${wtr} litre saf su`},
                {icon:'🍵',t:'Şekersiz yeşil çay serbest'},
                {icon:'🌙',t:'Yatmadan 4 saat önce son öğün'},
                {icon:'🚫',t:'Sakız çiğnenmeyecek'},
              ].map(r=>(
                <div key={r.t} className="food-row">
                  <span className="ic">{r.icon}</span>
                  <span>{r.t}</span>
                </div>
              ))}
            </div>

            <button onClick={()=>setChat(true)}
              style={{width:'100%',padding:16,background:'linear-gradient(135deg,#8b6f47,#c0a882)',border:'none',borderRadius:16,color:'#fff',fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:15,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,boxShadow:'0 4px 20px rgba(139,111,71,.35)',minHeight:54}}>
              <span style={{fontSize:22}}>🤖</span> Diyet Asistanına Sor
            </button>
          </div>
        )}

        {/* FOOD */}
        {tab==='food' && (
          <div className="fi">
            <div className="card">
              <H3>✅ Bu Etapta Yiyebilecekleriniz</H3>
              {(FOOD[user.stage]?.ok||[]).map(f=>(
                <div key={f} className="food-row">
                  <span className="ic" style={{color:'#27ae60'}}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <H3>🚫 Bu Etapta Yasaklar</H3>
              {(FOOD[user.stage]?.no||[]).map(f=>(
                <div key={f} className="food-row">
                  <span className="ic" style={{color:'#e74c3c'}}>✗</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEASURE */}
        {tab==='measure' && (
          <div className="fi">
            <MeasureForm user={user} onSaved={load}/>
            <MeasureHistory measures={measures}/>
          </div>
        )}

        {/* LOG */}
        {tab==='log' && (
          <div className="fi">
            <div className="card">
              <H3>🍽️ Öğün Kaydet</H3>
              <Inp label="Ne yediniz?" value={meal} onChange={setMeal} ph="Izgara tavuk, salata..."/>
              <Inp label="Not (isteğe bağlı)" value={mNote} onChange={setMNote} ph="Nasıl hissettiniz?"/>
              <Btn onClick={saveLog} disabled={!meal||loading} full sz="l">Öğünü Kaydet</Btn>
            </div>
            <div className="card">
              <H3>📋 Son Öğünler</H3>
              {meals.length===0
                ? <p style={{color:'#999',fontSize:14}}>Henüz kayıt yok.</p>
                : meals.slice(0,20).map(l=>(
                  <div key={l.id} className="meal-row">
                    <div className="top">
                      <span className="name">{l.meal}</span>
                      <Badge text={`${l.stage}. Etap`} color={STAGES.find(s=>s.id===l.stage)?.color||'#8b6f47'}/>
                    </div>
                    <div className="meta">
                      <span className="note">{l.note}</span>
                      <span className="date">{new Date(l.logged_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <nav className="bottom-nav safe-bottom">
        {NAV.map(n=>(
          <button key={n.id} className="nav-btn" onClick={()=>setTab(n.id)}>
            <span className="icon">{n.icon}</span>
            <span className="lbl" style={{color:tab===n.id?'#8b6f47':'#bbb',fontWeight:tab===n.id?800:500}}>{n.label}</span>
          </button>
        ))}
      </nav>

      {chat && <AIChat user={user} onClose={()=>{setChat(false);load();}}/>}
    </div>
  );
}

// ── ADMIN PATIENT MODAL ──────────────────────────────────
function PatientModal({ patient: initP, onClose, onUpdated }) {
  const [patient,  setPatient]  = useState(initP);
  const [stage,    setStage]    = useState(initP.stage||1);
  const [notes,    setNotes]    = useState(initP.notes||'');
  const [measures, setMeasures] = useState([]);
  const [saving,   setSaving]   = useState(false);
  const [toast,    show]        = useToast();

  useEffect(()=>{
    api.getPatient(initP.id).then(p=>{ setPatient(p); setNotes(p.notes||''); });
    api.getPatientMeasurements(initP.id).then(setMeasures);
  },[initP.id]);

  const saveStage = async () => {
    setSaving(true);
    try { await api.setStage(patient.id, stage); show(`✓ ${stage}. etapa güncellendi!`); onUpdated(); }
    catch(e) { show(e.message, false); }
    setSaving(false);
  };

  const saveNotes = async () => {
    try { await api.setNotes(patient.id, notes); show('✓ Not kaydedildi!'); }
    catch(e) { show(e.message, false); }
  };

  const iW  = patient.initWeight || patient.weight || 0;
  const cW  = patient.weight || 0;

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
      <Toast {...(toast||{msg:''})} />
      <div className="su" style={{background:'#fff',borderRadius:'20px 20px 0 0',width:'100%',maxWidth:540,maxHeight:'94vh',overflowY:'auto',WebkitOverflowScrolling:'touch'}}>
        {/* Sticky header */}
        <div style={{position:'sticky',top:0,background:'linear-gradient(135deg,#2c1e0f,#5a3e28)',padding:'18px 16px',borderRadius:'20px 20px 0 0',display:'flex',justifyContent:'space-between',alignItems:'center',zIndex:10}}>
          <div>
            <h3 style={{color:'#fff',fontWeight:800,fontSize:17}}>{patient.name}</h3>
            <p style={{color:'rgba(255,255,255,.6)',fontSize:12}}>{patient.email}</p>
          </div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,.15)',border:'none',color:'#fff',width:38,height:38,borderRadius:'50%',cursor:'pointer',fontSize:20,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>×</button>
        </div>

        <div style={{padding:'16px 14px',paddingBottom:'max(24px,env(safe-area-inset-bottom))'}}>
          {/* Stats */}
          <div className="grid-4" style={{marginBottom:16}}>
            {[
              {label:'Kilo',  val:`${cW||'?'}kg`},
              {label:'Kayıp', val:`${(iW-cW).toFixed(1)}kg`},
              {label:'Öğün',  val:patient.mealCount||0},
              {label:'Ölçüm',val:patient.measureCount||measures.length},
            ].map(s=>(
              <div key={s.label} style={{background:'#f8f5f0',borderRadius:12,padding:'11px 6px',textAlign:'center'}}>
                <div style={{fontWeight:900,color:'#3a2e22',fontSize:16}}>{s.val}</div>
                <div style={{color:'#999',fontSize:11}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Stage control */}
          <div className="card">
            <H3>⚙️ Etap Yönetimi</H3>
            <div className="grid-2" style={{marginBottom:14}}>
              {STAGES.map(s=>(
                <button key={s.id} className="stage-btn" onClick={()=>setStage(s.id)}
                  style={{border:`2px solid ${stage===s.id?s.color:'#e8e0d4'}`,background:stage===s.id?s.color+'18':'#fff',color:stage===s.id?s.color:'#aaa'}}>
                  <span style={{fontSize:17}}>{s.name}</span>
                  <span style={{fontSize:12,fontWeight:500}}>{s.label}</span>
                  <span style={{fontSize:11,color:stage===s.id?s.color:'#ccc'}}>{s.days} gün</span>
                </button>
              ))}
            </div>
            <Btn onClick={saveStage} disabled={saving} full v="dk" sz="l">
              {saving ? 'Kaydediliyor...' : `${stage}. Etaba Ayarla`}
            </Btn>
          </div>

          {/* Notes */}
          <div className="card">
            <H3>📝 Doktor Notu</H3>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Hasta hakkında not..." rows={3}
              style={{width:'100%',padding:'11px 13px',border:'2px solid #e8e0d4',borderRadius:10,fontSize:15,resize:'vertical',marginBottom:10,fontFamily:"'Nunito',sans-serif"}}/>
            <Btn onClick={saveNotes} v="sec" sz="s">Notu Kaydet</Btn>
          </div>

          {/* Last measurements */}
          {measures.length>0 && (
            <div className="card">
              <H3>📏 Son Ölçümler</H3>
              {measures.slice(0,2).map((m,i)=>(
                <div key={m.id} style={{marginBottom:12,padding:12,background:'#f8f5f0',borderRadius:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                    <span style={{fontWeight:700,color:'#3a2e22',fontSize:14}}>{new Date(m.recorded_at).toLocaleDateString('tr-TR')}</span>
                    {m.kilo && <Badge text={`${m.kilo}kg`} color="#8b6f47"/>}
                  </div>
                  <div className="grid-3" style={{gap:6}}>
                    {MFIELDS.map(f=>{
                      if (!m[f.key]) return null;
                      const p = measures[i+1];
                      const d = p?.[f.key] ? m[f.key]-p[f.key] : null;
                      return (
                        <div key={f.key} className="m-card">
                          <div className="lbl">{f.label}</div>
                          <div className="val">{m[f.key]} cm</div>
                          {d!==null&&d!==0&&<span className={d<0?'delta-dn':'delta-up'}>{d<0?`↓${Math.abs(d).toFixed(0)}`:`↑${d.toFixed(0)}`}</span>}
                        </div>
                      );
                    }).filter(Boolean)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent meals */}
          {(patient.meals||[]).length>0 && (
            <div className="card">
              <H3>🍽️ Son Öğünler</H3>
              {(patient.meals||[]).slice(0,5).map(l=>(
                <div key={l.id} className="meal-row">
                  <div className="top">
                    <span className="name">{l.meal}</span>
                    <span style={{color:'#bbb',fontSize:11,whiteSpace:'nowrap'}}>{new Date(l.logged_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ADMIN DASHBOARD ──────────────────────────────────────
function AdminDash({ onLogout }) {
  const [tab,      setTab]     = useState('overview');
  const [search,   setSearch]  = useState('');
  const [sel,      setSel]     = useState(null);
  const [patients, setPatients]= useState([]);
  const [stats,    setStats]   = useState(null);
  const [loading,  setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([api.getPatients(), api.getStats()]);
      setPatients(p); setStats(s);
    } catch {}
    setLoading(false);
  }, []);
  useEffect(()=>{ load(); },[load]);

  const filtered = patients.filter(u=>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{minHeight:'100vh',background:'#f8f5f0'}}>
      <G/>
      <div className="admin-header">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
          <div>
            <p style={{color:'rgba(255,255,255,.55)',fontSize:12}}>Yönetim Paneli</p>
            <h2 style={{color:'#fff',fontSize:20,fontWeight:900}}>Admin Dashboard</h2>
          </div>
          <button onClick={onLogout} style={{background:'rgba(255,255,255,.15)',border:'none',color:'#fff',padding:'10px 16px',borderRadius:10,cursor:'pointer',fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:14,minHeight:44}}>Çıkış</button>
        </div>
        <div className="grid-4">
          {[
            {label:'Hasta',   val:stats?.totalPatients||0,  icon:'👥'},
            {label:'Öğün',    val:stats?.totalMeals||0,     icon:'📋'},
            {label:'Ölçüm',  val:stats?.totalMeasures||0,  icon:'📏'},
            {label:'Etap',    val:(stats?.stageStats||[]).map(s=>`${s.stage}:${s.count}`).join(' '), icon:'📊'},
          ].map(s=>(
            <div key={s.label} className="stat-chip">
              <div style={{fontSize:20,marginBottom:2}}>{s.icon}</div>
              <div style={{color:'#fff',fontWeight:900,fontSize:14}}>{s.val}</div>
              <div style={{color:'rgba(255,255,255,.55)',fontSize:10}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="page-admin">
        {/* Tabs */}
        <div style={{display:'flex',gap:8,marginBottom:14,overflowX:'auto',paddingBottom:4}}>
          {[{id:'overview',l:'📊 Genel'},{id:'patients',l:'👥 Hastalar'},{id:'measures',l:'📏 Ölçümler'}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{padding:'10px 16px',border:'none',borderRadius:10,cursor:'pointer',fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:13,background:tab===t.id?'#8b6f47':'#fff',color:tab===t.id?'#fff':'#8b6f47',boxShadow:'0 2px 8px rgba(0,0,0,.06)',flexShrink:0,minHeight:42}}>
              {t.l}
            </button>
          ))}
        </div>

        {loading && <div style={{textAlign:'center',padding:40,color:'#999'}}>Yükleniyor...</div>}

        {!loading && tab==='overview' && (
          <div className="fi">
            <div className="card">
              <H3>Etap Dağılımı</H3>
              {(stats?.stageStats||[]).map(s=>{
                const stg = STAGES.find(x=>x.id===s.stage);
                return (
                  <div key={s.stage} style={{marginBottom:14}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                      <span style={{fontSize:14,fontWeight:700,color:'#5a4a3a'}}>{stg?.name} — {stg?.label}</span>
                      <span style={{fontWeight:900,color:stg?.color,flexShrink:0}}>{s.count} hasta</span>
                    </div>
                    <div style={{height:10,background:'#f0ebe3',borderRadius:5,overflow:'hidden'}}>
                      <div style={{height:'100%',width:stats.totalPatients>0?`${(s.count/stats.totalPatients)*100}%`:'0%',background:stg?.color,borderRadius:5,transition:'width .5s'}}/>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="card">
              <H3>Son Öğün Kayıtları</H3>
              {(stats?.recentMeals||[]).slice(0,10).map(l=>(
                <div key={l.id} className="meal-row">
                  <div className="top">
                    <span style={{fontWeight:700,color:'#3a2e22',fontSize:14}}>{l.user_name}</span>
                    <span style={{color:'#bbb',fontSize:11,whiteSpace:'nowrap'}}>{new Date(l.logged_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <p style={{color:'#5a4a3a',fontSize:13}}>{l.meal}</p>
                </div>
              ))}
              {(stats?.recentMeals||[]).length===0 && <p style={{color:'#999',fontSize:14}}>Henüz log yok.</p>}
            </div>
          </div>
        )}

        {!loading && tab==='patients' && (
          <div className="fi">
            <Inp value={search} onChange={setSearch} ph="🔍 Hasta ara..." style={{marginBottom:12}}/>
            {filtered.length===0
              ? <div className="card"><p style={{color:'#999',textAlign:'center'}}>Hasta bulunamadı.</p></div>
              : filtered.map(u=>{
                const stg = STAGES.find(s=>s.id===u.stage)||STAGES[0];
                return (
                  <div key={u.id} className="card" onClick={()=>setSel(u)} style={{cursor:'pointer'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12,gap:8}}>
                      <div style={{flex:1,minWidth:0}}>
                        <h4 style={{fontWeight:800,color:'#3a2e22',fontSize:16,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{u.name}</h4>
                        <p style={{color:'#999',fontSize:12,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{u.email}</p>
                      </div>
                      <Badge text={stg.label} color={stg.color}/>
                    </div>
                    <div className="grid-4" style={{marginBottom:10}}>
                      {[{l:'Kilo',v:`${u.weight||'?'}kg`},{l:'Kayıp',v:`${u.weightLost>0?'-':''}${u.weightLost}kg`},{l:'Öğün',v:u.mealCount},{l:'Ölçüm',v:u.measureCount}].map(s=>(
                        <div key={s.l} style={{background:'#f8f5f0',borderRadius:10,padding:'9px 4px',textAlign:'center'}}>
                          <div style={{fontWeight:800,color:'#3a2e22',fontSize:13}}>{s.v}</div>
                          <div style={{color:'#bbb',fontSize:10}}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <p style={{textAlign:'right',fontSize:12,color:'#c0a882',fontWeight:700}}>Detay & Etap →</p>
                  </div>
                );
              })
            }
          </div>
        )}

        {!loading && tab==='measures' && (
          <div className="fi">
            {(stats?.recentMeasures||[]).slice(0,15).map(m=>(
              <div key={m.id} className="card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10,gap:8}}>
                  <span style={{fontWeight:800,color:'#3a2e22'}}>{m.user_name}</span>
                  <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
                    {m.kilo && <Badge text={`${m.kilo}kg`} color="#8b6f47"/>}
                    <span style={{color:'#bbb',fontSize:11}}>{new Date(m.recorded_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                <div className="grid-3" style={{gap:7}}>
                  {MFIELDS.map(f=>m[f.key]&&(
                    <div key={f.key} className="m-card">
                      <div className="lbl">{f.label}</div>
                      <div className="val">{m[f.key]} cm</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {(stats?.recentMeasures||[]).length===0 && <div className="card"><p style={{color:'#999',textAlign:'center'}}>Henüz ölçüm kaydı yok.</p></div>}
          </div>
        )}
      </div>

      {sel && <PatientModal patient={sel} onClose={()=>setSel(null)} onUpdated={()=>{load();setSel(null);}}/>}
    </div>
  );
}

// ── LOGIN ────────────────────────────────────────────────
function Login({ onLogin }) {
  const [mode,   setMode]   = useState('login');
  const [email,  setEmail]  = useState('');
  const [pass,   setPass]   = useState('');
  const [name,   setName]   = useState('');
  const [kilo,   setKilo]   = useState('');
  const [boy,    setBoy]    = useState('');
  const [err,    setErr]    = useState('');
  const [loading,setLoading]= useState(false);

  const submit = async () => {
    setLoading(true); setErr('');
    try {
      const res = mode==='login'
        ? await api.login({ email, password: pass })
        : await api.register({ name, email, password: pass, weight: kilo?+kilo:undefined, height: boy?+boy:undefined });
      localStorage.setItem('dy_token', res.token);
      onLogin(res.user);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(145deg,#2c1e0f,#5a3e28 45%,#8b6f47)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <G/>
      <div className="fi" style={{width:'100%',maxWidth:400}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{fontSize:52,marginBottom:8}}>🥗</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",color:'#fff',fontSize:28,marginBottom:4}}>Diyet Takip</h1>
          <p style={{color:'#d4b896',fontSize:13}}>Doç. Dr. Özgür Karakoyun</p>
        </div>
        <div style={{background:'#fff',borderRadius:22,padding:20,boxShadow:'0 8px 40px rgba(0,0,0,.2)'}}>
          {/* Mode switcher */}
          <div style={{display:'flex',background:'#f8f5f0',borderRadius:12,padding:4,marginBottom:18}}>
            {['login','register'].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setErr('');}}
                style={{flex:1,padding:'10px 0',border:'none',borderRadius:10,cursor:'pointer',fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:14,transition:'all .2s',background:mode===m?'#fff':'transparent',color:mode===m?'#8b6f47':'#aaa',boxShadow:mode===m?'0 2px 8px rgba(0,0,0,.08)':'none',minHeight:42}}>
                {m==='login'?'Giriş Yap':'Kayıt Ol'}
              </button>
            ))}
          </div>
          {mode==='register' && <Inp label="Ad Soyad *" value={name} onChange={setName} ph="Adınız Soyadınız"/>}
          <Inp label="E-posta *" value={email} onChange={setEmail} type="email" ph="ornek@mail.com"/>
          <Inp label="Şifre *" value={pass} onChange={setPass} type="password" ph="••••••••"/>
          {mode==='register' && (
            <div className="grid-2">
              <Inp label="Kilo (kg) *" value={kilo} onChange={setKilo} type="number" ph="75"/>
              <Inp label="Boy (cm)" value={boy} onChange={setBoy} type="number" ph="175"/>
            </div>
          )}
          {err && <p style={{color:'#e74c3c',fontSize:13,marginBottom:12,background:'#fde8e8',padding:'10px 12px',borderRadius:8,lineHeight:1.4}}>{err}</p>}
          <Btn onClick={submit} disabled={loading} full sz="l">
            {loading ? 'Lütfen bekleyin...' : mode==='login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </Btn>
          {mode==='login' && <p style={{textAlign:'center',fontSize:12,color:'#ccc',marginTop:12}}>Admin: admin@diyet.com / admin123</p>}
        </div>
      </div>
    </div>
  );
}

// ── ROOT ─────────────────────────────────────────────────
export default function App() {
  const [user,     setUser]    = useState(null);
  const [checking, setChecking]= useState(true);

  useEffect(()=>{
    const token = localStorage.getItem('dy_token');
    if (!token) { setChecking(false); return; }
    api.me()
      .then(u => { setUser(u); setChecking(false); })
      .catch(() => { localStorage.removeItem('dy_token'); setChecking(false); });
  },[]);

  const logout = () => { localStorage.removeItem('dy_token'); setUser(null); };

  if (checking) return (
    <div style={{minHeight:'100vh',background:'linear-gradient(145deg,#2c1e0f,#5a3e28)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
      <G/>
      <div style={{fontSize:48}}>🥗</div>
      <p style={{color:'#d4b896',fontFamily:"'Nunito',sans-serif",fontSize:16}}>Yükleniyor...</p>
    </div>
  );

  if (!user)               return <Login onLogin={setUser}/>;
  if (user.role==='admin') return <AdminDash onLogout={logout}/>;
  return <PatientDash user={user} onLogout={logout}/>;
}
