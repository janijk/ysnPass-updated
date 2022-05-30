import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-root-toast';
import * as AccMethods from './AccountMethods'

export default function AccountCreationScreen({ navigation }) {
    const [user, setUser] = useState();
    const [pass, setPass] = useState();

    // Create new account   
    async function newUser() {
        if (user == null || pass == null) {
            Toast.show(`Fill Username & Password`, {
                duration: Toast.durations.SHORT,
                position: 300,
                opacity: 0.65,
                animation: true,
                hideOnPress: true,
            });
        } else {
            let x = await AccMethods.createAccount(user, pass);
            if (x == true) {
                navigation.navigate('login')
                Toast.show(`✔  Account created`, {
                    duration: Toast.durations.SHORT,
                    backgroundColor: 'green',
                    position: -75,
                    animation: true,
                    hideOnPress: true,
                });
            } else if (x == false) {
                Toast.show(`Username already in use`, {
                    duration: Toast.durations.SHORT,
                    position: 300,
                    opacity: 0.65,
                    animation: true,
                    hideOnPress: true,
                });
            }
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
            <View style={styles.pngView}>
                <Image style={styles.logo} source={require('./logo.png')} />
            </View>
            <View style={styles.midContent}>
                <View>
                    <TextInput
                        style={styles.logScreenTextInputs}
                        placeholder='Username'
                        onChangeText={text => setUser(text)} />

                </View>
                <View>
                    <TextInput
                        secureTextEntry={true}
                        style={styles.logScreenTextInputs}
                        placeholder='Password'
                        onChangeText={text => setPass(text)} />
                </View>
                <View>
                    <Pressable style={styles.logScreenButtons} onPress={() => newUser()}>
                        {({ pressed }) => (
                            <LinearGradient
                                colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
                                start={{ x: 0.0, y: 0.25 }}
                                end={{ x: 1.0, y: 1.0 }}
                                locations={[0.3, 1.0]}
                                style={styles.button}>
                                <Text style={styles.textStyling}>Create account</Text>
                            </LinearGradient>
                        )}
                    </Pressable>
                </View>
            </View>
            <View style={styles.resetTextPlace}>

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
});