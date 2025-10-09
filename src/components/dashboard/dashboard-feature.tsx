// app/components/DashboardFeature.tsx (ou onde estiver)
'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
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
import { calculateLevel } from '@/lib/levelUtils'
import { useSyncRanking } from '@/lib/useSyncRanking' // ✅ hook de ranking

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
  const [isPlaying, setIsPlaying] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [resultMessage, setResultMessage] = useState<string | null>(null)
  const { showToast, toast } = useToaster()
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)

  // Para acessar nickname de forma síncrona
  const nicknameRef = useRef<string | null>(null)
  const walletAddrRef = useRef<string | null>(null)

  const sortedHistory = [...history].reverse()
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentHistory = sortedHistory.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage)
  const historyLength = history?.length || 0
  const currentLevel = calculateLevel(historyLength)

  const { syncRanking } = useSyncRanking() // ✅ hook externo

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
          nicknameRef.current = data.nickname
          walletAddrRef.current = data.wallet
        }
      } catch (err) {
        console.error('Erro geral ao buscar perfil:', err)
      }
    }
  }, [wallet.publicKey])

  // --- Carregamento inicial + sincronização de ranking ---
  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      const pubkey = wallet.publicKey.toBase58()
      const loadAll = async () => {
        await fetchGameData()
        await fetchUserProfile()

        // Sincroniza ranking após carregar tudo
        
        if (nicknameRef.current) {
          syncRanking(pubkey, nicknameRef.current, score)
        }
      }
      loadAll()
    }
  }, [wallet.connected, wallet.publicKey, fetchGameData, fetchUserProfile, syncRanking, score])

  // ----- FLUXO COMPRA CRÉDITO -----
  const handleBuyCredit = async () => {
    if (credits > 0) {
      showToast({ type: 2, title: 'Aviso', message: 'Você já possui créditos. Jogue antes de comprar!' })
      return
    }

    try {
      console.log('🔄 Iniciando compra de créditos...')
      const { signature, logs } = await sendInstruction(wallet, 0xff)

      setTxLogs(logs)

      // Simulação de confirmação
      await new Promise((res) => setTimeout(res, 3000))
      await fetchGameData()

      // Após atualizar, sincroniza ranking se necessário
      if (nicknameRef.current && wallet.publicKey) {
        const pubkey = wallet.publicKey.toBase58()
        syncRanking(pubkey, nicknameRef.current, score)
      }

      showToast({ type: 1, title: 'Sucesso', message: `Créditos comprados! Tx: ${signature.slice(0, 8)}...` })
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

      // Simulação de confirmação
      await new Promise((res) => setTimeout(res, 3000))

      if (wallet.publicKey) {
        const data = await readPda(wallet.publicKey)
        setCredits(data.credits)
        setScore(data.score)
        setHistory(data.history)

        // Atualiza ranking após jogada
        if (nicknameRef.current && wallet.publicKey) {
          const pubkey = wallet.publicKey.toBase58()
          syncRanking(pubkey, nicknameRef.current, data.score)
        }

        // Resultado
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
    } finally {
      setIsPlaying(false)
    }
  }

  const buttonsDisabled = credits <= 0 || isPlaying

  const formatWallet = () => {
    if (!walletAddr) return ''
    if (typeof window !== 'undefined' && window.innerWidth <= 900) {
      return walletAddr.slice(0, 4) + '....' + walletAddr.slice(-4)
    }
    return walletAddr
  }

  const renderResult = (result: number) => 
    result === 0 ? '❌ Loss' : result === 1 ? '➖ Draw' : '✅ Victory'

  return (
    <div>
      <div className="chat-header-cover bg-[#1b1b1b] border-b-2 border-b-zinc-800 custom-shadow-2 p-6 max-w-5xl mx-auto space-y-6">
        <TopCont />
        <MainSlider />
      
        {wallet.connected && (
          <div className="space-y-8">
            <div>
              <div className="text-center font-bold mb-2">
                {nickname ? (
                  <div className='flex w-full bg-[#1b1b1b] bgpatternB'> 
                    <div className="flex gap-1.5 justify-center items-center mb-0 -mt-4">
                      <div className='w-auto h-auto bgsqr'>
                        <MicahAvatar seed={walletAddr || nickname || 'default'} size={100} />
                      </div>
                      <div>
                        <p className='ggradgreen text-left mb-2 mt-auto text-xl sm:text-3xl'>
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
              <LevelProgress historyLength={historyLength} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="text-center text-black font-bold h-12 w-full sm:w-40 bg-amber-400 rounded-3xl flex items-center justify-center">
                Level: {currentLevel}
              </div>
              <div className="text-center text-black font-bold h-12 w-full sm:w-40 bg-blue-400 rounded-3xl custom-shadow-2 flex items-center justify-center">
                Credits: {credits}
              </div>
              <div className="text-center text-black font-bold h-12 w-full sm:w-40 bg-green-400 rounded-3xl custom-shadow-2 flex items-center justify-center">
                Score: {score}
              </div>
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
                {[0, 1, 2].map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handlePlay(choice)}
                    disabled={buttonsDisabled}
                    className="flex-1 px-2 py-2 bg-yellow-300 border-4 border-white btnsdc rounded-lg disabled:opacity-50"
                  >
                    <Image 
                      src={`/hands/arms${['R', 'P', 'S'][choice]}L.svg`} 
                      alt={['Rock', 'Paper', 'Scissors'][choice]} 
                      width={120} 
                      height={120} 
                      className="mx-auto"
                    />
                  </button>
                ))}
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
                              {h.player === 0 ? 'Rock' : h.player === 1 ? 'Paper' : 'Scissors'}
                            </td>
                            <td className="px-3 py-2">
                              {h.program === 0 ? 'Rock' : h.program === 1 ? 'Paper' : 'Scissors'}
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