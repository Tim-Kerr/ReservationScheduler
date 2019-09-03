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
Interval trees are a BST data structure augmentation that allow for detecting overlaps in a set of intervals. Instead of a single node value like in a regular BST, interval trees contain an interval and a max value contained in the ranges of its subtrees in each node. These values can be used to efficiently search and detect interval overlaps.

In order to detect 1 day gaps formed by the search interval, the search area is artificially increased on both side of the interval in order to detect overlaps.

Consider the following example (Comfy Cabin from `input.json`):
`Search interval`: 2018-06-04 - 2018-06-06
 <pre>
                     o---Search Interval--o
       o-------------o
o------o                                  o--------------------o
|--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
</pre>

Interval trees efficiently identify the interval overlaps. Since there are no non-zero overlaps in these intervals `Comfy Cabin` is available during the search criteria.

Consider the following example (Rustic Cabin from `input.json`): 
`Search interval`: 2018-06-04 - 2018-06-06
 <pre>

                     o---Search Interval--o
              |--xx--|                    |--xx--|
o-------------o                                  o-------------o
|--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
</pre>

The search interval produces 2 one day gaps in the schedule given the search interval. This is not allowed.

The interval tree can be used to detect these 1 day gaps by artificically extending the search interval on both sides by 1 day.

After extending the search interval by 1 day on each side the diagram becomes:
 <pre>

              o&lt;&lt;&lt;&lt;&lt;&lto---Search Interval--o&gt;&gt;&gt;&gt;&gt;&gt;o
o-------------o                                  o-------------o
|--01--|--02--|--03--|--04--|--05--|--06--|--07--|--08--|--09--|
</pre>

Now the interval tree detects the 1 day gaps interval overlaps and the campsite will be removed from the results.