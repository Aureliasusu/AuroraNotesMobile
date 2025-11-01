import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/useAuthStore'

interface OnlineUser {
  id: string
  email: string
  full_name: string
  avatar_url: string
  online_at: string
  last_seen: string
  is_online: boolean
}

interface UserPresenceState {
  onlineUsers: OnlineUser[]
  isOnline: boolean
  lastSeen: string
  loading: boolean
}

export function useUserPresence() {
  const { user } = useAuthStore()
  const channelRef = useRef<any>(null)
  
  const [state, setState] = useState<UserPresenceState>({
    onlineUsers: [],
    isOnline: false,
    lastSeen: new Date().toISOString(),
    loading: false,
  })

  // Subscribe to presence changes
  useEffect(() => {
    if (!user) return

    channelRef.current = supabase.channel('presence-channel')
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channelRef.current.presenceState()
        const onlineUsers = Object.values(presenceState)
          .flat()
          .map((presence: any) => ({
            id: presence.user_id,
            email: presence.email || '',
            full_name: presence.full_name || presence.email || 'Unknown',
            avatar_url: presence.avatar_url || '',
            online_at: presence.online_at || new Date().toISOString(),
            last_seen: presence.last_seen || new Date().toISOString(),
            is_online: true,
          }))
          .filter((u: OnlineUser) => u.id !== user.id)

        setState(prev => ({
          ...prev,
          onlineUsers,
        }))
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        // eslint-disable-next-line no-console
console.log('User joined:', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        // eslint-disable-next-line no-console
console.log('User left:', key, leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channelRef.current.track({
            user_id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.email || 'Unknown',
            avatar_url: user.user_metadata?.avatar_url || '',
            online_at: new Date().toISOString(),
            last_seen: new Date().toISOString(),
          })
        }
      })

    return () => {
      channelRef.current?.unsubscribe()
    }
  }, [user])

  // Update online status
  const updateOnlineStatus = useCallback(async (isOnline: boolean) => {
    if (!user) return

    try {
      await channelRef.current.track({
        user_id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email || 'Unknown',
        avatar_url: user.user_metadata?.avatar_url || '',
        online_at: new Date().toISOString(),
        last_seen: new Date().toISOString(),
      })

      setState(prev => ({
        ...prev,
        isOnline,
        lastSeen: new Date().toISOString(),
      }))
    } catch (error) {
      // eslint-disable-next-line no-console
console.error('Failed to update online status', error)
    }
  }, [user])

  // Update last seen
  const updateLastSeen = useCallback(async () => {
    if (!user) return

    try {
      await channelRef.current.track({
        user_id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email || 'Unknown',
        avatar_url: user.user_metadata?.avatar_url || '',
        online_at: new Date().toISOString(),
        last_seen: new Date().toISOString(),
      })

      setState(prev => ({
        ...prev,
        lastSeen: new Date().toISOString(),
      }))
    } catch (error) {
      // eslint-disable-next-line no-console
console.error('Failed to update last seen', error)
    }
  }, [user])

  // Get user presence info
  const getUserPresence = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, last_seen')
        .eq('id', userId)
        .single()

      if (error) {
        // eslint-disable-next-line no-console
console.error('Failed to get user presence', error)
        return null
      }

      return data
    } catch (error) {
      // eslint-disable-next-line no-console
console.error('Failed to get user presence', error)
      return null
    }
  }, [])

  return {
    ...state,
    updateOnlineStatus,
    updateLastSeen,
    getUserPresence,
  }
}