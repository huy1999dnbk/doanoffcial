import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
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
    },[])

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                numColumns={1}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.card}>
                            <View style={styles.image}>
                                <Image
                                    style={styles.tinyLogo}
                                    source={{ uri: item.products[0] ? item.products[0].image : "null" }}
                                />
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.text}>{item.date}</Text>
                                <Text style={styles.text}>{item.note}</Text>
                                <Text style={styles.text}>{item.warehouse.name}</Text>
                                <Text style={styles.text}>{item.products[0] ? item.products[0].name : "null"}</Text>
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
        flexDirection: 'column',
        height: 500,
        borderColor: 'black',
        borderWidth: 2,
        marginHorizontal: 10,
        marginBottom: 20,
        borderRadius: 15
    },
    image: {
        flex: 5,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        flexWrap: 'wrap'
    },
    info: {
        flex: 2,
        justifyContent: 'center'
    },
    tinyLogo: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    text: {
        fontFamily: 'Roboto-Bold'
    }
});

export default Userhistory;