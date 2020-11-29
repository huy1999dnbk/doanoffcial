import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const Appbutton = ({title, onPress}) => {
  return (
    <TouchableOpacity style={styles.custombutton} onPress={onPress}>
      <View
        // colors={['#C22100', '#FA694B']}
        // start={{x: 0, y: 0}}
        // end={{x: 1, y: 0}}
        style={styles.button}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  custombutton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#3f51b5',
    borderRadius:15
  },
  text: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Roboto-Bold',
  },
});

export default Appbutton;
