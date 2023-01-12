var express = require('express');
var router = express.Router();

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
    console.log("Connected to db (Category)");

    // Skapar schemat för databasen 
    let categorySchema = mongoose.Schema({
        category_name: {
            type: String,
            required: true
        }
    });

    // Skapar model av schemat
    let Category = mongoose.model('categories', categorySchema);


    /********************************************* 
     * Hämtar alla kategorier
     *********************************************/
    router.get('/', function (req, res, next) {

        // Läs ut från databasen
        Category.find(function (err, categories) {
            if (err) return console.error(err);
            let jsonObj = JSON.stringify(categories);
            res.contentType('application/json');
            res.send(jsonObj);
        });
    });

    /********************************************* 
    * Visa kategori utifrån dess id
    *********************************************/
    router.get('/:id', function (req, res, next) {

        //Id som parameter
        let id = req.params.id;

        Category.findById(id, function (err, category) {
            if (err) throw err;
            let jsonObj = JSON.stringify(category);
            res.contentType('application/json');
            res.send(jsonObj);
        });

    });

   /********************************************* 
     * Lägga till en ny kategori
     *********************************************/
   router.post('/', function (req, res, next) {
    // Skapar ny kurs
    let category1 = new Category({
        category_name: req.body.category_name
    });

    // Lägger till den nya item
    category1.save(function (err) {
        if (err) return console.error(err);
    });

    var jsonObj = JSON.stringify(category1);
    res.contentType('application/json');
    res.send(jsonObj);

});



 //Uppdatering
 router.put('/:id', (req, res, next) => {
    const category = new Category({
        _id: req.params.id,
        category_name: req.body.category_name
    });
    Category.updateOne({ _id: req.params.id }, category).then(
        () => {
            res.status(200).json({
                message: 'kategorin har uppdaterats successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});




   /********************************************* 
     * Tar bort en kategori utifrån dess id
     *********************************************/
   router.delete('/:id', function (req, res, next) {
    //id som parameter
    let id = req.params.id;

    // Tar bort item från databasen
    Category.deleteOne({ "_id": id }, function (err) {
        if (err) return handleError(err);
    });

    // Hämtar items på nytt
    Category.find(function (err, categories) {
        if (err) return console.error(err);

        var jsonObj = JSON.stringify(categories);
        res.contentType('application/json');
        res.send(jsonObj);
    });
});



});


module.exports = router;
