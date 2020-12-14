import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
  Button,
} from 'react-native';
import Buttonaction from '../component/Buttonaction';
const Input = ({
  stock,
  name,
  onPress,
  idwarehouse,
  add_stock,
  pop_stock_imp,
  pop_stock_exp,
  imageURL
}) => {
  const [text, setText] = useState('');
  const [imp, setImp] = useState(false);
  const [exp, setExp] = useState(false);

  return (
    <>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={onPress}>
            <Image
              style={styles.tinyLogo}
              source={{
                uri: imageURL,
              }}
            />
          </TouchableOpacity>
          <View style={styles.rest}>
            <View style={styles.information}>
              <View style={{  alignItems: 'flex-start', justifyContent: 'flex-start',width:240, }}>
                <Text numberOfLines={2} style={styles.text}>
                  {name}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontFamily: 'Roboto-Italic', fontSize: 18,color:'#7b7d6f' }}>Quantity:</Text>
                <Text style={{fontSize:18}}> {stock}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'column', marginBottom: 15 }}>
              <View style={{ justifyContent: 'center' }}>
                <Text style={{  fontFamily: 'Roboto-Italic', fontSize:18, color:'#7b7d6f' }}>Import/Export</Text>
              </View>
              <View style={styles.forminput}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={(txt) => setText(txt)}
                  value={text}
                  placeholder="Ex: 100"
                  
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.iconcontainer}>
          <View style={styles.buttonform}>
            <View style={styles.stylebutton}>
              <Buttonaction
                title="CLEAR"
                onPress={() => {
                  if (imp) {
                    setImp(false);
                    pop_stock_imp(name, text);
                  } else if (exp) {
                    setExp(false);
                    pop_stock_exp(name, text);
                  }
                  setText('');
                }}
              />
            </View>
            <View style={styles.stylebutton}>
              <Buttonaction
                onPress={() => {
                  if (exp) {
                    Alert.alert(
                      'WARNING!!!!',
                      'You are EXPORTING',
                      [
                        {
                          text: 'cancel',
                          style: 'cancel',
                        },
                      ],
                    );
                  } else if (text == '') {
                    Alert.alert(
                      'Notification',
                      'this box cannot be left blank',
                      [
                        {
                          text: 'cancel',
                          style: 'cancel',
                        },
                      ],
                    );
                  } else if (text != '') {
                    add_stock({
                      name: name,
                      stock: Number(text),
                      warehouseId: idwarehouse,
                      actionType: 'IMPORT',
                    });
                    setImp(true);
                  }
                }}
                title="IMPORT"
                disabled={imp}
              />
            </View>
            <View style={styles.stylebutton}>
              <Buttonaction
                onPress={() => {
                  if (imp) {
                    Alert.alert(
                      'WARNING!!!!',
                      'You are IMPORTING',
                      [
                        {
                          text: 'cancel',
                          style: 'cancel',
                        },
                      ],
                    );
                  } else if (text == '') {
                    Alert.alert(
                      'Notification',
                      'this box cannot be left blank',
                      [
                        {
                          text: 'cancel',
                          style: 'cancel',
                        },
                      ],
                    );
                  } else if (text != '') {
                    if (Number(text) > stock) {
                      Alert.alert(
                        'Notification',
                        'Number in text must be smaller the stock',
                        [
                          {
                            text: 'cancel',
                            style: 'cancel',
                          },
                        ],
                      );
                    } else {
                      add_stock({
                        name: name,
                        stock: Number(text),
                        warehouseId: idwarehouse,
                        actionType: 'EXPORT',
                      });
                      setExp(true);
                    }
                  }

                }}
                title="EXPORT"
                disabled={exp}
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  forminput: {
    //alignSelf: 'center',
    //marginBottom: 15,
    //marginLeft: 5,
    height: 45,
    width: 235,
    //borderColor: '#f2efe6',
    //borderWidth: 1,
    borderRadius: 10,
    //paddingTop:10
  },
  input: {
    height: 41,
    width: 231,
    backgroundColor: '#f2efe6',
    borderRadius: 10,
    //borderWidth:1,
    fontFamily: 'Roboto-Black',
    fontSize: 15,
  },
  information: {
    width: '70%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    //marginLeft: 5,
    height: 75,

  },
  rest: {
    //marginLeft: 10,
    //marginTop:15,
    marginLeft: 5,
    //borderWidth: 1,
    height: 160,
  },
  card: {
    //flexDirection: 'row',
    height: 200,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    //borderWidth:1,
    marginBottom: 10,
    elevation: 25,
    width: 405
    //overflow: 'hidden',
  },
  iconcontainer: {
    //flexDirection: 'column',
    width: 396,
    //borderWidth: 1,
    //marginTop: 5,
    marginHorizontal: 4
  },
  buttonform: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  tinyLogo: {
    marginTop: 5,
    height: 150,
    width: 150,
    borderRadius: 10,
    borderColor: '#3f51b5',
    marginLeft: 5
  },
  text: {
    fontSize: 21,
    fontFamily: 'Roboto-Medium',
  },
  stylebutton: {
    //borderWidth:1,
    width: 130,
    //borderWidth:1,
    //borderRadius:10
  }
});

export default Input;
