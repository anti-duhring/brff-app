import { Text, ScrollView, View, ActivityIndicator, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerToggleButton } from '@react-navigation/drawer';
import Add from './Add'
import Drop from './Drop'

const Stack = createStackNavigator()

const Players = ({navigation}) => {

  return ( 
    <Stack.Navigator initialRouteName="Add" >

      <Stack.Screen name="Add"  options={{ title:'Trending Players',headerLeft: () => (
       <DrawerToggleButton onPress={() => navigation.toggleDrawer()} />
      ) }} component={Add} />

      <Stack.Screen name="Drop" options={{ title:'Trending Players',headerLeft: () => (
       <DrawerToggleButton onPress={() => navigation.toggleDrawer()} />
      ) }} component={Drop} />
      
    </Stack.Navigator>

  );

}
 
export default Players;
