import React from 'react';
import {View,Text,StyleSheet, TouchableOpacity,Pressable,TouchableWithoutFeedback} from 'react-native';

const Buttonaction = ({title, onPress,disabled}) => {
    return (
        <TouchableWithoutFeedback onPress={onPress} disabled={disabled}>
            <View style={styles.container}>
                <Text style={{color:'white'}}>{title}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

};

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#303e5c',
        height:30,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        width:130
    }
});

export default Buttonaction;