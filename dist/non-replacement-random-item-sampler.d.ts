/**
 * Copyright 2024 Ori Cohen https://github.com/ori88c
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * NonReplacementRandomSampler
 *
 * The `NonReplacementRandomSampler` class provides a random sampler where all items have an equal
 * probability of being sampled without replacement. Sampling is divided into **cycles**, ensuring
 * that each item is selected only once per cycle. When a cycle is exhausted — meaning all items have
 * been sampled — a new cycle begins automatically.
 *
 * In other words, each sampling attempt within a cycle returns a unique item. For example, if there
 * are 20 items:
 * - Sampling attempts [1, 20] will return unique items, comprising the first cycle.
 * - Sampling attempts [21, 40] will also return unique items, forming the second cycle.
 * - And so on.
 *
 * ## Reflecting Internal State
 * This class provides getter methods to reflect its internal state, allowing users to take actions
 * based on the current cycle number (starting from 1), the remaining items in the current cycle,
 * and more.
 *
 * ### Use Case Examples
 * 1. Customer Feedback Surveys with Limited Fatigue:
 *    Suppose a company has a pool of 1000 customers and wants to conduct feedback surveys over time
 *    without exhausting the same group of customers repeatedly.
 *    Using `NonReplacementRandomSampler`, each survey cycle ensures that each customer is sampled only
 *    once, minimizing survey fatigue within the cycle. When the cycle is exhausted (after surveying all
 *    1000 customers), a new cycle begins, allowing the company to start another round of sampling while
 *    still ensuring each customer is only surveyed once per cycle. This approach **maintains variety**
 *    and minimizes the risk of "survey burnout" in any particular customer.
 * 2. Randomized Load Testing of Distributed Servers:
 *    In a distributed server environment with 50 servers, a company wants to run randomized load tests to
 *    simulate production traffic without overloading the same servers repeatedly.
 *    Using `NonReplacementRandomSampler`, each server is selected once per testing cycle, ensuring balanced
 *    load testing across all servers. When all servers have been tested, a new cycle automatically begins,
 *    allowing for continued load testing across the server pool without disproportionate load on any individual
 *    server within a cycle.
 */
export declare class NonReplacementRandomSampler<T> {
    private _currentCycle;
    private _availablePrefixLength;
    private readonly _items;
    /**
     * Constructor
     *
     * Initializes the sampler.
     *
     * ### Ownership Transfer
     * Ownership of the 'items' array is transferred to the class upon instantiation.
     * The caller should **not modify** this array after passing it to the constructor.
     * While cloning the array would prevent unintended modifications, transferring ownership
     * is generally more efficient, as callers rarely need to retain a reference to the array
     * after initialization.
     * If your use case does require retaining the original items for additional purposes,
     * consider storing a copy in a separate data structure.
     *
     * ## Complexity
     * The initialization has constant-time complexity, O(1), both in time and space.
     * No pre-processing is required; initialization only involves basic assignments
     * and input validation.
     *
     * @param items The array of items to sample from. Must contain at least 2 elements.
     * @throws Error if the provided array contains fewer than 2 elements.
     */
    constructor(items: T[]);
    /**
     * size
     *
     * @returns The total number of items available for sampling. Remains constant throughout the instance’s lifespan.
     */
    get size(): number;
    /**
     * currentCycle
     *
     * Returns the current cycle number. The cycle number increments in either of the following cases:
     * - All items in the current cycle have been sampled (cycle exhaustion).
     * - The `startNewCycle` method is manually triggered.
     *
     * @returns The current cycle number, starting from 1.
     */
    get currentCycle(): number;
    /**
     * remainingItemsInCurrentCycle
     *
     * @returns The number of items not yet sampled in the current cycle.
     */
    get remainingItemsInCurrentCycle(): number;
    /**
     * sample
     *
     * Returns a random item from the remaining items in the current cycle.
     * In other words, an item that has not been sampled yet in the current cycle.
     *
     * ## Complexity
     * Both time and space complexities are O(1).
     *
     * @param item A random item from the remaining items in the current cycle.
     */
    sample(): T;
    /**
     * This method returns an array containing `groupSize` unique items from the current cycle,
     * i.e., items that have not been previously sampled in the current cycle.
     * To avoid ambiguity, these items will also *not* be sampled again in the same cycle.
     *
     * It is equivalent to executing the `sample` method multiple times, with the difference
     * that the group size is limited by the number of remaining items in the cycle.
     * This distinction is necessary to ensure a *unique* group of items.
     *
     * ## Complexity
     * Both time and space complexities are O(groupSize).
     *
     * @param groupSize The number of unique items to sample from the current cycle.
     * @returns An array of length `groupSize`, containing random unique items that have
     *          not been sampled before in the current cycle.
     */
    sampleGroupFromCycle(groupSize: number): T[];
    /**
     * startNewCycle
     *
     * Manually initiates a new cycle, making all input items available again for sampling.
     *
     * ## Use Case
     * This method is useful in scenarios where the non-replacement attribute is not required
     * for extended periods, i.e., when waiting for full cycle exhaustion is not intended.
     * A typical use case might involve repeatedly sampling K unique random items, where
     * each sampling attempt is independent.
     *
     * ## Complexity
     * Both time and space complexities are O(1).
     */
    startNewCycle(): void;
}
