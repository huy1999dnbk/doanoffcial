import React, { useState } from 'react';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-community/async-storage';
import ErrorMessage from '../component/ErrorMessage';
import { Formik } from 'formik';
import Formfield from '../component/Formfield';
import Signupbutton from '../component/Signupbutton';
import * as Yup from 'yup';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import Appbutton from '../component/Appbutton';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('email'),
  password: Yup.string().required().min(4).label('password'),
});

const Loginscreen = ({ navigation }) => {
  //nhan vao sign up thi se clear data tren 2 form
  //console.log(token);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View
          style={{
            // justifyContent: 'center',
            // alignItems: 'center',
            height: '100%',
          }}>
          <View style={{ alignItems: 'center' }}>
            <Image
              style={{ width: 250, height: 250 }}
              source={require('../assets/images/logooffcial.png')}
            />
          </View>
          <View style={styles.form}>
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              onSubmit={async (values) => {
                const check = async (item, selectedValue) => {
                  if (selectedValue) {
                    await AsyncStorage.setItem(item, selectedValue);
                  }
                };
                // login
                if (values.email != '' && values.password != '') {
                  await fetch('https://managewarehouse.herokuapp.com/auth', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: values.email,
                      password: values.password,
                    }),
                  })
                    .then((response) => response.json())
                    .then((responseData) => {
                      if (responseData.message) {
                        Alert.alert('Notification', responseData.message, [
                          {
                            text: 'cancel',
                            style: 'cancel',
                          },
                        ]);
                      } else {
                        check('idtoken', responseData.token);
                        navigation.navigate('Main');
                      }
                    });
                }
              }}
              validationSchema={validationSchema}>
              {({
                handleChange,
                handleSubmit,
                errors,
                setFieldTouched,
                touched,
              }) => (
                  <>
                    <Formfield
                      placeholder="Email"
                      secureTextEntry={false}
                      icons={faUser}
                      onChangeText={handleChange('email')}
                      onBlur={() => setFieldTouched('email')}
                    />
                    <ErrorMessage error={errors.email} visible={touched.email} />
                    <Formfield
                      placeholder="Password"
                      secureTextEntry={true}
                      icons={faLock}
                      onChangeText={handleChange('password')}
                      onBlur={() => setFieldTouched('password')}
                    />
                    <ErrorMessage
                      error={errors.password}
                      visible={touched.password}
                    />
                    <View style={{ marginHorizontal: 35, marginTop: 30 }}>
                      <Appbutton title="LOGIN" onPress={handleSubmit} />
                    </View>
                    <View style={styles.signup}>
                      <Signupbutton
                        onPress={() => navigation.navigate('Signup')}
                        title="Register"
                      />
                    </View>
                  </>
                )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  form: {
    marginTop: 40,
    flex: 1,
  },
  signup: {
    alignItems: 'center',
    marginTop: 30,
  },
});


export default Loginscreen;
