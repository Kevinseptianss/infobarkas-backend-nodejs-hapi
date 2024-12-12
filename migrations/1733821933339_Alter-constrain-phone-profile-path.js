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
  pgm.alterColumn("users_profile", "profile_path", {
    notNull: false,
  });

  pgm.alterColumn("users_profile", "phone", {
    notNull: false,
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.alterColumn('users_profile', 'profile_path', {
        notNull: true,
      });
      
      pgm.alterColumn('users_profile', 'phone', {
        notNull: true,
      });
};
