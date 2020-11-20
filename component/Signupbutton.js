import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';



const Signupbutton = ({onPress, title}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.signup}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#565656',
    fontFamily: 'Roboto-Light',
  },
});
export default Signupbutton;
