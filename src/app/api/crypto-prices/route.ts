// app/api/crypto-prices/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const ids = 'bitcoin,ethereum,tether,solana,xrp'
    // ⬇️ Adicione `sparkline=true`
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 30 },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: response.status })
    }

    const coins = await response.json()

    const formattedData = coins.map((coin: any) => {
      // Extrai o sparkline (array de preços dos últimos 7 dias)
      const sparkline = coin.sparkline_in_7d?.price || []
      
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
        trend: sparkline, // ✅ Dados reais de 7 dias
      }
    })

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}