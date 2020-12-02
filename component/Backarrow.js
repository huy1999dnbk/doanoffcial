import React from 'react';
import { StyleSheet,View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';



const Backarrow = ({ onPress,Color }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <FontAwesomeIcon color={Color} style={styles.icon} icon={faArrowLeft} size={20} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
  },
});
export default Backarrow;
