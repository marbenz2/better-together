import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useGroupStore } from '@/stores/groupStores'
import { useTripStore } from '@/stores/tripStores'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import InfoCard from '@/components/ui/info-card'
import Spinner from '@/components/ui/Spinner'
import { createClient } from '@/utils/supabase/client'
import { setUserPayments } from '@/utils/supabase/queries'
import { showNotification } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { CardBackPlate, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BackButtonClient } from '@/components/ui/back-button-client'
import AdditionalMembersButton from '@/components/userlist/AdditionalMembersButton'

const formSchema = z.record(
  z.object({
    down_payment_amount: z.number().nullable(),
    full_payment_amount: z.number().nullable(),
    final_payment_amount: z.number().nullable(),
    down_payment: z.boolean(),
    full_payment: z.boolean(),
    final_payment: z.boolean(),
  }),
)

export default function UserList() {
  const { tripMembers, getTripMembers, trip } = useTripStore()
  const { tripPublicProfiles } = useGroupStore()
  const [changedFields, setChangedFields] = React.useState<Record<string, boolean>>({})
  const [sortedProfiles, setSortedProfiles] = React.useState<typeof tripPublicProfiles>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: tripPublicProfiles.reduce(
      (acc, profile) => {
        const member = tripMembers.find((m) => m.user_id === profile.id)
        acc[profile.id] = {
          down_payment_amount: member?.down_payment_amount ?? null,
          full_payment_amount: member?.full_payment_amount ?? null,
          final_payment_amount: member?.final_payment_amount ?? null,
          down_payment: member?.down_payment ?? false,
          full_payment: member?.full_payment ?? false,
          final_payment: member?.final_payment ?? false,
        }
        return acc
      },
      {} as z.infer<typeof formSchema>,
    ),
  })

  useEffect(() => {
    const sorted = [...tripPublicProfiles].sort((a, b) => {
      if (a.last_name !== b.last_name) {
        return a.last_name.localeCompare(b.last_name)
      }
      return a.first_name.localeCompare(b.first_name)
    })
    setSortedProfiles(sorted)
  }, [tripPublicProfiles])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!trip) return

    const payments = Object.entries(values)
      .map(([userId, userPayments]) => ({
        userId,
        tripId: trip.id,
        down_payment_amount: userPayments.down_payment_amount ?? null,
        full_payment_amount: userPayments.full_payment_amount ?? null,
        final_payment_amount: userPayments.final_payment_amount ?? null,
        down_payment: userPayments.down_payment,
        full_payment: userPayments.full_payment,
        final_payment: userPayments.final_payment,
      }))
      .filter(
        (payment) =>
          payment.down_payment_amount !== null ||
          payment.full_payment_amount !== null ||
          payment.final_payment_amount !== null ||
          payment.down_payment ||
          payment.full_payment ||
          payment.final_payment,
      )

    if (payments.length > 0) {
      const supabase = createClient()
      const { error } = await setUserPayments(supabase, payments)
      if (error) {
        showNotification('Fehler', 'Fehler beim Speichern der Zahlungen', 'destructive')
      } else {
        showNotification('Erfolgreich', 'Zahlungen erfolgreich gespeichert', 'success')
        setChangedFields({})
        getTripMembers(trip.id)
      }
    }
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setChangedFields((prev) => ({ ...prev, [fieldName]: true }))
    return value
  }

  if (tripMembers.length === 0)
    return (
      <InfoCard
        title="Keine Teilnehmer gefunden"
        description="Bisher haben sich noch keine Teilnehmer für diese Reise angemeldet"
      />
    )

  return (
    <CardBackPlate className="flex flex-col max-w-7xl w-full gap-8">
      <CardHeader>
        <BackButtonClient className="static" />
        <CardTitle>Reise Teilnehmerliste</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {sortedProfiles.map((profile) => (
              <div key={profile.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {sortedProfiles.indexOf(profile) !== 0 && (
                  <Separator className="col-span-1 md:col-span-3 w-full my-8" />
                )}
                <div className="col-span-1 md:col-span-3 font-bold text-xl flex items-center gap-4">
                  {profile.last_name}, {profile.first_name}
                  <AdditionalMembersButton userId={profile.id} />
                </div>
                <div className="flex flex-col space-y-2">
                  <FormField
                    control={form.control}
                    name={`${profile.id}.down_payment_amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Anzahlung{' '}
                          {trip?.initial_down_payment && trip?.initial_down_payment > 0
                            ? '(initiale Anzahlung)'
                            : null}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              className={`w-full max-w-md pl-6 ${changedFields[`${profile.id}.down_payment_amount`] ? 'border-yellow-500' : ''}`}
                              {...field}
                              value={field.value ?? ''}
                              disabled={
                                Boolean(
                                  tripMembers.find((m) => m.user_id === profile.id)?.down_payment,
                                ) || Boolean(trip?.initial_down_payment)
                              }
                              onChange={(e) => {
                                const value = e.target.value ? Number(e.target.value) : null
                                field.onChange(
                                  handleFieldChange(`${profile.id}.down_payment_amount`, value),
                                )
                              }}
                            />
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                              €
                            </span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`${profile.id}.down_payment`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(
                                handleFieldChange(`${profile.id}.down_payment`, checked),
                              )
                            }}
                            className={
                              changedFields[`${profile.id}.down_payment`] ? 'border-yellow-500' : ''
                            }
                          />
                        </FormControl>
                        <FormLabel>Anzahlung erhalten</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <FormField
                    control={form.control}
                    name={`${profile.id}.full_payment_amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hauptzahlung</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              className={`w-full max-w-md pl-6 ${changedFields[`${profile.id}.full_payment_amount`] ? 'border-yellow-500' : ''}`}
                              {...field}
                              value={field.value ?? ''}
                              disabled={
                                tripMembers.find((m) => m.user_id === profile.id)?.full_payment
                              }
                              onChange={(e) => {
                                const value = e.target.value ? Number(e.target.value) : null
                                field.onChange(
                                  handleFieldChange(`${profile.id}.full_payment_amount`, value),
                                )
                              }}
                            />
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                              €
                            </span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`${profile.id}.full_payment`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(
                                handleFieldChange(`${profile.id}.full_payment`, checked),
                              )
                            }}
                            className={
                              changedFields[`${profile.id}.full_payment`] ? 'border-yellow-500' : ''
                            }
                          />
                        </FormControl>
                        <FormLabel>Hauptzahlung erhalten</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <FormField
                    control={form.control}
                    name={`${profile.id}.final_payment_amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Abschluss</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              className={`w-full max-w-md pl-6 ${changedFields[`${profile.id}.final_payment_amount`] ? 'border-yellow-500' : ''}`}
                              {...field}
                              value={field.value ?? ''}
                              disabled={
                                tripMembers.find((m) => m.user_id === profile.id)?.final_payment
                              }
                              onChange={(e) => {
                                const value = e.target.value ? Number(e.target.value) : null
                                field.onChange(
                                  handleFieldChange(`${profile.id}.final_payment_amount`, value),
                                )
                              }}
                            />
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                              €
                            </span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`${profile.id}.final_payment`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(
                                handleFieldChange(`${profile.id}.final_payment`, checked),
                              )
                            }}
                            className={
                              changedFields[`${profile.id}.final_payment`]
                                ? 'border-yellow-500'
                                : ''
                            }
                          />
                        </FormControl>
                        <FormLabel>Abschlusszahlung erhalten</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <div className="pt-12">
              <Button type="submit" className="w-full max-w-md">
                {form.formState.isSubmitting ? <Spinner /> : 'Zahlungen eintragen'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </CardBackPlate>
  )
}
