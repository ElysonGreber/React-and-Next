'use client'
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { connection, sendInstruction, readPda } from './solanaHelper'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useToaster } from '../app-toaster'
import TopCont from './dashboard-topc'
import BOTCont from './dashboard-bot'
import ArmsRL from './armsRL.svg'
import ArmsPL from './armsPL.svg'
import ArmsSL from './armsSL.svg'
import Image from 'next/image'


interface HistoryRecord {
  player: number
  program: number
  result: number
}

export default function DashboardFeature() {
  const wallet = useWallet()
  const [solBalance, setSolBalance] = useState<number>(0)
  const [credits, setCredits] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [txLogs, setTxLogs] = useState<string[]>([])
  const { showToast, toast } = useToaster()
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const fetchSolBalance = async () => {
    if (wallet.publicKey) {
      const balance = await connection.getBalance(wallet.publicKey)
      setSolBalance(balance / LAMPORTS_PER_SOL)
    }
  }
  const fetchGameData = async () => {
    if (wallet.publicKey) {
      try {
        const data = await readPda(wallet.publicKey)
        setCredits(data.credits)
        setScore(data.score)
        setHistory(data.history) // Atualiza todo o histórico
      } catch (err) {
        console.error('Erro lendo PDA:', err)
      }
    }
  }
  useEffect(() => {
    if (wallet.connected) {
      fetchSolBalance()
      fetchGameData()
    }
  }, [wallet.connected])
  const handleBuyCredit = async () => {
    try {
      const { signature, logs } = await sendInstruction(wallet, 0xff)
      await fetchSolBalance()
      await fetchGameData()
      setTxLogs(logs)
      showToast({ type: 1, title: 'Sucesso', message: `Créditos comprados! Tx: ${signature}` })
    } catch (err: any) {
      console.error(err)
      showToast({ type: 2, title: 'Erro', message: err.message || 'Erro ao comprar créditos' })
    }
  }
  const handlePlay = async (choice: number) => {
    try {
      const { signature, logs } = await sendInstruction(wallet, choice)
      // Atualiza tudo após cada jogada
      await fetchSolBalance()
      await fetchGameData()
      setTxLogs(logs)
      showToast({ type: 1, title: 'Jogada realizada', message: `Tx: ${signature}` })
    } catch (err: any) {
      console.error(err)
      showToast({ type: 2, title: 'Erro', message: err.message || 'Erro ao jogar' })
    }
  }
  const renderResult = (result: number) => (result === 0 ? '❌ Derrota' : result === 1 ? '➖ Empate' : '✅ Vitória')
  const sortedHistory = [...history].reverse()
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentHistory = sortedHistory.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage)
  return (
    <div>
      <div className="chat-header-cover bg-[#1b1b1b] border-b-2 border-b-zinc-800 custom-shadow-2 p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex justify-center">
          <TopCont />
        </div>
        {wallet.connected && (
          <div className="space-y-8">
            <button onClick={handleBuyCredit} className="px-6 py-2 cpm text-white rounded-lg bgbtn transition">
              Buy 5 Credits (0.01 SOL)
            </button>
            {/* Jogadas */}
            <div className="text-center space-y-4">
              <h3 className="font-semibold text-gray-700">Escolha sua jogada:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 justify-center gap-4">
                <button
                  onClick={() => handlePlay(0)}
                  className="flex-1 h-50 px-4 py-2 bg-yellow-300 border-8 border-white btnsdc rounded-lg overflow-hidden transition"
                >
                  <Image
                    className="relative -left-10 object-contain"
                    src={ArmsRL}
                    alt="Pedra"
                    width={350}
                    height={350}
                  />
                </button>
                <button
                  onClick={() => handlePlay(1)}
                  className="flex-1 h-50 px-4 py-2 bg-yellow-300 border-8 border-white btnsdc rounded-lg overflow-hidden transition"
                >
                  <Image
                    className="relative -left-10 object-contain"
                    src={ArmsPL}
                    alt="Pedra"
                    width={350}
                    height={350}
                  />
                </button>
                <button
                  onClick={() => handlePlay(2)}
                  className="flex-1 h-50 px-4 py-2 bg-yellow-300 border-8 border-white btnsdc rounded-lg overflow-hidden transition"
                >
                  <Image
                    className="relative -left-10 object-contain"
                    src={ArmsSL}
                    alt="Pedra"
                    width={350}
                    height={350}
                  />
                </button>
              </div>
            </div>
            {/* Status */}
            <div className="flex items-center space-y-3">
              <p className="flex-1 text-center font-bold">{solBalance.toFixed(4)} SOL</p>
              <p className="flex-1 text-center font-bold">Credits: {credits}</p>
              <p className="flex-1 text-center font-bold">Score {score}</p>
            </div>
            {/* Histórico */}
            <div className="bg-[#222222] rounded-xl shadow p-4">
              <h3 className="font-semibold mb-2 text-gray-700 gen-chat">Histórico</h3>
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma partida registrada ainda.</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-0 border-gray-200 text-sm">
                      <thead className="bg-[#1a1a1b]">
                        <tr>
                          <th className="border-b-1 px-3 py-2">#</th>
                          <th className="border-b-1 px-3 py-2">You</th>
                          <th className="border-b-1 px-3 py-2">Program</th>
                          <th className="border-b-1 px-3 py-2">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentHistory.map((h, i) => (
                          <tr key={i} className="text-center">
                            <td className="border-b-1 px-3 py-2">{indexOfFirst + i + 1}</td>
                            <td className="border-b-1 px-3 py-2">
                              {h.player === 0 ? '✊ Pedra' : h.player === 1 ? '🖐 Papel' : '✌ Tesoura'}
                            </td>
                            <td className="border-b-1 px-3 py-2">
                              {h.program === 0 ? '✊ Pedra' : h.program === 1 ? '🖐 Papel' : '✌ Tesoura'}
                            </td>
                            <td className="border-b-1 px-3 py-2">{renderResult(h.result)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Logs da transação */}
                  {txLogs.length > 0 && (
                    <div className="bg-gray-800 rounded p-2 mt-2 text-xs text-white max-h-40 overflow-y-auto">
                      {txLogs.map((log, i) => (
                        <div key={i}>{log}</div>
                      ))}
                    </div>
                  )}
                  {/* Paginação */}
                  <div className="flex justify-between items-center mt-3">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <span className="text-sm text-gray-400">
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                    >
                      Próximo
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <BOTCont />
      {toast}
    </div>
  )
}
