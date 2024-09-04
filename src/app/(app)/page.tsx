import { createClient } from '@/utils/supabase/server'
import AuthButton from '@/components/AuthButton'
import Header from '@/components/Header'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { getUser } from '@/utils/supabase/queries'

export default async function Index() {
  const supabase = createClient()
  const [user] = await Promise.all([getUser(supabase)])

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <main className="flex-1 flex flex-col gap-20 max-w-4xl px-3 justify-center items-center py-12">
        <Header />
        {!user && (
          <div className="flex flex-col gap-8 items-center justify-center">
            <h2 className="text-lg lg:text-xl font-thin !leading-tight text-center">
              Leg los und plane deinen nächsten Urlaub.
            </h2>
            <AuthButton />
          </div>
        )}
        {user && (
          <div className="flex flex-col gap-16 items-center justify-center">
            <h2 className="text-4xl text-center">
              Willkommen zurück, {user.user_metadata.first_name}!
            </h2>
            <Link href={'protected/'}>
              <Button variant="outline">Zu den Reisen</Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
