import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

const Searchproduct = ({ name, add_search, idwarehouse }) => {
    const [searchText, setSearchText] = useState('');
    return (
        <View style={styles.container}>
            <View style={styles.searchResult}>
                <Text numberOfLines={2} style={styles.text}>{name}</Text>
            </View>
            <View style={styles.forminput}>
                <TextInput style={styles.input} onChangeText={txt => setSearchText(txt)} value={searchText} onEndEditing={() => {
                    add_search({
                        name: name,
                        stock: Number(searchText),
                        warehouseId: idwarehouse,
                        actionType: 'IMPORT',
                    })
                }}
                    keyboardType="numeric"
                />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 70,
    },
    input: {
        height: 50,
        width: 70,
        backgroundColor: '#ECE4E4',
    },
    searchResult:{
        width:'70%',
        justifyContent:'center',
        alignItems:'flex-start',
    },
    text: {
        fontFamily:'Roboto-Medium',
        fontSize:14
    },
    forminput:{
        width: '30%',
        alignItems:'flex-end',
        justifyContent:'center',
    }
});

export default Searchproduct;