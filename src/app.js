/*
 * Intcode: 1,5,5,6,99,2,0
 * Intcode: 1,5,5,6,99,2,4
 */ 

/*
 *  [1, 5, 5, 6, 99, 2, 0]
 *  <=================================================>
 *  Address Pointer: 0xaddr
 *  OPCODE: [99; Halt]
 *  ---------------------------------------------------
 *  [1, 5, 5, 6, 99, 2, 0]
 *  <=================================================>
 *  Address Pointer: 0xaddr
 *  OPCODE: [1; Add]
 *  ARG_0:  [5, position; 2]
 *  ARG_1:  [5, position; 2]
 *  ARG_2:  [6, position; 0]
 */

import { app, h } from 'hyperapp';
import * as Actions from './actions';
import * as Intcode from './intcode';

import viewUnloaded from './views/unloaded';
import viewLoaded from './views/loaded';

const viewApp = state => state.memory
  ? viewLoaded(state)
  : viewUnloaded(state);

export default (node, locationSource) => app({
  init: Actions.Init(locationSource),

  view: (state) => h('div', null, [
    h('header', null, state.message),
    viewApp(state),
  ]),

  node,
});
