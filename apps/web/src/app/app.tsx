import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  fullScreen: {
    height: '100vh',
  },
});

export function App() {
  return (
    <View style={styles.fullScreen}>
      <Text>hello world</Text>
    </View>
  );
}

export default App;
