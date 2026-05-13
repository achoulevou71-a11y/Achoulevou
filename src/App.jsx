import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { Download, LogOut, Moon, Sun, Upload, Trash2 } from 'lucide-react'

export default function App() {
  const [login, setLogin] = useState(localStorage.getItem('al') === '1')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [dark, setDark] = useState(false)
  const [loja, setLoja] = useState('amazon')

  const [dados, setDados] = useState({
    amazon: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, perc: null },
    shopee: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, perc: null },
    shein: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, perc: null },
    ml: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, perc: null },
    netshoes: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, perc: null },
    tiktok: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, perc: null },
  })

  const ref = useRef(null)
  const fileRef = useRef(null)
  const d = dados[loja]
  const setField = (k, v) => setDados(prev => ({...prev, [loja]: {...prev[loja], [k]: v } }))

  const lojas = {
    amazon: { n: 'AMAZON', c: '#FF9900' },
    shopee: { n: 'SHOPEE', c: '#EE4D2D' },
    shein: { n: 'SHEIN', c: '#000000' },
    ml: { n: 'MERCADO LIVRE', c: '#FFE600', t: '#000000' },
    netshoes: { n: 'NETSHOES', c: '#532988' },
    tiktok: { n: 'TIKTOK', c: '#000000' },
  }

  const parse = (v) => v? parseInt(v.replace(/\D/g, '')) / 100 : 0
  const fmt = (v) => v? parse(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''
  const toMoney = (v) => { const n = v.replace(/\D/g, ''); return n? (parseInt(n) / 100).toFixed(2).replace('.', ',') : '' }

  const descAuto = d.de && d.preco? Math.round(((parse(d.de) - parse(d.preco)) / parse(d.de)) * 100) : 0
  const desc = d.perc?? descAuto
  const L = lojas[loja]

  const baixar = async () => {
    const canvas = await html2canvas(ref.current, { scale: 3, backgroundColor: '#ffffff', useCORS: true })
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `achado-${Date.now()}.png`
    a.click()
  }

  if (!login) {
    return (
      <div className="min-h-screen bg-zinc-950 grid place-items-center p-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
          <h1 className="text-3xl font-black text-center mb-6">Achou Levou</h1>
          <input value={user} onChange={e => setUser(e.target.value)} placeholder="admin" className="w-full p-3.5 border rounded-2xl mb-3" />
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="123456" className="w-full p-3.5 border rounded-2xl mb-4" />
          <button onClick={() => { if (user === 'admin' && pass === '123456') { setLogin(true); localStorage.setItem('al', '1') } }} className="w-full p-3.5 bg-black text-white rounded-2xl font-bold">Entrar</button>
        </div>
      </div>
    )
  }

  return (
    <div className={dark? 'min-h-screen bg-black text-white' : 'min-h-screen bg-zinc-50 text-zinc-900'}>
      <div className="max-w-lg mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold">Achou Levou v4.1</h1>
          <button onClick={() => setDark(!dark)} className="p-2 rounded-xl bg-zinc-200 dark:bg-zinc-800">{dark? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>

        <div className="flex gap-2 overflow-x-auto mb-3">
          {Object.entries(lojas).map(([k, l]) => (
            <button key={k} onClick={() => setLoja(k)} className={`px-4 py-2 rounded-full text-xs font-bold border ${loja === k? 'text-white' : 'bg-white text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'}`} style={{ backgroundColor: loja === k? l.c : undefined }}>{l.n}</button>
          ))}
        </div>

        <input value={d.link} onChange={e => setField('link', e.target.value)} placeholder="Link afiliado" className="w-full p-3 rounded-xl border mb-2 dark:bg-zinc-900 dark:text-white" />
        <div className="grid grid-cols-3 gap-2 mb-2">
          <input value={d.de} onChange={e => setField('de', toMoney(e.target.value))} placeholder="De" className="p-3 rounded-xl border dark:bg-zinc-900 dark:text-white" />
          <input value={d.preco} onChange={e => setField('preco', toMoney(e.target.value))} placeholder="Por" className="p-3 rounded-xl border dark:bg-zinc-900 dark:text-white" />
          <input type="number" value={d.perc?? ''} onChange={e => setField('perc', e.target.value? Number(e.target.value) : null)} placeholder={`%${descAuto}`} className="p-3 rounded-xl border dark:bg-zinc-900 dark:text-white" />
        </div>
        <input value={d.titulo} onChange={e => setField('titulo', e.target.value)} className="w-full p-3 rounded-xl border mb-2 dark:bg-zinc-900 dark:text-white font-bold" />
        <input value={d.descricao} onChange={e => setField('descricao', e.target.value)} placeholder="Descrição do produto" className="w-full p-3 rounded-xl border mb-2 dark:bg-zinc-900 dark:text-white text-sm" />

        <div className="flex gap-2">
          <button onClick={() => fileRef.current?.click()} className="flex-1 p-3 border-2 border-dashed rounded-xl dark:border-zinc-700"><Upload size={16} className="inline mr-2" />Imagem</button>
          {d.imagem && <button onClick={() => setField('imagem', null)} className="p-3 bg-red-500 text-white rounded-xl"><Trash2 size={18} /></button>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => setField('imagem', ev.target.result); r.readAsDataURL(f) } }} className="hidden" />

        <div className="flex justify-center mt-6">
          <div ref={ref} className="w-[360px] h-[480px] bg-white rounded-3xl p-5 flex flex-col">
            <div className="flex justify-between">
              <div className="px-3 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: L.c }}>{L.n}</div>
              {desc > 0 && <div className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold">-{desc}%</div>}
            </div>
            <h2 className="text-center font-black text-[28px] mt-3 text-black">{d.titulo}</h2>
            <div className="h-[170px] flex items-center justify-center my-2">
              {d.imagem? <img src={d.imagem} className="max-h-full max-w-full object-contain" alt="" /> : null}
            </div>
            {d.descricao && <p className="text-center text-[14px] text-zinc-700 px-2">{d.descricao}</p>}
            <div className="flex justify-center mt-auto mb-3">
              <div className="bg-black text-white px-6 py-2.5 rounded-2xl text-center">
                {d.de && <div className="text-xs line-through opacity-70">De R$ {fmt(d.de)}</div>}
                <div className="text-[26px] font-black">R$ {fmt(d.preco)}</div>
              </div>
            <div className="flex gap-3 border-t pt-3">
              <div className="flex-1">
                <div className="text-[10px] font-bold text-zinc-500">LINK DE AFILIADO:</div>
                <div className="text-[15px] font-semibold text-black break-all">{d.link}</div>
              </div>
              {d.link && <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(d.link)}`} className="w-[65px] h-[65px] border rounded" alt="" />}
            </div>
          </div>
        </div>

        <button onClick={baixar} className="w-full mt-4 p-3.5 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-bold">Baixar Imagem</button>
      </div>
    </div>
  )
          }
