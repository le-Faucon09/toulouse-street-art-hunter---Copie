import type { Result, Rows } from "../../../database/Client";

import databaseClient from "../../../database/Client";

type score = {
  id: number;
  user_Id: string;
  total_points: string;
  updated_at: string;
};

class scoreRepository {
  async create(score: Omit<score, "id">): Promise<Result> {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO score (user_Id, total_points, updated_at, ) VALUES (?, ?, ?, ?)",
      [score.user_Id, score.total_points, score.updated_at],
    );
    return result;
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT* FROM artist WHERE id = ?",
      [id],
    );

    return rows[0] as score;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("select * from artist");
    return rows as score[];
  }

  async update(score: score) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE score SET user_Id = ?, total_points = ?, updated_at = ?,  WHERE id = ?",
      [score.user_Id, score.total_points, score.updated_at, score.id],
    );
    return result;
  }

  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM artist WHERE id = ?",
      [id],
    );
    return result;
  }
}

export default scoreRepository;
