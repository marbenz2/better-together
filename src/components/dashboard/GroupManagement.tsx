import React, { useState } from 'react'
import { copyToClipboard } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/forms/input'
import { SubmitButton } from '@/components/forms/submit-button'
import { Label } from '@/components/forms/label'
import { CopyIcon, DoorOpenIcon, PlusIcon, StarIcon, TrashIcon } from 'lucide-react'
import { ResponsiveDialog } from '../ResponsiveDialog'
import { CardTitle, CardDescription } from '@/components/ui/card'
import type { UserGroupsType } from '@/types/dashboard'
import { useNotifications } from '@/hooks/use-notifications'

interface GroupManagementProps {
  userGroups: UserGroupsType
  groupId: string | false | null
  createGroup: (groupName: string) => Promise<void>
  joinGroup: (groupId: string) => Promise<void>
  deleteGroup: (groupId: string) => Promise<void>
  renameGroup: (groupId: string, newName: string) => Promise<void>
  setFavourite: (groupId: string, favourite: boolean) => Promise<void>
}

export default function GroupManagement({
  userGroups,
  groupId,
  createGroup,
  joinGroup,
  deleteGroup,
  renameGroup,
  setFavourite,
}: GroupManagementProps) {
  const { showNotification } = useNotifications()
  const [newGroupName, setNewGroupName] = useState('')
  const [newJoinGroupName, setNewJoinGroupName] = useState('')
  const [changeGroupName, setChangeGroupName] = useState('')

  const handleCreateGroup = async (formData: FormData) => {
    const groupName = formData.get('groupIdCreate') as string
    try {
      await createGroup(groupName)
      setNewGroupName('')
    } catch (error) {
      console.error('Fehler beim Erstellen der Gruppe:', error)
    }
  }

  const handleJoinGroup = async (formData: FormData) => {
    const groupIdInput = formData.get('groupIdJoin') as string
    try {
      await joinGroup(groupIdInput)
      setNewJoinGroupName('')
    } catch (error) {
      console.error('Fehler beim Beitreten der Gruppe:', error)
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deleteGroup(groupId)
    } catch (error) {
      console.error('Fehler beim Löschen der Gruppe:', error)
    }
  }

  const handleRenameGroup = async (formData: FormData) => {
    const groupId = formData.get('groupIdChange') as string
    const newName = formData.get('newGroupName') as string
    try {
      await renameGroup(groupId, newName)
      setChangeGroupName('')
    } catch (error) {
      console.error('Fehler beim Umbenennen der Gruppe:', error)
    }
  }

  const handleOnStarClick = async (group_id: string, group_favourite: boolean) => {
    try {
      await setFavourite(group_id, group_favourite)
    } catch (error) {
      console.error('Fehler beim Setzen der Favoriten:', error)
    }
  }

  const handleOnCopyClick = (groupId: string) => {
    if (!groupId || groupId === '') {
      showNotification(
        'Fehler beim Kopieren des Einladungscodes',
        'Der Einladungscode ist leer. Bitte geben Sie einen gültigen Einladungscode ein.',
        'destructive',
      )
    }
    copyToClipboard(groupId)
    showNotification(
      'Einladungscode kopiert',
      `Der Einladungscode "${groupId}" wurde in die Zwischenablage kopiert.`,
      'success',
    )
  }

  const handleGroupCreateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewGroupName(event.target.value)
  }

  const handleGroupJoinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewJoinGroupName(event.target.value)
  }

  const handleGroupRenameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangeGroupName(event.target.value)
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem className="border-b-0" value="Gruppenmanagement">
        <AccordionTrigger>
          <CardDescription>Gruppenmanagement</CardDescription>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-8">
            {/* Favoriten */}
            {userGroups && userGroups.length > 0 && (
              <div className="flex flex-col gap-4 w-full justify-center">
                <CardTitle className="text-xl">Favoriten</CardTitle>
                <div className="flex flex-wrap gap-4">
                  {userGroups.map((group) => (
                    <Badge
                      key={group.group_id}
                      className="flex items-center justify-between gap-4 cursor-pointer"
                      onClick={() =>
                        group.group_id &&
                        handleOnStarClick(group.group_id, group.favourite ?? false)
                      }
                    >
                      {group.groups.name}
                      {
                        <StarIcon
                          fill={`${group.favourite === true ? 'white' : 'none'}`}
                          className={`w-4 h-4`}
                        />
                      }
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {userGroups && userGroups.length > 0 && (
              <div className="flex flex-col gap-4 w-full justify-center">
                <CardTitle className="text-xl">
                  Einladungscode für Gruppe &quot;
                  {userGroups.find((group) => group.group_id === groupId)?.groups.name}&quot;
                </CardTitle>
                <Button
                  onClick={() => handleOnCopyClick(groupId ? groupId : '')}
                  className="flex gap-4 text-xs relative px-10"
                  aria-label="Einladungscode kopieren"
                  variant="outline"
                >
                  <span className="xs:inline truncate">{groupId}</span>
                  <CopyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
                </Button>
              </div>
            )}
            <div className="flex flex-col gap-12 w-full max-w-lg lg:max-w-full lg:flex-row">
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
                  <DoorOpenIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
                </SubmitButton>
              </form>
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
              {userGroups &&
                groupId &&
                userGroups.find(
                  (group) => group.group_id === groupId && group.role === 'admin',
                ) && (
                  <form className="flex flex-col gap-4 w-full">
                    <Label htmlFor="newGroupName">
                      <CardTitle className="text-xl">Gruppe umbenennen</CardTitle>
                    </Label>
                    <Input
                      type="text"
                      id="newGroupName"
                      name="newGroupName"
                      placeholder={
                        userGroups.find((group) => group.group_id === groupId)?.groups.name || ''
                      }
                      autoComplete="off"
                      required
                      value={changeGroupName}
                      onChange={handleGroupRenameInputChange}
                    />
                    <input type="hidden" name="groupIdChange" value={groupId} />
                    <SubmitButton
                      aria-label="Gruppe umbenennen"
                      formAction={handleRenameGroup}
                      pendingText="Umbenennen der Gruppe..."
                      className="relative"
                      disabled={changeGroupName === ''}
                    >
                      Gruppe umbenennen
                      <PlusIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
                    </SubmitButton>
                  </form>
                )}
            </div>
            {userGroups &&
              groupId &&
              userGroups.find((group) => group.group_id === groupId && group.role === 'admin') && (
                <div className="flex flex-col gap-4 w-full justify-center">
                  <Accordion type="single" collapsible>
                    <AccordionItem className="border-b-0" value="deleteGroup">
                      <AccordionTrigger>
                        <CardTitle className="text-xl">Gruppe löschen</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ResponsiveDialog onDelete={() => handleDeleteGroup(groupId)}>
                          <div className="flex flex-col gap-4 w-full">
                            <Button
                              className="relative flex text-xs px-10"
                              aria-label="Gruppe löschen"
                              variant="destructive"
                            >
                              Gruppe &nbsp;&quot;
                              <span className="xs:inline truncate">
                                {
                                  userGroups.find((group) => group.group_id === groupId)?.groups
                                    .name
                                }
                              </span>
                              &quot;&nbsp; löschen
                              <TrashIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
                            </Button>
                          </div>
                        </ResponsiveDialog>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
