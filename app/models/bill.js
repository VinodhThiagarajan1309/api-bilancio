var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BillSchema   = new Schema({
	name: String,
	amount: { type: Number, default: 0.0 }
});

module.exports = mongoose.model('Bill', BillSchema);