import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { DARK_BLACK } from '../../Variables'

const LeagueBody = (props) => {
  return (
    <View style={styles.body}>
      {props.children}
    </View>
  )
}

export default LeagueBody

const styles = StyleSheet.create({
    body: {
        backgroundColor:DARK_BLACK,
        paddingTop:40,
        height: '100%',
        //flex: 1
    }
})