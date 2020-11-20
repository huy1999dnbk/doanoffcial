import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
const ErrorMessage = ({error, visible}) => {
  if (!visible || !error) return null;
  return (
    <View style={styles.errorcontainer}>
      <Text style={styles.error}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    color: 'red',
    fontFamily: 'Roboto-Bold'
  },
  errorcontainer:{
    marginHorizontal: 47,
    marginTop: -25,
    marginBottom: 15
  }
});

export default ErrorMessage;
