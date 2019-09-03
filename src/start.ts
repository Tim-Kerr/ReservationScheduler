import reservationScheduler from './reservationScheduler';
import parseInput from './parseInput';

console.log(reservationScheduler(parseInput(process.argv[2])));