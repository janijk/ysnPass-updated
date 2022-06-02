import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Pressable, FlatList, Image } from 'react-native';
import { Button, Text, Input, Overlay, ListItem } from 'react-native-elements';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons, } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';
import { LinearGradient } from 'expo-linear-gradient';
import Tooltip from 'rn-tooltip';
import * as AccMethods from './AccountMethods';
import { useIsFocused } from '@react-navigation/native';

export default function PasswordsScreen() {
  const [credentials, setCredentials] = useState([]);
  const [loggedUser, setLoggedUser] = useState();
  const [provider, setProvider] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [indexOfEdit, setIndexOfEdit] = useState('');
  const [visible, setVisible] = useState(false);
  const [visibleTwo, setVisibleTwo] = useState(false);
  const [passVisibility, setPassVisibility] = useState('eye-outline')
  const [security, setSecurity] = useState(true);
  const isFocused = useIsFocused();

  // Get current user uid and update credential list
  useEffect(() => {
    const checkUser = async () => {
      let isMounted = true;
      let result = await AccMethods.currentUserName();
      if (isMounted) {
        if (result) {
          let uid = await AccMethods.getUID(result);
          setLoggedUser(uid);
          let creds = await AccMethods.getCredentials(uid);
          setCredentials(creds);
        }
      }
    }
    if (isFocused == true) {
      checkUser();
    }
  }, [isFocused]
  );
  //Copy username or password to clipboard
  const copyToClipboard = (value) => {
    Clipboard.setString(value);
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
  const toggleOverlayTwo = () => {
    setVisibleTwo(!visibleTwo);
  };
  //Separator for credential listing
  const seprator = () => {
    return (
      <View style={styles.seprator}></View>
    )
  };
  //Footer for credential listing
  const flatlistFooter = () => {
    return (
      <View>
        <View style={styles.seprator}></View>
        <View style={styles.flFooter}>
          <Text>The End of List</Text>
        </View>
      </View>
    )
  };
  //Header for credential listing
  const flatlistHeader = () => {
    return (
      <View style={styles.flHeader}></View>
    )
  };
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
  //Save new credential info to SecureStore
  async function saveCreds() {
    if (provider && userName && password != '') {
      let newEntry = { provider: provider, user: userName, password: password };
      let result = await AccMethods.addCredentials(loggedUser, newEntry);
      if (result) {
        let cache = credentials;
        cache.push(newEntry);
        setCredentials(cache);
        toggleOverlay();
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
  // Save edited credentials
  async function saveEditedCreds() {
    if (provider && userName && password != '') {
      let edited = { provider: provider, user: userName, password: password };
      let result = await AccMethods.editCredentials(loggedUser, edited, indexOfEdit);
      if (result) {
        let cache = credentials;
        credentials[indexOfEdit] = edited;
        setCredentials(cache);
        toggleOverlayTwo();
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
  //Delete chosen credential
  const deleteCred = (ind, provider) => {
    Alert.alert('', `Are you sure you want\nto delete: ${provider}?`,
      [{ text: 'Delete', onPress: () => deleteCredConfirmed(ind) }, { text: 'Cancel' }])
  };
  async function deleteCredConfirmed(ind) {
    let result = await AccMethods.deleteCredentials(loggedUser, ind);
    if (result) {
      let cache = credentials;
      cache.splice(ind, 1);
      setCredentials(cache);
      Toast.show(`✗  Deleted`, {
        duration: Toast.durations.SHORT,
        backgroundColor: 'red',
        position: -75,
        animation: true,
        hideOnPress: true,
      });
    }
  };
  // Edit credentials
  const editCred = (ind) => {
    toggleOverlayTwo();
    setProvider(credentials[ind].provider);
    setUserName(credentials[ind].user);
    setPassword(credentials[ind].password);
    setIndexOfEdit(ind);
  };
  //Credentials FlatList
  const PasswordListing = () => {
    return (
      <View>
        <FlatList
          data={credentials}
          ItemSeparatorComponent={seprator}
          keyExtractor={(_, index) => index.toString()}
          ListFooterComponent={flatlistFooter}
          ListHeaderComponent={flatlistHeader}
          renderItem={({ item, index }) =>
            <View>
              <View style={styles.passwordListItems}>
                <ListItem.Title>{item.provider}</ListItem.Title>
                <View style={{ flexDirection: "row" }}>
                  <Button
                    type="clear"
                    onPress={() => editCred(index)}
                    icon={<Ionicons name="build-outline" size={15} />}
                  />
                  <Button
                    type="clear"
                    onPress={() => deleteCred(index, item.provider)}
                    icon={<Ionicons name="md-trash-outline" size={15} />}
                  />
                </View>

              </View>
              <View style={styles.passwordListItems}>
                <ListItem.Subtitle >{item.user}</ListItem.Subtitle>
                <Button
                  type="clear"
                  onPress={() => copyToClipboard(item.user)}
                  icon={<MaterialIcons name="content-copy" size={15} />}
                />
              </View>
              <View style={styles.passwordListItems}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ListItem.Subtitle>⬤⬤⬤⬤⬤  </ListItem.Subtitle>
                  <Tooltip
                    height={58}
                    width={180}
                    overlayColor='opaque'
                    popover={<Text>{item.password}</Text>}>
                    <Ionicons name="eye-outline" size={16} />
                  </Tooltip>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Button
                    type="clear"
                    onPress={() => copyToClipboard(item.password)}
                    icon={<MaterialIcons name="content-copy" size={15} />}
                  />
                </View>
              </View>
            </View>}
        />
      </View >
    )
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#a5c7b7', '#5d4257']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
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
          placeholder='Password'
          label='Password'
          leftIcon={<Ionicons name="key-outline" size={25} color='black' />}
          rightIcon={<Button type="clear" onPress={showHidePassword}
            icon={<Ionicons name={passVisibility} size={25} />}
          />}
          secureTextEntry={security}
          onChangeText={value => setPassword(value)}
        />
        <Pressable style={styles.overlayButton} onPress={() => saveCreds()}>
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
      <Overlay
        isVisible={visibleTwo}
        onBackdropPress={toggleOverlayTwo}
        overlayStyle={styles.overlayView}
      >
        <Input
          placeholder='Provider name'
          label='Provider'
          value={`${provider}`}
          leftIcon={<Ionicons name="briefcase-outline" size={25} color='black' />}
          onChangeText={value => setProvider(value)}
        />
        <Input
          placeholder='Username'
          label='Username'
          value={`${userName}`}
          leftIcon={<Ionicons name="person-outline" size={25} color='black' />}
          onChangeText={value => setUserName(value)}
        />
        <Input
          placeholder='Password'
          label='Password'
          value={`${password}`}
          leftIcon={<Ionicons name="key-outline" size={25} color='black' />}
          rightIcon={<Button type="clear" onPress={showHidePassword}
            icon={<Ionicons name={passVisibility} size={25} />}
          />}
          secureTextEntry={security}
          onChangeText={value => setPassword(value)}
        />
        <Pressable style={styles.overlayButton} onPress={() => saveEditedCreds()}>
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
      <View style={styles.passwordList}>
        <PasswordListing />
      </View>
      <Pressable style={styles.pressableAdd} onPress={toggleOverlay}>
        {({ pressed }) => (
          <LinearGradient
            colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
            start={{ x: 0.0, y: 0.25 }}
            end={{ x: 1.0, y: 1.0 }}
            locations={[0.3, 1.0]}
            style={styles.logScreenButtons}>
            <Image Image style={styles.add} source={require('./add.png')} />
          </LinearGradient>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5e5e5e'
  },
  button: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  logScreenButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    width: 55,
    height: 55,
    bottom: 2,
    right: 2
  },
  pressableAdd: {
    borderWidth: 2,
    borderColor: 'black',
    position: 'absolute',
    elevation: 8,
    borderRadius: 30,
    width: 55,
    height: 55,
    right: 15,
    bottom: 65
  },
  textStyling: {
    color: '#FFFFFF',
    fontSize: 15,
    opacity: 0.65
  },
  textStylingAdd: {
    color: '#FFFFFF',
    fontSize: 35,
    opacity: 0.7,
  },
  overlayView: {
    width: 280,
    borderRadius: 15,
    backgroundColor: '#d3d3d3'
  },
  passwordList: {
    width: '90%',
    flex: 5,
    marginBottom: 50,
    marginTop: 20
  },
  addButtonPostition: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-end',
  },
  passwordListItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '130%',
    borderRadius: 15
  },
  overlayButton: {
    borderRadius: 10,
    width: 260,
  },
  seprator: {
    height: 1,
    backgroundColor: '#03095e',
    marginTop: 5,
    marginBottom: 5
  },
  flFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  flHeader: {
    marginTop: 20
  },
  add: {
    width: 100,
    height: 100,
    opacity: 0.8,
    marginRight: 9
  },
});