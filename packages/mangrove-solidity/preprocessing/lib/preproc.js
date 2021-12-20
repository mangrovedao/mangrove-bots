const util = require("util");

/* Dex methods */
/* struct fields are of the form [name:string,bits:number,type:string] */
// number of bits before a field
const before = (struct_def, _name) => {
  const stop = struct_def.findIndex(({ name }) => name == _name);
  if (stop < 0) {
    throw "preproc/before/not_found";
  }
  return struct_def.reduce((acc_bits, { bits }, index) => {
    return acc_bits + (index < stop ? bits : 0);
  }, 0);
};

// number of bits in a field
const bits_of = (struct_def, _name) =>
  struct_def.find(({ name }) => name == _name).bits;

// destination type of a field
const type_of = (struct_def, _name) =>
  struct_def.find(({ name }) => name == _name).type;

// cleanup-mask: 1's everywhere at field location, 0's elsewhere
const mask = (struct_def, _name) => {
  const bfr = before(struct_def, _name);
  const bts = bits_of(struct_def, _name);
  if (bfr % 4 != 0 || bts % 4 != 0) {
    throw "preproc/mask/misaligned";
  }
  return (
    "0x" +
    "f".repeat(bfr / 4) +
    "0".repeat(bts / 4) +
    "f".repeat((256 - bfr - bts) / 4)
  );
};

// number of bits after a field
const after = (struct_def, _name) => {
  return 256 - before(struct_def, _name) - bits_of(struct_def, _name);
};

// prints accessor for a field
const get = (ptr, struct_def, _name) => {
  const left = before(struct_def, _name);
  const right = before(struct_def, _name) + after(struct_def, _name);
  const inner = `uint((${ptr} << ${left})) >> ${right}`;
  const type = type_of(struct_def, _name);
  if (type === "address") {
    return `${type}(uint160(${inner}))`;
  } else if (type === "bool") {
    return `((${inner}) > 0)`;
  } else {
    return `${type}(${inner})`;
  }
};
const preamble = `

/* ************************************************** *
            GENERATED FILE. DO NOT EDIT.              
 * ************************************************** */

/* since you can't convert bool to uint in an expression without conditionals, 
 * we add a file-level function and rely on compiler optimization
 */
function uint_of_bool(bool b) pure returns (uint u) {
  assembly { u := b }
}
`;

const precast = (type, val) => {
  if (type === "address") {
    return `uint(uint160(${val}))`;
  } else if (type === "bool") {
    return `uint_of_bool(${val})`;
  } else {
    return val;
  }
};

// prints setter for a single field
const set1 = (ptr, struct_def, _name, val) => {
  const msk = mask(struct_def, _name);
  const left = before(struct_def, _name) + after(struct_def, _name);
  const right = before(struct_def, _name);
  const inner = precast(type_of(struct_def, _name), val);
  return `(${ptr} & bytes32(${msk}) | bytes32((${inner} << ${left}) >> ${right}))`;
};

// prints setter for multiple fields
// set(set1,...) better than set1(set,...) because it keeps stack use constant
const set = (ptr, struct_def, values) => {
  const red = (acc, [_name, value]) => set1(acc, struct_def, _name, value);
  return values.reduce(red, ptr);
};

// !unsafe version! prints setter for a single field, without bitmask cleanup
const set1_unsafe = (ptr, struct_def, _name, val) => {
  const left = before(struct_def, _name) + after(struct_def, _name);
  const right = before(struct_def, _name);
  const inner = precast(type_of(struct_def, _name), val);
  return `(${ptr} | bytes32((${inner} << ${left}) >> ${right}))`;
};

const make = (struct_def, values) => {
  const red = (acc, [_name, value]) =>
    set1_unsafe(acc, struct_def, _name, value);
  return values.reduce(red, "bytes32(0)");
};

// validate struct_def: total size is <256 bits, each bitsize is divisible by 4 (since bitmasks work at the nibble granularity level).
const validate = (sname, struct_def) => {
  const red = (acc, field) => {
    if (!["uint", "address", "bool"].includes(field.type)) {
      throw new Error(
        `bad field ${util.inspect(
          field
        )}, only allowed types are uint,address and bool`
      );
    }
    if (field.type === "address" && field.bits !== 160) {
      throw new Error(
        `bad field ${util.inspect(field)}, addresses must have 160 bits`
      );
    }
    if (field.type === "bool" && field.bits !== 8) {
      throw new Error(
        `bad field ${util.inspect(field)}, bools must have 8 bits`
      );
    }
    if (field.bits % 4 != 0) {
      throw new Error(
        `bad field ${util.inspect(field)}, bitsize must be divisible by 4`
      );
    } else {
      return acc + field.bits;
    }
  };
  const bits = struct_def.reduce(red, 0);
  if (bits > 256) {
    throw new Error(`bad struct_def ${sname}, bitsize ${bits} > 256`);
  }
};

exports.structs_with_macros = (obj_struct_defs) => {
  for (const sname in obj_struct_defs) {
    validate(sname, obj_struct_defs[sname]);
  }

  const struct_defs = Object.entries(obj_struct_defs);

  const ret = {
    preamble,
    struct_defs,
    make: (struct_def, values) => make(struct_def, values),
    get: (ptr, struct_def, _name) => get(ptr, struct_def, _name),
    set1: (ptr, struct_def, _name, value) =>
      set1(ptr, struct_def, _name, value),
    // accessors since dot access broken in preproc
    f_name: (field) => field.name,
    f_bits: (field) => field.bits,
    f_type: (field) => field.type,
    // utility methods
    // solpp's default capitalize removes other capital letters in the word
    capitalize: (s) => s.slice(0, 1).toUpperCase() + s.slice(1),
  };

  for (const [sname, struct_def] of struct_defs) {
    ret[`set_${sname}`] = (ptr, values) => set(ptr, struct_def, values);
    ret[`make_${sname}`] = (values) => make(struct_def, values);
    for (const { name } of struct_def) {
      ret[`${sname}_${name}`] = (ptr) => get(ptr, struct_def, name);
    }
  }
  return ret;
};
