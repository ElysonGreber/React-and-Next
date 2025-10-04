/* eslint-disable @typescript-eslint/no-explicit-any */
//dashboard-deature.tsx
'use client'
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { connection, sendInstruction, readPda } from './solanaHelper'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useToaster } from '../app-toaster'
import { BentoG } from './bentoG'
import TopCont from './dashboard-topc'
// import BOTCont from './dashboard-bot'
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const renderResult = (result: number) => (result === 0 ? '❌ Loss' : result === 1 ? '➖ Won' : '✅ Victory')
  const sortedHistory = [...history].reverse()
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentHistory = sortedHistory.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage)
  return (
    <div>
      <div className="chat-header-cover bg-[#1b1b1b] border-b-2 border-b-zinc-800 custom-shadow-2 p-6 max-w-5xl mx-auto space-y-6">
        <TopCont />
        {wallet.connected && (
          <div className="space-y-8">
            <div>
              <div className="flex-1 flex text-center font-bold space-x-1 ">{solBalance.toFixed(4)} SOL</div>
              <div className="flex items-center space-x-5">
                <div className="flex-1 m-0 text-center align-middle text-black font-bold h-30 w-full bg-amber-400 rounded-3xl">
                  Level
                </div>
                <div className="flex-1 m-0 align-middle justify-center items-center text-center text-black font-bold h-30 w-full bg-blue-400 rounded-3xl custom-shadow-2 ">
                  <div className="flex flex-col align-middle justify-center items-center h-30 p-3 text-white ">
                    <p className="p-1 border-b-3 border-b-white w-full"> Credits </p>{' '}
                    <h1 className="pt-2 h-50 text-5xl"> 0{credits} </h1>{' '}
                  </div>
                </div>
                <p className=" flex-1 m-0 text-center text-black font-bold h-30 w-full bg-green-400 rounded-3xl custom-shadow-2 ">
                  Score {score}
                </p>
              </div>
              <button
                onClick={handleBuyCredit}
                className=" cpm text-white rounded-lg bgbtn transition w-full custom-shadow-2 mt-4 "
              >
                Buy 5 Credits (0.01 SOL)
              </button>
              <div className="text-center space-x-4">
                <h3 className="font-semibold text-gray-700">Escolha sua jogada:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 justify-center gap-4 display-none ">
                  <button
                    onClick={() => handlePlay(0)}
                    className="flex-1 h-50 px-4 py-2 bg-yellow-300 border-8 border-white btnsdc rounded-lg overflow-hidden transition"
                  >
                    <Image
                      className="relative -left-10 object-contain"
                      src={ArmsRL}
                      alt="Rock"
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
                      alt="Paper"
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
                      alt="Scissor"
                      width={350}
                      height={350}
                    />
                  </button>
                </div>
              </div>
              <div className="bg-[#222222] rounded-xl shadow p-4">
                <h3 className="font-semibold mb-2 text-gray-700 gen-chat">Jorney</h3>
                {history.length === 0 ? (
                  <p className="text-gray-500 text-sm">First Play</p>
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
                        <svg
                          className="w-[24px] h-[24px] fill-[#b3ffad]"
                          viewBox="0 0 256 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z"></path>
                        </svg>
                      </button>
                      <span className="text-sm text-gray-400">
                        Página {currentPage} de {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                      >
                        <svg
                          className="w-[24px] h-[24px] fill-[#b3ffad]"
                          viewBox="0 0 256 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"></path>
                        </svg>
                      </button>
                    </div>
                    <BentoG />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {toast}
        <div className="overflow-y-clip sticky bottom-0">
                <div className=" grid grid-rows-2 h-50 w-full rounded-md items-center text-2xl text-center gap-2">
                  <div className="flex justify-center items-end space-x-8 relative -bottom-8 pointer-events-auto">
                    <div className='fixed -bottom-10 -translate-x-80  m-0'>
                      <button className="bg-amber-400 w-48 sm:w-64 md:w-72 lg:w-[300px] rounded-4xl custom-shadow-yellow ">
                        <Image
                          className="relative object-contain -rotate-90"
                          src={ArmsRL}
                          alt="Rock"
                          width={350}
                          height={350}
                        />
                      </button>
                    </div>
                    <div className='fixed -bottom-10 m-0 '>
                      <button className="bg-blue-400 w-48 sm:w-64 md:w-72 lg:w-[300px] rounded-4xl custom-shadow-blue">
                        <Image
                          className="relative -left-10 object-contain -rotate-90"
                          src={ArmsPL}
                          alt="Paper"
                          width={350}
                          height={350}
                        />
                      </button>
                    </div>
                    <div className='fixed -bottom-10 translate-x-80 m-0'>
                      <button className="bg-green-400 w-48 sm:w-64 md:w-72 lg:w-[300px] -bottom-2 rounded-4xl custom-shadow-green ">
                        <Image
                          className="relative -left-10 object-contain -rotate-90"
                          src={ArmsSL}
                          alt="Scissor"
                          width={350}
                          height={350}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
    </div>
    
  )
}
