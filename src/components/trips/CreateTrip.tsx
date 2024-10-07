'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useGroupStore } from '@/stores/groupStores'
import { useTripStore } from '@/stores/tripStores'
import { useUserStore } from '@/stores/userStore'
import { GroupTripType } from '@/types/trips'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { BackButtonClient } from '../ui/back-button-client'
import { googleMapsUrl } from '@/lib/utils'
import InfoCard from '../ui/info-card'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CardBackPlate, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveDialog } from '@/components/ResponsiveDialog'

const formSchema = z.object({
  name: z.string().min(1, 'Reisename ist erforderlich'),
  date_from: z.string().min(1, 'Startdatum ist erforderlich'),
  date_to: z.string().min(1, 'Enddatum ist erforderlich'),
  land: z.string().min(1, 'Land ist erforderlich'),
  area: z.string().optional(),
  location_name: z.string().min(1, 'Location ist erforderlich'),
  plz: z.string().min(1, 'PLZ ist erforderlich'),
  ort: z.string().min(1, 'Ort ist erforderlich'),
  street: z.string().min(1, 'Straße ist erforderlich'),
  street_number: z.number().min(1, 'Hausnummer ist erforderlich'),
  rooms: z.number().min(1, 'Anzahl der Zimmer ist erforderlich'),
  beds: z.number().min(1, 'Anzahl der Betten ist erforderlich'),
  image: z.string().min(1, 'Bild ist erforderlich'),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateTrip() {
  const router = useRouter()
  const { createTrip } = useTripStore()
  const { groupId } = useGroupStore()
  const { user } = useUserStore()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      date_from: '',
      date_to: '',
      land: '',
      area: '',
      location_name: '',
      plz: '',
      ort: '',
      street: '',
      street_number: 0,
      rooms: 0,
      beds: 0,
      image: '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    const anreiseLink = googleMapsUrl(
      data.location_name,
      data.land,
      data.street,
      data.street_number,
      data.plz,
      data.ort,
    )

    try {
      await createTrip({
        ...data,
        anreise_link: anreiseLink,
        group_id: groupId!,
        created_by: user.id,
        status: 'upcoming',
      } as GroupTripType)
      router.push('/protected/trips')
    } catch (error) {
      console.error('Fehler beim Erstellen der Reise:', error)
    }
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
      form.setValue('image', data.imageUrl)
    } catch (error) {
      console.error('Fehler beim Hochladen des Bildes:', error)
    }
  }

  const isFieldRequired = (fieldName: keyof FormValues) => {
    const fieldSchema = formSchema.shape[fieldName]
    return (
      (fieldSchema instanceof z.ZodString || fieldSchema instanceof z.ZodNumber) &&
      !fieldSchema.isOptional()
    )
  }

  if (!groupId) {
    return (
      <InfoCard
        title="Keine Gruppe gefunden"
        description="Bitte erstelle eine Gruppe, bevor du eine Reise erstellst."
        variant="warning"
      />
    )
  }

  return (
    <CardBackPlate className="flex flex-col max-w-7xl w-full gap-8">
      <CardHeader>
        <BackButtonClient className="static" />
        <CardTitle>Eine neue Reise erstellen</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4 w-full items-center"
          >
            <div className="flex flex-col gap-4 w-full max-w-lg">
              <div className="flex flex-col gap-2 w-full">
                <FormLabel htmlFor="image">
                  Bild der Reise{' '}
                  {isFieldRequired('image') && <span className="text-red-500">*</span>}
                </FormLabel>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                />
                <div className="relative flex w-full max-w-[350px] h-[350px] p-4 rounded-lg border self-center">
                  {form.watch('image') ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={form.watch('image') ?? ''}
                        alt="Vorschau des hochgeladenen Bildes"
                        fill
                        sizes="(max-width: 350px) (max-height: 450px)"
                        className="object-cover"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="relative flex w-full h-full items-center justify-center overflow-hidden">
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
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Reisename {isFieldRequired('name') && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Reisename eingeben" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-2 w-full">
                <FormField
                  control={form.control}
                  name="date_from"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Startdatum{' '}
                        {isFieldRequired('date_from') && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date_to"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Enddatum{' '}
                        {isFieldRequired('date_to') && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="land"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Land {isFieldRequired('land') && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Land eingeben" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gebiet</FormLabel>
                    <FormControl>
                      <Input placeholder="Gebiet eingeben" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Location{' '}
                      {isFieldRequired('location_name') && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Location eingeben" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-2 w-full">
                <FormField
                  control={form.control}
                  name="plz"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        PLZ {isFieldRequired('plz') && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="PLZ eingeben" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ort"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Ort {isFieldRequired('ort') && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Ort eingeben" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2 w-full">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Straße{' '}
                        {isFieldRequired('street') && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Straße eingeben" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="street_number"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Hausnummer{' '}
                        {isFieldRequired('street_number') && (
                          <span className="text-red-500">*</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Hausnummer eingeben"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2 w-full">
                <FormField
                  control={form.control}
                  name="rooms"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Zimmer {isFieldRequired('rooms') && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Zimmer eingeben"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="beds"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Betten {isFieldRequired('beds') && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Bettplätze eingeben"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <ResponsiveDialog
                title="Reise erstellen"
                message={`Bist du sicher, dass du diese Reise erstellen möchtest?`}
                confirmText="Reise erstellen"
                onConfirm={form.handleSubmit(onSubmit)}
              >
                <Button
                  type="button"
                  aria-label="Reise erstellen"
                  className="flex text-xs pl-10 w-full"
                  disabled={!form.formState.isValid}
                >
                  <span className="xs:inline truncate">
                    {form.formState.isSubmitting ? 'Erstelle Reise...' : 'Reise erstellen'}
                  </span>
                </Button>
              </ResponsiveDialog>
            </div>
          </form>
        </Form>
      </CardContent>
    </CardBackPlate>
  )
}
