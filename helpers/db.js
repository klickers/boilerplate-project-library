const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("sqlite::memory:");

const Book = sequelize.define(
    "Book",
    {
        _id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        commentcount: {
            type: DataTypes.INTEGER,
        },
    },
    {
        timestamps: false,
    }
);

const Comment = sequelize.define(
    "Comment",
    {
        book_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

Book.hasMany(Comment, {
    foreignKey: "book_id",
});
Comment.hasOne(Book);

sequelize.sync();

module.exports = { sequelize, Book, Comment };
