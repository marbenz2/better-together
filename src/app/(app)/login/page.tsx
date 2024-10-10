import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SubmitButton } from '@/components/forms/submit-button'
import { Label } from '@/components/forms/label'
import { Input } from '@/components/forms/input'
import { FormMessage, Message } from '@/components/forms/form-message'
import { encodedRedirect } from '@/utils/utils'
import { BackButtonServer } from '@/components/ui/back-button-server'

export default function Login({ searchParams }: { searchParams: Message }) {
  const signIn = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return encodedRedirect('error', '/login', 'Could not authenticate user')
    }

    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      console.error('Message: ', userError?.message || 'User not found')
      return { error: 'User not found' }
    }

    /* const group_link = userData.user.user_metadata.group_link */

    /*  if (group_link) {
      const { error: groupError } = await supabase
        .from('group_members')
        .insert([{ group_id: group_link, user_id: userData.user.id, role: 'member' }])

      if (groupError) {
        console.error(groupError.message)
        return { error: 'Fehler beim Hinzufügen des Benutzers zur Gruppe' }
      }

      const { error: userUpdateError } = await supabase.auth.updateUser({
        data: { group_link: null },
      })

      if (userUpdateError) {
        console.error(userUpdateError.message)
        return { error: 'Error trying to update user' }
      }
    } */

    return redirect('/protected')
  }

  return (
    <div className="flex flex-col flex-1 p-4 w-full">
      <BackButtonServer href="/" className="static" />
      <div className="flex flex-1 w-full justify-center">
        <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground [&>input]:mb-6 max-w-md p-4">
          <h1 className="text-2xl font-medium">Anmelden</h1>
          <p className="text-sm text-foreground/60">
            Du hast noch keinen Account?{' '}
            <Link className="text-blue-600 font-medium underline" href="/signup">
              Registrieren
            </Link>
          </p>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Passwort</Label>
              <Link className="text-sm text-blue-600 underline" href="/forgot-password">
                Passwort vergessen?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              showPasswordToggle={true}
            />
            <SubmitButton formAction={signIn} pendingText="Signing In...">
              Anmelden
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
      </div>
    </div>
  )
}
