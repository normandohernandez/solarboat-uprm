const assert = require('node:assert/strict');

require('../js/event-system.js');
const system = globalThis.SolarBoatEventSystem;

const storage = () => {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, value)
  };
};

const baseEvent = overrides => ({
  id: 'event-a',
  version: 1,
  type: 'announcement',
  title: 'Test event',
  description: 'Test description',
  active: true,
  priority: 2,
  ...overrides
});

const duringWindow = Date.parse('2026-10-18T16:00:00Z'); // noon in Puerto Rico

assert.equal(system.DEFAULT_TIME_ZONE, 'America/Puerto_Rico');
assert.equal(system.DISMISSAL_COOLDOWN_MS, 14400000);
assert.equal(system.parseScheduleDate('2026-10-18T12:00:00', { timeZone: 'America/Puerto_Rico' }), duringWindow);
assert.equal(system.isEligible(baseEvent(), duringWindow), true);
assert.equal(system.isEligible(baseEvent({ active: false }), duringWindow), false);
assert.equal(system.isEligible(baseEvent({ displayEnd: '2026-10-17' }), duringWindow), false);
assert.equal(system.isEligible(baseEvent({ displayStart: '2026-10-18T11:00:00', displayEnd: '2026-10-18T13:00:00' }), duringWindow), true);
assert.equal(system.isEligible(baseEvent({ displayStart: 'invalid' }), duringWindow), false);

const cooldownStorage = storage();
const dismissed = baseEvent();
system.dismiss(dismissed, cooldownStorage, duringWindow);
assert.equal(system.isCoolingDown(dismissed, duringWindow + 1000, cooldownStorage), true);
assert.equal(system.isCoolingDown(dismissed, duringWindow + 14400000, cooldownStorage), false);
assert.notEqual(system.storageKeyFor(dismissed), system.storageKeyFor({ ...dismissed, version: 2 }));

const newEvent = baseEvent({ id: 'event-b', priority: 2 });
assert.equal(system.selectEvent([dismissed, newEvent], {
  at: duringWindow + 1000,
  storage: cooldownStorage,
  respectCooldown: true
}).id, 'event-b');

const highPriority = baseEvent({ id: 'priority-one', priority: 1 });
assert.equal(system.selectEvent([newEvent, highPriority], { at: duringWindow, storage: storage(), respectCooldown: true }).id, 'priority-one');
assert.equal(system.selectEvent([
  baseEvent({ id: 'z-event', priority: 1 }),
  baseEvent({ id: 'a-event', priority: 1 })
], { at: duringWindow, storage: storage(), respectCooldown: true }).id, 'a-event');

assert.deepEqual(system.getDetails(baseEvent()), []);
assert.deepEqual(system.getDetails(baseEvent({
  type: 'raffle', prize: 'Boat', ticketPrice: '', raffleDate: 'June 1'
})), [
  { label: 'Prize', value: 'Boat' },
  { label: 'Raffle Date', value: 'June 1' }
]);

assert.equal(system.isValidActionUrl('', 'https://example.com'), false);
assert.equal(system.isValidActionUrl('#', 'https://example.com'), false);
assert.equal(system.isValidActionUrl('event-details.html', 'https://example.com'), true);
assert.equal(system.isValidActionUrl('javascript:alert(1)', 'https://example.com'), false);

console.log('Event system tests passed.');
