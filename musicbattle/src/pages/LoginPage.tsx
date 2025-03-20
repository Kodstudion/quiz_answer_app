import React, { useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, database } from "../firebaseConfig"; // Importera Firebase auth och database
import { useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database"; // Importera get

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const provider = new GoogleAuthProvider();

    // Försök att logga in med Google direkt när sidan laddas
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Inloggad med Google e-post:", user.email);

        // Hämta tillåtna e-postadresser
        const emailsRef = ref(database, "allowedEmails"); // Referens till noden med tillåtna e-postadresser
        get(emailsRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const emails: string[] = [];
              snapshot.forEach((childSnapshot) => {
                emails.push(childSnapshot.val() || ""); // Hämta e-postadresserna som värden
              });

              // Kontrollera om användarens e-post finns i den tillåtna listan
              if (emails.includes(user.email || "")) {
                navigate("/admin"); // Navigera till AdminPage efter inloggning
              } else {
                // Logga ut användaren om de inte är tillåtna
                auth.signOut();
                alert("Du har inte behörighet att logga in.");
              }
            } else {
              console.log("Ingen data tillgänglig");
            }
          })
          .catch((error) => {
            console.error("Fel vid hämtning av e-postadresser:", error);
          });
      })
      .catch((error) => {
        console.error("Google-inloggning misslyckades:", error);
      });
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Loggar in med Google...</h1>
      {/* Du kan lägga till en laddningsindikator här om du vill */}
    </div>
  );
};

export default LoginPage;
