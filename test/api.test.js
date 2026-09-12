import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, queueActions, step } from '../src/engine.js';

test('seller action is validated then applied on the next day', () => {
  let state = createState(12345);
  const result = queueActions(state, [{type:'list_product',productId:'P002',price:799,initial_inventory:20}]);
  assert.equal(result.rejected.length, 0);
  state = step(state);
  const listing = state.listings.find(x => x.id === 'pilot-P002');
  assert.ok(listing);
  assert.equal(listing.price, 799);
});

test('seller cannot submit a price at or below cost', () => {
  const result = queueActions(createState(), [{type:'list_product',productId:'P001',price:300,initial_inventory:20}]);
  assert.equal(result.accepted.length, 0);
  assert.match(result.rejected[0].error, /高於成本/);
});
