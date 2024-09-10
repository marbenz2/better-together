'use client'

import {
  CardBackPlate,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import GroupManagement from '../groups/GroupManagement'

export default function Groups() {
  return (
    <CardBackPlate className="flex flex-col max-w-7xl w-full gap-8">
      <CardHeader>
        <CardTitle className="text-2xl">Gruppenverwaltung</CardTitle>
        <CardDescription>Hier findest du alle Informationen zu deinen Gruppen.</CardDescription>
      </CardHeader>
      <CardContent>
        <GroupManagement />
      </CardContent>
    </CardBackPlate>
  )
}
