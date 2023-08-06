import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { getUserIsLoading } from '../redux/auth/authSelectors';

const BtnSubmit = ({ title, onSubmit, disabled = false, loading = false }) => {
  const isLoading = useSelector(getUserIsLoading);
  const loadBtn = isLoading || loading;

  return (
    <TouchableOpacity
      disabled={disabled || loadBtn}
      activeOpacity={0.8}
      style={{ ...styles.btnSend, backgroundColor: disabled || loadBtn ? '#F6F6F6' : '#FF6C00' }}
      onPress={onSubmit}
    >
      {loadBtn ? (
        <ActivityIndicator size="small" />
      ) : (
        <Text style={{ ...styles.btnSendText, color: disabled ? '#bdbdbd' : '#fff' }}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnSend: {
    borderRadius: 100,
    padding: 16,
    width: '100%',
  },
  btnSendText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,

    textAlign: 'center',
  },
});

export default BtnSubmit;
