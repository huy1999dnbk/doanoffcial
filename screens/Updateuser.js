import React, { useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, Alert,
    ScrollView,
    TouchableWithoutFeedback,
    Image,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { Formik } from 'formik';
import Formfield from '../component/Formfield';
import FormUpdate from '../component/FormUpdate';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faMale } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';
import Appbutton from '../component/Appbutton';
import ErrorMessage from '../component/ErrorMessage';
import AsyncStorage from '@react-native-community/async-storage';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    phone: Yup.string().required().label('Phone'),
    email: Yup.string().required().email().label('Email'),
    //password: Yup.string().required().min(4).label('Password'),
    address: Yup.string().required().label('Address'),
});


const Updateuser = () => {
    const [current_name, setCurrent_Name] = useState('');
    const [current_Phone, setCurrent_Phone] = useState('');
    const [current_Email, setCurrent_Email] = useState('');
    const [current_Address, setCurrent_Address] = useState('');



    const loadProfile = async () => {
        const tokenID = await AsyncStorage.getItem('idtoken');
        const Id_user = await AsyncStorage.getItem('id_USER');
        await fetch(`https://cnpmwarehouse.herokuapp.com/users/${Id_user}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${tokenID}`,
            }
        }).then((res) => res.json())
            .then((resJson) => {
                setCurrent_Name(resJson.data.name);
                setCurrent_Phone(resJson.data.phone);
                setCurrent_Address(resJson.data.address);
                setCurrent_Email(resJson.data.email);
            })
    };
    loadProfile();
    return (
        <>
            <TouchableWithoutFeedback>
                <ScrollView style={styles.header}>
                    <View style={styles.formik}>
                        <Formik
                            enableReinitialize={true}
                            initialValues={{
                                name: current_name,
                                phone: current_Phone,
                                email: current_Email,
                                address: current_Address,
                            }}
                            onSubmit={() => console.log("nhan button nay d xu ly ")}
                            validationSchema={validationSchema}>
                            {({
                                handleChange,
                                handleSubmit,
                                errors,
                                setFieldTouched,
                                touched,
                                values
                            }) => (
                                    <>
                                        <FormUpdate
                                            placeholder="Name"
                                            secureTextEntry={false}
                                            icons={faMale}
                                            onChangeText={handleChange('name')}
                                            onBlur={() => setFieldTouched('name')}
                                            value={values.name}
                                        />
                                        <ErrorMessage error={errors.name} visible={touched.name} />
                                        <FormUpdate
                                            placeholder="Phone"
                                            secureTextEntry={false}
                                            icons={faPhone}
                                            onChangeText={handleChange('phone')}
                                            onBlur={() => setFieldTouched('phone')}
                                            value={values.phone}
                                        />
                                        <ErrorMessage error={errors.phone} visible={touched.phone} />
                                        <FormUpdate
                                            placeholder="Email"
                                            secureTextEntry={false}
                                            icons={faUser}
                                            onChangeText={handleChange('email')}
                                            onBlur={() => setFieldTouched('email')}
                                            value={values.email}
                                        />
                                        <ErrorMessage error={errors.email} visible={touched.email} />
                                        <FormUpdate
                                            placeholder="Address"
                                            secureTextEntry={false}
                                            icons={faMapMarker}
                                            onChangeText={handleChange('address')}
                                            onBlur={() => setFieldTouched('address')}
                                            value={values.address}
                                        />
                                        <ErrorMessage
                                            error={errors.address}
                                            visible={touched.address}
                                        />
                                        <View style={{ marginHorizontal: 35 }}>
                                            <Appbutton title="Register" onPress={handleSubmit} />
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
    text: {
        color: '#FFF0F0',
        fontFamily: 'Roboto-BoldItalic',
        fontSize: 27,
    },
    formik: {
        flex: 1,
        paddingTop: 45,
        //width: 380,
        height: 500,
        backgroundColor: '#fff',
        //marginHorizontal: 60,
        borderTopWidth: 0,
        borderWidth: 1,
    },

});

export default Updateuser;