import React from 'react';
import { StyleSheet,View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';



const Backarrow = ({ onPress,Color }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <FontAwesomeIcon color={Color} style={styles.icon} icon={faLongArrowAltLeft} size={35} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  
});
export default Backarrow;
