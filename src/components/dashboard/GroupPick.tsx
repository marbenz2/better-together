import { CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserGroupsType } from '@/types/dashboard'
import { StarIcon } from 'lucide-react'

interface GroupPickProps {
  userGroups: UserGroupsType
  selectedGroupName: string | null
  handleOnValueChange: (value: string) => void
}

export default function GroupPick({
  userGroups,
  selectedGroupName,
  handleOnValueChange,
}: GroupPickProps) {
  return (
    <span className="flex items-center gap-4">
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
    </span>
  )
}
