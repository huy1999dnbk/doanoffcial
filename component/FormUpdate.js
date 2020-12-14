import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const FormUpdate = ({
  placeholder,
  icons,
  onChangeText,
  secureTextEntry,
  onBlur,
  value,
  editable
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
          value={value}
          editable={editable}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 15,
    //borderWidth: 1,
    //borderColor: '#3f51b5',
    borderRadius: 10,
    height: 60,
    backgroundColor:'#f2efe6',
    elevation:3
  },
  input: {
    height: 60,
    width: '88%',
    //backgroundColor: 'rgba(255,255,255,0)',
    marginHorizontal: 20,
    fontSize: 18,
    fontFamily: 'Roboto-Light',
    fontWeight:'300'
  },
  icon: {marginLeft: 15, marginRight: -15,color: '#3f51b5'},
});

export default FormUpdate;
