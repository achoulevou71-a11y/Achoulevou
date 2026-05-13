import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { Download, Copy, LogOut, Moon, Sun, Upload, Trash2, Settings, ArrowLeft, QrCode, ExternalLink } from 'lucide-react'

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
  const setD = (k, v) => setDadosLojas(p => ({...p, [loja]: {...p[loja], [k]: v}}))

  const lojas = {
    amazon: { nome: 'Amazon', cor: '#FF9900' },
    shopee: { nome: 'Shopee', cor: '#EE4D2D' },
    shein: { nome: 'Shein', cor: '#000' },
    ml: { nome: 'Mercado Livre', cor: '#FFE600', txt: '#000' },
    netshoes: { nome: 'Netshoes', cor: '#532988' },
    tiktok: { nome: 'TikTok Shop', cor: '#000' }
  }

  const parse = v => v? parseInt(v.replace(/\D/g,''))/100 : 0
  const fmt = v => v? parse(v).toLocaleString('pt-BR', {minimumFractionDigits:2}) : ''
  const fmtIn = v => { const n=v.replace(/\D/g,''); return n? (parseInt(n)/100).toFixed(2).replace('.',',') : '' }

  const descAuto = dados.de && dados.preco? Math.round(((parse(dados.de)-parse(dados.preco))/parse(dados.de))*100) : 0
  const desc = dados.percManual!== null? dados.percManual : descAuto

  const handleImg
