import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Voice from '@react-native-voice/voice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import SendIntentAndroid from 'react-native-send-intent';
import Tts from 'react-native-tts';
import moment from 'moment';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTitle, setReminderTitle] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const fetchLastReminder = async () => {
      try {
        const storedReminders = await AsyncStorage.getItem('reminders');
        if (storedReminders) {
          setReminders(JSON.parse(storedReminders));
        }
      } catch (error) {
        console.error('Error fetching reminders:', error);
      }
    };

    fetchLastReminder();

    Voice.onSpeechResults = onSpeechResults;
    startListening();
    return () => {
      Voice.destroy();
    };
  }, []);

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (e) {
      console.error(e);
    }
  };

  const addEventToCalendar = () => {
    if (!reminderDate || !reminderTitle) {
      console.error('Reminder date or title is empty');
      return;
    }

    let eventDate = moment(reminderDate, moment.ISO_8601, true); // Parsing the date as ISO 8601

    if (!eventDate.isValid()) {
      console.error('Invalid date format');
      return;
    }

    const formattedDate = eventDate.toISOString();

    PushNotification.localNotification({
      message: `Event "${reminderTitle}" on ${eventDate.format('MMMM D, YYYY')} added to calendar`,
      soundName: Platform.OS === 'android' ? 'default' : 'default.mp3',
      channelId: 'test-channel',
    });

    SendIntentAndroid.addCalendarEvent({
      title: reminderTitle,
      description: `Reminder "${reminderTitle}" on ${eventDate.format('MMMM D, YYYY')}`,
      startDate: formattedDate,
      endDate: formattedDate,
      recurrence: 'does not repeat',
    });

    // Reset the state for the next reminder
    setReminderDate('');
    setReminderTitle('');

    // Update reminders state with the new reminder
    setReminders(prevReminders => [
      ...prevReminders,
      {
        reminderName: reminderTitle, // Use the user-defined reminder title
        date: eventDate.format('MMMM D, YYYY'),
        time: moment().format('LT')
      }
    ]);
  };

  const onSpeechResults = (event) => {
    const spokenText = event.value[0];
    console.log('Spoken text:', spokenText);
  
    if (!reminderDate && containsNumbers(spokenText)) {
      const formatsToTry = ['YYYY-MM-DD', 'YYYY M D', 'MMMM D, YYYY', 'MMMM D YYYY', 'D M YYYY', 'D MMMM YYYY'];
      let parsedDate;
      for (let i = 0; i < formatsToTry.length; i++) {
        parsedDate = moment(spokenText, formatsToTry[i], true);
        if (parsedDate.isValid()) {
          break;
        }
      }
  
      if (!parsedDate || !parsedDate.isValid()) {
        console.error('Invalid date format');
        return;
      }
  
      setReminderDate(parsedDate.format('YYYY-MM-DD'));
      Tts.speak('Please provide the title for the reminder');
      startListening(); 
    } else if (!reminderTitle) {
      setReminderTitle(spokenText);
      Tts.speak('Title received. Adding to calendar.');
    }
  };
  
  const containsNumbers = (text) => {
    return /\d/.test(text);
  };

  addEventToCalendar();

  return (
    <LinearGradient style={styles.container}
      colors={['#6242E3', '#000000']}
      start={{ x: 0, y: 0 }}
      end={{ x: .1, y: .8 }}
      useAngle={false}
    >
      <Image
        source={require('../../../../Ivoice/calender-removebg-preview.png')}
        style={{
          height: 220,
          width: 220,
          alignSelf: 'center',
          marginTop: 50,
          transform: [{rotate: '-10deg'}]
        }}
      />
      {
        reminders.map((item, index) => (
          <View key={index} style={{
            justifyContent: 'space-between',
            flexDirection: 'column',
            margin: 10
          }}>
            <LinearGradient
              colors={['#6645EB', '#372481']}
              style={{
                width: 370,
                height: 100,
                alignSelf: 'center',
                borderRadius: 20
              }}
            >
              <View style={{
                alignItems: 'center',
                justifyContent: 'space-around',
                flexDirection: 'row',
              }}>
                <Text style={{
                  fontSize: 23,
                  color: '#fff',
                  justifyContent: 'center',
                  marginBottom: 15
                }}>{item.reminderName}</Text>
                <Text style={{
                  fontSize: 23,
                  color: '#fff',
                  justifyContent: 'center',
                  marginBottom: 15
                }}>{item.time}</Text>
              </View>
              <View style={{
                width: '100%',
                height: 1,
                backgroundColor: '#372481',
                alignSelf: 'center',
              }}></View>
              <View style={{
                justifyContent: 'center',
                flexDirection: 'row'
              }}>
                <Image
                  source={require('../../../../Ivoice/calender_icon-removebg-preview.png')}
                  style={{ height: 50, width: 50, alignSelf: 'center' }}
                />
                <Text style={{
                  fontSize: 23,
                  color: '#fff',
                  alignSelf: 'center'
                }}>{item.date}</Text>
              </View>
            </LinearGradient>
          </View>
        ))
      }
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  }
});

export default Reminders;
