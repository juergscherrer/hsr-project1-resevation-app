# Reservations-App (HSR Project 2)

Eine Projektarbeit im CAS Frontend Engineering an der HSR Hochschule für Technik Rapperswil.

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
- [Installationsanleitung](#installationsanleitung)
- [Besondere Leistungen](#besondere-leistungen)

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

## Installationsanleitung

Aus Sicherheitsgründen fehlt die Datei mit der Firebase Konfiguration.

## Besondere Leistungen

- Komplexe Datenbankstruktur mit Zwischentabelle
- Verschiedene Benutzer Rollen
