import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SubmitButton } from '@/components/forms/submit-button'
import { Label } from '@/components/forms/label'
import { Input } from '@/components/forms/input'
import { FormMessage, Message } from '@/components/forms/form-message'
import { headers } from 'next/headers'
import { encodedRedirect } from '@/utils/utils'
import { BackButtonServer } from '@/components/ui/back-button-server'

export default async function ForgotPassword(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams
  const forgotPassword = async (formData: FormData) => {
    'use server'

    const email = formData.get('email')?.toString()
    const supabase = await createClient()
    const origin = (await headers()).get('origin')
    const callbackUrl = formData.get('callbackUrl')?.toString()

    if (!email) {
      return encodedRedirect('error', '/forgot-password', 'Email is required')
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
    })

    if (error) {
      console.error(error.message)
      return encodedRedirect('error', '/forgot-password', 'Could not reset password')
    }

    if (callbackUrl) {
      return redirect(callbackUrl)
    }

    return encodedRedirect(
      'success',
      '/forgot-password',
      'Check your email for a link to reset your password.',
    )
  }

  return (
    <div className="flex flex-col flex-1 p-4 w-full">
      <BackButtonServer href="/" className="static" />
      <div className="flex flex-1 w-full items-center justify-center">
        <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground [&>input]:mb-6 max-w-md p-4">
          <h1 className="text-2xl font-medium">Passwort zurücksetzen</h1>
          <p className="text-sm text-foreground/60">
            Du erinnerst dich wieder?{' '}
            <Link className="text-blue-600 font-medium underline" href="/login">
              Anmelden
            </Link>
          </p>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" required autoComplete="email" />
            <SubmitButton formAction={forgotPassword}>Passwort zurücksetzen</SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
      </div>
    </div>
  )
}
