'use client'

import { useCallback, useEffect, useState } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useGroupStore } from '@/stores/groupStores'
import { useInitializationStore } from '@/stores/initializationStore'
import Spinner from '@/components/ui/Spinner'

interface ClientStoreInitializerProps {
  children: React.ReactNode
  userId: string
}

export default function ClientStoreInitializer({ children, userId }: ClientStoreInitializerProps) {
  const { getUser, getPublicProfile, getSubscribedTrips } = useUserStore()
  const { getAllUserGroups } = useGroupStore()
  const { isInitialized, setInitialized } = useInitializationStore()
  const [isLoading, setIsLoading] = useState(true)

  const initializeStores = useCallback(async () => {
    if (userId && !isInitialized) {
      try {
        await Promise.all([
          getPublicProfile(userId),
          getSubscribedTrips(userId),
          getAllUserGroups(userId),
          getUser(),
        ])
        setInitialized(true)
      } catch (err) {
        console.error('Initialization error:', err)
      } finally {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [
    userId,
    isInitialized,
    getPublicProfile,
    getSubscribedTrips,
    getAllUserGroups,
    getUser,
    setInitialized,
  ])

  useEffect(() => {
    initializeStores()
  }, [initializeStores])

  if (isLoading) {
    return <Spinner />
  }

  return <>{children}</>
}
