import { Search } from "./Search";
import { Campsite } from "./Campsite";
import { Reservation } from "./Reservation";

export interface Input {
    search: Search,
    campsites: Campsite[],
    reservations: Reservation[]
}