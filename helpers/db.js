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
    },
    {
        timestamps: false,
    }
);

const Comment = sequelize.define(
    "Comment",
    {
        bookId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Book,
                key: "_id",
            },
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

sequelize.sync();

module.exports = { sequelize, Book, Comment };
