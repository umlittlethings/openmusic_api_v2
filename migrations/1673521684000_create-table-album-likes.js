exports.up = (pgm) => {
  pgm.createTable('album_likes', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'cascade',
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'albums(id)',
      onDelete: 'cascade',
    },
  });
  pgm.addConstraint('album_likes', 'unique_user_album', 'UNIQUE(user_id, album_id)');
};
exports.down = (pgm) => { pgm.dropTable('album_likes'); };