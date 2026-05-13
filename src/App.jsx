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
  }

  const copiar = async () => {
    const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true })
    canvas.toBlob(async b => {
      try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]); alert('Imagem copiada!') }
      catch { baixar() }
    })
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
    <div className={`min-h-screen ${dark? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      <div className="max-w-lg mx-auto p-4 pb-24">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-lg">Achou Levou v4</h1>
          <div className="flex gap-2">
            <button onClick={() => setDark(!dark)} className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800">{dark? <Sun size={18} /> : <Moon size={18} />}</button>
            <button onClick={() => { setLogin(false); localStorage.removeItem('al') }} className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800"><LogOut size={18} /></button>
          </div>
        </div>

        {/* LOJAS */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {Object.entries(lojas).map(([k, l]) => (
            <button key={k} onClick={() => setLoja(k)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${loja === k? 'text-white' : 'bg-white dark:bg-zinc-800'}`} style={{ backgroundColor: loja === k? l.c : '', color: loja === k? (l.t || '#fff') : '' }}>{l.n}</button>
          ))}
        </div>

        {/* CAMPOS */}
        <div className="space-y-2">
          <input value={d.link} onChange={e => set('link', e.target.value)} placeholder="Link de afiliado" className="w-full p-3 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 text-sm" />
          <div className="grid grid-cols-3 gap-2">
            <input value={d.de} onChange={e => set('de', fin(e.target.value))} placeholder="De R$" className="p-3 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800" />
            <input value={d.preco} onChange={e => set('preco', fin(e.target.value))} placeholder="Por R$" className="p-3 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800" />
            <input type="number" value={d.perc?? ''} onChange={e => set('perc', e.target.value? Number(e.target.value) : null)} placeholder={`% ${descAuto}`} className="p-3 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800" />
          </div>
          <input value={d.titulo} onChange={e => set('titulo', e.target.value)} className="w-full p-3 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 font-bold" />
          <input value={d.descricao} onChange={e => set('descricao', e.target.value)} placeholder="Descrição curta (opcional)" className="w-full p-3 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 text-sm" />
        </div>

        <div className="flex gap-2 mt-3">
          <button onClick={() => fileRef.current?.click()} className="flex-1 p-3 border-2 border-dashed rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900"><Upload size={16} />{d.imagem? 'Trocar imagem' : 'Adicionar imagem'}</button>
          {d.imagem && <button onClick={() => set('imagem', null)} className="p-3 bg-red-500 text-white rounded-xl"><Trash2 size={18} /></button>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => set('imagem', ev.target.result); r.readAsDataURL(f) } }} className="hidden" />

        {/* PREVIEW V4 */}
        <div className="flex justify-center mt-6">
          <div ref={ref} className="w-[360px] h-[450px] bg-white rounded-3xl p-5 flex flex-col shadow-xl" style={{ fontFamily: 'Inter, system-ui' }}>
            {/* Topo */}
            <div className="flex justify-between items-start">
              <div className="px-3 py-1 rounded-full text-white text-[11px] font-bold" style={{ backgroundColor: lojas[loja].c, color: lojas[loja].t || '#fff' }}>{lojas[loja].n}</div>
              {desc > 0 && <div className="px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold">-{desc}%</div>}
            </div>

            {/* Título centralizado */}
            <h2 className="text-center font-black text-[28px] leading-none mt-3 text-black">{d.titulo}</h2>

            {/* Imagem com altura fixa */}
            <div className="h-[190px] flex items-center justify-center my-2">
              {d.imagem? <img src={d.imagem} className="max-h-full max-w-full object-contain" alt="" /> : <div className="w-full h-full bg-zinc-50 rounded-xl" />}
            </div>

            {/* Descrição */}
            {d.descricao && <p className="text-center text-[13px] text-zinc-600 h-[36px] overflow-hidden px-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{d.descricao}</p>}

            {/* Preço */}
            <div className="flex justify-center mt-auto mb-3">
              {d.preco && (
                <div className="bg-black text-white px-6 py-2.5 rounded-2xl text-center">
                  {d.de && <div className="text-[11px] opacity-70 line-through leading-none">De R$ {fmt(d.de)}</div>}
                  <div className="text-[26px] font-black leading-none">R$ {fmt(d.preco)}</div>
                </div>
              )}
            </div>

            {/* LINK GRANDE */}
            <div className="flex items-start gap-3 border-t border-zinc-100 pt-3">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Link de afiliado:</div>
                <div className="text-[13px] font-medium text-black leading-snug break-all">{d.link || 'cole seu link aqui'}</div>
              </div>
              {d.link && <img src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${encodeURIComponent(d.link)}`} className="w-[52px] h-[52px] rounded-lg border border-zinc-200 shrink-0" alt="QR" />}
            </div>

            <div className="text-[8px] text-center text-zinc-400 mt-2 tracking-widest">PUBLICIDADE • LINK DE AFILIADO</div       
