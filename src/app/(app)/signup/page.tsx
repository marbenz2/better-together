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
import { RequiredLabel } from '@/components/ui/required-label'

export default async function Signup(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams
  const queryId =
    searchParams.hasOwnProperty('group_code') && searchParams['group_code' as keyof Message]

  const signUp = async (formData: FormData) => {
    'use server'

    const supabase = createClient()
    const origin = (await headers()).get('origin')

    // Validate origin
    if (!origin) {
      console.error('Origin header missing')
      return encodedRedirect('error', '/signup', 'Ein Konfigurationsfehler ist aufgetreten')
    }

    try {
      // Trim whitespace from inputs
      const email = formData.get('email')?.toString().trim()
      const password = formData.get('password')?.toString().trim()
      const confirmPassword = formData.get('confirmPassword')?.toString().trim()
      const first_name = formData.get('first_name')?.toString().trim()
      const last_name = formData.get('last_name')?.toString().trim()
      const birthday = formData.get('birthday') as string
      const group_link = formData.get('group_link')?.toString().trim()

      if (!email || !password || !confirmPassword || !first_name || !last_name || !birthday) {
        return encodedRedirect('error', '/signup', 'Alle Pflichtfelder müssen ausgefüllt werden')
      }

      if (password !== confirmPassword) {
        return encodedRedirect('error', '/signup', 'Die Passwörter stimmen nicht überein')
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return encodedRedirect(
          'error',
          '/signup',
          'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        )
      }

      const birthdayDate = new Date(birthday)
      const today = new Date()

      // Setze die Uhrzeiten auf Mitternacht für konsistenten Vergleich
      birthdayDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)

      const minDate = new Date(today)
      minDate.setFullYear(today.getFullYear() - 120)

      const maxDate = new Date(today)
      maxDate.setFullYear(today.getFullYear() - 13)

      if (isNaN(birthdayDate.getTime())) {
        return encodedRedirect('error', '/signup', 'Bitte geben Sie ein gültiges Geburtsdatum ein')
      }

      if (birthdayDate < minDate || birthdayDate > maxDate) {
        return encodedRedirect(
          'error',
          '/signup',
          'Ungültiges Geburtsdatum. Sie müssen mindestens 13 Jahre alt sein.',
        )
      }

      const formattedBirthday = birthdayDate.toISOString().split('T')[0]

      const {
        data: { user },
      } = await supabase.auth.getUser(email)

      if (user) {
        return encodedRedirect('error', '/signup', 'Diese E-Mail-Adresse ist bereits registriert')
      }

      if (group_link) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(group_link)) {
          return encodedRedirect('error', '/signup', 'Ungültiges Gruppencode-Format')
        }

        // Explizitere Fehlerbehandlung
        const { data: group, error: groupError } = await supabase
          .from('groups')
          .select('id')
          .eq('id', group_link)
          .single()

        if (groupError) {
          console.error('Gruppe Überprüfungsfehler:', groupError)
          return encodedRedirect('error', '/signup', 'Fehler bei der Überprüfung des Gruppencodes')
        }

        if (!group) {
          return encodedRedirect('error', '/signup', 'Die angegebene Gruppe existiert nicht')
        }
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name,
            last_name,
            group_link,
            birthday: formattedBirthday,
          },
          emailRedirectTo: `${origin}/auth/callback`,
        },
      })

      if (error) {
        console.error('Supabase signup error:', error)

        switch (error.message) {
          case 'User already registered':
            return encodedRedirect(
              'error',
              '/signup',
              'Diese E-Mail-Adresse ist bereits registriert',
            )
          case 'Password should be at least 8 characters':
            return encodedRedirect(
              'error',
              '/signup',
              'Das Passwort muss mindestens 8 Zeichen lang sein',
            )
          default:
            return encodedRedirect(
              'error',
              '/signup',
              'Fehler bei der Registrierung. Bitte versuchen Sie es später erneut.',
            )
        }
      }

      return encodedRedirect(
        'success',
        '/signup',
        'Danke für die Registrierung! Bitte überprüfen Sie Ihre E-Mail für einen Bestätigungslink.',
      )
    } catch (error) {
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        throw error
      }
      console.error('Unexpected signup error:', error)
      return encodedRedirect(
        'error',
        '/signup',
        'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
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
        <form
          className="flex flex-col w-full justify-center gap-2 text-foreground [&>input]:mb-6 max-w-xl"
          action={signUp}
        >
          <h1 className="text-2xl font-medium">Registrieren</h1>
          <p className="text-sm text text-foreground/60">
            Du hast schon einen Account?{' '}
            <Link className="text-blue-600 font-medium underline" href="/login">
              Anmelden
            </Link>
          </p>
          <p className="text-sm text-foreground/60">
            Felder mit <span className="text-sm text-info">*</span> sind Pflichtfelder.
          </p>

          <div className="mt-8 flex flex-col gap-8 [&>input]:mb-3">
            <div className="flex flex-col gap-2">
              <RequiredLabel htmlFor="email">Email</RequiredLabel>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <div className="flex flex-col gap-2">
                <RequiredLabel htmlFor="first_name">Vorname</RequiredLabel>
                <Input name="first_name" placeholder="John" autoComplete="given-name" required />
              </div>
              <div className="flex flex-col gap-2">
                <RequiredLabel htmlFor="last_name">Nachname</RequiredLabel>
                <Input name="last_name" placeholder="Doe" autoComplete="family-name" required />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <RequiredLabel htmlFor="birthday">Geburtstag</RequiredLabel>
              <Input name="birthday" type="date" required />
            </div>

            <div className="flex flex-col gap-2">
              <RequiredLabel htmlFor="password">Passwort</RequiredLabel>
              <Input
                type="password"
                name="password"
                minLength={8}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                showPasswordToggle={true}
              />
            </div>

            <div className="flex flex-col gap-2">
              <RequiredLabel htmlFor="confirmPassword">Passwort bestätigen</RequiredLabel>
              <Input
                type="password"
                name="confirmPassword"
                minLength={8}
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
                defaultValue={queryId ? queryId : ''}
                placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                autoComplete="off"
                readOnly={Boolean(queryId)}
              />
            </div>

            <SubmitButton pendingText="Registriere...">Registrieren</SubmitButton>
          </div>
          <FormMessage message={searchParams} />
        </form>
      </div>
    </div>
  )
}
