'use strict';

var mongoose = require('mongoose'),
    url = require('url'),
    Server = mongoose.model('Server'),
    Util = require('./utils');

/**
 * List servers
 */

exports.list = function (req, res, next) {
  Server.find(function (err, server) {
    res.json(server);
  });
};

/**
 *  Get profile of specified server
 */
exports.show = function (req, res, next) {
  var serverName = req.params.name;

  Server.find({name: serverName}, function (err, server) {
    if (err) return next(err);
    if (!server) return res.send(404);
    console.log('created');
    res.send(server);
  });
};

/**
 * Create server
 */
exports.create = function (req, res, next) {
  var newServer = new Server(req.body);

  newServer.generateURL(req);

  newServer.save(function(err) {
    if (err) return res.json(400, err);

    Util.startServer(newServer);

    return res.json(newServer);
  });
};