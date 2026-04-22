import { useState, useEffect } from 'react';
import { api } from './api.js';

const STAGES = [
  { id:1, name:'1. Etap', days:4,  color:'#06B6D4', label:'Saf Protein' },
  { id:2, name:'2. Etap', days:5,  color:'#8B5CF6', label:'Protein + Çiğ Sebze' },
  { id:3, name:'3. Etap', days:5,  color:'#10B981', label:'Tam Program' },
  { id:4, name:'4. Etap', days:7,  color:'#F59E0B', label:'Çalma + Protein' },
];

const COLORS = {
  bg: '#0F172A', card: '#1E293B', accent: '#0EA5E9', success: '#10B981',
  warn: '#F59E0B', danger: '#EF4444', text: '#F1F5F9', textMuted: '#94A3B8',
};

const FOOD_DATABASE = {
  ok: [
    { etap: [1,2,3,4], item: 'Tavuk (ızgara/haşlama)' },
    { etap: [1,2,3,4], item: 'Hindi eti' },
    { etap: [1,2,3,4], item: 'Kırmızı et çeşitleri' },
    { etap: [1,2,3,4], item: 'Ton balığı (Dardanel)' },
    { etap: [1,2,3,4], item: 'Taze balık' },
    { etap: [1,2,3,4], item: 'Pastırma' },
    { etap: [1,2,3,4], item: 'Sucuk' },
    { etap: [1,2,3,4], item: 'Kavurma' },
    { etap: [1,2,3,4], item: 'Köfte (unsuz, ekmeksiz)' },
    { etap: [1,2,3,4], item: 'Yumurta' },
    { etap: [1,2,3,4], item: 'Mantar' },
    { etap: [1,2,3,4], item: 'Yoğurt (unsweetened)' },
    { etap: [1,2,3,4], item: 'Yulaf ezmesi' },
    { etap: [2,3,4], item: 'Roka' },
    { etap: [2,3,4], item: 'Tere' },
    { etap: [2,3,4], item: 'Nane' },
    { etap: [2,3,4], item: 'Maydanoz' },
    { etap: [2,3,4], item: 'Salatalık' },
    { etap: [2,3,4], item: 'Turp' },
    { etap: [2,3,4], item: 'Biber (tatlı)' },
    { etap: [2,3,4], item: 'Marul' },
    { etap: [2,3,4], item: 'Az domates (2-3 dilim)' },
    { etap: [2,3,4], item: 'Avokado' },
    { etap: [2,3,4], item: 'Semizotu' },
    { etap: [2,3,4], item: 'Kereviz' },
    { etap: [2,3,4], item: 'Yeşil soğan' },
    { etap: [2,3,4], item: 'Lahana (mor, beyaz)' },
    { etap: [3,4], item: 'Peynir (sabah)' },
    { etap: [3,4], item: 'Zeytin (sabah)' },
    { etap: [3,4], item: '3 ceviz + 7 badem' },
    { etap: [3,4], item: 'Kabak yemeği (pişmiş)' },
    { etap: [3,4], item: 'Patlıcan yemeği' },
    { etap: [3,4], item: 'Biber yemeği' },
    { etap: [3,4], item: 'Yeşil fasulye' },
    { etap: [3,4], item: 'Bamya' },
    { etap: [3,4], item: 'Enginar' },
    { etap: [3,4], item: 'Unsuz mercimek çorbası' },
    { etap: [4], item: 'Bakliyat (3 kaşık) + bulgur/pilav (çalma)' },
    { etap: [4], item: 'Küçük meyve (çalma)' },
    { etap: [4], item: 'Fındık lahmacun (çalma)' },
    { etap: [4], item: 'İnce ekmek dilimi (çalma)' },
    { etap: [4], item: '3 kuru kayısı (çalma kahvaltısı)' },
  ],
  no: [
    { etap: [1,2,3,4], item: 'Ekmek (tüm çeşitleri)' },
    { etap: [1,2,3,4], item: 'Pirinç' },
    { etap: [1,2,3,4], item: 'Makarna' },
    { etap: [1,2,3,4], item: 'Patates' },
    { etap: [1,2,3,4], item: 'Meyve' },
    { etap: [1,2,3,4], item: 'Soda' },
    { etap: [1,2,3,4], item: 'Asitli içecekler' },
    { etap: [1,2,3,4], item: 'Sakız' },
    { etap: [1,2,3,4], item: 'Şeker' },
    { etap: [1], item: 'Çay (ilk 4 gün)' },
    { etap: [1], item: 'Kahve (ilk 4 gün)' },
    { etap: [1], item: 'Peynir' },
    { etap: [1], item: 'Zeytin' },
    { etap: [1], item: 'Sebze (hiçbiri)' },
    { etap: [1,2], item: 'Havuç' },
    { etap: [1,2], item: 'Dereotu' },
    { etap: [3], item: 'Kızartma' },
    { etap: [3], item: 'Bezelye' },
  ],
};

