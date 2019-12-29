import { h } from 'hyperapp';

const viewUnloaded = state => h(
  'form',
  {
    action: '#',
    method: 'get',
    class: 'unloaded',
  },
  [
    h('textarea', { name: 'code', class: 'unloaded-textarea' }),
    h('button', { type: 'submit' }, 'Load code'),
  ],
);

export default viewUnloaded;
