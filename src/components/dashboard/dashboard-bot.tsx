

'use client'
import { useEffect } from 'react'
import Image from 'next/image'
interface TopContProps {
  refreshTrigger?: any // opcional, se quiser atualizar de fora
}

const BOTCont: React.FC<TopContProps>=({})=>{
  return (<>
    <div className="grid grid-rows-2 h-30 w-full rounded-md justify-items-center items-center text-2xl text-center gap-2">
      <div>
        
      </div>
    </div>
    </>
  )
}

export default BOTCont
