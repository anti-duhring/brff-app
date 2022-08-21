import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

const Placeholder = () => {
  return (
    <View style={{padding:10, marginBottom:10,backgroundColor:'transparent'}}>
        <SkeletonPlaceholder highlightColor="#ffffff1a" backgroundColor="#15191C">
        <View style={{ flexDirection: 'row', alignItems: "center" }}>
        <View style={{ marginLeft:0,width:70,height:70,borderRadius:12 }} />
            <View style={{ marginLeft: 20 }}>
            <View style={{ width: 200, height: 20, borderRadius: 4 }} />
            <View style={{ marginTop: 6, width: 100, height: 20, borderRadius: 4 }} />  
            </View>

        </View>
        </SkeletonPlaceholder>
    </View>
  )
}

export default Placeholder

const styles = StyleSheet.create({})