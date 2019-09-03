"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_interval_tree_1 = require("node-interval-tree");
var moment = require("moment");
exports.default = (function (input) {
    var search = input.search, campsites = input.campsites, reservations = input.reservations;
    var availableCampsites = [];
    // Iterate over campsites and check to see if they are able to accommodate a new reservation with the search criteria without producing a 1 day gap 
    campsites.forEach(function (campsite) {
        var campsiteReservations = reservations.filter(function (r) { return r.campsiteId === campsite.id; });
        // Hydrate an interval tree with the existing campsite reservations
        var intervalTree = new node_interval_tree_1.default();
        campsiteReservations.forEach(function (res) { return intervalTree.insert(res.startDate.valueOf(), res.endDate.valueOf(), res); });
        // Search the tree for overlapping intervals for the given search query.
        // Artificially increase the search range by 1 day on both sides of the search interval in order to detect 1 day gaps.
        // Could easily parameterize this search padding based on park gap requirements.
        var searchStart = moment(search.startDate).subtract(1, 'day').valueOf();
        var searchEnd = moment(search.endDate).add(1, 'day').valueOf();
        // Filter out overlaps with 0 day gaps
        var overlaps = intervalTree.search(searchStart, searchEnd)
            .filter(function (overlap) { return (!search.startDate.isSame(overlap.endDate) &&
            !search.endDate.isSame(overlap.startDate)); });
        // No overlaps indicate no conflicts or 1 day gaps formed with other reservations
        if (overlaps.length === 0)
            availableCampsites.push(campsite.name);
    });
    return availableCampsites;
});
