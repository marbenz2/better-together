import { PlusIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useTripStore } from '@/stores/tripStores'

const formSchema = z.object({
  birthdays: z.array(z.string().min(1, 'Geburtstag ist erforderlich')),
})

type FormValues = z.infer<typeof formSchema>

export default function AddAdditional() {
  const { setAdditionalMembers, additionalMembers } = useTripStore()
  const [birthdayInputs, setBirthdayInputs] = useState<number[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthdays: [],
    },
  })

  useEffect(() => {
    const subscription = form.watch((formData) => {
      const filledBirthdays =
        formData.birthdays?.filter((birthday): birthday is string => birthday !== '') || []
      setAdditionalMembers(filledBirthdays)
    })

    return () => subscription.unsubscribe()
  }, [form, setAdditionalMembers])

  const addBirthdayInput = () => {
    const newIndex = birthdayInputs.length > 0 ? Math.max(...birthdayInputs) + 1 : 0
    setBirthdayInputs([...birthdayInputs, newIndex])
    form.setValue(`birthdays.${newIndex}`, '')
  }

  const removeBirthdayInput = (indexToRemove: number) => {
    const newBirthdayInputs = birthdayInputs.filter((index) => index !== indexToRemove)
    setBirthdayInputs(newBirthdayInputs)

    const newBirthdays = form
      .getValues()
      .birthdays.filter((_, index) => birthdayInputs[index] !== indexToRemove)
    form.setValue('birthdays', newBirthdays)

    const newAdditionalMembers =
      additionalMembers?.filter((_, index) => index !== indexToRemove) ?? []
    setAdditionalMembers(newAdditionalMembers)

    if (newBirthdayInputs.length === 0) {
      setBirthdayInputs([])
      setAdditionalMembers([])
      form.setValue('birthdays', [])
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4">
        {birthdayInputs.map((index, arrayIndex) => (
          <FormField
            key={index}
            control={form.control}
            name={`birthdays.${arrayIndex}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weitere Person {arrayIndex + 1}</FormLabel>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Input type="date" placeholder="TT.MM.JJJJ" {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeBirthdayInput(index)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </FormItem>
            )}
          />
        ))}
        <Button
          type="button"
          onClick={addBirthdayInput}
          className="w-full flex items-center justify-center gap-4"
        >
          <PlusIcon className="h-4 w-4" />
          <span className="truncate xs:inline"> Weitere Person hinzufügen</span>
        </Button>
      </form>
    </Form>
  )
}
