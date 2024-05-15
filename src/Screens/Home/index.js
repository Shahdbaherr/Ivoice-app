import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native"; // Import Dimensions
import LinearGradient from "react-native-linear-gradient";
import * as Animatable from "react-native-animatable";
import Tts from "react-native-tts";
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window"); // Get the window dimensions

const Home = () => {
  const gifRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    setupTextToSpeech();

    const timer = setTimeout(() => {
      if (gifRef.current) {
        gifRef.current.slideInUp(1000);
        speakText("Meet I VOICE, How can I help you?");
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const setupTextToSpeech = () => {
    Tts.setDefaultLanguage("en-US");
    Tts.setDefaultPitch(1);
    Tts.setDefaultRate(0.5);
  };

  const speakText = (text) => {
    Tts.speak(text);
    
    setTimeout(() => {
      navigation.navigate('Chat');
    }, 3000);
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={["#6242E3", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.1, y: 0.8 }}
      useAngle={false}
    >
      <View style={styles.centered}>
        <Animatable.Image
        ref={gifRef}
        source={require('../../../../Ivoice/GIF1.gif')}
        style={{
          // height: 469,
          width: 388
        }}
        animation="slideInUp"
      />
      </View>

      <View style={styles.textContainer}>
        <View style={styles.row}>
          <Text style={styles.text}>Meet </Text>
          <Text style={[styles.text, styles.blueText]}>IVOICE</Text>
          <Text style={styles.text}> , </Text>
        </View>
        <Text style={styles.text}>How can I help you? </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', // Center the content vertically
  },
  centered: {
    alignItems: 'center', // Center the content horizontally
    marginBottom: height * 0.1, // Adjust margin bottom based on screen height
  },
  gif: {
    width: width * 0.8, // Adjust width based on screen width
    height: width * 0.8, // Keep aspect ratio
  },
  textContainer: {
    alignItems: 'center',
  },
  row: {
    flexDirection: "row",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E8E6FC",
  },
  blueText: {
    color: "#786CFF",
  },
});

export default Home;
