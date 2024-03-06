import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { differenceInSeconds } from 'date-fns';
import { useRouter } from 'expo-router';

// https://aloukissas.medium.com/how-to-build-a-background-timer-in-expo-react-native-without-ejecting-ea7d67478408

export const UserInactivityProvider = ({ children }: any) => {
  const appState = useRef(AppState.currentState);
  const router = useRouter();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const recordStartTime = async () => {
    try {
      const now = new Date();
      await AsyncStorage.setItem('@start_time', now.toISOString());
    } catch (err) {
      console.warn(err);
    }
  };

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background') {
      await recordStartTime();
    } else if (appState.current.match(/background/) && nextAppState === 'active') {
      const elapsed = (await getElapsedTime()) || 0;

      if (elapsed > 5) {
        console.log('User has been inactive for more than 5 seconds!');
        router.replace('/(authenticated)/(modals)/lock');
      }
    }
    appState.current = nextAppState;
  };

  const getElapsedTime = async () => {
    try {
      const startTime = await AsyncStorage.getItem('@start_time');
      const now = new Date();
      return differenceInSeconds(now, Date.parse(startTime!));
    } catch (err) {
      console.warn(err);
    }
  };

  return children;
};
