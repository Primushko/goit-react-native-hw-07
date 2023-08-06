import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { SimpleLineIcons, FontAwesome, AntDesign } from "@expo/vector-icons";

import { useSelector } from "react-redux";
import { getUserId } from "../redux/auth/authSelectors";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const ItemPost = ({ navigation, data }) => {
  const userId = useSelector(getUserId);

  const handleLikePost = async () => {
    try {
      const docRef = doc(db, "posts", data.id);

      const res = data.like.some((el) => el == userId);

      if (res) {
        const filterArray = data.like.filter((el) => el !== userId);
        await updateDoc(docRef, {
          like: [...filterArray],
        });
        return;
      }

      await updateDoc(docRef, {
        like: [...data.like, userId],
      });
    } catch (error) {
      console.log("handleLikePost", error);
    }
  };
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        resizeMode={"cover"}
        source={{ uri: data.photo }}
      />
      <Text style={styles.title}>{data.title}</Text>
      <View style={styles.bottomBlock}>
        <View style={styles.iconBlock}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconBlock}
            onPress={() =>
              navigation.navigate("Comment", { photo: data.photo, id: data.id })
            }
          >
            {data.comment < 1 ? (
              <FontAwesome
                name="comment-o"
                style={styles.icon}
                size={18}
                color="#BDBDBD"
              />
            ) : (
              <FontAwesome
                name="comment"
                style={styles.icon}
                size={18}
                color="#FF6C00"
              />
            )}
            <Text
              style={false ? styles.countComment : styles.countCommentAccent}
            >
              {data.comment}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconBlock}
            onPress={handleLikePost}
          >
            {data.like.some((el) => el == userId) ? (
              <AntDesign
                name="like1"
                style={styles.icon}
                size={18}
                color="#FF6C00"
              />
            ) : (
              <AntDesign
                name="like2"
                style={styles.icon}
                size={18}
                color="#FF6C00"
              />
            )}
            <Text
              style={false ? styles.countComment : styles.countCommentAccent}
            >
              {data.like.length}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.bottomBlock}
          onPress={() => {
            navigation.navigate("Map", {
              coordinate: data.coordinate,
              nameLocation: data.nameLocation,
              title: data.title,
            });
          }}
        >
          <SimpleLineIcons
            name="location-pin"
            style={styles.icon}
            size={18}
            color="#BDBDBD"
          />
          <Text
            style={{ ...styles.countCommentAccent, ...styles.locationText }}
          >
            {data.nameLocation}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 32,
  },
  image: {
    width: "100%",
    height: 240,

    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    lineHeight: 19,

    color: "#212121",
    marginBottom: 8,
  },
  bottomBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  icon: {
    marginRight: 8,
    transform: [{ scaleX: -1 }],
  },
  countComment: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
  },
  countCommentAccent: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
  },
  locationText: {
    textDecorationLine: "underline",
    textDecorationColor: "#212121",
  },
});

export default ItemPost;
