
// components/MainSlider.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react'
import clsx from 'clsx'
import gsap from 'gsap'

// ================================ Ícones ================================
const CircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" fill="currentColor" />
  </svg>
)

const SquareIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="12" height="12" fill="currentColor" />
  </svg>
)

const TriangleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L4 20H20L12 4Z" fill="currentColor" />
  </svg>
)

// ===========================================================================================================================================================

const titulosld = [
    "🚀 Start Your Jorney!",
    "🤩 Social Task!",
    "💎 Prize Alert!"
]
const subtsld = [
    "Play on Solana Devnet!",
    "Take the Chance to be a OG",
    "Month Plays Jackpot"
]

const SlideContent1 = () => (
  <div className="text-2xl font-bold w-72">
    {titulosld[0]}
    <div className="mt-2 text-base text-[#aeaeaf] font-semibold">
      <span className="text-[#ffae00]">{subtsld [0]}</span> Just for signing up today.
    </div>
    <div className="flex items-center space-x-4 mt-4">

    </div>
  </div>
)
// ===========================================================================================================================================================
const SlideContent2 = () => (
  <div className="text-2xl font-bold w-72">
     {titulosld[1]}
    <div className="mt-2 text-base text-[#aeaeaf] font-semibold">
      <span className="text-[#ffae00]">{subtsld [1]}</span> Fame , fortune and more.
    </div>
    <div className="flex items-center space-x-4 mt-4">
      <div className="inline-flex items-center space-x-2 rounded-full px-6 py-1.5 border-[2px] bg-[#232127] border-dashed border-[#ffae00]">
        <span className="text-base tracking-wide font-semibold">TASKS</span>
      </div>
    </div>
  </div>
)
// ===========================================================================================================================================================
const SlideContent3 = () => (
  <div className="text-2xl font-bold w-72">
  {titulosld[2]}
    <div className="mt-2 text-base text-[#aeaeaf] font-semibold">
      <span className="text-[#ffae00]">{subtsld [2]}</span> just hit $1M!
    </div>
    <div className="flex items-center space-x-4 mt-4">
      <div className="inline-flex items-center space-x-2 rounded-full px-6 py-1.5 border-[2px] bg-[#232127] border-dashed border-[#ffae00]">
        <span className="text-base tracking-wide font-semibold">JACKPOT1M</span>
      </div>
    </div>
  </div>
)
// ===========================================================================================================================================================
const mainSliderItems = [
  { title: "Bonus", icon: CircleIcon },
  { title: "Sports", icon: SquareIcon },
  { title: "Jackpot", icon: TriangleIcon },
]

const slideContents = [SlideContent1, SlideContent2, SlideContent3]

// ✅ Componente principal
export default function MainSlider() {
  const [current, setCurrent] = useState(0)
  const [next, setNext] = useState(1)
  const isAnimating = useRef(false)
  const hasStarted = useRef(false)


 const goToNext = useCallback(() => {
  if (isAnimating.current) return
  isAnimating.current = true

  const currentSlide = document.querySelector('.slide-current')
  const nextSlide = document.querySelector('.slide-next')
  if (!currentSlide || !nextSlide) {
    isAnimating.current = false
    return
  }
  //minha const para regular duracao geral
    const tduration = 1
  const tl = gsap.timeline()

// ================================ Animação do slide ================================
  tl.to(currentSlide, {
    x: '-102%',
    opacity: 0,
    duration: tduration,
  }, 0)
  .set(nextSlide, { x: '102%', opacity: 0 }, 0)
  .to(nextSlide, {
    x: '0%',
    opacity: 1,
    duration: tduration,
  }, 0)

// ================================ Animação dos bullets ================================
  document.querySelectorAll('.bullet').forEach((bullet, i) => {
    if (i === next) {
      tl.to(bullet, { scale: 1.3, background: '#ca8a04', duration: tduration }, 0)
    } else {
      tl.to(bullet, { scale: 1, background: '#27272a', duration: tduration }, 0)
    }
  })

// ================================ Animação do indicador do menu ================================
  const hero = document.getElementById('hero')
  const menuItem = document.getElementById(`menu_item${next}`)
  if (hero && menuItem) {
    const heroRect = hero.getBoundingClientRect()
    const itemRect = menuItem.getBoundingClientRect()
    const left = itemRect.left - heroRect.left
    tl.to('#menu-indicator', { x: left, width: itemRect.width, duration: tduration }, 0)
  }

// ================================ Animação dos ícones ================================
  document.querySelectorAll('[id^="menu_icon"]').forEach((icon, i) => {
    const bg = i === next
      ? 'linear-gradient(180deg, #FFBE28 0%, #FF7C00 100%)'
      : 'linear-gradient(180deg, #525252 0%, #525252 100%)'
    tl.to(icon, { background: bg, duration: tduration }, 0)
  })

// ================================ Atualiza estado APÓS toda a animação ================================
  tl.call(() => {
    const newCurrent = next
    const newNext = (next + 1) % mainSliderItems.length
    setCurrent(newCurrent)
    setNext(newNext)
    isAnimating.current = false
  })
}, [next])

// ================================ Inicia ================================
  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true
      const timer = setTimeout(goToNext, 200)
      return () => clearTimeout(timer)
    }
  }, [goToNext])

