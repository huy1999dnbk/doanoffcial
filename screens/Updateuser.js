import React, { useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, Alert,
    ScrollView,
    TouchableWithoutFeedback,
    Image,
    ActivityIndicator,
    Platform,
    Button,
    TouchableOpacity
} from 'react-native';
import { Formik } from 'formik';
import Formfield from '../component/Formfield';
import FormUpdate from '../component/FormUpdate';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faCommentsDollar, faLock } from '@fortawesome/free-solid-svg-icons';
import { faMale } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';
import Appbutton from '../component/Appbutton';
import ErrorMessage from '../component/ErrorMessage';
import AsyncStorage from '@react-native-community/async-storage';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-picker';
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
    const [idUser, setIdUser] = useState(0);
    const [urlFireBase, setUrlFireBase] = useState('');
    const [isUpload, setIsUpload] = useState(false);
    //const [imaURL,setImaURL] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [localName, setLocalName] = useState('');
    const [localPath, setLocalPath] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');

    const [isUploadSuccess, setIsUploadSuccess] = useState(false);
    const loadProfile = async () => {
        const tokenID = await AsyncStorage.getItem('idtoken');
        const Id_user = await AsyncStorage.getItem('id_USER');
        await fetch(`https://managewarehouse.herokuapp.com/users/${Id_user}`, {
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
                setImagePath(resJson.data.image);
                setIdUser(resJson.data.id);
                setUrlFireBase(resJson.data.image);
            })
    };
    useEffect(() => {
        loadProfile();
    }, [])

    const chooseFile = () => {
        setStatus('');
        var options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true, // do not backup to iCloud
                path: 'images', // store camera images under Pictures/images for android and Documents/images for iOS
            },
        };
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker', storage());
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                setIsUploadSuccess(true);
                setIsUpload(true);
                let path = getPlatformPath(response).value;
                console.log('path la: ', path);
                let fileName = getFileName(response.fileName, path);
                setParam(fileName, path);
                setImagePath(path);
            }
        });
    };


    const setParam = (x, y) => {
        setLocalName(x);
        setLocalPath(y);
    };

    const getFileName = (name, path) => {
        if (name != null) { return name; }

        if (Platform.OS === "ios") {
            path = "~" + path.substring(path.indexOf("/Documents"));
        }
        return path.split("/").pop();
    }


    const uploadImageToStorage = (path, name) => {
        setIsLoading(true);
        let reference = storage().ref(name);
        let task = reference.putFile(path);
        task.then(() => {
            console.log('Image uploaded to the bucket!');
            //this.setState({ isLoading: false, status: 'Image uploaded successfully' });
            setIsLoading(false);
            setStatus('Image uploaded succesfully');
            const getURL = async () => {
                const ref = storage().ref(name);
                const url = await ref.getDownloadURL();
                //console.log(url);
                setUrlFireBase(url);
            }
            getURL();
        }).catch((e) => {
            status = 'Something went wrong';
            console.log('uploading image error => ', e);
            //this.setState({ isLoading: false, status: 'Something went wrong' });
            setIsLoading(false);
            setStatus('Something went wrong');
        });
    }

    const getPlatformPath = ({ path, uri }) => {
        return Platform.select({
            android: { "value": path },
            ios: { "value": uri }
        })
    }


    const getPlatformURI = (imagePath) => {
        let imgSource = null;
        if (isNaN(imagePath)) {
            if (!isUpload) {
                imgSource = { uri: imagePath };

            } else if (isUpload) {
                imgSource = { uri: imagePath };
                if (Platform.OS == 'android') {
                    imgSource.uri = "file:///" + imgSource.uri;

                }
            }
        }
        console.log(imgSource)
        return imgSource
    }

    let imgSource = getPlatformURI(imagePath);

    return (
        <>
            <TouchableWithoutFeedback>
                <ScrollView style={styles.header}>
                    <View style={styles.imgContainer}>
                        <View style={styles.eightyWidthStyle} >
                            <TouchableOpacity onPress={chooseFile}>
                                <Image style={styles.uploadImage} source={imgSource} />
                            </TouchableOpacity>
                            <View style={{ marginTop: 30, borderRadius: 15 }}>
                                <Button title={'Upload Image'} onPress={() => uploadImageToStorage(localPath, localName)} />
                            </View>
                            {isLoading && <ActivityIndicator color="red" size="large" style={styles.loadingIndicator} />}
                            <Text style={styles.boldTextStyle}>{status}</Text>
                        </View>
                    </View>
                    <View style={{
                        height: 1,
                        backgroundColor: "#CED0CE",
                        marginHorizontal: "10%",
                        marginBottom: 15
                    }} />
                    <View style={styles.formik}>
                        <Formik
                            enableReinitialize={true}
                            initialValues={{
                                name: current_name,
                                phone: current_Phone,
                                email: current_Email,
                                address: current_Address,
                            }}
                            onSubmit={async (values) => {
                                const tokenID = await AsyncStorage.getItem('idtoken');
                                console.log(urlFireBase)
                                await fetch(`https://managewarehouse.herokuapp.com/users/${idUser}`, {
                                    method: 'PATCH',
                                    headers: {
                                        accept: 'application/json',
                                        Authorization: `Bearer ${tokenID}`,
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        name: values.name,
                                        phone: values.phone,
                                        email: values.email,
                                        address: values.address,
                                        image: urlFireBase
                                    })
                                }).then((res) => res.json())
                                    .then(resJson => {
                                        if (resJson.status === 200) {
                                            Alert.alert(
                                                'Notification',
                                                'Update successfully',
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
                                                'Cannot update your profile',
                                                [
                                                    {
                                                        text: 'cancel',
                                                        style: 'cancel',
                                                    },
                                                ],
                                            );
                                        }
                                    })
                            }}
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
                                            <Appbutton title="UPDATE" onPress={handleSubmit} />
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
        height:'100%',
        //flex: 1,
        //alignItems: 'center',
        //height: 800,
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.6)'
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
        height: 700,
        //backgroundColor: '#fff',
        //marginHorizontal: 60,
        borderTopWidth: 0,

    },
    imgContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 300,

    },
    eightyWidthStyle: {
        width: 200,
        marginTop: 10,
    },
    uploadImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        alignSelf: 'center',
    },
    loadingIndicator: {
        zIndex: 5,
        width: 50,
        height: 50,
        alignSelf: 'center'
    },
    boldTextStyle: {
        fontWeight: '600',
        fontSize: 13,
        color: 'black',
        fontFamily: 'Roboto-Light',
        textAlign: 'center',
    }
});

export default Updateuser;




