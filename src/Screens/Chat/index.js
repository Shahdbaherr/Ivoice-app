import React, { useState, useEffect, useRef, } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, Button, Modal, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import * as ImagePicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

const Chat = () => {
  const { width, height } = Dimensions.get('window');
  const [inputText1, setInputText1] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [objectDetected, setObjectDetected] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [plantDetected, setPlantDetected] = useState('');
  const [currencyDetected, setCurrencyDetected] = useState('');
  const [diseaseDetected, setDiseaseDetected] = useState('');
  const [detectedText, setDetectedText] = useState('');
  const [detectedfruit, setDetectfruit] = useState('');
  const [detectedcolor, setDetectcolor] = useState('');
 // const [isSpeaking, setIsSpeaking] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isTTSFinished, setIsTTSFinished] = useState(false);
  const [speechDuration, setSpeechDuration] = useState(0);



  const navigation = useNavigation();

  const [inputQuestion, setInputQuestion] = useState('');
  const [inputAnswer, setInputAnswer] = useState('');
  //map
  const [questions, setQuestions] = useState(['question']);
  const [answers, setAnswers] = useState(['answer']); 
 
  const inputRef = useRef(null);

  
  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      setInputText1(e.value[0]);
      if (e.value[0] === 'object') { handleOpenCameraobj(); }
      if (e.value[0] === 'currency') { handleOpenCameracurr(); }
      if (e.value[0] === 'plant') { handleOpenCameraplant(); }
      if (e.value[0] === 'Blunt') { handleOpenCameraplant(); }
      if (e.value[0] === 'convert') { handleOpenCameraconvert() }
      if (e.value[0] === 'disease') {   handleOpenCameradisease(); }
      if (e.value[0] === 'fruit') { handleOpenCamerafruit() }
      if (e.value[0] === 'colour') { handleOpenCameracolor() }
      if (e.value[0] === 'color') { handleOpenCameracolor() }
      if (e.value[0] === 'reminder') {
        navigation.navigate('Reminders')
     
      }
      if (e.value[0] === 'exit') {
        navigation.goBack();
      }
     
      handleSendMessage();
    }


  
    const initiateVoiceRecognition = async () => {
      try {
        setIsListening(true);
        await Voice.start('en-US');
      } catch (error) {
        console.error('Error starting voice recognition:', error);
      }
    };

    initiateVoiceRecognition();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

 
 

  // const calculateSpeechDuration = (text) => {
  //   // Estimate speech duration based on the number of characters in the text
  //   const averageCharactersPerSecond = 10; // Adjust as needed
  //   const speechDurationSeconds = text.length / averageCharactersPerSecond;
  //   return Math.max(speechDurationSeconds, 2); // Minimum duration of 2 seconds
  // };
  const calculateSpeechDuration = (text) => {
    // Adjust this constant based on the speed of the TTS engine
    const averageSpeechSpeed = 0.1; // seconds per character, adjust as needed
  
    // Calculate the estimated speech duration based on the length of the text
    const estimatedDuration = text.length * averageSpeechSpeed;
  
    // Add a minimum duration to ensure some delay even for short texts
    const minimumDuration = 1; // seconds, adjust as needed
  
    return Math.max(estimatedDuration, minimumDuration);
  };
  


  useEffect(() => {
    if (isTTSFinished) {
      setTimeout(() => {
        setModalVisible(false); // Close modal when TTS finishes speaking
        const initiateVoiceRecognition = async () => {
          try {
            setIsListening(true);
            await Voice.start('en-US');
          } catch (error) {
            console.error('Error starting voice recognition:', error);
          }
        };
        initiateVoiceRecognition(); 
      }, 2000); // Adjust the delay as needed
    }
  }, [isTTSFinished]);

  const handleContentSizeChange = (event) => {
    const { width } = event.nativeEvent.contentSize;
    if (inputRef.current) {
      inputRef.current.setNativeProps({
        style: { width: width },
      });
    }
  };
  const handleSendMessage = () => {
    if (inputText1.trim() === '' || response.trim() === '') return;

    // Store the question and answer in the maps
    const newQuestions = new Map(questions);
    newQuestions.set(inputText1.trim(), response.trim());
    setQuestions(newQuestions);

    let newAnswers = new Map(answers);
    if (inputText1.trim() === 'object') {
      newAnswers.set(inputText1.trim(), objectDetected);
    }
    if (inputText1.trim() === 'plant') {
      newAnswers.set(inputText1.trim(), plantDetected);
    }
    if (inputText1.trim() === 'currency') {
      newAnswers.set(inputText1.trim(), currencyDetected);
    }
    if (inputText1.trim() === 'disease') {
      newAnswers.set(inputText1.trim(), diseaseDetected);
    }
    if (inputText1.trim() === 'convert') {
      newAnswers.set(inputText1.trim(), detectedText);
    }
    else {
      newAnswers.set(inputText1.trim(), response.trim());
    }
    setAnswers(newAnswers);
  };
  const handleQuestionChange = (text, index) => {
    if (inputText1 === 'object' || inputText1 === 'plant' || inputText1 === 'Blunt' ||inputText1 === 'currency'
     || inputText1 === 'disease' || inputText1 === 'convert' ||  inputText1 === 'fruit' || 
      inputText1 === 'color' || 'color' 
      || inputText1 === 'reminder'
    ) {
      // Do not update questions[] if inputText1 is one of the specified values
      return;
    }
  
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[index] = text;
      return newQuestions;
    });
  };
  
  const handleAnswerChange = (text, index) => {
    if (inputText1 === 'object' || inputText1 === 'plant' || inputText1 === 'Blunt'|| inputText1 === 'currency'
     || inputText1 === 'disease' || inputText1 === 'convert'||
     inputText1 === 'fruit' || inputText1 === 'color' || inputText1 === 'colour' 
     || inputText1 === 'reminder'
      )  {  

      // Do not update answers[] if inputText1 is one of the specified values
      return;
    }
  
    const newAnswers = [...answers];
    newAnswers[index] = text;
    setAnswers(newAnswers);
  };
