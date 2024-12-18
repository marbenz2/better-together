'use client'

import { BackButtonClient } from '@/components/ui/back-button-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

export default function ImprintPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-2 md:px-4">
      <BackButtonClient />
      <Card className="mt-24">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-6">Impressum</CardTitle>
        </CardHeader>
        <CardContent>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Angaben gemäß § 5 TMG</h2>
            <address className="not-italic mb-4 text-sm">
              Marcel Benzinger
              <br />
              Carl-Zeiss-Str. 8
              <br />
              72555 Metzingen
            </address>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Kontakt</h2>
            <p className="text-sm mb-4">E-Mail: hello@marbenz.de</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <address className="not-italic mb-4 text-sm">
              Marcel Benzinger
              <br />
              Carl-Zeiss-Str. 8
              <br />
              72555 Metzingen
            </address>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Haftungsausschluss</h2>
            <h3 className="text-lg font-medium mb-2">Haftung für Inhalte</h3>
            <p className="text-sm mb-4">
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
              Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            </p>
            <h3 className="text-lg font-medium mb-2">Haftung für Links</h3>
            <p className="text-sm mb-4">
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir
              keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
              übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Urheberrecht</h2>
            <p className="text-sm mb-4">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
              unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung
              und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
