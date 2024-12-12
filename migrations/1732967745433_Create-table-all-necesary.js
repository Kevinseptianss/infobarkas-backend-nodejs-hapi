/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('users', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        email: {
            type: 'TEXT',
            notNull: true,
        },
        password: {
            type: 'TEXT',
            notNull: true
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        created_at: {
            type: 'TIMESTAMP',
        },
        updated_at: {
            type: 'TIMESTAMP',
        },
    });

    pgm.createTable('users_profile', {
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        profile_path: {
            type: 'TEXT',
            notNull: false,
        },
        phone: {
            type: 'TEXT',
            notNull: false,
        }
    });

    pgm.addConstraint("users_profile", "fk_profile_user_id", {
        foreignKeys: {
            columns: "user_id",
            references: "users(id)",
            onDelete: "CASCADE",
        }
    });

    pgm.createTable('ads', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        title: {
            type: 'TEXT',
            notNull: true
        },
        price: {
            type: 'INTEGER',
            notNull: true
        },
        description: {
            type: 'TEXT',
            notNull: true,
        },
        status: {
            type: 'TEXT',
            notNull: true,
        }
    });

    pgm.addConstraint("ads", "fk_ads_user_id", {
        foreignKeys: {
            columns: "user_id",
            references: "users(id)",
            onDelete: "CASCADE",
        }
    });

    pgm.createTable("ads_image", {
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        img_path: {
            type: 'TEXT',
            notNull: true
        }
    })
    pgm.addConstraint("ads_image", "fk_ads_image_user_id", {
        foreignKeys: {
            columns: "user_id",
            references: "users(id)",
            onDelete: "CASCADE",
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable("users");
    pgm.dropTable("users_profile");
    pgm.dropTable("ads");
    pgm.dropTable("ads_image");
};
