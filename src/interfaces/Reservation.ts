import { Moment } from 'moment';

export interface Reservation {
    campsiteId: number,
    startDate: Moment,
    endDate: Moment
}