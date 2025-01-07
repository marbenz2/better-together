"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useGroupStore } from "@/stores/groupStores";
import { useUserStore } from "@/stores/userStore";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/ResponsiveDialog";
import { PlusIcon } from "lucide-react";

const formSchema = z.object({
  groupName: z.string().min(1, "Gruppenname ist erforderlich"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateGroup() {
  const { user } = useUserStore();
  const { createGroup } = useGroupStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createGroup(data.groupName, user.id);
      form.reset();
    } catch (error) {
      console.error("Fehler beim Erstellen der Gruppe:", error);
    }
  };

  return (
    <ResponsiveDialog
      title="Gruppe erstellen"
      confirmText="Gruppe erstellen"
      onConfirm={form.handleSubmit(onSubmit)}
      disabled={!form.formState.isValid}
      messageComponent={
        <Form {...form}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4 w-full"
          >
            <div className="flex flex-col gap-4 w-full items-center">
              <FormField
                control={form.control}
                name="groupName"
                render={({ field }) => (
                  <FormItem className="w-full max-w-lg">
                    <FormControl>
                      <Input
                        id="groupName"
                        placeholder="Gruppennamen eingeben"
                        autoComplete="off"
                        required
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      }
    >
      <Button
        type="button"
        aria-label="Gruppe erstellen"
        className="relative flex text-xs pl-10 w-full max-w-lg"
      >
        <span className="xs:inline truncate">Gruppe erstellen</span>
        <PlusIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
      </Button>
    </ResponsiveDialog>
  );
}
