import React, { Component } from 'react';
import { Image } from 'react-native';
import { LIGHT_GRAY } from '../Variables';

export default class ProgressiveImage extends Component {
  state = { showDefault: true, error: false };

  render() {
    var image = this.state.showDefault ? this.props.defaultSource ? this.props.defaultSource : require('../../../assets/Images/player_default.png') : ( this.state.error ? this.props.defaultSource ? this.props.defaultSource : require('../../../assets/Images/player_default.png') : { uri: this.props.uri } );

    return (
      <Image style={(this.props.tintColor && this.state.error || this.props.tintColor && this.state.showDefault) ? [this.props.style, {tintColor:LIGHT_GRAY}] : this.props.style} 
             source={image} 
             onLoadEnd={() => this.setState({showDefault: false})} 
             onError={() => this.setState({error: true})}
             resizeMode={this.props.resizeMode}/>
    );
  }
}