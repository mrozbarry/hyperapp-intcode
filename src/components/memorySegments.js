import { h } from 'hyperapp';
import { segmentMemory } from '../intcode';

const memorySegments = (state) => {
  const { before, segment, after } = segmentMemory(state);

  return h('div', null, [
    before.length > 0 && [
      h('span', null, before.join(', ')),
      ', ',
    ],
    h('u', null, segment.join(', ')),
    after.length > 0 && [
      ', ',
      h('span', null, after.join(',')),
    ],
  ]);
};

export default memorySegments;
