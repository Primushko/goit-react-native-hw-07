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
import InputAvatar from "../components/InputAvatar";
import InputDefault from "../components/InputDefault";
import InputPassword from "../components/InputPassword";
import TextTitle from "../components/TextTitle";
import { authSignUp } from "../redux/auth/authOperations";

const RegistrationScreen = ({}) => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);

  const [isShowKeyboard, isSetShowKeyboard] = useState(false);
  const [nameActiveInput, setNameActiveInput] = useState("");

  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const handleActive = (focus, name) => {
    if (focus === "onFocus") {
      name === "login" && setNameActiveInput("login");
      name === "email" && setNameActiveInput("email");
      name === "password" && setNameActiveInput("password");

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

  const handleSubmit = async () => {
    if (email === "" || password === "" || login === "") {
      return;
    }

    dispatch(authSignUp({ login, image, email, password })).then((res) => {
      if (res.error) {
        return alert(res.payload);
      }
      setLogin("");
      setEmail("");
      setImage(null);
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
                  ? 230
                  : 32
                : 45,
            }}
          >
            <InputAvatar image={image} setImage={setImage} />
            <TextTitle title="Registration" />
            <InputDefault
              nameActiveInput={nameActiveInput}
              placeholder="Nickname"
              setChange={setLogin}
              handleActive={handleActive}
              name="login"
              value={login}
            />
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
                <BtnSubmit title={"Sign up"} onSubmit={handleSubmit} />

                <Text style={styles.textBottom}>
                  Do you have an account?{" "}
                  <Text
                    onPress={() => {
                      navigate("Login");
                    }}
                  >
                    Login
                  </Text>
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
  background: {
    flex: 1,
    justifyContent: "flex-end",
  },
  wrap: {
    backgroundColor: "#fff",
    position: "relative",

    width: "100%",
    alignItems: "center",

    paddingTop: 92,

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

export default RegistrationScreen;
