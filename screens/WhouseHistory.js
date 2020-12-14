import AsyncStorage from '@react-native-community/async-storage';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';
import Moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArchive, faBookMedical, faClock, faPlus, faUserTie, faWarehouse } from '@fortawesome/free-solid-svg-icons';
const WhouseHistory = () => {
    const [dataHistory, setData] = useState([]);

    const fetchData = async () => {
        const token = await AsyncStorage.getItem('idtoken');
        const idwarehouse = await AsyncStorage.getItem('id_warehouse');
        await fetch(`https://managewarehouse.herokuapp.com/histories/warehouses/${idwarehouse}`, {
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
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
                data={dataHistory}
                numColumns={1}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const dt = Moment.utc(item.date).format(" MM-DD-YYYY, hh:mm:ss ");
                    return (
                        <View style={styles.card}>
                            <View style={styles.image}>
                                <Image style={styles.tinyLogo} source={{
                                    uri: item.products[0] ? item.products[0].image : "null"
                                }} />
                            </View>
                            <View style={styles.info}>
                                <View style={styles.formtext}>
                                    <FontAwesomeIcon style={styles.icon} icon={faArchive} color="#303e5c" size={15} />
                                    <Text style={styles.text1}>{item.products[0] ? item.products[0].name : "null"}</Text>
                                </View>
                                <View style={styles.formtext}>
                                    <FontAwesomeIcon style={styles.icon} icon={faUserTie} color="#303e5c" size={15} />
                                    <Text style={styles.text}>{item.users[0] ? item.users[0].name : "null"}</Text>
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
        backgroundColor: 'white',
        marginTop: 10
    },
    card: {
        flex: 1,
        height: 180,
        flexDirection: 'row',
        marginBottom: 20,
        marginHorizontal: 10,
      
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 5
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        flex: 2,
        justifyContent: 'flex-start',
        //alignItems: 'flex-start',
        paddingLeft: 20
    },
    text: {
        color: '#1f1f3d',
        fontFamily: 'Roboto-Light',
        fontSize: 18,
        textTransform: 'uppercase',

    },
    tinyLogo: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    formtext: {
        flex: 1,
        flexDirection: 'row',
    },
    text1: {
        fontFamily: 'Roboto-Bold',
        fontSize: 21
    },
    icon: {
        marginTop: 8,
        marginRight: 5
    }
});

export default WhouseHistory;