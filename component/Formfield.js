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
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 47,
    marginBottom: 25,
    borderWidth: 1.5,
    borderColor: '#E8DEDC',
    borderRadius: 15,
    height: 50,
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255,255,255,0)',
    marginHorizontal: 20,
    fontSize: 17,
    fontFamily: 'Roboto-Bold',
  },
  icon: {marginLeft: 15, marginRight: -15,color: '#F5866F'},
});

export default Formfield;
