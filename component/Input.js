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

const Input = ({
  stock,
  name,
  onPress,
  idwarehouse,
  add_stock,
  pop_stock_imp,
  pop_stock_exp,
}) => {
  const [text, setText] = useState('');
  const [imp, setImp] = useState(false);
  const [exp, setExp] = useState(false);

  return (
    <>
      <View style={styles.card}>
        <TouchableOpacity onPress={onPress}>
          <Image
            style={styles.tinyLogo}
            source={require('../assets/images/fish.jpg')}
          />
        </TouchableOpacity>
        <View style={styles.rest}>
          <View style={styles.information}>
            <Text numberOfLines={2} style={styles.text}>
              {name}
            </Text>
            <Text style={styles.text}>{stock}</Text>
          </View>
          <View style={styles.iconcontainer}>
            <View style={styles.buttonform}>
              <Button
                color="#FF3333"
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
              <Button
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
                color="#FF3333"
                disabled={imp}
              />
              <Button
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
                color="#FF3333"
                disabled={exp}
              />
            </View>
          </View>
          <View style={styles.forminput}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(txt) => setText(txt)}
              value={text}
            />
          </View>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  forminput: {
    alignSelf: 'center',

    marginTop: 15,
    height: 50,
    width: 70,
    borderColor: 'black',
  },
  input: {
    height: 50,
    width: 70,
    backgroundColor: '#F5F5F5',
  },
  information: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    height: 75,
  },
  rest: {
    marginLeft: 10,
  },
  card: {
    flexDirection: 'row',
    height: 180,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,

    marginBottom: 10,
    elevation: 25,
    overflow: 'hidden',
  },
  iconcontainer: {
    flexDirection: 'column',
  },
  buttonform: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 230,
  },
  tinyLogo: {
    height: 180,
    width: 150,
    borderWidth: 1,
  },
  text: {
    fontSize: 13,
    fontFamily: 'Roboto-BoldItalic',
  },
});

export default Input;
