import React, { useState, useRef, useEffect, forwardRef } from "react";
import { View, Text, Animated, Dimensions,findNodeHandle, TouchableOpacity } from "react-native";
import { LIGHT_GREEN } from "../Variables";

const {width, height} = Dimensions.get('screen');

const AnimatedTab = ({scrollX, data, onTabPress}) => {
    const [measures, setMeasures] = useState([]);
    const containerRef = React.useRef();
    useEffect(() => {
        const m = [];
        data.forEach(item => {
            item.ref.current.measureLayout(containerRef.current,
            (x,y, width, height) => {
                m.push({
                    x, y, width, height
                });
                if(m.length == data.length) {
                    setMeasures(m);
                }
            })
        })
    },[])

    const Indicator = ({measures, scrollX}) => {
        const inputRange = data.map((_, index) => index * width);
        const indicatorWith = scrollX.interpolate({
            inputRange,
            outputRange: measures.map((measure) => measure.width)
        })
        const translateX = scrollX.interpolate({
            inputRange,
            outputRange: measures.map((measure) => measure.x)
        })
        return (
            <Animated.View style={{
                position:'absolute',
                height:4,
                width: indicatorWith,
                backgroundColor:LIGHT_GREEN,
                borderRadius:5,
                bottom:-10, 
                left: 0, 
                transform: [{
                    translateX
                }]}} />
        )
    }

    const Tab = React.forwardRef(({item}, ref) => {
        return (
            <TouchableOpacity ref={ref} style={{flex:1}} onPress={() => onTabPress(item.key)}>
            <View style={{flexDirection:'row',justifyContent:'center'}}>
                {item.icon}<Text style={{color: LIGHT_GREEN,marginLeft:10}}>{item.title}</Text>
            </View>
            </TouchableOpacity>
        )
    });

    return (
        <View style={{width: width - 20,marginTop:20,marginLeft:10,marginRight:10}}>
            <View ref={containerRef} style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                {data.map((item, index) => {
                    return <Tab key={index} item={item} ref={item.ref} />
                })}
            </View>
            {measures.length > 0 && <Indicator measures={measures} scrollX={scrollX} />}
        </View>
    )
}

export default AnimatedTab;