const SUPPLEMENTS = [
  { id: 'restore', name: 'Restore', category: 'Elektrolit' },
  { id: 'acti', name: 'Acti', category: 'Enerji' },
];

const MFIELDS = [
  {key:'boyun', label:'Boyun'},
  {key:'ust_gogus', label:'Üst Göğüs'},
  {key:'gogus', label:'Göğüs'},
  {key:'alt_gogus', label:'Alt Göğüs'},
  {key:'kol', label:'Kol'},
  {key:'bel', label:'Bel'},
  {key:'gobek', label:'Göbek'},
  {key:'kalca', label:'Kalça'},
  {key:'bacak', label:'Bacak'},
];

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 16px; -webkit-text-size-adjust: 100%; -webkit-tap-highlight-color: transparent; }
    body { font-family: 'Inter', sans-serif; background: #0F172A; color: #F1F5F9; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: #0EA5E9; border-radius: 3px; }
    .fi { animation: fi .3s ease; }
    @keyframes fi { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    input, textarea, select { font-family: 'Inter', sans-serif; font-size: 16px !important; -webkit-appearance: none; }
    input:focus, textarea:focus, select:focus { outline: none; border-color: #0EA5E9 !important; }
    .card { background: #1E293B; border-radius: 14px; padding: 18px 16px; box-shadow: 0 4px 20px rgba(0,0,0,.4); margin-bottom: 12px; border: 1px solid #334155; }
  `}</style>
);

const Btn = ({ children, onClick, variant='primary', disabled, full, style={} }) => {
  const base = { border:'none', cursor:disabled?'not-allowed':'pointer', borderRadius:10, fontFamily:"'Inter',sans-serif", fontWeight:600, transition:'all .2s', opacity:disabled?.5:1, width:full?'100%':'auto', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, minHeight:44, padding:'10px 20px' };
  const variants = {
    primary: { background:'linear-gradient(135deg,#0EA5E9,#06B6D4)', color:'#fff' },
    secondary: { background:'#334155', color:'#F1F5F9', border:'1px solid #475569' },
    danger: { background:'#EF4444', color:'#fff' },
  };
  return <button onClick={onClick} disabled={disabled} style={{...base,...variants[variant],...style}}>{children}</button>;
};

const Inp = ({ label, value, onChange, type='text', ph, style={} }) => (
  <div style={{marginBottom:16}}>
    {label && <label style={{display:'block',fontSize:13,fontWeight:600,color:COLORS.accent,marginBottom:6}}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={ph} style={{width:'100%', padding:'11px 14px', border:`1px solid #334155`, borderRadius:10, fontSize:16, background:'#1E293B', color:COLORS.text, ...style}} />
  </div>
);

const Toast = ({ msg, ok }) => msg ? <div style={{position:'fixed',top:20,left:'50%',transform:'translateX(-50%)',background:ok?'#10B981':'#EF4444',color:'#fff',padding:'12px 20px',borderRadius:10,fontWeight:600,fontSize:14,zIndex:9999}}>{msg}</div> : null;

function useToast() {
  const [t, setT] = useState(null);
  const show = (msg, ok=true) => { setT({msg,ok}); setTimeout(()=>setT(null), 3500); };
  return [t, show];
}

// ── ADMIN DASHBOARD ──────────────────────────────────────
function AdminDash({ onLogout }) {
  const [tab, setTab] = useState('patients');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedSupp, setSelectedSupp] = useState('restore');
  const [suppDose, setSuppDose] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, show] = useToast();

  useEffect(() => { loadPatients(); }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const result = await api.getPatients();
      setPatients(result || []);
    } catch(e) { show(e.message, false); }
    setLoading(false);
  };

  const loadPatientDetail = async (patientId) => {
    try {
      const data = await api.getPatient(patientId);
      setPatientData(data);
    } catch(e) { show(e.message, false); }
  };

  useEffect(() => {
    if (selectedPatient?.id) {
      loadPatientDetail(selectedPatient.id);
    }
  }, [selectedPatient]);

  const sendMessage = async () => {
    if (!message.trim()) {
      show('Mesaj yazınız', false);
      return;
    }
    if (!selectedPatient) {
      show('Hasta seçiniz', false);
      return;
    }
    try {
      show('✓ Mesaj gönderildi!');
      setMessage('');
    } catch(e) {
      show('Hata: ' + e.message, false);
    }
  };

  const sendSupplement = async () => {
    if (!suppDose.trim()) {
      show('Dozaj yazınız', false);
      return;
    }
    if (!selectedPatient) {
      show('Hasta seçiniz', false);
      return;
    }
    try {
      show('✓ Takviye gönderildi!');
      setSuppDose('');
    } catch(e) {
      show('Hata: ' + e.message, false);
    }
  };

  return (
    <div style={{minHeight:'100vh',background:COLORS.bg}}>
      <G/>
      <div style={{background:'linear-gradient(135deg,#0EA5E9,#06B6D4)',padding:'24px 18px 40px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <div>
            <p style={{color:'rgba(255,255,255,.7)',fontSize:12}}>Yönetim Paneli</p>
            <h2 style={{color:'#fff',fontSize:22,fontWeight:700}}>Admin Sistemi</h2>
          </div>
          <button onClick={onLogout} style={{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',padding:'10px 18px',borderRadius:10,cursor:'pointer',fontWeight:600,fontSize:14}}>Çıkış</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div style={{background:'rgba(255,255,255,.15)',borderRadius:10,padding:'14px',textAlign:'center'}}>
            <div style={{fontSize:18,marginBottom:4}}>👥</div>
            <div style={{fontWeight:700,fontSize:18}}>{patients.length}</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.7)'}}>Hasta</div>
          </div>
          <div style={{background:'rgba(255,255,255,.15)',borderRadius:10,padding:'14px',textAlign:'center'}}>
            <div style={{fontSize:18,marginBottom:4}}>📊</div>
            <div style={{fontWeight:700,fontSize:18}}>Aktif</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.7)'}}>Takip</div>
          </div>
        </div>
      </div>

      <div style={{padding:'16px'}}>
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          {[{id:'patients',l:'👥 Hastalar'},{id:'messages',l:'📧 Mesaj'},{id:'supplements',l:'💊 Takviye'}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'10px 16px',border:'none',borderRadius:10,cursor:'pointer',fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,background:tab===t.id?'linear-gradient(135deg,#0EA5E9,#06B6D4)':'#1E293B',color:'#fff',flex:1}}>
              {t.l}
            </button>
          ))}
        </div>

        <Toast {...(toast||{msg:''})} />

        {loading && <div style={{textAlign:'center',padding:40,color:COLORS.textMuted}}>Yükleniyor...</div>}

        {!loading && tab==='patients' && (
          <div className="fi">
            {patients.length===0 ? (
              <div className="card" style={{textAlign:'center',padding:32}}>
                <p style={{color:COLORS.textMuted}}>Henüz hasta kaydı yok</p>
              </div>
            ) : (
              patients.map(u=>(
                <div key={u.id} className="card" onClick={()=>setSelectedPatient(u)} style={{cursor:'pointer',border:`2px solid ${selectedPatient?.id===u.id?COLORS.accent:'#334155'}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                    <div>
                      <h4 style={{fontWeight:700,color:COLORS.accent,fontSize:15}}>{u.name}</h4>
                      <p style={{color:COLORS.textMuted,fontSize:11}}>{u.email}</p>
                    </div>
                    <div style={{background:STAGES.find(s=>s.id===u.stage)?.color+'30',color:STAGES.find(s=>s.id===u.stage)?.color,border:`1px solid ${STAGES.find(s=>s.id===u.stage)?.color}`,borderRadius:12,padding:'4px 10px',fontSize:11,fontWeight:600}}>
                      {u.stage}. Etap
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8}}>
                    <div style={{background:'#0F172A',borderRadius:8,padding:'10px',textAlign:'center'}}>
                      <div style={{fontWeight:700,color:COLORS.accent,fontSize:14}}>{u.weight||'?'}kg</div>
                      <div style={{color:COLORS.textMuted,fontSize:10}}>Kilo</div>
                    </div>
                    <div style={{background:'#0F172A',borderRadius:8,padding:'10px',textAlign:'center'}}>
                      <div style={{fontWeight:700,color:COLORS.success,fontSize:14}}>-{u.weightLost||0}kg</div>
                      <div style={{color:COLORS.textMuted,fontSize:10}}>Kayıp</div>
                    </div>
                    <div style={{background:'#0F172A',borderRadius:8,padding:'10px',textAlign:'center'}}>
                      <div style={{fontWeight:700,color:COLORS.warn,fontSize:14}}>{u.mealCount||0}</div>
                      <div style={{color:COLORS.textMuted,fontSize:10}}>Öğün</div>
                    </div>
                    <div style={{background:'#0F172A',borderRadius:8,padding:'10px',textAlign:'center'}}>
                      <div style={{fontWeight:700,color:'#8B5CF6',fontSize:14}}>{u.measureCount||0}</div>
                      <div style={{color:COLORS.textMuted,fontSize:10}}>Ölçüm</div>
                    </div>
                  </div>
                  {selectedPatient?.id===u.id && patientData && (
                    <div style={{marginTop:12,paddingTop:12,borderTop:'1px solid #334155'}}>
                      <p style={{color:COLORS.accent,fontWeight:700,fontSize:12,marginBottom:8}}>📊 Detaylar:</p>
                      {patientData.measurements?.length>0 && (
                        <div style={{background:'#0F172A',borderRadius:8,padding:10,marginBottom:8}}>
                          <p style={{fontSize:11,color:COLORS.textMuted,marginBottom:6}}>Son Ölçümler:</p>
                          {patientData.measurements?.slice(0,1).map((m,i)=>(
                            <div key={i} style={{fontSize:10,color:COLORS.text}}>
                              {Object.entries(m).filter(([k])=>MFIELDS.map(f=>f.key).includes(k)).map(([k,v])=>(
                                v ? `${MFIELDS.find(f=>f.key===k)?.label}: ${v}cm` : null
                              )).filter(Boolean).join(', ')}
                            </div>
                          ))}
                        </div>
                      )}
                      {patientData.meals?.length>0 && (
                        <div style={{background:'#0F172A',borderRadius:8,padding:10}}>
                          <p style={{fontSize:11,color:COLORS.textMuted,marginBottom:6}}>Son Öğünler:</p>
                          {patientData.meals?.slice(0,3).map((m,i)=>(
                            <div key={i} style={{fontSize:10,color:COLORS.text}}>{m.meal}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {tab==='messages' && (
          <div className="fi">
            {selectedPatient ? (
              <div className="card">
                <h3 style={{color:COLORS.accent,marginBottom:14}}>📧 {selectedPatient.name}</h3>
                <label style={{display:'block',color:COLORS.accent,fontSize:12,fontWeight:600,marginBottom:6}}>Mesaj</label>
                <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Hastaya tavsiye yazınız..." style={{width:'100%',padding:'12px',border:`1px solid #334155`,borderRadius:10,fontSize:14,background:'#0F172A',color:COLORS.text,minHeight:100,fontFamily:"'Inter',sans-serif",marginBottom:12}}/>
                <Btn onClick={sendMessage} disabled={loading} full>
                  📤 Gönder
                </Btn>
              </div>
            ) : (
              <div className="card" style={{textAlign:'center',padding:28}}>
                <p style={{color:COLORS.textMuted,fontSize:14}}>Mesaj gönderecek hastayı seçin</p>
              </div>
            )}
          </div>
        )}

        {tab==='supplements' && (
          <div className="fi">
            {selectedPatient ? (
              <div className="card">
                <h3 style={{color:COLORS.accent,marginBottom:14}}>💊 {selectedPatient.name}</h3>
                <label style={{display:'block',color:COLORS.accent,fontSize:12,fontWeight:600,marginBottom:8}}>Ek Gıda Seçin</label>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
                  {SUPPLEMENTS.map(s=>(
                    <button key={s.id} onClick={()=>setSelectedSupp(s.id)} style={{padding:12,borderRadius:10,border:`2px solid ${selectedSupp===s.id?COLORS.accent:'#334155'}`,background:'#1E293B',color:selectedSupp===s.id?COLORS.accent:COLORS.text,fontWeight:600,cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>
                      {s.name}
                    </button>
                  ))}
                </div>
                <Inp label="Dozaj" value={suppDose} onChange={setSuppDose} ph="Günde kaç kez, hangi miktarda"/>
                <Btn onClick={sendSupplement} disabled={loading} full>
                  💾 Takviye Gönder
                </Btn>
              </div>
            ) : (
              <div className="card" style={{textAlign:'center',padding:28}}>
                <p style={{color:COLORS.textMuted,fontSize:14}}>Takviye gönderecek hastayı seçin</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PATIENT DASHBOARD ────────────────────────────────────
function PatientDash({ user, onLogout }) {
  const [tab, setTab] = useState('home');
  const [measures, setMeasures] = useState([]);
  const [meals, setMeals] = useState([]);
  const [messages, setMessages] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [measureVals, setMeasureVals] = useState({});
  const [kilo, setKilo] = useState('');
  const [mealText, setMealText] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, show] = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [m, ml] = await Promise.all([api.getMeasurements(), api.getMeals()]);
      setMeasures(m || []);
      setMeals(ml || []);
      setMessages([]);
      setSupplements([]);
    } catch(e) { show(e.message, false); }
  };

  const saveMeasure = async () => {
    if (!kilo && !Object.values(measureVals).some(v=>v)) {
      show('En az bir değer giriniz', false);
      return;
    }
    setLoading(true);
    try {
      await api.addMeasurement({ kilo: kilo?+kilo:undefined, ...measureVals });
      show('✓ Ölçümler kaydedildi!');
      setKilo('');
      setMeasureVals({});
      loadData();
    } catch(e) { show('Hata: ' + e.message, false); }
    setLoading(false);
  };

  const saveMeal = async () => {
    if (!mealText) {
      show('Öğün açıklaması giriniz', false);
      return;
    }
    setLoading(true);
    try {
      await api.addMeal({ meal: mealText, note: '' });
      show('✓ Öğün kaydedildi!');
      setMealText('');
      loadData();
    } catch(e) { show('Hata: ' + e.message, false); }
    setLoading(false);
  };

  const stage = STAGES.find(s=>s.id===user.stage)||STAGES[0];
  const allowedFood = FOOD_DATABASE.ok.filter(f=>f.etap.includes(user.stage)).map(f=>f.item);
  const forbiddenFood = FOOD_DATABASE.no.filter(f=>f.etap.includes(user.stage)).map(f=>f.item);

  return (
    <div style={{minHeight:'100vh',background:COLORS.bg}}>
      <G/>
      <div style={{background:'linear-gradient(135deg,#0EA5E9,#06B6D4)',padding:'22px 18px 60px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <div>
            <p style={{color:'rgba(255,255,255,.7)',fontSize:12}}>Hoş geldin,</p>
            <h2 style={{color:'#fff',fontSize:20,fontWeight:700}}>{user.name}</h2>
          </div>
          <button onClick={onLogout} style={{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',width:44,height:44,borderRadius:'50%',cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>🚪</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
          {[{label:'Etap',val:`${stage.id}. Etap`,icon:'📍'},{label:'Kilo Kaybı',val:'-3.5kg',icon:'⚖️'},{label:'Su',val:'3 lt',icon:'💧'}].map(s=>(
            <div key={s.label} style={{background:'rgba(255,255,255,.15)',borderRadius:12,padding:'12px 8px',textAlign:'center',border:'1px solid rgba(255,255,255,.2)'}}>
              <div style={{fontSize:16,marginBottom:2}}>{s.icon}</div>
              <div style={{color:'#fff',fontWeight:700,fontSize:13}}>{s.val}</div>
              <div style={{color:'rgba(255,255,255,.6)',fontSize:10,marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:'14px',paddingBottom:90}}>
        <Toast {...(toast||{msg:''})} />

        {tab==='home' && (
          <div className="fi">
            <div className="card">
              <h3 style={{color:COLORS.accent,marginBottom:14}}>📋 Etap Bilgisi</h3>
              {STAGES.map(s=>(
                <div key={s.id} style={{marginBottom:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:13,fontWeight:600}}>
                    <span style={{color:user.stage>=s.id?s.color:COLORS.textMuted}}>{s.name}</span>
                    <span style={{color:COLORS.textMuted}}>{s.days} gün</span>
                  </div>
                  <div style={{height:6,background:'#334155',borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:user.stage>=s.id?'100%':'0%',background:s.color}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='food' && (
          <div className="fi">
            <div className="card">
              <h3 style={{color:COLORS.accent,marginBottom:12}}>✅ Yiyebilecekleriniz</h3>
              {allowedFood.map(f=>(
                <div key={f} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'8px 0',borderBottom:`1px solid #334155`,fontSize:13,color:COLORS.text}}>
                  <span style={{color:COLORS.success}}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <h3 style={{color:COLORS.accent,marginBottom:12}}>🚫 Yasaklar</h3>
              {forbiddenFood.map(f=>(
                <div key={f} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'8px 0',borderBottom:`1px solid #334155`,fontSize:13,color:COLORS.text}}>
                  <span style={{color:COLORS.danger}}>✗</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='measure' && (
          <div className="fi">
            <div className="card">
              <h3 style={{color:COLORS.accent,marginBottom:12}}>📏 Ölçüm Gir</h3>
              <Inp label="Kilo (kg)" value={kilo} onChange={setKilo} type="number" ph="82.5"/>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
                {MFIELDS.map(f=>(
                  <Inp key={f.key} label={f.label} value={measureVals[f.key]||''} onChange={v=>setMeasureVals(p=>({...p,[f.key]:v}))} type="number" ph="cm"/>
                ))}
              </div>
              <Btn onClick={saveMeasure} disabled={loading} full>
                💾 Ölçümleri Kaydet
              </Btn>
            </div>
            {measures.length>0 && (
              <div className="card">
                <h3 style={{color:COLORS.accent,marginBottom:12}}>📊 Son Ölçümler</h3>
                {measures.slice(0,3).map((m,i)=>(
                  <div key={m.id} style={{background:'#0F172A',borderRadius:8,padding:10,marginBottom:8}}>
                    <p style={{fontSize:11,color:COLORS.textMuted,marginBottom:4}}>{new Date(m.recorded_at).toLocaleDateString('tr-TR')}</p>
                    {m.kilo && <p style={{fontSize:12,color:COLORS.accent}}>Kilo: {m.kilo}kg</p>}
                    {Object.entries(m).filter(([k])=>MFIELDS.map(f=>f.key).includes(k) && m[k]).map(([k,v])=>(
                      <p key={k} style={{fontSize:11,color:COLORS.text}}>{MFIELDS.find(f=>f.key===k)?.label}: {v}cm</p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab==='log' && (
          <div className="fi">
            <div className="card">
              <h3 style={{color:COLORS.accent,marginBottom:12}}>🍽️ Öğün Kaydet</h3>
              <textarea value={mealText} onChange={e=>setMealText(e.target.value)} placeholder="Ne yediniz?" style={{width:'100%',padding:'12px',border:`1px solid #334155`,borderRadius:10,fontSize:14,background:'#0F172A',color:COLORS.text,minHeight:80,fontFamily:"'Inter',sans-serif",marginBottom:12}}/>
              <Btn onClick={saveMeal} disabled={loading} full>
                📤 Öğünü Kaydet
              </Btn>
            </div>
            {meals.length>0 && (
              <div className="card">
                <h3 style={{color:COLORS.accent,marginBottom:12}}>📋 Son Öğünler</h3>
                {meals.slice(0,10).map(l=>(
                  <div key={l.id} style={{background:'#0F172A',borderRadius:8,padding:10,marginBottom:8}}>
                    <p style={{fontSize:12,color:COLORS.accent,marginBottom:2}}>{l.meal}</p>
                    <p style={{fontSize:10,color:COLORS.textMuted}}>{new Date(l.logged_at).toLocaleDateString('tr-TR')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab==='messages' && (
          <div className="fi">
            <div className="card">
              <h3 style={{color:COLORS.accent,marginBottom:14}}>📧 Admin Mesajları</h3>
              {messages.length===0 ? (
                <p style={{color:COLORS.textMuted,fontSize:13,textAlign:'center',padding:20}}>Henüz mesaj yok</p>
              ) : (
                messages.map((m,i)=>(
                  <div key={i} style={{background:'#0F172A',borderRadius:8,padding:10,marginBottom:8}}>
                    <p style={{fontSize:12,color:COLORS.accent,marginBottom:4}}>Admin</p>
                    <p style={{fontSize:13,color:COLORS.text}}>{m}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab==='supplements' && (
          <div className="fi">
            <div className="card">
              <h3 style={{color:COLORS.accent,marginBottom:14}}>💊 Ek Gıda Takviyesi</h3>
              {supplements.length===0 ? (
                <p style={{color:COLORS.textMuted,fontSize:13,textAlign:'center',padding:20}}>Henüz takviye atanmamış</p>
              ) : (
                supplements.map((s,i)=>(
                  <div key={i} style={{background:'#0F172A',borderRadius:8,padding:10,marginBottom:8}}>
                    <p style={{fontSize:12,color:COLORS.accent,marginBottom:4}}>{s.name}</p>
                    <p style={{fontSize:11,color:COLORS.text}}>Dozaj: {s.dose}</p>
                    {s.usage && <p style={{fontSize:11,color:COLORS.textMuted}}>Kullanım: {s.usage}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <nav style={{position:'fixed',bottom:0,left:0,right:0,background:COLORS.card,borderTop:`1px solid #334155`,display:'flex',overflowX:'auto',boxShadow:'0 -2px 12px rgba(0,0,0,.3)',zIndex:100}}>
        {[
          {id:'home',l:'Ana',i:'🏠'},
          {id:'food',l:'Menü',i:'🥗'},
          {id:'measure',l:'Ölçüm',i:'📏'},
          {id:'log',l:'Günlük',i:'📋'},
          {id:'messages',l:'Mesaj',i:'📧'},
          {id:'supplements',l:'Takviye',i:'💊'}
        ].map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)} style={{flex:'0 0 auto',minWidth:'65px',border:'none',background:'none',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'8px 4px',color:tab===n.id?COLORS.accent:COLORS.textMuted,fontSize:12}}>
            <span style={{fontSize:18}}>{n.i}</span>
            <span style={{fontSize:9,fontWeight:600}}>{n.l}</span>
          </button>
        ))}
      </nav>
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
  const [toast, show] = useToast();

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
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0F172A,#1E293B)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <G/>
      <div className="fi" style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:52,marginBottom:10}}>🥗</div>
          <h1 style={{fontSize:28,color:COLORS.accent,marginBottom:4,fontWeight:700}}>Diyet Takip Sistemi</h1>
        </div>

        <div className="card">
          <div style={{display:'flex',background:'#0F172A',borderRadius:10,padding:4,marginBottom:18}}>
            {['login','register'].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setErr('');}} style={{flex:1,padding:'10px 0',border:'none',borderRadius:8,cursor:'pointer',fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,background:mode===m?COLORS.card:'transparent',color:mode===m?COLORS.accent:COLORS.textMuted,transition:'all .2s'}}>
                {m==='login'?'Giriş':'Kayıt'}
              </button>
            ))}
          </div>

          {mode==='register' && <Inp label="Ad Soyad *" value={name} onChange={setName} ph="Adınız Soyadınız"/>}
          <Inp label="E-posta *" value={email} onChange={setEmail} type="email" ph="ornek@mail.com"/>
          <Inp label="Şifre *" value={pass} onChange={setPass} type="password" ph="••••••••"/>
          {mode==='register' && (
            <>
              <Inp label="Başlangıç Kilo (kg) *" value={kilo} onChange={setKilo} type="number" ph="75"/>
              <Inp label="Admin Kodu *" value={adminCode} onChange={setAdminCode} type="password" ph="Özel kod"/>
            </>
          )}

          {err && <p style={{color:COLORS.danger,fontSize:13,marginBottom:12,background:'#EF444430',padding:'10px 12px',borderRadius:8,lineHeight:1.4}}>{err}</p>}

          <Btn onClick={submit} disabled={loading} full style={{padding:'12px',fontSize:14}}>
            {loading ? 'Lütfen bekleyin...' : mode==='login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </Btn>
        </div>
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
    <div style={{minHeight:'100vh',background:COLORS.bg,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
      <G/>
      <div style={{fontSize:48}}>🥗</div>
      <p style={{color:COLORS.textMuted,fontFamily:"'Inter',sans-serif",fontSize:14}}>Yükleniyor...</p>
    </div>
  );

  if (!user) return <Login onLogin={setUser}/>;
  if (user.role==='admin') return <AdminDash onLogout={logout}/>;
  return <PatientDash user={user} onLogout={logout}/>;
}
