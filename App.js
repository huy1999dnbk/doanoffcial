
import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Alert, TouchableOpacity, Modal, Text, View, TextInput, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Loginscreen from './screens/Loginscreen';
import Mainscreen from './screens/Mainscreen';
import Signupscreen from './screens/Signupscreen';
import Detailscreen from './screens/Detailscreen';
import { token } from './screens/Loginscreen';
import AsyncStorage from '@react-native-community/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import Appbutton from './component/Appbutton';
import jwt_decode from "jwt-decode";
import Updateuser from './screens/Updateuser';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent({ ...props }) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sign out"
        onPress={() =>
          Alert.alert('Notice!!!', 'You want to sign out?', [
            {
              text: 'Yes',
              onPress: async () => {
                await AsyncStorage.removeItem('idtoken');
                props.navigation.navigate('Login');
              },
            },
            { text: 'No', style: 'cancel' },
          ])
        }
      />
    </DrawerContentScrollView>
  );
}




const MainRoutes = () => {
  const [adduser, setAddUser] = useState(false);
  const [query, setQuery] = useState('');
  const [user, setUser] = useState([]);
  const checkToken = async () => {
    const tokenuser = await AsyncStorage.getItem('idtoken');
    var decoded = jwt_decode(tokenuser);
    var ID_USER = decoded.id;
    await AsyncStorage.setItem('id_USER', ID_USER.toString());
    if (decoded.permissionIds[0].permission == 'CHIEF_EMPLOYEE') {
      setAddUser(true);
    }
  };
  checkToken();
  const ADD_USER = () => {
    return (
      <TouchableOpacity onPress={() => setShowModal(true)}>
        <FontAwesomeIcon
          style={styles.icondetail}
          icon={faUserPlus}
          size={25}
        />
      </TouchableOpacity>
    )
  };
  const [showModal, setShowModal] = useState(false);




  const fetchUser = async () => {
    const tokenID = await AsyncStorage.getItem('idtoken');
    if (query === '') return;
    else if (query !== '') {
      var handledQuery = query.replace(/ /g, '%20');
      //cho nay can them API
      await fetch(
        `https://cnpmwarehouse.herokuapp.com/Users/search/${handledQuery}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${tokenID}`,
          },
        },
      )
        .then((res) => res.json())
        .then((resJson) => {
          setUser(resJson.data.users);
        });
    }
  };

  useEffect(() => {
    fetchUser();
  }, [query]);

  const updateQuery = (input) => {
    setQuery(input);
  };

  return (
    <>
      <Modal visible={showModal} transparent={true} animationType="none">
        <View style={styles.ViewCart}>
          <View style={{ marginHorizontal: 10, marginTop: 15 }}>
            <TextInput
              placeholder="Find user here"
              onChangeText={(query) => updateQuery(query)}
              value={query}
              style={styles.input}
            />
          </View>
          <View style={styles.listcart}>
            <FlatList
              data={user}
              numColumns={1}
              extraData={query}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity onPress={() => {
                    Alert.alert('Notice!!!', 'You want to add user?', [
                      {
                        text: 'Yes',
                        onPress: async () => {
                          const tokenId1 = await AsyncStorage.getItem('idtoken');
                          const idhouse = await AsyncStorage.getItem('id_warehouse');
                          //cho nay can them api 
                          await fetch(
                            'https://cnpmwarehouse.herokuapp.com/warehouses/user',
                            {
                              method: 'POST',
                              headers: {
                                accept: 'application/json',
                                Authorization: `Bearer ${tokenId1}`,
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                userId: item.id.toString(),
                                warehouseId: idhouse,
                              }),
                            })
                            .then((res) => res.json())
                            .then((resJson) => {
                              if (resJson.statusCode === 200) {
                                Alert.alert(
                                  'Notification',
                                  'The user has been successfully granted permission!',
                                  [
                                    {
                                      text: 'cancel',
                                      style: 'cancel',
                                    },
                                  ],
                                );
                              } else {
                                Alert.alert(
                                  'Error',
                                  'This user cannot be authorized',
                                  [
                                    {
                                      text: 'cancel',
                                      style: 'cancel',
                                    },
                                  ],
                                );
                              }
                            })
                          setQuery('');
                        },
                      },
                      { text: 'No', style: 'cancel' },
                    ])
                  }
                  }>
                    <View style={{ height: 60, flexDirection: 'row' }}>
                      <View style={{ alignSelf: 'center', marginRight: '7%' }}>
                        <FontAwesomeIcon
                          style={styles.icondetail}
                          icon={faUserSecret}
                          size={35}
                        />
                      </View>
                      <View>
                        <Text style={styles.text} >Name: {item.name}</Text>
                        <Text style={styles.text} >Phone: {item.phone}</Text>
                        <Text style={styles.text} >Email: {item.email}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => {
                return (
                  <View
                    style={{
                      height: 1,
                      width: '100%',
                      backgroundColor: 'black',
                      marginBottom: 20,
                      marginTop: 15
                    }}
                  />
                );
              }}
            />
          </View>
          <View>
            <Appbutton title="oke" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={Mainscreen}
          options={({ navigation }) => ({
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                  <FontAwesomeIcon
                    style={styles.icon}
                    icon={faBars}
                    size={30}
                  />
                </TouchableOpacity>
              );
            },
            title: 'Warehouse Management',
          })}
        />
        <Stack.Screen
          name="Detail"
          component={Detailscreen}
          options={() => ({
            headerRight: () => {
              return adduser ?
                (
                  <TouchableOpacity onPress={() => setShowModal(true)}>
                    <FontAwesomeIcon
                      style={styles.icondetail}
                      icon={faUserPlus}
                      size={25}
                    />
                  </TouchableOpacity>
                ) : null
            },
          })}
        />
      </Stack.Navigator>
    </>
  );
};



const UpdateRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Updateuser}
        options={({ navigation }) => ({
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <FontAwesomeIcon
                  style={styles.icon}
                  icon={faBars}
                  size={30}
                />
              </TouchableOpacity>
            );
          },
          title: 'Profile',
        })}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};


const DrawerRoutes = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Main" component={MainRoutes} />
      <Drawer.Screen name="Profile" component={UpdateRoutes} />
    </Drawer.Navigator>
  );
};

const App = () => {

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Loginscreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signupscreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Main"
            component={DrawerRoutes}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    color: '#FC4646',
    marginLeft: 15
  },
  icondetail: {
    color: '#FC4646',
    marginRight: 25
  },
  ViewCart: {
    alignSelf: 'center',
    marginTop: 200,
    width: 400,
    height: 500,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'black',
  },
  listcart: {
    height: 300,
    marginHorizontal: 15,
    marginTop: 25,
    marginBottom: 20
  },
  input: {
    fontFamily: 'Roboto-Thin',
    backgroundColor: '#E5E5E5',
    borderRadius: 15
  },
  text: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14
  },
});

export default App;
