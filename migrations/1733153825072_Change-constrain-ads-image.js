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
    pgm.dropConstraint("ads_image", "fk_ads_image_user_id");
    pgm.addConstraint("ads_image", "fk_ads_image_ads_id", {
        foreignKeys: {
            columns: "ads_id",
            references: "ads(id)",
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
    pgm.dropConstraint("ads_image", "fk_ads_image_ads_id");
};
