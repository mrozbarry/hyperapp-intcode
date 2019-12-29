import { h } from 'hyperapp';
import { segmentMemory } from '../intcode';

//const memorySegments = (state) => {
  //const { before, segment, after } = segmentMemory(state);

  //const makeSegment = (tag, seg, options) => seg.length
    //? [h(tag, null, (options.prepend ? ', ' : '') + seg.join(', ') + (options.append ? ', ' : ''))]
    //: [];

  //return h(
    //'code',
    //{
      //style: {
        //display: 'block',
        //whiteSpace: 'nowrap',
        //overflowX: 'auto',
        //maxWidth: '100%',
        //padding: '0.5rem',
        //backgroundColor: 'white',
      //},
    //},
    //[
      //...makeSegment('span', before, { append: true }),
      //h('u', null, h('strong', null, segment.join(', '))),
      //...makeSegment('span', after, { prepend: true }),
    //]
  //);
//};

//export default memorySegments;

const tdProps = { style: { width: '50px', textAlign: 'center' } };
const memorySegments = (state) => {
  const { before, segment, after } = segmentMemory(state);

  return h(
    'code',
    {
      style: {
        display: 'block',
        whiteSpace: 'nowrap',
        overflowX: 'auto',
        maxWidth: '100%',
        padding: '0.5rem',
        backgroundColor: 'white',
      },
    },
    h('table', { style: { tableLayout: 'fixed', width: `${state.memory.length * 75}px` } }, [
      h('tr', null, state.memory.map((_, address) => h('th', tdProps, address))),
      h('tbody', null, h('tr', null, [
        ...before.map(value => h('td', tdProps, value)),
        ...segment.map(value => h('td', tdProps, h('u', null, h('strong', null, value)))),
        ...after.map(value => h('td', tdProps, value)),
      ])),
    ]),
  );
};

export default memorySegments;
