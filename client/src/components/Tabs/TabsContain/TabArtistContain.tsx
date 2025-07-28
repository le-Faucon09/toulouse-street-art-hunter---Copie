import { useEffect, useState } from "react";

type Artist = {
  id: number;
  name: string;
  bio: string;
  profile_image_url: string;
  created_at?: Date;
};

export default function TabArtist() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/artist`)
      .then((res) => res.json())
      .then((data) => {
        setArtists(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des artistes en cours...</p>;

  return (
    <table>
      <caption>Les artistes de street art hunter</caption>
      <thead>
        <tr>
          <th>Numéro d'identifiant</th>
          <th>Nom de l'artiste</th>
          <th>Date de création du compte</th>
          <th>Date de mise à jour du compte</th>
        </tr>
      </thead>
      <tbody>
        {artists.map((a) => (
          <tr key={a.id}>
            <td>{a.id}</td>
            <td>{a.name}</td>
            <td>{a.bio}</td>
            <td>{a.profile_image_url}</td>
            <td>
              {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
