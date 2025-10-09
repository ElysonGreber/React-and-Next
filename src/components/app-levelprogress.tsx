'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'

const LEVEL_THRESHOLDS = [5, 10, 15, 25, 35, 50, 70, 90, 110, 130]

interface LevelProgressProps {
  historyLength: number
}

export function LevelProgress({ historyLength }: LevelProgressProps) {
  const maxLevel = LEVEL_THRESHOLDS.length
  const currentLevel = LEVEL_THRESHOLDS.filter(th => historyLength >= th).length
  const progressPercent = Math.min(100, (currentLevel / maxLevel) * 100)

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Container relativo para sobreposição */}
      <div className="relative">
        {/* Barra de progresso */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>

        {/* Camada dos CÍRCULOS (só os círculos, sem texto) */}
        <div className="flex justify-between absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none">
          {LEVEL_THRESHOLDS.map((_, index) => {
            const level = index + 1
            const isUnlocked = level <= currentLevel

            return (
              <div key={level} className="flex items-center justify-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                    isUnlocked
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isUnlocked ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="h-3 w-3" />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="number"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs font-medium"
                      >
                        {level}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {/* <div className="flex justify-between mt-6">
        {LEVEL_THRESHOLDS.map((_, index) => {
          const level = index + 1
          return (
            <span
              key={level}
              className="text-xs text-gray-500 text-center w-6"
            >
              Lvl {level}
            </span>
          )
        })}
      </div> */}
    </div>
  )
}