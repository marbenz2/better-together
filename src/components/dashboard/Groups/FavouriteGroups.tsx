import { Badge } from '@/components/ui/badge'
import { CardTitle } from '@/components/ui/card'
import { UserGroupsType } from '@/types/dashboard'
import { StarIcon } from 'lucide-react'

interface FavouriteGroupsProps {
  userGroups: UserGroupsType
  setFavouriteGroup: (group_id: string, group_favourite: boolean) => void
}

export default function FavouriteGroups({ userGroups, setFavouriteGroup }: FavouriteGroupsProps) {
  const handleOnStarClick = async (group_id: string, group_favourite: boolean) => {
    try {
      await setFavouriteGroup(group_id, !group_favourite)
    } catch (error) {
      console.error('Fehler beim Setzen der Favoriten:', error)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full justify-center">
      <CardTitle className="text-xl">Favoriten</CardTitle>
      <div className="flex flex-wrap gap-4">
        {userGroups.map((group) => (
          <Badge
            key={group.group_id}
            className="flex items-center justify-between gap-4 cursor-pointer"
            onClick={() =>
              group.group_id && handleOnStarClick(group.group_id, group.favourite ?? false)
            }
          >
            {group.groups.name}
            {<StarIcon fill={`${group.favourite ? 'white' : 'none'}`} className={`w-4 h-4`} />}
          </Badge>
        ))}
      </div>
    </div>
  )
}
