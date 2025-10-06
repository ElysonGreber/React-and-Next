import Image from 'next/image'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
export function BentoG() {
  return (
    <div className="container">
      <div className="grid gap-4 sm:mt-2 lg:grid-cols-3 lg:grid-rows-2">
        <div className="relative lg:row-span-2">
          <div className="absolute inset-px rounded-lg bg-yellow-300 lg:rounded-l-4xl dark:bg-yellow-300" />
          <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
            <div className="@container inline-flex justify-center relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm">
              <Image className=" p-5" src="/logovert.png" alt="Solana Logo" width={524} height={1060} />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-l-4xl dark:outline-white/15" />
        </div>
        <div className="relative max-lg:row-start-1">
          <div className="absolute inset-px rounded-lg  bg-blue-400 max-lg:rounded-t-4xl dark:bg-blue-400" />
          <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
            <div className="px-5 pt-8 sm:px-5 sm:pt-10">
              <p className="mt-2 text-7xl hiruko font-medium tracking-tight text-white max-lg:text-center dark:text-white">
                PLAY
              </p>
              <p className="mt-2 max-w-lg text-sm/6 text-black max-lg:text-center dark:text-black">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit maiores impedit.
              </p>
            </div>
            <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2"></div>
          </div>
          <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl dark:outline-black" />
        </div>
        <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
          <div className="absolute inset-px rounded-lg  bg-green-400 dark:bg-green-400" />
          <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
            <div className="px-5 pt-10 sm:px-5 sm:pt-10">
              <p className="mt-2 text-9xl hiruko font-medium tracking-tight text-white max-lg:text-center dark:text-white">
                WIM
              </p>
              <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi.
              </p>
            </div>
            <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2"></div>
          </div>
          <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 dark:outline-white/15" />
        </div>
        <div className="relative lg:row-span-2">
          <div className="absolute inset-px rounded-lg bg-PinkSolana-300 max-lg:rounded-b-4xl lg:rounded-r-4xl dark:bg-Solana-400 " />
          <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
            <div className="px-5 pt-0 pb-3 sm:px-5 sm:pt-10 sm:pb-0">
              <p className="mt-2 text-6xl hiruko font-medium tracking-tight text-white max-lg:text-center dark:text-white">
                QUEST
              </p>
              <div className="pl-3 pt-2 space-y-4">
                <ul className="space-y-1">
                  <li className=" p-3 font-bold  flex items-center">
                      <CheckBadgeIcon className='size-6 ml-1 mr-2 ' /> Like & Share
                  </li>
                  <li className=" p-3 font-bold  flex items-center">
                   <CheckBadgeIcon className='size-6 ml-1 mr-2 ' /> Follow the Channe
                  </li>
                  <li className=" p-3 font-bold flex items-center">
                    <CheckBadgeIcon className='size-6 ml-1 mr-2 ' /> Join the Community
                  </li>
                  <li className=" p-3 font-bold flex items-center">
                    <CheckBadgeIcon className='size-6 ml-1 mr-2 ' /> Reach Level 10
                  </li>
                  <li className=" p-3 font-bold flex items-center">
                    <CheckBadgeIcon className='size-6 ml-1 mr-2 ' /> Invite a Friend
                     </li>
                  <li className=" p-3 font-bold flex items-center">
                    <CheckBadgeIcon className='size-6 ml-1 mr-2 ' /> Daily Login
                  </li>
                  <li className=" p-3 font-bold flex items-center">
                    <CheckBadgeIcon className='size-6 ml-1 mr-2 ' /> First Victory
                  </li>
                  <li className=" p-3 font-bold flex items-center">
                    <CheckBadgeIcon className='size-6 ml-1 mr-2 ' /> Complete a Tutorial
                  </li>
                  <li className=" p-3 font-bold flex items-center">
                    <CheckBadgeIcon className='size-6 ml-1 mr-2 ' /> Share Feedback .
                  </li>
                  <li className=" p-3 font-bold flex items-center">
                    <CheckBadgeIcon className='size-6 ml-1 mr-2 ' /> Post a Comment 
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-r-4xl dark:outline-white/15" />
        </div>
      </div>
    </div>
  )
}
