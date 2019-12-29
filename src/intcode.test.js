import test from 'ava';
import * as Intcode from './intcode';

//test('', (t) => {
//});

test('Intcode.step can add', (t) => {
  const memory = [1, 0, 0, 5, 99, 0];
  t.deepEqual(Intcode.step({ memory, address: 0 }), {
    memory: [1, 0, 0, 5, 99, 2],
    address: 4,
  });
});

test('Intcode.step can multiply', (t) => {
  const memory = [2, 0, 0, 5, 99, 0];
  t.deepEqual(Intcode.step({ memory, address: 0 }), {
    memory: [2, 0, 0, 5, 99, 4],
    address: 4,
  });
});

test('Intcode.step no-ops on opcode 99', (t) => {
  const memory = [2, 0, 0, 5, 99, 0];
  t.deepEqual(Intcode.step({ memory, address: 4 }), {
    memory: [2, 0, 0, 5, 99, 0],
    address: 4,
  });
});

test('Intcode.segmentMemory splits memory into before, segment, and after', (t) => {
  const memory = [2, 0, 0, 5, 99, 0];
  t.deepEqual(Intcode.segmentMemory({ memory, address: 0 }), {
    before: [],
    segment: [2, 0, 0, 5],
    after: [99, 0],
  });
});
