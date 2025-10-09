'use client'
import { useEffect, useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { sendInstruction, readPda } from '@/lib/solanaHelper'
import { useToaster } from '../app-toaster'
import TopCont from './ui/dashboard-topc'
import MainSlider from './ui/mainslider'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MicahAvatar } from '../ui/micah-avatar'
import { LevelProgress } from '../app-levelprogress'
interface HistoryRecord {
  player: number
  program: number
  result: number
}

export default function DashboardFeature() {
  const [nickname, setNickname] = useState<string | null>(null)
  const [walletAddr, setWalletAddr] = useState<string | null>(null)
  const [titulo, setTitulo] = useState<string | null>(null)
  const wallet = useWallet()
  const [credits, setCredits] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [txLogs, setTxLogs] = useState<string[]>([])
  const [isPlaying, setIsPlaying] = useState(false) // bloqueio de botões durante jogada
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [resultMessage, setResultMessage] = useState<string | null>(null)
  const { showToast, toast } = useToaster()
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)

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

  // ----- FLUXO COMPRA CRÉDITO -----
  const handleBuyCredit = async () => {
    if (credits > 0) {
      showToast({ type: 2, title: 'Aviso', message: 'Você já possui créditos. Jogue antes de comprar!' })
      return
    }

    try {
      console.log('🔄 Iniciando compra de créditos...')

      const { signature, logs } = await sendInstruction(wallet, 0xff, (stage) => {
        console.log(stage) // log de fases
      })

      setTxLogs(logs)

      // Confirmação paralela
      ;(async function checkConfirmation() {
        let confirmed = false
        while (!confirmed) {
          await new Promise((res) => setTimeout(res, 2000))
          console.log('⏳ Verificando status da transação...')
          confirmed = true // simulação
        }
        console.log(`🎉 Transação confirmada: ${signature}`)
        await fetchGameData()
        showToast({ type: 1, title: 'Sucesso', message: `Créditos comprados! Tx: ${signature}` })
      })()
    } catch (err: any) {
      console.error('❌ Erro durante compra:', err)
      showToast({ type: 2, title: 'Erro', message: err.message || 'Erro ao comprar créditos' })
    }
  }

  // ----- FLUXO JOGADA -----
  const handlePlay = async (choice: number) => {
    if (credits <= 0) {
      showToast({ type: 2, title: 'No credits', message: 'Buy credits to play' })
      return
    }
    if (isPlaying) return
    setIsPlaying(true)
    setIsModalOpen(true)
    setResultMessage(null)

    try {
      console.log(`🔄 Iniciando jogada: escolha ${choice}...`)

      const { signature, logs } = await sendInstruction(wallet, choice)
      setTxLogs(logs)

      // Confirmação simulada
      let confirmed = false
      while (!confirmed) {
        await new Promise((res) => setTimeout(res, 2000))
        confirmed = true
      }

      console.log(`🎉 Jogada confirmada: ${signature}`)

      if (wallet.publicKey) {
        const data = await readPda(wallet.publicKey)
        setCredits(data.credits)
        setScore(data.score)
        setHistory(data.history)

        // Último resultado
        const lastGame = data.history[data.history.length - 1]
        let msg = "It's a draw!"
        if (lastGame.result === 0) msg = 'You lost!'
        if (lastGame.result === 2) msg = 'You won!'

        setResultMessage(msg)
        showToast({ type: 1, title: 'Game Result', message: msg })
      }
    } catch (err: any) {
      console.error('❌ Erro durante jogada:', err)
      showToast({ type: 2, title: 'Error', message: err.message || 'Play failed' })
      setIsModalOpen(false)
    } finally {
      setIsPlaying(false)
    }
  }

  // Botões desabilitados se sem créditos ou jogada em andamento
  const buttonsDisabled = credits <= 0 || isPlaying

  const formatWallet = () => {
    if (!walletAddr) return ''
    if (window.innerWidth <= 900) {
      return walletAddr.slice(0, 4) + '....' + walletAddr.slice(-4)
    }
    return walletAddr
  }

  const renderResult = (result: number) => (result === 0 ? '❌ Loss' : result === 1 ? '➖ Draw' : '✅ Victory')

  const sortedHistory = [...history].reverse()
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentHistory = sortedHistory.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage)

  return (
    <div>
      <div className="chat-header-cover bg-[#1b1b1b] border-b-2 border-b-zinc-800 custom-shadow-2 p-6 max-w-5xl mx-auto space-y-6">
        <TopCont />
        <MainSlider />
        <LevelProgress historyLength={history?.length || 0} />
        {wallet.connected && (
          <div className="space-y-8">
            <div>
              <div className="text-center  font-bold mb-2">
                {nickname ? (
                 <div className='flex w-full bg-[#1b1b1b] bgpatternB '> 
                    <div className="flex gap-1.5 justify-center items-center mb-0 -mt-4">
                      <div className='w-auto h-auto  bgsqr'>
                       <MicahAvatar seed={walletAddr || nickname || 'default'} size={100} />
                      </div>
                        <div>
                        <p className='ggradgreen text-left mb-2 mt-auto text-xl sm:text-3xl'>
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
            <div className="flex items-center space-x-5">
              <div className="flex-1 text-center text-black font-bold h-30 w-full bg-amber-400 rounded-3xl">Level</div>
              <p className="flex-1 text-center text-black font-bold h-30 w-full bg-blue-400 rounded-3xl custom-shadow-2">
                Credits: {credits}
              </p>
              <p className="flex-1 text-center text-black font-bold h-30 w-full bg-green-400 rounded-3xl custom-shadow-2">
                Score {score}
              </p>
            </div>
            <button
              onClick={handleBuyCredit}
              disabled={credits > 0}
              className="cpm text-white rounded-lg bgbtn transition w-full custom-shadow-2 disabled:opacity-50"
            >
              Buy 5 Credits (0.01 SOL)
            </button>
            <div className="text-center space-x-4">
              <h3 className="font-semibold text-gray-700">Choose your move:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => handlePlay(0)}
                  disabled={buttonsDisabled}
                  className="flex-1 px-4 py-2 bg-yellow-300 border-8 border-white btnsdc rounded-lg disabled:opacity-50"
                >
                  <Image src="/hands/armsRL.svg" alt="Rock" width={350} height={350} />
                </button>
                <button
                  onClick={() => handlePlay(1)}
                  disabled={buttonsDisabled}
                  className="flex-1 px-4 py-2 bg-yellow-300 border-8 border-white btnsdc rounded-lg disabled:opacity-50"
                >
                  <Image src="/hands/armsPL.svg" alt="Paper" width={350} height={350} />
                </button>
                <button
                  onClick={() => handlePlay(2)}
                  disabled={buttonsDisabled}
                  className="flex-1 px-4 py-2 bg-yellow-300 border-8 border-white btnsdc rounded-lg disabled:opacity-50"
                >
                  <Image src="/hands/armsSL.svg" alt="Scissor" width={350} height={350} />
                </button>
              </div>
            </div>
            <div className="bg-[#222222] rounded-xl shadow p-4">
              <h3 className="font-semibold mb-2 text-gray-700 gen-chat">Journey</h3>
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">First Play</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-[#1a1a1b]">
                        <tr>
                          <th className="px-3 py-2">#</th>
                          <th className="px-3 py-2">You</th>
                          <th className="px-3 py-2">Program</th>
                          <th className="px-3 py-2">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentHistory.map((h, i) => (
                          <tr key={i} className="text-center">
                            <td className="px-3 py-2">{indexOfFirst + i + 1}</td>
                            <td className="px-3 py-2">
                              {h.player === 0 ? '✊ Rock' : h.player === 1 ? '🖐 Paper' : '✌ Scissors'}
                            </td>
                            <td className="px-3 py-2">
                              {h.program === 0 ? '✊ Rock' : h.program === 1 ? '🖐 Paper' : '✌ Scissors'}
                            </td>
                            <td className="px-3 py-2">{renderResult(h.result)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {txLogs.length > 0 && (
                    <div className="bg-gray-800 rounded p-2 mt-2 text-xs text-white max-h-40 overflow-y-auto">
                      {txLogs.map((log, i) => (
                        <div key={i}>{log}</div>
                      ))}
                    </div>
                  )}

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
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Modal do jogo */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#1b1b1b] text-center text-white rounded-lg">
          <DialogHeader>
            <DialogTitle>Processing Transaction</DialogTitle>
          </DialogHeader>
          {!resultMessage ? (
            <div className="py-6">
              <div className="animate-spin h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Transaction is being processed...</p>
            </div>
          ) : (
            <div className="py-6 text-xl font-bold text-amber-300">{resultMessage}</div>
          )}
        </DialogContent>
      </Dialog>
      {toast}
    </div>
  )
}
