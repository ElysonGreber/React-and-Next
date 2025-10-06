'use client'
import FooterChat from "./ui/footer-chat-props"
import { supabase } from '@/lib/supabaseClient'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'

export function AppFooter() {
  const wallet = useWallet()
  const [nickname, setNickname] = useState<string>('Guest')

  useEffect(() => {
    const fetchNickname = async () => {
      if (wallet.publicKey) {
        const pubkey = wallet.publicKey.toBase58()
        const { data } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('wallet', pubkey)
          .single()
        if (data?.nickname) setNickname(data.nickname)
        else setNickname('Guest')
      } else {
        setNickname('Guest')
      }
    }
    fetchNickname()
  }, [wallet.publicKey])

  return (
    <footer className="fixed bottom-0 w-full pointer-events-auto">
      <div className="max-w-5xl mx-auto relative">
        <FooterChat
          wsUrl="wss://free.blr2.piesocket.com/v3/1?api_key=FthGrqSUSjYW54oPQjVWp0YwtltqeJDN7cdynDQm&notify_self=1"
          nickname={nickname}
          walletAddress={wallet.publicKey?.toBase58() || ''}
        />
      </div>
    </footer>
  )
}