const assert = require('node:assert/strict');

require('../js/team-data.js');

const divisions = globalThis.SOLAR_BOAT_DIVISIONS;
const members = globalThis.SOLAR_BOAT_TEAM_MEMBERS;
const divisionIds = new Set(divisions.map(division => division.id));
const memberIds = new Set(members.map(member => member.id));

assert.equal(divisions.length, 4);
assert.equal(divisionIds.size, divisions.length, 'Division IDs must be unique.');
assert.equal(memberIds.size, members.length, 'Member IDs must be unique.');
assert.ok(divisions.every(division => division.name && division.description && division.pageUrl));
assert.ok(members.every(member => member.name && member.role));
assert.ok(members.every(member => !member.division || divisionIds.has(member.division)), 'Assigned divisions must exist.');

const leaders = members.filter(member => member.isLeader);
assert.ok(leaders.every(member => Number.isFinite(member.leadershipOrder)), 'Leaders need a numeric display order.');

console.log('Team data tests passed.');
