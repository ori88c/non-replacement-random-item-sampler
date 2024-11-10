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

import { NonReplacementRandomSampler } from './non-replacement-random-item-sampler';

describe('NonReplacementRandomSampler tests', () => {
  describe('Happy path tests', () => {
    test('each item is sampled exactly once within each cycle', async () => {
      const cyclesCount = 14;
      const itemsCount = 231;
      const items = new Array<number>(itemsCount)
        .fill(0)
        .map((_, index) => index);
      const sampler = new NonReplacementRandomSampler(items);
      
      for (let cycleNumber = 1; cycleNumber <= cyclesCount; ++cycleNumber) {
        const alreadySampledItems = new Set<number>();

        for (let sampleAttempt = 1; sampleAttempt <= itemsCount; ++sampleAttempt) {
          expect(sampler.size).toBe(itemsCount);
          expect(sampler.currentCycle).toBe(cycleNumber);

          alreadySampledItems.add(sampler.sample());
          expect(alreadySampledItems.size).toBe(sampleAttempt);

          const expectedRemainingItemsCount = sampleAttempt < itemsCount ?
            (itemsCount - sampleAttempt) :
            itemsCount; // A new cycle starts once all items have been sampled, resetting the count.
          expect(sampler.remainingItemsInCurrentCycle).toBe(expectedRemainingItemsCount);
        }
      }
    });

    test('sampleGroupFromCycle: each item is sampled exactly once within each cycle', async () => {
      const cyclesCount = 9;
      const itemsCount = 386;
      const items = new Array<number>(itemsCount)
        .fill(0)
        .map((_, index) => index);
      const sampler = new NonReplacementRandomSampler(items);
      
      for (let cycleNumber = 1; cycleNumber <= cyclesCount; ++cycleNumber) {
        const alreadySampledItems = new Set<number>();
        let remainedItemsCount = itemsCount;
        let sampledItemsCount = 0;
        const getRandomValidGroupSize = () => Math.ceil(Math.random() * remainedItemsCount);

        while (remainedItemsCount > 0) {
          expect(sampler.size).toBe(itemsCount);
          expect(sampler.currentCycle).toBe(cycleNumber);
          expect(sampler.remainingItemsInCurrentCycle).toBe(remainedItemsCount);

          const groupSize = getRandomValidGroupSize();
          const sampledGroup = sampler.sampleGroupFromCycle(groupSize);
          remainedItemsCount -= groupSize;
          sampledItemsCount += groupSize;

          for (const item of sampledGroup) {
            alreadySampledItems.add(item);
          }

          expect(alreadySampledItems.size).toBe(sampledItemsCount);
        }

        // A new cycle starts once all items have been sampled, resetting the count.
        expect(sampler.remainingItemsInCurrentCycle).toBe(itemsCount);
      }
    });
  });

  describe('Negative path tests', () => {
    test('should throw when number of items is less than 2', () => {
      expect(() => new NonReplacementRandomSampler([])).toThrow();
      expect(() => new NonReplacementRandomSampler([354])).toThrow();
    });

    test(
      'sampleGroupFromCycle: throws an error if group size exceeds the number of remaining items in the current cycle', () => {
        const itemsCount = 34;
        const items = new Array<number>(itemsCount)
          .fill(0)
          .map((_, index) => index);
        const sampler = new NonReplacementRandomSampler(items);

        const minGroupSize = itemsCount + 1;
        const maxGroupSize = itemsCount * 3;
        for (let groupSize = minGroupSize; groupSize <= maxGroupSize; ++groupSize) {
          expect(() => sampler.sampleGroupFromCycle(groupSize)).toThrow();
        }
    });
  });
});
