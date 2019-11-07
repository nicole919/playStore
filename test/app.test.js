const supertest = require("supertest");
const app = require("../app");
const { expect } = require("chai");

describe("GET /apps", () => {
  it("should return an array of apps", () => {
    return supertest(app)
      .get("/apps")
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf.at.least(1);
        const app = res.body[0];
        expect(app).to.include.all.keys("App", "Rating", "Genres");
      });
  });
  it("should be 400 if sort is incorrect", () => {
    return supertest(app)
      .get("/apps")
      .query({ sort: "MISTAKE" })
      .expect(400, "Apps can only only be sorted by rating or app");
  });
  it("should be 400 if genre filter is incorrect", () => {
    return supertest(app)
      .get("/apps")
      .query({ genres: "MISTAKE" })
      .expect(
        400,
        "App genre must be one of the following: Action, Puzzle, Strategy, Casual, Arcade, or Card."
      );
  });
  it("should return a filtered set of apps by genre", () => {
    return supertest(app)
      .get("/apps")
      .query({ genres: "Action" })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf.at.least(1);
        const apps = res.body;
        const genres = apps.map(app => {
          return app.Genres;
        });
        expect(genres).all.include("Action");
      });
  });
  it("should sort by rating", () => {
    return supertest(app)
      .get("/apps")
      .query({ sort: "Rating" })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an("array");
        let i = 0;
        let sorted = true;
        while (sorted && i < res.body.length - 1) {
          sorted = res.body[i].Rating >= res.body[i + 1].Rating;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
  it("should sort by name of app", () => {
    return supertest(app)
      .get("/apps")
      .query({ sort: "App" })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an("array");
        let i = 0;
        let sorted = true;
        while (sorted && i < res.body.length - 1) {
          sorted =
            sorted &&
            res.body[i].App.toLowerCase() < res.body[i + 1].App.toLowerCase();
          i++;
        }
      });
  });
});
