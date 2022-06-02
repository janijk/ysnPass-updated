import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as AccMethods from './AccountMethods';
import { Ionicons } from '@expo/vector-icons';


export default function HomeScreen({ navigation }) {
    const [signOutButton, setSignOutButton] = useState(false);

    // Sign out
    async function signOut() {
        let result = await AccMethods.removeCurrentUser();
        if (result) {
            navigation.navigate('HomeTwo');
        }
    };
    //Change signout yes/no back to signout after 2sec
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSignOutButton();
        }, 2000);
        return () => clearTimeout(timeout);
    }, [signOutButton]
    );
    //View for sign out buttons
    const SignOutNow = () => {
        return (
            !signOutButton ? (
                <>
                    <Pressable style={styles.logScreenButtons} onPress={() => setSignOutButton(true)}>
                        {({ pressed }) => (
                            <LinearGradient
                                colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
                                start={{ x: 0.0, y: 0.25 }}
                                end={{ x: 1.0, y: 1.0 }}
                                locations={[0.3, 1.0]}
                                style={styles.button}>
                                <Ionicons name={"log-out-outline"} size={20} />
                                <Text style={styles.textStyling}>Sign out</Text>
                            </LinearGradient>
                        )}
                    </Pressable>
                </>
            ) : (
                <>
                    <View style={{ flexDirection: 'row' }}>
                        <Pressable style={styles.signOutButtons} onPress={() => signOut()}>
                            {({ pressed }) => (
                                <LinearGradient
                                    colors={pressed ? ['#63d471', '#233329'] : ['#233329', '#63d471']}
                                    start={{ x: 0.0, y: 0.25 }}
                                    end={{ x: 1.0, y: 1.0 }}
                                    locations={[0.3, 1.0]}
                                    style={styles.button}>
                                    <Text style={styles.textStyling}>Yes</Text>
                                </LinearGradient>
                            )}
                        </Pressable>
                        <Pressable style={styles.signOutButtons} onPress={() => setSignOutButton()}>
                            {({ pressed }) => (
                                <LinearGradient
                                    colors={pressed ? ['#3f0d12', '#a71d31'] : ['#a71d31', '#3f0d12']}
                                    start={{ x: 0.0, y: 0.25 }}
                                    end={{ x: 1.0, y: 1.0 }}
                                    locations={[0.3, 1.0]}
                                    style={styles.button}>
                                    <Text style={styles.textStyling}>No</Text>
                                </LinearGradient>
                            )}
                        </Pressable>
                    </View>
                </>
            )
        )
    }
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
                <SignOutNow />
                <Pressable style={styles.logScreenButtons} onPress={() => navigation.navigate('Settings')}>
                    {({ pressed }) => (
                        <LinearGradient
                            colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
                            start={{ x: 0.0, y: 0.25 }}
                            end={{ x: 1.0, y: 1.0 }}
                            locations={[0.3, 1.0]}
                            style={styles.button}>
                            <Ionicons name={"settings-outline"} size={20} />
                            <Text style={styles.textStyling}>Settings</Text>
                        </LinearGradient>
                    )}
                </Pressable>
            </View>
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
    button: {
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row'
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
        opacity: 0.65,
        marginLeft: 15
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