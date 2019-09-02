"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var node_interval_tree_1 = require("node-interval-tree");
var intervalTree = new node_interval_tree_1.default();
// Consume input json file
var input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
console.log(input);
var searchQuery = input.search;
var campsites = input.campsites;
var reservations = input.reservations;
var availableCampsites = [];
// Iterate over campsites and check to see if they are able to accommodate a new reservation
// with the search criteria without producing a 24 hour gap 
campsites.forEach(function (campsite) {
    var campsiteReservations = reservations
        .filter(function (r) { return r.campsiteId === campsite.id; })
        .sort(function (r1, r2) { return r1.startDate.getTime() - r2.startDate.getTime(); });
    var canReserve = true;
    // Check search query start date doesn't overlap with an existing reservation
    for (var _i = 0, campsiteReservations_1 = campsiteReservations; _i < campsiteReservations_1.length; _i++) {
        var reservation = campsiteReservations_1[_i];
        var t = searchQuery.startDate.getTime();
        if (t >= reservation.startDate.getTime() && t <= reservation.endDate.getTime()) {
            canReserve = false;
            break;
        }
    }
    // Check search query end date doesn't overlap with an existing reservation
    // Check the end date doesn't 
    if (canReserve) {
    }
    if (canReserve) {
        availableCampsites.push(campsite.name);
    }
});
console.log('Available campsites: ', availableCampsites);
