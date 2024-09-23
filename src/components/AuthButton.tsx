'use client'

import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import Spinner from '@/components/ui/Spinner'
import { ResponsiveDialog } from './ResponsiveDialog'
import { LogOutIcon, SettingsIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useUserStore } from '@/stores/userStore'

export default function AuthButton() {
  const { publicProfile } = useUserStore()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const userInitials = user?.user_metadata.first_name[0] + user?.user_metadata.last_name[0]

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

  const preventDefault = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  if (isLoading) {
    return <Spinner />
  }

  return user ? (
    <div className="flex items-center gap-4">
      <p className="hidden sm:block">Hey, {user.user_metadata.first_name}!</p>
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage
              className="object-contain"
              src={publicProfile?.profile_picture || undefined}
            />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href="/protected/profile" className="w-full" onClick={handleLinkClick}>
              <div className="flex items-center gap-3 cursor-pointer">
                <SettingsIcon size={16} />
                Profil
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem onClick={preventDefault}>
            <ResponsiveDialog
              title="Abmelden"
              message="Wollen Sie sich wirklich abmelden?"
              confirmText="Abmelden"
              onConfirm={handleSignOut}
              buttonVariant="destructive"
            >
              <div className="flex items-center gap-3 w-full cursor-pointer">
                <LogOutIcon size={16} className="text-destructive" />
                Abmelden
              </div>
            </ResponsiveDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
