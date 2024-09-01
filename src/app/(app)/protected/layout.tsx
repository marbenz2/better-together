import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center">
      <div className="w-full">
        <Navigation />
      </div>
      <div className="flex-1 flex flex-col items-center gap-8 w-full px-1 md:px-4">
        {children}
      </div>
      <Footer />
    </div>
  );
}
