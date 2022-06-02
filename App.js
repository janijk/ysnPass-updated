import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, AppState, TextInput, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootSiblingParent } from 'react-native-root-siblings';
import { LinearGradient } from 'expo-linear-gradient';
import CreatePasswordScreen from './CreatePasswordScreen';
import PasswordsScreen from './PasswordsScreen';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import SettingsScreen from './SettingsScreen';
import AccountCreationScreen from './AccountCreationScreen';
import * as AccMethods from './AccountMethods';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SignStack = createNativeStackNavigator();

export default function App() {
  const [signed, setSigned] = useState(false);
  const [pinQuery, setPinQuery] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const appState = useRef(AppState.currentState);

  //AppState background / foreground ?
  useEffect(() => {
    const checkPin = async () => {
      let isMounted = false;
      let result = await AccMethods.getPin();
      if (!isMounted) {
        if (result == true) {
          setPinQuery(true);
        }
      }
    };
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.current.match(/active/) && nextAppState === "background") {
        setAppIsReady(false);
        checkPin();
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
      isMounted = true;
    };
  }, []);
  // Is someone signed in
  useEffect(() => {
    let isMounted = false;
    const checkUser = async () => {
      let result = await AccMethods.currentUser();
      if (!isMounted) {
        if (result) {
          setSigned(true);
          setAppIsReady(true);
        } else if (!result) {
          setAppIsReady(true);
        }
      }
    }
    checkUser();
    return () => {
      isMounted == true;
    };
  });
  //Splashscreen
  function Splashi() {
    return (
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <LinearGradient
          colors={['#a5c7b7', '#5d4257']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>
    )
  };
  // Pin query screen
  function Pinview() {
    const [enteredPin, setEnteredPin] = useState('');
    async function doesPinMatch() {
      let result = await AccMethods.signInPin(enteredPin);
      if (result == true) {
        setPinQuery(false);
      }
    };
    if (enteredPin.length == 4) {
      doesPinMatch();
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <LinearGradient
          colors={['#a5c7b7', '#5d4257']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Text style={{ fontStyle: "italic", fontSize: 18 }}>Pincode</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.pinTextInput}
          placeholder='* * * *'
          keyboardType='numeric'
          maxLength={4}
          fontSize={25}
          autoFocus={true}
          onChangeText={text => setEnteredPin(text)} />
      </View>
    )
  };
  //Tab navigator   
  function HomeTabs() {
    //observer: is user logged in    
    useEffect(() => {
      let isMounted = false;
      const checkUser = async () => {
        let result = await AccMethods.currentUser();
        if (!isMounted) {
          if (result) {
            setSigned(true);
          } else if (!result) {
            setSigned(false);
          }
        }
      }
      checkUser();
      return () => {
        isMounted == true;
      };
    });
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'md-home';
            } else if (route.name === 'Passwords') {
              iconName = 'key-outline';
            } else if (route.name === 'Generate Password') {
              iconName = 'construct-outline'
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          /*unmountOnBlur: true,*/
          tabBarStyle: { position: 'absolute' },
          tabBarBackground: () => (
            <LinearGradient
              colors={['#212121', '#212121']}
              style={styles.background}
            />
          ),
        })}>
        <Tab.Screen name="Home" component={HomeStackScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Passwords" component={PasswordsScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Generate Password" component={CreatePasswordScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    );
  };
  // Home stack
  function HomeStackScreen() {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen name="HomeTwo" component={HomeScreen} options={{ headerShown: false }} />
        <HomeStack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      </HomeStack.Navigator>
    );
  }
  // Sign in stack
  function SignInStackScreen() {
    //observer: is user logged in    
    useEffect(() => {
      let isMounted = false;
      const checkUser = async () => {
        let result = await AccMethods.currentUser();
        if (!isMounted) {
          if (result) {
            setSigned(true);
          } else if (!result) {
            setSigned(false);
          }
        }
      }
      checkUser();
      return () => {
        isMounted == true;
      };
    });
    return (
      <SignStack.Navigator>
        <SignStack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
        <SignStack.Screen name='CreateAcc' component={AccountCreationScreen} options={{ headerShown: false }} />
      </SignStack.Navigator>
    )
  };
  //Stack navigator
  function FirstStack() {
    return (
      <Stack.Navigator>
        {
          !pinQuery ? (
            <>
              {
                !signed ? (
                  <>
                    <Stack.Screen name='signIn' component={SignInStackScreen} options={{ headerShown: false }} />
                  </>
                ) : (
                  <>
                    <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
                  </>
                )
              }
            </>
          ) : (
            <>
              <Stack.Screen name="pinview" component={Pinview} options={{ headerShown: false }} />
            </>
          )
        }
      </Stack.Navigator>
    )
  };
  return (
    <NavigationContainer>
      <RootSiblingParent>
        {
          !appIsReady ? (
            <>
              <Splashi />
            </>
          ) : (
            <>
              <FirstStack />
            </>
          )
        }
      </RootSiblingParent>
    </NavigationContainer>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pngView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  midContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resetTextPlace: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 40
  },
  button: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  logScreenButtons: {
    borderRadius: 10,
    width: 150,
    marginTop: 15,
    justifyContent: 'space-around'
  },
  signOutButtons: {
    borderRadius: 10,
    width: 75,
    marginTop: 15,
    justifyContent: 'space-around'
  },
  textStyling: {
    color: '#FFFFFF',
    fontSize: 15,
    opacity: 0.65
  },
  pinTextInput: {
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: 'black',
    borderWidth: 1,
    width: 150,
    height: 50,
    marginTop: 10,
    textAlign: 'center'
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  backgroundOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '130%',
    borderRadius: 15
  },
  overlayButton: {
    marginTop: 10,
    borderRadius: 10
  },
  resetPassText: {
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    width: 40,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  absoluteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: 45,
    height: 35,
    bottom: 2,
    right: 2
  },
  pressableAdd: {
    borderWidth: 2,
    borderColor: 'black',
    position: 'absolute',
    elevation: 8,
    borderRadius: 10,
    width: 35,
    height: 35,
    right: 0,
    bottom: 65
  },
});
