require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
/*Pour l'authentification, on rajoute verifyPassword*/
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");
const userHandlers = require("./userHandlers");


/*Ttes les routes GET et POST users et api/login doivent être publiques :*/
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);


/*Pour protéger une route, on ajoute verifyToken dans le chemin */
app.post("/api/users", hashPassword, userHandlers.postUser);
// Pour l'authentification on ajoute le login
app.post("/api/login", userHandlers.getUserByEmailWithPasswordAndPassToNext, verifyPassword);


/*Les autres routes doivent être privées => donc on fait un mur :*/
app.use(verifyToken);
app.post("/api/movies", verifyToken, movieHandlers.postMovie);
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.put("/api/users/:id", userHandlers.updateUser);
app.delete("/api/users/:id", userHandlers.deleteUser);



app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});




