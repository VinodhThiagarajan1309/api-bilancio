// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://bilancio:bilancio@ds157499.mlab.com:57499/bilanciodb'); // connect to our database
var Bill     = require('./app/models/bill');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// on routes that end in /bills
// ----------------------------------------------------
router.route('/bills')

	// create a bill (accessed at POST http://localhost:8080/bills)
	.post(function(req, res) {
		
		var bill = new Bill();		// create a new instance of the Bill model
		bill.name = req.body.name;  // set the bills name (comes from the request)
		bill.amount = req.body.amount;
		bill.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Bill created!' });
		});

		
	})

	// get all the bills (accessed at GET http://localhost:8080/api/bills)
	.get(function(req, res) {
		Bill.find(function(err, bills) {
			if (err)
				res.send(err);

			res.json(bills);
		});
	});

// on routes that end in /bills/:bill_id
// ----------------------------------------------------
router.route('/bills/:bill_id')

	// get the bill with that id
	.get(function(req, res) {
		Bill.findById(req.params.bill_id, function(err, bill) {
			if (err)
				res.send(err);
			res.json(bill);
		});
	})

	// update the bill with this id
	.put(function(req, res) {
		Bill.findById(req.params.bill_id, function(err, bill) {

			if (err)
				res.send(err);

			bill.name = req.body.name;
			bill.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Bill updated!' });
			});

		});
	})

	// delete the bill with this id
	.delete(function(req, res) {
		Bill.remove({
			_id: req.params.bill_id
		}, function(err, bill) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
