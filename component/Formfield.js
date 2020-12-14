import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const Formfield = ({
  placeholder,
  icons,
  onChangeText,
  secureTextEntry,
  onBlur,
}) => {
  return (
    <>
      <View style={styles.form}>
        <FontAwesomeIcon style={styles.icon} icon={icons} size={18} />
        <TextInput
          numberOfLines={1}
          autoCapitalize="none"
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          style={styles.input}
          placeholder={placeholder}
          onBlur={onBlur}
          autoCompleteType="off"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 27,
    marginBottom: 10,
    borderRadius:20,
    //borderRadius: 15,
    height: 65,
    backgroundColor:'#f2efe6',
    elevation:3
  },
  input: {
    height: 65,
    width:'88%',
    backgroundColor: 'rgba(255,255,255,0)',
    marginHorizontal: 20,
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
  icon: {marginLeft: 15, marginRight: -15,color: '#3f51b5'},
});

export default Formfield;
