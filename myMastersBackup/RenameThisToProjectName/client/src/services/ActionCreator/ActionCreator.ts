import { IAction } from './IAction';

// Synchronous Action Creator
// --------------------------
// This function is taken directly from "reducing boilerplate"
// section of the redux documentation:
// http://redux.js.org/docs/recipes/ReducingBoilerplate.html#generating-action-creators
export default <T extends IAction>(type, ...argNames) => ((...args) : T => {
  const action = { type } as T;
  argNames.forEach((arg, index) => {
    action[argNames[index]] = args[index];
  });

  return action;
});
