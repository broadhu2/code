import { compact, range } from 'lodash';

Object.filter = (object, predicate) => {
  return Object.keys(object)
    .filter((key) => predicate(object[key]))
    .reduce((result, key) => ((result[key] = object[key]), result), {});
};

Object.max = (object, predicate) => {
  return Math.max.apply(
    Math,
    Object.keys(object).map((key) => predicate(object[key]))
  );
};

class FreqStack {
  constructor() {
    this._stack = [];
    this.details = {};
  }

  get stack() {
    return this._stack;
  }

  /**
   * @param {number} x
   * @return {void}
   */
  push(x) {
    this.stack.push(x);

    if (this.details[x]) {
      this.details[x] = {
        count: this.details[x].count + 1,
        indexes: [...this.details[x].indexes, this.stack.length - 1],
      };
    } else {
      this.details[x] = {
        count: 1,
        indexes: [this.stack.length - 1],
      };
    }
  }

  /**
   * @return {number}
   */
  pop() {
    const maxFrequency = Object.max(this.details, (detail) => detail.count);

    const mostFrequent = Object.filter(
      this.details,
      (detail) => detail.count === maxFrequency
    );

    const closestIndex = Object.max(
      mostFrequent,
      (detail) => detail.indexes[detail.indexes.length - 1]
    );

    const closest = this.stack[closestIndex];
    this.stack[closestIndex] = null;

    this.details[closest].count = this.details[closest].count - 1;
    this.details[closest].indexes.pop();

    return closest;
  }

  getDetails() {
    return this.details;
  }
}

const test = [5, 7, 5, 7, 4, 5];

const freqStack = new FreqStack();

test.forEach((x) => freqStack.push(x));

range(4).forEach((v) =>
  console.log([freqStack.pop(), compact(freqStack.stack)])
);
