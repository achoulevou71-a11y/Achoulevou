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
    amazon: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '🚨 ACABOU DE SAIR', imagem: null, perc: null },
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
    a.href = canvas.toDataURL()
    a.download = `achado-${Date.now()}.png`
    a.click()
  }

  if (!login) return (
    <div className="min-h-screen bg-black grid place-items-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
        <h1 className="text-3xl font-black text-center mb-6">Achou Levou</h1>
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="Usuário" className="w-full p-3 border rounded-xl mb-3" />
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Senha" className="w-full p-3 border rounded-xl mb-4" />
        <button onClick={() => { if (user === 'admin' && pass === '123456') { setLogin(true); localStorage.setItem('al', '1') } }} className="w-full p-3 bg-black text-white rounded-xl font-bold">Entrar</button>
      </div>
    </div>
  )

  return (
    <div className={dark? 'dark bg-zinc-950 text-white min-h-screen' : 'bg-zinc-50 min-h-screen'}>
      <header className="sticky top-0 bg-white dark:bg-zinc-950 border-b p-4 flex justify-between">
        <b>Achou Levou v5</b>
        <div className="flex gap-2">
          <button onClick={() => setDark(!dark)} className="p-2">{dark? <Sun size={18} /> : <Moon size={18} />}</button>
          <button onClick={() => { setLogin(false); localStorage.removeItem('al') }} className="p-2"><LogOut size={18} /></button>
        </div>
      </header>

      <div className="p-4 max-w-lg mx-auto">
        {/* LOJAS */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Object.entries(lojas).map(([k, l]) => (
            <button key={k} onClick={() => setLoja(k)} className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${loja === k? 'text-white' : 'bg-white dark:bg-zinc-800'}`} style={{ backgroundColor: loja === k? l.c : '', color: loja === k? (l.t || '#fff') : '' }}>{l.n}</button>
          ))}
        </div>

        {/* INPUTS */}
        <input value={d.link} onChange={e => set('link', e.target.value)} placeholder="Link de afiliado" className="w-full mt-3 p-3 rounded-xl border dark:bg-zinc-900" />
        <div className="grid grid-cols-3 gap-2 mt-2">
          <input value={d.de} onChange={e => set('de', fin(e.target.value))} placeholder="De R$" className="p-3 rounded-xl border dark:bg-zinc-900" />
          <input value={d.preco} onChange={e => set('preco', fin(e.target.value))} placeholder="Por R$" className="p-3 rounded-xl border dark:bg-zinc-900" />
          <input type="number" value={d.perc?? ''} onChange={e => set('perc', e.target.value? +e.target.value : null)} placeholder={`% ${descAuto}`} className="p-3 rounded-xl border dark:bg-zinc-900" />
        </div>
        <input value={d.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Título" className="w-full mt-2 p-3 rounded-xl border dark:bg-zinc-900" />
        <input value={d.descricao} onChange={e => set('descricao', e.target.value)} placeholder="Descrição com emoji 🚨" className="w-full mt-2 p-3 rounded-xl border dark:bg-zinc-900" />

        <div className="flex gap-2 mt-2">
          <button onClick={() => fileRef.current?.click()} className="flex-1 p-2.5 border-2 border-dashed rounded-xl text-sm flex items-center justify-center gap-1"><Upload size={14} /> Imagem</button>
          {d.imagem && <button onClick={() => set('imagem', null)} className="p-2.5 bg-red-500 text-white rounded-xl"><Trash2 size={16} /></button>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => set('imagem', ev.target.result); r.readAsDataURL(f) } }} className="hidden" />

        {/* TEMPLATE TRAVADO - NÃO EMPURRA */}
        <div className="flex justify-center mt-4">
          <div ref={ref} className="w-[360px] h-[450px] bg-white rounded-3xl p-5 flex flex-col relative overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Topo */}
            <div className="flex justify-between items-start h-[28px]">
              <div className="px-3 py-1 rounded-full text-white text-[10px] font-bold" style={{ backgroundColor: lojas[loja].c, color: lojas[loja].t || '#fff' }}>{lojas[loja].n}</div>
              {desc > 0 && <div className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold">-{desc}%</div>}
            </div>

            {/* Título */}
            <div className="h-[40px] flex items-center justify-center">
              <h2 className="text-[26px] font-black text-center leading-none text-black">{d.titulo}</h2>
            </div>

            {/* Imagem - ALTURA FIXA */}
            <div className="h-[170px] flex items-center justify-center my-1">
              {d.imagem? <img src={d.imagem} className="max-h-full max-w-full object-contain" /> : <div className="w-full h-full bg-zinc-100 rounded-xl" />}
            </div>

            {/* Descrição - ALTURA FIXA 2 LINHAS */}
            <div className="h-[36px] flex items-center justify-center px-2">
              <p className="text-[13px] text-center leading-tight text-zinc-700" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {d.descricao}
              </p>
            </div>

            {/* Preço - ALTURA FIXA */}
            <div className="h-[80px] flex items-center justify-center">
              {d.preco && (
                <div className="bg-black text-white px-6 py-3 rounded-2xl text-center">
                  {d.de && <div className="text-[11px] opacity-70 line-through">De R$ {fmt(d.de)}</div>}
                  <div className="text-[28px] font-black leading-none">R$ {fmt(d.preco)}</div>
                </div>
              )}
            </div>

            {/* LINK GRANDE - ALTURA FIXA */}
            <div className="h-[50px] flex items-center gap-2 mt-auto">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Link de afiliado:</div>
                <div className="text-[12px] font-medium text-black truncate">{d.link || 'cole seu link aqui'}</div>
              </div>
              {d.link && <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(d.link)}`} className="w-[46px] h-[46px] rounded-lg border" alt="QR" />}
            </div>

            {/* Rodapé */}
            <div className="h-[14px] flex items-center justify-center">
              <span className="text-[8px] text-zinc-400 tracking-widest">PUBLICIDADE • LINK DE AFILIADO</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button onClick={baixar} className="p-3 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-1"><Download size={18} />Baixar</button>
          <button onClick={baixar} className="p-3 bg-zinc-800 text-white rounded-2xl font-bold flex items-center justify-center gap-1"><Copy size={18} />Copiar</button>
        </div>
      </div>
    </div>
  )
}
