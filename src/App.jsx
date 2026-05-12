import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { Download, Copy, LogOut, Moon, Sun } from 'lucide-react'

export default function App() {
  const [login, setLogin] = useState(localStorage.getItem('al') === '1')
  const [user, setUser] = useState('')https://github.com/achoulevou71-a11y/Achoulevou/tree/main
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
    const canvas = await html2canvas(ref.current, { scale: 3, backgroundColor: '#fff
