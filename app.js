require("dotenv");
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const connectDB = require("./connectDB");
const Book = require("./modles/Books");

const app = express();
const PORT = process.env.PORT || 7000;

connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/api/books", async (req, res) => {
  try {
    const category = req.query.category;

    const filter = {};
    if (category) {
      filter.category = category;
    }

    const data = await Book.find(filter);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "an error occored" });
  }
});

app.get("/api/books/:slug", async (req, res) => {
  try {
    const slugParam = req.params.slug;

    const data = await Book.findOne({ slug: slugParam });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "an error occored" });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/books/", upload.single("thumbnail"), async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);
    const newBook = new Book({
      title: req.body.title,
      slug: req.body.slug,
      stars: req.body.stars,
      description: req.body.description,
      category: req.body.category,
      thumbnail: req.file.filename,
    });

    await Book.create(newBook);
    res.json("Data Subbmmited");
  } catch (error) {
    res.status(500).json({ error: "an error occored" });
  }
});

app.put("/api/books/", upload.single("thumbnail"), async (req, res) => {
  try {
    const bookId = req.body.bookId;

    const updateBook = {
      title: req.body.title,
      slug: req.body.slug,
      stars: req.body.stars,
      description: req.body.description,
      category: req.body.category,
    };
    if (req.file) {
      updateBook.thumbnail = req.file.filename;
    }

    await Book.findByIdAndUpdate(bookId, updateBook);
    res.json("Data Subbmmited");
  } catch (error) {
    res.status(500).json({ error: "an error occored" });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    await Book.deleteOne({ _id: bookId });
    res.json("how dare you" + req.body.bookId);
  } catch (error) {
    res.json(error);
  }
});

// app.post("/api/books/", async (req, res) => {
//   try {
//     console.log(req.body)
//     const newBook = new Book({
//       title:req.body.title,
//       slug:req.body.slug,
//       stars:req.body.stars,
//       description:req.body.description,
//       category:req.body.category,
//     })

//   await Book.create(newBook)
//     res.json("Data Subbmmited")
//   } catch (error) {
//     res.status(500).json({ error: "an error occored" });
//   }
// });

app.get("/", (req, res) => {
  res.json("hello");
});

app.get("*", (req, res) => {
  res.sendStatus("404");
});

app.listen(PORT, () => {
  console.log(`NodeJS server is running on http://localhost:${PORT}`);
});