//stop true 

const speakGeneratedText = async (text) => {
  try {
    setIsSpeaking(true);
    setIsReading(true); // Set isReading to true when TTS starts speaking
    const startVoiceRecognition = async () => {
      try {
        setIsListening(true); // Start listening
        await Voice.start('en-US');
      } catch (error) {
        console.error('Error starting voice recognition:', error);
      }
    };
    await Tts.speak(text, {
      onDone: () => {
        setIsReading(false); // Set isReading to false after TTS finishes speaking
        setIsSpeaking(false); // Set isSpeaking to false after TTS finishes speaking
        setModalVisible(false); // Close the modal after TTS finishes speaking
        startVoiceRecognition(); // Start voice recognition after TTS finishes speaking
      }
    });
  } catch (error) {
    console.error('Error speaking generated text:', error);
    
  }
};







//not important
useEffect(() => {
  const handleModalClosed = () => {
    // Check if modal is closed and update isReading state accordingly
    setIsReading(false);
  };

  if (!modalVisible) {
    // Call the function to handle modal closed
    handleModalClosed();
  }
}, [modalVisible]);




 

 
  
  








//true
  useEffect(() => {
    handleGenerateAnswer();
  }, [inputText1]);
  useEffect(() => {
   
    console.log("Updated Questions:");
    questions.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
  
    console.log("Updated Answers:");
    answers.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
  
    // Remember to return a cleanup function if necessary.
    return () => {
      // Cleanup code goes here if needed.
    };
  }, [questions, answers]);
 useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setModalVisible(false); // Close modal when chat page is focused
    });

    return unsubscribe;
  }, [navigation]);

  const handleGenerateAnswer = async () => {
    setIsTTSFinished(false);
  
    // Stop answer generation and navigate to Reminders if input is 'reminder'
    if (inputText1 === 'reminder') {
      navigation.navigate('Reminders');
      return;
    }
  
    // Skip generating answer for specified input texts
    if (
      inputText1 !== 'object' &&
      inputText1 !== 'plant' &&
      inputText1 !== 'currency' &&
      inputText1 !== 'disease' &&
      inputText1 !== 'convert' &&
      inputText1 !== 'fruit' &&
      inputText1 !== 'colour' &&
      inputText1 !== 'color' &&
      inputText1 !== 'exit'
    ) {
      try {
        if (!inputText1.trim()) {
          setError('Please enter a question');
          return;
        }
  
        setLoading(true);
  
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=AIzaSyAdcaDwtJXYe7I3or5TppF2GQ2fapPoX9w`;
  
        const requestBody = {
          prompt: {
            text: inputText1 + " \n reply in two sentences",
          }
        };
  
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
  
        if (response.ok) {
          const responseData = await response.json();
          const generatedText = responseData?.candidates[0]?.output || 'No response';
          
          setResponse(generatedText);
          setError('');
          Tts.stop();
          Tts.speak(generatedText);
  
          const speechDuration = calculateSpeechDuration(generatedText);
          setTimeout(() => {
            setIsTTSFinished(true);
          }, speechDuration * 1000);
  
          const newQuestions = [...questions, inputText1.trim()];
          setQuestions(newQuestions);
  
          const newAnswers = [...answers, generatedText.trim()];
          setAnswers(newAnswers);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error generating answer:', error);
        setError('Error generating answer');
        const initiateVoiceRecognition = async () => {
          try {
            setIsListening(true);
            await Voice.start('en-US');
          } catch (error) {
            console.error('Error starting voice recognition:', error);
          }
        };
    
        initiateVoiceRecognition();
      } finally {
        setLoading(false);
      }
    }
  };
  

 
  

 
  //camera models
  const handleOpenCameraobj = () => {
    const options = {
      title: 'Select Image',
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 600,
      quality: 1,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error:', response.error);
      } else {
        console.log('Image URI:', response.assets[0].uri);

        handleDetectObject(response.assets[0].uri);
       
      }
    });
  };
  const handleOpenCameracurr = () => {
    const options = {
      title: 'Select Image',
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 600,
      quality: 1,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error:', response.error);
      } else {
        console.log('Image URI:', response.assets[0].uri);

        handleDetectCurrency(response.assets[0].uri);
       
      }
    });
  };

  const handleOpenCameraplant = () => {
    const options = {
      title: 'Select Image',
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 600,
      quality: 1,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error:', response.error);
      } else {
        console.log('Image URI:', response.assets[0].uri);

        handleDetectPlant(response.assets[0].uri);
       
      }
    });
  };
  const handleOpenCameradisease = () => {
    const options = {
      title: 'Select Image',
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 600,
      quality: 1,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error:', response.error);
      } else {
        console.log('Image URI:', response.assets[0].uri);

        handleDetectDisease(response.assets[0].uri);
       
      }
    });
  };
  const handleOpenCameraconvert = () => {
    const options = {
      title: 'Select Image',
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 600,
      quality: 1,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error:', response.error);
      } else {
        console.log('Image URI:', response.assets[0].uri);

        handleDetectText (response.assets[0].uri);
       
      }
    });
  };
  const handleOpenCamerafruit = () => {
    const options = {
      title: 'Select Image',
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 600,
      quality: 1,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error:', response.error);
      } else {
        console.log('Image URI:', response.assets[0].uri);

        handleDetectfruit (response.assets[0].uri);
       
      }
    });
  };
  const handleOpenCameracolor = () => {
    const options = {
      title: 'Select Image',
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 600,
      quality: 1,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error:', response.error);
      } else {
        console.log('Image URI:', response.assets[0].uri);

        handleDetectcolor (response.assets[0].uri);
       
      }
    });
  };




 



  const handleDetectObject = async (imageUri) => {
    try {
      // Reset isTTSFinished state to false
      setIsTTSFinished(false);
  
      const apiUrl = 'https://api.cloudmersive.com/image/recognize/describe';
      const apiKey = 'b64eac2c-2553-48b5-95da-3480a5412903';
  
      const formData = new FormData();
      formData.append('imageFile', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
  
      const settings = {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Apikey': apiKey,
        },
        body: formData,
      };
  
      const response = await fetch(apiUrl, settings);
  
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        const detectedObject = responseData.BestOutcome.Description || 'No object detected';
        setObjectDetected(detectedObject);
        setModalVisible(true);
  
        Tts.speak(detectedObject);
  
        const speechDuration = calculateSpeechDuration(detectedObject);
        setTimeout(() => {
          setIsTTSFinished(true);
        }, speechDuration * 1000); // Convert speech duration to milliseconds
      } else {
        throw new Error('Failed to detect object');
        
      }
    } catch (error) {
      console.error('Error detecting object:', error);
      setObjectDetected('Error detecting object');
      const initiateVoiceRecognition = async () => {
        try {
          setIsListening(true);
          await Voice.start('en-US');
        } catch (error) {
          console.error('Error starting voice recognition:', error);
        }
      };
  
      initiateVoiceRecognition();
    }
  };
  
  const handleDetectPlant = async (imageUri) => {
    try {
      setIsTTSFinished(false);
      const apiUrl = 'https://plant.id/api/v3/identification';
      const apiKey = '82oyEZtM2vStZ9ZpKCdhrxXEzDEGujGLN03buAcW7LF75RifnE';
  
      const formData = new FormData();
      formData.append('images', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
  
      const settings = {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Api-Key': apiKey,
        },
        body: formData,
      };
  
      const response = await fetch(apiUrl, settings);
  
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
  
        // Check each part individually
        let detectedPlant = 'Plant not detected';
        if (responseData && responseData.result && responseData.result.classification && responseData.result.classification.suggestions && responseData.result.classification.suggestions[0] && responseData.result.classification.suggestions[0].name) {
          detectedPlant = responseData.result.classification.suggestions[0].name;
        } else {
          console.error('Error: Unable to determine plant name. Response data:', responseData);
          throw new Error('Unable to determine plant name');
        }
  
        setPlantDetected(detectedPlant);
        setModalVisible(true);
        Tts.speak(detectedPlant);
  
        const speechDuration = calculateSpeechDuration(detectedPlant);
        setTimeout(() => {
          setIsTTSFinished(true);
        }, speechDuration * 1000); // Convert speech duration to milliseconds
      
      } else {
        throw new Error('Failed to detect plant');
      }
    } catch (error) {
      console.error('Error detecting plant:', error);
      setPlantDetected('Error detecting plant');
      const initiateVoiceRecognition = async () => {
        try {
          setIsListening(true);
          await Voice.start('en-US');
        } catch (error) {
          console.error('Error starting voice recognition:', error);
        }
      };
  
      initiateVoiceRecognition();
    }
  };

  const handleDetectCurrency = async imageUri => {
    try {
     setIsTTSFinished(false);
      const apiUrl = 'https://ivoice-currency.onrender.com/process_image';

      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      const settings = {
        method: 'POST',
        body: formData,
      };

      const response = await fetch(apiUrl, settings);

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        const detectedCurrency = responseData.class || 'Currency not detected';
        setCurrencyDetected(detectedCurrency);
        setModalVisible(true);
        Tts.speak(detectedCurrency)
        
  
                const speechDuration = calculateSpeechDuration(detectedCurrency);
                setTimeout(() => {
                  setIsTTSFinished(true);
                }, speechDuration * 1000); // Convert speech duration to milliseconds
      } else {
        throw new Error('Failed to detect currency');
      }
    } catch (error) {
      console.error('Error detecting currency:', error);
      setError('Error detecting currency');
      const initiateVoiceRecognition = async () => {
        try {
          setIsListening(true);
          await Voice.start('en-US');
        } catch (error) {
          console.error('Error starting voice recognition:', error);
        }
      };
  
      initiateVoiceRecognition();
    

    }
  };

  const handleDetectDisease = async imageUri => {
    try {
     setIsTTSFinished(false);
      const apiUrl = 'https://disease-17z7.onrender.com/predictApi';

      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('API Response:', responseData);
        if (responseData.prediction) {
          const detectedDisease = responseData.prediction.replace(/_/g, ' ') ;
          setDiseaseDetected(detectedDisease);
          setModalVisible(true);
          Tts.speak(detectedDisease)
          
  
                const speechDuration = calculateSpeechDuration(detectedDisease);
                setTimeout(() => {
                  setIsTTSFinished(true);
                }, speechDuration * 1000); // Convert speech duration to milliseconds
         
      
         
        } else {
          throw new Error('Failed to detect disease');
        }
      } else {
        throw new Error('No disease detected');
      }
    } catch (error) {
      console.error('Error detecting disease:', error);
      setError('Error detecting disease: ' + error.message);
      setDiseaseDetected('');
      const initiateVoiceRecognition = async () => {
        try {
          setIsListening(true);
          await Voice.start('en-US');
        } catch (error) {
          console.error('Error starting voice recognition:', error);
        }
      };
  
      initiateVoiceRecognition();
  
     }
  };

  const handleDetectText = async imageUri => {
    try {
     setIsTTSFinished(false);
      const apiUrl = 'https://api.api-ninjas.com/v1/imagetotext';
      const apiKey = '0Tax7QJWU7cuCBcG1lakEw==isJ8rjdhzAM64ILa';

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Api-Key': apiKey,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('API Response:', responseData);
        if (Array.isArray(responseData) && responseData.length > 0) {
          const extractedText = responseData.map(wordObj => wordObj.text).join(' ');
          setDetectedText(extractedText);
          setModalVisible(true);
          Tts.speak(extractedText)
        
  
                const speechDuration = calculateSpeechDuration(extractedText);
                setTimeout(() => {
                  setIsTTSFinished(true);
                }, speechDuration * 1000); // Convert speech duration to milliseconds
        } else {
          throw new Error('Failed to detect text');
        }
      } else {
        throw new Error('No text detected');
      }
    } catch (error) {
      console.error('Error detecting text:', error);
      setError('Error detecting text: ' + error.message);
      setDetectedText('');
      const initiateVoiceRecognition = async () => {
        try {
          setIsListening(true);
          await Voice.start('en-US');
        } catch (error) {
          console.error('Error starting voice recognition:', error);
        }
      };
  
      initiateVoiceRecognition();
    }
  };
  const handleDetectfruit = async imageUri => {
    try {
     setIsTTSFinished(false);
      const apiUrl = 'https://fruits-06pv.onrender.com/predictApi';

      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('API Response:', responseData);
        if (responseData.prediction) {
          const detectedfruit = responseData.prediction.replace(/_/g, ' ') ;
          setDetectfruit(detectedfruit);
          setModalVisible(true);
          Tts.speak(detectedfruit)
      
  
                const speechDuration = calculateSpeechDuration(detectedfruit);
                setTimeout(() => {
                  setIsTTSFinished(true);
                }, speechDuration * 1000); // Convert speech duration to milliseconds
        } else {
          throw new Error('Failed to detect Fruit');
        }
      } else {
        throw new Error('No Fruit detected');
      }
    } catch (error) {
      console.error('Error detecting fruit:', error);
      setError('Error detecting fruit: ' + error.message);
      setDetectfruit('');
      const initiateVoiceRecognition = async () => {
        try {
          setIsListening(true);
          await Voice.start('en-US');
        } catch (error) {
          console.error('Error starting voice recognition:', error);
        }
      };
  
      initiateVoiceRecognition();
    }
  };
  const handleDetectcolor = async imageUri => {
    try {
     setIsTTSFinished(false);
      const apiUrl = 'https://color-maybe.onrender.com/detect_color';

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('API Response:', responseData);
        if (responseData.color) {
          const detectedcolor = responseData.color.replace(/_/g, ' ') ;
          setDetectcolor(detectedcolor);
          setModalVisible(true);
          Tts.speak(detectedcolor)

                const speechDuration = calculateSpeechDuration(detectedcolor);
                setTimeout(() => {
                  setIsTTSFinished(true);
                }, speechDuration * 1000); // Convert speech duration to milliseconds
        } else {
          throw new Error('Failed to detect color');
        }
      } else {
        throw new Error('No color detected');
      }
    } catch (error) {
      console.error('Error detecting color:', error);
      setError('Error detecting color: ' + error.message);
      setDetectcolor('');
    //  navigation.navigate('Chat');
    }
  };




  return (
    <LinearGradient
      style={styles.container}
      colors={['#6242E3', '#000000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.1, y: 0.7 }}
      useAngle={false}
    >
      <View style={styles.container}>
        <View style={styles.chatContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardDismissMode="on-drag">
            {questions.map((question, index) => (
              <View key={index} style={index % 2 === 0 ? styles.leftMessage : styles.rightMessage}>
                <TextInput
                  style={[styles.input, styles.questionInput]}
                  placeholder="Type your question..."
                  value={questions[index]}
                  multiline
                 onContentSizeChange={handleContentSizeChange}
                  onChangeText={(text) => handleQuestionChange(text, index)}
                />
                <TextInput
                  style={[styles.input, styles.answerInput]}
                  placeholder="Type your answer..."
                  value={answers[index]}
                  multiline
                  onContentSizeChange={handleContentSizeChange}
                  onChangeText={(text) => handleAnswerChange(text, index)}
                />

              </View>
            ))}
          </ScrollView>

        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            navigation.navigate('Chat');
          }}
        >
          <View style={styles.modalBackground}>
            <LinearGradient
              style={styles.modalContainer}
              colors={['#6242E3', '#000000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.1, y: 0.7 }}
              useAngle={false}
            >
              <View style={styles.modalContent}>
                <Text style={styles.title}>Detection Result</Text>
                <View style={styles.resultContainer}>
                  {/* <Text style={styles.result}>{detectedText}</Text> */}
                  {inputText1 === 'object' && <Text style={styles.result}>{objectDetected}</Text>}
                  {inputText1 === 'currency' && <Text style={styles.result}>{currencyDetected}</Text>}
                  {inputText1 === 'plant' && <Text style={styles.result}>{plantDetected}</Text>}
                  {inputText1 === 'disease' && <Text style={styles.result}>{diseaseDetected}</Text>}
                  {inputText1 === 'convert' && <Text style={styles.result}>{detectedText}</Text>}
                  {inputText1 === 'fruit' && <Text style={styles.result}>{detectedfruit}</Text>}
                  {inputText1 === 'colour' || 'color' && <Text style={styles.result}>{detectedcolor}</Text>}
                </View>
                <View style={styles.buttonContainer}>
                
                </View>
              </View>
            </LinearGradient>
          </View>
        </Modal>
      </View>

      <Image
        source={require('../../../GIF2.gif')}
        style={styles.image}
      />
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  image: {
    height: 500* 0.2,
    width: 400 * 0.9,
    alignSelf: 'center',
    marginBottom: 20,
  },
  chatContainer: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  leftMessage: {
    // flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  rightMessage: {
    // flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,

  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
   // marginBottom: 20,
   marginTop:20,
    fontSize: 18,
    color: '#fff',
    maxWidth: '80%'

  },
  questionInput: {
    backgroundColor: '#6242E3',
    marginRight: '10%',
    width: '80%',
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
   // marginBottom: 20,
   marginTop:10,
    fontSize: 18,
    color: '#fff',
    maxHeight: '100%',
  },
  answerInput: {
    backgroundColor: '#6242E3',
    marginLeft: '20%',
    width: '80%',
    borderWidth: 1,
    borderRadius: 20,
   // padding: 15,
   // marginBottom: 20,
   marginTop:20,
    fontSize: 18,
    color: '#fff',
    maxHeight: '100%',
  },
  // image: {
  //   height: 145,
  //   width: 439,
  //   alignSelf: 'center',
  //   marginBottom: 20,
  // },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    height: '60%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  result: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
  },
  buttonContainer: {
    width: 200,
    borderRadius: 20,
    backgroundColor: '#000',
    marginTop: 30,
  },
});


export default Chat;
