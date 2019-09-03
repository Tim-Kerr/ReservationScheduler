# The Tech
* [NodeJS](https://nodejs.org/en/) (JavaScript runtime)
* [MomentJs](https://momentjs.com/) (Date arithmetic)
* [node-interval-tree](https://www.npmjs.com/package/node-interval-tree) (Interval Tree implementation in Node)

# Installation
* Install the latest version of NodeJs [here](https://nodejs.org/en/download/)
* Clone the repository `git clone https://github.com/Tim-Kerr/ReservationScheduler.git`
* Inside the root project folder in cmd execute `npm install`. This installs the project dependencies.

# Running the code
Option 1: In cmd execute `npm run start` inside the root project folder.
_This executes the code using the input.json file contained in the root project folder_
 
Option 2: In cmd execute `node build/ReservationScheduler.js <input_json_filpath>` inside the root project folder
Example: `node build/ReservationScheduler.js input.json` => Executes the code using the input.json file contained in the root project folder

# The Solution: [Interval Tree](https://en.wikipedia.org/wiki/Interval_tree)
Interval trees are a binary search tree (BST) augmentation that allow for detecting overlaps in a set of intervals. Instead of a single node value like in a regular BST, each node in an interval tree contains an interval (min, max) and a max value contained in all of the ranges of its subtrees. These values together can be used to efficiently search the tree and detect interval overlaps. All reservation intervals are added to the interval tree for a given campsite.

Consider the following example (Comfy Cabin from `input.json`):
Search interval: `2018-06-04 - 2018-06-06`
 <pre>
                     o---Search Interval--o
       o-------------o
o------o                                  o--------------------o
|--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
</pre>

Interval trees efficiently identify if an input interval overlaps with any intervals contained in the tree. This becomes very useful when trying to determine if a given search range will fit neatly in the reservation schedule.

Searching for the interval `2018-06-04 - 2018-06-06` in the tree will result in 2 overlaps at `2018-06-04` and `2018-06-06`. Since these intervals have 0 day gaps this is allowed. The interval fits gaplessly into the schedule. `Comfy Cabin` therefore is included in the search results.

IMPORTANT NOTE: If a search interval still contains overlaps after filtering out all of the 0 day overlaps this indicates a conflict with the existing reservation schedule and the campsite should not be included in the result (i.e. the search interval doesn't fit in the schedule).

This works well when detecting intervals that don't fit in the schedule but doesn't factor in the 1 day gap rule. The next example shows how 1 day gaps are considered in the results.

Consider the following example (Rustic Cabin from `input.json`): 
Search interval: `2018-06-04 - 2018-06-06`
 <pre>

                     o---Search Interval--o
              |--xx--|                    |--xx--|
o-------------o                                  o-------------o
|--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
</pre>

The search interval produces 2 one day gaps in the schedule given the search interval. This is not allowed. Additionally, this type of scenario doesn't produce any overlaps from the interval tree. To solve this, the interval tree can be used to detect these 1 day gaps by artificially extending the search interval on both sides by 1 day.

After extending the search interval by 1 day on each side the diagram becomes:
 <pre>

              o&lt;&lt;&lt;&lt;&lt;&lto---Search Interval--o&gt;&gt;&gt;&gt;&gt;&gt;o
o-------------o                                  o-------------o
|--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
</pre>

Searching for the interval `2018-06-04 - 2018-06-06` in the tree will result in 2 overlaps at `2018-06-03` and `2018-06-08`. Since these overlaps only exist because we artificially increased the search interval by 1 day this indicates a 1 day gap formed by the search interval. `Rustic Cabin` will not be included in the results.

## Assumptions
* It is assumed that all reservations extend throughout the entire day. A reservation can't end/begin in the middle of the day.