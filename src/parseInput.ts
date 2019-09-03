import * as fs from 'fs';
import { Input } from './interfaces/Input';
import * as moment from 'moment';

// Consume input json file and parse date strings into Moment date objects
// Moment.js wraps native JavaScript dates and exposes a date arithmetic api
export default (jsonFilepath: string): Input => (
  JSON.parse(fs.readFileSync(jsonFilepath, 'utf8'),
    (key, value) => {
      if (key === 'startDate') return moment(value);
      // End dates are inclusive. Add a day to make the math work.
      else if (key === 'endDate') return moment(value).add(1, 'day');
      return value;
    }) as Input
);