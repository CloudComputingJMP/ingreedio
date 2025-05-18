import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../store/actions';

const useLoginAutomatically = (): void => {
  const dispatch = useDispatch();
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    const isMod = localStorage.getItem('isMod') === 'true';
    if (!isUnmountedRef.current && accessToken && username) {
      dispatch(actions.logUser(accessToken, username, isMod));
      dispatch(actions.setUsername(username));
    }
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);
};

export default useLoginAutomatically;
