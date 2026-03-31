import databaseClient from "../../../database/Client";

import type { Result, Rows } from "../../../database/Client";

type User = {
  id: number;
  email: string;
  avatar_url: string | null;
  created_at?: Date;
  updated_at?: Date;
  zip_code: number;
  last_name: string;
  first_name: string;
  password_hash: string;
  pseudo: string;
  is_admin: boolean;
};

class UsersRepository {
  // The C of CRUD - Create operation

  async create(user: Omit<User, "id">) {
    // Execute the SQL INSERT query to add new users to the "user" table
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO user (email, avatar_url, zip_code, last_name, first_name, password_hash, pseudo, is_admin) values (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.email,
        user.avatar_url,
        user.zip_code,
        user.last_name,
        user.first_name,
        user.password_hash,
        user.pseudo,
        user.is_admin,
      ],
    );

    // Return the ID of the newly inserted user
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id: number) {
    // Execute the SQL SELECT query to retrieve a specific user by its ID
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE id = ?",
      [id],
    );

    // Return the first row of the result, which represents the user
    return rows as User[];
  }

  async readByEmailWithPassword(email: string) {
    // Execute the SQL SELECT query to retrieve a specific user by its email
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE email = ?",
      [email],
    );
    // Return the first row of the result, which represents the user
    return rows[0] as User;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all users from the "user" table
    const [rows] = await databaseClient.query<Rows>(
      "SELECT email, avatar_url, created_at, updated_at, zip_code, last_name, first_name, password_hash, pseudo, is_admin FROM user",
    );

    // Return the array of users
    return rows as User[];
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing user

  // async update(user: user) {
  //   ...
  // }
  async update(user: User, id: number) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE user SET email = ?, avatar_url = ?, updated_at = NOW() ,zip_code = ?, first_name = ?, last_name = ?, password_hash = ?, pseudo = ?, is_admin = ? WHERE id = ?",
      [
        user.email ?? null,
        user.avatar_url ?? null,
        user.zip_code ?? null,
        user.first_name ?? null,
        user.last_name ?? null,
        user.password_hash ?? null,
        user.pseudo ?? null,
        user.is_admin ?? false,
        id,
      ],
    );
    return result;
  }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an user by its ID

  // async delete(id: number) {
  //   ...
  // }
  async delete(id: number) {
    await databaseClient.query("DELETE FROM user WHERE id = ?", [id]);
  }
}

export default new UsersRepository();
