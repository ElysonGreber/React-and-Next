import Image from 'next/image'


export function BentoG() {
  return (
    <div className="container">
      <div className="grid gap-4 sm:mt-2 lg:grid-cols-3 lg:grid-rows-2">
        <div className="relative lg:row-span-2">
          <div className="absolute inset-px rounded-lg bg-yellow-300 lg:rounded-l-4xl dark:bg-yellow-300" />
          <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
            <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
              <p className="mt-2 text-lg font-medium tracking-tight text-black max-lg:text-center dark:text-black">
              </p>
              <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400"></p>
            </div>
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
              <p className="mt-2 text-9xl hiruko font-medium tracking-tight text-white max-lg:text-center dark:text-white">
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
          <div className="absolute inset-px rounded-lg bg-PinkSolana-300 max-lg:rounded-b-4xl lg:rounded-r-4xl dark:bg-green-300" />
          <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
            <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
              <p className="mt-2 text-lg font-medium tracking-tight text-black max-lg:text-center dark:text-black">
                Powerful APIs
              </p>
              <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget sem sodales gravida.
              </p>
            </div>
            <div className="relative min-h-120 w-full grow">
              <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-green-400 shadow-2xl outline outline-white/10 dark:bg-green-300 dark:shadow-none">
                <div className="flex bg-gray-900 outline outline-white/5">
                  <div className="-mb-px flex text-sm/6 font-medium text-black">
                    <div className="border-r border-b border-r-white/10 border-b-white/20 bg-yellow-300 px-4 py-2 text-black">
                      NotificationSetting.jsx
                    </div>
                    <div className="border-r border-gray-600/10 px-4 py-2">App.jsx</div>
                  </div>
                </div>
                <div className="px-6 pt-6 pb-14">{/* Your code example */}</div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-r-4xl dark:outline-white/15" />
        </div>
      </div>
    </div>
  )
}
