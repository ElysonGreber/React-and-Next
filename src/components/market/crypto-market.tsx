// components/CryptoTable.tsx
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { ApexOptions } from 'apexcharts'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

import { DocumentMagnifyingGlassIcon, FlagIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface CryptoData {
  img: string;
  digitalAsset: string;
  detail: string;
  price: string;
  change: string;
  volume: string;
  market: string;
  color: string;
  trend: number[]; // ✅ agora inclui trend
}
// Dados iniciais (fallback)
const INITIAL_DATA: CryptoData[] = [
  {
    img: "https://www.material-tailwind.com/logos/btc.png",
    digitalAsset: "BTC",
    detail: "Bitcoin",
    price: "$0.00",
    change: "—",
    volume: "—",
    market: "—",
    color: "text-gray-500",
    trend: [], // ✅ array vazio
  },
  {
    img: "https://www.material-tailwind.com/logos/eth.png",
    digitalAsset: "ETH",
    detail: "Ethereum",
    price: "$0.00",
    change: "—",
    volume: "—",
    market: "—",
    color: "text-gray-500",
    trend: [],
  },
  {
    img: "https://www.material-tailwind.com/logos/usdt.png",
    digitalAsset: "USDT",
    detail: "TetherUS",
    price: "$0.00",
    change: "—",
    volume: "—",
    market: "—",
    color: "text-gray-500",
    trend: [],
  },
  {
    img: "https://www.material-tailwind.com/logos/sol.png",
    digitalAsset: "SOL",
    detail: "Solana",
    price: "$0.00",
    change: "—",
    volume: "—",
    market: "—",
    color: "text-gray-500",
    trend: [],
  },
  {
    img: "https://www.material-tailwind.com/logos/xrp.png",
    digitalAsset: "XRP",
    detail: "Ripple",
    price: "$0.00",
    change: "—",
    volume: "—",
    market: "—",
    color: "text-gray-500",
    trend: [],
  },
];

const TABLE_HEAD = [
  { head: 'Digital Asset', className: 'text-left' },
  { head: 'Price', className: 'text-right' },
  { head: 'Change', className: 'text-right' },
  { head: 'Volume', className: 'text-right' },
  { head: 'Market Cap', className: 'text-right' },
  { head: 'Trend', className: 'text-right' },
  { head: 'Actions', className: 'text-right' },
]

// Gráfico simples (estático por enquanto)
function AreaChart({ 
  data, 
  color = "#2196F373" 
}: { 
  data: number[]; 
  color?: string 
}) {
  // Se não houver dados suficientes, não renderiza nada
  if (!data || data.length < 2) {
    return <div className="h-full w-full flex items-center justify-center text-gray-300">—</div>
  }

  const options: ApexOptions = {
    chart: {
      type: 'area',
      sparkline: { enabled: true },
      animations: { enabled: false },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    colors: [color],
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    xaxis: { labels: { show: false } },
    yaxis: { 
      labels: { show: false },
      min: Math.min(...data) * 0.99, // Ajusta escala para o mínimo real
      max: Math.max(...data) * 1.01, // Ajusta escala para o máximo real
    },
    grid: { show: false },
  }

  const series = [{  data }]

  return (
    <Chart
      options={options}
      series={series}
      type="area"
      height={48}
    />
  )
}
export default function CryptoTable() {
const [data, setData] = useState<CryptoData[]>(INITIAL_DATA);
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [timeRange, setTimeRange] = useState('24h')

  // Busca dados reais
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/crypto-prices')
        if (res.ok) {
          const prices = await res.json()
          setData(prices)
        }
      } catch (err) {
        console.error('Erro ao carregar preços:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 30_000) // Atualiza a cada 30s
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="p-6 pb-4">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Cryptocurrency Market Overview</h2>
            <p className="mt-1 text-sm text-gray-600">
              Compare different cryptocurrencies, and make informed investment.
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-wrap items-center gap-4 md:w-auto">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-10 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
              >
                {timeRange}
                <ChevronDownIcon className="h-3 w-3" />
              </button>

              {isOpen && (
                <div className="absolute right-0 z-10 mt-1 w-32 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  {['12h', '20h', '2h'].map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setTimeRange(range)
                        setIsOpen(false)
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200">
              {TABLE_HEAD.map(({ head, className }) => (
                <th
                  key={head}
                  className={`px-4 pb-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 ${className}`}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const isLast = index === data.length - 1
              const rowClass = isLast ? 'px-4 py-4' : 'px-4 py-4 border-b border-gray-200'

              return (
                <tr key={row.digitalAsset} className="hover:bg-gray-50">
                  <td className={`${rowClass} text-left`}>
                    <div className="flex items-center gap-4">
                      <img src={row.img} alt={row.digitalAsset} className="h-10 w-10 rounded-full" />
                      <div>
                        <div className="font-semibold text-gray-900">{row.digitalAsset}</div>
                        <div className="text-sm text-gray-600">{row.detail}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`${rowClass} text-right text-gray-600`}>{row.price}</td>
                  <td className={`${rowClass} text-right font-semibold ${row.color}`}>{row.change}</td>
                  <td className={`${rowClass} text-right text-gray-600`}>{row.volume}</td>
                  <td className={`${rowClass} text-right text-gray-600`}>{row.market}</td>
                  <td className={`${rowClass} text-right`}>
                    <div className="ml-auto h-12 max-w-[12rem] -translate-y-2">
                      <AreaChart
                        data={row.trend}
                        color={
                          row.color.includes('green') ? '#10B981' : row.color.includes('red') ? '#EF4444' : '#9CA3AF'
                        }
                      />
                    </div>
                  </td>
                  <td className={`${rowClass} text-right`}>
                    <div className="flex justify-end gap-2">
                      <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                        <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                      </button>
                      <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                        <FlagIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
