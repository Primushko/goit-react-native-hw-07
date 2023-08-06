import { Image, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import {
  getUserEmail,
  getUserName,
  getUserPhoto,
} from "../redux/auth/authSelectors";

import img from "../assets/images/defaultUserPhoto.png";

const ProfilePost = () => {
  const name = useSelector(getUserName);
  const email = useSelector(getUserEmail);
  const photo = useSelector(getUserPhoto);

  return (
    <View style={styles.profile}>
      <Image
        style={styles.profileImage}
        resizeMode={"cover"}
        source={photo ? { uri: photo } : img}
      />
      <View>
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileEmail}>{email}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 16,

    marginRight: 8,
  },
  profileName: {
    fontFamily: "Roboto-Bold",

    fontSize: 13,
    lineHeight: 15,
    color: "#212121",
  },
  profileEmail: {
    fontFamily: "Roboto-Regular",
    fontSize: 11,
    lineHeight: 13,
    color: "rgba(33, 33, 33, 0.8)",
  },
});

export default ProfilePost;
