import Image from 'next/image'
import RPL90 from '../../public/RPL90'
import RRL90 from '../../public/RRL90'
import RSL90 from '../../public/RSL90'
interface FooterButtonProps {
  src: string
  alt: string
  onClick: () => void
}

function FooterButton({ src, alt, onClick }: FooterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="transform -rotate-90 hover:scale-110 transition-transform flex justify-center items-end"
    >
      <div className="h-48 sm:h-60 md:h-72 lg:h-80 overflow-hidden flex justify-center items-end">
        <Image src={src} alt={alt} width={350} height={350} className="object-contain" />
      </div>
    </button>
  )
}

export function AppFooter() {
  const handleClick = (choice: number) => {
    console.log('Jogada:', choice)
    // Aqui você pode chamar handlePlay(choice)
  }

  return (
    <footer className="fixed bottom-0 w-full pointer-events-none">
      <div className="max-w-5xl mx-auto relative">
        <div className="flex justify-center items-end space-x-8 relative -bottom-8 pointer-events-auto">
          <div>
            <button className="bg-amber-400 w-48 sm:w-64 md:w-72 lg:w-[300px] rounded-4xl custom-shadow-yellow ">
              <RRL90 className="-translate-y-15 " />
            </button>
          </div>
          <div>
            <button
              className="bg-blue-400 w-48 sm:w-64 md:w-72 lg:w-[300px] rounded-4xl custom-shadow-blue">
              <RPL90 className="-translate-y-10 " />
            </button>
          </div>
          <div>
            <button
              className="bg-green-400 w-48 sm:w-64 md:w-72 lg:w-[300px] rounded-4xl custom-shadow-green ">
              <RSL90 className="-translate-y-2 sm:-translate-y-6 md:-translate-y-8" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
