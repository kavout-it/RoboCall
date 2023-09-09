import { create } from 'zustand';
import { combine } from 'zustand/middleware';

interface State {
  [prop: string]: unknown;
}

const initialState: State = {};

const useStore = create(
    combine(structuredClone(initialState), (set, get) => ({
      // TODO: Add your code here
    })
  )
);

export default useStore;
