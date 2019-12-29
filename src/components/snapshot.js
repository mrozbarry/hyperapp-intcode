import { h } from 'hyperapp';
import memorySegments from './memorySegments';

const snapshot = (state /* { memory, address } */ ) => h('div', null, [
  h('h2', null, `Address: ${state.address}`),
  memorySegments(state),
]);

export default snapshot;
