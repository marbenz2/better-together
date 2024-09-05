'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { copyToClipboard } from '@/lib/utils'
import {
  addNewGroup,
  joinExistingGroup,
  setFavouriteGroup,
  deleteExistingGroup,
  renameExistingGroup,
} from '@/utils/supabase/queries'
import {
  CardBackPlate,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import TripCard from '@/components/TripCard'
import { Input } from '@/components/forms/input'
import { SubmitButton } from '@/components/forms/submit-button'
import { Label } from '@/components/forms/label'
import { CopyIcon, DoorOpenIcon, PlusIcon, StarIcon, TrashIcon } from 'lucide-react'
import type { Tables } from 'database.types'
import { ResponsiveDialog } from './ResponsiveDialog'

type Trips = Tables<'trips'>
type TripMembers = Tables<'trip_members'>
type Groups = Tables<'groups'>
type GroupMembers = Tables<'group_members'>
type SubscribedTrips = {
  trips: Trips
  subscribed_at: TripMembers['subscribed_at']
}[]
type UserGroups = {
  group_id: GroupMembers['group_id']
  favourite: GroupMembers['favourite']
  role: GroupMembers['role']
  groups: Groups
}[]
type NotificationMessage = {
  title: string
  message: string
  variant: 'default' | 'destructive' | 'success'
} | null

interface DashboardProps {
  user: any | null
  userGroups: UserGroups | null
  subscribedTrips: SubscribedTrips | null
}

export default function Dashboard({
  user,
  userGroups: initialUserGroups,
  subscribedTrips,
}: DashboardProps) {
  const supabase = createClient()
  const { toast } = useToast()
  const [userGroups, setUserGroups] = useState<UserGroups>(initialUserGroups || [])
  const [groupId, setGroupId] = useState(
    (userGroups &&
      userGroups.length > 0 &&
      userGroups.find((group) => group.favourite === true)?.groups.id) ??
      (userGroups && userGroups.length > 0 ? userGroups[0].groups.id : null),
  )
  const [selectedGroupName, setSelectedGroupName] = useState<string | null>(
    userGroups?.find((group) => group.favourite)?.groups.name ||
      userGroups?.[0]?.groups.name ||
      null,
  )
  const [notificationMessage, setNotificationMessage] = useState<NotificationMessage>(null)
  const [newGroupName, setNewGroupName] = useState('')
  const [newJoinGroupName, setNewJoinGroupName] = useState('')
  const [changeGroupName, setChangeGroupName] = useState('')

  useEffect(() => {
    if (notificationMessage) {
      toast({
        title: notificationMessage.title,
        description: notificationMessage.message,
        variant: notificationMessage.variant,
      })
      setNotificationMessage(null)
    }
  }, [notificationMessage, toast])

  const createGroup = async (formData: FormData) => {
    const groupIdInput = formData.get('groupIdCreate') as string
    const { data, error } = await addNewGroup(supabase, user.id, groupIdInput)
    if (!error && data) {
      setUserGroups((prevUserGroups) => [
        ...prevUserGroups,
        {
          group_id: data.id,
          favourite: true,
          role: 'admin',
          groups: {
            id: data.id,
            name: groupIdInput,
            created_at: data.created_at,
            created_by: data.created_by,
            description: data.description,
          },
        },
      ])
      setNewGroupName('')
      setNotificationMessage({
        title: 'Gruppe erstellt',
        message: `Die Gruppe "${groupIdInput}" wurde erfolgreich erstellt.`,
        variant: 'success',
      })
    }
    if (error) {
      const errorMessages: {
        [key: string]: NotificationMessage
      } = {
        '23505': {
          title: 'Fehler beim Erstellen der Gruppe',
          message: `Der Gruppenname "${groupIdInput}" ist bereits vergeben.`,
          variant: 'destructive',
        },
      }

      const errorMessage = errorMessages[error.code] || {
        title: 'Fehler beim Erstellen der Gruppe',
        message:
          'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
        variant: 'destructive',
      }

      setNotificationMessage(errorMessage)
    }
  }

  const joinGroup = async (formData: FormData) => {
    const groupIdInput = formData.get('groupIdJoin') as string
    const { groupData, error } = await joinExistingGroup(supabase, user.id, groupIdInput)
    if (!error && groupData) {
      setUserGroups((prevUserGroups) => [
        ...prevUserGroups,
        {
          group_id: groupData.id,
          favourite: false,
          role: 'member',
          groups: {
            id: groupData.id,
            name: groupData.name,
            created_at: groupData.created_at,
            created_by: groupData.created_by,
            description: groupData.description,
          },
        },
      ])
      setNewJoinGroupName('')
      return toast({
        title: 'Gruppe beigetreten',
        description: `Du bist der Gruppe "${groupData.name}" erfolgreich beigetreten.`,
        variant: 'success',
      })
    }
    if (error) {
      const errorMessages: {
        [key: string]: NotificationMessage
      } = {
        '23505': {
          title: 'Fehler beim Beitreten der Gruppe',
          message: `Du bist bereits Teil der Gruppe "${groupData?.name}".`,
          variant: 'destructive',
        },
        '22P02': {
          title: 'Fehler beim Beitreten der Gruppe',
          message: 'Das war kein korrektes Format eines Einladungslinks.',
          variant: 'destructive',
        },
        '23503': {
          title: 'Fehler beim Beitreten der Gruppe',
          message: 'Falscher Einladungslink.',
          variant: 'destructive',
        },
      }

      const errorCode = typeof error === 'string' ? error : error.code
      const errorMessage = errorMessages[errorCode] || {
        title: 'Fehler beim Beitreten der Gruppe',
        message:
          'Es ist ein Fehler beim Beitreten der Gruppe aufgetreten, bitte versuche es später erneut.',
        variant: 'destructive',
      }

      setNotificationMessage(errorMessage)
    }
  }

  const deleteGroup = async (groupId: string) => {
    const { error } = await deleteExistingGroup(supabase, user.id, groupId)
    if (!error) {
      setUserGroups((prevUserGroups) => {
        const updatedGroups = prevUserGroups.filter((group) => group.group_id !== groupId)

        if (updatedGroups.length > 0) {
          const nextGroup = updatedGroups.find((group) => group.favourite) || updatedGroups[0]
          setGroupId(nextGroup.group_id)
          setSelectedGroupName(nextGroup.groups.name)
          setNotificationMessage({
            title: 'Gruppe gelöscht',
            message: `Die Gruppe wurde gelöscht. Sie sind jetzt in der Gruppe "${nextGroup.groups.name}".`,
            variant: 'success',
          })
        } else {
          setGroupId(null)
          setSelectedGroupName(null)
          setNotificationMessage({
            title: 'Gruppe gelöscht',
            message: 'Die letzte Gruppe wurde gelöscht. Sie sind jetzt in keiner Gruppe mehr.',
            variant: 'success',
          })
        }

        return updatedGroups
      })
    }
    if (error) {
      {
        setNotificationMessage({
          title: 'Fehler beim Löschen der Gruppe',
          message: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
          variant: 'destructive',
        })
      }
    }
  }

  const renameGroup = async (formData: FormData) => {
    const groupId = formData.get('groupIdChange') as string
    const newName = formData.get('newGroupName') as string
    const { error } = await renameExistingGroup(supabase, user.id, groupId, newName)
    if (!error) {
      setUserGroups((prevUserGroups) =>
        prevUserGroups.map((group) =>
          group.group_id === groupId
            ? { ...group, groups: { ...group.groups, name: newName } }
            : group,
        ),
      )
      setChangeGroupName('')
      setSelectedGroupName(newName)
      setNotificationMessage({
        title: 'Gruppe umbenannt',
        message: `Die Gruppe wurde erfolgreich in "${newName}" umbenannt.`,
        variant: 'success',
      })
    }
    if (error) {
      const errorMessages: {
        [key: string]: NotificationMessage
      } = {
        '23505': {
          title: 'Fehler beim Umbennen der Gruppe',
          message: `Der Gruppenname "${newName}" ist bereits vergeben.`,
          variant: 'destructive',
        },
      }

      const errorMessage = errorMessages[error.code] || {
        title: 'Fehler beim Umbennen der Gruppe',
        message:
          'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
        variant: 'destructive',
      }

      setNotificationMessage(errorMessage)
    }
  }

  const handleOnValueChange = (value: string) => {
    const selectedGroup = userGroups.find((group) => group.groups.name === value)
    if (selectedGroup) {
      setGroupId(selectedGroup.groups.id)
      setSelectedGroupName(value)
    }
  }

  const handleOnStarClick = async (group_id: string, group_favourite: boolean) => {
    const newFavourite = !group_favourite
    const { error } = await setFavouriteGroup(supabase, user.id, group_id, newFavourite)
    if (!error) {
      setUserGroups((prevUserGroups) =>
        prevUserGroups.map((group) =>
          group.group_id === group_id ? { ...group, favourite: newFavourite } : group,
        ),
      )
    } else {
      toast({
        title: 'Fehler beim Aktualisieren des Favoritenstatus',
        description: 'Es ist ein Fehler aufgetreten, bitte versuchen Sie es später erneut.',
        variant: 'destructive',
      })
    }
  }

  const handleOnCopyClick = (groupId: string) => {
    if (!groupId || groupId === '') {
      return toast({
        title: 'Fehler beim Kopieren des Einladungscodes',
        description: 'Es ist ein Fehler aufgetreten, bitte versuchen Sie es später erneut.',
        variant: 'destructive',
      })
    }
    copyToClipboard(groupId)
    toast({
      title: 'Einladungscode kopiert',
      description: `Der Einladungscode "${groupId}" wurde in die Zwischenablage kopiert.`,
      variant: 'success',
    })
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

  const filteredSubscribedTrips = useMemo(() => {
    return (
      subscribedTrips?.filter((subscribedTrip) => subscribedTrip.trips.group_id === groupId) ?? []
    )
  }, [subscribedTrips, groupId])

  return (
    <CardBackPlate className="flex flex-col max-w-7xl w-full gap-8">
      <CardHeader>
        <CardTitle className="text-2xl">Hallo {user?.user_metadata.first_name}!</CardTitle>
        <CardDescription>Hier findest du alle Informationen zu deinen Reisen.</CardDescription>
      </CardHeader>
      <CardContent>
        {userGroups && userGroups.length > 1 && (
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
        )}
        {userGroups && userGroups.length === 1 && (
          <CardTitle>Gruppe: {userGroups[0].groups.name}</CardTitle>
        )}
        {userGroups && userGroups.length === 0 && <CardTitle>Du bist in keiner Gruppe.</CardTitle>}
        <Accordion type="single" collapsible>
          <AccordionItem className="border-b-0" value="Gruppenmanagement">
            <AccordionTrigger>
              <CardDescription>Gruppenmanagement</CardDescription>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-8">
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
                      formAction={joinGroup}
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
                      formAction={createGroup}
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
                            userGroups.find((group) => group.group_id === groupId)?.groups.name ||
                            ''
                          }
                          autoComplete="off"
                          required
                          value={changeGroupName}
                          onChange={handleGroupRenameInputChange}
                        />
                        <input type="hidden" name="groupIdChange" value={groupId} />
                        <SubmitButton
                          aria-label="Gruppe umbenennen"
                          formAction={renameGroup}
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
                  userGroups.find(
                    (group) => group.group_id === groupId && group.role === 'admin',
                  ) && (
                    <div className="flex flex-col gap-4 w-full justify-center">
                      <Accordion type="single" collapsible>
                        <AccordionItem className="border-b-0" value="deleteGroup">
                          <AccordionTrigger>
                            <CardTitle className="text-xl">Gruppe löschen</CardTitle>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ResponsiveDialog onDelete={() => deleteGroup(groupId)}>
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
      </CardContent>
      <CardContent className="flex flex-col gap-4">
        <CardTitle>Angemeldete Reisen:</CardTitle>
        <div className="block xs:flex gap-4">
          {filteredSubscribedTrips && filteredSubscribedTrips.length > 0 ? (
            filteredSubscribedTrips.map((filteredSubscribedTrip) =>
              filteredSubscribedTrip ? (
                <TripCard
                  key={filteredSubscribedTrip.trips.id}
                  trip={filteredSubscribedTrip.trips}
                  subscribed_at={filteredSubscribedTrip.subscribed_at}
                />
              ) : null,
            )
          ) : (
            <CardDescription>
              Du hast noch keine Reisen gebucht. Schau dir{' '}
              <Link href={'/protected/trips'} className="underline decoration-dashed">
                hier
              </Link>{' '}
              alle Reisen an!
            </CardDescription>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col xs:flex-row gap-4 w-full pt-12">
        <Link href={'protected/trips'} className="w-full xs:w-fit">
          <Button aria-label="Neue Reisen ansehen" className="w-full">
            Neue Reisen ansehen
          </Button>
        </Link>
        <Link href={'/protected/payments'} className="w-full xs:w-fit">
          <Button aria-label="Zahlungen ansehen" className="w-full ">
            Zahlungen ansehen
          </Button>
        </Link>
      </CardFooter>
    </CardBackPlate>
  )
}
