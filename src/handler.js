const { nanoid } = require('nanoid');
const bookshelfs = require('./bookshelfs');

const addBookHandler = (request, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    const id = nanoid(16);
    const finished = (pageCount === readPage);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const book = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        insertedAt,
        updatedAt,
        finished,
    };

    if (name == null) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    bookshelfs.push(book);

    const isSuccess = bookshelfs.filter((n) => n.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request) => {
    const { name, reading, finished } = request.query;

    let filteredBookshelfs = bookshelfs;

    if (name) {
        const lowerCaseName = name.toLowerCase();
        filteredBookshelfs = filteredBookshelfs.filter((bookshelf) => bookshelf.name.toLowerCase().includes(lowerCaseName));
    }

    if (reading !== undefined) {
        const isReading = reading === '1';
        filteredBookshelfs = filteredBookshelfs.filter((bookshelf) => bookshelf.reading === isReading);
    }

    if (finished !== undefined) {
        const isFinished = finished === '1';
        filteredBookshelfs = filteredBookshelfs.filter((bookshelf) => bookshelf.finished === isFinished);
    }

    const resultBooks = filteredBookshelfs.map((bookshelf) => {
        const { id, name, publisher } = bookshelf;
        return { id, name, publisher };
    });

    return {
        status: 'success',
        data: {
            books: resultBooks,
        },
    };
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = bookshelfs.filter((n) => n.id === bookId)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const finished = (pageCount === readPage);

    if (name == null) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const index = bookshelfs.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        bookshelfs[index] = {
            ...bookshelfs[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
            finished,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = bookshelfs.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        bookshelfs.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
 addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
};
