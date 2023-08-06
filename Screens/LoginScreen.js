import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Platform,
  StyleSheet,
} from "react-native";
import { useDispatch } from "react-redux";
import BgImage from "../components/BgImage";
import BtnSubmit from "../components/BtnSubmit";
import InputDefault from "../components/InputDefault";
import InputPassword from "../components/InputPassword";
import TextTitle from "../components/TextTitle";
import { authSignIn } from "../redux/auth/authOperations";

const LoginScreen = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isShowKeyboard, isSetShowKeyboard] = useState(false);
  const [nameActiveInput, setNameActiveInput] = useState("");
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const handleActive = (focus, name) => {
    if (focus === "onFocus") {
      name === "email"
        ? setNameActiveInput("email")
        : setNameActiveInput("password");
      return isSetShowKeyboard(true);
    }
    if (focus === "onBlur") {
      setNameActiveInput("");
      isSetShowKeyboard(false);
    }
  };

  const handleUseKeyboard = () => {
    isSetShowKeyboard(false);
    Keyboard.dismiss();
  };

  const handleSubmit = () => {
    if (email === "" || password === "") {
      return;
    }

    dispatch(authSignIn({ email, password })).then((res) => {
      if (res.error) {
        return alert(res.payload);
      }
      setEmail("");
      setPassword("");
      setNameActiveInput("");
      handleUseKeyboard();
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handleUseKeyboard}>
      <View style={styles.container}>
        <BgImage>
          <View
            style={{
              ...styles.wrap,
              paddingBottom: isShowKeyboard
                ? Platform.OS == "ios"
                  ? 260
                  : 32
                : 110,
            }}
          >
            <TextTitle title="Sign In" />

            <InputDefault
              nameActiveInput={nameActiveInput}
              placeholder="Email"
              setChange={setEmail}
              handleActive={handleActive}
              name="email"
              value={email}
            />

            <InputPassword
              nameActiveInput={nameActiveInput}
              setPassword={setPassword}
              password={password}
              handleActive={handleActive}
            />
            {!isShowKeyboard && (
              <>
                <BtnSubmit title={"Login"} onSubmit={handleSubmit} />

                <Text style={styles.textBottom}>
                  Don't have an account?{" "}
                  <Text onPress={() => navigate("Registration")}>Register</Text>
                </Text>
              </>
            )}
          </View>
        </BgImage>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  wrap: {
    backgroundColor: "#fff",

    width: "100%",
    alignItems: "center",
    paddingTop: 32,
    paddingHorizontal: 10,

    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  textBottom: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",

    marginTop: 16,
    color: "#1B4371",
  },
});

export default LoginScreen;
