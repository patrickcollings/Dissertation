var mongoose = require('mongoose');
var Q = require('q');

/**
 * Configuration.
 */
var pairSchema = require('./mongo/schema/pair');

var savePair = function (pairs, collection) {

    pairModel = mongoose.model(collection, pairSchema);

    promises = [];

    Object.keys(pairs).forEach(key => {
        promise = Q.fcall(pairModel.findOneAndUpdate({ [key]: { $exists: true } }, { [key]: pairs[key] }, {upsert: true}, ((err, res) => {
            if (err) { throw err }
        })));
        promises.push(promise);
    })

    Q.all(promises).then( res => {
        return res;
    })
};

var deletePair = function(key, collection) {
    pairModel = mongoose.model(collection, pairSchema);
    return pairModel.deleteOne({ [key]: { $exists: true } });
};

/*
 * Method used only by password grant type.
 */
var getPair = function (key, collection) {

    pairModel = mongoose.model(collection, pairSchema);
    return pairModel.findOne({
        [key]: { $exists: true}
    });
};

/**
 * Export model definition object.
 */

module.exports = {
    savePair: savePair,
    getPair: getPair,
    deletePair: deletePair
};
