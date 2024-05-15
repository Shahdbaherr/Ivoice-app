import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera, useCameraPermission, useCameraDevice } from 'react-native-vision-camera';

function Scan() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const cameraRef = useRef(null);

  useEffect(() => {
    const checkCameraPermission = async () => {
      const permissionStatus = await hasPermission();
      if (!permissionStatus) {
        await requestPermission();
      }
    };

    checkCameraPermission();
  }, [hasPermission, requestPermission]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const picture = await cameraRef.current.takePhoto({ quality: '0.5' });
        console.log('Picture taken', picture);
      } catch (error) {
        console.error('Failed to take picture', error);
      }
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission denied</Text>
      </View>
    );
  }

  if (!device) {
    return <NoCameraDeviceError />;
  }

  return (
    <View style={styles.container}>
      <Camera style={StyleSheet.absoluteFill} device={device} ref={cameraRef} isActive={true} />
      <TouchableOpacity onPress={takePicture} style={styles.capture}>
        <Text style={styles.captureText}>Take Picture</Text>
      </TouchableOpacity>
    </View>
  );
}

const NoCameraDeviceError = () => (
  <View style={styles.container}>
    <Text style={styles.errorText}>No camera device found</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  permissionText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  capture: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
  },
  captureText: {
    fontSize: 16,
  },
});

export default Scan;
