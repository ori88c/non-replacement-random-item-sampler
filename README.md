<h2 align="middle">Non-Replacement Random Item Sampler</h2>

The `NonReplacementRandomSampler` class implements a random item sampler that ensures equal selection probability for all items across cycles. Each cycle guarantees unique, non-repeating item selections, with each item sampled only **once per cycle**. Upon cycle completion — when all items have been selected — the sampler automatically refreshes, seamlessly initiating a new cycle to repeat the process.

Use case examples include:
* __Customer Feedback Surveys with Limited Fatigue__: Suppose a company has a pool of 1000 customers and wants to conduct feedback surveys over time without exhausting the same group of customers repeatedly. Using `NonReplacementRandomSampler`, each survey cycle ensures that each customer is sampled only once, minimizing survey fatigue within the cycle. When the cycle is exhausted (after surveying all 1000 customers), a new cycle begins, allowing the company to start another round of sampling while still ensuring each customer is only surveyed once per cycle. This approach **maintains variety** and minimizes the risk of "survey burnout" in any particular customer.
* __Randomized Load Testing of Distributed Servers__: In a distributed server environment with 50 servers, a company wants to run randomized load tests to simulate production traffic without overloading the same servers repeatedly. Using `NonReplacementRandomSampler`, each server is selected once per testing cycle, ensuring balanced load testing across all servers. When all servers have been tested, a new cycle automatically begins, allowing for continued load testing across the server pool without disproportionate load on any individual server within a cycle.

## Table of Contents :bookmark_tabs:

* [Key Features](#key-features)
* [API](#api)
* [Getter Methods](#getter-methods)
* [Use Case Example: Randomized Playlist Generator](#use-case-example)
* [Algorithm](#algorithm)
* [License](#license)

## Key Features :sparkles:<a id="key-features"></a>

- __Random Sampling without Repetitions__: The sampler’s internal state is tracked by a cycle number, starting at 1. Each cycle guarantees unique, non-repeating item selections, with each item sampled only **once per cycle**. Upon cycle completion — when all items have been selected — the sampler automatically refreshes, seamlessly initiating a new cycle to repeat the process.
- __Manually Trigger a New Cycle__: The `startNewCycle` method initiates a new cycle, making all input items available again for sampling. This is useful in scenarios where the non-replacement attribute is not required for extended periods, allowing a new cycle to begin without waiting for full cycle exhaustion.
- __Sample Multiple Unique Items at Once__: The `sampleGroupFromCycle` method samples multiple **unique** items from the current cycle in a single operation.
- __Efficiency :gear:__: All methods have time and space complexities of O(1), except for `sampleGroupFromCycle`, where both time and space complexities are O(groupSize).
- __Comprehensive documentation :books:__: The class is thoroughly documented, enabling IDEs to provide helpful tooltips that enhance the coding experience.
- __Tests :test_tube:__: **Fully covered** by comprehensive unit tests.
- **TypeScript** support.
- No external runtime dependencies: Only development dependencies are used.
- ES2020 Compatibility: The `tsconfig` target is set to ES2020, ensuring compatibility with ES2020 environments.

## API :globe_with_meridians:<a id="api"></a>

The `NonReplacementRandomSampler` class provides the following methods:

* __sample__: Returns a random item from the remaining items in the current cycle. In other words, an item that has not been sampled yet in the current cycle.
* __sampleGroupFromCycle__: Returns an array containing `groupSize` unique items from the current cycle, i.e., items that have not been previously sampled in the current cycle. To avoid ambiguity, these items will also *not* be sampled again in the same cycle. It is equivalent to executing the `sample` method multiple times, with the difference that the group size is limited by the number of remaining items in the cycle. This distinction is necessary to ensure a *unique* group of items.
* __startNewCycle__: Manually initiates a new cycle, making all input items available again for sampling.

If needed, refer to the code documentation for a more comprehensive description.

## Getter Methods :mag:<a id="getter-methods"></a>

The `NonReplacementRandomSampler` class provides the following getter methods to reflect the current state:

* __size__: The total number of items available for sampling. Remains constant throughout the instance’s lifespan.
* __currentCycle__: The current cycle number. The cycle number increments in either of the following cases: Either all items in the current cycle have been sampled (cycle exhaustion), **or** the `startNewCycle` method is manually triggered.
* __remainingItemsInCurrentCycle__: The number of items not yet sampled in the current cycle.

To eliminate any ambiguity, all getter methods have **O(1)** time and space complexity.

## Use Case Example: Randomized Playlist Generator :man_technologist:<a id="use-case-example"></a>

Consider a component responsible for selecting songs randomly for a playlist. Once all songs in the list have been played, the component automatically begins a new cycle, reshuffling the songs for fresh playback.

```ts
import { NonReplacementRandomSampler } from 'non-replacement-random-item-sampler';

interface Song {
  id: string;
  title: string;
  artist: string;
  durationInSeconds: number;
  genre: string;
  releaseYear: number;
  azureStorageUri: string; // URI to access the song file in Azure Storage
}

class RandomizedPlaylistGenerator {
  private readonly _songSampler: NonReplacementRandomSampler<Song>;

  constructor(songs: Song[]) {
    // Note: Refer to the Ownership Transfer section in the NonReplacementRandomSampler
    // constructor documentation.
    this._songSampler = new NonReplacementRandomSampler(songs);
  }

  public get remainingSongsUntilNextShuffle(): number {
    return this._songSampler.remainingItemsInCurrentCycle;
  }

  public sampleNext(): Song {
    return this._songSampler.sample();
  }

  public sampleGroupFromPlaylist(groupSize: number): Song[] {
    return this._songSampler.sampleGroupFromCycle(groupSize);
  }

  public shuffle(): void {
    this._songSampler.startNewCycle();
  }
}
```

## Algorithm :gear:<a id="algorithm"></a>

The sampler’s non-replacement requirement presents a complexity challenge, as using array-mutating methods like `Array.splice` would result in an undesirable O(n) complexity per sample.

To address this, we conceptually divide the internal items array into two distinct parts:
* __Available Prefix__: A prefix of items that are still available for sampling in the current cycle.
* __Unavailable Suffix__: A suffix of items that have already been sampled within the current cycle.

The algorithm samples a random index from the Available Prefix and **swaps** it with the **new** start of the Unavailable Suffix. Each sample operation therefore **decreases** the length of the prefix by 1 and **increases** the length of the suffix by 1. As a result, each sampled item is excluded from further selections during the current cycle.

For example, consider an array `[A, B, C, D]`. Initially, the Available Prefix length is 4, allowing us to sample a random index within [0, 3]. Suppose we sample index 1 (item `B`). We then swap `B` with `D`, transforming the array to `[A, D, C, B]` and reducing the Available Prefix length to 3. Now, `B` is in the Unavailable Suffix, preventing it from being selected again within this cycle.

On the next sampling attempt, a random index within [0, 2] is chosen, say 0 (item `A`). We swap `A` with `C`, resulting in `[C, D, A, B]`. Now both `A` and `B` are in the Unavailable Suffix, ensuring neither is sampled again during the current cycle. This process continues until all items are exhausted from the Available Prefix, completing the cycle.

## License :scroll:<a id="license"></a>

[Apache 2.0](LICENSE)
