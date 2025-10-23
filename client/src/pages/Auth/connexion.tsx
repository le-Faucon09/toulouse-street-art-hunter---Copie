import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
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

function Connexion() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: FormData) => {
    setIsLoggedIn(true);
    setUserEmail(data.email);
    reset();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
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

export default Connexion;
