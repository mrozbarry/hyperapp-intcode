import { Load } from './effects';
import * as Intcode from './intcode';

const makeUuid = () => Math.random().toString(36);

const initialState = () => ({
  memory: null,
  address: 0,
  uuid: makeUuid(),
  history: [],
  message: null,
  inputs: [],
});

export const Init = (locationSource) => [
  initialState(),
  Load({
    onLoad: ResetMemory,
    onError: ErrorMessage,
    locationSource,
  }),
];

export const ResetMemory = (state, memory) => ({
  ...initialState(),
  memory,
  message: 'Load Successful',
});

export const ErrorMessage = (state, message) => ({ ...state, message });

export const Step = (state) => {
  const opcode = Intcode.parseOpcode(state.memory[state.address]);
  if (!opcode) {
    return {
      ...state,
      message: `Encountered unsupported opcode (${opcode})`,
    };
  }

  let inputs = [...state.inputs];
  const { memory, address } = opcode.fn(
    {
      memory: state.memory,
      address: state.address,
      opcode: opcode,
    },
    {
      input: () => inputs.shift(),
      output: (value) => {
        console.log('OUTPUT', value);
      },
    },
  );

  return {
    ...state,
    memory,
    address,
    uuid: makeUuid(),
    history: [
      { memory: state.memory, address: state.address, uuid: state.uuid },
      ...state.history,
    ],
    inputs,
    message: '',
  };
};

export const AddInput = (state, input) => !input
  ? state
  : {
    ...state,
    inputs: state.inputs.concat(input),
  };
