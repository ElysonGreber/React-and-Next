'use client'
import React, { useMemo } from 'react'
import { createAvatar } from '@dicebear/core'
import { micah } from '@dicebear/collection'

interface MicahAvatarProps {
  seed: string
  size?: number
}

export const MicahAvatar: React.FC<MicahAvatarProps> = ({ seed, size = 100 }) => {
  const svg = useMemo(() => {
    const avatar = createAvatar(micah, { seed, size })
    return avatar.toString()
  }, [seed, size])

  return <div dangerouslySetInnerHTML={{ __html: svg }} style={{ width: size, height: size }} />
}