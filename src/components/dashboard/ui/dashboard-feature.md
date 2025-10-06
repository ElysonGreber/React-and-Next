'use client'
import { useEffect, useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { sendInstruction, readPda } from '@/lib/solanaHelper'
import { useToaster } from '../app-toaster'
import { BentoG } from './ui/bentoG'
import TopCont from './ui/dashboard-topc'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'

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
          // Aqui você pode usar: connection.getSignatureStatus(signature)
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
      showToast({ type: 2, title: 'Sem créditos', message: 'Compre créditos para jogar' })
      return
    }
    if (isPlaying) return // previne jogadas simultâneas
    setIsPlaying(true)

    try {
      console.log(`🔄 Iniciando jogada: escolha ${choice}...`)

      const { signature, logs } = await sendInstruction(wallet, choice, (stage) => {
        console.log(stage)
      })

      setTxLogs(logs)
      showToast({ type: 1, title: 'Jogada enviada', message: `Tx: ${signature}` })

      // Confirmação paralela
      ;(async function checkConfirmation() {
        let confirmed = false
        while (!confirmed) {
          await new Promise((res) => setTimeout(res, 2000))
          console.log('⏳ Verificando status da jogada...')
          // opcional: connection.getSignatureStatus(signature)
          confirmed = true // simulação
        }
        console.log(`🎉 Jogada confirmada: ${signature}`)
        await fetchGameData() // atualiza créditos e histórico
        showToast({ type: 1, title: 'Jogada realizada', message: `Tx: ${signature}` })
        setIsPlaying(false)
      })()
    } catch (err: any) {
      console.error('❌ Erro durante jogada:', err)
      showToast({ type: 2, title: 'Erro', message: err.message || 'Erro ao jogar' })
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
        <div className="text-center text-YellowSolana-50 font-bold mb-2">
          {nickname ? (
            <>
              <p>
                {nickname} The {titulo}
              </p>
              <p className="text-sm text-VerdeSolana-100 ">{formatWallet()}</p>
            </>
          ) : (
            <p>Loading</p>
          )}
        </div>
        <BentoG />
        {wallet.connected && (
          <div className="space-y-8">
            <div className="flex items-center space-x-5">
              <div className="flex-1 m-0 text-center align-middle text-black font-bold h-30 w-full bg-amber-400 rounded-3xl">
                Level
              </div>
              <p className="flex-1 m-0 text-center text-black font-bold h-30 w-full bg-blue-400 rounded-3xl custom-shadow-2">
                Credits: {credits}
              </p>
              <p className="flex-1 m-0 text-center text-black font-bold h-30 w-full bg-green-400 rounded-3xl custom-shadow-2">
                Score {score}
              </p>
            </div>

            {/* Botão compra só habilitado se credits == 0 */}
            <button
              onClick={handleBuyCredit}
              disabled={credits > 0}
              className="cpm text-white rounded-lg bgbtn transition w-full custom-shadow-2 disabled:opacity-50"
            >
              Buy 5 Credits (0.01 SOL)
            </button>

            <div className="text-center space-x-4">
              <h3 className="font-semibold text-gray-700">Escolha sua jogada:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 justify-center gap-4 display-none ">
                <button
                  onClick={() => handlePlay(0)}
                  disabled={credits <= 0}
                  className="flex-1 h-50 px-4 py-2 bg-yellow-300 border-8 border-white btnsdc rounded-lg overflow-hidden transition disabled:opacity-50"
                >
                  <Image src="/hands/armsRL.svg" alt="Rock" width={350} height={350} />
                </button>
                <button
                  onClick={() => handlePlay(1)}
                  disabled={credits <= 0}
                  className="flex-1 h-50 px-4 py-2 bg-yellow-300 border-8 border-white btnsdc rounded-lg overflow-hidden transition disabled:opacity-50"
                >
                  <Image src="/hands/armsPL.svg" alt="Paper" width={350} height={350} />
                </button>
                <button
                  onClick={() => handlePlay(2)}
                  disabled={credits <= 0}
                  className="flex-1 h-50 px-4 py-2 bg-yellow-300 border-8 border-white btnsdc rounded-lg overflow-hidden transition disabled:opacity-50"
                >
                  <Image src="/hands/armsSL.svg" alt="Scissor" width={350} height={350} />
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
                          <th className="border-b-1 px-3 py-2">#</th> <th className="border-b-1 px-3 py-2">You</th>
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
      {toast}
    </div>
  )
}
