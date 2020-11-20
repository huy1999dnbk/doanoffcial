import React from 'react';
import {
  StyleSheet,
  View,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Formik} from 'formik';
import Formfield from '../component/Formfield';
import {faUser} from '@fortawesome/free-regular-svg-icons';
import {faLock} from '@fortawesome/free-solid-svg-icons';
import {faMale} from '@fortawesome/free-solid-svg-icons';
import {faPhone} from '@fortawesome/free-solid-svg-icons';
import {faMapMarker} from '@fortawesome/free-solid-svg-icons';
import Appbutton from '../component/Appbutton';
import ErrorMessage from '../component/ErrorMessage';
import Backarrow from '../component/Backarrow';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  phone: Yup.string().required().label('Phone'),
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(4).label('Password'),
  address: Yup.string().required().label('Address'),
});
const SignupScreen = ({navigation}) => {
  return (
    <>
      <TouchableWithoutFeedback>
        <ScrollView style={styles.header}>
          <View style={styles.formik}>
            <Formik
              initialValues={{
                name: '',
                phone: '',
                email: '',
                password: '',
                address: '',
              }}
              onSubmit={async (values) => {
                await fetch('https://cnpmwarehouse.herokuapp.com/users', {
                  method: 'POST',
                  headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    name: values.name,
                    phone: values.phone,
                    email: values.email,
                    password: values.password,
                    address: values.address,
                  }),
                })
                  .then((response) => response.json())
                  .then((responseJson) => {
                    if (responseJson.statusCode === 201) {
                      Alert.alert(
                        'Notification',
                        'Your account has been created successfully',
                        [
                          {
                            text: 'cancel',
                            style: 'cancel',
                          },
                        ],
                      );
                    } else {
                      Alert.alert(
                        'Notification',
                        'Your account was not created successfully',
                        [
                          {
                            text: 'cancel',
                            style: 'cancel',
                          },
                        ],
                      );
                    }
                  });
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
                    placeholder="Name"
                    secureTextEntry={false}
                    icons={faMale}
                    onChangeText={handleChange('name')}
                    onBlur={() => setFieldTouched('name')}
                  />
                  <ErrorMessage error={errors.name} visible={touched.name} />
                  <Formfield
                    placeholder="Phone"
                    secureTextEntry={false}
                    icons={faPhone}
                    onChangeText={handleChange('phone')}
                    onBlur={() => setFieldTouched('phone')}
                  />
                  <ErrorMessage error={errors.phone} visible={touched.phone} />
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
                  <Formfield
                    placeholder="Address"
                    secureTextEntry={false}
                    icons={faMapMarker}
                    onChangeText={handleChange('address')}
                    onBlur={() => setFieldTouched('address')}
                  />
                  <ErrorMessage
                    error={errors.address}
                    visible={touched.address}
                  />
                  <View style={{marginHorizontal: 35}}>
                    <Appbutton title="Register" onPress={handleSubmit} />
                  </View>
                  <View style={styles.arrow}>
                    <Backarrow onPress={() => navigation.navigate('Login')} />
                  </View>
                </>
              )}
            </Formik>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    //flex: 1,
    //alignItems: 'center',
    //height: 800,
    width: '100%'
  },
  arrow: {
    alignItems: 'center',
    marginTop: 50,
  },
  text: {
    color: '#FFF0F0',
    fontFamily: 'Roboto-BoldItalic',
    fontSize: 27,
  },
  formik: {
    flex:1,
    paddingTop: 45,
    //width: 380,
    height: 880,
    backgroundColor: '#fff',
    //marginHorizontal: 60,
    borderTopWidth: 0,
    borderWidth: 1,
  },
});

export default SignupScreen;
