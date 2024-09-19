'use client'

import React, { useState } from 'react'
import { Input } from '@/components/forms/input'
import { Label } from '@/components/forms/label'
import { SubmitButton } from '@/components/forms/submit-button'
import { CardTitle } from '@/components/ui/card'
import { PlusIcon } from 'lucide-react'
import { useGroupStore } from '@/stores/groupStores'
import { ResponsiveDialog } from '@/components/ResponsiveDialog'

export default function CreateGroup() {
  const [newGroupName, setNewGroupName] = useState('')
  const { createGroup } = useGroupStore()

  const handleCreateGroup = async () => {
    try {
      await createGroup(newGroupName)
      setNewGroupName('')
    } catch (error) {
      console.error('Fehler beim Erstellen der Gruppe:', error)
    }
  }

  const handleGroupCreateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewGroupName(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      <Label htmlFor="groupIdCreate">
        <CardTitle className="text-xl">Eine neue Gruppe erstellen</CardTitle>
      </Label>
      <div className="flex flex-col gap-4 w-full items-center">
        <Input
          type="text"
          id="groupIdCreate"
          name="groupIdCreate"
          placeholder="Gruppennamen eingeben"
          autoComplete="off"
          required
          value={newGroupName}
          onChange={handleGroupCreateInputChange}
          className="w-full max-w-lg"
        />
        <ResponsiveDialog
          title="Gruppe erstellen"
          message={`Bist du sicher, dass du die Gruppe "${newGroupName}" erstellen möchtest?`}
          confirmText="Gruppe erstellen"
          onConfirm={handleCreateGroup}
          disabled={newGroupName === ''}
        >
          <SubmitButton
            aria-label="Gruppe erstellen"
            pendingText="Erstelle Gruppe..."
            className="relative flex text-xs pl-10 w-full max-w-lg"
            disabled={newGroupName === ''}
          >
            <span className="xs:inline truncate">Gruppe erstellen</span>
            <PlusIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
          </SubmitButton>
        </ResponsiveDialog>
      </div>
    </form>
  )
}
