import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { Download, Copy, LogOut, Moon, Sun } from 'lucide-react'

export default function App() {
  const [login, setLogin] = useState(localStorage.getItem('al') === '1')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [loja, setLoja] = useState('amazon')
  const [link, setLink] = useState('')
  const [preco, setPreco] = useState('')
  const [de, setDe] = useState('')
  const [dark, setDark] = useState(false)
  const ref = useRef()

  const lojas = { amazon:'#FF9900', shopee:'#EE4D2D', shein:'#000', ml:'#FFE600', netshoes:'#532988', tiktok:'#00F2EA' }
  const desc = de && preco? Math.round(((de-preco)/de)*100) : 0

  const baixar = async () => {
    const canvas = await html2canvas(ref.current, { scale: 3, backgroundColor: '#fff' })
    const a = document.createElement('a')
    a.href = canvas.toDataURL()
    a.download = `achado-${Date.now()}.png`
    a.click()
  }

  const copiar = async () => {
    const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: '#fff' })
    canvas.toBlob(async b => {
      try {
        await navigator.clipboard.write([new ClipboardItem({'image/png': b})])
        alert('Imagem copiada!')
      } catch { baixar() }
    })
  }

  if (!login) return (
    <div className="min-h-screen bg-black grid place-items-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
        <h1 className="text-3xl font-black text-center mb-6">Achou Levou</h1>
        <input value={user} onChange={e=>setUser(e.target.value)} placeholder="Usuário" className="w-full p-3 border rounded-xl mb-3" />
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Senha" className="w-full p-3 border rounded-xl mb-4" />
        <button onClick={()=>{if(user==='admin'&&pass==='123456'){setLogin(true);localStorage.setItem('al','1')}}} className="w-full p-3 bg-black text-white rounded-xl font-bold">Entrar</button>
        <p className="text-xs text-center mt-4 opacity-50">admin / 123456</p>
      </div>
    </div>
  )

  return (
    <div className={dark?'dark bg-black text-white min-h-screen':'bg-gray-50 min-h-screen'}>
      <header className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur border-b p-3 flex justify-between">
        <b>Achou Levou</b>
        <div className="flex gap-2">
          <button onClick={()=>setDark(!dark)} className="p-2">{dark?<Sun size={18}/>:<Moon size={18}/>}</button>
          <button onClick={()=>{setLogin(false);localStorage.removeItem('al')}} className="p-2"><LogOut size={18}/></button>
        </div>
      </header>

      <div className="p-3 max-w-lg mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Object.keys(lojas).map(l => (
            <button key={l} onClick={()=>setLoja(l)} className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${loja===l?'text-white':'bg-white dark:bg-zinc-800'}`} style={{backgroundColor:loja===l?lojas[l]:'', color:loja===l?(l==='ml'?'#000':'#fff'):''}}>{l}</button>
          ))}
        </div>

        <input value={link} onChange={e=>setLink(e.target.value)} placeholder="Link de afiliado" className="w-full mt-3 p-3 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <input value={de} onChange={e=>setDe(e.target.value)} placeholder="De R$" type="number" className="p-3 rounded-xl border dark:bg-zinc-900" />
          <input value={preco} onChange={e=>setPreco(e.target.value)} placeholder="Por R$" type="number" className="p-3 rounded-xl border dark:bg-zinc-900" />
        </div>

        <div ref={ref} className="w-full aspect-[4/5] bg-white rounded-3xl mt-4 p-6 flex flex-col shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{background:`linear-gradient(135deg, ${lojas[loja]}, transparent)`}}/>
          {desc>0 && <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">-{desc}%</div>}
          <div className="px-3 py-1 rounded-full text-white text-xs font-bold w-fit z-10" style={{backgroundColor:lojas[loja]}}>{loja.toUpperCase()}</div>
          <div className="mt-auto z-10">
            <h2 className="text-4xl font-black leading-none">ACHADO<br/>DO DIA</h2>
            {preco && <div className="mt-4 bg-black text-white p-4 rounded-2xl"><p className="text-xs line-through opacity-60">R$ {de}</p><p className="text-3xl font-black">R$ {preco}</p></div>}
            <div className="mt-3 text-xs opacity-60 truncate">{link || 'seu link aqui'}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pb-20">
          <button onClick={baixar} className="p-3 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-bold flex flex-col items-center gap-1 text-xs"><Download size={20}/>Baixar</button>
          <button onClick={copiar} className="p-3 bg-zinc-900 text-white rounded-2xl font-bold flex flex-col items-center gap-1 text-xs"><Copy size={20}/>Copiar</button>
        </div>
      </div>
    </div>
  )
}
