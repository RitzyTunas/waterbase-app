/* global module */
var statusCodes = {
  ok: 200,
  created: 201,
  finished: 204,
  notFound: 404,
  error: 500
};

var socketHandler = {};

socketHandler.list = function () {};
socketHandler.show = function () {};
socketHandler.create = function () {};
socketHandler.update = function () {};
socketHandler.delete = function () {};

var sockjs = require('sockjs');

var echo = module.exports = sockjs.createServer();

echo.on('connection', function (conn) {
  conn.on('list', socketHandler.list);
  conn.on('show', socketHandler.show);
  conn.on('create', socketHandler.create);
  conn.on('update', socketHandler.update);
  conn.on('delete', socketHandler.delete);

  conn.on('close', function () {

  });
});












module.exports = function (db) {
  this.retrieveAll = function () {

  };

};

module.exports = function (serverConfig, db) {
  this.retrieveAll = function (req, res) {
    db.model(req.param.collection)
      .find(function (err, data) {
        if (err) {
          res.send(statusCodes.error, err);
        }
        res.send(statusCodes.ok, data);
      });
  };

  this.updateAll = function (req, res) {
    db.model(req.param.collection)
      .update(req.body.where, req.body.set).exec()
      .then(function (err, data) {
        if (err) {
          res.send(statusCodes.error, err);
        }
        res.send(statusCodes.finished, data);
      });
  };

  this.deleteAll = function (req, res) {
    db.model(req.param.collection)
      .remove().exec()
      .then(function (err, data) {
        if (err) {
          res.send(statusCodes.error, err);
        }
        res.send(statusCodes.finished, data);
      });
  };

  //create element
  this.create = function (req, res) {
    var Collection = db.model(req.param.collection);
    var model = new Collection(req.body);
    model.save(function (err) {
      if (err) {
        res.json(statusCodes.error, err);
      }
      return res.json(statusCodes.created, model);
    });
  };

  //element
  this.retrieveOne = function (req, res) {
    var id = req.params.id;
    db.model(req.param.collection)
      .find({id: id}, function (err, data) {
        if (err) {
          res.json(statusCodes.error, err);
        }
        if (!data) {
          return res.send(statusCodes.notFound);
        }
        res.send(statusCodes.found, data);
      });
  };

  this.updateOne = function (req, res) {
    var id = req.params.id;
    db.model(req.param.collection)
      .update({id: id}, req.body.set).exec()
      .then(function (err, data) {
        if (err) {
          res.send(statusCodes.error, err);
        }
        res.send(statusCodes.finished, data);
      });
  };

  this.deleteOne = function (req, res) {
    var id = req.params.id;
    db.model(req.param.collection)
      .find({id: id}, function (err, data) {
        if (err) {
          res.send(statusCodes.error, err);
        }
        if (!data) {
          res.send(statusCodes.notFound);
        }
        data.remove().exec()
          .then(function (err) {
            if (err) {
              res.send(statusCodes.error, err);
            }
            res.send(statusCodes.finished);
          });
      });
  };
};
