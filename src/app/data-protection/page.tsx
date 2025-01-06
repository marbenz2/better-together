'use client'

import { BackButtonClient } from '@/components/ui/back-button-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

export default function DataProtectionPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-2 md:px-4">
      <BackButtonClient />
      <Card className="mt-24">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-6">Datenschutzerklärung</CardTitle>
        </CardHeader>
        <CardContent>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-lg font-medium mb-2">Allgemeine Hinweise</h3>
            <p className="mb-4 text-sm">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
              personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
              Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
            <h3 className="text-lg font-medium mb-2">Datenerfassung auf dieser Website</h3>
            <h4 className="font-medium mb-2">
              Wer ist verantwortlich für die Datenerfassung auf dieser Website?
            </h4>
            <p className="mb-4 text-sm">
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
              Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
            </p>
            <h4 className="font-medium mb-2">Wie erfassen wir Ihre Daten?</h4>
            <p className="mb-4 text-sm">
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei
              kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
            </p>
            <p className="mb-4 text-sm">
              Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme
              erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem
              oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch,
              sobald Sie diese Website betreten.
            </p>
            <h4 className="font-medium mb-2">Wofür nutzen wir Ihre Daten?</h4>
            <p className="mb-4 text-sm">
              Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu
              gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet
              werden.
            </p>
            <h4 className="font-medium mb-2">Welche Rechte haben Sie bezüglich Ihrer Daten?</h4>
            <p className="mb-4 text-sm">
              Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und
              Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein
              Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen. Hierzu
              sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im
              Impressum angegebenen Adresse an uns wenden. Des Weiteren steht Ihnen ein
              Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              2. Allgemeine Hinweise und Pflichtinformationen
            </h2>
            <h3 className="text-lg font-medium mb-2">Datenschutz</h3>
            <p className="mb-4 text-sm">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir
              behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
            <p className="mb-4 text-sm">
              Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben.
              Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden
              können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und
              wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.
            </p>
            <p className="mb-4 text-sm">
              Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der
              Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der
              Daten vor dem Zugriff durch Dritte ist nicht möglich.
            </p>
            <h3 className="text-lg font-medium mb-2">Hinweis zur verantwortlichen Stelle</h3>
            <p className="mb-4 text-sm">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
            </p>
            <address className="text-sm mb-4 not-italic">
              Marcel Benzinger
              <br />
              Carl-Zeiss-Str. 8
              <br />
              72555 Metzingen
              <br />
              <br />
              E-Mail: hello@marbenz.de
            </address>
            <p className="mb-4 text-sm">
              Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder
              gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von
              personenbezogenen Daten (z.B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
            </p>
            <h3 className="text-lg font-medium mb-2">
              Widerruf Ihrer Einwilligung zur Datenverarbeitung
            </h3>
            <p className="mb-4 text-sm">
              Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung
              möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Dazu
              reicht eine formlose Mitteilung per E-Mail an uns. Die Rechtmäßigkeit der bis zum
              Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
            </p>
            <h3 className="text-lg font-medium mb-2">
              Beschwerderecht bei der zuständigen Aufsichtsbehörde
            </h3>
            <p className="mb-4 text-sm">
              Im Falle datenschutzrechtlicher Verstöße steht dem Betroffenen ein Beschwerderecht bei
              der zuständigen Aufsichtsbehörde zu. Zuständige Aufsichtsbehörde in
              datenschutzrechtlichen Fragen ist der Landesdatenschutzbeauftragte des Bundeslandes,
              in dem unser Unternehmen seinen Sitz hat.
            </p>
            <h3 className="text-lg font-medium mb-2">Recht auf Datenübertragbarkeit</h3>
            <p className="mb-4 text-sm">
              Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung
              eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem
              gängigen, maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die direkte
              Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur,
              soweit es technisch machbar ist.
            </p>
            <h3 className="text-lg font-medium mb-2">SSL- bzw. TLS-Verschlüsselung</h3>
            <p className="mb-4 text-sm">
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
              Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als
              Seitenbetreiber senden, eine SSL-bzw. TLS-Verschlüsselung. Eine verschlüsselte
              Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von
              &quot;http://&quot; auf &quot;https://&quot; wechselt und an dem Schloss-Symbol in
              Ihrer Browserzeile.
            </p>
            <p className="mb-4 text-sm">
              Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns
              übermitteln, nicht von Dritten mitgelesen werden.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Datenerfassung auf unserer Website</h2>
            <h3 className="text-lg font-medium mb-2">Cookies</h3>
            <p className="mb-4 text-sm">
              Die Internetseiten verwenden teilweise so genannte Cookies. Cookies richten auf Ihrem
              Rechner keinen Schaden an und enthalten keine Viren. Cookies dienen dazu, unser
              Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Cookies sind kleine
              Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert.
            </p>
            <p className="mb-4 text-sm">
              Die meisten der von uns verwendeten Cookies sind so genannte
              &quot;Session-Cookies&quot;. Sie werden nach Ende Ihres Besuchs automatisch gelöscht.
              Andere Cookies bleiben auf Ihrem Endgerät gespeichert bis Sie diese löschen. Diese
              Cookies ermöglichen es uns, Ihren Browser beim nächsten Besuch wiederzuerkennen.
            </p>
            <p className="mb-4 text-sm">
              Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies
              informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für
              bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies
              beim Schließen des Browser aktivieren. Bei der Deaktivierung von Cookies kann die
              Funktionalität dieser Website eingeschränkt sein.
            </p>
            <p className="mb-4 text-sm">
              Cookies, die zur Durchführung des elektronischen Kommunikationsvorgangs oder zur
              Bereitstellung bestimmter, von Ihnen erwünschter Funktionen (z.B. Warenkorbfunktion)
              erforderlich sind, werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert.
              Der Websitebetreiber hat ein berechtigtes Interesse an der Speicherung von Cookies zur
              technisch fehlerfreien und optimierten Bereitstellung seiner Dienste. Soweit andere
              Cookies (z.B. Cookies zur Analyse Ihres Surfverhaltens) gespeichert werden, werden
              diese in dieser Datenschutzerklärung gesondert behandelt.
            </p>
            <h3 className="text-lg font-medium mb-2">Server-Log-Dateien</h3>
            <p className="mb-4 text-sm">
              Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten
              Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
            </p>
            <ul className="list-disc pl-6 mb-4 text-sm">
              <li>Browsertyp und Browserversion</li>
              <li>verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse</li>
            </ul>
            <p className="mb-4 text-sm">
              Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
              Grundlage für die Datenverarbeitung ist Art. 6 Abs. 1 lit. f DSGVO, der die
              Verarbeitung von Daten zur Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen
              gestattet.
            </p>
            <h3 className="text-lg font-medium mb-2">Kontaktformular</h3>
            <p className="mb-4 text-sm">
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem
              Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks
              Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
              Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
            <p className="mb-4 text-sm">
              Die Verarbeitung der in das Kontaktformular eingegebenen Daten erfolgt somit
              ausschließlich auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie
              können diese Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung
              per E-Mail an uns. Die Rechtmäßigkeit der bis zum Widerruf erfolgten
              Datenverarbeitungsvorgänge bleibt vom Widerruf unberührt.
            </p>
            <p className="mb-4 text-sm">
              Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns
              zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck
              für die Datenspeicherung entfällt (z.B. nach abgeschlossener Bearbeitung Ihrer
              Anfrage). Zwingende gesetzliche Bestimmungen – insbesondere Aufbewahrungsfristen –
              bleiben unberührt.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Analyse-Tools und Werbung</h2>
            <p className="mb-4 text-sm">
              Diese Website verwendet keine Analyse-Tools oder Werbung von Drittanbietern.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Plugins und Tools</h2>
            <h3 className="text-lg font-medium mb-2">Google Web Fonts</h3>
            <p className="mb-4 text-sm">
              Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte Web
              Fonts, die von Google bereitgestellt werden. Beim Aufruf einer Seite lädt Ihr Browser
              die benötigten Web Fonts in ihren Browsercache, um Texte und Schriftarten korrekt
              anzuzeigen.
            </p>
            <p className="mb-4 text-sm">
              Zu diesem Zweck muss der von Ihnen verwendete Browser Verbindung zu den Servern von
              Google aufnehmen. Hierdurch erlangt Google Kenntnis darüber, dass über Ihre IP-Adresse
              unsere Website aufgerufen wurde. Die Nutzung von Google Web Fonts erfolgt im Interesse
              einer einheitlichen und ansprechenden Darstellung unserer Online-Angebote. Dies stellt
              ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar.
            </p>
            <p className="mb-4 text-sm">
              Wenn Ihr Browser Web Fonts nicht unterstützt, wird eine Standardschrift von Ihrem
              Computer genutzt.
            </p>
            <p className="mb-4 text-sm">
              Weitere Informationen zu Google Web Fonts finden Sie unter{' '}
              <a
                href="https://developers.google.com/fonts/faq"
                className="text-blue-600 hover:underline"
              >
                https://developers.google.com/fonts/faq
              </a>{' '}
              und in der Datenschutzerklärung von Google:{' '}
              <a
                href="https://www.google.com/policies/privacy/"
                className="text-blue-600 hover:underline"
              >
                https://www.google.com/policies/privacy/
              </a>
              .
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Eigene Dienste</h2>
            <h3 className="text-lg font-medium mb-2">Umgang mit Bewerberdaten</h3>
            <p className="mb-4 text-sm">
              Wir bieten Ihnen die Möglichkeit, sich bei uns zu bewerben (z.B. per E-Mail,
              postalisch oder via Online-Bewerbungsformular). Im Folgenden informieren wir Sie über
              Umfang, Zweck und Verwendung Ihrer im Rahmen des Bewerbungsprozesses erhobenen
              personenbezogenen Daten. Wir versichern, dass die Erhebung, Verarbeitung und Nutzung
              Ihrer Daten in Übereinstimmung mit geltendem Datenschutzrecht und allen weiteren
              gesetzlichen Bestimmungen erfolgt und Ihre Daten streng vertraulich behandelt werden.
            </p>
            <h4 className="font-medium mb-2">Umfang und Zweck der Datenerhebung</h4>
            <p className="mb-4 text-sm">
              Wenn Sie uns eine Bewerbung zukommen lassen, verarbeiten wir Ihre damit verbundenen
              personenbezogenen Daten (z.B. Kontakt- und Kommunikationsdaten, Bewerbungsunterlagen,
              Notizen im Rahmen von Bewerbungsgesprächen etc.), soweit dies zur Entscheidung über
              die Begründung eines Beschäftigungsverhältnisses erforderlich ist. Rechtsgrundlage
              hierfür ist § 26 BDSG-neu nach deutschem Recht (Anbahnung eines
              Beschäftigungsverhältnisses), Art. 6 Abs. 1 lit. b DSGVO (allgemeine
              Vertragsanbahnung) und – sofern Sie eine Einwilligung erteilt haben – Art. 6 Abs. 1
              lit. a DSGVO. Die Einwilligung ist jederzeit widerrufbar. Ihre personenbezogenen Daten
              werden innerhalb unseres Unternehmens ausschließlich an Personen weitergegeben, die an
              der Bearbeitung Ihrer Bewerbung beteiligt sind.
            </p>
            <p className="mb-4 text-sm">
              Sofern die Bewerbung erfolgreich ist, werden die von Ihnen eingereichten Daten auf
              Grundlage von § 26 BDSG-neu und Art. 6 Abs. 1 lit. b DSGVO zum Zwecke der Durchführung
              des Beschäftigungsverhältnisses in unseren Datenverarbeitungssystemen gespeichert.
            </p>
            <h4 className="font-medium mb-2">Aufbewahrungsdauer der Daten</h4>
            <p className="mb-4 text-sm">
              Sofern wir Ihnen kein Stellenangebot machen können, Sie ein Stellenangebot ablehnen
              oder Ihre Bewerbung zurückziehen, behalten wir uns das Recht vor, die von Ihnen
              übermittelten Daten auf Grundlage unserer berechtigten Interessen (Art. 6 Abs. 1 lit.
              f DSGVO) bis zu 6 Monate ab der Beendigung des Bewerbungsverfahrens (Ablehnung oder
              Zurückziehung der Bewerbung) bei uns aufzubewahren. Anschließend werden die Daten
              gelöscht, und die physischen Bewerbungsunterlagen vernichtet. Die Aufbewahrung dient
              insbesondere Nachweiszwecken im Falle eines Rechtsstreits. Sofern ersichtlich ist,
              dass die Daten nach Ablauf der 6-Monatsfrist erforderlich sein werden (z.B. aufgrund
              eines drohenden oder anhängigen Rechtsstreits), findet eine Löschung erst statt, wenn
              der Zweck für die weitergehende Aufbewahrung entfällt.
            </p>
            <p className="mb-4 text-sm">
              Eine längere Aufbewahrung kann außerdem stattfinden, wenn Sie eine entsprechende
              Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) erteilt haben oder wenn gesetzliche
              Aufbewahrungspflichten der Löschung entgegenstehen.
            </p>
            <h4 className="font-medium mb-2">Aufnahme in den Bewerber-Pool</h4>
            <p className="mb-4 text-sm">
              Sofern wir Ihnen kein Stellenangebot machen, besteht ggf. die Möglichkeit, Sie in
              unseren Bewerber-Pool aufzunehmen. Im Falle der Aufnahme werden alle Dokumente und
              Angaben aus der Bewerbung in den Bewerber-Pool übernommen, um Sie im Falle von
              passenden Vakanzen zu kontaktieren.
            </p>
            <p className="mb-4 text-sm">
              Die Aufnahme in den Bewerber-Pool geschieht ausschließlich auf Grundlage Ihrer
              ausdrücklichen Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Die Abgabe der Einwilligung
              ist freiwillig und steht in keinem Bezug zum laufenden Bewerbungsverfahren. Der
              Betroffene kann seine Einwilligung jederzeit widerrufen. In diesem Fall werden die
              Daten aus dem Bewerber-Pool unwiderruflich gelöscht, sofern keine gesetzlichen
              Aufbewahrungsgründe vorliegen.
            </p>
            <p className="mb-4 text-sm">
              Die Daten aus dem Bewerber-Pool werden spätestens zwei Jahre nach Erteilung der
              Einwilligung unwiderruflich gelöscht.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
