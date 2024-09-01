import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "./ui/table";
import { Database } from "@/database.types";
import Image from "next/image";

const TripCard = ({
  trip,
  created_at,
  children,
}: {
  trip: Database["public"]["Tables"]["trips"]["Row"];
  created_at?: Database["public"]["Tables"]["user_subscriptions"]["Row"]["created_at"];
  children?: React.ReactNode;
}) => {
  return (
    <Link
      href={`/protected/trips/${trip.id}`}
      key={trip.id}
      className="w-full xs:w-fit"
    >
      <Card className="relative text-sm hover:ring ring-ring">
        {children}
        <CardHeader>
          <CardTitle>{trip.name}</CardTitle>
          <CardDescription>
            {new Date(trip.date_from).toLocaleDateString("de-DE", {
              weekday: "short",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            -
            <br />
            {new Date(trip.date_to).toLocaleDateString("de-DE", {
              weekday: "short",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
          <div className="flex w-full h-full overflow-clip">
            <Image
              src={trip.image}
              alt={trip.name}
              width={600}
              height={400}
              className="h-32 min-w-64 w-full object-cover hover:scale-110 transition-transform"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Land:</TableHead>
                <TableCell>{trip.land}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Ort:</TableHead>
                <TableCell>{trip.ort}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Plätze</TableHead>
                <TableCell>{trip.beds}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        {created_at && (
          <CardFooter className="text-muted-foreground">
            Angemeldet am: <br />
            {new Date(created_at).toLocaleDateString("de-DE", {
              weekday: "short",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};

export default TripCard;
