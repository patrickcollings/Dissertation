var mongoose = require('mongoose'),
	modelName = 'code',
	schemaDefinition = require('../schema/' + modelName),
	schemaInstance = mongoose.Schema(schemaDefinition);

schemaInstance.index({ "authCodeExpiresAt": 1 }, { expireAfterSeconds: 0 });

var modelInstance = mongoose.model(modelName, schemaInstance);

module.exports = modelInstance;
