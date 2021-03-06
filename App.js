
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
import { faBars, faClipboardList, faEllipsisH, faEllipsisV, faSignOutAlt, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import Appbutton from './component/Appbutton';
import jwt_decode from "jwt-decode";
import Updateuser from './screens/Updateuser';
import { faIdBadge } from '@fortawesome/free-regular-svg-icons';
import Backarrow from './component/Backarrow';
import Userhistory from './screens/Userhistory';
import WhouseHistory from './screens/WhouseHistory';
import { MenuProvider } from 'react-native-popup-menu';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent({ ...props }) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label={() => <Text style={{ color: 'black', textAlign: 'center', fontSize: 20 }}>Option</Text>}
        style={{
          height: '20%',
          justifyContent: 'center',
          borderBottomWidth: 1,
          borderBottomColor: 'black'
        }}
      />
      <DrawerItemList {...props} />
      <DrawerItem
        icon={() => <FontAwesomeIcon
          style={styles.icondrawer}
          icon={faSignOutAlt}
          size={25}
        />}
        label="Sign out"
        onPress={() =>
          Alert.alert('Notice!!!', 'You want to sign out?', [
            {
              text: 'Yes',
              onPress: async () => {
                await AsyncStorage.removeItem('idtoken');
                props.navigation.push('Login');
              },
            },
            { text: 'No', style: 'cancel' },
          ])
        }
      />
    </DrawerContentScrollView>
  );
}

const Icondrop = () => {
  return (
    <FontAwesomeIcon
      style={styles.icondetail}
      icon={faEllipsisV}
      size={25}
    />
  );
};


const MainRoutes = ({ navigation }) => {





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
        `https://managewarehouse.herokuapp.com/users/search/${handledQuery}`,
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
          setUser(resJson.data.data.users);
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
                            'https://managewarehouse.herokuapp.com/warehouses/user',
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
            title: 'WAREHOUSES',
            headerTitleStyle: {
              alignSelf: 'center',
              marginRight: 30,
              color: '#fff',
              fontSize:25,
              fontFamily:'OleoScript-Regular',
            },
            headerStyle: {
              backgroundColor: '#2b2c2e'
            }
          })}
        />
        <Stack.Screen
          name="Detail"
          component={Detailscreen}
          options={({ navigation }) => ({
            headerRight: () => {
              return adduser ?
                (
                  <View>
                    <Menu>
                      <MenuTrigger children={<Icondrop />}
                      />
                      <MenuOptions>
                        <MenuOption onSelect={() => navigation.navigate('History')}>
                          <Text style={{ color: '#2b2c2e', paddingBottom: 10, paddingTop: 10, textTransform: 'uppercase', fontWeight: 'bold' }}>history warehouse </Text>
                        </MenuOption>
                        <MenuOption onSelect={() => setShowModal(true)} >
                          <Text style={{ color: '#2b2c2e', paddingBottom: 10, paddingTop: 10, textTransform: 'uppercase', fontWeight: 'bold' }}>add user</Text>
                        </MenuOption>
                      </MenuOptions>
                    </Menu>
                  </View>
                )
                : null
            },
            headerLeft: () => {
              return (
                <Backarrow onPress={() => navigation.popToTop()} Color="#fff" />
              );
            },
            headerLeftContainerStyle: {
              marginLeft: 10,
            },
            title: 'DETAILS',
            headerTitleStyle: {
              alignSelf: 'center',
              marginRight: 15,
              color: '#fff',
              fontFamily:'OleoScript-Regular',
              fontSize:25
            },
            headerStyle: {
              backgroundColor: '#2b2c2e'
            },

          })}
        />
        <Stack.Screen
          name="History"
          component={WhouseHistory}
          options={({navigation}) => ({
            title: 'HISTORY WAREHOUSE',
            headerTitleStyle:{
              alignSelf: 'center',
              marginRight: 15,
              color: '#fff',
              fontFamily:'OleoScript-Regular',
              fontSize:25
            },
            headerLeft: () => {
              return (
                <Backarrow onPress={() => navigation.goBack()} Color="#fff" />
              );
            },
            headerLeftContainerStyle: {
              marginLeft: 10,
            },
            headerStyle:{
              backgroundColor: '#2b2c2e',
            },
            headerTintColor:'white'
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
          title: 'PROFILE',

          headerStyle: {
            backgroundColor: '#2b2c2e'
          },
          headerTitleStyle: {
            alignSelf: 'center',
            marginRight: 50,
            color: '#fff',
            fontFamily:'OleoScript-Regular',
            fontSize:25
          },
        })}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

const UserHistory = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="History" component={Userhistory}
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
          title: 'USER HISTORY',

          headerStyle: {
            backgroundColor: '#2b2c2e'
          },
          headerTitleStyle: {
            alignSelf: 'center',
            marginRight: 50,
            color: '#fff',
            fontFamily:'OleoScript-Regular',
            fontSize:25
          },
        })}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

const DrawerRoutes = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Main" component={MainRoutes} options={{
        drawerIcon: () => <FontAwesomeIcon style={styles.icondrawer} icon={faWarehouse} size={25} />
      }} />
      <Drawer.Screen name="Profile" component={UpdateRoutes} options={{
        drawerIcon: () => <FontAwesomeIcon style={styles.icondrawer} icon={faIdBadge} size={25} />
      }} />
      <Drawer.Screen name="History" component={UserHistory} options={{
        drawerIcon: () => <FontAwesomeIcon style={styles.icondrawer} icon={faClipboardList} size={25} />
      }} />
    </Drawer.Navigator>
  );
};

const App = () => {

  return (
    <>
      <MenuProvider>
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
      </MenuProvider>
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    color: '#fff',
    marginLeft: 15
  },
  icondetail: {
    color: '#fff',
    marginRight: 25
  },
  icondrawer: {
    color: '#303e5c'
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
