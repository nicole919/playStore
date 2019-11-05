const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan("common"));

const apps = require("./playstore");

app.get("/", (req, res) => {
  res.send("hello :)");
});

app.get("/apps", (req, res) => {
  const { sort, genres = "" } = req.query;

  if (sort) {
    if (!["Rating", "App"].includes(sort)) {
      return res
        .status(400)
        .send("Apps can only only be sorted by rating or app");
    }
  }

  if (genres) {
    if (
      !["Action", "Puzzle", "Strategy", "Casual", "Arcade", "Card"].includes(
        genres
      )
    ) {
      return res
        .status(400)
        .send(
          "App genre must be one of the following: Action, Puzzle, Strategy, Casual, Arcade, or Card."
        );
    }
  }

  let results = apps.filter(app =>
    app.Genres.toLowerCase().includes(genres.toLowerCase())
  );

  if (sort === "Rating") {
    results.sort((a, b) => {
      return a[sort] < b[sort] ? 1 : a[sort] > b[sort] ? -1 : 0;
    });
  }

  if (sort === "App") {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }

  res.json(results);
});

module.exports = app;

app.listen(8000, () => {
  console.log("server started on port 8000");
});
