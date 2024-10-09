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
import React, { useMemo } from 'react'
import { BackButtonClient } from '@/components/ui/back-button-client'
import { googleMapsUrl } from '@/lib/utils'
import InfoCard from '@/components/ui/info-card'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  CardBackPlate,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ResponsiveDialog } from '@/components/ResponsiveDialog'

const formSchema = z
  .object({
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
    recipient: z.string().optional(),
    iban: z.string().optional(),
    paypal: z.string().optional(),
    initial_down_payment: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.iban && !data.recipient) {
        return false
      }
      if (data.recipient && !data.iban) {
        return false
      }
      return true
    },
    {
      message: 'Bitte geben Sie sowohl den Empfänger als auch die IBAN an.',
      path: ['recipient', 'iban'],
    },
  )

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
      street_number: undefined,
      rooms: undefined,
      beds: undefined,
      image: '',
      recipient: '',
      iban: '',
      paypal: '',
      initial_down_payment: undefined,
    },
  })

  const isFieldRequired = useMemo(() => {
    return (fieldName: keyof FormValues) => {
      const fieldSchema = formSchema._def.schema.shape[fieldName]
      return (
        (fieldSchema instanceof z.ZodString || fieldSchema instanceof z.ZodNumber) &&
        !fieldSchema.isOptional()
      )
    }
  }, [])

  if (!groupId) {
    return (
      <InfoCard
        title="Keine Gruppe gefunden"
        description="Bitte erstelle eine Gruppe, bevor du eine Reise erstellst."
        variant="warning"
      />
    )
  }

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

  return (
    <CardBackPlate className="flex flex-col max-w-7xl w-full gap-8">
      <CardHeader>
        <BackButtonClient className="static" />
        <CardTitle>Eine neue Reise erstellen</CardTitle>
        <CardDescription>
          Felder mit einem <span className="text-red-500">*</span> sind Pflichtfelder.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4 w-full items-center"
          >
            <div className="flex flex-col gap-4 w-full max-w-lg">
              <CardTitle>Reiseinformationen</CardTitle>
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
                      <Input placeholder="Reisename" {...field} />
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
                      <Input placeholder="Land" {...field} />
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
                      <Input placeholder="Gebiet" {...field} />
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
                      Unterkunft / Location{' '}
                      {isFieldRequired('location_name') && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Name der Location" {...field} />
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
                        <Input placeholder="PLZ" {...field} />
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
                        <Input placeholder="Ort" {...field} />
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
                        <Input placeholder="Straße" {...field} />
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
                          placeholder="Hausnummer"
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === '' ? undefined : Number(e.target.value),
                            )
                          }
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
                          placeholder="Zimmeranzahl"
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === '' ? undefined : Number(e.target.value),
                            )
                          }
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
                          placeholder="Bettenanzahl"
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === '' ? undefined : Number(e.target.value),
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-12 w-full my-12">
                <CardTitle>Zahlungsinformationen</CardTitle>
                <div className="flex flex-col gap-2">
                  <CardTitle>Überweisung</CardTitle>
                  <div className="flex flex-col md:flex-row gap-2 w-full">
                    <FormField
                      control={form.control}
                      name="recipient"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            Empfänger{' '}
                            {form.watch('iban') && <span className="text-red-500">*</span>}
                          </FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Vor- und Nachname" {...field} />
                          </FormControl>
                          {form.formState.errors.recipient && (
                            <p className="text-red-500 text-sm">
                              {form.formState.errors.recipient.message}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="iban"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            IBAN{' '}
                            {form.watch('recipient') && <span className="text-red-500">*</span>}
                          </FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="IBAN" {...field} />
                          </FormControl>
                          {form.formState.errors.iban && (
                            <p className="text-red-500 text-sm">
                              {form.formState.errors.iban.message}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <CardTitle>Paypal</CardTitle>
                  <FormField
                    control={form.control}
                    name="paypal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Empfänger</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Paypal E-Mail" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="initial_down_payment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initiale Anzahlung</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Anzahlung"
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === '' ? undefined : Number(e.target.value),
                            )
                          }
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
                  disabled={!form.formState.isValid || form.formState.isSubmitting}
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
