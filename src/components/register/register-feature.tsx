'use client'
// src/pages/createperfil.tsx
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useWallet } from '@solana/wallet-adapter-react'
import  BentoGrid  from '@/components/market/market-feature'
export default function CreatePerfilPage() {
  const wallet = useWallet()
  const [nickname, setNickname] = useState('')
  const [name, setName] = useState('')
  const [titulo, setTitulo] = useState('Hater')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)

  // 🚨 aqui você deve integrar sua carteira real
  const walletConnected = wallet.connected
  const walletPublicKey = wallet.publicKey?.toBase58() || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!walletConnected) {
      alert('Conecte sua carteira antes de criar o perfil!')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('profiles').upsert(
      {
        wallet: walletPublicKey,
        nickname,
        name,
        titulo,
        email,
        mensagem,
      },
      { onConflict: 'wallet' },
    )

    setLoading(false)

    if (error) {
      console.error('Erro ao salvar no Supabase:', error)
      alert('Erro ao salvar perfil.')
    } else {
      alert('Perfil criado/atualizado com sucesso!')
      setNickname('')
      setName('')
      setEmail('')
      setMensagem('')
      setTitulo('Hater')
    }
  }

  if (!walletConnected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Você precisa conectar sua carteira para criar um perfil.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-10 bg-[#0a0a0a]">
      <div className="bg-[#1b1b1b] text-AmberSolana-300 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Criar Perfil</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-lg p-2 bg-[#2a2a2a] text-AmberSolana-300 focus:outline-none focus:ring-2 focus:ring-AmberSolana-300"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg p-2 bg-[#2a2a2a] text-AmberSolana-300 focus:outline-none focus:ring-2 focus:ring-AmberSolana-300"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Título</label>
            <select
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full rounded-lg p-2 bg-[#2a2a2a] text-AmberSolana-300 focus:outline-none focus:ring-2 focus:ring-AmberSolana-300"
            >
              <option>Hater</option>
              <option>Hander</option>
              <option>Lover</option>
              <option>Mutant</option>
              <option>Zombie</option>
              <option>Flower</option>
              <option>CEO</option>
              <option>Junk</option>
              <option>Poor</option>
              <option>Rich</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg p-2 bg-[#2a2a2a] text-AmberSolana-300 focus:outline-none focus:ring-2 focus:ring-AmberSolana-300"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Mensagem (até 120 caracteres)</label>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              maxLength={120}
              className="w-full rounded-lg p-2 bg-[#2a2a2a] text-AmberSolana-300 focus:outline-none focus:ring-2 focus:ring-AmberSolana-300"
            />
            <p className="text-sm text-gray-400">{mensagem.length}/120 caracteres</p>
          </div>
          <div>
            <label className="block mb-1 font-medium">Wallet</label>
            <input
              type="text"
              value={walletPublicKey}
              readOnly
              className="w-full rounded-lg p-2 bg-[#2a2a2a] text-AmberSolana-300 opacity-70"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-AmberSolana-300 text-black py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? 'Salvando...' : 'Criar Perfil'}
          </button>
        </form>
      </div>
      
    </div>
  
  )
}
