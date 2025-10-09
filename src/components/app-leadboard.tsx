'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Crown, Star } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

interface RankingEntry {
  id: string
  wallet: string
  nickname: string
  score: number
  created_at: string
}

export function Leaderboard() {
  const [rankings, setRankings] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    const fetchRankings = async () => {
      try {
        const {  error } = await supabase
          .from('rankings')
          .select('*')
          .order('score', { ascending: false })
          .limit(10)

        if (error) throw error
        setRankings(data || [])
      } catch (err) {
        console.error('Erro ao buscar ranking:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRankings()
  }, [])

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-5 w-5 text-yellow-500" />
    if (index === 1) return <Trophy className="h-5 w-5 text-gray-400" />
    if (index === 2) return <Trophy className="h-5 w-5 text-amber-700" />
    return <Star className="h-4 w-4 text-gray-500" />
  }

  const getRankColor = (index: number) => {
    if (index === 0) return 'text-yellow-500 font-bold'
    if (index === 1) return 'text-gray-400'
    if (index === 2) return 'text-amber-700'
    return 'text-gray-300'
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Leaderboard</h2>
        <p className="text-muted-foreground mt-2">Top players by score</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {rankings.length > 0 ? (
            rankings.map((player, index) => (
              <Card key={player.id} className="bg-[#1a1a1b] border-gray-800 hover:border-gray-700 transition">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800">
                    {getRankIcon(index)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${getRankColor(index)}`}>
                      {index + 1}. {player.nickname}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{player.wallet.slice(0, 6)}...{player.wallet.slice(-4)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">{player.score.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-[#1a1a1b] border-gray-800">
              <CardContent className="p-8 text-center text-gray-500">
                No players yet. Play to join the leaderboard!
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}