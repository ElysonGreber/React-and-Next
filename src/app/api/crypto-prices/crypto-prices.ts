// app/api/crypto-prices/route.ts
import { NextRequest, NextResponse } from 'next/server'

const CRYPTO_IDS = ['bitcoin', 'ethereum', 'tether', 'solana', 'ripple'] as const

// Mapeia ID → símbolo
const ID_TO_SYMBOL: Record<string, string> = {
  bitcoin: 'btc',
  ethereum: 'eth',
  tether: 'usdt',
  solana: 'sol',
  ripple: 'xrp',
}

export async function GET(request: NextRequest) {
  try {
    // 1. Busca dados básicos (preço, volume, etc.)
    const ids = CRYPTO_IDS.join(',')
    const basicDataUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`

    const basicRes = await fetch(basicDataUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 30 },
    })

    if (!basicRes.ok) throw new Error('Failed to fetch basic data')
    const basicData = await basicRes.json()

    // 2. Busca dados históricos para cada moeda (últimas 24h)
    const historicalDataPromises = CRYPTO_IDS.map(async (id) => {
      // CoinGecko usa "hours" para 1-90 dias
      const days = 1 // últimos 24h
      const chartUrl = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=hourly`

      const res = await fetch(chartUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 300 }, // Revalida a cada 5min
      })

      if (!res.ok) return { id, prices: [] }
      const data = await res.json()
      return { id, prices: data.prices || [] }
    })

    const historicalResults = await Promise.all(historicalDataPromises)
    const historicalMap = new Map(
      historicalResults.map(({ id, prices }) => [id, prices])
    )

    // 3. Combina os dados
    const formattedData = basicData.map((coin: any) => {
      const id = coin.id
      const prices = historicalMap.get(id) || []
      
      // Extrai apenas os valores de preço (remove timestamps)
      const priceValues = prices.map((p: [number, number]) => p[1])

      return {
        img: coin.image,
        digitalAsset: coin.symbol.toUpperCase(),
        detail: coin.name,
        price: `$${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: coin.price_change_percentage_24h != null
          ? `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%`
          : '—',
        volume: `$${(coin.total_volume / 1e9).toFixed(2)}B`,
        market: `$${(coin.market_cap / 1e9).toFixed(2)}B`,
        color: coin.price_change_percentage_24h != null
          ? (coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-500')
          : 'text-gray-500',
        trend: priceValues, // ✅ Dados reais do gráfico
      }
    })

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}