import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
  TouchableWithoutFeedback
} from 'react-native';
import Searchproduct from '../component/Searchproduct';
import AsyncStorage from '@react-native-community/async-storage';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faLuggageCart } from '@fortawesome/free-solid-svg-icons';
import Appbutton from '../component/Appbutton';
import Addproduct from '../component/Addproduct';
import Input from '../component/Input';
const Detailscreen = ({ route }) => {
  const [productByIdWh, setProductByIdWh] = useState([]);
  const [isShowModal, setShowModal] = useState(false);
  const [note, setNote] = useState('');
  const [createAt, setCreateAt] = useState('');
  const [page, setPage] = useState(1);
  const [Loading, setLoading] = useState(false);
  const { idwarehouse } = route.params;
  const [showAdd, setShowAdd] = useState(false);
  const [query, setQuery] = useState('');
  const [product, setProduct] = useState([]);
  const [pageLimit, setPageLimit] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [addStock, setAddStock] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [searchProduct, setSearchProduct] = useState([]);
  const [showCart, setShowCart] = useState(false)
  //const [cart, setCart] = useState([]);
  const takeid = async() => {
    await AsyncStorage.setItem('id_warehouse', idwarehouse.toString());
  }
  takeid();
  // ham nay noi 2 mang addstock va searchproduct
  const handleCart = () => {
    setAddStock(addStock.concat(searchProduct));
  }

  //xu ly neu co phan tu trung nhau sau khi da noi 2 mang xong
  const handlejoinarray = () => {
    setAddStock(loadCart(addStock));
  };

  //ham nay them search product vao mang
  const add_search = (x) => {
    if (searchProduct.length === 0) {
      setSearchProduct(searchProduct.concat(x));
    } else {
      setSearchProduct(searchProduct.filter(y => y.name !== x.name).concat(x).filter(z => z.stock > 0));
    }

  };
  //console.log(searchProduct);
  //them 1 object product vao mang de import va export, x la 1 object truyen vao 
  const add_stock = (x) => {
    if (addStock.length === 0) {
      setAddStock(addStock.concat(x));
    } else {
      setAddStock(loadStock(x));
    }
  };
  const loadStock = (k) => {
    var tmp = addStock.concat(k);
    for (var i = 0; i < tmp.length - 1; i++) {
      if (tmp[i].name == k.name) {
        if (k.actionType == 'IMPORT') {
          tmp[i].stock = tmp[i].stock + k.stock;
          tmp.splice(tmp.indexOf(k), 1);
        } else if (k.actionType == 'EXPORT') {
          if (k.stock < tmp[i].stock) {
            tmp[i].stock = tmp[i].stock - k.stock;
            tmp.splice(tmp.indexOf(k), 1);
          } else if (k.stock > tmp[i].stock) {
            tmp[i].actionType = 'EXPORT';
            tmp[i].stock = k.stock - tmp[i].stock;
            tmp.splice(tmp.indexOf(k), 1);
          } else if (k.stock == tmp[i].stock) {
            tmp.splice(tmp.indexOf(k), 1);
            tmp.splice(tmp.indexOf(tmp[i]), 1);
          }
        }
      }
    }
    return tmp;
  }
  const loadCart = (tmp) => {
    for (var i = 0; i < tmp.length - 1; i++) {
      for (var j = i + 1; j < tmp.length; j++) {
        if (tmp[i].name === tmp[j].name) {
          if (tmp[i].actionType == 'IMPORT') {
            tmp[i].stock = tmp[i].stock + tmp[j].stock;
            tmp.splice(tmp.indexOf(tmp[j]), 1);
          } else if (tmp[i].actionType == 'EXPORT') {
            if (tmp[i].stock > tmp[j].stock) {
              tmp[i].stock = tmp[i].stock - tmp[j].stock;
              tmp.splice(tmp.indexOf(tmp[j]), 1);
            } else if (tmp[i].stock < tmp[j].stock) {
              tmp[i].stock = tmp[j].stock - tmp[i].stock;
              tmp[i].actionType = 'IMPORT';
              tmp.splice(tmp.indexOf(tmp[j]), 1);
            } else if (tmp[i].stock == tmp[j].stock) {
              tmp.splice(tmp.indexOf(tmp[i]), 1);
              tmp.splice(tmp.indexOf(tmp[j]), 1);
            }
          }
        }
      }
    }
    return tmp;
  }
  //lay 1 object ra de lam button clear
  const pop_stock_imp = (infor, num) => {
    const tmp = addStock.map(x => {
      if (x.name == infor) {
        x.stock = x.stock - Number(num);
        return x;
      } else {
        return x;
      }
    }).filter(z => z.stock > 0);
    setAddStock(tmp);
  }

  const pop_stock_exp = (infor, num) => {
    const tmp = addStock.map(x => {
      if (x.name == infor) {
        if (Number(num) >= x.stock) {
          x.stock = Number(num) - x.stock;
          x.actionType = 'IMPORT';
          return x;
        } else if (Number(num) < x.stock) {
          x.stock = x.stock + Number(num);
          return x;
        }
      } else {
        return x;
      }
    }).filter(z => z.stock > 0);
    setAddStock(tmp);
  }

  console.log(addStock);
  useEffect(() => {
    //console.log('Page', page);
    let isMounted = true;
    setLoading(true);
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [page]);

  //fetch product de show trong flatlist
  const fetchData = async () => {
    const tokenuser02 = await AsyncStorage.getItem('idtoken');
    await fetch(
      `https://managewarehouse.herokuapp.com/products/warehouse/${idwarehouse}?limit=5&page=${page}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${tokenuser02}`,
        },
      },
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setPageLimit(responseJson.pageCount);
        setProductByIdWh(productByIdWh.concat(responseJson.data));
        setLoading(false);
        setCurrentPage(responseJson.currentPage);
      });
  };
  // fetch product de tim kiem real time
  const fetchProduct = async () => {
    const tokenuser01 = await AsyncStorage.getItem('idtoken');
    if (query === '') return;
    else if (query !== '') {
      var handleQuery = query.replace(/ /g, '%20');
      // cho nay can sua lai link API cho dung
      await fetch(
        `https://cnpmwarehouse.herokuapp.com/Products/search/${handleQuery}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${tokenuser01}`,
          },
        },
      )
        .then((res) => res.json())
        .then((resJson) => {
          setProduct(resJson.data.products);
        });
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [query]);

  // set su kien onChangeText cho khung tim kiem
  const updateQuery = (input) => {
    setQuery(input);
  };
  // set su kien onChangeText cho khung dien so luong

  // item duoc render trong flatlist o trang detail
  // xu ly coi vong tron khi load data
  handleFooter = () => {
    return Loading ? (
      <View style={styles.loader}>
        <ActivityIndicator size="small" color="red" />
      </View>
    ) : null;
  };
  // xu ly suw kien load mo de phan trang
  handleLoadMore = () => {
    if (page === currentPage && page < pageLimit) {
      setPage(page + 1);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reRender]);

  const separate = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'black',
        }}
      />
    );
  }

  const removeItem = (namePro) => {
    setAddStock(addStock.filter(prod => prod.name != namePro));
  }

  const Itemcart = ({ item }) => {
    return (
      <TouchableWithoutFeedback delayPressIn={1100} onPressIn={() => removeItem(item.name)}>
        <View style={{ flexDirection: 'row', width: '100%', height: 70, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 15, marginBottom: 20 }}>
          <View style={{ width: 200, marginLeft: 15 }}>
            <Text style={styles.textcart}>{item.name}</Text>
          </View>
          <View style={{ width: 100 }}>
            <Text style={styles.textcart}>{item.actionType}</Text>
          </View>
          <View style={{ width: 70 }}>
            <Text style={styles.textcart}>{item.stock}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          zIndex: 1,
        }}>
        <View style={styles.bigright}>
          <Addproduct
            onPress={() => {
              setSearchProduct([]);
              setShowAdd(true);
            }}
            title={faPlus}
          />
        </View>
        <View style={styles.bigleft}>
          <Addproduct
            onPress={() => setShowCart(true)}
            title={faLuggageCart}
          />
        </View>


        <Modal visible={showCart} transparent={true} animationType="none">
          <View style={styles.ViewCart}>
            <View style={styles.listcart}>
              <FlatList
                data={addStock}
                numColumns={1}
                keyExtractor={item => item.name}
                renderItem={Itemcart}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', height: 100 }}>
              <Appbutton title="PUSH" onPress={() => {
                Alert.alert('Notice!!!', 'Are you sure want to do this?', [
                  {
                    text: 'Yes',
                    onPress: async () => {
                      const tokenuser = await AsyncStorage.getItem('idtoken');

                      await fetch(
                        'https://managewarehouse.herokuapp.com/products',
                        {
                          method: 'POST',
                          headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${tokenuser}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            products: addStock,
                          }),
                        },
                      )
                        .then((res) => res.json())
                        .then((resdata) => {
                          if (resdata.statusCode === 200) {
                            setCurrentPage(1);
                            setProductByIdWh([]);
                            setPage(1);
                            setAddStock([]);
                            setReRender(!reRender);
                            setShowCart(false);
                          }
                        });
                    },
                  },
                  { text: 'No', style: 'cancel' },
                ]);
              }} />
              <Appbutton title="CANCEL" onPress={() => setShowCart(false)} />
            </View>
          </View>
        </Modal>


        <Modal visible={isShowModal} transparent={true} animationType="none">
          <View style={styles.centeredView}>
            <Text style={styles.textmodal} numberOfLines={3}>
              {note}
            </Text>
            <Text style={styles.textmodal}>{createAt}</Text>
            <View style={{ marginHorizontal: 50, marginTop: 40 }}>
              <Appbutton title="Cancel" onPress={() => setShowModal(false)} />
            </View>
          </View>
        </Modal>

        <Modal visible={showAdd} animationType="none">
          <View style={styles.addproduct}>
            <View style={{ marginHorizontal: 15, marginBottom: 40 }}>
              <TextInput
                style={styles.searchInput}
                placeholder="Find product here"
                onChangeText={(query) => updateQuery(query)}
                value={query}
              />
            </View>
            <View style={styles.container}>
              <FlatList
                data={product}
                numColumns={1}
                extraData={query}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <Searchproduct name={item.name} add_search={add_search} idwarehouse={idwarehouse} />}
                ItemSeparatorComponent={separate}
              />
            </View>
            <View style={{ marginHorizontal: 50, marginTop: 40 }}>
              <Appbutton title="ADD TO CART" onPress={() => {
                Alert.alert('notification', 'The changes you make will be lost, are you sure about this?', [
                  {
                    text: 'Yes',
                    onPress: () => {
                      console.log('addSearch sau khi search' + searchProduct);
                      handleCart();
                      console.log(addStock);
                      console.log(addStock);
                      console.log(addStock);
                      console.log(addStock);
                    }
                  },
                  {
                    text: 'No',
                    style: 'cancel'
                  }
                ])
              }} />
            </View>
            <View style={{ marginHorizontal: 50, marginTop: 40 }}>
              <Appbutton title="OK" onPress={() => {
                handlejoinarray();
                setShowAdd(false);
                console.log('addStock sau khi nhan nut oke' + addStock);
              }} />
            </View>
          </View>
        </Modal>
        <FlatList
          data={productByIdWh}
          numColumns={1}
          keyExtractor={(item) => item.id.toString()}
          initialNumToRender={8}
          renderItem={({ item }) => (
            <Input
              idwarehouse={idwarehouse}
              name={item.name}
              imageURL={item.image}
              add_stock={add_stock}
              pop_stock_imp={pop_stock_imp}
              pop_stock_exp={pop_stock_exp}
              stock={item.WarehouseProduct.stock.toString()}
              onPress={() => {
                setCreateAt(item.WarehouseProduct.createdAt);
                setNote(item.note);
                setShowModal(true);
              }}
            />
          )}
          getItemLayout={(data, index) => ({
            length: 80,
            offset: 80 * index,
            index,
          })}
          ListFooterComponent={handleFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    alignSelf: 'center',
    marginTop: 300,
    width: 300,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'black',
  },
  ViewCart: {
    alignSelf: 'center',
    marginTop: 200,
    width: 400,
    height: 500,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'black',
  },
  listcart: {
    height: 400,
    marginHorizontal: 15,
    marginTop: 15,
  },
  container: {
    width: '100%',
    height: 300,
    borderColor: 'black',
    borderWidth: 1,
  },

  text: {
    fontSize: 13,
    fontFamily: 'Roboto-BoldItalic',
  },
  textmodal: {
    fontSize: 18,
    fontFamily: 'Roboto-BoldItalic',
    textAlign: 'center',
  },

  loader: {
    alignItems: 'center',
    marginTop: 10,
  },
  addproduct: {
    justifyContent: 'center',
    width: '100%',
    height: 900,
    backgroundColor: '#fff',
    borderRadius: 25,
    elevation: 20,
    zIndex: 1,
    marginBottom: 30
  },
  bigright: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 2,
  },
  bigleft: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    zIndex: 2,
  },
  searchInput: {
    fontFamily: 'Roboto-Black',
    backgroundColor: '#E5E5E5',
    borderRadius: 15
  },
  textcart: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14
  }
});

export default Detailscreen;