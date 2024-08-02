let count = 0;

export const get = () => count;
export const increment = (inc: number) => (count += inc);
export const multiply = (multiplier: number) => (count *= multiplier);
export const reset = () => (count = 0);
