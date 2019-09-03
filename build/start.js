"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reservationScheduler_1 = require("./reservationScheduler");
var parseInput_1 = require("./parseInput");
console.log(reservationScheduler_1.default(parseInput_1.default(process.argv[2])));
