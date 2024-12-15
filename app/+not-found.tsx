import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import React from 'react';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Page Not Found' }} />      
        <Link href="/(tabs)/home" style={styles.link}>
          Go back to home
        </Link>      
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
