import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useUserProfile() {
  const wallet = useWallet()
  const [nickname, setNickname] = useState<string | null>(null)
  const [titulo, setTitulo] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchUserProfile = useCallback(async () => {
    if (!wallet.publicKey) {
      setNickname(null)
      setTitulo(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const pubkey = wallet.publicKey.toBase58()
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname, titulo')
        .eq('wallet', pubkey)
        .single()

      if (error) {
        console.error('Erro ao buscar perfil:', error)
        setNickname(null)
        setTitulo(null)
      } else if (data) {
        setNickname(data.nickname)
        setTitulo(data.titulo)
      }
    } catch (err) {
      console.error('Erro geral ao buscar perfil:', err)
      setNickname(null)
      setTitulo(null)
    } finally {
      setLoading(false)
    }
  }, [wallet.publicKey])

  useEffect(() => {
    if (wallet.connected) {
      fetchUserProfile()
    } else {
      // Reseta os dados se desconectar
      setNickname(null)
      setTitulo(null)
      setLoading(false)
    }
  }, [wallet.connected, fetchUserProfile])
const nick2 = nickname
const tt2 = titulo
  return { nick2, tt2, loading }
}