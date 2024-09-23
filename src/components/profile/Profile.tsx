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
import { EditButton } from '../ui/edit-button'
import { Button } from '../ui/button'

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
              {publicProfile.profile_picture && (
                <Image
                  src={publicProfile.profile_picture}
                  alt={publicProfile.first_name ?? 'avatar'}
                  width={250}
                  height={250}
                  className="rounded-full w-64 h-auto"
                  priority
                />
              )}
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
        <CardFooter className="flex w-full pt-12 justify-center">
          <div className="flex flex-col xs:flex-row gap-4 w-full max-w-lg">
            <EditButton id={publicProfile.id} className="static" type="profile">
              <Button className="w-full max-w-lg">Profil bearbeiten</Button>
            </EditButton>
          </div>
        </CardFooter>
      </CardBackPlate>
    )
  )
}
