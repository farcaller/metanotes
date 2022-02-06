/* attributes *
 * id: 01FV86TG8RTAZNKSEK8QM10VMC
 * content-type: application/vnd.metanotes.widget
 * title: core/test/hello-world
 */

import { StyleSheet, View, Text } from 'react-native';

/* eslint-disable-next-line */
export interface HelloWorldProps {}

const styles = StyleSheet.create({
  view: {},
});

export function HelloWorld(props: HelloWorldProps) {
  return <View style={styles.view}>
    <Text>hello scribble world</Text>
  </View>;
}

export default HelloWorld;
