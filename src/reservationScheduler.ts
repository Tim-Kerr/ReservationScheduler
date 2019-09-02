import * as fs from 'fs';
import { SearchQuery } from './interfaces/SearchQuery';
import { Campsite } from './interfaces/Campsite';
import { Reservation } from './interfaces/Reservation';
import IntervalTree from 'node-interval-tree';

const intervalTree = new IntervalTree();

// Consume input json file
const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

console.log(input);

const searchQuery = input.search as SearchQuery;
const campsites = input.campsites as Campsite[];
const reservations = input.reservations as Reservation[];

const availableCampsites: string[] = [];

// Iterate over campsites and check to see if they are able to accommodate a new reservation
// with the search criteria without producing a 24 hour gap 
campsites.forEach(campsite => {
    const campsiteReservations = reservations
        .filter(r => r.campsiteId === campsite.id)
        .sort((r1, r2) => r1.startDate.getTime() - r2.startDate.getTime());

    let canReserve = true;

    // Check search query start date doesn't overlap with an existing reservation
    for (let reservation of campsiteReservations) {
        const t = searchQuery.startDate.getTime();
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
