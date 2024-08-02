let count = 0;

export const get = () => count;
export const increment = (inc: number) => (count += inc);
export const reset = () => (count = 0);
