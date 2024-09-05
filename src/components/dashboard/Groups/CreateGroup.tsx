import React, { useState } from 'react'
import { Input } from '@/components/forms/input'
import { Label } from '@/components/forms/label'
import { SubmitButton } from '@/components/forms/submit-button'
import { CardTitle } from '@/components/ui/card'
import { PlusIcon } from 'lucide-react'

interface CreateGroupProps {
  createGroup: (groupName: string) => Promise<void>
}

export default function CreateGroup({ createGroup }: CreateGroupProps) {
  const [newGroupName, setNewGroupName] = useState('')

  const handleCreateGroup = async (formData: FormData) => {
    const groupName = formData.get('groupIdCreate') as string
    try {
      await createGroup(groupName)
      setNewGroupName('')
    } catch (error) {
      console.error('Fehler beim Erstellen der Gruppe:', error)
    }
  }

  const handleGroupCreateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewGroupName(event.target.value)
  }

  return (
    <form className="flex flex-col gap-4 w-full">
      <Label htmlFor="groupIdCreate">
        <CardTitle className="text-xl">Eine neue Gruppe erstellen</CardTitle>
      </Label>
      <Input
        type="text"
        name="groupIdCreate"
        placeholder="Gruppennamen eingeben"
        autoComplete="off"
        required
        value={newGroupName}
        onChange={handleGroupCreateInputChange}
      />
      <SubmitButton
        aria-label="Gruppe erstellen"
        formAction={handleCreateGroup}
        pendingText="Erstelle Gruppe..."
        className="relative"
        disabled={newGroupName === ''}
      >
        Gruppe erstellen
        <PlusIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
      </SubmitButton>
    </form>
  )
}
