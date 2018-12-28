# Reservations - App (HSR Project 2)

- [Projektidee](#projektidee)
- [Module](#module)
  - [1. User Management und Security](#1-user-management-und-security)
  - [2. Reservation](#2-reservation)
  - [3. Rechnung](#3-rechnung)
  - [4. Wohnobjekt](#4-wohnobjekt)
- [Installation](#installation)

## Projektidee

Es soll eine Reservations-Applikation erstellt werden mit dieser es möglich ist Ferienwohnungen
unter mehreren Personen zu verwalten. In einem geschützten Bereich werden Reservationen für
diese Wohnung getätigt. Bei einer Reservation soll automatisch eine E-Mail mit den genauen
Daten der Reservation an die anderen Nutzer gesendet werden. In einer zweiten Übersicht sollen
alle Rechnungen zu den getätigten Reservationen aufgelistet sein. Diese Rechnungen können
quittiert, bearbeitet und gelöscht werden. Am Tag an dem die Reservation endet soll,
automatisch eine E-Mail mit der Rechnung an den jeweiligen Nutzer gesendet werden.

## Module

### 1. User Management & Security

User Management mit [Firebase](https://firebase.google.com/) Authentication

- Benutzer Login / Logout
- Passwort vergessen Funktion
- Benutzer Registrierung
- Übersicht aller Benutzer im Admin Dashboard
- Alle Bereiche der Applikation sind nur mit Benutzer- oder Administratorrechten aufrufbar

### 2. Reservation

- Reservation CRUD
- Übersicht der Reservationen in einem Kalender
- Reservationen dürfen sich nur am ersten und letzten Tag überschneiden
- Es können nur eigene Reservation bearbeitet bzw. gelöscht werden
- Reservationen können max. ein Jahr voraus getätigt werden.

### 3. Rechnung

- Übersicht aller Rechnungen
- CRUD Rechnungen
- Rechnungen können quittiert werden

### 4. Wohnobjekt

- Übersicht aller Wohnungen im Dashboard
- CRUD Wohnungen
- Benutzer werden mit Wohnobjekt verknüpft

## Installation

Aus Sicherheitsgründen fehlt die Datei mit der Firebase Konfiguration.
