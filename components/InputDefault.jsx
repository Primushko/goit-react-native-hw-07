import { StyleSheet, TextInput } from 'react-native';

const InputDefault = ({ nameActiveInput, placeholder, setChange, handleActive, name, value }) => {
  return (
    <TextInput
      style={
        nameActiveInput === name
          ? { ...styles.input, ...styles.inputActive, marginBottom: 16 }
          : { ...styles.input, marginBottom: 16 }
      }
      placeholderTextColor="#BDBDBD"
      placeholder={placeholder}
      onChangeText={text => setChange(text)}
      onFocus={() => handleActive('onFocus', name)}
      onBlur={() => handleActive('onBlur', name)}
      value={value}
      keyboardType={name === 'email' ? 'email-address' : 'default'}
    />
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
});
export default InputDefault;
