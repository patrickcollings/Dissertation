var mongoose = require('mongoose'),
	modelName = 'pair',
	schemaDefinition = require('../schema/' + modelName),
	

var modelInstance = mongoose.model(modelName, schemaInstance);

module.exports = schemaInstance;