import reservationScheduler from '../src/reservationScheduler';
import parseInput from '../src/parseInput';
import { Input } from '../src/interfaces/Input';
import * as moment from 'moment';

const testJsonFilepath = './test/test-input.json';

/**
 * Test that the scheduler outputs expected result from the test-input.json file
 */
test('Input parsed from JSON. Outputs: "Comfy Cabin", "Rickety Cabin", and "Cabin in the Woods"', () => {
  const input = parseInput(testJsonFilepath);

  const availableCampsites = reservationScheduler(input);
  expect(availableCampsites).toHaveLength(3);
  expect(availableCampsites).toContain('Comfy Cabin');
  expect(availableCampsites).toContain('Rickety Cabin');
  expect(availableCampsites).toContain('Cabin in the Woods');
});

/**
*                      o---Search Interval--o
* |--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
*/
test('Input parsed from JSON. No reservations made at any campsite. Returns all campsites.', () => {
  const input = parseInput(testJsonFilepath);
  input.reservations = []; // Clear reservations

  const availableCampsites = reservationScheduler(input);
  expect(availableCampsites).toHaveLength(5);
  expect(availableCampsites).toContain('Cozy Cabin');
  expect(availableCampsites).toContain('Comfy Cabin');
  expect(availableCampsites).toContain('Rustic Cabin');
  expect(availableCampsites).toContain('Rickety Cabin');
  expect(availableCampsites).toContain('Cabin in the Woods');
});

/**
*               o---Search Interval--o
* o-------------o                    o--------------------o
* |--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
*/
test('Search interval is a perfect fit into the schedule with no gaps. The campsite is included in the result.', () => {
  const input: Input = {
    search: {
      startDate: moment('2018-06-03'),
      endDate: moment('2018-06-05').add(1, 'day')
    },
    campsites: [{ id: 0, name: 'Test Cabin' }],
    reservations: [
      { campsiteId: 0, startDate: moment('2018-06-01'), endDate: moment('2018-06-02').add(1, 'day') },
      { campsiteId: 0, startDate: moment('2018-06-06'), endDate: moment('2018-06-08').add(1, 'day') }
    ]
  }

  const availableCampsites = reservationScheduler(input);
  expect(availableCampsites).toHaveLength(1);
  expect(availableCampsites).toContain('Test Cabin');
});

/**
*               o---Search Interval--o
* o-------------o
* |--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
*/
test('Search interval forms a gapless fit in the schedule at the start of the search interval. The campsite is included in the result.', () => {
  const input: Input = {
    search: {
      startDate: moment('2018-06-03'),
      endDate: moment('2018-06-05').add(1, 'day')
    },
    campsites: [{ id: 0, name: 'Test Cabin' }],
    reservations: [
      { campsiteId: 0, startDate: moment('2018-06-01'), endDate: moment('2018-06-02').add(1, 'day') },
    ]
  }

  const availableCampsites = reservationScheduler(input);
  expect(availableCampsites).toHaveLength(1);
  expect(availableCampsites).toContain('Test Cabin');
});

/**
*               o---Search Interval--o
*                                    o-------------o
* |--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
*/
test('Search interval forms a gapless fit in the schedule at the end of the search interval. The campsite is included in the result.', () => {
  const input: Input = {
    search: {
      startDate: moment('2018-06-03'),
      endDate: moment('2018-06-05').add(1, 'day')
    },
    campsites: [{ id: 0, name: 'Test Cabin' }],
    reservations: [
      { campsiteId: 0, startDate: moment('2018-06-06'), endDate: moment('2018-06-07').add(1, 'day') },
    ]
  }

  const availableCampsites = reservationScheduler(input);
  expect(availableCampsites).toHaveLength(1);
  expect(availableCampsites).toContain('Test Cabin');
});

/**
*        o-------Search Interval-----o
* o-------------o
* |--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
*/
test('Search interval overlaps with existing reservations at the start of the search interval. The campsite is not included in the result.', () => {
  const input: Input = {
    search: {
      startDate: moment('2018-06-02'),
      endDate: moment('2018-06-05').add(1, 'day')
    },
    campsites: [{ id: 0, name: 'Test Cabin' }],
    reservations: [
      { campsiteId: 0, startDate: moment('2018-06-01'), endDate: moment('2018-06-02').add(1, 'day') }
    ]
  }

  const availableCampsites = reservationScheduler(input);
  expect(availableCampsites).toHaveLength(0);
});

