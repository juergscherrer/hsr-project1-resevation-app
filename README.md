# Reservations-App (HSR Project 2)

Eine Projektarbeit im CAS Frontend Engineering an der HSR Hochschule für Technik Rapperswil.

- [Installationsanleitung](#installationsanleitung)
- [Projektbeschreibung](#projektbeschreibung)
  - [Dashboard](#dashboard)
  - [Kalender](#kalender)
  - [E-Mail Versand](#e-mail-versand)
  - [Rechnungen](#rechnungen)
  - [Admin Dashboard](#admin-dashboard)
  - [Mein Konto](#mein-konto)
- [Module](#module)
  - [1. User Management](#1-user-management)
  - [2. Security](#2-security)
  - [3. Reservation](#3-reservation)
  - [4. Rechnung](#4-rechnung)
  - [5. Wohnobjekt](#5-wohnobjekt)
- [Besondere Leistungen](#besondere-leistungen)
- [Usability Testing](#usability-testing)
  - [Test-Ziele](#test-ziele)
  - [Test-Aufgaben](#test-aufgaben)
  - [Test Erkenntnisse](#test-erkenntnisse)
  - [Beweis Fotos](#beweis-fotos)

## Installationsanleitung

Aus Sicherheitsgründen wurde die .env Datei mit der Firebase Konfiguration nicht auf Github gepuscht.

1. Reservations App von Github klonen.

   ```console
   git clone git@github.com:juergscherrer/hsr-project2-resevation-app.git
   ```

2. Neue Datei .env im Root erstellen und mit der Firebase Konfiguration erweitern.

   ```console
   REACT_APP_FIREBASE_KEY=
   REACT_APP_FIREBASE_DOMAIN=
   REACT_APP_FIREBASE_DATABASE=
   REACT_APP_FIREBASE_PROJECT_ID=
   REACT_APP_FIREBASE_STORAGE_BUCKET=
   REACT_APP_FIREBASE_SENDER_ID=
   ```

3. NPM install and App starten.

   ```console
   npm install
   nmp run start
   ```

4. Tests starten
   ```console
   npm run test
   ```

## Projektbeschreibung

Die Reservations-App ist eine Webapp mit der es möglich ist eine oder mehrere Ferienwohnungen
unter mehreren Personen zu verwalten.

### Dashboard

Auf der Dashboard Ansicht können beliebig viele Mietobjekte hinzügefügt,
bearbeitet oder gelöscht werden. Der Benutzer, der das Mietobjekt erstellt hat ist automatisch auch
Manager der Wohnung und kann weitere angemeldete Benutzer anhand der E-Mailadresse zum Mietobjekt hinzufügen. Beim
hinzufügen von weiteren Benutzern zu einem Mietobjekt können die Rollen «Manager» und «Besitzer» vergeben werden. Ein
Manager hat die Rechte Rechnungen einzusehen und kann weitere Benutzer hinzufügen. Der Besitzer einer Wohnung hat
gegenüber normalen Benutzern ledigich einen Preisvorteil bei der Buchung.

### Kalender

In der Kalenderansicht können Reservationen für angelegte Mietobjekte getätigt werden. Dabei ist es möglich,
dass Anreise- und Abreisetag sich überschneiden. Doppelte Buchungen sind nicht möglich. Markiert man einen Bereich im
Kalender wird Start- und Enddatum direkt im Formular übernommen. Wählt man eine bereits erstellte Buchtung aus, lässt
sich diese bearbeiten oder löschen.

### E-Mail Versand

Bei einer Reservation wird automatisch eine E-Mail mit den genauen Daten der Reservation an alle Nutzer des jeweiligen
Mietobjektes gesendet.

### Rechnungen

Auf der Rechnungsübersicht sind alle getätigten Reservationen mit dem Preis aufgelistet. Diese Rechnungen können als
bezahlt markiert werden. Beim setzten der Checkbox wird das Bezahldatum gesetzt. Weitere Einzelheiten zur Buchung können
auf einer Detailansicht eingesehen werden.

### Admin Dashboard

Auf dem Admin Dashboard wird eine Liste aller registrierter Benutzer ausgegeben.

### Mein Konto

Auf dieser Ansicht lassen sich die persönlichen Daten wie Vorname, Nachname und E-Mailadresse bearbeiten. Der Benutzer
kann hier ebenfalls sein Passwort zurücksetzten.

## Module

### 1. User Management

User Management mit [Firebase](https://firebase.google.com/) Authentication

- Benutzer Registrierung
- Übersicht aller Benutzer im Admin Dashboard

### 2. Security

- Benutzer Login / Logout
- Passwort vergessen Funktion
- Alle Bereiche der Applikation sind nur mit Benutzer- oder Administratorrechten aufrufbar

### 3. Reservation

- Reservation CRUD
- Übersicht der Reservationen in einem Kalender
- Reservationen dürfen sich nur am ersten und letzten Tag überschneiden
- Es können nur eigene Reservation bearbeitet bzw. gelöscht werden
- Reservationen können max. ein Jahr voraus getätigt werden.

### 4. Rechnung

- Übersicht aller Rechnungen
- CRUD Rechnungen
- Rechnungen können quittiert werden

### 5. Wohnobjekt

- Übersicht aller Wohnungen im Dashboard
- CRUD Wohnungen
- Benutzer werden mit Wohnobjekt verknüpft

## Besondere Leistungen

- Komplexe Datenbankstruktur mit Zwischentabelle
- Verschiedene Benutzer Rollen auf den UserRentals (Manager und Owner)

## Usability Testing

### Test-Ziele

- Mögliche Schewachstellen oder Fehler in der Applikation finden.
- Herausfinden wie gut ein Benutzer in der Applikation zurecht kommt.
- Was muss noch verbessert werden bevor die Applikation live gehen kann?

### Test-Aufgaben

- **Registrierung**  
  Du hast noch keinen Account für das Reservations-App und möchtest dich gerne registrieren. Erstelle ein Konto mit deiner
  eigenen E-Mailadresse.

- **Mietobjekt erstellen**  
  Du willst deine Ferienwohnung mit deinen Familienmitgliedern teilen. Erstelle ein neues Mietobjekt. Wähle einen
  beliebigen Titel, Beschreibungstext und Preis.

- **Benutzer zum Mietobjekt hinzufügen**  
  Du möchtest einen Benutzer zu deinem Mietobjekt hinzufügen, damit auch dieser Reservationen tätigen kann. Füge den bereits
  regisrierten Benutzer «Markus Tobler» mail@markustobler.ch zu deinem neu erstellten Mietobjekt hinzu.

- **Mietobjekt bearbeiten**  
  Du hast gemerkt, dass du einen unpassenden Titel für dein Mietobjekt gewählt hast und möchtest diesen nun ändern. Bearbeite
  dein Mietobjekt und wähle einen neuen Titel.

- **Rolle Mietobjekt / Benutzer**  
  Du möchtest, dass der neu hinzugefügte Benutzer Markus Tobler nicht Manager ist. Stell sicher, dass der Benutzer «Markus Tobler»
  kein Manager von deinem Mietobkjekt ist.

- **Neue Reservation**  
  Du möchtest für deinen Familien-Skiurlaub eine neue Reservation tätigen. Erstelle eine neue Reservation über fünf Nächte
  für 8 Personen. Zum ausfüllen der Kalenderdaten markiere die Daten direkt in der Kalenderansicht.

- **Reservation bearbeiten**  
  Eines deiner Familienmitglieder ist die Treppe hinunter gefallen und kann leider nicht zum Skiurlaub mitgehen. Ändere
  die Anzahl an Personen für deine bereits getätigte Reservation.

- **Reservation löschen**  
  Der Skiurlaub kann leider nicht stattfinden. Lösche deine getätigte Reservation.

- **Zahlungseingang bestätigen**  
  Der Benutzer «Markus Tobler» hat eine Buchung gemacht und die Rechnung bereits bezahlt. Markiere die Rechnung vom Benutzer
  «Markus Tobler» als bezahlt.

- **Benutzer Admin**  
  Du bist ein Admin des Portals «Reservations-App». Finde die Liste aller bisher registrierter Benutzer.

- **Passwort ändern**  
  Du hast dein Passwort mehr als ein jahr nicht mehr geöndert und willst dein Passwort ändern. Ändere das Passwort.

- **Persönliche Daten ändern**  
  Bei der Registrierung hast du bei deiem Vornahmen einen Tippfehler gemacht. Korrigiere deinen Vornamen.

### Fragen im Anschluss

**_Welche Aufgaben konnten nicht oder nur Teilweise gelöst werden? Warum?_**  
**Testuser 1:** Es war nicht ganz klar zu erkennen, dass man die Checkbox anwählen muss bei der Rechnungliste. Der Hinweis
«Bezahlt Ja» ist eher verwirrend als hilfreich.  
**Testuser 2:** Es konnten alle Aufgaben ohne grössere Probleme gelöst werden.

**_Welche Funktionen Fehlen deiner Meinung nach in der Applikation?_**  
**Testuser 1:** Um Sich ein besseres Bild der Mietobjekte zu machen währen Fotos sehr hilfreich.  
**Testuser 2:** Eine Karte mit einer Übersicht der Mietobjekte wäre toll.

**_Wurden deine Erwartungen an die Applikation erfüllt?_**  
**Testuser 1:** Ja, die Applikation ist übersichtlich Aufgebaut und man findet sich im Grossen und Ganzen sehr gut zurecht.  
**Testuser 2:** Ja, es gab keine Grösseren Probleme.

**_Ist das Dashboard für dich Verständlich?_**  
**Testuser 1:** Es ist nicht ganz klar, dass man ein Listenelement anwählen muss um weitere Informationen zu erhalten. Wenn
man aber den Hinweis auf der Seite sieht ist alles klar.  
**Testuser 2:** Die Dashboard Ansicht ist klar. Es ist nicht ganz klar was der Unterschied zwischen Dashboard und Admin
Dashboard ist.

### Beweis Fotos

|                                                     Usability Testing mit Simon Tobler                                                      |                                                     Usability Testing mit Markus Sitzmann                                                      |
| :-----------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------: |
| ![Usability Test Simon Tobler](https://github.com/juergscherrer/hsr-project2-resevation-app/blob/master/public/img/usability-testing-1.jpg) | ![Usability Test Markus Sitzmann](https://github.com/juergscherrer/hsr-project2-resevation-app/blob/master/public/img/usability-testing-2.jpg) |

### Test Erkenntnisse

Der Test hat uns gezeigt, dass noch einige Verbesserungen im Bereich Usability möglich sind. Grundsätzlich sind aber alle
Testpersonen mit der Applikation zurecht gekommen und konnten fast alle Aufgaben ohne grössere Probleme bewältigen.

Folgende Usability-Probleme konnten festgestellt werden:

- **Mietobjekt erstellen**
  Der Benutzer weiss nich in welcher Währung er die Preise hinterlegen muss. Er hat nicht gewusst, dass nur
  eine Zahl in CHF in die Input Felder geschrieben werden darf und hat verschiedene Dinge ausprobiert, konnte dann aber das
  Formular nicht speichern.

- **Benutzer zum Mietobjekt hinzufügen**
  Es ist nicht ganz klar für den Benutzer, dass andere Benutzer sich zuerst an der Applikation anmelden müssen, bevor man
  diese zu einem Mietobjekt hinzufügen kann. Hier wäre ein Hinweis für den Benutzer sinnvoll. Daher war es auch nicht klar,
  was genau der orange Haken bedeutet der aufpoppt, wenn man eine E-Mailadresse von einem bereits registreirten Benutzer eingibt.

- **Neue Reservation**
  Reservationen konnten von allen Testpersonen ohne Probleme getätigt werden. Dass man mit einer Markierung im Kalender
  ein Datumsbereich auswählen kann, haben aber nicht alle gleich verstanden.
  Es ist etwas umständlich für den Nutzer wieder auf die Listenansicht (Dashboard) zu kommen. Dies ist nur über die
  Navigation möglich. Hier könnte man dem Benutzer eine etwas komfortablere Lösung anbieten.

- **Zahlungseingang bestätigen**
  Dem Benutzer ist nicht klar, warum neben der Checkbox ein «Nein» bzw. ein «Ja» steht. Wählt man die Checkbox an, wechselt der Status
  von bezahlt «Nein» zu bezahlt «Ja». Dies ist aber für den Benutzer verwirrend. Es währe besser wenn man lediglich die
  Checkbox verwendet.

Die Wichtigkeit von Usability Tests wird oft unterschätzt. Wie hilfreich solche Tests sind, sieht man erst, wenn man den Test
wirklich durchgeführt hat. Wichtig ist es, dass man die Apllikation mit Personen mit unterschiedlichen EDV-Kenntnissen testet.
Menschen die täglich am Computer arbeiten sehen gewisse Dinge viel schneller, als Menschen die nur sehr selten am Computer
arbeiten.
