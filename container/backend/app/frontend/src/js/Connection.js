/** jshint node:true */
/** jshint esnext:true */


function Connection() {
    this.statuses = ["Connected", "Disconnected", "Error", "Connecting"];
    this.status = this.statuses[1];
    this.isConnected = true;
    this.connection = false;
    this.server = "localhost";
    this.port = 8001;
    this.output = false;
    this.emitter = false;
}

Connection.prototype.connect = function() {
    this.status = this.statuses[3];
    this.establishConnection();
    this.bindConnectionEvents();
};
Connection.prototype.send = function(msg) {
    if (typeof msg === "object") {
        msg = JSON.stringify(msg);
    }
    console.log(msg);
    this.connection.send(msg);
};
Connection.prototype.establishConnection = function() {
    try {
        this.connection = new WebSocket(this.getConnectionString());
    } catch (exc) {
        this.status = this.statuses[2];
    }
};
Connection.prototype.setEmitter = function(fn) {
    if (typeof fn === "function") {
        this.emitter = fn;
    }
};
Connection.prototype.bindConnectionEvents = function() {
    this.connection.onclose = function() {
        this.status = this.statuses[1];
        this.isConnected = false;
    }.bind(this);
    this.connection.onopen = function() {
        this.status = this.statuses[0];
        this.isConnected = true;
    }.bind(this);
    this.connection.onerror = function() {
        this.status = this.statuses[2];
        this.isConnected = false;
    }.bind(this);
    this.connection.onmessage = this.newMessage.bind(this);
};

Connection.prototype.newMessage = function(payload) {
    var data;
    if (typeof payload.data === "string") {
        data = JSON.parse(payload.data);
    }
    if (this.emitter) {
        this.emitter(data);
    }

};
Connection.prototype.getConnectionString = function() {
    return "ws://{server}:{port}".format({
        server: this.server,
        port: this.port
    });
};
