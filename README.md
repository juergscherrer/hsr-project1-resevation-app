# Reservations - App (HSR Project 2)

Eine Projektarbeit im CAS Frontend Engineering an der HSR Hochschule für Technik Rapperswil.

- [Projektbeschreibung](#projektbeschreibung)
- [Module](#module)
  - [1. User Management](#1-user-management)
  - [2. Security](#2-security)
  - [3. Reservation](#3-reservation)
  - [4. Rechnung](#4-rechnung)
  - [5. Wohnobjekt](#5-wohnobjekt)
- [Installationsanleitung](#installationsanleitung)
- [Besondere Leistungen](#besondere-leistungen)

## Projektbeschreibung

Es soll eine Reservations-Applikation erstellt werden mit dieser es möglich ist Ferienwohnungen
unter mehreren Personen zu verwalten. In einem geschützten Bereich werden Reservationen für
diese Wohnung getätigt. Bei einer Reservation soll automatisch eine E-Mail mit den genauen
Daten der Reservation an die anderen Nutzer gesendet werden. In einer zweiten Übersicht sollen
alle Rechnungen zu den getätigten Reservationen aufgelistet sein. Diese Rechnungen können
quittiert, bearbeitet und gelöscht werden. Am Tag an dem die Reservation endet soll,
automatisch eine E-Mail mit der Rechnung an den jeweiligen Nutzer gesendet werden.

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
- Verschiedene User Rollen
