import { View, Text, StyleSheet } from 'react-native';

import { StoreProvider } from '@metanotes/scribbles-store';
import AppChrome from './AppChrome';

const styles = StyleSheet.create({
  fullScreen: {
    height: '100vh',
  },
});

export function App() {
  return (
    <StoreProvider>
      <View style={styles.fullScreen}>
        <AppChrome />
      </View>
    </StoreProvider>
  );
}

export default App;
