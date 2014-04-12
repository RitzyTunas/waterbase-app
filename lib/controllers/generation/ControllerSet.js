/* global require, module */
var createSchema = require('./createSchema.js');
var Schema = require('mongoose').Schema;
var statusCodes = {
  ok: 200,
  created: 201,
  finished: 204,
  notFound: 404,
  error: 500
};

/*
dynamic schema change
if a schema changes

how to link back to serverConfig file?
*/

module.exports = function (server, db) {
  var convertToSchema = function(data, names){
    var schema = {};
    for (var key in data){
      var type = Array.isArray(data[key])? 'array' : typeof data[key];
      if (type === 'object'){
        //if a field is non-array object,
        //see if it can be a reference field
        if (names.indexOf(key) !== -1){
          type = {
            type: Schema.Types.ObjectOd,
            ref: key
          };
        } else {
          //otherwise give it a free-form type
          type = {};
        }
      } else {
        schema[key] = type.charAt(0).toUpperCase() + type.slice(1);
      }
    }
    return schema;
  };

  var createIfNotExist = function(collectionName, data, callback){
    db.db.collectionNames(function(err, names){
      if (err){
        return callback(err);
      }
      if (names.indexOf(collectionName) !== -1){
        return callback();
      }
      var schema = convertToSchema(data, names);
      var config = {};
      config[collectionName] = {
        attributes: schema
      };
      server.updateSchema(config);
      return callback();
    });
  };

  this.retrieveAll = function (collectionName, callback) {
    createIfNotExist(collectionName, {}, function(err){
      console.log('~~~~~~ list', collectionName);
      if (err){
        callback(err);
      }
      db.model(collectionName)
        .find({})
        .exec()
        .then(function(data){
          callback(null, data);
        }, function(err){
          callback(err);
        });
    });
  };

  this.updateAll = function (collectionName, where, set, callback) {
    createIfNotExist(collectionName, set, function(err){
      console.log('~~~~~~ update all');
      if (err){
        callback(err);
      }
      db.model(collectionName)
        .update(where, set)
        .exec()
        .then(function(data){
          callback(null, data);
        }, function(err){
          callback(err);
        });
    });
  };

  this.deleteAll = function (collectionName, id, callback) {
    createIfNotExist(collectionName, {}, function(err){
      console.log('~~~~~~ delete all');
      if (err){
        callback(err);
      }
      db.model(collectionName)
        .remove()
        .exec()
        .then(function(data){
          callback(null, data);
        }, function(err){
          callback(err);
        });
    });
  };

  //create element
  this.create = function (collectionName, data, callback) {
    createIfNotExist(collectionName, data, function(err){
      console.log('~~~~~~ create');
      if (err){
        callback(err);
      }
      var Model = db.model(collectionName);
      var model = new Model(data);
      model.save(function(data){
        callback(null, model);
      }, function(err){
        callback(err);
      });
    });
  };

  //document
  this.retrieveOne = function (collectionName, id, callback) {
    createIfNotExist(collectionName, {}, function(err){
      console.log('~~~~~~ show');
      if (err){
        callback(err);
      }
      db.model(collectionName)
        .findById(id)
        .exec()
        .then(function(data){
          callback(null, data);
        }, function(err){
          callback(err);
        });
    });
  };

  //update single document
  this.updateOne = function (collectionName, id, set, callback) {
    createIfNotExist(collectionName, set, function(err){
      console.log('~~~~~~ update one');
      if (err){
        callback(err);
      }
      db.model(collectionName)
        .findByIdAndUpdate(id, set)
        .exec()
        .then(function(data){
          callback(null, data);
        }, function(err){
          callback(err);
        });
    });
  };

  //delete single document
  this.deleteOne = function (collectionName, id, callback) {
    createIfNotExist(collectionName, {}, function(err){
      console.log('~~~~~~ delete one');
      if (err){
        callback(err);
      }
      db.model(collectionName)
        .findById(id)
        .exec()
        .then(function (data) {
          data
            .remove()
            .exec()
            .then(function(data){
              callback(null, data);
            }, function(err){
              callback(err);
            });
        }, function(err){
          callback(err);
        });
    });
  };
};
