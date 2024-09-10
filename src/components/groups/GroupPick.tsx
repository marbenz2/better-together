'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGroupStore } from '@/stores/groupStores'
import { StarIcon } from 'lucide-react'

export default function GroupPick() {
  const { userGroups, selectedGroupName, handleOnValueChange } = useGroupStore()

  return (
    <Card className="w-full max-w-7xl">
      <CardHeader>
        <CardTitle>Gruppe: </CardTitle>
        <Select
          onValueChange={handleOnValueChange}
          defaultValue={selectedGroupName || undefined}
          value={selectedGroupName || undefined}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {userGroups.map((group) => (
              <SelectItem key={group.group_id} value={group.groups.name}>
                <span className="flex items-center gap-2">
                  {group.favourite && <StarIcon fill="white" className="w-4 h-4" />}
                  {group.groups.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
    </Card>
  )
}
