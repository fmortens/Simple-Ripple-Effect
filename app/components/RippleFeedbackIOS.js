import React from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Easing,
  Text
} from 'react-native';

const MAX_DIAMETER = 500;
const Z_INDEX = 10;
const BG_COLOR = '#ddd';

export default class RippleFeedbackIOS extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      diameter: MAX_DIAMETER,
      scaleValue: new Animated.Value(0),
      opacityRippleValue: new Animated.Value(1.0),
      opacityBackgroundValue: new Animated.Value(0)
    };
  }

  onLayoutChanged = event => {
    const { width, height } = event.nativeEvent.layout;

    this.setState({
      diameter: width > height ? width * 2 : height * 2
    });
  };

  onLongPress = () => {
    Animated.timing(this.state.opacityBackgroundValue, {
      toValue: 0.5,
      duration: 700,
      useNativeDriver: true
    }).start();
  };

  onPress = () => {
    const { diameter } = this.state;

    Animated.parallel([
      Animated.timing(this.state.opacityBackgroundValue, {
        toValue: 0.5,
        duration: 125 + diameter,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true
      }),

      Animated.timing(this.state.opacityRippleValue, {
        toValue: 0,
        duration: 125 + diameter,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true
      }),

      Animated.timing(this.state.scaleValue, {
        toValue: 1,
        duration: 125 + diameter,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      })
    ]).start(() => {
      Animated.timing(this.state.opacityBackgroundValue, {
        toValue: 0,
        duration: 225,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      }).start();

      this.setDefaultAnimatedValues();
    });
  };

  onPressIn = event => {
    this.setState({
      pressX: event.nativeEvent.locationX,
      pressY: event.nativeEvent.locationY
    });
  };

  onPressOut = () => {
    const { diameter } = this.state;

    Animated.parallel([
      Animated.timing(this.state.opacityBackgroundValue, {
        toValue: 0.0,
        duration: 500 + diameter,
        useNativeDriver: true
      }),
      Animated.timing(this.state.opacityRippleValue, {
        toValue: 0.0,
        duration: 125 + diameter,
        useNativeDriver: true
      }),
      Animated.timing(this.state.scaleValue, {
        toValue: 1.0,
        duration: 125 + diameter,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      })
    ]).start(this.setDefaultAnimatedValues);
  };

  setDefaultAnimatedValues = () => {
    this.state.scaleValue.setValue(0);
    this.state.opacityRippleValue.setValue(1.0);
  };

  renderRippleLayer = () => {
    const {
      pressX,
      pressY,
      diameter,
      scaleValue,
      opacityRippleValue
    } = this.state;

    return (
      <Animated.View
        key="ripple-view"
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: (pressY || 0) - diameter / 2,
            left: (pressX || 0) - diameter / 2,
            width: diameter,
            height: diameter,
            transform: [{ scale: scaleValue }],
            opacity: opacityRippleValue,
            borderRadius: diameter / 2,
            backgroundColor: BG_COLOR,
            zIndex: Z_INDEX
          }
        ]}
      />
    );
  };

  renderBackgroundLayer = () => {
    const { opacityBackgroundValue, scaleValue, diameter } = this.state;

    return (
      <Animated.View
        key="ripple-opacity"
        pointerEvents="none"
        style={{
          ...StyleSheet.absoluteFillObject,
          opacity: opacityBackgroundValue,
          zIndex: Z_INDEX
        }}
      />
    );
  };

  render() {
    const { disabled, style } = this.props;

    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        pointerEvents: 'none'
      });
    });

    const ripple = (
      <View
        key="ripple-opacity"
        style={[styles.container]}
        pointerEvents="none"
      >
        {this.renderBackgroundLayer()}
        {this.renderRippleLayer()}
      </View>
    );

    return (
      <TouchableWithoutFeedback
        key="ripple-feedback-layer"
        onLayout={this.onLayoutChanged}
        onPressIn={this.onPressIn}
        onLongPress={this.onLongPress}
        onPressOut={this.onPressOut}
        onPress={this.onPress}
      >
        <View style={style}>
          {children}
          {ripple}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: Z_INDEX
  }
});
