/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
    suite("Routing tests", function () {
        let bookId,
            badId = "werwer-23r9i23i-aoweijf";

        suite(
            "POST /api/books with title => create book object/expect book object",
            function () {
                test("Test POST /api/books with title", function (done) {
                    chai.request(server)
                        .post("/api/books")
                        .send({
                            title: "Test Book",
                        })
                        .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.isObject(
                                res.body,
                                "response should be an object"
                            );
                            assert.property(
                                res.body,
                                "title",
                                "Book object should contain title"
                            );
                            assert.property(
                                res.body,
                                "_id",
                                "Book object should contain _id"
                            );
                            bookId = res.body._id;
                            done();
                        });
                });

                test("Test POST /api/books with no title given", function (done) {
                    chai.request(server)
                        .post("/api/books")
                        .send({
                            title: "",
                        })
                        .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(
                                res.text,
                                "missing required field title"
                            );
                            done();
                        });
                });
            }
        );

        /*
        suite("GET /api/books => array of books", function () {
            test("Test GET /api/books", function (done) {
                //done();
            });
        });*/

        suite("GET /api/books/[id] => book object with [id]", function () {
            test("Test GET /api/books/[id] with id not in db", function (done) {
                chai.request(server)
                    .get("/api/books/" + badId)
                    .end(function (err, res) {
                        assert.equal(res.text, "no book exists");
                        done();
                    });
            });

            test("Test GET /api/books/[id] with valid id in db", function (done) {
                chai.request(server)
                    .get("/api/books/" + bookId)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.isObject(
                            res.body,
                            "response should be an object"
                        );
                        assert.property(
                            res.body,
                            "title",
                            "Book object should contain title"
                        );
                        assert.property(
                            res.body,
                            "_id",
                            "Book object should contain _id"
                        );
                        assert.isArray(
                            res.body.comments,
                            "comments should be an array"
                        );
                        done();
                    });
            });
        });

        suite(
            "POST /api/books/[id] => add comment/expect book object with id",
            function () {
                test("Test POST /api/books/[id] with comment", function (done) {
                    chai.request(server)
                        .post("/api/books/" + bookId)
                        .send({
                            comment: "Test comment",
                        })
                        .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.isObject(
                                res.body,
                                "response should be an object"
                            );
                            assert.property(
                                res.body,
                                "title",
                                "Book object should contain title"
                            );
                            assert.property(
                                res.body,
                                "_id",
                                "Book object should contain _id"
                            );
                            assert.isArray(
                                res.body.comments,
                                "comments should be an array"
                            );
                            done();
                        });
                });

                test("Test POST /api/books/[id] without comment field", function (done) {
                    chai.request(server)
                        .post("/api/books/" + bookId)
                        .send({
                            comment: "",
                        })
                        .end(function (err, res) {
                            assert.equal(
                                res.text,
                                "missing required field comment"
                            );
                            done();
                        });
                });

                test("Test POST /api/books/[id] with comment, id not in db", function (done) {
                    chai.request(server)
                        .post("/api/books/" + badId)
                        .send({
                            comment: "Test comment",
                        })
                        .end(function (err, res) {
                            assert.equal(res.text, "no book exists");
                            done();
                        });
                });
            }
        );

        /*suite("DELETE /api/books/[id] => delete book object id", function () {
            test("Test DELETE /api/books/[id] with valid id in db", function (done) {
                //done();
            });

            test("Test DELETE /api/books/[id] with  id not in db", function (done) {
                //done();
            });
        });
        */
    });
});
