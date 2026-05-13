import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { Download, Copy, LogOut, Moon, Sun, Upload, Palette, Type, ArrowLeft, Settings, X, Trash2 } from 'lucide-react'

export default function App() {
  const [login, setLogin] = useState(localStorage.getItem('al') === '1')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [dark, setDark] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [loja, setLoja] = useState('amazon')

  // ESTADO SEPARADO POR LOJA - cada uma guarda seus dados
  const [dadosLojas, setDadosLojas] = useState({
    amazon: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null },
    shopee: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null },
    shein: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null },
    ml: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null },
    netshoes: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null },
    tiktok: { link: '', preco: '', de: '', titulo: 'ACHADO DO DIA', descricao: '', imagem: null },
  })

  const [corFundo, setCorFundo] = useState('#ffffff')
  const [corTexto, setCorTexto] = useState('#000000')
  const [corPreco, setCorPreco] = useState('#000000')
  const [fonte, setFonte] = useState('inter')
  const [tamanhoTitulo, setTamanhoTitulo] = useState(36)
  const [redeSocial, setRedeSocial] = useState('')

  const ref = useRef()
  const fileInputRef = useRef()

  const dados = dadosLojas[loja]
  const setDados = (campo, valor) => {
    setDadosLojas(prev => ({
     ...prev,
      [loja]: {...prev[loja], [campo]: valor }
    }))
  }

  const lojas = {
    amazon: { nome: 'Amazon', cor: '#FF9900' },
    shopee: { nome: 'Shopee', cor: '#EE4D2D' },
    shein: { nome: 'Shein', cor: '#000000' },
    ml: { nome: 'Mercado Livre', cor: '#FFE600', texto: '#000' },
    netshoes: { nome: 'Netshoes', cor: '#532988' },
    tiktok: { nome: 'TikTok', cor: '#000000' }
  }

  const redes = {
    instagram: { nome: 'Instagram', cor: '#E4405F' },
    facebook: { nome: 'Facebook', cor: '#1877F2' },
    x: { nome: 'X', cor: '#000000' },
    whatsapp: { nome: 'WhatsApp', cor: '#25D366' },
    telegram: { nome: 'Telegram', cor: '#0088CC' },
    discord: { nome: 'Discord', cor: '#5865F2' }
  }

  const fontes = {
    inter: 'Inter, system-ui',
    poppins: "'Poppins', sans-serif",
    oswald: "'Oswald', sans-serif"
  }

  // FORMATAÇÃO BRASILEIRA CORRETA
  const parsePreco = (val) => {
    if (!val) return 0
    // Remove tudo exceto números
    const num = val.toString().replace(/\D/g, '')
    return parseInt(num) / 100
  }

  const formatarPreco = (val) => {
    if (!val) return ''
    const num = typeof val === 'string'? parsePreco(val) : val
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatarInput = (val) => {
    const num = val.replace(/\D/g, '')
    if (!num) return ''
    const formatted = (parseInt(num) / 100).toFixed(2)
    return formatted.replace('.', ',')
  }

  const desc = dados.de && dados.preco? Math.round(((parsePreco(dados.de) - parsePreco(dados.preco)) / parsePreco(dados.de)) * 100) : 0

  const handleImagem = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setDados('imagem', ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const baixar = async () => {
    const canvas = await html2canvas(ref.current, { scale: 3, backgroundColor: corFundo, useCORS: true, logging: false })
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `${loja}-${Date.now()}.png`
    a.click()
  }

  const copiar = async () => {
    const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: corFundo, useCORS: true })
    canvas.toBlob(async (b) => {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })])
        alert('Copiado!')
      } catch { baixar() }
    })
  }

  if (!login) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
        <h1 className="text-3xl font-black text-center mb-6">Achou Levou</h1>
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="Usuário" className="w-full p-3.5 border rounded-2xl mb-3" />
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Senha" className="w-full p-3.5 border rounded-2xl mb-4" />
        <button onClick={() => { if (user === 'admin' && pass === '123456') { setLogin(true); localStorage.setItem('al', '1') } }} className="w-full p-3.5 bg-black text-white rounded-2xl font-bold">Entrar</button>
      </div>
    </div>
  )

  if (showConfig) return (
    <div className={`min-h-screen ${dark? 'bg-zinc-950 text-white' : 'bg-zinc-50'}`}>
      <header className={`sticky top-0 ${dark? 'bg-zinc-950' : 'bg-white'} border-b ${dark? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 p-4 max-w-2xl mx-auto">
          <button onClick={() => setShowConfig(false)} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"><ArrowLeft size={20} /></button>
          <h1 className="font-semibold">Configurações</h1>
        </div>
      </header>
      <div className="p-4 max-w-2xl mx-auto">
        <button onClick={() => { setLogin(false); localStorage.removeItem('al') }} className="w-full p-4 bg-red-500 text-white rounded-2xl">Sair</button>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen ${dark? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      <header className={`sticky top-0 z-40 ${dark? 'bg-zinc-950' : 'bg-white'} border-b ${dark? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
          <h1 className="font-semibold">Achou Levou v3</h1>
          <div className="flex gap-1">
            <button onClick={() => setDark(!dark)} className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800">{dark? <Sun size={18} /> : <Moon size={18} />}</button>
            <button onClick={() => setShowConfig(true)} className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"><Settings size={18} /></button>
            <button onClick={() => { setLogin(false); localStorage.removeItem('al') }} className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"><LogOut size={18} /></button>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-2xl mx-auto pb-28">
        {/* LOJAS - SCROLL CORRIGIDO */}
        <div className="mb-4">
          <p className="text-xs opacity-60 mb-2 px-1">Lojas</p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
            {Object.entries(lojas).map(([key, l]) => (
              <button key={key} onClick={() => setLoja(key)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border-2 transition-all ${loja === key? 'scale-105 shadow-lg' : ''} ${dark? 'border-zinc-800' : 'border-transparent'}`} style={{ backgroundColor: loja === key? l.cor : dark? '#18181b' : '#fff', color: loja === key? (l.texto || '#fff') : dark? '#a1a1aa' : '#52525b' }}>
                {l.nome}
              </button>
            ))}
          </div>
        </div>

        {/* REDES */}
        <div className="mb-5">
          <p className="text-xs opacity-60 mb-2 px-1">Redes</p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
            {Object.entries(redes).map(([key, r]) => (
              <button key={key} onClick={() => setRedeSocial(redeSocial === key? '' : key)} className="px-3 py-1.5 rounded-full text-xs whitespace-nowrap border" style={{ backgroundColor: redeSocial === key? r.cor : 'transparent', color: redeSocial === key? '#fff' : dark? '#71717a' : '#71717a', borderColor: dark? '#27272a' : '#e4e4e7' }}>
                {r.nome}
              </button>
            ))}
          </div>
        </div>

        {/* INPUTS */}
        <div className="space-y-3">
          <input value={dados.link} onChange={e => setDados('link', e.target.value)} placeholder="Link afiliado" className={`w-full p-3.5 rounded-2xl border text-sm ${dark? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200'}`} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs opacity-60 px-1">De R$</label>
              <input value={dados.de} onChange={e => setDados('de', formatarInput(e.target.value))} placeholder="2.000,00" className={`w-full p-3.5 rounded-2xl border mt-1 ${dark? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200'}`} />
            </div>
            <div>
              <label className="text-xs opacity-60 px-1">Por R$</label>
              <input value={dados.preco} onChange={e => setDados('preco', formatarInput(e.target.value))} placeholder="1.000,00" className={`w-full p-3.5 rounded-2xl border mt-1 ${dark? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200'}`} />
            </div>
          </div>

          <input value={dados.titulo} onChange={e => setDados('titulo', e.target.value)} placeholder="Título" className={`w-full p-3.5 rounded-2xl border text-sm ${dark? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200'}`} />

          <textarea value={dados.descricao} onChange={e => setDados('descricao', e.target.value)} placeholder="Descrição (máx 2 linhas)" rows={2} maxLength={120} className={`w-full p-3.5 rounded-2xl border text-sm resize-none ${dark? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200'}`} />
        </div>

        {/* PERSONALIZAÇÃO */}
        <div className={`mt-4 p-3 rounded-2xl border ${dark? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Palette size={14} className="opacity-50" />
              <input type="color" value={corFundo} onChange={e => setCorFundo(e.target.value)} className="w-8 h-8 rounded cursor-pointer" title="Fundo" />
              <input type="color" value={corTexto} onChange={e => setCorTexto(e.target.value)} className="w-8 h-8 rounded cursor-pointer" title="Texto" />
              <input type="color" value={corPreco} onChange={e => setCorPreco(e.target.value)} className="w-8 h-8 rounded cursor-pointer" title="Preço" />
            </div>
            <select value={fonte} onChange={e => setFonte(e.target.value)} className={`text-xs p-1.5 rounded border ${dark? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50'}`}>
              <option value="inter">Inter</option>
              <option value="poppins">Poppins</option>
              <option value="oswald">Oswald</option>
            </select>
          </div>
        </div>

        {/* IMAGEM COM BOTÃO REMOVER */}
        <div className="mt-3 flex gap-2">
          <button onClick={() => fileInputRef.current?.click()} className={`flex-1 p-3 rounded-2xl border-2 border-dashed text-sm flex items-center justify-center gap-2 ${dark? 'border-zinc-700 hover:bg-zinc-900' : 'border-zinc-300 hover:bg-zinc-50'}`}>
            <Upload size={14} /> {dados.imagem? 'Trocar imagem' : 'Adicionar imagem'}
          </button>
          {dados.imagem && (
            <button onClick={() => setDados('imagem', null)} className="p-3 rounded-2xl bg-red-500 text-white hover:bg-red-600">
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImagem} className="hidden" />

        {/* PREVIEW - LAYOUT FIXO QUE NÃO QUEBRA */}
        <div className="mt-5">
          <div ref={ref} className="w-full max-w- mx-auto aspect-[4/5] rounded-3xl p-6 flex flex-col relative overflow-hidden shadow-2xl" style={{ backgroundColor: corFundo, fontFamily: fontes[fonte], color: corTexto }}>
            <div className="absolute inset-0 opacity-5" style={{ background: `linear-gradient(135deg, ${lojas[loja].cor}, transparent)` }} />

            <div className="relative z-10 flex justify-between items-start mb-3">
              <div className="px-2.5 py-1 rounded-full text-white text- font-bold" style={{ backgroundColor: lojas[loja].cor, color: lojas[loja].texto || '#fff' }}>
                {lojas[loja].nome.toUpperCase()}
              </div>
              {desc > 0 && <div className="bg-red-600 text-white px-2.5 py-1 rounded-full text- font-bold">-{desc}%</div>}
            </div>

            {/* IMAGEM COM ALTURA FIXA - NÃO EMPURRA */}
            {dados.imagem && (
              <div className="relative z-10 w-full h-[38%] mb-3 flex items-center justify-center">
                <img src={dados.imagem} className="max-w-full max-h-full object-contain rounded-xl" alt="" />
              </div>
            )}

            <div className="relative z-10 mt-auto">
              {/* TÍTULO COM TAMANHO ADAPTATIVO */}
              <h2 className="font-black leading-[0.85] tracking-tighter" style={{ fontSize: dados.imagem? '28px' : `${tamanhoTitulo}px`, color: corTexto }}>
                {dados.titulo.split(' ').slice(0, 3).map((w, i) => <div key={i}>{w}</div>)}
              </h2>

              {dados.descricao && <p className="mt-2 text- opacity-70 leading-snug" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{dados.descricao}</p>}

              {dados.preco && (
                <div className="mt-3 inline-block">
                  <div className="px-3.5 py-2.5 rounded-2xl" style={{ backgroundColor: corPreco, color: corFundo }}>
                    {dados.de && <p className="text- line-through opacity-70">R$ {formatarPreco(dados.de)}</p>}
                    <p className="text- font-black leading-none">R$ {formatarPreco(dados.preco)}</p>
                  </div>
                </div>
              )}

              {/* LINK MAIOR E VISÍVEL */}
              <div className="mt-2.5 flex items-center gap-1.5">
                {redeSocial && <div className="w-4 h-4 rounded-full" style={{ backgroundColor: redes[redeSocial].cor }} />}
                <p className="text- opacity-60 truncate" style={{ color: corTexto, maxWidth: '85%' }}>{dados.link || 'link afiliado aqui'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5 max-w- mx-auto">
          <button onClick={baixar} className="p-3.5 bg-black text-white rounded-2xl font-medium flex items-center justify-center gap-2 active:scale-95 transition"><Download size={18} />Baixar</button>
          <button onClick={copiar} className={`p-3.5 rounded-2xl font-medium flex items-center justify-center gap-2 active:scale-95 transition ${dark? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-white'}`}><Copy size={18} />Copiar</button>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&family=Poppins:wght@600;900&family=Oswald:wght@600;700&display=swap');`}</style>
    </div>
  )
}
