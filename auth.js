const argon2 = require("argon2");
/*Configuration pour Argon2 :
config mini de 15 Mio de mémoire
nbre itérations 2
degré de parallélisme 1
*/
const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};
/* On récupère le mot de passe à hacher à partir de
req.body.password
Et le mot de passe HACHE est stocké dans
req.body.hashedPassword
*/
const hashPassword = (req, res, next) => {
  argon2
    .hash(req.body.password, hashingOptions)
    .then((hashedPassword) => {

      req.body.hashedPassword = hashedPassword;
      delete req.body.password;

      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  hashPassword,
};

