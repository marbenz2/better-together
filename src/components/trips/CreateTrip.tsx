'use client'

import { Input } from '@/components/forms/input'
import { Label } from '@/components/forms/label'
import { SubmitButton } from '@/components/forms/submit-button'
import { ResponsiveDialog } from '@/components/ResponsiveDialog'
import { CardTitle } from '@/components/ui/card'
import { RequiredLabel } from '@/components/ui/required-label'
import { useGroupStore } from '@/stores/groupStores'
import { useTripStore } from '@/stores/tripStores'
import { useUserStore } from '@/stores/userStore'
import { GroupTripType } from '@/types/trips'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { BackButtonClient } from '../ui/back-button-client'
import { googleMapsUrl } from '@/lib/utils'

type TripDataState = {
  [K in keyof Omit<GroupTripType, 'id' | 'available_spots' | 'max_spots'>]: K extends
    | 'beds'
    | 'rooms'
    | 'street_number'
    ? number | ''
    : GroupTripType[K]
}

const INITIAL_TRIP_DATA: TripDataState = {
  created_by: '',
  anreise_link: '',
  area: '',
  beds: '' as unknown as number,
  date_from: '',
  date_to: '',
  down_payment: null,
  final_payment: null,
  full_payment: null,
  group_id: '',
  image: '',
  land: '',
  name: '',
  ort: '',
  plz: '',
  rooms: '' as unknown as number,
  status: 'upcoming',
  street: '',
  street_number: '' as unknown as number,
}

