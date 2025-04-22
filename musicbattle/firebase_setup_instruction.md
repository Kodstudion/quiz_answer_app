# Guide för att sätta upp Firebase med specifika säkerhetsregler

## 1. Skapa ett Firebase-projekt

1. Gå till [Firebase Console](https://console.firebase.google.com/)
2. Klicka på "Lägg till projekt" (Add project)
3. Ange ett projektnamn
4. Följ guiden för att skapa projektet

## 2. Konfigurera Real-time Database

1. I Firebase Console, välj "Realtime Database" i vänstermenyn
2. Klicka på "Skapa databas" (Create database)
3. Välj en plats för databasen (t.ex. europe-west1)
4. Välj "Start i produktionsläge" (Start in production mode)
5. Klicka på "Aktivera"

## 3. Konfigurera Authentication

1. I Firebase Console, välj "Authentication" i vänstermenyn
2. Klicka på "Kom igång" (Get started)
3. Välj "Google" som inloggningsmetod
4. Aktivera den och spara

## 4. Sätta upp säkerhetsregler

1. I Firebase Console, gå till Realtime Database > Regler
2. Ersätt standardreglerna med följande:

```json
{
  "rules": {
    ".read": false,
    ".write": false,

    "allowedEmails": {
      ".read": true
    },
    "buttonMode": {
      ".write": "auth != null && (auth.token.email == 'email1@email.se' || auth.token.email == 'email2@email.se')",
      ".read": true
    },
    "clicks": {
      ".write": true,
      ".read": true
    }
  }
}
```

3. Klicka på "Publicera" (Publish)

## 5. Skapa användare i Authentication

1. I Firebase Console, gå till Authentication > Users
2. Klicka på "Lägg till användare" (Add user)
3. Lägg till de e-postadresserna som har skrivrättigheter:
   - email1@email.se
   - email2@email.se

## 6. Skapa en databasstruktur

1. I Firebase Console, gå till Realtime Database > Data
2. Skapa följande struktur:

```json
{
  "allowedEmails": {
    // Här lägger du till tillåtna e-postadresser
  },
  "buttonMode": {
    // Här lagras knappläget
  },
  "clicks": {
    // Här lagras klick
  }
}
```

## 7. Hämta konfigurationsvärden

1. I Firebase Console, klicka på kugghjulet (⚙️) bredvid "Project Overview"
2. Välj "Projektinställningar" (Project settings)
3. Rulla ner till "Dina appar" (Your apps)
4. Klicka på web-ikonen (</>)
5. Registrera appen med ett namn
6. Kopiera konfigurationsobjektet

## 8. Kopiera miljövariabler

Kopiera variablerna till `.env`-filen och `.env.production`-filen i repot:

```plaintext
VITE_FIREBASE_API_KEY=din-api-nyckel
VITE_FIREBASE_AUTH_DOMAIN=ditt-projekt.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://ditt-projekt.firebaseio.com
VITE_FIREBASE_PROJECT_ID=ditt-projekt
VITE_FIREBASE_STORAGE_BUCKET=ditt-projekt.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=ditt-sender-id
VITE_FIREBASE_APP_ID=ditt-app-id
```

## 8. Bygg om applikationen

Bygg om webbapplikationen med nya variablerna och publicera sidan.

```terminal
PS> vite run build
```

Kopiera dist katalogen till webbservern

## Viktiga säkerhetstips

1. **API-nyckel**: Se till att din API-nyckel är säker och inte exponerad i klientkoden
2. **Datastruktur**: Följ den definierade datastrukturen för att undvika problem med säkerhetsreglerna
3. **`.env`-fil**: Lägg till `.env` i `.gitignore` för att undvika att exponera känslig information
