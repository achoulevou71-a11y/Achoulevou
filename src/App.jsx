import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { Download, Copy, LogOut, Moon, Sun, Upload, Palette, Type, ArrowLeft, Settings, Globe } from 'lucide-react'

export default function App() {
  const [login, setLogin] = useState(localStorage.getItem('al') === '1')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [dark, setDark] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  // Dados do produto
  const [loja, setLoja] = useState('amazon')
  const [link, setLink] = useState('')
  const [preco, setPreco] = useState('')
  const [de, setDe] = useState('')
  const [titulo, setTitulo] = useState('ACHADO DO DIA')
  const [descricao, setDescricao] = useState('')
  const [imagem, setImagem] = useState(null)

  // Customização
  const [corFundo, setCorFundo] = useState('#ffffff')
  const [corTexto, setCorTexto] = useState('#000000')
  const [corPreco, setCorPreco] = useState('#000000')
  const [fonte, setFonte] = useState('inter')
  const [tamanhoTitulo, setTamanhoTitulo] = useState(36)

  // Redes sociais
  const [redeSocial, setRedeSocial] = useState('')

  const ref = useRef()
  const fileInputRef = useRef()

  const lojas = {
    amazon: { nome: 'Amazon', cor: '#FF9900' },
    shopee: { nome: 'Shopee', cor: '#EE4D2D' },
    shein: { nome: 'Shein', cor: '#000000' },
    ml: { nome: 'Mercado Livre', cor: '#FFE600', texto: '#000' },
    netshoes: { nome: 'Netshoes', cor: '#532988' },
    tiktok: { nome: 'TikTok Shop', cor: '#000000' }
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
    inter: 'Inter, system-ui, sans-serif',
    poppins: "'Poppins', sans-serif",
    oswald: "'Oswald', sans-serif"
  }

  const desc = de && preco? Math.round(((parseFloat(de) - parseFloat(preco)) / parseFloat(de)) * 100) : 0

  const formatarPreco = (valor) => {
    if (!valor) return ''
    const num = parseFloat(valor.replace(',', '.'))
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const handleLojaChange = (novaLoja) => {
    setLoja(novaLoja)
    setLink('') // Limpa link ao trocar loja
  }

  const handleImagem = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setImagem(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const baixar = async () => {
    const canvas = await html2canvas(ref.current, {
      scale: 3,
      backgroundColor: corFundo,
      useCORS: true
    })
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `achado-${loja}-${Date.now()}.png`
    a.click()
  }

  const copiar = async () => {
    const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: corFundo, useCORS: true })
    canvas.toBlob(async (b) => {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })])
        alert('✅ Imagem copiada!')
      } catch { baixar() }
    })
  }

  if (!login) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-white rounded- p-8 w-full max-w-sm shadow-2xl">
        <h1 className="text-3xl font-black text-center mb-2" style={{ fontFamily: fontes.oswald }}>ACHOU LEVOU</h1>
        <p className="text-center text-sm text-zinc-500 mb-6">Gerador de Ofertas v2</p>
        <input
          value={user}
          onChange={e => setUser(e.target.value)}
          placeholder="Usuário"
          className="w-full p-3.5 border border-zinc-200 rounded-2xl mb-3 text- focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          placeholder="Senha"
          className="w-full p-3.5 border border-zinc-200 rounded-2xl mb-5 text- focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          onClick={() => { if (user === 'admin' && pass === '123456') { setLogin(true); localStorage.setItem('al', '1') } else { alert('Usuário ou senha incorretos') } }}
          className="w-full p-3.5 bg-black text-white rounded-2xl font-semibold hover:bg-zinc-800 transition"
        >
          Entrar
        </button>
        <p className="text-xs text-center mt-4 text-zinc-400">admin / 123456</p>
      </div>
    </div>
  )

  if (showConfig) return (
    <div className={`min-h-screen ${dark? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      <header className={`sticky top-0 z-50 ${dark? 'bg-zinc-950/90' : 'bg-white/90'} backdrop-blur-xl border-b ${dark? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 p-4 max-w-lg mx-auto">
          <button onClick={() => setShowConfig(false)} className={`p-2 rounded-xl ${dark? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-semibold">Configurações</h1>
        </div>
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        <div className={`p-4 rounded-2xl ${dark? 'bg-zinc-900' : 'bg-white'} border ${dark? 'border-zinc-800' : 'border-zinc-200'}`}>
          <div className="flex items-center gap-3 mb-2">
            <Globe size={18} className="opacity-60" />
            <span className="font-medium">Idioma</span>
          </div>
          <p className="text-sm opacity-60">Português (Brasil) - pt-BR</p>
        </div>

        <div className={`p-4 rounded-2xl ${dark? 'bg-zinc-900' : 'bg-white'} border ${dark? 'border-zinc-800' : 'border-zinc-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {dark? <Moon size={18} className="opacity-60" /> : <Sun size={18} className="opacity-60" />}
              <span className="font-medium">Tema</span>
            </div>
            <button
              onClick={() => setDark(!dark)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${dark? 'bg-zinc-800' : 'bg-zinc-100'}`}
            >
              {dark? 'Escuro' : 'Claro'}
            </button>
          </div>
        </div>

        <button
          onClick={() => { setLogin(false); localStorage.removeItem('al'); setShowConfig(false) }}
          className="w-full p-4 bg-red-500 text-white rounded-2xl font-medium hover:bg-red-600 transition"
        >
          Sair da conta
        </button>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen ${dark? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`} style={{ fontFamily: fontes.inter }}>
      {/* HEADER FIXO - SEM FAIXA PRETA */}
      <header className={`sticky top-0 z-40 ${dark? 'bg-zinc-950' : 'bg-white'} border-b ${dark? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center justify-between p-4 max-w-lg mx-auto">
          <h1 className="text- font-semibold tracking-tight">Achou Levou</h1>
          <div className="flex items-center gap-1">
            <button onClick={() => setDark(!dark)} className={`p-2.5 rounded-xl transition ${dark? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
              {dark? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setShowConfig(true)} className={`p-2.5 rounded-xl transition ${dark? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
              <Settings size={18} />
            </button>
            <button onClick={() => { setLogin(false); localStorage.removeItem('al') }} className={`p-2.5 rounded-xl transition ${dark? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-lg mx-auto pb-28">
        {/* LOJAS */}
        <div>
          <p className="text- font-medium opacity-60 mb-2 px-1">Loja afiliada</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {Object.entries(lojas).map(([key, l]) => (
              <button
                key={key}
                onClick={() => handleLojaChange(key)}
                className={`px-4 py-2 rounded-full text- font-medium whitespace-nowrap transition-all border ${
                  loja === key
                   ? 'text-white border-transparent shadow-md scale-105'
                    : dark? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
                style={{ backgroundColor: loja === key? l.cor : '', color: loja === key? (l.texto || '#fff') : '' }}
              >
                {l.nome}
              </button>
            ))}
          </div>
        </div>

        {/* REDES SOCIAIS - SEPARADO */}
        <div className="mt-4">
          <p className="text- font-medium opacity-60 mb-2 px-1">Compartilhar em</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {Object.entries(redes).map(([key, r]) => (
              <button
                key={key}
                onClick={() => setRedeSocial(redeSocial === key? '' : key)}
                className={`px-3.5 py-2 rounded-full text- font-medium whitespace-nowrap transition-all border ${
                  redeSocial === key
                   ? 'text-white border-transparent'
                    : dark? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-white border-zinc-200 text-zinc-500'
                }`}
                style={{ backgroundColor: redeSocial === key? r.cor : '' }}
              >
                {r.nome}
              </button>
            ))}
          </div>
        </div>

        {/* INPUTS - CONTRASTE CORRIGIDO */}
        <div className="mt-5 space-y-3">
          <input
            value={link}
            onChange={e => setLink(e.target.value)}
            placeholder={`Link de afiliado ${lojas[loja].nome}`}
            className={`w-full p-3.5 rounded-2xl border text- transition focus:outline-none focus:ring-2 focus:ring-black/20 ${
              dark? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'
            }`}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text- opacity-60 px-1">De</label>
              <input
                value={de}
                onChange={e => setDe(e.target.value.replace(',', '.'))}
                placeholder="0,00"
                type="text"
                inputMode="decimal"
                className={`w-full p-3.5 rounded-2xl border text- mt-1 transition focus:outline-none focus:ring-2 focus:ring-black/20 ${
                  dark? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'
                }`}
              />
            </div>
            <div>
              <label className="text- opacity-60 px-1">Por</label>
              <input
                value={preco}
                onChange={e => setPreco(e.target.value.replace(',', '.'))}
                placeholder="0,00"
                type="text"
                inputMode="decimal"
                className={`w-full p-3.5 rounded-2xl border text- mt-1 transition focus:outline-none focus:ring-2 focus:ring-black/20 ${
                  dark? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'
                }`}
              />
            </div>
          </div>

          <input
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            placeholder="Título (ex: ACHADO DO DIA)"
            className={`w-full p-3.5 rounded-2xl border text- transition focus:outline-none focus:ring-2 focus:ring-black/20 ${
              dark? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'
            }`}
          />

          <textarea
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            placeholder="Descrição do produto (opcional)"
            rows={2}
            className={`w-full p-3.5 rounded-2xl border text- resize-none transition focus:outline-none focus:ring-2 focus:ring-black/20 ${
              dark? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'
            }`}
          />
        </div>

        {/* CUSTOMIZAÇÃO */}
        <div className={`mt-5 p-4 rounded-2xl border ${dark? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Palette size={16} className="opacity-60" />
            <span className="text- font-medium">Personalizar</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text- opacity-60">Fundo</label>
              <input type="color" value={corFundo} onChange={e => setCorFundo(e.target.value)} className="w-full h-9 rounded-lg cursor-pointer mt-1" />
            </div>
            <div>
              <label className="text- opacity-60">Texto</label>
              <input type="color" value={corTexto} onChange={e => setCorTexto(e.target.value)} className="w-full h-9 rounded-lg cursor-pointer mt-1" />
            </div>
            <div>
              <label className="text- opacity-60">Preço</label>
              <input type="color" value={corPreco} onChange={e => setCorPreco(e.target.value)} className="w-full h-9 rounded-lg cursor-pointer mt-1" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Type size={16} className="opacity-60" />
            <select value={fonte} onChange={e => setFonte(e.target.value)} className={`flex-1 p-2 rounded-lg text- border ${dark? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
              <option value="inter">Inter</option>
              <option value="poppins">Poppins</option>
              <option value="oswald">Oswald</option>
            </select>
            <input type="range" min="24" max="48" value={tamanhoTitulo} onChange={e => setTamanhoTitulo(e.target.value)} className="w-20" />
          </div>
        </div>

        {/* UPLOAD IMAGEM */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`w-full mt-3 p-3.5 rounded-2xl border-2 border-dashed transition flex items-center justify-center gap-2 text- font-medium ${
            dark? 'border-zinc-700 hover:bg-zinc-900 text-zinc-400' : 'border-zinc-300 hover:bg-zinc-50 text-zinc-600'
          }`}
        >
          <Upload size={16} />
          {imagem? 'Trocar imagem do produto' : 'Adicionar imagem do produto'}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImagem} className="hidden" />

        {/* PREVIEW DO CARD */}
        <div className="mt-5">
          <p className="text- font-medium opacity-60 mb-2 px-1">Preview</p>
          <div
            ref={ref}
            className="w-full aspect-[4/5] rounded- p-7 flex flex-col relative overflow-hidden shadow-xl"
            style={{ backgroundColor: corFundo, fontFamily: fontes[fonte], color: corTexto }}
          >
            {/* Gradiente da loja */}
            <div className="absolute inset-0 opacity-[0.08]" style={{ background: `linear-gradient(135deg, ${lojas[loja].cor}, transparent 60%)` }} />

            {/* Badge loja */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="px-3 py-1.5 rounded-full text-white text- font-bold tracking-wide" style={{ backgroundColor: lojas[loja].cor, color: lojas[loja].texto || '#fff' }}>
                {lojas[loja].nome.toUpperCase()}
              </div>
              {desc > 0 && (
                <div className="bg-red-600 text-white px-3 py-1 rounded-full text- font-bold">
                  -{desc}%
                </div>
              )}
            </div>

            {/* Imagem do produto */}
            {imagem && (
              <div className="relative z-10 mt-4 mb-3 flex-1 flex items-center justify-center">
                <img src={imagem} alt="Produto" className="max-h-[45%] max-w-full object-contain rounded-2xl" />
              </div>
            )}

            {/* Conteúdo */}
            <div className="relative z-10 mt-auto">
              <h2 className="font-black leading-[0.9] tracking-tighter" style={{ fontSize: `${tamanhoTitulo}px`, color: corTexto }}>
                {titulo.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h2>

              {descricao && (
                <p className="mt-2 text- opacity-70 line-clamp-2">{descricao}</p>
              )}

              {preco && (
                <div className="mt-4 inline-block" style={{ backgroundColor: corPreco, color: corFundo }}>
                  <div className="px-4 py-3 rounded-2xl">
                    {de && <p className="text- line-through opacity-60">R$ {formatarPreco(de)}</p>}
                    <p className="text- font-black leading-none tracking-tight">R$ {formatarPreco(preco)}</p>
                  </div>
                </div>
              )}

              {/* Link - AGORA VISÍVEL NO DARK */}
              <div className="mt-3 flex items-center gap-2">
                {redeSocial && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text- text-white" style={{ backgroundColor: redes[redeSocial].cor }}>
                    {redes[redeSocial].nome[0]}
                  </div>
                )}
                <p className="text- opacity-50 truncate flex-1" style={{ color: corTexto }}>
                  {link || 'seu-link-de-afiliado'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <button onClick={baixar} className="p-4 bg-black text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition active:scale-[0.98]">
            <Download size={18} />
            Baixar PNG
          </button>
          <button onClick={copiar} className={`p-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98] ${dark? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}>
            <Copy size={18} />
            Copiar
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Poppins:wght@600;700;900&family=Oswald:wght@600;700&display=swap');
       .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
       .scrollbar-hide::-webkit-scrollbar { display: none; }
       .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  )
}
