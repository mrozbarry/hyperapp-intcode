import { Load } from './effects';
import * as Intcode from './intcode';

export const Init = (locationSource) => [
  {
    memory: null,
    address: 0,
    history: [],
    message: null,
  },
  Load({
    onLoad: ResetMemory,
    onError: ErrorMessage,
    locationSource,
  }),
];

export const ResetMemory = (state, memory) => ({
  memory,
  address: 0,
  history: [],
  message: 'Load Successful',
});

export const ErrorMessage = (state, message) => ({ ...state, message });

export const Step = (state) => {
  const { memory, address } = Intcode.step(state);
  return { ...state, memory, address };
};
