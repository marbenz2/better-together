'use client'

import { BackButtonClient } from '@/components/ui/back-button-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

export default function TermsOfUsePage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-2 md:px-4">
      <BackButtonClient />
      <Card className="mt-24">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-6">Nutzungsbedingungen</CardTitle>
        </CardHeader>
        <CardContent>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Geltungsbereich</h2>
            <p className="text-sm mb-4">
              Diese Nutzungsbedingungen gelten für die Nutzung der &quot;Better. Together&quot; (im
              Folgenden &quot;App&quot; genannt), die von Marcel Benzinger betrieben wird.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Privater Gebrauch</h2>
            <p className="text-sm mb-4">
              Die App ist ausschließlich für den privaten Gebrauch bestimmt. Eine kommerzielle
              Nutzung ist nicht gestattet.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Registrierung</h2>
            <p className="text-sm mb-4">
              Für die Nutzung der App ist eine Registrierung erforderlich. Die bei der Registrierung
              angegebenen Daten müssen wahrheitsgemäß und vollständig sein.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Nutzerkonto</h2>
            <p className="text-sm mb-4">
              Jeder Nutzer ist für die Geheimhaltung seiner Zugangsdaten verantwortlich. Eine
              Weitergabe an Dritte ist nicht gestattet.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Verbotene Aktivitäten</h2>
            <p className="text-sm mb-4">
              Es ist untersagt, die App für illegale oder schädliche Zwecke zu nutzen,
              einschließlich, aber nicht beschränkt auf:
            </p>
            <ul className="list-disc pl-6 mb-4 text-sm">
              <li>Verbreitung von rechtswidrigen oder beleidigenden Inhalten</li>
              <li>Verletzung von Urheberrechten oder anderen geistigen Eigentumsrechten</li>
              <li>Verbreitung von Malware oder Viren</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Haftungsausschluss</h2>
            <p className="text-sm mb-4">
              Die Nutzung der App erfolgt auf eigene Gefahr. Wir übernehmen keine Haftung für
              Schäden, die durch die Nutzung der App entstehen, soweit dies gesetzlich zulässig ist.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Änderungen der App</h2>
            <p className="text-sm mb-4">
              Wir behalten uns das Recht vor, die App jederzeit zu ändern, zu erweitern oder
              einzustellen.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Änderungen der Nutzungsbedingungen</h2>
            <p className="text-sm mb-4">
              Wir behalten uns das Recht vor, diese Nutzungsbedingungen jederzeit zu ändern. Die
              Nutzer werden über Änderungen informiert.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Kündigung</h2>
            <p className="text-sm mb-4">
              Wir behalten uns das Recht vor, Nutzerkonten bei Verstößen gegen diese
              Nutzungsbedingungen zu sperren oder zu löschen.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Anwendbares Recht</h2>
            <p className="text-sm mb-4">Es gilt das Recht der Bundesrepublik Deutschland.</p>
          </section>
          <p className="mt-8 text-sm text-muted-foreground">Stand: 09.10.2024</p>
        </CardContent>
      </Card>
    </div>
  )
}
