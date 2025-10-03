'use client'
import { useEffect } from 'react'
import { useFixedBalance } from '../account/fixed-data-balance' // ajuste o caminho conforme seu projeto
import Image from 'next/image'

interface TopContProps {
  refreshTrigger?: unknown // opcional, se quiser atualizar de fora
}

const TopCont: React.FC<TopContProps> = ({ refreshTrigger }) => {
  const { data: balance, isLoading, error, refetch } = useFixedBalance()

  useEffect(() => {
    if (refreshTrigger) refetch()
  }, [refetch, refreshTrigger])

  return (
    <div className="grid h-50 w-full rounded-md justify-items-center items-center text-2xl text-center gap-2 bgpattern">
      <div className="mt-5">
        {balance !== undefined && !isLoading && !error && (
          <div className="grid-cols-1 items-center gap-2">
            <div>
              <span className="text-4xl bold text-amber-200 ">Prize Pool</span>
            </div>
            <div className=" flex items-center justify-center">
              <span className=" text-7xl ggradgreen">{balance.toFixed(2)}</span>
              <Image className="ml-2" src="/solanaLogoMark.svg" alt="Solana Logo" width={52} height={52} />
            </div>
          </div>
        )}
        <Image className="p-0 mt-5 inline" src="/Gem.png" loading="lazy" alt="Solana Logo" width={150} height={150} />
      </div>
    </div>
  )
}

export default TopCont
