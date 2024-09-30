'use client'

import React, { useState } from 'react'

import { Input } from '@/components/forms/input'
import { Label } from '@/components/forms/label'
import { SubmitButton } from '@/components/forms/submit-button'
import { CardTitle } from '@/components/ui/card'
import { LogInIcon } from 'lucide-react'
import { useGroupStore } from '@/stores/groupStores'
import { ResponsiveDialog } from '@/components/ResponsiveDialog'
import { useUserStore } from '@/stores/userStore'

export default function JoinGroup() {
  const { user } = useUserStore()
  const { joinGroup } = useGroupStore()
  const [newJoinGroupName, setNewJoinGroupName] = useState('')

  const handleJoinGroup = async () => {
    try {
      await joinGroup(newJoinGroupName, user.id)
      setNewJoinGroupName('')
    } catch (error) {
      console.error('Fehler beim Beitreten der Gruppe:', error)
    }
  }

  const handleGroupJoinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewJoinGroupName(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      <Label htmlFor="groupIdJoin">
        <CardTitle className="text-xl">Einer Gruppe beitreten</CardTitle>
      </Label>
      <div className="flex flex-col gap-4 w-full items-center">
        <Input
          type="text"
          id="groupIdJoin"
          name="groupIdJoin"
          placeholder="Einladungscode eingeben"
          autoComplete="off"
          required
          value={newJoinGroupName}
          onChange={handleGroupJoinInputChange}
          className="w-full max-w-lg"
        />
        <ResponsiveDialog
          title="Gruppe beitreten"
          message={`Bist du sicher, dass du der Gruppe mit dem Einladungscode "${newJoinGroupName}" beitreten möchtest?`}
          confirmText="Gruppe beitreten"
          onConfirm={handleJoinGroup}
          disabled={newJoinGroupName === ''}
        >
          <SubmitButton
            aria-label="Gruppe beitreten"
            pendingText="Gruppe beitreten..."
            className="relative flex text-xs pl-10 w-full max-w-lg"
            disabled={newJoinGroupName === ''}
          >
            <span className="xs:inline truncate">Gruppe beitreten</span>
            <LogInIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
          </SubmitButton>
        </ResponsiveDialog>
      </div>
    </form>
  )
}
