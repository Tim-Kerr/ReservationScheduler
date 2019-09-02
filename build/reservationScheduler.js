"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var node_interval_tree_1 = require("node-interval-tree");
var moment = require("moment");
// Consume input json file parsing date strings into Date objects
var input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'), function (key, value) { return (key === 'startDate' || key === 'endDate') ? new Date(value) : value; });
var searchQuery = input.search;
var campsites = input.campsites;
var reservations = input.reservations;
var availableCampsites = [];
// Iterate over campsites and check to see if they are able to accommodate a new reservation
// with the search criteria without producing a 1 day gap 
campsites.forEach(function (campsite) {
    var campsiteReservations = reservations.filter(function (r) { return r.campsiteId === campsite.id; });
    // Hydate an interval tree with the existing campsite reservations
    var intervalTree = new node_interval_tree_1.default();
    campsiteReservations.forEach(function (res) {
        var start = moment(res.startDate).valueOf();
        var end = moment(res.endDate).add(1, 'days').valueOf();
        intervalTree.insert(start, end, res);
    });
    // Search the tree for overlapping intervals for the given search query.
    // Artificially increase the search range by 1 day on both sides of the search interval
    // in order to detect 1 day gaps.
    var searchStart = moment(searchQuery.startDate).subtract(1, 'day').valueOf();
    var searchEnd = moment(searchQuery.endDate).add(2, 'days').valueOf();
    // Filter out overlaps with 0 day gaps
    var overlaps = intervalTree.search(searchStart, searchEnd).filter(function (overlap) {
        return (searchQuery.startDate.getTime() !== moment(overlap.endDate).add(1, 'day').valueOf() &&
            moment(searchQuery.endDate).add(1, 'day').valueOf() !== overlap.startDate.getTime());
    });
    if (overlaps.length === 0)
        availableCampsites.push(campsite.name);
});
console.log('Available campsites: ', availableCampsites);
