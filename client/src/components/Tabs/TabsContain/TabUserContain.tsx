import { useEffect, useState } from "react";

type User = {
  id: number;
  email: string;
  created_at?: Date;
  updated_at?: Date;
  zip_code: number;
  last_name: string;
  first_name: string;
  pseudo: string;
  is_admin: boolean;
};

export default function TabUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des utilisateurs en cours...</p>;

  return (
    <table>
      <caption>Les utilisateurs et utilisatrices de street art hunter</caption>
      <thead>
        <tr>
          <th>Numéro d'identifiant</th>
          <th>Email</th>
          <th>Date de création du compte</th>
          <th>Date de mise à jour du compte</th>
          <th>Code postal</th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Pseudonyme</th>
          <th>Utilisateur au statut administrateur</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.email}</td>
            <td>
              {u.created_at ? new Date(u.created_at).toLocaleString() : ""}
            </td>
            <td>
              {u.updated_at ? new Date(u.updated_at).toLocaleString() : ""}
            </td>
            <td>{u.zip_code}</td>
            <td>{u.last_name}</td>
            <td>{u.first_name}</td>
            <td>{u.pseudo}</td>
            <td>{u.is_admin ? "Oui" : "Non"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
