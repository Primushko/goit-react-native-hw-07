import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import BgImage from "../components/BgImage";
import InputAvatar from "../components/InputAvatar";
import ItemPost from "../components/ItemPost";

import {
  getUserId,
  getUserIsAuth,
  getUserName,
  getUserPhoto,
} from "../redux/auth/authSelectors";
import { authSignOut } from "../redux/auth/authOperations";

import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase/config";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import uploadFile from "../utils/uploadFile";
import { updateProfile } from "firebase/auth";
import { updateAvatar } from "../redux/auth/authSlice";
import { async } from "@firebase/util";
import { deleteObject, ref } from "firebase/storage";

const ProfileScreen = ({ navigation, setIsAuth }) => {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(useSelector(getUserPhoto));

  const isAuth = useSelector(getUserIsAuth);
  const userName = useSelector(getUserName);
  const userId = useSelector(getUserId);
  const photo = useSelector(getUserPhoto);

  const dispatch = useDispatch();

  const getAllPosts = async () => {
    const q = query(collection(db, "posts"), where("userId", "==", userId));

    isAuth &&
      onSnapshot(q, (doc) => {
        const postsArray = doc.docs.map((el) => ({ ...el.data(), id: el.id }));
        setPosts(postsArray);
      });
  };

  const updateAvatarUser = async () => {
    try {
      const imageURL = await uploadFile({
        path: "avatarImage",
        photo: image,
        name: userId,
      });
      const user = auth.currentUser;
      await updateProfile(user, {
        photoURL: imageURL,
      });
      dispatch(updateAvatar(imageURL));
    } catch (error) {
      console.log("updateAvatarUser Error", error);
    }
  };

  const handleDelPost = async (id, urlPhoto, title) => {
    try {
      await deleteDoc(doc(db, "posts", id));
      const desertRef = ref(storage, urlPhoto);
      await deleteObject(desertRef);
    } catch (error) {
      console.warn("handleDelPost", error);
    }
  };

  const createTwoButtonAlert = (id, urlPhoto, title) =>
    Alert.alert("Do you want to delete this post?", title, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Delete", onPress: () => handleDelPost(id, urlPhoto, title) },
    ]);

  useEffect(() => {
    getAllPosts();
  }, []);

  useEffect(() => {
    if (photo !== image) {
      updateAvatarUser();
    }
  }, [image]);

  return (
    <BgImage>
      <ScrollView snapToEnd={false}>
        <SafeAreaView style={{ paddingTop: 100 }}>
          <View style={styles.container}>
            <InputAvatar image={image} setImage={setImage} />
            <Text style={styles.userName}>{userName}</Text>
            <View style={{ width: "100%" }}>
              {posts
                .sort((a, b) => b.createDate - a.createDate)
                .map((el) => {
                  return (
                    <View key={el.id} style={{ flex: 1, position: "relative" }}>
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() =>
                          createTwoButtonAlert(el.id, el.photo, el.title)
                        }
                        style={styles.delPostBtn}
                      >
                        <MaterialIcons name="close" size={20} color="#fff" />
                      </TouchableOpacity>
                      <ItemPost data={el} navigation={navigation} />
                    </View>
                  );
                })}
            </View>
            <TouchableOpacity
              onPress={() => dispatch(authSignOut())}
              style={styles.logout}
            >
              <MaterialIcons name="logout" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </BgImage>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    minHeight: 600,
    paddingTop: 90,
    paddingHorizontal: 16,
    position: "relative",

    alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  logout: {
    position: "absolute",
    right: 16,
    top: 24,
  },
  userName: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    lineHeight: 35,

    color: "#212121",

    marginBottom: 32,
  },
  delPostBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,

    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FF6C00",

    alignItems: "center",
    justifyContent: "center",

    opacity: 0.8,
  },
});
export default ProfileScreen;
