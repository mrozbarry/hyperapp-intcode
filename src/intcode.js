const CODES = {
  HALT: 99,
  ADD: 1,
  MULTIPLY: 2,
  INPUT: 3,
  OUTPUT: 4,
};

const NAME = {
  [CODES.HALT]: 'Halt',
  [CODES.ADD]: 'Add',
  [CODES.MULTIPLY]: 'Multiply',
  [CODES.INPUT]: 'Input',
  [CODES.OUTPUT]: 'Output',
};

const makeInputOutputTuple = (inputs, outputs) => [inputs, outputs];

const OPCODE_PARAMS = {
  [CODES.ADD]: makeInputOutputTuple(2, 1),
  [CODES.MULTIPLY]: makeInputOutputTuple(2, 1),
  [CODES.INPUT]: makeInputOutputTuple(0, 1),
  [CODES.OUTPUT]: makeInputOutputTuple(1, 0),
};
const getParamCountsForCode = code => OPCODE_PARAMS[code] || [0, 0];

export const segmentMemory = ({ memory, address }) => {
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
    [code]: ({ memory, address, opcode }, adapter) => {
      const params = memory.slice(address + 1, address + 1 + inputs + outputs)
        .map((value, index) => {
          const mode = opcode.mode(index);

          // Position
          if (mode === 0) {
            return memory[value];
          }

          // Immediate
          return value;
        });

      return fn({
        memory,
        address,
        params,
        opcode,
      }, adapter);
    },
  })
};


const writeMemory = (address, value, memory) => {
  const temp = [...memory];
  temp[address] = value;
  return temp;
}

export const OPCODE = {
  ...makeOpCode(CODES.HALT, ({ memory, address }) => {
    return { memory, address };
  }),

  ...makeOpCode(CODES.ADD, ({ memory, address, params }) => {
    const [a, b, out] = params;
    const result = a + b;
    return { memory: writeMemory(out, result, memory), address: address + 4 };
  }),
  ...makeOpCode(CODES.MULTIPLY, ({ memory, address, params }) => {
    const [a, b, out] = params;
    const result = a * b
    return { memory: writeMemory(out, result, memory), address: address + 4 };
  }),

  ...makeOpCode(CODES.INPUT, ({ memory, address, params }, adapter) => {
    const [out] = params;
    const input = Number(adapter.input());
    if (Number.isNaN(input)) {
      return { memory, address };
    }
    return { memory: writeMemory(out, input, memory), address: address + 2 };
  }),

  ...makeOpCode(CODES.OUTPUT, ({ memory, address, params }, adapter) => {
    const [a] = params;
    adapter.output(a);
    return { memory, address: address + 2 };
  }),
};

export const step = ({ memory, address }, adapter) => {
  const opcode = memory[address];
  return OPCODE[opcode]({ memory, address }, adapter);
};

export const cannotContinue = ({ memory, address }, inputBuffer) => {
  const current = memory[address];
  return current === CODES.HALT
    || (current === CODES.INPUT && inputBuffer.length === 0)
}

/*
Parsing rules:

ABCDE
 1002

DE - two-digit opcode,      02 == opcode 2
 C - mode of 1st parameter,  0 == position mode
 B - mode of 2nd parameter,  1 == immediate mode
 A - mode of 3rd parameter,  0 == position mode,
                                  omitted due to being a leading zero
  */

export const parseOpcode = (opcode) => {
  if (OPCODE[opcode]) {
    return {
      opcode,
      fn: OPCODE[opcode],
      mode: (_index) => 0,
    };
  }
  const stringOpcode = String(opcode);
  const code = Number(stringOpcode.slice(-2).replace(/^0+/, ''));
  if (!OPCODE[code]) {
    return null;
  }

  const startIndex = stringOpcode.length - 3;

  return {
    opcode: code,
    fn: OPCODE[code],
    mode: (index) => {
      const stringIndex = startIndex - index
      return stringIndex >= 0
        ? Number(stringOpcode[stringIndex])
        : 0;
    },
  };
};
