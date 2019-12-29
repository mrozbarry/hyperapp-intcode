import test from 'ava';
import { examineVNode } from '../support/testHelpers';
import memorySegments from './memorySegments';

test('it shows before, segment, and after memory chunks', (t) => {
  const memory = [
    1, 0, 0, 9,
    2, 4, 9, 9,
    99, 0,
  ];

  const wrapper = examineVNode(memorySegments({ memory, address: 4 }));

  const tags = wrapper.children().map(n => n.tag()).filter(tag => tag);

  t.deepEqual(tags, ['span', 'u', 'span']);
  t.is(wrapper.childAt(0).text(), '1, 0, 0, 9, ');
  t.is(wrapper.childAt(1).text(), '2, 4, 9, 9');
  t.is(wrapper.childAt(2).text(), ', 99, 0');
});

test('it shows segment and after memory chunks when address is 0', (t) => {
  const memory = [
    1, 0, 0, 9,
    2, 4, 9, 9, 99, 0,
  ];

  const wrapper = examineVNode(memorySegments({ memory, address: 0 }));

  const tags = wrapper.children().map(n => n.tag()).filter(tag => tag);

  t.deepEqual(tags, ['u', 'span']);
  t.is(wrapper.childAt(0).text(), '1, 0, 0, 9');
  t.is(wrapper.childAt(1).text(), ', 2, 4, 9, 9, 99, 0');
});

test('it shows before and segment memory chunks when address is the end', (t) => {
  const memory = [
    1, 0, 0, 9, 2, 4, 9, 9, 99,
    0,
  ];

  const wrapper = examineVNode(memorySegments({ memory, address: memory.length - 1 }));

  const tags = wrapper.children().map(n => n.tag()).filter(tag => tag);

  t.deepEqual(tags, ['span', 'u']);
  t.is(wrapper.childAt(0).text(), '1, 0, 0, 9, 2, 4, 9, 9, 99, ');
  t.is(wrapper.childAt(1).text(), '0');
});
