import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/utils/supabase/queries'
import { redirect } from 'next/navigation'
import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'
import ClientStoreInitializer from '@/components/ClientStoreInitializer'
import ConditionalShowGroup from '@/components/groups/ShowGroup'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: user } = await getUser(supabase)

  if (!user) {
    redirect('/login')
  }

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
