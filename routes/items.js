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
    console.log("Connected to db(Items)");

    // Skapar schemat för databasen 
    let itemSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        measure: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    });

    // Skapar model av schemat
    let Item = mongoose.model('items', itemSchema);


    /********************************************* 
     * Hämtar alla lagrade varor
     *********************************************/
    router.get('/', function (req, res, next) {

        // Läs ut från databasen
        Item.find(function (err, items) {
            if (err) return console.error(err);
            let jsonObj = JSON.stringify(items);
            res.contentType('application/json');
            res.send(jsonObj);
        });
    });

    /********************************************* 
     * Tar bort en vara utifrån dess id
     *********************************************/
    router.delete('/:id', function (req, res, next) {
        //id som parameter
        let id = req.params.id;

        // Tar bort item från databasen
        Item.deleteOne({ "_id": id }, function (err) {
            if (err) return handleError(err);
        });

        // Hämtar items på nytt
        Item.find(function (err, items) {
            if (err) return console.error(err);

            var jsonObj = JSON.stringify(items);
            res.contentType('application/json');
            res.send(jsonObj);
        });
    });

    /********************************************* 
     * Lägga till en ny kurs
     *********************************************/
    router.post('/', function (req, res, next) {
        // Skapar ny kurs
        let item1 = new Item({
            name: req.body.name,
            category: req.body.category,
            measure: req.body.measure,
            quantity: req.body.quantity
        });

        // Lägger till den nya item
        item1.save(function (err) {
            if (err) return console.error(err);
        });

        var jsonObj = JSON.stringify(item1);
        res.contentType('application/json');
        res.send(jsonObj);

    });


    /********************************************* 
    * Visa item utifrån dess id
    *********************************************/
    router.get('/:id', function (req, res, next) {

        //Id som parameter
        let id = req.params.id;

        Item.findById(id, function (err, item) {
            if (err) throw err;
            let jsonObj = JSON.stringify(item);
            res.contentType('application/json');
            res.send(jsonObj);
        });

    });


    //Uppdatering
    router.put('/:id', (req, res, next) => {
        const item = new Item({
            _id: req.params.id,
            name: req.body.name,
            category: req.body.category,
            measure: req.body.measure,
            quantity: req.body.quantity
        });
        Item.updateOne({ _id: req.params.id }, item).then(
            () => {
                res.status(200).json({
                    message: 'Varan har uppdaterats successfully!'
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






});


module.exports = router;
