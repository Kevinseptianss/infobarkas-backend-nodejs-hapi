const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const { nanoid } = require("nanoid");
const bcrypt = require("bcryptjs");
const AuthenticationError = require("../exceptions/AuthenticationError");
const NotFoundError = require("../exceptions/NotFoundError");
class UsersServices {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ email, name, password, location }) {
    await this.verifyEmail(email);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: "INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, email, hashedPassword, name, createdAt, updatedAt, location],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("User gagal di tambahkan");
    }

    return result.rows[0].id;
  }

  async addUserAuth({ id, email, name, password, location }) {
    await this.verifyEmail(email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: "INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, email, hashedPassword, name, createdAt, updatedAt, location],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("User gagal di tambahkan");
    }

    return result.rows[0].id;
  }

  async verifyEmail(email) {
    const query = {
      text: "SELECT email FROM users WHERE email = $1",
      values: [email],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError(
        "Gagal menambahkan E-Mail, E-Mail sudah di gunakan"
      );
    }
  }

  async checkEmail(email) {
    const query = {
      text: "SELECT email FROM users WHERE email = $1",
      values: [email],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async getUserProfile(userId) {
    const query = {
      text: `SELECT 
                users.id, 
                users.name, 
                users.email,
                users.location,
                users_profile.profile_path, 
                users_profile.phone 
              FROM users 
              LEFT JOIN users_profile ON users.id = users_profile.user_id 
              WHERE users.id = $1`,
      values: [userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return result.rows[0];
  }

  async putUserProfile(userId, name, phone, location) {
    // First query to update the user's name
    try {
      if (name) {
        const query = {
          text: `UPDATE users
                 SET name = $2
                 WHERE id = $1`,
          values: [userId, name],
        };

        // Execute the first query
        const result = await this._pool.query(query);

        // Check if the user was found and updated
        if (result.rowCount === 0) {
          throw new NotFoundError("User  tidak ditemukan");
        }
      }

      if (phone) {
        // First, check if the user profile exists
        const checkProfileQuery = {
          text: `SELECT COUNT(*) FROM users_profile WHERE user_id = $1`,
          values: [userId],
        };
      
        const result = await this._pool.query(checkProfileQuery);
        const profileExists = result.rows[0].count > 0; // Check if any profile exists
      
        if (profileExists) {
          // If the profile exists, update it
          const updateProfileQuery = {
            text: `UPDATE users_profile
                   SET phone = $2
                   WHERE user_id = $1`,
            values: [userId, phone],
          };
      
          // Execute the update query
          await this._pool.query(updateProfileQuery);
        } else {
          // If the profile does not exist, create a new profile
          const createProfileQuery = {
            text: `INSERT INTO users_profile (user_id, phone)
                   VALUES ($1, $2)`,
            values: [userId, phone],
          };
      
          // Execute the insert query
          await this._pool.query(createProfileQuery);
        }
      }

      if (location) {
        const queryProfile = {
          text: `UPDATE users
           SET location = $2
           WHERE id = $1`,
          values: [userId, location],
        };

        await this._pool.query(queryProfile);
      }

      // Optionally return the updated user information or a success message
      return { userId, name, phone }; // or return the updated user object if needed
    } catch (error) {
      console.log(error);
    }
  }

  async addProfilePicture(userId, profile_path) {
    try {
      const query = {
        text: "INSERT INTO users_profile VALUES ($1, $2) RETURNING user_id",
        values: [userId, profile_path],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new InvariantError("User Profile gagal di perbaharui");
      }

      return result.rows[0].id;
    } catch (error) {
      console.log(error);
    }
  }

  async checkPP(userId) {
    const query = {
      text: "SELECT profile_path FROM users_profile WHERE user_id = $1",
      values: [userId],
    };
    const result = await this._pool.query(query);

    // Check if the query returned any rows
    if (result.rows.length === 0) {
      return null;
    }

    // Check if the profile_path is null or undefined
    const profilePath = result.rows[0].profile_path;
    return profilePath;
  }

  async deletePP(userId) {
    const query = {
      text: "DELETE FROM users_profile WHERE user_id = $1",
      values: [userId],
    };
    await this._pool.query(query);
    return "success";
  }

  async verifyUserCredential(email, password) {
    const query = {
      text: "SELECT id, password FROM users WHERE email = $1",
      values: [email],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError("Kresidential yang anda berikan salah");
    }

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError("kresidential yang anda berikan salah");
    }

    return id;
  }
}

module.exports = UsersServices;
