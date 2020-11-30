import React from 'react';
import {View, StyleSheet, TouchableOpacity,Image} from 'react-native';

const ImportIcon = ({onPress,title}) => {
  return (
    <TouchableOpacity onPress={onPress}>
        <Image style={styles.container} source={require('../assets/images/add.png')} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    //borderRadius: 30,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: '#FC4646',
  },
  icon: {
    color: '#fff',
  },
});

export default ImportIcon;
