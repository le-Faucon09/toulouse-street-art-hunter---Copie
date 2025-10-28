import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import "./connexion.css";

const validationSchema = yup.object({
  email: yup
    .string()
    .required("Il faut préciser votre email")
    .email("l'email n'est pas valide"),
  password: yup
    .string()
    .required("Il faut préciser votre password")
    .min(6, "Mot de passe trop court"),
});

type FormData = yup.InferType<typeof validationSchema>;

export default function Connexion() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    setIsLoggedIn(true);
    setUserEmail(user.email);
  }
}, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/users/login`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token)
        localStorage.setItem("user", JSON.stringify(result.user));

        alert(`Bienvenue ${result.user.pseudo} !`);
        navigate("/profil");
         setIsLoggedIn(true);
         setUserEmail(result.user.email);
      } else {
        alert(result.message || "Email ou mot de passe incorrect");
      }
    } catch(error) {
      console.error("Erreur réseau :", error);
      alert("Erreur de connexion au serveur")
    }
    
    reset();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    reset();
  };

  return (
    <>
    <main className="connexion-container">
      {isLoggedIn ? (
        <div className="welcom-message">
          <p>Bienvenue, {userEmail} !</p>
          <button
            className="btn-deconnection"
            type="button"
            onClick={handleLogout}
          >
            Deconnexion
          </button>
        </div>
      ) : (
        <>
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email">Email</label>
          <input {...register("email")} type="email" id="email" required />
          {errors.email && <p className="form-error">{errors.email.message}</p>}

          <label htmlFor="password">Mot de passe</label>
          <input
            {...register("password")}
            type="password"
            id="password"
            required
          />
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
          <div>
            <button id="btn-connexion" type="submit">
              Connexion
            </button>
          </div>
        </form>
        </>
      )}
    </main>
    </>
  );
}