/**
*        o-------Search Interval-----o
*                             o-------------o
* |--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
*/
test('Search interval overlaps with existing reservations at the end of the search interval. The campsite is not included in the result.', () => {
  const input: Input = {
    search: {
      startDate: moment('2018-06-02'),
      endDate: moment('2018-06-05').add(1, 'day')
    },
    campsites: [{ id: 0, name: 'Test Cabin' }],
    reservations: [
      { campsiteId: 0, startDate: moment('2018-06-05'), endDate: moment('2018-06-06').add(1, 'day') }
    ]
  }

  const availableCampsites = reservationScheduler(input);
  expect(availableCampsites).toHaveLength(0);
});

/**
*        o-------Search Interval-----o
* o-------------o             o--------------------o
* |--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
*/
test('Search interval overlaps with multiple existing reservations. The campsite is not included in the result.', () => {
  const input: Input = {
    search: {
      startDate: moment('2018-06-02'),
      endDate: moment('2018-06-05').add(1, 'day')
    },
    campsites: [{ id: 0, name: 'Test Cabin' }],
    reservations: [
      { campsiteId: 0, startDate: moment('2018-06-01'), endDate: moment('2018-06-02').add(1, 'day') },
      { campsiteId: 0, startDate: moment('2018-06-05'), endDate: moment('2018-06-07').add(1, 'day') }
    ]
  }

  const availableCampsites = reservationScheduler(input);
  expect(availableCampsites).toHaveLength(0);
});

/**
*                      o---Search Interval--o
* o-------------o
* |--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
*/
test('Search interval produces a single one-day gap just before the search interval in the schedule. The campsite is not returned in the result.', () => {
  const input: Input = {
    search: {
      startDate: moment('2018-06-04'),
      endDate: moment('2018-06-06').add(1, 'day')
    },
    campsites: [{ id: 0, name: 'Test Cabin' }],
    reservations: [
      { campsiteId: 0, startDate: moment('2018-06-01'), endDate: moment('2018-06-02').add(1, 'day') },
    ]
  }

  const availableCampsites = reservationScheduler(input);
  expect(availableCampsites).toHaveLength(0);
});

/**
* o---Search Interval--o
*                             o-------------o
* |--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
*/
test('Search interval produces a single one-day gap just after the search interval in the schedule. The campsite is not returned in the result.', () => {
  const input: Input = {
    search: {
      startDate: moment('2018-06-01'),
      endDate: moment('2018-06-03').add(1, 'day')
    },
    campsites: [{ id: 0, name: 'Test Cabin' }],
    reservations: [
      { campsiteId: 0, startDate: moment('2018-06-05'), endDate: moment('2018-06-06').add(1, 'day') },
    ]
  }

  const availableCampsites = reservationScheduler(input);
  expect(availableCampsites).toHaveLength(0);
});

/**
*                      o---Search Interval--o
* o-------------o                                  o-------------o
* |--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
*/
test('Search interval produces two one-day gaps in the schedule. The campsite is not returned in the result.', () => {
  const input: Input = {
    search: {
      startDate: moment('2018-06-04'),
      endDate: moment('2018-06-06').add(1, 'day')
    },
    campsites: [{ id: 0, name: 'Test Cabin' }],
    reservations: [
      { campsiteId: 0, startDate: moment('2018-06-01'), endDate: moment('2018-06-02').add(1, 'day') },
      { campsiteId: 0, startDate: moment('2018-06-08'), endDate: moment('2018-06-09').add(1, 'day') }
    ]
  }

  const availableCampsites = reservationScheduler(input);
  expect(availableCampsites).toHaveLength(0);
});

/**
*                             o---Search Interval--o
* o-------------o
* |--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
*/
test('Search interval produces a two day gap just before the search interval in the schedule. The campsite is returned in the result.', () => {
  const input: Input = {
    search: {
      startDate: moment('2018-06-05'),
      endDate: moment('2018-06-07').add(1, 'day')
    },
    campsites: [{ id: 0, name: 'Test Cabin' }],
    reservations: [
      { campsiteId: 0, startDate: moment('2018-06-01'), endDate: moment('2018-06-02').add(1, 'day') },
    ]
  }

  const availableCampsites = reservationScheduler(input);
  expect(availableCampsites).toHaveLength(1);
  expect(availableCampsites).toContain('Test Cabin');
});


/**
* o---Search Interval--o
*                                    o-------------o
* |--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
*/
test('Search interval produces a two day gap just after the search interval in the schedule. The campsite is returned in the result.', () => {
  const input: Input = {
    search: {
      startDate: moment('2018-06-01'),
      endDate: moment('2018-06-03').add(1, 'day')
    },
    campsites: [{ id: 0, name: 'Test Cabin' }],
    reservations: [
      { campsiteId: 0, startDate: moment('2018-06-06'), endDate: moment('2018-06-07').add(1, 'day') },
    ]
  }

  const availableCampsites = reservationScheduler(input);
  expect(availableCampsites).toHaveLength(1);
  expect(availableCampsites).toContain('Test Cabin');
});