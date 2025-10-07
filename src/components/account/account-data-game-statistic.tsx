'use client'
import { useEffect, useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { readPda } from '@/lib/solanaHelper'
import Image from 'next/image'
import clsx from "clsx"
import { supabase } from '@/lib/supabaseClient'
import { MicahAvatar } from '../ui/micah-avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
interface HistoryRecord {
  player: number
  program: number
  result: number
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

const colorMap = ["text-red-500", "text-gray-300", "text-green-500"]
const textR = ["Loss", "Draw", "Won"]

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
  const renderResult = (result: number) => (<p className={clsx(colorMap[result])}>
  {textR[result]}</p> )
 

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

  return (
    <div className='space-y-2'>
      <div>
        <div className="text-center  font-bold mb-2">
          {nickname ? (
            <div className="flex w-full bg-[#1b1b1b] bgpatternB ">
              <div className="flex gap-1.5 justify-center items-center mb-0 -mt-4">
                <div className="w-auto h-auto  bgsqr">
                  <MicahAvatar seed={walletAddr || nickname || 'default'} size={100} />
                </div>
                <div>
                  <p className="ggradgreen text-left mb-2 mt-auto text-xl sm:text-3xl">
                    {nickname} The {titulo}
                  </p>
                  <p className="text-left text-sm text-VerdeSolana-100 ">{formatWallet()}</p>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading</p>
          )}
        </div>
      </div>
      <h2 className="text-2xl font-bold">Play History</h2>
      <div className="bg-[#222222] rounded-xl shadow p-4">
        <div className="overflow-x-auto">
          <Table className="min-w-full text-sm">
            <TableHeader >
              <TableRow>
                <TableCell className="px-3 py-2 text-left">#</TableCell>
                <TableCell className="px-3 py-2 text-right">You</TableCell>
                <TableCell className="px-3 py-2 text-right">Program</TableCell>
                <TableCell className="px-3 py-2 text-right"></TableCell>
                <TableCell className="px-3 py-2 text-right">Result</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentHistory.map((h, i) => (
                <TableRow key={i} className="text-center">
                  <TableCell className="px-3 py-2 text-left">{indexOfFirst + i + 1}</TableCell>
                  <TableCell className="px-3 py-2 text-right">
                    {h.player === 0 ? 'Rock' : h.player === 1 ? 'Paper' : 'Scissors'}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-right">
                    {h.program === 0 ? 'Rock' : h.program === 1 ? 'Paper' : 'Scissors'}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="px-3 py-2 text-right">{renderResult(h.result)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
    </div>
  )
}
