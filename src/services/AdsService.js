const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const { nanoid } = require("nanoid");

class AdsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAds({ userId, title, price, description, fileNames, category }) {
    const id = `ads-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const status = "moderation";
    const query = {
      text: "INSERT INTO ads VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      values: [
        id,
        userId,
        title,
        price,
        description,
        status,
        createdAt,
        category,
      ],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Iklan gagal di tambahkan");
    }

    for (const fileName of fileNames) {
      const query = {
        text: "INSERT INTO ads_image VALUES ($1, $2) RETURNING ads_id",
        values: [id, fileName],
      };

      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new InvariantError("Gambar iklan gagal di tambahkan");
      }
    }
    return result.rows[0].id;
  }

  async putAds({ id, userId, title, price, description, fileNames, category }) {
    let query = {
      text: "UPDATE ads SET title = $2, price = $3, description = $4, status = 'moderation' WHERE id = $1 RETURNING id",
      values: [id, title, price, description],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Iklan gagal di tambahkan");
    }

    return result.rows[0].id;
  }

  async deleteAds({ id, userId }) {
    const query = {
      text: "DELETE FROM ads WHERE id = $1 AND user_id = $2 RETURNING id",
      values: [id, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Iklan gagal di hapus");
    }
    return result.rows[0].id;
  }

  async getAdsById(id) {
    let query = {
      text: `
        SELECT 
          ads.id,
          ads.title, 
          ads.price,
          ads.category,
          ads.description, 
          users.location,
          users.name,
          COALESCE(users_profile.profile_path, NULL) AS profile_path,
          ARRAY_AGG(ads_image.img_path) AS images
        FROM ads 
        JOIN users ON ads.user_id = users.id 
        LEFT JOIN users_profile ON users.id = users_profile.user_id 
        LEFT JOIN ads_image ON ads.id = ads_image.ads_id 
        WHERE ads.id = $1
        GROUP BY ads.id, users.id, users_profile.profile_path
      `,
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getAds() {
    const query = {
      text: `
                SELECT 
                    ads.id,
                    ads.title, 
                    ads.price, 
                    ads.category,
                    users.location, 
                    (SELECT img_path 
                     FROM ads_image 
                     WHERE ads_image.ads_id = ads.id 
                     LIMIT 1) AS first_image
                FROM ads 
                JOIN users ON ads.user_id = users.id 
                WHERE ads.status = 'moderation'
                ORDER BY ads.created_at DESC
                LIMIT 10
            `,
    };

    const resultDetail = await this._pool.query(query);
    return resultDetail.rows;
  }

  async getAdsSearch(search) {
    const query = {
      text: `
        SELECT 
          ads.id,
          ads.title, 
          ads.price, 
          ads.category,
          users.location, 
          (SELECT img_path 
           FROM ads_image 
           WHERE ads_image.ads_id = ads.id 
           LIMIT 1) AS first_image
        FROM ads 
        JOIN users ON ads.user_id = users.id 
        WHERE ads.status = 'moderation'
        AND (ads.title ILIKE $1 OR ads.description ILIKE $1 OR ads.category ILIKE $1)
        ORDER BY ads.created_at DESC
        LIMIT 10
      `,
      values: [`%${search}%`],
    };
  
    const resultDetail = await this._pool.query(query);
    return resultDetail.rows;
  }

  async getMyAds(userId) {
    let query = {
      text: `
         SELECT 
          ads.id,
          ads.title, 
          ads.price,
          ads.created_at,
          ads.status,
          MIN(ads_image.img_path) AS first_image
            FROM ads  
            LEFT JOIN ads_image ON ads.id = ads_image.ads_id 
            WHERE ads.user_id = $1
            GROUP BY ads.id
    `,
      values: [userId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = AdsService;
