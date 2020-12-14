import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, FlatList } from 'react-native';
import Moment from 'moment';

import AsyncStorage from '@react-native-community/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArchive, faBookMedical, faClock, faPlus, faWarehouse } from '@fortawesome/free-solid-svg-icons';
const Userhistory = ({ navigation }) => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const token = await AsyncStorage.getItem('idtoken');
        const iduser = await AsyncStorage.getItem('id_USER');
        await fetch(`https://managewarehouse.herokuapp.com/histories/users/${iduser}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then((res) => res.json())
            .then((resJson) => {
                setData(resJson.data.histories);
            })
    };


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            //console.log(1)
            fetchData();
        });
        return unsubscribe
    }, [navigation])

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                numColumns={1}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const dt = Moment.utc(item.date).format(" MM-DD-YYYY, hh:mm:ss ");
                    return (
                        <View style={styles.card}>
                            <View style={styles.image}>
                                <Image
                                    style={styles.tinyLogo}
                                    source={{ uri: item.products[0] ? item.products[0].image : "null" }}
                                />
                            </View>
                            <View style={styles.info}>
                                <View style={styles.formtext}>
                                    <FontAwesomeIcon style={styles.icon} icon={faArchive} color="#303e5c" size={15} />
                                    <Text style={styles.text1}>{item.products[0] ? item.products[0].name : "null"}</Text>
                                </View>
                                <View style={styles.formtext}>
                                    <FontAwesomeIcon style={styles.icon} icon={faWarehouse} color="#303e5c" size={15} />
                                    <Text style={styles.text}>{item.warehouse.name}</Text>
                                </View>
                                <View style={styles.formtext}>
                                    <FontAwesomeIcon style={styles.icon} icon={faBookMedical} color="#303e5c" size={15} />
                                    <Text style={styles.text}>{item.note}</Text>
                                </View>
                                <View style={styles.formtext}>
                                    <FontAwesomeIcon style={styles.icon} icon={faClock} color="#303e5c" size={15} />
                                    <Text style={styles.text}>{dt}</Text>
                                </View>
                            </View>
                        </View>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 15,
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        height: 140,
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 15,
        elevation: 25,
        backgroundColor: '#fff'
    },
    image: {
        flex: 1,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    info: {
        flex: 2,
        justifyContent: 'flex-start',
        paddingLeft: 5
    },
    tinyLogo: {
        width: '100%',
        height: '100%',
        borderRadius: 20
    },
    text: {
        fontFamily: 'Roboto-Light',
        fontSize: 18
    },
    text1: {
        fontFamily: 'Roboto-Bold',
        fontSize: 21
    },
    formtext: {
        flex: 1,
        flexDirection: 'row',
    },
    icon: {
        marginTop: 8,
        marginRight: 5
    }
});

export default Userhistory;