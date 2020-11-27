import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Button,
  Text
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import Formfield from '../component/Formfield';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faMale } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';
import Appbutton from '../component/Appbutton';
import ErrorMessage from '../component/ErrorMessage';
import Backarrow from '../component/Backarrow';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-picker';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('name'),
  phone: Yup.string().required().label('phone'),
  email: Yup.string().required().email().label('email'),
  password: Yup.string().required().min(4).label('password'),
  address: Yup.string().required().label('address'),
});
const SignupScreen = ({ navigation }) => {

  const [urlFireBase, setUrlFireBase] = useState('https://png.pngtree.com/png-vector/20190805/ourlarge/pngtree-account-avatar-user-abstract-circle-background-flat-color-icon-png-image_1650938.jpg?fbclid=IwAR3BJsofo4b8wlXNLf_w2cwj6PFTpyA6cTeLbfkYsgOijz7sD2QhlsDQ7-k');
  const [isUpload, setIsUpload] = useState(false);

  const [imagePath, setImagePath] = useState('https://png.pngtree.com/png-vector/20190805/ourlarge/pngtree-account-avatar-user-abstract-circle-background-flat-color-icon-png-image_1650938.jpg?fbclid=IwAR3BJsofo4b8wlXNLf_w2cwj6PFTpyA6cTeLbfkYsgOijz7sD2QhlsDQ7-k');
  const [localName, setLocalName] = useState('');
  const [localPath, setLocalPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
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
              initialValues={{
                name: '',
                phone: '',
                email: '',
                password: '',
                address: '',
              }}
              onSubmit={async (values) => {
                await fetch('https://managewarehouse.herokuapp.com/users', {
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
                    image: urlFireBase
                  }),
                })
                  .then((response) => response.json())
                  .then((responseJson) => {
                    if (responseJson.message) {
                      Alert.alert(
                        'Notification',
                        responseJson.message,
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
                        'Your account was created successfully',
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
                    <View style={{ marginHorizontal: 35 }}>
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
    width: '100%',
    backgroundColor: '#fff'
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
    flex: 1,
    paddingTop: 45,
    //width: 380,
    height: '100%',
    backgroundColor: '#fff',
    //marginHorizontal: 60,
    borderTopWidth: 0,
    borderWidth: 1,
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

export default SignupScreen;
