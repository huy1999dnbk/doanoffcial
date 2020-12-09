import AsyncStorage from '@react-native-community/async-storage';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';


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
                            <Text style={styles.text}>{item.products[0] ? item.products[0].name : "null" }</Text>
                            <Text style={styles.text}>{item.date}</Text>
                            <Text style={styles.text}>{item.users[0] ? item.users[0].name : "null"}</Text>
                            <Text style={styles.text}>{item.note}</Text>
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
    },
    card: {
        flex: 1,
        height: 200,
        borderWidth: 2,
        borderColor: 'black'
    },
    text: {
        color: 'black'
    }
});

export default WhouseHistory;