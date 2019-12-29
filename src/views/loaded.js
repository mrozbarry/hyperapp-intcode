import { h } from 'hyperapp';
import * as Actions from '../actions';
import memorySegments from '../components/memorySegments';

const viewLoaded = state => h('div', null, [
  h('nav', null, [
    h('a', { href: '/' }, 'Unload code'),
  ]),
  memorySegments(state),
  h(
    'button',
    {
      disabled: state.memory[state.address] === 99,
      onclick: Actions.Step,
    },
    'Step'
  ),
]);

export default viewLoaded;
