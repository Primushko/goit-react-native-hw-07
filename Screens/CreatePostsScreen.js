import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../firebase/config";

import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

import BtnSubmit from "../components/BtnSubmit";
import uploadFile from "../utils/uploadFile";
import { getUserId } from "../redux/auth/authSelectors";

import {
  SimpleLineIcons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const CreatePostsScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [nameLocation, setNameLocation] = useState("");
  const [isOpenKeyboard, setIsOpenKeyboard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [idPhoto, setIdPhoto] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);

  const userId = useSelector(getUserId);

  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [permissionResponse, requestPermissio] = MediaLibrary.usePermissions();

  async function schedulePushNotification({ title, body }) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { data: "goes here" },
      },
      trigger: { seconds: 1 },
    });
  }

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }
  }

  useEffect(() => {
    MediaLibrary.requestPermissionsAsync();
    Camera.requestCameraPermissionsAsync();
    registerForPushNotificationsAsync();
    setCameraOn(true);
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
    })();
    return async () => {
      setCameraOn(false);
    };
  }, []);

  const handleUseKeyboard = () => {
    setIsOpenKeyboard(false);
    Keyboard.dismiss();
  };

  const takePhoto = async () => {
    try {
      if (cameraRef) {
        const { uri } = await cameraRef.takePictureAsync();

        const manipResult = await manipulateAsync(
          uri,
          [{ resize: { width: 640, height: 480 } }],
          { format: SaveFormat.JPEG }
        );

        const { id } = await MediaLibrary.createAssetAsync(manipResult.uri);
        setIdPhoto(id);
        return setPhoto(manipResult.uri);
      }

      const res = await MediaLibrary.deleteAssetsAsync(idPhoto);
      if (res) {
        setIdPhoto(null);
        setPhoto(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitForm = async () => {
    try {
      setIsLoading(true);

      const coordinate = await Location.getLastKnownPositionAsync();

      const imageURL = await uploadFile({ path: "postImage", photo });

      const data = {
        title,
        photo: imageURL,
        nameLocation,
        coordinate,
        like: [],
        comment: 0,
        userId,
        createDate: Date.now(),
      };

      const { id } = await addDoc(collection(db, "posts"), data);

      await schedulePushNotification({
        title: "Post published!!!",
        body: `Title:${title}`,
      });

      navigation.navigate("Posts");
      setIdPhoto(null);
      setPhoto(null);
      setTitle("");
      setNameLocation("");
      setIsLoading(false);
    } catch (error) {
      console.warn(error);
    }
  };

  const reset = async () => {
    try {
      setTitle("");
      setNameLocation("");
      if (idPhoto) {
        const res = await MediaLibrary.deleteAssetsAsync(idPhoto);
        if (res) {
          setIdPhoto(null);
          setPhoto(null);
        }
      }
    } catch (error) {
      console.log("reset", error);
    }
  };

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    requestPermission();
    return <Text>No access to camera</Text>;
  }

  return (
    <TouchableWithoutFeedback onPress={handleUseKeyboard}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={60}
          style={{ flex: 1, backgroundColor: "#fff" }}
        >
          <ScrollView>
            <View
              style={{
                ...styles.container,
                paddingBottom: isOpenKeyboard ? 300 : 32,
              }}
            >
              <TouchableOpacity
                onPress={() => takePhoto()}
                activeOpacity={0.7}
                style={styles.uploadImgBlock}
              >
                <View style={styles.wrapForPositionIcon}>
                  {photo ? (
                    <Image
                      style={styles.image}
                      resizeMode="cover"
                      source={{ uri: photo }}
                    />
                  ) : (
                    cameraOn && (
                      <Camera style={styles.image} ref={setCameraRef} />
                    )
                  )}
                  <View
                    style={{
                      ...styles.wrapIcon,
                      backgroundColor: !photo
                        ? "#fff"
                        : "rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <MaterialIcons
                      name="photo-camera"
                      size={24}
                      color={!photo ? "#BDBDBD" : "#fff"}
                    />
                  </View>
                </View>
                <Text style={styles.textUploadImg}>
                  {!photo ? "Upload a photo" : "Replace photo"}
                </Text>
              </TouchableOpacity>
              <TextInput
                style={styles.inputName}
                placeholder="Title..."
                placeholderTextColor={"#bdbdbd"}
                onFocus={() => setIsOpenKeyboard(true)}
                onBlur={handleUseKeyboard}
                value={title}
                onChangeText={setTitle}
              />
              <TouchableOpacity activeOpacity={0.7} style={styles.wrapLocation}>
                <TextInput
                  placeholder="Location name..."
                  placeholderTextColor={"#bdbdbd"}
                  onFocus={() => setIsOpenKeyboard(true)}
                  onBlur={handleUseKeyboard}
                  value={nameLocation}
                  onChangeText={setNameLocation}
                  style={{ ...styles.inputName, paddingLeft: 28 }}
                />
                <SimpleLineIcons
                  name="location-pin"
                  style={styles.iconLocation}
                  size={18}
                  color="#BDBDBD"
                />
              </TouchableOpacity>
              <BtnSubmit
                title={"Publish"}
                loading={isLoading}
                disabled={
                  title.length > 0 && photo && nameLocation.length > 0
                    ? false
                    : true
                }
                onSubmit={() => handleSubmitForm()}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            ...styles.wrapTrash,
            backgroundColor:
              (title || photo || nameLocation) && !isLoading
                ? "#FF6C00"
                : "#F6F6F6",
          }}
          onPress={() => reset()}
        >
          <FontAwesome5
            name="trash-alt"
            size={24}
            color={
              (title || photo || nameLocation) && !isLoading
                ? "#fff"
                : "#BDBDBD"
            }
          />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 32,
    flex: 1,

    minHeight: "100%",

    backgroundColor: "#fff",
  },
  uploadImgBlock: {
    marginBottom: 32,
  },
  wrapForPositionIcon: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  image: {
    width: "100%",
    height: 240,

    backgroundColor: "#e8e8e8",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 8,

    overflow: "hidden",

    marginBottom: 8,
  },
  wrapIcon: {
    position: "absolute",
    width: 60,
    height: 60,

    borderRadius: 30,

    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  textUploadImg: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
  },
  inputName: {
    width: "100%",
    height: 50,

    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,

    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },
  wrapLocation: {
    marginBottom: 32,
    position: "relative",
  },
  iconLocation: {
    position: "absolute",
    left: 0,
    bottom: 16,
  },
  wrapTrash: {
    width: 70,
    height: 40,

    borderRadius: 20,

    alignItems: "center",
    justifyContent: "center",

    position: "absolute",
    bottom: 22,
    left: "50%",

    transform: [{ translateX: -35 }],
  },
});

export default CreatePostsScreen;