// ================================ Loop ================================
  useEffect(() => {
    if (isAnimating.current) return
    const loop = setTimeout(goToNext, 2000) // 2s entre slides
    return () => clearTimeout(loop)
  }, [current, goToNext])


return (
  <div className="p-0">
    <div
      className="relative bg-cover bg-center custom-shadow-1"
      id="hero"
      style={{ borderRadius: '25px' }}
    >
      <svg className="w-full" viewBox="0 0 704 256" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>

      {/* Container*/}
      <div
        className="absolute left-0 right-0 top-0 bottom-1 overflow-hidden"
        style={{ borderRadius: '22px' }}
      >
        {/* Slide atual */}
        <div
          key={`current-${current}`}
          className={`absolute inset-0 p-4 bg-center bg-cover slide-current ${
            current === 0 ? 'sl1' :
            current === 1 ? 'sl2' :
            current === 2 ? 'sl3' : ''
          }`}
          style={{ transform: 'translateX(0%)' }}
        >
          {React.createElement(slideContents[current])}
        </div>

        {/* Próximo slide (pré-carregado) */}
        <div
          key={`next-${next}`}
          className={`absolute inset-0 p-4 bg-center bg-cover slide-next newSlide ${
            next === 0 ? 'sl1' :
            next === 1 ? 'sl2' :
            next === 2 ? 'sl3' : ''
          }`}
          style={{ transform: 'translateX(102%)', opacity: 0 }}
        >
          {React.createElement(slideContents[next])}
        </div>
      </div>

      {/* SVG overlay com fObject e clip-path */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 704 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <foreignObject x="-11" y="145" width="726" height="122">
          <div className="fObject"></div>
        </foreignObject>
        <path
          d="M704 242C704 249.732 697.732 256 690 256H14C6.26802 256 0 249.732 0 242V156C0 170.359 11.6406 182 26 182H678C692.359 182 704 170.359 704 156V242Z"
          fill="#191821"
          fillOpacity="0.84"
        />
        <defs>
          <clipPath
            id="bgblur_0_6_44_clip_path"
            transform="translate(11 -145)"
          >
            <path d="M704 242C704 249.732 697.732 256 690 256H14C6.26802 256 0 249.732 0 242V156C0 170.359 11.6406 182 26 182H678C692.359 182 704 170.359 704 156V242Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Menu inferior responsivo */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-center px-4"
        style={{ height: '28%' }}
      >
        {/* Ícones + títulos: só em telas médias e maiores (768px+) */}
        <div className="hidden md:flex items-center space-x-6">
          {mainSliderItems.map(({ title, icon: Icon }, idx) => (
            <div className="inline-flex items-center" id={`menu_item${idx}`} key={idx}>
              <div
                id={`menu_icon${idx}`}
                className={clsx(
                  'size-[26px] rounded-md grid place-items-center',
                  idx === current ? 'yellow-gradient-1' : 'gray-gradient'
                )}
              >
                <Icon className="size-[20px] text-[#0f1119]" />
              </div>
              <div className="ml-2 text-base font-semibold">{title}</div>
            </div>
          ))}
        </div>

        {/* Bullets: sempre visíveis */}
        <div className="ml-auto flex items-center space-x-2">
          {mainSliderItems.map((_, idx) => (
            <div
              key={idx}
              className="size-2.5 rounded-full bullet"
              style={{ backgroundColor: idx === current ? '#ca8a04' : '#27272a' }}
            ></div>
          ))}
        </div>
      </div>

      {/* Indicador do menu (só visível em telas maiores, já que segue os ícones) */}
      <div
        className="absolute rounded-full hidden md:block"
        style={{
          bottom: '0px',
          left: '0px',
          width: '50px',
          height: '4px',
          background: '#ca8a04',
        }}
        id="menu-indicator"
      ></div>
    </div>
  </div>
)}