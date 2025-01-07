"use client";

import { useGroupStore } from "@/stores/groupStores";
import { usePaymentStore } from "@/stores/paymentStore";
import { useUserStore } from "@/stores/userStore";
import {
  Card,
  CardBackPlate,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircleIcon,
  CoinsIcon,
  CopyIcon,
  HourglassIcon,
  QrCode,
} from "lucide-react";
import InfoCard from "@/components/ui/info-card";
import { Trips } from "@/types/supabase";
import PaymentQr from "./PaymentQr";
import { Separator } from "@/components/ui/separator";
import { ResponsiveDialog } from "@/components/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { copyToClipboard, showNotification } from "@/lib/utils";

export default function Payments() {
  const { groupId } = useGroupStore();
  const { subscribedTrips } = useUserStore();
  const { userPayments } = usePaymentStore();

  const filteredTrips = subscribedTrips?.filter(
    (trip) => trip.trips.group_id === groupId
  );

  const filteredPayments = userPayments?.filter((payment) =>
    filteredTrips?.some((trip) => trip.trips.id === payment.trip_id)
  );

  const sortedFilteredPayments = filteredPayments?.sort(
    (a, b) =>
      new Date(
        filteredTrips?.find((trip) => trip.trips.id === a.trip_id)?.trips
          .date_from || ""
      ).getTime() -
      new Date(
        filteredTrips?.find((trip) => trip.trips.id === b.trip_id)?.trips
          .date_from || ""
      ).getTime()
  );

  if (
    !filteredTrips ||
    filteredTrips.length === 0 ||
    !sortedFilteredPayments ||
    sortedFilteredPayments.length === 0
  )
    return (
      <InfoCard
        title="Keine anstehende Reisen gefunden"
        description="Du bist zu keiner Reise angemeldet"
        variant="info"
      />
    );

  return (
    <CardBackPlate className="flex flex-col max-w-7xl w-full">
      <CardHeader className="flex flex-col gap-12">
        {sortedFilteredPayments &&
          sortedFilteredPayments.map((payment) => (
            <div key={payment.trip_id} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <CardTitle>
                  {filteredTrips.find(
                    (trip) => trip.trips.id === payment.trip_id
                  )?.trips.name || "Unbekannte Reise"}
                </CardTitle>
                <CardDescription>
                  {new Date(
                    filteredTrips.find(
                      (trip) => trip.trips.id === payment.trip_id
                    )?.trips.date_from || "Unbekanntes Datum"
                  ).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(
                    filteredTrips.find(
                      (trip) => trip.trips.id === payment.trip_id
                    )?.trips.date_to || "Unbekanntes Datum"
                  ).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </CardDescription>
              </div>
              <div className="flex flex-col gap-4">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Anzahlung:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!payment.down_payment &&
                      payment.down_payment_amount !== null && (
                        <div className="flex flex-col justify-center items-center gap-4">
                          <CoinsIcon className="w-12 h-12 text-yellow-400" />
                          <div className="flex flex-col justify-center items-center">
                            <CardDescription>
                              Ausstehende Zahlung:
                            </CardDescription>
                            <CardTitle>
                              {Intl.NumberFormat("de-DE", {
                                style: "currency",
                                currency: "EUR",
                              }).format(payment.down_payment_amount)}
                            </CardTitle>
                          </div>
                          <PaymentMethods
                            amount={payment.down_payment_amount}
                            trip={
                              filteredTrips.find(
                                (trip) => trip.trips.id === payment.trip_id
                              )?.trips
                            }
                          />
                        </div>
                      )}
                    {!payment.down_payment &&
                      payment.down_payment_amount === null && (
                        <div className="flex flex-col justify-center items-center gap-4">
                          <HourglassIcon className="w-12 h-12 text-sky-400" />
                          <CardDescription>
                            Noch keine Zahlung eingetragen.
                          </CardDescription>
                        </div>
                      )}
                    {payment.down_payment &&
                      payment.down_payment_amount !== null && (
                        <div className="flex flex-col justify-center items-center gap-4">
                          <CheckCircleIcon className="w-12 h-12 text-green-400" />
                          <CardDescription>
                            {Intl.NumberFormat("de-DE", {
                              style: "currency",
                              currency: "EUR",
                            }).format(payment.down_payment_amount)}{" "}
                            bereits bezahlt
                          </CardDescription>
                        </div>
                      )}
                  </CardContent>
                </Card>
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Hauptzahlung:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!payment.full_payment &&
                      payment.full_payment_amount !== null && (
                        <div className="flex flex-col justify-center items-center gap-4">
                          <CoinsIcon className="w-12 h-12 text-yellow-400" />
                          <div className="flex flex-col justify-center items-center">
                            <CardDescription>
                              Ausstehende Zahlung:
                            </CardDescription>
                            <CardTitle>
                              {Intl.NumberFormat("de-DE", {
                                style: "currency",
                                currency: "EUR",
                              }).format(payment.full_payment_amount)}
                            </CardTitle>
                          </div>
                          <PaymentMethods
                            amount={payment.full_payment_amount}
                            trip={
                              filteredTrips.find(
                                (trip) => trip.trips.id === payment.trip_id
                              )?.trips
                            }
                          />
                        </div>
                      )}
                    {!payment.full_payment &&
                      payment.full_payment_amount === null && (
                        <div className="flex flex-col justify-center items-center gap-4">
                          <HourglassIcon className="w-12 h-12 text-sky-400" />
                          <CardDescription>
                            Noch keine Zahlung eingetragen.
                          </CardDescription>
                        </div>
                      )}
                    {payment.full_payment &&
                      payment.full_payment_amount !== null && (
                        <div className="flex flex-col justify-center items-center gap-4">
                          <CheckCircleIcon className="w-12 h-12 text-green-400" />
                          <CardDescription>
                            {Intl.NumberFormat("de-DE", {
                              style: "currency",
                              currency: "EUR",
                            }).format(payment.full_payment_amount)}{" "}
                            bereits bezahlt
                          </CardDescription>
                        </div>
                      )}
                  </CardContent>
                </Card>
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Endzahlung:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!payment.final_payment &&
                      payment.final_payment_amount !== null && (
                        <div className="flex flex-col justify-center items-center gap-4">
                          <CoinsIcon className="w-12 h-12 text-yellow-400" />
                          <div className="flex flex-col justify-center items-center">
                            <CardDescription>
                              Ausstehende Zahlung:
                            </CardDescription>
                            <CardTitle>
                              {Intl.NumberFormat("de-DE", {
                                style: "currency",
                                currency: "EUR",
                              }).format(payment.final_payment_amount)}
                            </CardTitle>
                          </div>
                          <PaymentMethods
                            amount={payment.final_payment_amount}
                            trip={
                              filteredTrips.find(
                                (trip) => trip.trips.id === payment.trip_id
                              )?.trips
                            }
                          />
                        </div>
                      )}
                    {!payment.final_payment &&
                      payment.final_payment_amount === null && (
                        <div className="flex flex-col justify-center items-center gap-4">
                          <HourglassIcon className="w-12 h-12 text-sky-400" />
                          <CardDescription>
                            Noch keine Zahlung eingetragen.
                          </CardDescription>
                        </div>
                      )}
                    {payment.final_payment &&
                      payment.final_payment_amount !== null && (
                        <div className="flex flex-col justify-center items-center gap-4">
                          <CheckCircleIcon className="w-12 h-12 text-green-400" />
                          <CardDescription>
                            {Intl.NumberFormat("de-DE", {
                              style: "currency",
                              currency: "EUR",
                            }).format(payment.final_payment_amount)}{" "}
                            bereits bezahlt
                          </CardDescription>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
      </CardHeader>
    </CardBackPlate>
  );
}

/* function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('de-DE', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
} */

function PaymentMethods({
  trip,
  amount,
}: {
  trip: Trips | undefined;
  amount: number;
}) {
  if (!trip) return null;

  const formatIBAN = (iban: string) => {
    return iban.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleCopyClick = (iban: string) => {
    if (!iban || iban === "") {
      showNotification("Fehler beim Kopieren des IBAN", "destructive");
    }
    copyToClipboard(iban);
    showNotification(
      `"${iban}" wurde in die Zwischenablage kopiert.`,
      "success"
    );
  };

  return (
    <>
      <Separator className="w-full my-4" orientation="horizontal" />
      <div className="flex flex-col md:flex-row gap-12 mt-4 w-full justify-between">
        {trip.iban && trip.recipient && (
          <div className="flex flex-col gap-4 w-full items-start">
            <CardTitle>Bezahlen per Überweisung:</CardTitle>
            <div className="flex flex-col justify-center">
              <CardDescription>Empfänger:</CardDescription>
              <CardTitle>{trip.recipient}</CardTitle>
            </div>
            <div className="flex flex-col justify-center">
              <CardDescription>IBAN:</CardDescription>
              <CardTitle className="flex items-center gap-4">
                {formatIBAN(trip.iban)}
                <CopyIcon
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => handleCopyClick(trip.iban || "")}
                />
              </CardTitle>
            </div>
            <div className="flex flex-col justify-center">
              <CardDescription>Zahlungszweck:</CardDescription>
              <CardTitle>{trip.name}</CardTitle>
            </div>
            <div className="flex flex-col justify-center">
              <CardDescription>Betrag:</CardDescription>
              <CardTitle>
                {Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: "EUR",
                }).format(amount)}
              </CardTitle>
            </div>
            {/* <PaymentQr
              type="iban"
              iban={trip.iban}
              recipient={trip.recipient}
              amount={amount}
              purpose={trip.name}
            /> */}
          </div>
        )}
        <Separator className="flex md:hidden w-full" orientation="horizontal" />
        <Separator className="hidden md:flex h-full" orientation="vertical" />
        {trip?.paypal && (
          <div className="flex flex-col gap-4 w-full items-start">
            <CardTitle>Bezahlen per PayPal:</CardTitle>
            <div className="flex flex-col justify-center">
              <CardDescription>Empfänger:</CardDescription>
              <CardTitle>{trip.paypal}</CardTitle>
            </div>
            <div className="flex flex-col justify-center">
              <CardDescription>Zahlungszweck:</CardDescription>
              <CardTitle>{trip.name}</CardTitle>
            </div>
            <div className="flex flex-col justify-center">
              <CardDescription>Betrag:</CardDescription>
              <CardTitle>
                {Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: "EUR",
                }).format(amount)}
              </CardTitle>
            </div>
            <div className="mt-4">
              <ResponsiveDialog
                title="QR-Code"
                confirmText=""
                onConfirm={() => {}}
                message="Scanen Sie den QR-Code, um die Zahlung zu erstellen."
                messageComponent={
                  <PaymentQr
                    type="paypal"
                    email={trip.paypal}
                    amount={amount}
                    purpose={trip.name}
                  />
                }
              >
                <Button className="w-full flex items-center justify-center gap-4">
                  <QrCode className="w-4 h-4" />
                  <span className="truncate xs:inline">QR-Code</span>
                </Button>
              </ResponsiveDialog>
            </div>
          </div>
        )}
        {!trip?.iban && !trip?.paypal && (
          <div className="flex w-full items-center justify-center">
            <CardDescription>
              Noch keine Zahlungsmethode eingetragen. Bitte wende dich an den
              Reiseleiter.
            </CardDescription>
          </div>
        )}
      </div>
    </>
  );
}
