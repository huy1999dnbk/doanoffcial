import React from 'react';
import React, { View, Text } from 'react-native';

const Menudrop = () => (
    // You need to place a MenuContext somewhere in your application, usually at the root.
    // Menus will open within the context, and only one menu can open at a time per context.
    <MenuContext style={{ flex: 1 }}>
      <TopNavigation/>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Hello!</Text></View>
    </MenuContext>
  );


export default Menudrop;
  