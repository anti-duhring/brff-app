import React from "react";
import { View, ScrollView, Text} from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const SkeletonPlaceHolderPodcast = () => {
  return (
        <ScrollView style={{flex:1, flexDirection:'column', }} contentContainerStyle={{alignItems:'center',}}>
         
                        <View style={{flex:1,marginTop:10}}>
            <SkeletonPlaceholder>
                        <View style={{marginBottom:10}}>
                            <View style={{height:100, width: 300, borderRadius: 4}} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <View style={{ marginRight: 20 }}>
                                <View style={{ width: 210, height: 20, borderRadius: 4 }} />
                                <View style={{ marginTop: 6, width: 100, height: 20, borderRadius: 4 }} />  
                            </View>
                            <View style={{ marginLeft:20,width: 36, height: 36, borderRadius: 50 }} />    
                        </View>
                </SkeletonPlaceholder>
            </View>
            <View style={{flex:1,marginTop:10}}>
            <SkeletonPlaceholder>
                        <View style={{marginBottom:10}}>
                            <View style={{height:100, width: 300, borderRadius: 4}} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <View style={{ marginRight: 20 }}>
                                <View style={{ width: 210, height: 20, borderRadius: 4 }} />
                                <View style={{ marginTop: 6, width: 100, height: 20, borderRadius: 4 }} />  
                            </View>
                            <View style={{ marginLeft:20,width: 36, height: 36, borderRadius: 50 }} />    
                        </View>
                </SkeletonPlaceholder>
            </View>

            <View style={{flex:1,marginTop:10}}>
            <SkeletonPlaceholder>
                        <View style={{marginBottom:10}}>
                            <View style={{height:100, width: 300, borderRadius: 4}} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <View style={{ marginRight: 20 }}>
                                <View style={{ width: 210, height: 20, borderRadius: 4 }} />
                                <View style={{ marginTop: 6, width: 100, height: 20, borderRadius: 4 }} />  
                            </View>
                            <View style={{ marginLeft:20,width: 36, height: 36, borderRadius: 50 }} />    
                        </View>
                </SkeletonPlaceholder>
                <SkeletonPlaceholder>
                        <View style={{marginBottom:10}}>
                            <View style={{height:100, width: 300, borderRadius: 4}} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <View style={{ marginRight: 20 }}>
                                <View style={{ width: 210, height: 20, borderRadius: 4 }} />
                                <View style={{ marginTop: 6, width: 100, height: 20, borderRadius: 4 }} />  
                            </View>
                            <View style={{ marginLeft:20,width: 36, height: 36, borderRadius: 50 }} />    
                        </View>
                </SkeletonPlaceholder>
            </View>
            </ScrollView> 
  );
};

export default SkeletonPlaceHolderPodcast;