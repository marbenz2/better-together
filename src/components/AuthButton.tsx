'use client'

import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import Spinner from '@/components/ui/Spinner'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Fehler beim Abrufen des Benutzers:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [supabase.auth])

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Fehler beim Abmelden:', error)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return user ? (
    <div className="flex items-center gap-4">
      <p className="hidden sm:block">Hey, {user.user_metadata.first_name}!</p>
      <Button variant="outline" type="submit" onClick={handleSignOut}>
        Logout
      </Button>
    </div>
  ) : (
    <div className="flex gap-2">
      <Link href="/login">
        <Button>Anmelden</Button>
      </Link>
      <Link href="/signup">
        <Button variant="outline">Registrieren</Button>
      </Link>
    </div>
  )
}
