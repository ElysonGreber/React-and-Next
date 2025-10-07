'use client'
import { useEffect, useRef, useState } from 'react'
import { createAvatar } from '@dicebear/core'
import { micah } from '@dicebear/collection'

interface ChatMessage {
  user: string
  text: string
  avatar: string
  timestamp: string
}

interface FooterChatProps {
  wsUrl: string
  nickname: string
  walletAddress: string
}

export default function FooterChat({ wsUrl, nickname, walletAddress }: FooterChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [avatar, setAvatar] = useState<string>('')
  const [isOpen, setIsOpen] = useState(true)
  const wsRef = useRef<WebSocket | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  // --- Avatar pela carteira ---
  useEffect(() => {
    if (walletAddress) {
      const avatarInstance = createAvatar(micah, { seed: walletAddress })
      setAvatar(avatarInstance.toDataUri())
    }
  }, [walletAddress])

  // --- WebSocket ---
  useEffect(() => {
    if (!wsUrl) return
    wsRef.current = new WebSocket(wsUrl)

    wsRef.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as ChatMessage

        // evita duplicar mensagem do próprio usuário
        if (msg.user === nickname) return

        setMessages((prev) => [...prev, msg])
      } catch (err) {
        console.error('Erro ao receber mensagem WS', err)
      }
    }

    wsRef.current.onopen = () => console.log('Connected to chat WS')
    wsRef.current.onclose = () => console.log('Disconnected from chat WS')

    return () => {
      wsRef.current?.close()
    }
  }, [wsUrl, nickname])

  // --- Enviar mensagem ---
  const handleSend = () => {
    if (!messageInput.trim() || !wsRef.current) return
    const msg: ChatMessage = {
      user: nickname,
      text: messageInput,
      avatar,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    wsRef.current.send(JSON.stringify(msg))
    setMessages((prev) => [...prev, msg]) // mostra imediatamente para o próprio usuário
    setMessageInput('')
  }

  // --- Fecha chat ao clicar fora ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [chatRef])

  if (!isOpen) {
    return (
      <div
        className="fixed bottom-2 right-2 cursor-pointer p-2 bg-black rounded-full text-white z-50"
        onClick={() => setIsOpen(true)}
      >
        Open Chat
      </div>
    )
  }

  return (
    <div
      ref={chatRef}
      className="fixed bottom-0 right-0 w-100 max-w-full h-96 bg-[#1b1b1b] text-white rounded-t-lg shadow-lg flex flex-col z-50"
    >
      <div className="flex items-center justify-between p-2 bg-[#111] border-b border-gray-700">
        <span className="font-bold">Chat</span>
        <button onClick={() => setIsOpen(false)} className="text-blue-300 font-bold">
          X
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="flex items-start space-x-2">
            <img src={msg.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-yellow-400">{msg.user}</span>
                <span className="text-xs text-gray-400">{msg.timestamp}</span>
              </div>
              <p className="text-sm text-gray-200">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex p-2 border-t border-gray-700 space-x-2">
        <input
          type="text"
          className="flex-1 bg-[#1b1b1b] text-white rounded px-2 py-1 focus:outline-none"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="px-3 py-1 bg-VerdeSolana-300 rounded hover:bg-VerdeSolana-300 transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}
