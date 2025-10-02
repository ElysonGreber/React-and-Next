import { PublicKey } from '@solana/web3.js'
import { useConnection } from '@solana/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

const FIXED_PUBLIC_KEY = new PublicKey('DEr8Y8GG19SSXHBDMcFVvxwrcZxFcihsm3CrQZtkrkbH')

export function useFixedBalance() {
  const { connection } = useConnection()
  return useQuery({
    queryKey: ['get-balance', FIXED_PUBLIC_KEY.toBase58()],
    queryFn: async () => {
      const balance = await connection.getBalance(FIXED_PUBLIC_KEY)
      return balance / LAMPORTS_PER_SOL // retorna em SOL
    },
  })
}
