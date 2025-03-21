import React, { useEffect, useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  getAuth,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database"; // Importera get
import { database } from "../firebaseConfig"; // Importera Firebase database
import BackToHomeButton from "../components/BackHomeButton"; // Importera BackToHomeButton

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); // Ny state för behörighet
  const auth = getAuth(); // Hämta auth-instansen

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account", // Tvinga användaren att välja ett konto
    });

    try {
      // Logga ut användaren om det finns en inloggad användare
      if (user) {
        await signOut(auth);
      }

      // Logga in med Google
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      setUser(loggedInUser);

      // Hämta tillåtna e-postadresser
      const emailsRef = ref(database, "allowedEmails"); // Referens till noden med tillåtna e-postadresser
      const snapshot = await get(emailsRef);
      if (snapshot.exists()) {
        const emails: string[] = [];
        snapshot.forEach((childSnapshot) => {
          emails.push(childSnapshot.val() || ""); // Hämta e-postadresserna som värden
        });

        // Kontrollera om användarens e-post finns i den tillåtna listan
        if (emails.includes(loggedInUser.email || "")) {
          setHasPermission(true); // Användaren har behörighet
          navigate("/admin"); // Navigera till AdminPage efter inloggning
        } else {
          setHasPermission(false); // Användaren har inte behörighet
          await signOut(auth); // Logga ut användaren
        }
      }
    } catch (error) {
      console.error("Inloggningsfel:", error); // Logga felet
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => unsubscribe(); // Rensa upp prenumerationen
  }, [navigate, auth]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      <BackToHomeButton />
      <h1 className="text-2xl mb-4">Logga in med Google</h1>
      <button onClick={handleLogin} className="p-2 bg-blue-500 text-white">
        Logga in med Google
      </button>
      {hasPermission === false && (
        <p className="text-red-500 mt-2">
          Du har inte behörighet att logga in.
        </p>
      )}
    </div>
  );
};

export default LoginPage;
