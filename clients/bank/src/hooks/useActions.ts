import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store';

export function useAction() {
  const dispatch = useDispatch();

  return useMemo(
    function () {
      return bindActionCreators(actions, dispatch);
    },

    [dispatch]
  );
}
