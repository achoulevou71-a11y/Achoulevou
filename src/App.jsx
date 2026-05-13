import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { Download, Copy, LogOut, Moon, Sun, Upload, Trash2, Settings, ArrowLeft, ExternalLink } from 'lucide-react'

export default function App() {
  const [login, setLogin] = useState(localStorage.getItem('al') === '1')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [dark, setDark] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [loja, setLoja] = useState('amazon')

  const [dadosLojas, setDadosLojas] = useState({
    amazon: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, percManual: null },
    shopee: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, percManual: null },
    shein: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, percManual: null },
    ml: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, percManual: null },
    netshoes: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, percManual: null },
    tiktok: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null, percManual: null },
  })

  const [corFundo, setCorFundo] = useState('#ffffff')
  const [corTexto, setCorTexto] = useState('#111111')
  const [corPreco, setCorPreco] = useState('#000000')
  const [fonte, setFonte] = useState('inter')
  const [tamTitulo, setTamTitulo] = useState(32)

  const ref = useRef()
  const fileRef = useRef()
  const dados = dadosLojas[loja]
  const setD = (k, v) => setDadosLojas(p => ({...p, [loja]: {...p[loja], [k]: v } }))

  const lojas = {
    amazon: { nome: 'Amazon', cor: '#FF9900' },
    shopee: { nome: 'Shopee', cor: '#EE4D2D' },
    shein: { nome: 'Shein', cor: '#000000' },
    ml: { nome: 'Mercado Livre', cor: '#FFE600', txt: '#000' },
    netshoes: { nome: 'Netshoes', cor: '#532988' },
    tiktok: { nome: 'TikTok', cor: '#000000' }
  }

  const parse = v => v? parseInt(v.replace(/\D/g, '')) / 100 : 0
  const fmt = v => v? parse(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''
  const fmtIn = v => { const n = v.replace(/\D/g, ''); return n? (parseInt(n) / 100).toFixed(2).replace('.', ',') : '' }

  const descAuto = dados.de && dados.preco? Math.round(((parse(dados.de) - parse(dados.preco)) / parse(dados.de)) * 100) : 0
  const desc = dados.percManual!== null? dados.percManual : descAuto

  const handleImg = (e) => {
    const f = e.target.files[0]
    if (f) { const r = new FileReader(); r.onload = ev => setD('imagem', ev.target.result); r.readAsDataURL(f) }
  }

  const baixar = async () => {
    const canvas = await html2canvas(ref.current, { scale: 3, backgroundColor: corFundo, useCORS: true })
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `${loja}-${Date.now()}.png`
    a.click()
  }

  const copiar = async () => {
    const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: corFundo, useCORS: true })
    canvas.toBlob(async b => { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]); alert('Copiado!') } catch { baixar() } })
  }

  if (!login) return (
    <div className="min-h-screen bg-zinc-950 grid place-items-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
        <h1 className="text-3xl font-black text-center mb-6">Achou Levou</h1>
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="Usuário" className="w-full p-3.5 border rounded-2xl mb-3" />
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Senha" className="w-full p-3.5 border rounded-2xl mb-4" />
        <button onClick={() => { if (user === 'admin' && pass === '123456') { setLogin(true); localStorage.setItem('al', '1') } }} className="w-full p-3.5 bg-black text-white rounded-2xl font-bold">Entrar</button>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen ${dark? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`} style={{ fontFamily: 'Inter, system-ui' }}>
      <header className={`sticky top-0 z-40 ${dark? 'bg-zinc-950' : 'bg-white'} border-b ${dark? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex justify-between items-center p-4 max-w-2xl mx-auto">
          <h1 className="font-semibold">Achou Levou v4</h1>
          <div className="flex gap-1">
            <button onClick={() => setDark(!dark)} className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800">{dark? <Sun size={18} /> : <Moon size={18} />}</button>
            <button onClick={() => setShowConfig(!showConfig)} className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"><Settings size={18} /></button>
            <button onClick={() => { setLogin(false); localStorage.removeItem('al') }} className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"><LogOut size={18} /></button>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-2xl mx-auto pb-28">
        {/* LOJAS */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 mb-4" style={{ scrollbarWidth: 'none' }}>
          {Object.entries(lojas).map(([k, l]) => (
            <button key={k} onClick={() => setLoja(k)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border-2 ${loja === k? 'scale-105' : ''}`} style={{ backgroundColor: loja === k? l.cor : dark? '#18181b' : '#fff', color: loja === k? (l.txt || '#fff') : dark? '#a1a1aa' : '#52525b', borderColor: loja === k? l.cor : 'transparent' }}>{l.nome}</button>
          ))}
        </div>

        {/* INPUTS */}
        <div className="space-y-3">
          <div className="relative">
            <input value={dados.link} onChange={e => setD('link', e.target.value)} placeholder="Link de afiliado" className={`w-full p-3.5 pr-10 rounded-2xl border text-sm ${dark? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} />
            {dados.link && <button onClick={() => window.open(dados.link, '_blank')} className="absolute right-3 top-3.5 text-zinc-400 hover:text-black"><ExternalLink size={16} /></button>}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs opacity-60">De R$</label>
              <input value={dados.de} onChange={e => setD('de', fmtIn(e.target.value))} placeholder="0,00" className={`w-full p-3 rounded-xl border mt-1 ${dark? 'bg-zinc-900 border-zinc-800' : 'bg-white'}`} />
            </div>
            <div>
              <label className="text-xs opacity-60">Por R$</label>
              <input value={dados.preco} onChange={e => setD('preco', fmtIn(e.target.value))} placeholder="0,00" className={`w-full p-3 rounded-xl border mt-1 ${dark? 'bg-zinc-900 border-zinc-800' : 'bg-white'}`} />
            </div>
            <div>
              <label className="text-xs opacity-60">% OFF</label>
              <div className="flex mt-1">
                <input type="number" value={dados.percManual?? ''} onChange={e => setD('percManual', e.target.value? parseInt(e.target.value) : null)} placeholder={`${descAuto}%`} className={`w-full p-3 rounded-l-xl border ${dark? 'bg-zinc-900 border-zinc-800' : 'bg-white'}`} />
                <button onClick={() => setD('percManual', null)} className="px-2 bg-zinc-200 dark:bg-zinc-700 rounded-r-xl text-xs">Auto</button>
              </div>
            </div>
          </div>

          <input value={dados.titulo} onChange={e => setD('titulo', e.target.value)} placeholder="Título" className={`w-full p-3.5 rounded-2xl border ${dark? 'bg-zinc-900 border-zinc-800' : 'bg-white'}`} />
          <textarea value={dados.descricao} onChange={e => setD('descricao', e.target.value)} placeholder="Descrição curta" rows={2} maxLength={100} className={`w-full p-3.5 rounded-2xl border resize-none ${dark? 'bg-zinc-900 border-zinc-800' : 'bg-white'}`} />
        </div>

        {/* IMAGEM */}
        <div className="flex gap-2 mt-3">
          <button onClick={() => fileRef.current?.click()} className={`flex-1 p-3 rounded-2xl border-2 border-dashed text-sm flex items-center justify-center gap-2 ${dark? 'border-zinc-700' : 'border-zinc-300'}`}><Upload size={14} />{dados.imagem? 'Trocar imagem' : 'Adicionar imagem'}</button>
          {dados.imagem && <button onClick={() => setD('imagem', null)} className="p-3 bg-red-500 text-white rounded-2xl"><Trash2 size={16} /></button>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} className="hidden" />

        {/* PREVIEW - LAYOUT TRAVADO */}
        <div className="mt-6 flex justify-center">
          <div ref={ref} className="w-full max-w-[420px] aspect-[4/5] rounded-3xl p-5 flex flex-col shadow-2xl relative overflow-hidden" style={{ backgroundColor: corFundo, color: corTexto, fontFamily: fonte === 'inter'? 'Inter' : fonte }}>
            <div className="absolute inset-0 opacity-5" style={{ background: `linear-gradient(135deg, ${lojas[loja].cor}, transparent)` }} />

            {/* TOPO */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="px-2.5 py-1 rounded-full text-white text-[10px] font-bold" style={{ backgroundColor: lojas[loja].cor, color: lojas[loja].txt || '#fff' }}>{lojas[loja].nome.toUpperCase()}</div>
              {desc > 0 && <div className="bg-red-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold">-{desc}%</div>}
            </div>

            {/* TÍTULO CENTRALIZADO */}
            <h2 className="relative z-10 text-center font-black mt-3 leading-none" style={{ fontSize: `${tamTitulo}px`, color: corTexto }}>{dados.titulo}</h2>

            {/* IMAGEM FIXA - NÃO EMPURRA */}
            <div className="relative z-10 h-[36%] flex items-center justify-center my-2">
              {dados.imagem? <img src={dados.imagem} className="max-h-full max-w-full object-contain" alt="" /> : <div className="w-full h-full rounded-xl" style={{ backgroundColor: `${lojas[loja].cor}15` }} />}
            </div>

            {/* DESCRIÇÃO */}
            {dados.descricao && <p className="relative z-10 text-center text-[13px] opacity-70 px-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{dados.descricao}</p>}

            {/* PREÇO DESTAQUE */}
            <div className="relative z-10 mt-auto flex justify-center">
              {dados.preco && (
                <div className="text-center px-5 py-3 rounded-2xl" style={{ backgroundColor: corPreco, color: corFundo }}>
                  {dados.de && <div className="text-[12px] line-through opacity-70">De R$ {fmt(dados.de)}</div>}
                  <div className="text-[28px] font-black leading-none">R$ {fmt(dados.preco)}</div>
                </div>
              )}
            </div>

            {/* LINK GRANDE + QR */}
            <div className="relative z-10 mt-3 flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold opacity-80 truncate" style={{ color: corTexto }}>{dados.link? new URL(dados.link).hostname.replace('www.', '') : 'seu-link.com'}</div>
                <div className="text-[9px] opacity-50 truncate">{dados.link || 'Link de afiliado'}</div>
              </div>
              {dados.link && <img src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(dados.link)}`} className="w-12 h-12 rounded bg-white p-0.5" alt="QR" />}
            </div>

            {/* RODAPÉ CONAR */}
            <div className="relative z-10 mt-2 text-[8px] text-center opacity-40 tracking-wide">PUBLICIDADE • LINK DE AFILIADO</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5 max-w-[420px] mx-auto">
          <button onClick={baixar} className="p-3.5 bg-black text-white rounded-2xl font-medium flex items-center justify-center gap-2"><Download size={18} />Baixar</button>
          <button onClick={copiar} className="p-3.5 bg-zinc-800 text-white rounded-2xl font-medium flex items-center justify-center gap-2"><Copy size={18} />Copiar</button>
        </div>
      </div>
    </div>
  )
                    }
