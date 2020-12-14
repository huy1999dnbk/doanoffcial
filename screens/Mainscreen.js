import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  Animated,
  Button
} from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPrescriptionBottle } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faIndustry } from '@fortawesome/free-solid-svg-icons';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-community/async-storage';
import Swiper from 'react-native-swiper'

const Mainscreen = ({ navigation }) => {
  const [warehouse, setWarehouse] = useState([]);
  const [pageLimit, setPageLimit] = useState(1);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;



  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [pageCurrent]);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem('idtoken');

    await fetch(
      'https://managewarehouse.herokuapp.com/warehouses/user?limit=3&page=' + pageCurrent,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setWarehouse(warehouse.concat(responseJson.data.warehouses.warehouses));
        setIsLoading(false);
        setPageLimit(responseJson.data.pageCount);
      });
  };

  renderItem = ({ item }) => {
    return (
      <Swiper showsButtons={false} style={{ height: 250, marginBottom: 10, }} showsPagination={false}>
        <Pressable
          onPress={() => {

            navigation.navigate('Detail', {
              idwarehouse: item.id,
            });
          }}>
          <View style={styles.card}>
            <Image
              style={styles.tinyLogo}
              source={{
                uri: item.image,
              }}
            />
            <View style={{ marginTop: 7, }}>
              <View style={styles.info}>
                <FontAwesomeIcon
                  style={styles.icon}
                  icon={faIndustry}
                  size={18}
                />
                <Text numberOfLines={3} style={styles.text}>
                  {item.name}
                </Text>
              </View>
              <View style={styles.info}>
                <FontAwesomeIcon
                  style={styles.icon}
                  icon={faMapMarkerAlt}
                  size={18}
                />
                <Text numberOfLines={3} style={styles.text}>
                  {item.address}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
        <Pressable onPress={() => {
          navigation.navigate('Detail', {
            idwarehouse: item.id,
          });
        }}>
          <View style={styles.card}>
            <FontAwesomeIcon
              style={styles.icon}
              icon={faClipboard}
              size={18}
            />
            <Text style={styles.text}>Description: {item.description}</Text>
          </View>
        </Pressable>
      </Swiper>
    );
  };

  // <View style={styles.info}>
  //   <FontAwesomeIcon
  //     style={styles.icon}
  //     icon={faPrescriptionBottle}
  //     size={25}
  //   />
  //   <Text numberOfLines={3} style={styles.text}>
  //     {item.description}
  //   </Text>
  // </View>

  handleFooter = () => {
    return isLoading ? (
      <View style={styles.loader}>
        <ActivityIndicator size="small" color="red" />
      </View>
    ) : null;
  };

  handleLoadMore = () => {
    if (pageCurrent < pageLimit) {
      setPageCurrent(pageCurrent + 1);
      setIsLoading(true);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={warehouse}
          numColumns={1}
          keyExtractor={(item) => item.id.toString()}
          initialNumToRender={20}
          renderItem={renderItem}
          onScroll={Animated.timing(scrollY, {
            toValue: 0,
            isInteraction: false,
            useNativeDriver: true
          }).start()}
          getItemLayout={(data, index) => (
            { length: 100, offset: 100 * index, index }
          )}
          ListFooterComponent={handleFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    marginTop: 10
  },
  card: {
    //flexDirection: 'row',
    height: 250,
    backgroundColor: '#303e5c',
    //alignItems: 'flex-start',
    marginBottom: 10,
    //elevation: 10,
    borderRadius: 10,
    //borderWidth:1
  },
  tinyLogo: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    height: 180,
    //borderWidth:1
  },
  icon: {
    color: '#fff',
  },
  text: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    marginLeft: 15,
    color: '#fff'
  },
  info: {
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 20,
  },
  loader: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default Mainscreen;
