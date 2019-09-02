import * as fs from 'fs';
import { SearchQuery } from './interfaces/SearchQuery';
import { Campsite } from './interfaces/Campsite';
import { Reservation } from './interfaces/Reservation';
import IntervalTree from 'node-interval-tree';
import * as moment from 'moment';

// Consume input json file parsing date strings into Date objects
const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'),
    (key, value) => (key === 'startDate' || key === 'endDate') ? new Date(value) : value);

const searchQuery = input.search as SearchQuery;
const campsites = input.campsites as Campsite[];
const reservations = input.reservations as Reservation[];

const availableCampsites: string[] = [];

// Iterate over campsites and check to see if they are able to accommodate a new reservation
// with the search criteria without producing a 1 day gap 
campsites.forEach(campsite => {
    const campsiteReservations = reservations.filter(r => r.campsiteId === campsite.id);

    // Hydate an interval tree with the existing campsite reservations
    const intervalTree = new IntervalTree<Reservation>();
    campsiteReservations.forEach(res => {
        const start = moment(res.startDate).valueOf();
        const end = moment(res.endDate).add(1, 'days').valueOf();
        intervalTree.insert(start, end, res);
    });

    // Search the tree for overlapping intervals for the given search query.
    // Artificially increase the search range by 1 day on both sides of the search interval
    // in order to detect 1 day gaps.
    let searchStart = moment(searchQuery.startDate).subtract(1, 'day').valueOf();
    let searchEnd = moment(searchQuery.endDate).add(2, 'days').valueOf();

    // Filter out overlaps with 0 day gaps
    let overlaps = intervalTree.search(searchStart, searchEnd).filter(overlap =>
        (searchQuery.startDate.getTime() !== moment(overlap.endDate).add(1, 'day').valueOf() &&
            moment(searchQuery.endDate).add(1, 'day').valueOf() !== overlap.startDate.getTime())
    );

    if (overlaps.length === 0) availableCampsites.push(campsite.name);
});

console.log('Available campsites: ', availableCampsites);
