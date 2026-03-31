import databaseClient from "../../../database/Client";
import type { Result, Rows } from "../../../database/Client";

interface DiscoveredEntry {
  id?: number; // Optionnel car auto-incrémenté
  user_id: number;
  artwork_id: number;
  photo_url: string; // corrigé : doit correspondre à la colonne SQL
  discovered_at?: Date;
}

class DiscoveredRepository {
  async create(
    data: Omit<DiscoveredEntry, "id" | "discovered_at"> & {
      discovered_at?: Date | string;
    },
  ): Promise<Result> {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO discovered_artwork (user_id, artwork_id, photo_url, discovered_at) VALUES (?, ?, ?, ?)",
      [
        data.user_id,
        data.artwork_id,
        data.photo_url,
        data.discovered_at || new Date(),
      ],
    );
    return result;
  }

  async read(id: number): Promise<DiscoveredEntry | undefined> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM discovered_artwork WHERE id = ?",
      [id],
    );
    return rows[0] as DiscoveredEntry | undefined;
  }

  async readAll(): Promise<DiscoveredEntry[]> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM discovered_artwork",
    );
    return rows as DiscoveredEntry[];
  }

  async update(data: DiscoveredEntry): Promise<Result> {
    const [result] = await databaseClient.query<Result>(
      "UPDATE discovered_artwork SET user_id = ?, artwork_id = ?, photo_url = ?, discovered_at = ? WHERE id = ?",
      [
        data.user_id,
        data.artwork_id,
        data.photo_url,
        data.discovered_at,
        data.id,
      ],
    );
    return result;
  }

  async delete(id: number): Promise<Result> {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM discovered_artwork WHERE id = ?",
      [id],
    );
    return result;
  }
}

export default new DiscoveredRepository();
