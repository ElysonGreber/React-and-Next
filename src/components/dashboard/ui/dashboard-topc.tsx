'use client'
import { useEffect } from 'react'
import { useFixedBalance } from '../../account/fixed-data-balance' // ajuste o caminho conforme seu projeto
import Image from 'next/image'
import { useSolPrice } from '@/lib/useSolprice'
interface TopContProps {
  refreshTrigger?: unknown
}

const TopCont: React.FC<TopContProps> = ({ refreshTrigger }) => {
  const { data: balance, isLoading: balanceLoading, error: balanceError, refetch } = useFixedBalance()
  const { solPrice, loading: priceLoading, error: priceError } = useSolPrice()

  useEffect(() => {
    if (refreshTrigger) refetch()
  }, [refetch, refreshTrigger])

  // Calcula o valor em USD
  const usdValue = balance !== undefined && solPrice ? balance * solPrice : null

  return (
    <div className="grid h-50 w-full mb-0 rounded-md justify-items-center items-center text-2xl text-center gap-2 bgpattern">
      <div className="flex flex-col justify-items-center items-center  mt-5">
        {balance !== undefined && !balanceLoading && !balanceError && (
          <div className="grid-cols-1 items-center gap-2">
            <div>
              <span className="text-4xl font-bold text-amber-200">Prize Pool</span>
            </div>

            {/* Saldo em SOL */}
            <div className="flex flex-row gap-1.5 items-center w-auto h-auto justify-center">
              <span className="text-7xl font-bold ggradgreen">{balance.toFixed(2)}</span>
              <Image src="/solanaLogoMark.svg" alt="Solana Logo" width={55} height={55} />
            </div>

            {/* Valor em USD */}
            <div className="mt-2">
              {usdValue !== null ? (
                <span className="text-2xl text-gray-300">
                  $
                  {usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2,})}
                </span>
              ) : (
                <span className="text-2xl text-gray-500">—</span>
              )}
            </div>
          </div>
        )}
        <div className="p-0 mt-5 inline w-auto h-[120px] ">
          <Image src="/Gem.png" loading="lazy" alt="Gem" width={150} height={150} />
        </div>
      </div>
    </div>
  )
}

export default TopCont
