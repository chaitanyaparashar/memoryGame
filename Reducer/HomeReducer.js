import {UPDATE_CARDS, RESET_CARDS, NEXT_LEVEL, UPDATE_TIME} from '../ActionTypes';
import helpers from '../helpers';

const initialState = {
  cards: [
    {
      index: 0,
      is_open: false,
      matchingPairKey: 1,
    },
    {
      index: 1,
      is_open: false,
      matchingPairKey: 2,
    },
    {
      index: 2,
      is_open: false,
      matchingPairKey: 1,
    },
    {
      index: 3,
      is_open: false,
      matchingPairKey: 2,
    },
  ].shuffle(),
  level: 1,
  score: 0,
  selected_pairs: [],
  current_selection: [],
  seconds: 180,
};

export default function HomeReducer(state = initialState, actions) {
  switch (actions.type) {
    case UPDATE_CARDS:
      return Object.assign({}, state, actions.data);
    case RESET_CARDS:
      return {
        ...state,
        cards: initialState.cards.map((obj) => {
          obj.is_open = false;
          return obj;
        }),
        level: 1,
        score: 0,
        selected_pairs: [],
        current_selection: [],
        seconds: 180,
      };
    case NEXT_LEVEL:
      return {
        ...state,
        level: state.level + 1,
        score: 0,
        selected_pairs: [],
        current_selection: [],
        cards: [
          ...state.cards.map((obj) => {
            obj.is_open = false;
            return obj;
          }),
          {
            index: state.cards.length,
            is_open: false,
            matchingPairKey: (state.cards.length / 2) + 1,
          },
          {
            index: state.cards.length + 1,
            is_open: false,
            matchingPairKey: (state.cards.length / 2) + 1,
          },
        ].shuffle(),
      };
    case UPDATE_TIME:
      return {
        ...state,
        seconds: actions.data,
      };
    default:
      return state;
  }
}
