import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  Vibration,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ItemComment from "../components/ItemComment";
import { useSelector } from "react-redux";
import {
  getUserId,
  getUserIsAuth,
  getUserName,
  getUserPhoto,
} from "../redux/auth/authSelectors";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  where,
  increment,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { query } from "firebase/database";

const CommentsScreen = ({ navigation, route }) => {
  const [comment, setComment] = useState("");
  const [allComment, setAllComment] = useState([]);
  const [isOpenKeyboard, setIsOpenKeyboard] = useState(false);

  const isAuth = useSelector(getUserIsAuth);
  const userId = useSelector(getUserId);
  const userName = useSelector(getUserName);
  const userPhoto = useSelector(getUserPhoto);

  const { photo, id } = route.params;
  const flatListRef = useRef();

  useEffect(() => {
    getAllComment();
  }, []);

  const getAllComment = async () => {
    const q = query(collection(db, "comments"), where("postId", "==", id));

    isAuth &&
      onSnapshot(q, (doc) => {
        const postsArray = doc.docs.map((el) => ({ ...el.data(), id: el.id }));
        setAllComment(postsArray);
      });
  };

  const handleCloseKeyboard = () => {
    if (isOpenKeyboard) {
      Keyboard.dismiss();
      setIsOpenKeyboard(false);
    }
  };

  const handleSubmit = async () => {
    if (comment.length < 2) {
      Vibration.vibrate();
      return Alert.alert("Comment must be more than 1 character");
    }
    try {
      await addDoc(collection(db, "comments"), {
        postId: id,
        user: {
          id: userId,
          name: userName,
          photo: userPhoto,
        },
        comment,
        date: Date.now(),
      });
      await updateDoc(doc(db, "posts", id), {
        comment: increment(1),
      });

      setComment("");

      handleCloseKeyboard();

      flatListRef.current.scrollToEnd();
    } catch (error) {
      console.warn("commentError", error);
    }
  };
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS == "ios" ? 60 : 100}
      behavior={Platform.OS == "ios" ? "position" : "height"}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback
          disabled={!isOpenKeyboard}
          onPress={handleCloseKeyboard}
        >
          <View style={{ flex: 1 }}>
            {!isOpenKeyboard && Platform.OS == "android" ? (
              <Image
                source={{ uri: photo }}
                resizeMode="cover"
                style={styles.image}
              />
            ) : (
              Platform.OS == "ios" && (
                <Image
                  source={{ uri: photo }}
                  resizeMode="cover"
                  style={styles.image}
                />
              )
            )}
            <FlatList
              data={allComment.sort((a, b) => a.date - b.date)}
              ref={flatListRef}
              style={{ flex: 1 }}
              renderItem={({ item }) => (
                <ItemComment userId={userId} data={item} />
              )}
              keExtractor={(item, idx) => item.id}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.wrapInput}>
          <TextInput
            style={styles.input}
            placeholder="Comment..."
            value={comment}
            onBlur={handleCloseKeyboard}
            onFocus={() => setIsOpenKeyboard(true)}
            onChangeText={(text) => setComment(text)}
          />
          <TouchableOpacity style={styles.btnSend} onPress={handleSubmit}>
            <AntDesign name="arrowup" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 8,
    overflow: "hidden",

    marginBottom: 32,
  },
  wrapInput: {
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    paddingLeft: 16,
    paddingRight: 42,

    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#e8e8e8",

    marginTop: 24,
    backgroundColor: "#f6f6f6",
  },
  btnSend: {
    width: 34,
    height: 34,

    borderRadius: 17,
    backgroundColor: "#ff6c00",

    alignItems: "center",
    justifyContent: "center",

    position: "absolute",
    right: 8,
    bottom: 8,
  },
});

export default CommentsScreen;
