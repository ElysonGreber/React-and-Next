// src/lib/useSyncRanking.ts
import { useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useSyncRanking() {
  const syncRanking = useCallback(async (walletPubkey: string, nickname: string, currentScore: number) => {
    if (currentScore === 0) {
      console.log('Score é 0 — não atualiza ranking')
      return
    }

    try {
      // ✅ Sem desestruturação — evita erros de digitação
      const response = await supabase
        .from('rankings')
        .select('score')
        .eq('wallet', walletPubkey)
        .single()

      // Trata erro (exceto "não encontrado")
      if (response.error && response.error.code !== 'PGRST116') {
        console.error('Erro ao buscar ranking:', response.error)
        return
      }

      const data = response.data

      if (data) {
        // Já existe: atualiza só se for maior
        if (currentScore > data.score) {
          const updateRes = await supabase
            .from('rankings')
            .update({
              score: currentScore,
              updated_at: new Date().toISOString(),
            })
            .eq('wallet', walletPubkey)

          if (updateRes.error) {
            console.error('Erro ao atualizar ranking:', updateRes.error)
          } else {
            console.log('Ranking atualizado:', currentScore)
          }
        }
      } else {
        // Não existe: cadastra
        const insertRes = await supabase
          .from('rankings')
          .insert({
            wallet: walletPubkey,
            nickname,
            score: currentScore,
          })

        if (insertRes.error) {
          console.error('Erro ao cadastrar no ranking:', insertRes.error)
        } else {
          console.log('Novo jogador no ranking:', nickname)
        }
      }
    } catch (err) {
      console.error('Erro inesperado no syncRanking:', err)
    }
  }, [])

  return { syncRanking }
}