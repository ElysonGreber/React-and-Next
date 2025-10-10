//workspaces/solgamereact/src/lib/useSolprice.ts
import { useEffect, useState } from 'react'

export function useSolPrice() {
  const [solPrice, setSolPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchSolPrice = async () => {
      try {
        setLoading(true)
        setError(null)

        // Usa CoinGecko para obter o preço do SOL em USD
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
          {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            next: { revalidate: 30 }, // Atualiza a cada 30s no server, mas no client usamos useEffect
          }
        )

        if (!res.ok) throw new Error('Failed to fetch SOL price')

        const data = await res.json()
        const price = data.solana?.usd

        if (isMounted && price !== undefined) {
          setSolPrice(price)
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load price')
          console.error('Erro ao buscar preço do SOL:', err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchSolPrice()

    // Atualiza a cada 30 segundos
    const interval = setInterval(() => {
      fetchSolPrice()
    }, 30_000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return { solPrice, loading, error }
}