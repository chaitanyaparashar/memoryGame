import * as ActionTypes from '../ActionTypes';

export function updateTime(payload) {
  return (dispatch, getState) => {
    dispatch(updateTimer(payload));
  };
}

export function updateData(payload) {
  return (dispatch) => {
    dispatch(updateCards(payload));
  };
}

export function resetdata() {
  return (dispatch, getState) => {
    let firstState = getState;
    dispatch(resetCards());
    let secondState = getState;
    if (firstState.current_selection == secondState.current_selection) {
      dispatch(resetCards());
    }
    if (firstState.selected_pairs == secondState.selected_pairs) {
      dispatch(resetCards());
    }
  };
}

export function nextLevel() {
  return (dispatch) => {
    dispatch(goToNextLevel());
  };
}

function updateTimer(data) {
  return {
    type: ActionTypes.UPDATE_TIME,
    data,
  };
}
function updateCards(data) {
  return {
    type: ActionTypes.UPDATE_CARDS,
    data,
  };
}

function resetCards() {
  return {
    type: ActionTypes.RESET_CARDS,
  };
}

function goToNextLevel() {
  return {
    type: ActionTypes.NEXT_LEVEL,
  };
}
