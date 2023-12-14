import React, { useState } from 'react';
import { Button, View, Platform, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './components/HomeScreen.js';
import Admin from './components/Admin.js';

const Drawer = createDrawerNavigator();

function WebHeader({ onMenuToggle }) {
  return (
    <View style={styles.header}>
      <Button title="Menu" onPress={onMenuToggle} />
      {/* Add other header elements here */}
    </View>
  );
}

function WebNavigationMenu({ onSelect, isVisible }) {
  if (!isVisible) return null;

  return (
    <View style={styles.menu}>
      <Button title="Home" onPress={() => onSelect('Home')} />
      <Button title="Admin" onPress={() => onSelect('Admin')} />
      {/* Add more navigation buttons as needed */}
    </View>
  );
}

export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Home');
  const isWeb = Platform.OS === 'web';

  const handleNavigation = (screenName) => {
    setCurrentScreen(screenName);
    setMenuVisible(false);
  };

  return (
    <NavigationContainer>
      {isWeb ? (
        <View style={styles.container}>
          <WebHeader onMenuToggle={() => setMenuVisible(!menuVisible)} />
          <WebNavigationMenu onSelect={handleNavigation} isVisible={menuVisible} />
          <View style={styles.screenContainer}>
            {currentScreen === 'Home' && <HomeScreen />}
            {currentScreen === 'Admin' && <Admin />}
            {/* Render other screens based on currentScreen */}
          </View>
        </View>
      ) : (
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Admin" component={Admin} />
          {/* Other Drawer Screens for mobile */}
        </Drawer.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    paddingHorizontal: 11,
    justifyContent: 'center',
    backgroundColor: 'lightblue',
    // Add other styling for the header
  },
  menu: {
    // Style for the side menu
    position: 'absolute',
    backgroundColor: 'lightgrey',
    width: '200px',
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: 'grey',
    height: '100%',
    zIndex: 1000, // Ensure it's above other content
  },
  screenContainer: {
    flex: 1,
    paddingTop: 60, // Adjust based on header height
  },
});
