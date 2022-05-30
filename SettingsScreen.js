import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, Alert, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Overlay, Switch } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-root-toast';
import * as AccMethods from './AccountMethods';

export default function SettingsScreen() {
    const [passCurrent, setPassCurrent] = useState();
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState();
    const [modalVisible2, setModalVisible2] = useState(false);
    const [isEnabledRememberUser, setIsEnabledRememberUser] = useState(false);
    const toggleSwitchRememberUser = () => setIsEnabledRememberUser(previousState => !previousState);

    //Observer for remember user
    useEffect(() => {
        checkForState();
    }, []
    );
    useEffect(() => {
        if (isEnabledRememberUser == false) {
            rememberThisUser(false)
        } else {
            rememberThisUser(true);
        }
    }, [isEnabledRememberUser]
    );
    //Save info about remembering user
    async function rememberThisUser(option) {
        if (option == false) {
            await AccMethods.setUsualUser(false);
        } else if (option == true) {
            let user = await AccMethods.currentUserName();
            await AccMethods.setUsualUser(true, user);
        }
    };
    // Check state for switch
    async function checkForState() {
        let result = await AccMethods.getUsualUser();
        if (result) {
            setIsEnabledRememberUser(true)
        } else {
            setIsEnabledRememberUser(false)
        }
    };
    //Change password
    async function change() {
        if (pass1 == pass2) {
            let user = await AccMethods.currentUserName();
            let result = await AccMethods.changePassword(user, pass1, passCurrent);
            if (result) {
                setModalVisible2(!modalVisible2);
                Toast.show(`✔  Password updated`, {
                    duration: Toast.durations.SHORT,
                    backgroundColor: 'green',
                    position: -75,
                    animation: true,
                    hideOnPress: true,
                });
            } else if (!result) {
                Toast.show(`Wrong password`, {
                    duration: Toast.durations.SHORT,
                    backgroundColor: 'red',
                    position: 100,
                    opacity: 0.65,
                    animation: true,
                    hideOnPress: true,
                });
            }
        } else {
            Alert.alert('', 'Passwords dont match.')
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#a5c7b7', '#5d4257']}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <View style={styles.midContent}>
                <Pressable style={styles.logScreenButtons} onPress={() => setModalVisible2(true)}>
                    {({ pressed }) => (
                        <LinearGradient
                            colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
                            start={{ x: 0.0, y: 0.25 }}
                            end={{ x: 1.0, y: 1.0 }}
                            locations={[0.3, 1.0]}
                            style={styles.button}>
                            <Text style={styles.textStyling}>Change password</Text>
                        </LinearGradient>
                    )}
                </Pressable>
                <Pressable style={styles.logScreenButtons} onPress={console.log('not yet implemented')}>
                    {({ pressed }) => (
                        <LinearGradient
                            colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
                            start={{ x: 0.0, y: 0.25 }}
                            end={{ x: 1.0, y: 1.0 }}
                            locations={[0.3, 1.0]}
                            style={styles.button}>
                            <Text style={styles.textStyling}>Download</Text>
                        </LinearGradient>
                    )}
                </Pressable>
                <Pressable style={styles.logScreenButtons} onPress={console.log('not yet implemented')}>
                    {({ pressed }) => (
                        <LinearGradient
                            colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
                            start={{ x: 0.0, y: 0.25 }}
                            end={{ x: 1.0, y: 1.0 }}
                            locations={[0.3, 1.0]}
                            style={styles.button}>
                            <Text style={styles.textStyling}>Upload</Text>
                        </LinearGradient>
                    )}
                </Pressable>
                <View style={styles.options}>
                    <View >
                        <View style={styles.switchText}><Text>Remember me</Text></View>
                    </View>
                    <View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#355AC5" }}
                            thumbColor={isEnabledRememberUser ? "#0477ea" : "darkgrey"}
                            onValueChange={toggleSwitchRememberUser}
                            value={isEnabledRememberUser}
                        />
                    </View>
                </View>
            </View>
            <View style={{ flex: 1 }}>
            </View>
            <Overlay
                isVisible={modalVisible2}
                onBackdropPress={() => setModalVisible2(false)}
                overlayStyle={{ borderRadius: 15, elevation: 8 }}
            >
                <LinearGradient
                    colors={['#a5c7b7', '#5d4257']}
                    style={styles.backgroundOverlay}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                <TextInput
                    secureTextEntry={true}
                    style={styles.logScreenTextInputs}
                    placeholder='Current password'
                    onChangeText={text => setPassCurrent(text)} />
                <TextInput
                    secureTextEntry={true}
                    style={styles.logScreenTextInputs}
                    placeholder='New password'
                    onChangeText={text => setPass1(text)} />
                <TextInput
                    secureTextEntry={true}
                    style={styles.logScreenTextInputs}
                    placeholder='Repeat new password'
                    onChangeText={text => setPass2(text)} />
                <Pressable style={styles.overlayButton} onPress={() => change()}>
                    {({ pressed }) => (
                        <LinearGradient
                            colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
                            start={{ x: 0.0, y: 0.25 }}
                            end={{ x: 1.0, y: 1.0 }}
                            locations={[0.3, 1.0]}
                            style={styles.button}>
                            <Text style={styles.textStyling}>Change</Text>
                        </LinearGradient>
                    )}
                </Pressable>
            </Overlay>
            {/* maybe future update
        <Pressable style={styles.pressableAdd} onPress={() => setModalVisible2(true)}>
          {({ pressed }) => (
            <LinearGradient
              colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
              start={{ x: 0.0, y: 0.25 }}
              end={{ x: 1.0, y: 1.0 }}
              locations={[0.3, 1.0]}
              style={styles.absoluteButton}>
              <Ionicons name={"md-finger-print-outline"} size={25} />
            </LinearGradient>
          )}
        </Pressable>
          */}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    midContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
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
    logScreenTextInputs: {
        borderRadius: 10,
        overflow: 'hidden',
        borderColor: 'black',
        borderWidth: 1,
        width: 200,
        height: 35,
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
    options: {
        flexDirection: 'row',
        width: '70%',
        marginTop: 20
    },
    switchText: {
        height: 48,
        justifyContent: 'center'
    },
});