import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

const LoginScreen = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
    checkStoredCredentials();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);
  };

  const checkStoredCredentials = async () => {
    let result = await SecureStore.getItemAsync("isLoggedIn");
    if (result === "true") {
      navigation.navigate("Home");
    }
  };

  const handleLogin = async () => {
    // if the USER ID or Password is empty, we return
    if (!userId || !password) {
      Alert.alert("Error", "User ID and Password cannot be empty");
      return;
    }
    // we encrypt the given userID and password and store it in Encrypted storage
    const credentials = { userId, password };
    await SecureStore.setItemAsync(credentials.userId, credentials.password);
    await SecureStore.setItemAsync("isLoggedIn", "true"); // Mark user as logged in

    // Biometric login
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate",
      fallbackLabel: "Enter Password",
    });
    if (result.success) {
      Alert.alert("Biometric Authentication Successful");
      navigation.navigate("Home");
    } else {
      Alert.alert("Biometric Authentication Failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="User ID"
        value={userId}
        onChangeText={setUserId}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {isBiometricSupported && (
        <Button title="Login with Biometrics" onPress={handleLogin} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});

export default LoginScreen;
