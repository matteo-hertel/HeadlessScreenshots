/* jshint node:true */
/* jshint esnext:true */
"use strict";


//Hapi reference
const Hapi = require("hapi");

//Server object
const server = new Hapi.Server();
//set up connection
server.connection({
    port: 80
});


server.route({
    method: "GET",
    path: "/{name}",
    handler: (request, reply) => {
        console.log();
        var name = request.params.name;
        const EventEmitter = require('events');
        const util = require('util');
        const screen = require("./modules/screenshot");


        const emitter = new EventEmitter();

        emitter.on('success', (payload) => {
            console.log(payload.message);
        });

        var dimensions = [

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

        screen.setEmitter(emitter);

        function* dimensionGenerator() {
            for (let i in dimensions) {
                yield dimensions[i];
            }
        }

        for (let i of dimensionGenerator()) {
            screen.screenshot("http://" + name, "./output/" + name + "/" + i.replace(/\*/g, "") + ".png", i);
        }
        reply("creating " + name);
    }
});

//start server
server.start(() => console.log(`servet stated at ${server.info.uri}`));
