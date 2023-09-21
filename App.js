/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import {requestPurchase, requestSubscription, useIAP} from 'react-native-iap';
import {withIAPContext} from 'react-native-iap';
import * as RNIap from 'react-native-iap';
const App = () => {
  // const {
  //   connected,
  //   products,
  //   subscriptions,
  //   getProducts,
  //   getSubscriptions,
  //   finishTransaction,
  //   currentPurchase,
  //   currentPurchaseError,
  // } = useIAP();

  const allThings = ['com.betamonkspurchase1', 'com.betamonkspurchase2'];

  const [playProducts, setPlayProducts] = useState([]);

  // useEffect(() => {
  //   console.log('Conttecnted value raw state :', connected);

  //   if (connected) {
  //     getProducts({skus: allThings})
  //       .then(res => {
  //         console.log('Values from playStore :' + res);
  //       })
  //       .catch(err => {
  //         console.log('Error occured while get value :', err);
  //       });

  //     getSubscriptions({skus: ['com.betamonkspurchase3']})
  //       .then(res => {
  //         console.log('sub from playStore :' + res);
  //       })
  //       .catch(err => {
  //         console.log('Error occured while get sub :', err);
  //       });
  //   }
  // }, [connected, getProducts]);

  // Another type
  useEffect(() => {
    RNIap.initConnection()
      .then(res => {
        console.log('RNAP get connection status :', res);
        getPlayStore();
      })
      .catch(err => {
        console.log('RNAP get catch status :', err);
      });

    return () => {
      RNIap.endConnection();
    };
  }, []);

  const getPlayStore = async () => {
    await RNIap.getProducts({skus: allThings})
      .then(res => {
        console.log('data from all :', res);
        setPlayProducts(res);
      })
      .catch(err => {
        console.log('err :', err);
      });
  };

  const onItemPress = async item => {
    console.log('Clicked item :', item);
    console.log('Clicked item productId:', item.productId);

    // try {
    const purchase = await RNIap.requestPurchase({skus: [item.productId]})
      .then(res => {
        console.log('Item gonna be buy :', res);
      })
      .catch(err => {
        console.log('Error while buying item :', err);
      });

    if (purchase) {
      await RNIap.finishTransaction(purchase)
        .then(res => {
          console.log('finished transaction :', res);
        })
        .catch(err => {
          console.log('finished transaction  failed:', err);
        });
    } else {
      console.log('No item purchased');
    }
    // } catch (err) {
    //   console.log('Error while purchaseing :', err);
    // }
  };

  const renderProducts = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.renderItem}
        onPress={onItemPress.bind(this, item)}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.listView}>
        <FlatList
          data={playProducts}
          renderItem={renderProducts}
          key={({item, index}) => index}
          ListEmptyComponent={
            <Text style={styles.emptyComp}>No Products Found</Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listView: {
    height: '30%',
  },
  renderItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyComp: {},
});

export default withIAPContext(App);
