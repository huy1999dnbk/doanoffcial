import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
const Addproduct = ({onPress,title}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <FontAwesomeIcon style={styles.icon} icon={title} size={35} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FC4646',
  },
  icon: {
    color: '#fff',
  },
});

export default Addproduct;
