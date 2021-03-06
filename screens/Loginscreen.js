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
  ActivityIndicator
} from 'react-native';
import Appbutton from '../component/Appbutton';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('email'),
  password: Yup.string().required().min(4).label('password'),
});

const Loginscreen = ({ navigation }) => {
  //nhan vao sign up thi se clear data tren 2 form
  //console.log(token);
  const [isLoading,setLoading] = useState(false);
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
            paddingTop:80
          }}>
          <View style={{ alignItems: 'center' }}>
            <Image
              style={{ width: 200, height: 200 }}
              source={require('../assets/images/logo1.png')}
            />
          </View>
          <View style={styles.form}>
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              onSubmit={async (values) => {
                setLoading(true);
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
                        setLoading(false);
                        Alert.alert('Notification', responseData.message, [
                          {
                            text: 'cancel',
                            style: 'cancel',
                          },
                        ]);
                      } else {
                        setLoading(false);
                        check('idtoken', responseData.token);
                        navigation.push('Main');
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
                    <View style={{ marginLeft: 50, marginBottom: 2 }}>
                      <Text style={{ fontFamily: 'Roboto-Medium', color: '#3f51b5',fontSize: 16 }}>Email</Text>
                    </View>
                    <Formfield
                      placeholder="Email"
                      secureTextEntry={false}
                      icons={faUser}
                      onChangeText={handleChange('email')}
                      onBlur={() => setFieldTouched('email')}
                    />
                    <ErrorMessage error={errors.email} visible={touched.email} />
                    <View style={{ marginLeft: 50, marginBottom: 2 }}>
                      <Text style={{ fontFamily: 'Roboto-Medium', color: '#3f51b5',fontSize: 16 }}>Password</Text>
                    </View>
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
                    <View style={{ marginHorizontal: 20, marginTop: 30 }}>
                      <Appbutton title="LOGIN" onPress={handleSubmit} />
                    </View>
                    <View style={styles.signup}>
                      <Signupbutton
                        onPress={() => navigation.navigate('Signup')}
                        title="Register"
                      />
                    </View>
                    {isLoading && <ActivityIndicator color="#2b2c2e" size="large" style={styles.loadingIndicator} />}
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
    marginBottom:40
  },
  loadingIndicator: {
    width: 40,
    height: 40,
    alignSelf: 'center'
},
});


export default Loginscreen;
