'use client'

import { Badge } from '@/components/ui/badge'
import { CardTitle } from '@/components/ui/card'
import { useGroupStore } from '@/stores/groupStores'

export default function GroupMembers() {
  const { publicProfiles } = useGroupStore()

  return (
    <div className="flex flex-col gap-4 w-full justify-center">
      <CardTitle className="text-xl">Gruppenmitglieder</CardTitle>
      <div className="flex flex-wrap gap-4">
        {publicProfiles &&
          publicProfiles.length > 1 &&
          publicProfiles.map((member) => (
            <Badge
              key={member.id}
              className="flex items-center justify-between gap-4 cursor-pointer"
            >
              {member.first_name} {member.last_name}
            </Badge>
          ))}
        {publicProfiles && publicProfiles.length === 1 && (
          <Badge>
            {publicProfiles[0].first_name} {publicProfiles[0].last_name}
          </Badge>
        )}
      </div>
    </div>
  )
}
