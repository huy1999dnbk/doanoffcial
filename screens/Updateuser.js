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
import { useIsFocused } from '@react-navigation/native';
import * as Yup from 'yup';


const validationSchema = Yup.object().shape({
    name: Yup.string().required().label('name'),
    phone: Yup.string().required().label('phone'),
    email: Yup.string().required().email().label('email'),
    address: Yup.string().required().label('address'),
});


const Updateuser = ({ navigation }) => {


    const [current_name, setCurrent_Name] = useState('');
    const [current_Phone, setCurrent_Phone] = useState('');
    const [current_Email, setCurrent_Email] = useState('');
    const [current_Address, setCurrent_Address] = useState('');
    const [idUser, setIdUser] = useState(0);
    const [urlFireBase, setUrlFireBase] = useState('');
    //const [isUpload, setIsUpload] = useState(false);
    //const [imaURL,setImaURL] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [localName, setLocalName] = useState('');
    const [localPath, setLocalPath] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadSuccess, setIsUploadSuccess] = useState(false);
    const [imgSource,setImgSource] = useState({})

    //const isFocus = useIsFocused();

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
                setImgSource(getPlatformURI(resJson.data.image,false));
            })
    };
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            // The screen is focused
            // Call any action
            //console.log(1)
            loadProfile();
            setImgSource(getPlatformURI(imagePath,false));
        });
        return unsubscribe
    }, [navigation])

    useEffect(() => {
        loadProfile();
    },[])

    const chooseFile = () => {
     
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
                //setIsUpload(true);
                let path = getPlatformPath(response).value;
                //console.log('path la: ', path);
                let fileName = getFileName(response.fileName, path);
                setParam(fileName, path);
                setImagePath(path);
                setImgSource(getPlatformURI(path,true));
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

    // const setAsyncTimeout = (cb, timeout = 0) => new Promise(resolve => {
    //     setTimeout(() => {
    //         cb();
    //         resolve();
    //     }, timeout);
    // });
    const uploadImageToStorage = async (path, name) => {
        try {
            if (isUploadSuccess) {
                setIsLoading(true);
                let reference = storage().ref(name);
                let task = await reference.putFile(path);
         
                setIsLoading(false);

                const ref = storage().ref(name);
                const url = await ref.getDownloadURL();
                return url;
            }
            else return urlFireBase
        } catch (e) {
      
            setIsLoading(false);
     
        };

    }




    const getPlatformPath = ({ path, uri }) => {
        return Platform.select({
            android: { "value": path },
            ios: { "value": uri }
        })
    }


    const getPlatformURI = (imagePath,isUpload) => {
        let imgSource = null;
        if (isNaN(imagePath)) {
            if (!isUpload) {
                imgSource = { uri: imagePath };

            } else {
                imgSource = { uri: imagePath };
                if (Platform.OS == 'android') {
                    imgSource.uri = "file:///" + imgSource.uri;

                }
            }
        }
        //console.log(imgSource)
        return imgSource
    }

    //const imgSource = getPlatformURI(imagePath);


    return (
        <>
            <TouchableWithoutFeedback>
                <ScrollView style={styles.header}>
                    <View style={styles.imgContainer}>
                        <View style={styles.eightyWidthStyle} >
                            <TouchableOpacity onPress={chooseFile}>
                                <Image style={styles.uploadImage} source={imgSource} />
                            </TouchableOpacity>
                      
                            {isLoading && <ActivityIndicator color="red" size="large" style={styles.loadingIndicator} />}
                      
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
                                const link = await uploadImageToStorage(localPath, localName);
                                return Promise.resolve(link)
                                    .then(async (link) => {
                                        // console.log('url anh tren firebase', result);
                                        // const url1 = result;
                                        //console.log(urlFireBase)
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
                                                image: link
                                            })
                                        }).then((res) => res.json())
                                            .then(resJson => {
                                                if (resJson.status === 200) {
                                                    Alert.alert(
                                                        'Notification',
                                                        'Update successfully',
                                                        [
                                                            {
                                                                text: 'OK',
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
                                    }
                                    )
                            }}
                            validationSchema={validationSchema}>
                            {({
                                handleChange,
                                handleSubmit,
                                errors,
                                setFieldTouched,
                                touched,
                                values,

                            }) => (
                                    <>

                                        <FormUpdate
                                            placeholder="Name"
                                            secureTextEntry={false}
                                            icons={faMale}
                                            onChangeText={handleChange('name')}
                                            onBlur={() => setCurrent_Name(values.name)}
                                            value={values.name}
                                            editable={true}
                                        />
                                        <ErrorMessage error={errors.name} visible={touched.name} />
                                        <FormUpdate
                                            placeholder="Phone"
                                            secureTextEntry={false}
                                            icons={faPhone}
                                            onChangeText={handleChange('phone')}
                                            onBlur={() => setCurrent_Phone(values.phone)}
                                            value={values.phone}
                                            editable={true}
                                        />
                                        <ErrorMessage error={errors.phone} visible={touched.phone} />
                                        <FormUpdate
                                            placeholder="Email"
                                            secureTextEntry={false}
                                            icons={faUser}
                                            onChangeText={handleChange('email')}
                                            onBlur={() => setFieldTouched('email')}
                                            value={values.email}
                                            editable={false}
                                        />
                                        <ErrorMessage error={errors.email} visible={touched.email} />
                                        <FormUpdate
                                            placeholder="Address"
                                            secureTextEntry={false}
                                            icons={faMapMarker}
                                            onChangeText={handleChange('address')}
                                            onBlur={() => setCurrent_Address(values.address)}
                                            value={values.address}
                                            editable={true}
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
        height: '100%',
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
        width: 200,
        height: 200,
        borderRadius: 100,
        alignSelf: 'center',
        borderWidth:2,
        borderColor:'black'
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




