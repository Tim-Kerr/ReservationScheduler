"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var moment = require("moment");
// Consume input json file and parse date strings into Moment date objects
// Moment.js wraps native JavaScript dates and exposes a date arithmetic api
exports.default = (function (jsonFilepath) { return JSON.parse(fs.readFileSync(process.argv[2], 'utf8'), function (key, value) {
    if (key === 'startDate')
        return moment(value);
    // End dates are inclusive. Add a day to make the math work.
    else if (key === 'endDate')
        return moment(value).add(1, 'day');
    return value;
}); });
