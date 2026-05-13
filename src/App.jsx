import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { Download, Copy, LogOut, Moon, Sun, Upload, Trash2 } from 'lucide-react'

export default function App() {
  const [login, setLogin] = useState(localStorage.getItem('al') === '1')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [dark, setDark] = useState(false)
  const [loja, setLoja] = useState('amazon')

  const [dados, setDados] = useState({
    amazon: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '🚨 ACABOU DE SAIR DE: R$ 299,90 POR: R$ 269,90', imagem: null, perc: null },
    shopee: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, perc: null },
    shein: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, perc: null },
    ml: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, perc: null },
    netshoes: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, perc: null },
    tiktok: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, perc: null },
  })

  const ref = useRef()
  const fileRef = useRef()
  const d = dados[loja]
  const set = (k, v) => setDados(p => ({...p, [loja]: {...p[loja], [k]: v } }))

  const lojas = {
    amazon: { n: 'AMAZON', c: '#FF9900' },
    shopee: { n: 'SHOPEE', c: '#EE4D2D' },
    shein: { n: 'SHEIN', c: '#000' },
    ml: { n: 'MERCADO LIVRE', c: '#FFE600', t: '#000' },
    netshoes: { n: 'NETSHOES', c: '#532988' },
    tiktok: { n: 'TIKTOK', c: '#000' }
  }

  const parse = v => v? parseInt(v.replace(/\D/g, '')) / 100 : 0
  const fmt = v => v? parse(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''
  const fin = v => { const n = v.replace(/\D/g, ''); return n? (parseInt(n) / 100).toFixed(2).replace('.', ',') : '' }

  const descAuto = d.de && d.preco? Math.round(((parse(d.de) - parse(d.preco)) / parse(d.de)) * 100) : 0
  const desc = d.perc?? descAuto

  const baixar = async () => {
    const canvas = await html2canvas(ref.current, { scale: 3, backgroundColor: '#ffffff', useCORS: true })
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `achado-${Date.now()}.png`
    a.click()
    // Copia o link junto para colar no WhatsApp
    if (d.link) navigator.clipboard.writeText(`🔥 ${d.titulo}\n${d.link}`)
  }

  if (!login) return (
    <div className="min-h-screen bg-black grid place-items-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
        <h1 className="text-3xl font-black text-center mb-6">Achou Levou</h1>
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="admin" className="w-full p-3 border rounded-xl mb-3" />
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="123456" className="w-full p-3 border rounded-xl mb-4" />
        <button onClick={() => { if (user === 'admin' && pass === '123456') { setLogin(true); localStorage.setItem('al', '1') } }} className="w-full p-3 bg-black text-white rounded-xl font-bold">Entrar</button>
      </div>
    </div>
  )

  return (
    <div className={dark? 'dark bg-zinc-950 text-white min-h-screen' : 'bg-zinc-50 min-h-screen'}>
      <div className="p-4 max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-3">
          <h1 className="font-bold">Achou Levou v6</h1>
          <button onClick={() => setDark(!dark)} className="p-2">{dark? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>

        {/* LOJAS */}
        <div className="flex gap-1.5 overflow-x-auto pb-2">
          {Object.entries(lojas).map(([k, l]) => (
            <button key={k} onClick={() => setLoja(k)} className={`px-3 py-1.5 rounded-full text-xs font-bold ${loja === k? 'text-white' : 'bg-white dark:bg-zinc-800'}`} style={{ backgroundColor: loja === k? l.c : '', color: loja === k? (l.t || '#fff') : '' }}>{l.n}</button>
          ))}
        </div>

        {/* INPUTS */}
        <input value={d.link} onChange={e => set('link', e.target.value)} placeholder="Cole o link de afiliado aqui" className="w-full mt-3 p-3 rounded-xl border dark:bg-zinc-900 text-sm" />
        <div className="grid grid-cols-3 gap-2 mt-2">
          <input value={d.de} onChange={e => set('de', fin(e.target.value))} placeholder="De" className="p-2.5 rounded-xl border dark:bg-zinc-900 text-sm" />
          <input value={d.preco} onChange={e => set('preco', fin(e.target.value))} placeholder="Por" className="p-2.5 rounded-xl border dark:bg-zinc-900 text-sm" />
          <input type="number" value={d.perc?? ''} onChange={e => set('perc', e.target.value? +e.target.value : null)} placeholder={`-${descAuto}%`} className="p-2.5 rounded-xl border dark:bg-zinc-900 text-sm" />
        </div>
        <input value={d.descricao} onChange={e => set('descricao', e.target.value)} placeholder="Descrição com emoji" className="w-full mt-2 p-2.5 rounded-xl border dark:bg-zinc-900 text-sm" />

        <div className="flex gap-2 mt-2">
          <button onClick={() => fileRef.current?.click()} className="flex-1 p-2.5 border-2 border-dashed rounded-xl text-sm"><Upload size={14} className="inline mr-1" />Imagem</button>
          {d.imagem && <button onClick={() => set('imagem', null)} className="p-2.5 bg-red-500 text-white rounded-xl"><Trash2 size={16} /></button>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => set('imagem', ev.target.result); r.readAsDataURL(f) } }} className="hidden" />

        {/* TEMPLATE AJUSTADO */}
        <div className="flex justify-center mt-4">
          <div ref={ref} className="w-[360px] h-[460px] bg-white rounded-2xl p-4 flex flex-col" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* TOPO */}
            <div className="flex justify-between">
              <div className="px-2.5 py-1 rounded-full text-white text-[10px] font-bold" style={{ backgroundColor: lojas[loja].c, color: lojas[loja].t || '#fff' }}>{lojas[loja].n}</div>
              <div className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold">-{desc}%</div>
            </div>

            {/* TÍTULO SUBIU */}
            <h2 className="text-center font-black text-[24px] text-black leading-none mt-2 mb-1">{d.titulo}</h2>

            {/* IMAGEM - MESMO LUGAR */}
            <div className="h-[185px] flex items-center justify-center">
              {d.imagem? <img src={d.imagem} className="max-h-full max-w-full object-contain" /> : <div className="w-full h-full bg-gray-50" />}
            </div>

            {/* DESCRIÇÃO */}
            <div className="h-[28px] flex items-center justify-center">
              <p className="text-[12px] text-gray-600 text-center leading-tight px-1" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{d.descricao}</p>
            </div>

            {/* PREÇO DESCEU */}
            <div className="flex justify-center my-2">
              <div className="bg-black text-white px-5 py-2 rounded-xl text-center">
                {d.de && <div className="text-[10px] opacity-70 -mb-0.5">De R$ {fmt(d.de)}</div>}
                <div className="text-[22px] font-black leading-none">R$ {fmt(d.preco)}</div>
              </div>
            </div>

            {/* LINK SUBIU E AUMENTOU */}
            <div className="mt-auto flex items-start gap-2 pt-1 border-t border-gray-100">
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-bold text-gray-500 uppercase">Link de afiliado:</div>
                <div className="text-[12px] font-medium text-black leading-snug break-all">{d.link || 'https://seu-link-aqui'}</div>
              </div>
              {d.link && (
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${encodeURIComponent(d.link)}`} className="w-[52px] h-[52px] shrink-0 rounded" alt="QR" />
              )}
            </div>

            <div className="text-[7px] text-center text-gray-400 mt-1">PUBLICIDADE • LINK DE AFILIADO</div>
          </div>
        </div>

        <button onClick={baixar} className="w-full mt-4 p-3.5 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2"><Download size={18} />Baixar e Copiar Link</button>
        <p className="text-xs text-center mt-2 opacity-60">Ao baixar, o link é copiado automaticamente para colar no WhatsApp</p>
      </div>
    </div>
  )
}
