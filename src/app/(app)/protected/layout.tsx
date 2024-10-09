import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'
import { getUser } from '@/utils/supabase/queries'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ClientStoreInitializer from '@/components/ClientStoreInitializer'
import ConditionalShowGroup from '@/components/groups/ShowGroup'

async function setUserIdInDatabase(supabase: any, userId: string) {
  try {
    const { error } = await supabase.rpc('set_current_user_id', { user_id: userId })
    if (error) {
      console.error('Error setting user ID in database:', error)
    } else {
      console.log('User ID set in database:', userId)
    }
  } catch (err) {
    console.error('Unexpected error while setting user ID:', err)
  }
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: user } = await getUser(supabase)

  if (!user) {
    redirect('/login')
  }

  await setUserIdInDatabase(supabase, user.id)

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center">
      <div className="w-full">
        <Navigation />
      </div>
      <div className="flex-1 flex flex-col items-center gap-8 w-full px-2 md:px-4">
        <ClientStoreInitializer userId={user.id}>
          <ConditionalShowGroup />
          {children}
        </ClientStoreInitializer>
      </div>

      <Footer />
    </div>
  )
}
