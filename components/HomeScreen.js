import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';




const HomeScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [priority, setPriority] = useState(''); 
  const [submittedEmail, setSubmittedEmail] = useState('');



  const selectFile = async () => {
    // Requesting permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync(
      {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      }
    );
  
    if (permissionResult.granted === false) {
      alert('You need to grant permission to access the media library!');
      return;
    }
    
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only pick images, not videos
      allowsEditing: true, // Allows basic editing, like cropping
      aspect: [4, 3], // Aspect ratio of the returned image
      quality: 1, // Quality of the image (0 to 1)
    });
  
    if (!result.cancelled) {
      const response = await fetch(result.uri);
      const blob = await response.blob();
      setAttachment(blob);
    }
  };
  


  const CustomButton = ({ title, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  const submitTicket = () => {
    setSubmittedEmail(email);  // Store the submitted email
  
    // Create a FormData object for your request
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('priority', priority);
    formData.append('description', description);
    formData.append('status', 'new')
    
    // 'attachment' is expected to be a Blob or a File object
    if (attachment) {
      formData.append('attachment', attachment);
    }
  
    // Making the POST request with Axios
    axios.post('http://52.201.226.68/submit_ticket', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      // Construct the message content for the alert
      const messageContent = `Name: ${name}\nEmail: ${email}\nPriority: ${priority}\nDescription: ${description}`;
      
      // Show an alert on successful submission
      Alert.alert("Ticket Submitted", messageContent, [{ text: "OK" }]);
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
    setName('');
    setEmail('');
    setDescription('');
    setAttachment(null);
    setPriority('');
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  
  async function registerForPushNotificationsAsync() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission for notifications was denied');
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Submit a Support Ticket</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <View style={styles.priorityContainer}>
  {['Low', 'Medium', 'High'].map((level) => (
    <TouchableOpacity
      key={level}
      style={[
        styles.priorityButton,
        { backgroundColor: priority === level ? '#4A90E2' : '#E2E8F0' },
      ]}
      onPress={() => setPriority(level)}
    >
      <Text style={styles.priorityText}>{level}</Text>
    </TouchableOpacity>
  ))}
</View>

      <TextInput
        style={[styles.input, styles.description]}
        placeholder="Describe your issue"
        placeholderTextColor="#666"
        value={description}
        multiline
        onChangeText={setDescription}
      />
      <CustomButton
  title="Select Photo/Attachment"
  onPress={selectFile}
/>
{attachment && <Text style={styles.attachmentText}>Attachment Selected</Text>}
<CustomButton
  title="Submit Ticket"
  onPress={submitTicket}
  style={styles.submitButton}

  
/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  header: {
    fontSize: 26,
    marginBottom: 25,
 
    color: '#1A202C',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  description: {
    height: 120,
    textAlignVertical: 'top',
  },
  attachmentText: {
    marginVertical: 15,
   
    color: '#4A5568',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
  
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#4A90E2', // Different color for submit button
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priorityText: {
  
    color: '#FFF',
  },
  submittedEmailText: {
    color: '#4A5568',
    marginTop: 20,
   
    fontSize: 16,
  },
  
});

export default HomeScreen
