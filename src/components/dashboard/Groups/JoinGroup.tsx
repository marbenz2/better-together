import React, { useState } from 'react'

import { Input } from '@/components/forms/input'
import { Label } from '@/components/forms/label'
import { SubmitButton } from '@/components/forms/submit-button'
import { CardTitle } from '@/components/ui/card'
import { LogInIcon } from 'lucide-react'

interface JoinGroupProps {
  joinGroup: (groupId: string) => Promise<void>
}

export default function JoinGroup({ joinGroup }: JoinGroupProps) {
  const [newJoinGroupName, setNewJoinGroupName] = useState('')

  const handleJoinGroup = async (formData: FormData) => {
    const groupIdInput = formData.get('groupIdJoin') as string
    try {
      await joinGroup(groupIdInput)
      setNewJoinGroupName('')
    } catch (error) {
      console.error('Fehler beim Beitreten der Gruppe:', error)
    }
  }

  const handleGroupJoinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewJoinGroupName(event.target.value)
  }

  return (
    <form className="flex flex-col gap-4 w-full">
      <Label htmlFor="groupIdJoin">
        <CardTitle className="text-xl">Einer Gruppe beitereten</CardTitle>
      </Label>
      <Input
        name="groupIdJoin"
        placeholder="Einladungscode eingeben"
        autoComplete="off"
        required
        value={newJoinGroupName}
        onChange={handleGroupJoinInputChange}
      />
      <SubmitButton
        aria-label="Gruppe beitreten"
        formAction={handleJoinGroup}
        pendingText="Signing In..."
        className="relative"
        disabled={newJoinGroupName === ''}
      >
        Gruppe beitreten
        <LogInIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
      </SubmitButton>
    </form>
  )
}
