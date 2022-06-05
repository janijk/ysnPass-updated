import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, Alert } from 'react-native';
import { Overlay, Switch } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework, writeAsStringAsync } from 'expo-file-system';

import Toast from 'react-native-root-toast';
import * as AccMethods from './AccountMethods';

export default function SettingsScreen() {
    const [passCurrent, setPassCurrent] = useState();
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState();
    const [pincode, setPincode] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [isEnabledRememberUser, setIsEnabledRememberUser] = useState(false);
    const toggleSwitchRememberUser = () => setIsEnabledRememberUser(previousState => !previousState);
    const [isEnabledPin, setIsEnabledPin] = useState(null);
    const toggleSwitchPin = () => setIsEnabledPin(previousState => !previousState);

    //Observer for remember user and pin
    useEffect(() => {
        checkForState();
        checkForStatePin();
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
    useEffect(() => {
        if (isEnabledPin == false) {
            pin(false);
        } else if (isEnabledPin == true) {
            pin(true, pincode);
        }
    }, [isEnabledPin]
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
    //Save info about pin
    async function pin(option) {
        if (option == false) {
            await AccMethods.setPin(false);
        } else if (option == true) {
            let result = await AccMethods.getPin();
            if (result) {
                return;
            } else {
                setModalVisible(true);
            }
        }
    };
    // Check state for switches
    async function checkForState() {
        let result = await AccMethods.getUsualUser();
        if (result == false) {
            setIsEnabledRememberUser(false);
        } else {
            setIsEnabledRememberUser(true)
        }
    };
    async function checkForStatePin() {
        let result = await AccMethods.getPin();
        if (result == true) {
            setIsEnabledPin(true);
        } else if (result == false) {
            setIsEnabledPin(false);
        }
    };
    // modal backdrop press
    const noPin = () => {
        setModalVisible(false);
        setPincode('');
        setIsEnabledPin(false);
    };
    // Set pincode
    async function setThisPincode() {
        if (pincode.length == 4) {
            let result = await AccMethods.setPin(true, pincode)
            if (result) {
                Toast.show(`✔  Pincode set`, {
                    duration: Toast.durations.SHORT,
                    backgroundColor: 'green',
                    position: -75,
                    animation: true,
                    hideOnPress: true,
                });
                setModalVisible(false);
            }
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
    //Download credentials as JSON file
    async function downloadFile() {
        let user = await AccMethods.currentUserName();
        let uid = await AccMethods.getUID(user);
        let result = await AccMethods.getCredentials(uid);
        let json = JSON.stringify(result);
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();

        await StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            'Credentials',
            'application/json'
        )
            .then(async (uri) => {
                console.log('what')
                await FileSystem.writeAsStringAsync(uri, json);
            })
            .catch(error => {
                console.log(uri)
                console.error(error);
            });
    };
    //Upload credentials from JSON file
    async function uploadFile() {
        let user = await AccMethods.currentUserName();
        let uid = await AccMethods.getUID(user);
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
        let creds = '';

        await StorageAccessFramework.readDirectoryAsync(permissions.directoryUri)
            .then(async (uri) => {
                if (uri.indexOf('Credentials.json')) {
                    creds = await FileSystem.readAsStringAsync(uri[0]);
                }
            })
            .catch(error => {
                console.error(error);
                Alert.alert('', 'Credentials.json not found in directory.');
            });

        if (creds != '') {
            await AccMethods.uploadJSON(uid, creds);
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
                <Pressable style={styles.logScreenButtons} onPress={() => downloadFile()}>
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
                <Pressable style={styles.logScreenButtons} onPress={() => uploadFile()}>
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
                <View style={styles.options}>
                    <View >
                        <View style={styles.switchText}><Text>Pincode</Text></View>
                    </View>
                    <View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#355AC5" }}
                            thumbColor={isEnabledPin ? "#0477ea" : "darkgrey"}
                            onValueChange={toggleSwitchPin}
                            value={isEnabledPin}
                        />
                    </View>
                </View>
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
                <Text style={{ fontStyle: "italic", fontSize: 18, textAlign: 'center' }}>Change Password</Text>
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
            <Overlay
                isVisible={modalVisible}
                onBackdropPress={() => noPin()}
                overlayStyle={{ borderRadius: 15, elevation: 8 }}
            >
                <LinearGradient
                    colors={['#a5c7b7', '#5d4257']}
                    style={styles.backgroundOverlay}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                <Text style={{ fontStyle: "italic", fontSize: 18, textAlign: 'center', width: 200 }}>Set Pincode</Text>
                <TextInput
                    secureTextEntry={true}
                    style={styles.pinTextInputs}
                    placeholder='Pincode'
                    keyboardType='numeric'
                    maxLength={4}
                    fontSize={15}
                    onChangeText={text => setPincode(text)} />
                <Pressable style={styles.overlayButton} onPress={() => setThisPincode()}>
                    {({ pressed }) => (
                        <LinearGradient
                            colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
                            start={{ x: 0.0, y: 0.25 }}
                            end={{ x: 1.0, y: 1.0 }}
                            locations={[0.3, 1.0]}
                            style={styles.button}>
                            <Text style={styles.textStyling}>Set</Text>
                        </LinearGradient>
                    )}
                </Pressable>
            </Overlay>
            <View style={{ flex: 1 }}>
            </View>
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
        marginTop: 15,
        marginHorizontal: 20,
        textAlign: 'center'
    },
    pinTextInputs: {
        borderRadius: 10,
        overflow: 'hidden',
        borderColor: 'black',
        borderWidth: 1,
        width: 100,
        height: 35,
        marginTop: 15,
        marginHorizontal: 20,
        textAlign: 'center',
        alignSelf: 'center'
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
        marginTop: 20,
        borderRadius: 10,
        marginHorizontal: 20,

    },
    options: {
        flexDirection: 'row',
        width: '70%',
        marginTop: 15
    },
    switchText: {
        height: 48,
        justifyContent: 'center',
        width: 150
    },
});