export default function CreateTrip() {
  const router = useRouter()
  const { createTrip } = useTripStore()
  const { groupId } = useGroupStore()
  const { user } = useUserStore()

  const [tripData, setTripData] = useState<TripDataState>(INITIAL_TRIP_DATA)
  const [isFormValid, setIsFormValid] = useState(false)

  const validateForm = useCallback(() => {
    const requiredFields: (keyof TripDataState)[] = [
      'name',
      'date_from',
      'date_to',
      'land',
      'plz',
      'ort',
      'street',
      'street_number',
      'rooms',
      'beds',
      'anreise_link',
      'image',
    ]
    const isValid = requiredFields.every(
      (field) =>
        tripData[field] !== '' &&
        tripData[field] !== null &&
        (field !== 'street_number' ||
          (typeof tripData[field] === 'number' && !isNaN(tripData[field] as number))),
    )
    setIsFormValid(isValid)
    return isValid
  }, [tripData])

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setTripData((prevData) => ({
      ...prevData,
      [name]: ['beds', 'rooms', 'street_number'].includes(name)
        ? value === ''
          ? ('' as unknown as number)
          : parseInt(value, 10)
        : value,
    }))
  }, [])

  const handleCreateTrip = async () => {
    try {
      const anreiseLink = googleMapsUrl(
        tripData.name,
        tripData.land,
        tripData.street,
        tripData.street_number || 0,
        tripData.plz,
        tripData.ort,
      )

      await createTrip({
        ...tripData,
        anreise_link: anreiseLink,
      } as GroupTripType)
      setTripData(INITIAL_TRIP_DATA)
      router.push('/protected/trips')
    } catch (error) {
      console.error('Fehler beim Erstellen der Reise:', error)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('id', groupId ?? '')

    try {
      const response = await fetch('/api/image-upload', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error('Fehler beim Hochladen des Bildes')
      }
      const data = await response.json()
      setTripData((prevData) => ({
        ...prevData,
        image: data.imageUrl,
      }))
    } catch (error) {
      console.error('Fehler beim Hochladen des Bildes:', error)
    }
  }

  useEffect(() => {
    validateForm()
  }, [tripData, validateForm])

  useEffect(() => {
    if (groupId) {
      setTripData((prevData) => ({
        ...prevData,
        group_id: groupId,
        created_by: user.id,
      }))
    }
  }, [groupId, user.id])

  if (!groupId) {
    return <div>Keine Gruppe gefunden</div>
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto">
      <BackButtonClient className="static" />
      <form className="flex flex-col gap-4 w-full items-center" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 w-full max-w-lg">
          <Label>
            <CardTitle className="text-xl">Eine neue Reise erstellen</CardTitle>
          </Label>
          <div className="flex flex-col gap-2 w-full">
            <RequiredLabel htmlFor="image">Bild der Reise</RequiredLabel>
            <Input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              required
              onChange={handleImageUpload}
              className="w-full"
            />
            {tripData.image ? (
              <div className="relative flex w-full h-64">
                <Image
                  src={tripData.image}
                  alt="Vorschau des hochgeladenen Bildes"
                  fill
                  className="object-contain"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="relative flex w-full h-64 items-center justify-center overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <polygon points="0,0 100,0 0,100" fill="rgba(255,255,255,0.2)" />
                  <polygon points="100,0 100,100 0,100" fill="rgba(255,255,255,0.3)" />
                </svg>
              </div>
            )}
          </div>
          <RequiredLabel htmlFor="name">Reisename</RequiredLabel>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Tripname eingeben"
            autoComplete="off"
            required
            value={tripData.name}
            onChange={handleInputChange}
            className="w-full"
          />
          <div className="flex gap-2 w-full">
            <div className="flex flex-col gap-2 w-full">
              <RequiredLabel htmlFor="date_from">Startdatum</RequiredLabel>
              <Input
                type="date"
                id="date_from"
                name="date_from"
                placeholder="Startdatum eingeben"
                autoComplete="off"
                required
                value={tripData.date_from}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <RequiredLabel htmlFor="date_to">Enddatum</RequiredLabel>
              <Input
                type="date"
                id="date_to"
                name="date_to"
                placeholder="Enddatum eingeben"
                autoComplete="off"
                required
                value={tripData.date_to}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <RequiredLabel htmlFor="land">Land</RequiredLabel>
            <Input
              type="text"
              id="land"
              name="land"
              placeholder="Land eingeben"
              autoComplete="off"
              required
              value={tripData.land}
              onChange={handleInputChange}
              className="w-full"
            />
            <Label htmlFor="area">Gebiet</Label>
            <Input
              type="text"
              id="area"
              name="area"
              placeholder="Gebiet eingeben"
              autoComplete="off"
              value={tripData.area || ''}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 w-full">
            <div className="flex flex-col gap-2 w-full">
              <RequiredLabel htmlFor="plz">PLZ</RequiredLabel>
              <Input
                type="text"
                id="plz"
                name="plz"
                placeholder="PLZ eingeben"
                autoComplete="off"
                required
                value={tripData.plz}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <RequiredLabel htmlFor="ort">Ort</RequiredLabel>
              <Input
                type="text"
                id="ort"
                name="ort"
                placeholder="Ort eingeben"
                autoComplete="off"
                required
                value={tripData.ort}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <div className="flex flex-col gap-2 w-full">
              <RequiredLabel htmlFor="street">Straße</RequiredLabel>
              <Input
                type="text"
                id="street"
                name="street"
                placeholder="Straße eingeben"
                autoComplete="off"
                required
                value={tripData.street}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <RequiredLabel htmlFor="street_number">Hausnummer</RequiredLabel>
              <Input
                type="text"
                id="street_number"
                name="street_number"
                placeholder="Hausnummer eingeben"
                autoComplete="off"
                required
                value={tripData.street_number}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <div className="flex flex-col gap-2 w-full">
              <RequiredLabel htmlFor="rooms">Zimmer</RequiredLabel>
              <Input
                type="number"
                id="rooms"
                name="rooms"
                placeholder="Zimmer eingeben"
                autoComplete="off"
                required
                value={tripData.rooms}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <RequiredLabel htmlFor="beds">Betten</RequiredLabel>
              <Input
                type="number"
                id="beds"
                name="beds"
                placeholder="Bettplätze eingeben"
                autoComplete="off"
                required
                value={tripData.beds}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          <Label htmlFor="down_payment">Anzahlung</Label>
          <div className="relative">
            <Input
              type="number"
              id="down_payment"
              name="down_payment"
              placeholder="Anzahlung eingeben"
              autoComplete="off"
              value={tripData.down_payment ?? ''}
              onChange={handleInputChange}
              className="w-full pl-6"
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">€</span>
          </div>

          <Label htmlFor="full_payment">Hauptzahlung</Label>
          <div className="relative">
            <Input
              type="number"
              id="full_payment"
              name="full_payment"
              placeholder="Hauptzahlung eingeben"
              autoComplete="off"
              value={tripData.full_payment ?? ''}
              onChange={handleInputChange}
              className="w-full pl-6"
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">€</span>
          </div>

          <Label htmlFor="final_payment">Abschlussbetrag</Label>
          <div className="relative">
            <Input
              type="number"
              id="final_payment"
              name="final_payment"
              placeholder="Abschlussbetrag eingeben"
              autoComplete="off"
              value={tripData.final_payment ?? ''}
              onChange={handleInputChange}
              className="w-full pl-6"
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">€</span>
          </div>
          <Input type="hidden" id="group_id" name="group_id" value={tripData.group_id} readOnly />
          <ResponsiveDialog
            title="Trip erstellen"
            message={`Bist du sicher, dass du das Trip erstellen möchtest?`}
            confirmText="Trip erstellen"
            onConfirm={handleCreateTrip}
          >
            <SubmitButton
              aria-label="Reise erstellen"
              pendingText="Erstelle Reise..."
              className="flex text-xs pl-10 w-full"
              disabled={!isFormValid}
            >
              <span className="xs:inline truncate">Reise erstellen</span>
            </SubmitButton>
          </ResponsiveDialog>
        </div>
      </form>
    </div>
  )
}
