'use client'
import { useEffect } from 'react'
import { useFixedBalance } from '../account/fixed-data-balance' // ajuste o caminho conforme seu projeto
import Image from 'next/image'

interface TopContProps {
  refreshTrigger?: any // opcional, se quiser atualizar de fora
}

const TopCont: React.FC<TopContProps> = ({ refreshTrigger }) => {
  const { data: balance, isLoading, error, refetch } = useFixedBalance()

  useEffect(() => {
    if (refreshTrigger) refetch()
  }, [refreshTrigger])

  return (<>
    <div className="grid grid-rows-2 h-30 w-full rounded-md justify-items-center items-center text-2xl text-center gap-2">
      <div>
        {balance !== undefined && !isLoading && !error && (
          <div className="flex items-center gap-2">
            <span>Prize Pool: {balance.toFixed(2)}</span>
            <Image src="/solanaLogoMark.svg" alt="Solana Logo" width={20} height={20} />
          </div>
        )}
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          <RefreshCw size={16} />
        </Button>
      </div>
    </div>
  )
}

export default TopCont
