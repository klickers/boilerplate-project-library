("use strict");

const { Book, Comment } = require("../helpers/db");

module.exports = function (app) {
    app.route("/api/books")
        .get(function (req, res) {
            //response will be array of book objects
            //json res format: [{"_id": bookId, "title": book_title, "commentcount": num_of_comments },...]
        })

        .post(async function (req, res) {
            let title = req.body.title;

            if (!title) {
                res.send("missing required field title");
                return;
            }

            try {
                const book = await Book.create({
                    title,
                });
                res.status(200).json(book);
            } catch (e) {
                res.json({ error: e });
            }
        })

        .delete(function (req, res) {
            //if successful response will be 'complete delete successful'
        });

    app.route("/api/books/:id")
        .get(async function (req, res) {
            let bookId = req.params.id;

            try {
                const book = await Book.findByPk(bookId);
                if (!book) {
                    res.send("no book exists");
                    return;
                }

                const comments = await Comment.findAll({
                    where: { bookId },
                });
                commentContent = comments
                    ? comments.map((comment) => comment.content)
                    : [];

                res.status(200).json({
                    ...book.dataValues,
                    comments: commentContent,
                });
            } catch (e) {
                res.json({ error: e });
            }
        })

        .post(async function (req, res) {
            let bookId = req.params.id;
            let content = req.body.comment;

            if (!content) {
                res.send("missing required field comment");
                return;
            }

            try {
                const book = await Book.findByPk(bookId);
                if (!book) {
                    res.send("no book exists");
                    return;
                }

                await Comment.create({
                    bookId,
                    content,
                });

                const comments = await Comment.findAll({
                    where: { bookId },
                });
                commentContent = comments.map((comment) => comment.content);

                res.status(200).json({
                    ...book.dataValues,
                    comments: commentContent,
                });
            } catch (e) {
                res.json({ error: e });
            }
        })

        .delete(async function (req, res) {
            let bookId = req.params.id;

            try {
                const book = await Book.findByPk(bookId);
                if (!book) {
                    res.send("no book exists");
                    return;
                }

                await Comment.destroy({ where: { bookId } });
                await Book.destroy({ where: { _id: bookId } });

                res.status(200).send("delete successful");
            } catch (e) {
                res.json({ error: e });
            }
        });
};
