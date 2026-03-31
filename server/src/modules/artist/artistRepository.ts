import databaseClient from "../../../database/Client";

import type { Result, Rows } from "../../../database/Client";

type Artist = {
  id: number;
  name: string;
  bio: string;
  avatar_url: string | null;
  profile_image_url: string;
  created_at: Date;
};

class ArtistRepository {
  // The C of CRUD - Create operation

  async create(artist: Omit<Artist, "id">) {
    // Execute the SQL INSERT query to add a new item to the "item" table
    const [result] = await databaseClient.query<Result>(
      "INSERT into artist ( name, bio, avatar_url, profile_image_url) values ( ?, ?, ?, ?)",
      [artist.name, artist.bio, artist.avatar_url, artist.profile_image_url],
    );

    // Return the ID of the newly inserted artist
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id: number) {
    // Execute the SQL SELECT query to retrieve a specific item by its ID
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM artist WHERE id = ?",
      [id],
    );

    // Return the first row of the result, which represents the artist
    return (rows as Artist[])[0] ?? null;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all items from the "item" table
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM artist");

    // Return the array of Artist
    return rows as Artist[];
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing item

  async update(artist: Artist, id: number) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE artist SET name = ?, bio = ?, avatar_url = ?, profile_image_url = ?, created_at = NOW() WHERE id = ?",
      [
        artist.name ?? null,
        artist.bio ?? null,
        artist.avatar_url ?? null,
        artist.profile_image_url ?? null,
        id,
      ],
    );

    return result;
  }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an item by its ID

  async delete(id: number) {
    await databaseClient.query("DELETE FROM artist WHERE id = ?", [id]);
  }
}

export default new ArtistRepository();

// The D of CRUD - Delete operation
// TODO: Implement the delete operation to remove an item by its ID

// async delete(id: number) {
//   ...
// }
