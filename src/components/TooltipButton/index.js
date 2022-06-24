import { View, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useState } from "react";
import { LIGHT_GRAY } from "../Variables";

const TooltipButton = ({setTip, showTip}) => {
    return ( 
        <View style={{flex:1,alignItems:'flex-end', justifyContent:'center'}}>

        <TouchableOpacity onPress={() => {setTip((showTip) ? false : true); }}>
            <AntDesign name="questioncircleo" size={20} color={LIGHT_GRAY} />
        </TouchableOpacity>
   

    </View>
     );
}
 
export default TooltipButton;