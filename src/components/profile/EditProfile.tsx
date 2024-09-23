'use client'

import { Input } from '@/components/forms/input'
import { Label } from '@/components/forms/label'
import { SubmitButton } from '@/components/forms/submit-button'
import { ResponsiveDialog } from '@/components/ResponsiveDialog'
import { CardTitle } from '@/components/ui/card'
import { useUserStore } from '@/stores/userStore'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { BackButtonClient } from '@/components/ui/back-button-client'
import InfoCard from '@/components/ui/info-card'
import { PublicProfileType } from '@/types/user'

type PublicProfileState = Omit<PublicProfileType, 'id' | 'created_at' | 'email'>

const EditProfile = () => {
  const { publicProfile, updatePublicProfile, getPublicProfile } = useUserStore()
  const router = useRouter()
  const [userData, setUserData] = useState(publicProfile)
  const [isFormValid, setIsFormValid] = useState(false)

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setUserData((prevData) => {
      if (!prevData) return null
      return {
        ...prevData,
        [name]: value,
      }
    })
  }, [])

  const validateForm = useCallback(() => {
    const requiredFields: (keyof PublicProfileState)[] = ['first_name', 'last_name' /* , 'email' */]
    const isValid =
      userData && requiredFields.every((field: keyof PublicProfileState) => userData[field] !== '')
    setIsFormValid(!!isValid)
    return isValid
  }, [userData])

  useEffect(() => {
    validateForm()
  }, [userData, validateForm])

  if (!publicProfile) {
    return (
      <InfoCard
        title="Kein Profil"
        description="Es konnte kein passendes Profil gefunden werden."
        variant="info"
      />
    )
  }

  const handleUpdateProfile = async () => {
    try {
      if (userData) {
        const { ...updatedUserData } = userData
        await updatePublicProfile(updatedUserData as PublicProfileType)
        await getPublicProfile(userData.id)
        router.push('/protected/profile')
      } else {
        throw new Error('Benutzerdaten sind nicht verfügbar')
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Profils:', error)
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
      setUserData((prevData) =>
        prevData
          ? {
              ...prevData,
              profile_picture: data.imageUrl,
            }
          : null,
      )
    } catch (error) {
      console.error('Fehler beim Hochladen des Bildes:', error)
    }
  }

  if (!publicProfile && !userData) {
    return <InfoCard title="Test" description="test" variant="warning" />
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto">
      <BackButtonClient className="static" />
      <form className="flex flex-col gap-4 w-full items-center" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 w-full max-w-lg">
          <Label>
            <CardTitle className="text-xl">Profil bearbeiten</CardTitle>
          </Label>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="image">Profilbild</Label>
            <Input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />
            {userData?.profile_picture ? (
              <div className="flex justify-center items-center">
                <Image
                  src={userData?.profile_picture}
                  alt="Vorschau des hochgeladenen Bildes"
                  width={250}
                  height={250}
                  className="rounded-full w-64 h-auto"
                  priority
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
          <div className="flex gap-2 w-full">
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="first_name">Vorname</Label>
              <Input
                type="text"
                id="first_name"
                name="first_name"
                placeholder="Vorname eingeben"
                autoComplete="off"
                value={userData?.first_name || ''}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="last_name">Nachname</Label>
              <Input
                type="text"
                id="last_name"
                name="last_name"
                placeholder="Nachname eingeben"
                autoComplete="off"
                value={userData?.last_name || ''}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          {/* <div className="flex gap-2 w-full">
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="E-Mail eingeben"
                autoComplete="off"
                value={userData?.email || ''}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div> */}
          <ResponsiveDialog
            title="Profil aktualisieren"
            message={`Bist du sicher, dass du die Änderungen speichern möchtest?`}
            confirmText="Änderungen speichern"
            onConfirm={handleUpdateProfile}
          >
            <SubmitButton
              aria-label="Profil aktualisieren"
              pendingText="Aktualisiere Profil..."
              className="flex text-xs pl-10 w-full"
              disabled={!isFormValid}
            >
              <span className="xs:inline truncate">Profil aktualisieren</span>
            </SubmitButton>
          </ResponsiveDialog>
        </div>
      </form>
    </div>
  )
}

export default EditProfile
