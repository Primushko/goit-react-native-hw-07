import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

const InputAvatar = ({ image = null, setImage }) => {
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const manipResult = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 200 } }],
        {
          format: SaveFormat.JPEG,
        }
      );

      return setImage(manipResult.uri);
    }
  };

  return (
    <TouchableOpacity
      style={styles.inputAvatar}
      activeOpacity={0.8}
      onPress={() => pickImage()}
    >
      {image && (
        <Image
          resizeMode="cover"
          style={styles.image}
          source={{ uri: image }}
        />
      )}

      <AntDesign
        name={image ? "minuscircleo" : "pluscircleo"}
        size={24}
        color="#FF6C00"
        style={styles.inputAvatarIcon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputAvatar: {
    position: "absolute",
    top: -60,

    width: 120,
    height: 120,

    backgroundColor: "#F6F6F6",
    borderRadius: 16,

    zIndex: 2,
  },
  image: {
    width: 120,
    height: 120,

    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    overflow: "hidden",
  },
  inputAvatarIcon: {
    position: "absolute",
    bottom: 14,
    right: -12,
  },
});

export default InputAvatar;
