// lib/rankingUtils.ts
import { supabase } from '@/lib/supabaseClient'

export async function getPlayerRank(wallet: string) {
  try {
    // 1. Busca dados do jogador
    const playerRes = await supabase
      .from('rankings')
      .select('score, nickname')
      .eq('wallet', wallet)
      .single()

    if (playerRes.error && playerRes.error.code !== 'PGRST116') {
      throw playerRes.error
    }

    const playerData = playerRes.data

    if (!playerData) {
      return {
        rank: null,
        nickname: '—',
        score: 0,
        isInRanking: false
      }
    }

    // 2. Conta quantos têm score maior
    const countRes = await supabase
      .from('rankings')
      .select('score', { count: 'exact', head: true })
      .gt('score', playerData.score)

    if (countRes.error) {
      throw countRes.error
    }

    const rank = (countRes.count || 0) + 1

    return {
      rank,
      nickname: playerData.nickname,
      score: playerData.score,
      isInRanking: true
    }
  } catch (err) {
    console.error('Erro em getPlayerRank:', err)
    return {
      rank: null,
      nickname: '—',
      score: 0,
      isInRanking: false
    }
  }
}