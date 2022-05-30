import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, Pressable } from 'react-native';
import { Switch, Button, Text, Input, Overlay } from 'react-native-elements';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons, } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import Toast from 'react-native-root-toast';
import * as AccMethods from './AccountMethods';

export default function CreatePasswordScreen() {
  const [provider, setProvider] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loggedUser, setLoggedUser] = useState();
  const [upperLetters, setUpperLetters] = useState('on');
  const [lowerLetters, setLowerLetters] = useState('on');
  const [numbers, setNumbers] = useState('on');
  const [special, setSpecial] = useState('on');
  const [length, setLength] = useState(15);
  const [security, setSecurity] = useState(true);
  const [visible, setVisible] = useState(false);
  const [passVisibility, setPassVisibility] = useState('eye-outline')
  const [isEnabledUpperLetters, setIsEnabledUpperLetters] = useState(true);
  const [isEnabledLowerLetters, setIsEnabledLowerLetters] = useState(true);
  const [isEnabledNumbers, setIsEnabledNumbers] = useState(true);
  const [isEnabledSpecial, setIsEnabledSpecial] = useState(true);
  const toggleSwitchUpperLetters = () => setIsEnabledUpperLetters(previousState => !previousState);
  const toggleSwitchLowerLetters = () => setIsEnabledLowerLetters(previousState => !previousState);
  const toggleSwitchNumbers = () => setIsEnabledNumbers(previousState => !previousState);
  const toggleSwitchSpecial = () => setIsEnabledSpecial(previousState => !previousState);

  //Copy username or password to clipboard    
  const copyToClipboard = () => {
    Clipboard.setString(`${password}`)
    Toast.show(`Copied to clipboard`, {
      duration: Toast.durations.SHORT,
      position: -75,
      animation: true,
      hideOnPress: true,
    });
  };
  //Toggle overlay for credential info on/off
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  //Fetch password via API with chosen settings    
  const generate = () => {
    if (numbers == 'off' && upperLetters == 'off' && lowerLetters == 'off' && special == 'off') {
      Alert.alert('', 'Atleast 1 setting has to be enabled\nto generate password');
    } else {
      fetch(`https://passwordwolf.com/api/?length=${length}&upper=${upperLetters}&lower=${lowerLetters}&numbers=${numbers}&special=${special}&repeat=1`)
        .then(response => response.json())
        .then(responseJson => { setPassword(responseJson[0].password) })
        .catch(error => {
          Alert.alert('Error', error);
        });
    }
  };
  //Observer for current user    
  useEffect(() => {
    const checkUser = async () => {
      let result = await AccMethods.currentUserName();
      if (result) {
        let uid = await AccMethods.getUID(result);
        setLoggedUser(uid);
      }
    }
    checkUser();
  }, []
  );
  //Save new credential info  
  async function save() {
    if (provider && userName && password != '') {
      let newEntry = { provider: provider, user: userName, password: password };
      let result = await AccMethods.addCredentials(loggedUser, newEntry);
      if (result) {
        toggleOverlay();
        setProvider();
        setUserName();
        Toast.show(`✔  Saved`, {
          duration: Toast.durations.SHORT,
          backgroundColor: 'green',
          position: -75,
          animation: true,
          hideOnPress: true,
        });
      }
    } else {
      Alert.alert('', 'Required fields:\nProvider, Username, Password')
    }
  };
  //Observers(5) for password settings
  useEffect(() => {
    if (isEnabledUpperLetters == false) {
      setUpperLetters('off');
    } else {
      setUpperLetters('on')
    }
  }, [isEnabledUpperLetters]
  );
  useEffect(() => {
    if (isEnabledLowerLetters == false) {
      setLowerLetters('off');
    } else {
      setLowerLetters('on')
    }
  }, [isEnabledLowerLetters]
  );
  useEffect(() => {
    if (isEnabledNumbers == false) {
      setNumbers('off');
    } else {
      setNumbers('on')
    }
  }, [isEnabledNumbers]
  );
  useEffect(() => {
    if (isEnabledSpecial == false) {
      setSpecial('off');
    } else {
      setSpecial('on')
    }
  }, [isEnabledSpecial]
  );
  //Show or hide password
  const showHidePassword = () => {
    if (security == true) {
      setSecurity(false);
      setPassVisibility('eye-off-outline');
    } else {
      setSecurity(true);
      setPassVisibility('eye-outline');
    }
  };
  //Show generated password and copy/save/show buttons for it
  const PasswordAndOptions = () => {
    if (password != '') {
      return (
        <View style={styles.passwordAndCopy}>
          <View style={{ width: 350 }}>
            <Input
              textAlign='center'
              secureTextEntry={security}
              editable={false}
              style={{ fontSize: 16, width: '99%', height: 18, color: 'black' }}>{`${password}`}
            </Input>
          </View>
          <View style={styles.passwordOptions}>
            <Button
              type="clear"
              onPress={copyToClipboard}
              icon={<MaterialIcons name="content-copy" size={25} />}
            />
            <Button
              type="clear"
              onPress={toggleOverlay}
              icon={<Ionicons name="key-outline" size={25} />}
            />
            <Button
              type="clear"
              onPress={showHidePassword}
              icon={<Ionicons name={passVisibility} size={25} />}
            />
          </View>
        </View>
      )
    }
    return (
      null
    )
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#a5c7b7', '#5d4257']}
        //colors={['#d2ccc4', '#2f4353']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Text
        style={{ marginTop: 70, fontStyle: "italic", fontSize: 18 }}
      >Password Generation
      </Text>

      <View style={styles.options}>
        <View >
          <View style={styles.switchText}><Text>Upper case</Text></View>
          <View style={styles.switchText}><Text>Lower case</Text></View>
          <View style={styles.switchText}><Text>Numbers</Text></View>
          <View style={styles.switchText}><Text>Specials</Text></View>

        </View>
        <View>
          <Switch
            trackColor={{ false: "#767577", true: "#355AC5" }}
            thumbColor={isEnabledUpperLetters ? "#0477ea" : "darkgrey"}
            onValueChange={toggleSwitchUpperLetters}
            value={isEnabledUpperLetters}
          />
          <Switch
            trackColor={{ false: "#767577", true: "#355AC5" }}
            thumbColor={isEnabledLowerLetters ? "#0477ea" : "darkgrey"}
            onValueChange={toggleSwitchLowerLetters}
            value={isEnabledLowerLetters}
          />
          <Switch
            trackColor={{ false: "#767577", true: "#355AC5" }}
            thumbColor={isEnabledNumbers ? "#0477ea" : "darkgrey"}
            onValueChange={toggleSwitchNumbers}
            value={isEnabledNumbers}
          />
          <Switch
            trackColor={{ false: "#767577", true: "#355AC5" }}
            thumbColor={isEnabledSpecial ? "#0477ea" : "darkgrey"}
            onValueChange={toggleSwitchSpecial}
            value={isEnabledSpecial}
          />
        </View>
      </View>
      <View style={styles.slider}>
        <View style={styles.sliderText}>
          <Text>{`Length: ${length}`}</Text>
        </View>
        <View>
          <Slider
            style={{ width: 200, height: 30 }}
            minimumValue={1}
            maximumValue={30}
            step={1}
            value={length}
            onValueChange={
              (sliderValue) => setLength(sliderValue)
            }
            minimumTrackTintColor="#355AC5"
            maximumTrackTintColor="#4e4d4f"
            thumbTintColor='#0477ea'
          />
        </View>
      </View>
      <Pressable style={styles.logScreenButtons} onPress={generate}>
        {({ pressed }) => (
          <LinearGradient
            colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
            start={{ x: 0.0, y: 0.25 }}
            end={{ x: 1.0, y: 1.0 }}
            locations={[0.3, 1.0]}
            style={styles.button}>
            <Text style={styles.textStyling}>Generate</Text>
          </LinearGradient>
        )}
      </Pressable>
      <PasswordAndOptions />
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={styles.overlayView}
      >
        <Input
          placeholder='Provider name'
          label='Provider'
          leftIcon={<Ionicons name="briefcase-outline" size={25} color='black' />}
          onChangeText={value => setProvider(value)}
        />
        <Input
          placeholder='Username'
          label='User'
          leftIcon={<Ionicons name="person-outline" size={25} color='black' />}
          onChangeText={value => setUserName(value)}
        />
        <Input
          label='Password'
          leftIcon={<Ionicons name="key-outline" size={25} color='black' />}
          rightIcon={<Button type="clear" onPress={showHidePassword}
            icon={<Ionicons name={passVisibility} size={25} />}
          />}
          value={password}
          secureTextEntry={security}
          onChangeText={value => setPassword(value)}
        />
        <Pressable style={styles.overlayButton} onPress={() => save()}>
          {({ pressed }) => (
            <LinearGradient
              colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
              start={{ x: 0.0, y: 0.25 }}
              end={{ x: 1.0, y: 1.0 }}
              locations={[0.3, 1.0]}
              style={styles.button}>
              <Text style={styles.textStyling}>Save</Text>
            </LinearGradient>
          )}
        </Pressable>
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5e5e5e',
    alignItems: 'center'
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
  textStyling: {
    color: '#FFFFFF',
    fontSize: 15,
    opacity: 0.65
  },
  passwordAndCopy: {
    marginTop: 25,
    alignItems: 'center'
  },
  passwordOptions: {
    flexDirection: 'row',
  },
  options: {
    flexDirection: 'row',
    width: '70%',
    marginTop: 20
  },
  slider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%'
  },
  switchText: {
    height: 48,
    justifyContent: 'center',
    marginRight: 60
  },
  sliderText: {
    height: 48,
    justifyContent: 'center',
    marginRight: 5,
  },
  overlayView: {
    width: 280,
    borderRadius: 15,
    backgroundColor: '#d3d3d3',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '130%',
    borderRadius: 15
  },
});

