// components/SocialTasks.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Share, 
  Twitter, 
  Youtube, 
  Instagram, 
  Bitcoin, 
  ExternalLink,
  CheckCircle,
  Circle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface SocialTask {
  id: string
  title: string
  description: string
  points: number
  icon: React.ReactNode
  actionUrl: string
  completed: boolean
}

export function SocialTasks() {
  const [tasks, setTasks] = useState<SocialTask[]>([
    {
      id: 'like',
      title: 'Like our post',
      description: 'Show some love to our latest update',
      points: 10,
      icon: <Heart className="h-5 w-5" />,
      actionUrl: 'https://twitter.com/yourprofile/status/123456789',
      completed: false,
    },
    {
      id: 'share',
      title: 'Share on X (Twitter)',
      description: 'Spread the word about our project',
      points: 25,
      icon: <Share className="h-5 w-5" />,
      actionUrl: 'https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20project!&url=https://yourproject.com',
      completed: false,
    },
    {
      id: 'follow-twitter',
      title: 'Follow on X',
      description: 'Stay updated with our latest news',
      points: 15,
      icon: <Twitter className="h-5 w-5" />,
      actionUrl: 'https://twitter.com/yourprofile',
      completed: false,
    },
    {
      id: 'subscribe-youtube',
      title: 'Subscribe on YouTube',
      description: 'Don’t miss our tutorials and updates',
      points: 20,
      icon: <Youtube className="h-5 w-5" />,
      actionUrl: 'https://youtube.com/@yourchannel',
      completed: false,
    },
    {
      id: 'follow-instagram',
      title: 'Follow on Instagram',
      description: 'See behind-the-scenes content',
      points: 15,
      icon: <Instagram className="h-5 w-5" />,
      actionUrl: 'https://instagram.com/yourprofile',
      completed: false,
    },
    {
      id: 'join-discord',
      title: 'Join Discord',
      description: 'Be part of our community',
      points: 30,
      icon: <Bitcoin className="h-5 w-5" />,
      actionUrl: 'https://discord.gg/your-invite',
      completed: false,
    },
  ])

  const handleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: true } : task
    ))
  }

  const totalPoints = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0)

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Social Tasks</h1>
        <p className="text-muted-foreground mt-2">
          Complete tasks to earn points and unlock rewards!
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-full">
          <span className="font-bold text-amber-400">{totalPoints}</span>
          <span className="text-sm text-amber-300">points earned</span>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * tasks.findIndex(t => t.id === task.id) }}
          >
            <Card className="bg-[#1a1a1b] border-gray-800 hover:border-gray-700 transition">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="mt-0.5">
                  {task.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-amber-400">
                      {task.icon}
                    </div>
                    <h3 className="font-medium">{task.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      +{task.points} pts
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {task.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => window.open(task.actionUrl, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Go
                  </Button>
                  {!task.completed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-green-400 hover:text-green-300 hover:bg-green-400/10"
                      onClick={() => handleComplete(task.id)}
                    >
                      Mark as done
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        💡 After completing a task, click "Mark as done" to claim your points.
      </div>
    </div>
  )
}