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
    amazon: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, perc: null },
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
    shein: { n: 'SHEIN', c: '#000000' },
    ml: { n: 'MERCADO LIVRE', c: '#FFE600', t: '#000000' },
    netshoes: { n: 'NETSHOES', c: '#532988' },
    tiktok: { n: 'TIKTOK', c: '#000000' },
  }

  const parse = v => v? parseInt(v.replace(/\D/g, '')) / 100 : 0
  const fmt = v => v? parse(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''
  const fin = v => { const n = v.replace(/\D/g, ''); return n? (parseInt(n) / 100).toFixed(2).replace('.', ',') : '' }

  const descAuto = d.de && d.preco? Math.round(((parse(d.de) - parse(d.preco)) / parse(d.de)) * 100 : 0
  const desc = d.perc?? descAuto
  const L = lojas[loja]

  const baixar = async () => {
    const canvas = await html2canvas(ref.current, { scale: 3, backgroundColor: '#ffffff', useCORS: true, allowTaint: true })
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `achado-${Date.now()}.png`
    a.click()
  }

  if (!login) return (
    <div className="min-h-screen bg-zinc-950 grid place-items-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
        <h1 className="text-3xl font-black text-center mb-6">Achou Levou</h1>
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="admin" className="w-full p-3.5 border rounded-2xl mb-3" />
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="123456" className="w-full p-3.5 border rounded-2xl mb-4" />
        <button onClick={() => { if (user === 'admin' && pass === '123456') { setLogin(true); localStorage.setItem('al', '1') } }} className="w-full p-3.5 bg-black text-white rounded-2xl font-bold">Entrar</button>
      </div>
    </div>
  )

  return (
    <div className={dark? 'min-h-screen bg-black text-white' : 'min-h-screen bg-zinc-50 text-zinc-900'}>
      <div className="max-w-lg mx-auto p-4 pb-24">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-lg">Achou Levou v4.1</h1>
          <button onClick={() => setDark(!dark)} className="p-2 rounded-xl bg-zinc-200 dark:bg-zinc-800">{dark? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>

        {/* 1. CATEGORIAS ARRUMADAS NO DARK */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {Object.entries(lojas).map(([k, l]) => (
            <button key={k} onClick={() => setLoja(k)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border ${loja === k? 'text-white border-transparent' : 'bg-white text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700'}`} style={{ backgroundColor: loja === k? l.c : undefined, color: loja === k? (l.t || '#fff') : undefined }}>{l.n}</button>
          ))}
        </div>

        <div className="space-y-2">
          <input value={d.link} onChange={e => set('link', e.target.value)} placeholder="Link de afiliado" className="w-full p-3 rounded-xl border bg-white text-black dark:bg-zinc-900 dark:text-white dark:border-zinc-700" />
          <div className="grid grid-cols-3 gap-2">
            <input value={d.de} onChange={e => set('de', fin(e.target.value))} placeholder="De R$" className="p-3 rounded-xl border bg-white text-black dark:bg-zinc-900 dark:text-white dark:border-zinc-700" />
            <input value={d.preco} onChange={e => set('preco', fin(e.target.value))} placeholder="Por R$" className="p-3 rounded-xl border bg-white text-black dark:bg-zinc-900 dark:text-white dark:border-zinc-700" />
            <input type="number" value={d.perc?? ''} onChange={e => set('perc', e.target.value? Number(e.target.value) : null)} placeholder={`%${descAuto}`} className="p-3 rounded-xl border bg-white text-black dark:bg-zinc-900 dark:text-white dark:border-zinc-700" />
          </div>
          <input value={d.titulo} onChange={e => set('titulo', e.target.value)} className="w-full p-3 rounded-xl border bg-white text-black dark:bg-zinc-900 dark:text-white dark:border-zinc-700 font-bold" />
          {/* 2. DESCRIÇÃO INSERIDA */}
          <input value={d.descricao} onChange={e => set('descricao', e.target.value)} placeholder="Descrição do produto (ex: Frete grátis, 10x sem juros)" className="w-full p-3 rounded-xl border bg-white text-black dark:bg-zinc-900 dark:text-white dark:border-zinc-700 text-sm" />
        </div>

        <div className="flex gap-2 mt-3">
          <button onClick={() => fileRef.current?.click()} className="flex-1 p-3 border-2 border-dashed rounded-xl text-sm flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 dark:border-zinc-700"><Upload size={16} />{d.imagem? 'Trocar imagem' : 'Adicionar imagem'}</button>
          {d.imagem && <button onClick={() => set('imagem', null)} className="p-3 bg-red-500 text-white rounded-xl"><Trash2 size={18} /></button>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => set('imagem', ev.target.result); r.readAsDataURL(f) } }} className="hidden" />

        {/* PREVIEW */}
        <div className="flex justify-center mt-6">
          <div ref={ref} className="w-[360px] h-[480px] bg-white rounded-3xl p-5 flex flex-col shadow-xl">
            <div className="flex justify-between items-start">
              <div className="px-3 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: L.c, color: L.t || '#fff' }}>{L.n}</div>
              {desc > 0 && <div className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold">-{desc}%</div>}
            </div>

            <h2 className="text-center font-black text-[26px] leading-none mt-3 text-black">{d.titulo}</h2>

            <div className="h-[170px] flex items-center justify-center my-2">
              {d.imagem? <img src={d.imagem} className="max-h-full max-w-full object-contain" crossOrigin="anonymous" alt="" /> : <div className="w-full h-full bg-zinc-50 rounded-xl" />}
            </div>

            {/* DESCRIÇÃO NO TEMPLATE */}
            {d.descricao && <p className="text-center text-[13px] text-zinc-700 px-2 leading-snug h-[34px] overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{d.descricao}</p>}

            <div className="flex justify-center mt-2 mb-3">
              {d.preco && (
                <div className="bg-black text-white px-6 py-2.5 rounded-2xl text-center">
                  {d.de && <div className="text-xs opacity-70 line-through leading-none">De R$ {fmt(d.de)}</div>}
                  <div className="text-[26px] font-black leading-none mt-0.5">R$ {fmt(d.preco)}</div>
                </div>
              )}
            </div>

            {/* 3 e 4. LINK MAIOR + QR CODE */}
            <div className="flex items-start gap-3 border-t border-zinc-200 pt-3 mt-auto">
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide mb-0.5">Link de afiliado:</div>
                <div className="text-[15px] font-semibold text-black leading-snug break-all">{d.link || 'cole seu link aqui'}</div>
              </div>
              {d.link && <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(d.link)}`} className="w-[68px] h-[68px] rounded-lg border border-zinc-200 shrink-0 bg-white" crossOrigin="anonymous" alt="QR" />}
            </div>

            <div className="text-[8px] text-center text-zinc-400 mt-2 tracking-widest">PUBLICIDADE • LINK DE AFILIADO</div>
          </div>
        </div>

        {/* BOTÃO BAIXAR VISÍVEL NO DARK */}
        <div className="mt-5 max-w-[360px] mx-auto">
          <button onClick={baixar} className="w-full p-3.5 bg-black dark:bg-white dark:text-black text-white rounded-2xl font-semibold flex items-center justify-center gap-2"><Download size={18} />Baixar Imagem</button>
        </div>
      </div>
    </div>
  )
}
