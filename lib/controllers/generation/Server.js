/* global require, module*/
var express = require('express');
var mongoose = require('mongoose');
var ControllerSet = require('./ControllersSet.js');
var routesMixin = require('./routesMixin.js');
var createSchema = require('./createSchema.js');
/*
  bootstrap and start a server from a json file
*/

var Server = function (serverConfig) {
  this.config = serverConfig;
  this.controllers = new ControllerSet(this.serverConfig, this.db);
  //db
  this.db = mongoose.createConnection(
    'mongodb://localhost/' + this.config.name,
    { db: { safe:true } }
  );
  //server
  this.app = express();
  //middlewares
  this.app.use(express.bodyParser());

  this.init();
};

Server.prototype.init = function(){
  //create schema
  var resources = this.serverConfig.resources;
  for (var resource in resources){
    createSchema(resource, resources[resource], this.db);
  }
  //configure api
  routesMixin(this.app, this.controllers);
  //configure sockets
  //TODO
};

Server.prototype.start = function(){
  this.app.listen(this.serverConfig.port, function () {
    console.log('Express server listening on port %d', this.serverConfig.port);
  });
  //sockets.listen(this.app);
};

Server.prototype.stop = function () {
  this.app.stop();
};

module.exports = Server;

