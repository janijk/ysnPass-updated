import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-root-toast';
import * as AccMethods from './AccountMethods';

export default function LoginScreen({ navigation }) {
    const [user, setUser] = useState();
    const [pass, setPass] = useState();
    const [usualUser, setUsualUser] = useState();

    //observer for username in memory
    useEffect(() => {
        let isMounted = false;
        const checkUser = async () => {
            let result = await AccMethods.getUsualUser();
            if (!isMounted) {
                if (result && usualUser == null) {
                    setUsualUser(result);
                    setUser(result);
                } else {
                    setUsualUser('Username')
                }
            }
        }
        checkUser();
        return () => {
            isMounted == true;
        };
    }, []);
    //Sign in existing user  
    async function existingUser() {
        if (user == null || pass == null || user == '' || pass == '') {
            Toast.show(`Fill Username & Password`, {
                duration: Toast.durations.SHORT,
                position: 300,
                opacity: 0.65,
                animation: true,
                hideOnPress: true,
            });
        } else {
            let x = await AccMethods.signIn(user, pass);
            if (x) {
                //sign in
                await AccMethods.setCurrentUser(user);
                navigation.navigate('login')
            } else if (!x) {
                Toast.show(`✗ Wrong Email or Password`, {
                    duration: Toast.durations.SHORT,
                    backgroundColor: 'red',
                    position: -75,
                    animation: true,
                    hideOnPress: true,
                });
            }
        }
    };

    //Confirm password reset
    const confirmPassReset = () => {
        Alert.alert('', 'Are you sure you want\nto reset your password?',
            [{ text: 'Reset', onPress: () => resetPass() }, { text: 'Cancel' }])
    };
    // Send password reset email
    const resetPass = () => {
        sendPasswordResetEmail(auth, user)
            .then(() => {
                Toast.show(`✔  Password reset email sent!`, {
                    duration: Toast.durations.SHORT,
                    backgroundColor: 'green',
                    position: -75,
                    animation: true,
                    hideOnPress: true,
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode == 'auth/missing-email') {
                    Toast.show(`Give email address`, {
                        duration: Toast.durations.SHORT,
                        position: -75,
                        animation: true,
                        hideOnPress: true,
                    });
                } else if (errorCode == 'auth/user-not-found') {
                    Toast.show(`✗ User not found`, {
                        duration: Toast.durations.SHORT,
                        backgroundColor: 'red',
                        position: -75,
                        animation: true,
                        hideOnPress: true,
                    });
                } else {
                    Toast.show(`✗ Something went wrong`, {
                        duration: Toast.durations.SHORT,
                        backgroundColor: 'red',
                        position: -75,
                        animation: true,
                        hideOnPress: true,
                    });
                }
            });
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
                        placeholder={usualUser}
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
                    <Pressable style={styles.logScreenButtons} onPress={() => navigation.navigate('CreateAcc')}>
                        {({ pressed }) => (
                            <LinearGradient
                                colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
                                start={{ x: 0.0, y: 0.25 }}
                                end={{ x: 1.0, y: 1.0 }}
                                locations={[0.3, 1.0]}
                                style={styles.button}>
                                <Text style={styles.textStyling}>Sign up</Text>
                            </LinearGradient>
                        )}
                    </Pressable>
                    <Pressable style={styles.logScreenButtons} onPress={() => existingUser()}>
                        {({ pressed }) => (
                            <LinearGradient
                                colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
                                start={{ x: 0.0, y: 0.25 }}
                                end={{ x: 1.0, y: 1.0 }}
                                locations={[0.3, 1.0]}
                                style={styles.button}>
                                <Text style={styles.textStyling}>Sign In</Text>
                            </LinearGradient>
                        )}
                    </Pressable>
                </View>
            </View>
            <View style={styles.resetTextPlace}>
                <Text>Forgot your password? Reset via email </Text>
                <View>
                    <Pressable
                        onPress={confirmPassReset}
                        style={styles.resetPassText}
                    >
                        <Text>Here</Text>
                    </Pressable>
                </View>
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