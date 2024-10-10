import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import Link from 'next/link'
import { SubmitButton } from '@/components/forms/submit-button'
import { Input } from '@/components/forms/input'
import { Label } from '@/components/forms/label'
import { FormMessage, Message } from '@/components/forms/form-message'
import { encodedRedirect } from '@/utils/utils'
import { InfoIcon } from 'lucide-react'
import { BackButtonServer } from '@/components/ui/back-button-server'

export default function Signup({ searchParams }: { searchParams: Message }) {
  const queryId =
    searchParams.hasOwnProperty('group_code') && searchParams['group_code' as keyof Message]

  const signUp = async (formData: FormData) => {
    'use server'
    const email = formData.get('email')?.toString()
    const password = formData.get('password')?.toString()
    const confirmPassword = formData.get('confirmPassword')?.toString()
    const first_name = formData.get('first_name')?.toString()
    const last_name = formData.get('last_name')?.toString()
    const birthday = formData.get('birthday') as string
    const group_link = formData.get('group_link')?.toString()
    const supabase = createClient()
    const origin = headers().get('origin')

    if (!email || !password || !confirmPassword || !first_name || !last_name || !birthday) {
      return encodedRedirect('error', '/signup', 'Alle Felder sind erforderlich')
    }

    const birthdayDate = new Date(birthday)
    const today = new Date()
    const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
    const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate())

    if (isNaN(birthdayDate.getTime()) || birthdayDate < minDate || birthdayDate > maxDate) {
      return encodedRedirect(
        'error',
        '/signup',
        'Ungültiges Geburtsdatum. Sie müssen mindestens 13 Jahre alt sein.',
      )
    }

    const formattedBirthday = birthdayDate.toISOString().split('T')[0]

    if (password !== confirmPassword) {
      return encodedRedirect('error', '/signup', 'Die Passwörter stimmen nicht überein')
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name, last_name, group_link, birthday: formattedBirthday },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      console.error(error.code + ' ' + error.message)
      return encodedRedirect('error', '/signup', 'Fehler bei der Registrierung')
    } else {
      return encodedRedirect(
        'success',
        '/signup',
        'Danke für die Registrierung! Bitte überprüfen Sie Ihre E-Mail für einen Bestätigungslink.',
      )
    }
  }

  if ('message' in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 p-4 w-full">
      <BackButtonServer href="/" className="static" />
      <div className="flex flex-1 w-full items-center justify-center">
        <form className="flex flex-col w-full justify-center gap-2 text-foreground [&>input]:mb-6 max-w-xl">
          <h1 className="text-2xl font-medium">Registrieren</h1>
          <p className="text-sm text text-foreground/60">
            Du hast schon einen Account?{' '}
            <Link className="text-blue-600 font-medium underline" href="/login">
              Anmelden
            </Link>
          </p>
          <div className="mt-8 flex flex-col gap-8 [&>input]:mb-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email" placeholder="you@example.com" autoComplete="email" required />
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="first_name">Vorname</Label>
                <Input name="first_name" placeholder="John" autoComplete="given-name" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="last_name">Nachname</Label>
                <Input name="last_name" placeholder="Doe" autoComplete="family-name" required />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="birthday">Geburtstag</Label>
              <Input name="birthday" type="date" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                showPasswordToggle={true}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                showPasswordToggle={true}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="group_link" className="flex items-center gap-2">
                Gruppencode{' '}
                <span
                  className="cursor-pointer"
                  title="Einen Gruppencode erhalten Sie von einem Gruppenadmin oder wenn Sie selbst eine Gruppe erstellen."
                >
                  <InfoIcon size={14} />
                </span>
              </Label>
              <Input
                type="text"
                name="group_link"
                value={queryId ? queryId : undefined}
                placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                autoComplete="off"
                disabled={queryId ? true : undefined}
              />
              {queryId && <input type="hidden" name="group_link" value={queryId} />}
            </div>
            <SubmitButton formAction={signUp} pendingText="Registriere...">
              Registrieren
            </SubmitButton>
          </div>
          <FormMessage message={searchParams} />
        </form>
      </div>
    </div>
  )
}
