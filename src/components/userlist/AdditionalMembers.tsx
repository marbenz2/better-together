import { useTripStore } from '@/stores/tripStores'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

interface AdditionalMembersProps {
  userId: string
  variant?: 'button' | 'text'
}

export default function AdditionalMembers({ userId, variant = 'button' }: AdditionalMembersProps) {
  const { tripMembers } = useTripStore()
  const additionalLength = tripMembers.find((m) => m.user_id === userId)?.additional?.length || 0
  const additionalMembers = tripMembers.find((m) => m.user_id === userId)?.additional || []

  if (additionalLength === 0) return null

  const content = (
    <>
      {variant === 'button' && <PlusIcon className="w-4 h-4" />}
      <span className={variant === 'button' ? 'truncate xs:inline' : ''}>{additionalLength}</span>
    </>
  )

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {variant === 'button' ? (
          <Button className="w-fit flex items-center justify-center cursor-default">
            {content}
          </Button>
        ) : (
          <span className="text-muted-foreground"> (+{content})</span>
        )}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex flex-col gap-2">
          {additionalMembers.map((member, index) => {
            const birthDate = new Date(member)
            const today = new Date()
            const age = today.getFullYear() - birthDate.getFullYear()
            let adjustedAge = age
            const monthDiff = today.getMonth() - birthDate.getMonth()
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              adjustedAge--
            }

            return (
              <p key={member + index} className="text-sm font-normal">
                Zusätzliches Mitglied {index + 1}:{' '}
                {birthDate.toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}{' '}
                ({adjustedAge} Jahre)
              </p>
            )
          })}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
