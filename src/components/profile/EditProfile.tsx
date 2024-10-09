'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { parse, format } from 'date-fns'
import { useUserStore } from '@/stores/userStore'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { BackButtonClient } from '@/components/ui/back-button-client'
import InfoCard from '@/components/ui/info-card'
import { PublicProfileType } from '@/types/user'
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

const formSchema = z.object({
  first_name: z.string().min(1, 'Vorname ist erforderlich'),
  last_name: z.string().min(1, 'Nachname ist erforderlich'),
  birthday: z.string().min(1, 'Geburtstag ist erforderlich'),
  profile_picture: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const EditProfile = () => {
  const { publicProfile, updatePublicProfile, getPublicProfile } = useUserStore()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: publicProfile?.first_name || '',
      last_name: publicProfile?.last_name || '',
      profile_picture: publicProfile?.profile_picture || '',
      birthday: publicProfile?.birthday || '',
    },
  })

  useEffect(() => {
    if (publicProfile) {
      form.reset({
        first_name: publicProfile.first_name,
        last_name: publicProfile.last_name,
        profile_picture: publicProfile.profile_picture ?? undefined,
        birthday: publicProfile.birthday
          ? format(new Date(publicProfile.birthday), 'dd.MM.yyyy')
          : '',
      })
    }
  }, [publicProfile, form])

  if (!publicProfile) {
    return (
      <InfoCard
        title="Kein Profil"
        description="Es konnte kein passendes Profil gefunden werden."
        variant="info"
      />
    )
  }

  const onSubmit = async (data: FormValues) => {
    try {
      const updatedData = {
        ...data,
        id: publicProfile.id,
        birthday: data.birthday
          ? format(parse(data.birthday, 'dd.MM.yyyy', new Date()), 'yyyy-MM-dd')
          : null,
      }
      await updatePublicProfile(updatedData as PublicProfileType)
      await getPublicProfile(publicProfile.id)
      router.push('/protected/profile')
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Profils:', error)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('id', publicProfile.id ?? '')

    try {
      const response = await fetch('/api/image-upload/', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error('Fehler beim Hochladen des Bildes')
      }
      const data = await response.json()
      form.setValue('profile_picture', data.imageUrl)
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

  return (
    <CardBackPlate className="flex flex-col max-w-7xl w-full gap-8">
      <CardHeader>
        <BackButtonClient className="static" />
        <CardTitle className="text-xl">Profil bearbeiten</CardTitle>
        <CardDescription>
          Felder mit einem <span className="text-red-500">*</span> sind Pflichtfelder.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full items-center"
          >
            <div className="flex flex-col gap-4 w-full max-w-lg">
              <div className="flex flex-col gap-2 w-full">
                <FormLabel htmlFor="image">Profilbild</FormLabel>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                />
                <div className="relative flex w-full max-w-[350px] h-[350px] p-4 rounded-lg border self-center">
                  {form.watch('profile_picture') ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={form.watch('profile_picture') ?? ''}
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
              <div className="flex flex-col md:flex-row gap-2 w-full">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Vorname{' '}
                        {isFieldRequired('first_name') && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Vorname eingeben" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Nachname{' '}
                        {isFieldRequired('last_name') && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nachname eingeben" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Geburtstag</FormLabel>
                    <FormControl>
                      <Input placeholder="TT.MM.JJJJ" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <ResponsiveDialog
                title="Profil aktualisieren"
                message={`Bist du sicher, dass du die Änderungen speichern möchtest?`}
                confirmText="Änderungen speichern"
                onConfirm={form.handleSubmit(onSubmit)}
              >
                <Button
                  type="button"
                  aria-label="Profil aktualisieren"
                  className="flex text-xs pl-10 w-full"
                  disabled={!form.formState.isValid}
                >
                  <span className="xs:inline truncate">
                    {form.formState.isSubmitting
                      ? 'Aktualisiere Profil...'
                      : 'Profil aktualisieren'}
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

export default EditProfile
