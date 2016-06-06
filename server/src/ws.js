/* jshint node:true */
/* jshint esnext:true */
"use strict";

function WSServer() {
    this.createServer();

    this.dimensions = [

        //Apple iPhone 6
        "750px*1334px",
        //Apple iPhone 5
        "640px*1136px",
        //LG G4
        "1440px*2560px",
        //Samsung Galaxy Note 2
        "720px*1280px",
        //Microsoft Lumia 1020
        "768px*1280px",
        //HTC One
        "1080px*1920px",
        //Apple iPad Pro
        "2048px*2732px",
        //Apple iPad 3, 4, Air
        "1536px*2048px",
        //Samsung Galaxy Tab 3 10"
        "800px*1280px",

    ];
}

WSServer.prototype.createServer = function() {
    var ws = require("nodejs-websocket");
    var server = ws.createServer(function(conn) {

        new WSConnection(conn).setServer(this);

    }.bind(this)).listen(8001);
};

function WSConnection(conn) {
    this.emitter = null;
    this.server = null;
    this.conn = conn;
    this.createEmitter();
    this.setConnectionEvents();
}

WSConnection.prototype.setConnectionEvents = function() {
    console.log("New connection");
    this.conn.on("text", this.onMessage.bind(this));

    this.conn.on("close", function(code, reason) {
        console.log("Connection closed");
    });
};

WSConnection.prototype.onMessage = function(msg) {
    var message;
    try {
        message = JSON.parse(msg);
    } catch (exc) {
        console.log(exc);
        message = false;
    }
    if (!this.validateMessage(message)) {
        this.emitter.emit("error", {
            message: "Data provided is invalid"
        });
        return;
    }
    this.triggerProcess(message);

};

WSConnection.prototype.validateMessage = function(message) {
    if (!message.hasOwnProperty("url")) {
        return;
    }
    return true;
};

WSConnection.prototype.createEmitter = function(conn) {
    const EventEmitter = require('events');

    this.emitter = new EventEmitter();
    this.addEmitterEvents();
};

WSConnection.prototype.addEmitterEvents = function() {
    this.emitter.on('starting', (payload) => {
        this.conn.send(JSON.stringify(payload));
    });
    this.emitter.on('success', (payload) => {
        this.conn.send(JSON.stringify(payload));
    });
    this.emitter.on('error', (payload) => {
        this.conn.send(JSON.stringify(payload));
    });
};
WSConnection.prototype.setServer = function(server) {
    this.server = server;
};

WSConnection.prototype.triggerProcess = function(data) {
    const url = this.parseURL(data.url);
    const screen = require("./modules/screenshot");

    screen.setEmitter(this.emitter);

    function* dimensionGenerator(dimensions) {
        for (let i in dimensions) {
            yield dimensions[i];
        }
    }

    for (let i of dimensionGenerator(this.server.dimensions)) {
        this.emitter.emit("starting", {
            key: i.replace(/\*/g, ""),
            status: "initializing",
            message: "started"
        });
        screen.screenshot(data.url, "./web/output/" + url.hostname + "/" + i.replace(/\*/g, "") + ".png", i);
    }
};

WSConnection.prototype.parseURL = function(url) {
    if (!this.urlParser) {
        this.urlParser = require('url');
    }
    return this.urlParser.parse(url);
};

new WSServer();
