import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      <p className="hidden sm:block">Hey, {user.user_metadata.first_name}!</p>
      <form action={signOut}>
        <Button variant="outline">Logout</Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Link href="/login">
        <Button>Anmelden</Button>
      </Link>
      <Link href="/signup">
        <Button variant="outline">Registrieren</Button>
      </Link>
    </div>
  );
}
