("use strict");

const { Book, Comment } = require("../helpers/db");

module.exports = function (app) {
    app.route("/api/books")
        .get(async function (req, res) {
            try {
                const getBooks = await Book.findAll();
                let books = getBooks;

                await Promise.all(
                    getBooks.map(async (book, index) => {
                        books[index].dataValues.commentcount =
                            await Comment.count({
                                where: { bookId: book._id },
                            });
                    })
                );

                res.status(200).json(books);
            } catch (e) {
                res.json({ error: e });
            }
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

        .delete(async function (req, res) {
            try {
                await Book.destroy({
                    truncate: true,
                });
                res.status(200).send("complete delete successful");
            } catch (e) {
                res.json({ error: e });
            }
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
                let commentContent = comments
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
