import { nanoid } from "nanoid";
import { Books } from "./books.mjs";

const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(11);
  const finished = pageCount === readPage ? true : false;
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
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);

    return response;
  }

  Books.push(book);
  const isSuccess = Books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);

    return response;
  }

  const response = h.response({
    status: "error",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);

  return response;
};

const getAllBooks = (request, h) => {
  const objectModel = (obj) => {
    return obj.map((book) => {
      return {
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      };
    });
  };

  const setResponse = (books) => {
    const response = h.response({
      status: "success",
      data: {
        books: books,
      },
    });
    response.code(200);

    return response;
  };

  const { reading, finished, name } = request.query;

  if (reading === "1") {
    const book = objectModel(Books.filter((book) => book.reading === true));
    return setResponse(book);
  }

  if (reading === "0") {
    const book = objectModel(Books.filter((book) => book.reading === false));
    return setResponse(book);
  }

  if (finished === "1") {
    const book = objectModel(Books.filter((book) => book.finished === true));
    return setResponse(book);
  }

  if (finished === "0") {
    const book = objectModel(Books.filter((book) => book.finished === false));
    return setResponse(book);
  }

  if (name) {
    const book = objectModel(
      Books.filter((book) =>
        book.name.toLowerCase().includes(name.toLowerCase())
      )
    );
    return setResponse(book);
  }

  return setResponse(objectModel(Books));
};

const getDetailBook = (request, h) => {
  const { bookId } = request.params;
  const book = Books.filter((book) => book.id === bookId);

  if (book < 1) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: "success",
    data: {
      book: book[0],
    },
  });

  response.code(200);

  return response;
};

const updateBook = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const finished = pageCount === readPage ? true : false;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);

    return response;
  }

  const book = Books.filter((book) => book.id === bookId);

  if (book.length < 1) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });

    response.code(404);
    return response;
  }

  book[0].name = name;
  book[0].year = year;
  book[0].author = author;
  book[0].summary = summary;
  book[0].publisher = publisher;
  book[0].pageCount = pageCount;
  book[0].readPage = readPage;
  book[0].finished = finished;
  book[0].updatedAt = updatedAt;
  book[0].reading = reading;

  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
  response.code(200);

  return response;
};

const deleteBook = (request, h) => {
  const { bookId } = request.params;
  const book = Books.filter((book) => book.id === bookId);

  if (book < 1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }
  Books.splice(0, 1);

  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });

  response.code(200);

  return response;
};

export { getAllBooks, addBook, getDetailBook, updateBook, deleteBook };
