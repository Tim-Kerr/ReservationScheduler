import IntervalTree from 'node-interval-tree';
import * as moment from 'moment';
import { Input } from './interfaces/Input';
import { Reservation } from './interfaces/Reservation';

export default (input: Input) => {
    const { search, campsites, reservations } = input;
    const availableCampsites: string[] = [];

    // Iterate over campsites and check to see if they are able to accommodate a new reservation with the search criteria without producing a 1 day gap 
    campsites.forEach(campsite => {
        const campsiteReservations = reservations.filter(r => r.campsiteId === campsite.id);

        // Hydrate an interval tree with the existing campsite reservations
        const intervalTree = new IntervalTree<Reservation>();
        campsiteReservations.forEach(res => intervalTree.insert(res.startDate.valueOf(), res.endDate.valueOf(), res));

        // Search the tree for overlapping intervals for the given search query.
        // Artificially increase the search range by 1 day on both sides of the search interval in order to detect 1 day gaps.
        // Could easily parameterize this search padding based on park gap requirements.
        const searchStart = moment(search.startDate).subtract(1, 'day').valueOf();
        const searchEnd = moment(search.endDate).add(1, 'day').valueOf();

        // Filter out overlaps with 0 day gaps
        const overlaps = intervalTree.search(searchStart, searchEnd)
            .filter(overlap => (!search.startDate.isSame(overlap.endDate.valueOf()) &&
                !search.endDate.isSame(overlap.startDate)));

        // No overlaps indicate no conflicts or 1 day gaps formed with other reservations
        if (overlaps.length === 0) availableCampsites.push(campsite.name);
    });

    return availableCampsites;
};