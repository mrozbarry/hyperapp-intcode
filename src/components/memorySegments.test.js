import test from 'ava';
import memorySegments from './memorySegments';

test('it shows before, segment, and after memory chunks', (t) => {
  const memory = [
    1, 0, 0, 9,
    2, 4, 9, 9,
    99,
    0,
  ];

  t.snapshot(memorySegments({ memory, address: 4 }));
});
