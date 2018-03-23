import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  RippleFeedbackIOS
} from './app/components';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <RippleFeedbackIOS style={styles.testBox}>
          <Text>CLICK ME</Text>
        </RippleFeedbackIOS>
        <RippleFeedbackIOS style={styles.testBox}>
          <Text>CLICK ME 2</Text>
        </RippleFeedbackIOS>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testBox: {
    backgroundColor: '#fafafa',
    borderWidth: 2,
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  }
});
