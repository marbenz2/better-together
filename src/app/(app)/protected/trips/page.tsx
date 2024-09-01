import Trips from "@/components/trips/Trips";

export default async function ProtectedPage() {
  return (
    <section className="max-w-7xl w-full">
      <Trips />
    </section>
  );
}
