import { useUserStore } from '@/stores/userStore'
import React, { useState } from 'react'
import Spinner from '@/components/ui/Spinner'
import {
  CardBackPlate,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import InfoCard from '@/components/ui/info-card'
import { Table, TableBody, TableCell, TableRow } from '../ui/table'
import { ButtonLink } from '../ui/button-link'
import { PencilIcon } from 'lucide-react'

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false)
  const { publicProfile } = useUserStore()

  if (isLoading) {
    return <Spinner />
  }

  if (!publicProfile && !isLoading) {
    return <InfoCard title="Profil" description="Dein persönliches Profil wurde nicht gefunden." />
  }

  return (
    publicProfile && (
      <CardBackPlate className="flex flex-col max-w-7xl w-full gap-8">
        <CardHeader>
          <CardTitle className="text-2xl">Profil</CardTitle>
          <CardDescription>Hier findest du alle Informationen über dich.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Persönliche Informationen</h3>
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="relative flex w-full max-w-[350px] h-[350px] p-4 rounded-lg border">
                {publicProfile.profile_picture ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={publicProfile.profile_picture}
                      alt={publicProfile.first_name ?? 'avatar'}
                      fill
                      sizes="(max-width: 300px) (max-height: 400px)"
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-full">Profilbild</div>
                )}
              </div>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>
                      {publicProfile.first_name} {publicProfile.last_name}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>E-Mail</TableCell>
                    <TableCell>{publicProfile.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mitglied seit</TableCell>
                    <TableCell>
                      {new Date(publicProfile.created_at).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex w-full pt-12">
          <div className="flex flex-col xs:flex-row gap-4 w-full max-w-lg">
            <ButtonLink
              className="w-fit"
              href={`/protected/edit-profile/${publicProfile.id}`}
              label="Profil bearbeiten"
            >
              <PencilIcon className="w-4 h-4" />
            </ButtonLink>
          </div>
        </CardFooter>
      </CardBackPlate>
    )
  )
}
