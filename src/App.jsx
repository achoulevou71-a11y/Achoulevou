import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'

export default function App() {
  const [loja, setLoja] = useState('amazon')
  const [titulo, setTitulo] = useState('ACHADO DO DIA')
  const [emoji, setEmoji] = useState('🔥')
  const [descricao, setDescricao] = useState('🚨 ACABOU DE SAIR DE: R$ 299,90 POR: R$ 149,90')
  const [link, setLink] = useState('https://amzn.to/4u7c0a6')
  const [de, setDe] = useState('299,90')
  const [por, setPor] = useState('269,50')
  const [img, setImg] = useState(null)
  const ref = useRef()

  const lojas = { amazon: '#FF9900', shopee: '#EE4D2D', shein: '#000', ml: '#FFE600', netshoes: '#532988', tiktok: '#000' }
  const cor = lojas[loja]
  const desc = de && por? Math.round(((parseFloat(de.replace(',','.')) - parseFloat(por.replace(',','.')))/parseFloat(de.replace(',','.')))*100) : 10

  const baixar = async () => {
    const canvas = await html2canvas(ref.current, { scale: 3, backgroundColor: '#fff' })
    const a = document.createElement('a')
    a.href = canvas.toDataURL()
    a.download = 'achado.png'
    a.click()
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-4">
        <h1 className="font-bold mb-3">Achou Levou - Editor</h1>

        <select value={loja} onChange={e => setLoja(e.target.value)} className="w-full p-2 border rounded mb-2">
          <option value="amazon">Amazon</option>
          <option value="shopee">Shopee</option>
          <option value="shein">Shein</option>
          <option value="ml">Mercado Livre</option>
        </select>

        <div className="grid grid-cols-3 gap-2 mb-2">
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título" className="col-span-2 p-2 border rounded text-sm" />
          <input value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="Emoji" className="p-2 border rounded text-center" />
        </div>

        <input value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição" className="w-full p-2 border rounded mb-2 text-sm" />
        <input value={link} onChange={e => setLink(e.target.value)} placeholder="Link afiliado" className="w-full p-2 border rounded mb-2 text-sm" />

        <div className="grid grid-cols-2 gap-2 mb-3">
          <input value={de} onChange={e => setDe(e.target.value)} placeholder="De R$" className="p-2 border rounded" />
          <input value={por} onChange={e => setPor(e.target.value)} placeholder="Por R$" className="p-2 border rounded" />
        </div>

        <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if(f){ const r=new FileReader(); r.onload=ev=>setImg(ev.target.result); r.readAsDataURL(f)} }} className="w-full text-sm mb-3" />

        {/* PREVIEW COM POSIÇÕES FIXAS */}
        <div className="flex justify-center">
          <div ref={ref} className="w-[340px] h-[420px] bg-white border rounded-xl p-3 relative" style={{ fontFamily: 'Arial' }}>
            {/* Topo */}
            <div className="flex justify-between mb-1">
              <div className="text-[10px] text-white px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: cor }}>AMAZON</div>
              <div className="text-[10px] text-white px-2 py-0.5 rounded-full bg-red-600 font-bold">-{desc}%</div>
            </div>

            {/* Título com emoji na direita */}
            <div className="flex justify-between items-center h-[28px] mb-1">
              <h2 className="font-black text-[22px] leading-none">{titulo}</h2>
              <span className="text-[22px]">{emoji}</span>
            </div>

            {/* Imagem - ALTURA FIXA 170px */}
            <div className="h-[170px] flex items-center justify-center mb-1 overflow-hidden">
              {img? <img src={img} className="max-h-full max-w-full object-contain" /> : <div className="text-gray-300 text-xs">Sem imagem</div>}
            </div>

            {/* Descrição - ALTURA FIXA 18px */}
            <div className="h-[18px] overflow-hidden mb-1">
              <p className="text-[11px] text-gray-700 leading-none truncate">{descricao}</p>
            </div>

            {/* Link pequeno da descrição - ALTURA FIXA 12px */}
            <div className="h-[12px] overflow-hidden mb-2">
              <p className="text-[9px] text-gray-500 leading-none truncate">{link} Use o cupom: ACHOU10</p>
            </div>

            {/* Preço - POSIÇÃO FIXA */}
            <div className="absolute left-0 right-0 top-[275px] flex justify-center">
              <div className="bg-black text-white px-5 py-2 rounded-xl text-center">
                <div className="text-[10px] opacity-70 leading-none">De R$ {de}</div>
                <div className="text-[22px] font-black leading-none">R$ {por}</div>
              </div>
            </div>

            {/* Link grande - POSIÇÃO FIXA embaixo */}
            <div className="absolute bottom-[28px] left-3 right-[70px]">
              <div className="text-[8px] font-bold text-gray-500 uppercase">Link de afiliado:</div>
              <div className="text-[11px] font-medium text-black leading-tight break-all">{link}</div>
            </div>

            {/* QR - POSIÇÃO FIXA */}
            <div className="absolute bottom-[28px] right-3 w-[50px] h-[50px] bg-white border">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(link)}`} className="w-full h-full" alt="qr" />
            </div>

            {/* Rodapé */}
            <div className="absolute bottom-1 left-0 right-0 text-center">
              <span className="text-[7px] text-gray-400">PUBLICIDADE • LINK DE AFILIADO</span>
            </div>
          </div>
        </div>

        <button onClick={baixar} className="w-full mt-4 bg-black text-white py-3 rounded-xl font-bold">BAIXAR IMAGEM</button>
      </div>
    </div>
  )
}
