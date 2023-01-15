/*
 * @Author: Emma Forslund - emfo2102 
 * @Date: 2023-01-12 16:53:21 
 * @Last Modified by: Emma Forslund - emfo2102
 * @Last Modified time: 2023-01-15 18:30:58
 */


var express = require('express');
var router = express.Router();
const { isEmail } = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");



const bodyParser = require('body-parser');
router.use(
  bodyParser.urlencoded({
    extended: true
  })
)
router.use(bodyParser.json());

/********************************************* 
 * Initierar databasen och koppling mot databas
 *********************************************/
let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/shoppingList', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise; // Global use of mongoose

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) { // Lyssnare
  console.log("Connected to db (User)");

  // Skapar schemat för databasen 
  let userSchema = mongoose.Schema({
    email: {
      type: String,
      required: [true, 'Email måste fyllas i'],
      validate: {
        validator: isEmail,
        message: props => `${props.value} Är inte en giltig mailadress`
      }
    },
    password: {
      type: String,
      required: [true, 'Lösenord måste fyllas i'],
      validate: {
        validator: function (value) {
          return value.length >= 6
        },
        message: () => 'Lösenordet måste vara minst 6 tecken långt'
      }
    }
  });

  // Skapar model av schemat
  let User = mongoose.model('user', userSchema);


  //Lägga till en användare
  router.post("/adduser", async (req, res) => {
    try {
      // Hämtar email och lösenord från req.body
      const { email, password } = req.body;

      // Kontroll för att se om användare existerar 
      let userExists = await User.findOne({ email });

      if (userExists) {
        res.status(401).json({ message: "Denna mailadress används redan" });
        return;
      }

      // Definierar saltrounds
      const saltRounds = 10;

      // Hash password
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) throw new Error("Något gick snett. Försök igen");

        // Create a new user
        let user = new User({
          email,
          password: hash,
        });

        // Sparar användaren till databasen
        user.save().then(() => {
          res.status(201).json({ message: "Användare har skapats" });
        });
      });
    } catch (err) {
      return res.status(401).send(err.message);
    }
  });


  //Logga in 
  router.post("/log-in", async (req, res) => {
    try {
      // Hämtar email och lösenord från req.body
      const { email, password } = req.body;

      // Kollar om användaren finns i databasen
      let user = await User.findOne({ email });

      //Om användare ej hittas returneras felmeddelande och statuskod
      if (!user) {
        return res.status(401).json({ message: "Fel mailadress eller lösenord" });
      }

      // Jämför lösenord
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {

          //Skapar token
          let token;

          token = jwt.sign(
            { email: user.email },
            "token",
            { expiresIn: "1h" }
          );

          return res.status(200).json({ message: "Användare har loggat in", token: token });
        }

        console.log(err);
        return res.status(401).json({ message: "Fel mailadress eller lösenord" });
      });
    } catch (error) {
      res.status(401).send(err.message);
    }
  });




});


module.exports = router;
