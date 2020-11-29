import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowCircleLeft} from '@fortawesome/free-solid-svg-icons';



const Backarrow = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <FontAwesomeIcon style={styles.icon} icon={faArrowCircleLeft} size={50} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    color: '#3f51b5',
  },
});
export default Backarrow;
