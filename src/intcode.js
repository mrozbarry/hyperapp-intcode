const CODES = {
  HALT: 99,
  ADD: 1,
  MULTIPLY: 2,
};

const NAME = {
  [CODES.HALT]: 'Halt',
  [CODES.ADD]: 'Add',
  [CODES.MULTIPLY]: 'Multiply',
};

const makeInputOutputTuple = (inputs, outputs) => [inputs, outputs];

const OPCODE_PARAMS = {
  [CODES.ADD]: makeInputOutputTuple(2, 1),
  [CODES.MULTIPLY]: makeInputOutputTuple(2, 1),
};
const getParamCountsForCode = code => OPCODE_PARAMS[code] || [0, 0];

export const segmentMemory = ({ memory, address }) => {
  // Loop over each address, and add segments for opcodes and their params
  // 1, 5, 5, 6, 99, 2, 0
  // [1, 5, 5, 6, 2, 5, 6, 6], [99], [2, 0]
  const before = memory.slice(0, address);
  const code = memory[address];
  const [inputs, outputs] = getParamCountsForCode(code);
  const segment = memory.slice(address, address + inputs + outputs + 1);
  const after = memory.slice(address + inputs + outputs + 1);

  return { before, segment, after };
};

const makeOpCode = (code, fn) => {
  const [inputs, outputs] = getParamCountsForCode(code);

  return ({
    [code]: ({ memory, address }) => {
      return fn({
        memory,
        address,
        params: memory.slice(address + 1, address + 1 + inputs + outputs),
      });
    },
  })
};


const writeMemory = (address, value, memory) => {
  const temp = [...memory];
  temp[address] = value;
  return temp;
}

const OPCODE = {
  ...makeOpCode(CODES.HALT, ({ memory, address }) => {
    return { memory, address };
  }),
  ...makeOpCode(CODES.ADD, ({ memory, address, params }) => {
    const [a, b, out] = params;
    const result = memory[a] + memory[b];
    return { memory: writeMemory(out, result, memory), address: address + 4 };
  }),
  ...makeOpCode(CODES.MULTIPLY, ({ memory, address, params }) => {
    const [a, b, out] = params;
    const result = memory[a] * memory[b];
    return { memory: writeMemory(out, result, memory), address: address + 4 };
  }),
};

export const step = ({ memory, address }) => {
  const opcode = memory[address];
  return OPCODE[opcode]({ memory, address });
};
