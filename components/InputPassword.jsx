import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const InputPassword = ({ nameActiveInput, setPassword, password, handleActive }) => {
  const [secureText, setSecureText] = useState(true);

  return (
    <View style={styles.wrapPassword}>
      <TextInput
        style={
          nameActiveInput === 'password'
            ? { ...styles.input, ...styles.inputActive }
            : { ...styles.input }
        }
        placeholderTextColor="#BDBDBD"
        placeholder="Password"
        secureTextEntry={secureText}
        onChangeText={text => setPassword(text)}
        onFocus={() => handleActive('onFocus', 'password')}
        onBlur={() => handleActive('onBlur', 'password')}
        value={password}
      />
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.btnPassword}
        onPress={() => setSecureText(prev => !prev)}
      >
        <Text style={styles.btnPasswordText}>{secureText ? 'show' : 'hide'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: '100%',

    fontSize: 16,
    lineHeight: 19,

    padding: 16,
    fontFamily: 'Roboto-Regular',

    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
  },
  inputActive: {
    borderColor: '#FF6C00',
    backgroundColor: '#fff',
  },
  wrapPassword: {
    position: 'relative',
    width: '100%',

    marginBottom: 43,
  },
  btnPassword: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  btnPasswordText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,

    color: '#1B4371',
  },
});
export default InputPassword;
