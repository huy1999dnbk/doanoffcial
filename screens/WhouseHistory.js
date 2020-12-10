import AsyncStorage from '@react-native-community/async-storage';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';


const WhouseHistory = () => {
    const [dataHistory, setData] = useState([]);

    const fetchData = async () => {
        const token = await AsyncStorage.getItem('idtoken');
        const idwarehouse = await AsyncStorage.getItem('id_warehouse');
        console.log(token);
        console.log(idwarehouse);
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
                console.log(dataHistory);
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
                    return (
                        <View style={styles.card}>
                            <View style={styles.image}>
                                <Image style={styles.tinyLogo} source={{
                                    uri: item.products[0] ? item.products[0].image : "null"
                                }} />
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.text}>{item.products[0] ? item.products[0].name : "null"}</Text>
                                <Text style={styles.text}>{item.date}</Text>
                                <Text style={styles.text}>{item.users[0] ? item.users[0].name : "null"}</Text>
                                <Text style={styles.text}>{item.note}</Text>
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
        backgroundColor:'#fff',
    },
    card: {
        flex: 1,
        height: 180,
        flexDirection:'row',
        marginBottom:20,
        marginHorizontal:10,
        borderWidth:2,
        borderRadius:10,
        borderColor:'#0d023d'
    },
    image:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    info:{
        flex:2,
        justifyContent:'center',
        alignItems:'flex-start',
        paddingLeft:20
    },
    text: {
        color:'#1f1f3d',
        fontFamily:'Roboto-Bold',
        fontSize:14,
        textTransform:'uppercase',
        
    },
    tinyLogo:{
        width:120,
        height:120,
        borderRadius:60,
        borderColor:'black',
        borderWidth:1
    }
});

export default WhouseHistory;