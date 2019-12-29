import { h } from 'hyperapp';
import * as Actions from '../actions';
import * as Intcode from '../intcode';
import memorySegments from '../components/memorySegments';
import snapshot from '../components/snapshot';

const CONTAINER_STYLES = {
  OLD: {
    margin: '2rem',
    backgroundColor: '#fafafa',
    padding: '0.5rem',
    transition: 'all .3s ease-in-out',
  },
  _: {
    padding: '0.5rem',
    transition: 'all .2s ease-in-out',
  },
};

const customSnapshotContainer = ({ type }) => (state) => h(
  'div',
  {
    key: state.uuid,
    style: CONTAINER_STYLES[type] || CONTAINER_STYLES._,
  },
  snapshot(state),
);

const currentSnapshotContainer = customSnapshotContainer({ type: 'CURRENT' });
const oldSnapshotContainer = customSnapshotContainer({ type: 'OLD' });

const inputsKeyUpDecoder = (e) => {
  if (e.key === 'Enter') {
    const value = e.target.value;
    e.target.value = '';
    return value;
  }
  return '';
};

const viewLoaded = state => h('div', null, [
  h('nav', null, [
    h('a', { href: '/' }, 'Unload code'),
  ]),
  h(
    'button',
    {
      disabled: Intcode.cannotContinue(state, state.inputs),
      onclick: Actions.Step,
    },
    'Step'
  ),
  h(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: '20% 80%',
        maxWidth: '100%',
        margin: '0 1rem',

      },
    },
    [
      h('div', null, [
        'Input Buffer (FIFO)',
        h('input', {
          onkeyup: [Actions.AddInput, inputsKeyUpDecoder]
        }),
        h('ol', null, state.inputs.map(input => h('li', null, input))),
      ]),
      h('div', null, [
        currentSnapshotContainer(state),
        state.history.map(oldSnapshotContainer),
      ]),
    ],
  ),
]);

export default viewLoaded;
