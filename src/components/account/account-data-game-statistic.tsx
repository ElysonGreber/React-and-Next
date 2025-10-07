'use client'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { readPda } from '@/lib/solanaHelper'
import clsx from 'clsx'
import { supabase } from '@/lib/supabaseClient'
import { MicahAvatar } from '../ui/micah-avatar'
import { Table, TableBody, TableCell, TableHeader, TableRow, TableRow as TableRowHeader } from '@/components/ui/table'
import * as d3 from 'd3'

interface HistoryRecord {
  player: number
  program: number
  result: number
}

const MARGIN = { top: 5, right: 15, bottom: 5, left: 0 }

interface LollipopProps {
  height: number
  data: { name: string; value: number }[]
}

const Lollipop = ({ height, data }: LollipopProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(300)

  useEffect(() => {
    if (!containerRef.current) return
    const handleResize = () => setWidth(containerRef.current!.offsetWidth)
    handleResize()
    const observer = new ResizeObserver(handleResize)
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const boundsWidth = width - MARGIN.left - MARGIN.right
  const boundsHeight = height - MARGIN.top - MARGIN.bottom

  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, boundsHeight])
    .padding(0.4)

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value) || 1])
    .range([0, boundsWidth])

  const colors = ['#f87171', '#60a5fa', '#34d399'] // vermelho, azul, verde

  return (
    <div ref={containerRef} className="w-full">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMinYMin meet">
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* Grid */}
          {xScale.ticks(5).map((tickValue, i) => (
            <g key={i}>
              <line x1={xScale(tickValue)} x2={xScale(tickValue)} y1={0} y2={boundsHeight} stroke="#fff" opacity={0.2} />
              <text x={xScale(tickValue)} y={boundsHeight + 12} fill="#fff" textAnchor="middle" fontSize={10}>
                {tickValue}
              </text>
            </g>
          ))}

          {/* Lollipops */}
          {data.map((d, i) => {
            const y = yScale(d.name)! + yScale.bandwidth() / 2
            return (
              <g key={i}>
                <line x1={0} x2={xScale(d.value)} y1={y} y2={y} stroke="#888" strokeWidth={3} />

                {/* Nome da escolha acima da linha */}
                <text
                  x={xScale(d.value) / 2}
                  y={y - 10}
                  fill="#fff"
                  fontSize={12}
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {d.name}
                </text>

                {/* Círculo com valor dentro */}
                <circle cx={xScale(d.value)} cy={y} r={12} fill={colors[i]} />
                <text
                  x={xScale(d.value)}
                  y={y + 1}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="#fff"
                  fontSize={12}
                  fontWeight="bold"
                >
                  {d.value}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

export default function AccountStatistics() {
  const [nickname, setNickname] = useState<string | null>(null)
  const [walletAddr, setWalletAddr] = useState<string | null>(null)
  const [titulo, setTitulo] = useState<string | null>(null)
  const wallet = useWallet()
  const [credits, setCredits] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const sortedHistory = [...history].reverse()
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentHistory = sortedHistory.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage)

  const colorMap = ['text-red-500', 'text-gray-300', 'text-green-500']
  const textR = ['Loss', 'Draw', 'Won']

  // --- Fetch Game Data ---
  const fetchGameData = useCallback(async () => {
    if (wallet.publicKey) {
      try {
        const data = await readPda(wallet.publicKey)
        setCredits(data.credits)
        setScore(data.score)
        setHistory(data.history)
      } catch (err) {
        console.error('Erro lendo PDA:', err)
      }
    }
  }, [wallet.publicKey])

  const renderResult = (result: number) => <p className={clsx(colorMap[result])}>{textR[result]}</p>

  // --- Fetch User Profile ---
  const fetchUserProfile = useCallback(async () => {
    if (wallet.publicKey) {
      try {
        const pubkey = wallet.publicKey.toBase58()
        const { data, error } = await supabase
          .from('profiles')
          .select('nickname, wallet, titulo')
          .eq('wallet', pubkey)
          .single()
        if (error) {
          console.error('Erro ao buscar perfil:', error)
          return
        }
        if (data) {
          setNickname(data.nickname)
          setWalletAddr(data.wallet)
          setTitulo(data.titulo)
        }
      } catch (err) {
        console.error('Erro geral ao buscar perfil:', err)
      }
    }
  }, [wallet.publicKey])

  useEffect(() => {
    if (wallet.connected) {
      fetchUserProfile()
      fetchGameData()
    }
  }, [wallet.connected, fetchUserProfile, fetchGameData])

  const formatWallet = () => {
    if (!walletAddr) return ''
    if (window.innerWidth <= 900) {
      return walletAddr.slice(0, 4) + '....' + walletAddr.slice(-4)
    }
    return walletAddr
  }

  // --- Estatísticas ---
  const choices = ['Rock', 'Paper', 'Scissors']

  const choiceCounts = useMemo(() => {
    const counts = [0, 0, 0]
    history.forEach((h) => counts[h.player]++)
    return counts
  }, [history])

  const winCounts = useMemo(() => {
    const wins = [0, 0, 0]
    history.forEach((h) => {
      if (h.result === 2) wins[h.player]++
    })
    return wins
  }, [history])

  return (
    <div className="space-y-4">
      {/* Perfil */}
      <div className="text-center font-bold mb-2">
        {nickname ? (
          <div className="flex w-full bg-[#1b1b1b] bgpatternB">
            <div className="flex gap-1.5 justify-center items-center mb-0 -mt-4">
              <div className="w-auto h-auto bgsqr">
                <MicahAvatar seed={walletAddr || nickname || 'default'} size={100} />
              </div>
              <div>
                <p className="ggradgreen text-left mb-2 mt-auto text-xl sm:text-3xl">
                  {nickname} The {titulo}
                </p>
                <p className="text-left text-sm text-VerdeSolana-100">{formatWallet()}</p>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading</p>
        )}
      </div>

      {/* Tabela + gráficos */}
      <h2 className="text-2xl font-bold">Play History</h2>
      <div className="bg-[#222222] rounded-xl shadow p-4">
        <div className="grid gap-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Tabela */}
            <div className="md:col-span-2 min-h-[450px] max-h-[450px] overflow-x-auto">
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRowHeader>
                    <TableCell className="px-3 py-2 text-left">#</TableCell>
                    <TableCell className="px-3 py-2 text-right">You</TableCell>
                    <TableCell className="px-3 py-2 text-right">Program</TableCell>
                    <TableCell className="px-3 py-2 text-right"></TableCell>
                    <TableCell className="px-3 py-2 text-right">Result</TableCell>
                  </TableRowHeader>
                </TableHeader>
                <TableBody>
                  {currentHistory.map((h, i) => (
                    <TableRow key={i} className="text-center">
                      <TableCell className="px-3 py-2 text-left">{indexOfFirst + i + 1}</TableCell>
                      <TableCell className="px-3 py-2 text-right">{choices[h.player]}</TableCell>
                      <TableCell className="px-3 py-2 text-right">{choices[h.program]}</TableCell>
                      <TableCell></TableCell>
                      <TableCell className="px-3 py-2 text-right">{renderResult(h.result)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Gráficos */}
            <div className="md:col-span-1 h-full">
              <div className="grid grid-rows-2 gap-1 h-full">
                <div className="p-2 rounded-lg bg-[#1b1b1b]">
                  <h3 className="text-lg font-bold text-white mb-2">Player Choices</h3>
                  <Lollipop height={180} data={choices.map((c, i) => ({ name: c, value: choiceCounts[i] }))} />
                </div>

                <div className="p-2 rounded-lg bg-[#1b1b1b]">
                  <h3 className="text-lg font-bold text-white mb-2">Wins by Choice</h3>
                  <Lollipop height={180} data={choices.map((c, i) => ({ name: c, value: winCounts[i] }))} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
