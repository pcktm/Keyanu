export const state = () => ({
  processes: {
    'Code.exe': {
      'CTRL + V': 'Wklej'
    }
  }
})

export const mutations = {
  use (state, {process, keys, desc}) {
    state.processes = {
      ...state.processes, 
      [process]: {
        ...Object.fromEntries(Object.entries(state.processes[process] || {}).reverse().slice(0, 2).reverse()),
        [keys]: desc
      }
    }
  }
}