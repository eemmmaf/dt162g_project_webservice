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
    console.log("Connected to db(Measure)");

    // Skapar schemat för databasen 
    let measureSchema = mongoose.Schema({
            unit : String
    });

    // Skapar model av schemat
    let Measure = mongoose.model('units', measureSchema);


    /********************************************* 
     * Hämtar alla enheter
     *********************************************/
    router.get('/', function (req, res, next) {

        // Läs ut från databasen
        Measure.find(function (err, measures) {
            if (err) return console.error(err);
            let jsonObj = JSON.stringify(measures);
            res.contentType('application/json');
            res.send(jsonObj);
        });
    });

    /********************************************* 
    * Visa enhet utifrån dess id
    *********************************************/
    router.get('/:id', function (req, res, next) {

        //Id som parameter
        let id = req.params.id;

        Measure.findById(id, function (err, measure) {
            if (err) throw err;
            let jsonObj = JSON.stringify(measure);
            res.contentType('application/json');
            res.send(jsonObj);
        });

    });

       /********************************************* 
     * Lägga till en ny enhet
     *********************************************/
   router.post('/', function (req, res, next) {
    // Skapar ny kurs
    let measure1 = new Measure({
        unit: req.body.unit
    });

    // Lägger till den nya item
    measure1.save(function (err) {
        if (err) return console.error(err);
    });

    var jsonObj = JSON.stringify(measure1);
    res.contentType('application/json');
    res.send(jsonObj);

});



 /********************************************* 
     * Tar bort en kategori utifrån dess id
     *********************************************/
 router.delete('/:id', function (req, res, next) {
    //id som parameter
    let id = req.params.id;

    // Tar bort item från databasen
    Measure.deleteOne({ "_id": id }, function (err) {
        if (err) return handleError(err);
    });

    // Hämtar items på nytt
    Measure.find(function (err, measures) {
        if (err) return console.error(err);

        var jsonObj = JSON.stringify(measures);
        res.contentType('application/json');
        res.send(jsonObj);
    });
});

});


module.exports = router;
