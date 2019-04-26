var mongoose = require('mongoose');
var Q = require('q');

/**
 * Configuration.
 */
var pairSchema = require('./mongo/schema/pair');

/**
 * Add an object with multiple key-value pairs to a collection as individual documents.
 * @param {*} pairs 
 * @param {*} collection 
 */
var savePair = function (pairs, collection) {

    pairModel = mongoose.model(collection, pairSchema);

    promises = [];

    Object.keys(pairs).forEach(key => {
        promise = Q.fcall(pairModel.findOneAndUpdate({ [key]: { $exists: true } }, { [key]: pairs[key] }, { upsert: true }, ((err, res) => {
            if (err) { throw err }
        })));
        promises.push(promise);
    })

    Q.all(promises).then(res => {
        return res;
    })
};

/**
 * Delete a key-value pair from a collection
 * @param {*} key 
 * @param {*} collection 
 */
var deletePair = function (key, collection) {
    pairModel = mongoose.model(collection, pairSchema);
    return pairModel.deleteOne({ [key]: { $exists: true } });
};

/*
 * Return a single pair
 */
var getPair = function (key, collection) {

    pairModel = mongoose.model(collection, pairSchema);
    return pairModel.findOne({
        [key]: { $exists: true }
    });
};

/**
 * Return all data from a collection
 * @param {*} collection 
 */
var getAllData = function (collection) {

    pairModel = mongoose.model(collection, pairSchema);
    return pairModel.find({});
};



/**
 * Export model definition object.
 */

module.exports = {
    savePair: savePair,
    getPair: getPair,
    deletePair: deletePair,
    getAllData: getAllData
};
