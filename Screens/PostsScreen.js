
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

import ItemPost from '../components/ItemPost';
import ProfilePost from '../components/ProfilePost';
import { db } from '../firebase/config';
import { getUserIsAuth } from '../redux/auth/authSelectors';


const PostsScreen = ({ navigation, route }) => {
  const [posts, setPosts] = useState([]);

  const isAuth = useSelector(getUserIsAuth);
  const scrollViewRef = useRef();

  const getAllPost = async () => {
    isAuth && onSnapshot(collection(db, 'posts'), (doc) => {
      const postsArray = doc.docs.map(el => ({ ...el.data(), id: el.id })).sort((a, b) => b.createDate - a.createDate);
      setPosts(postsArray)
    })
  }


  useEffect(() => {
    if (posts.length > 1) {
      scrollViewRef.current.scrollToOffset(0)
    }
  }, [posts.length])


  useEffect(() => {
    getAllPost()
  }, []);

  return (
    <View style={styles.container}>
      <ProfilePost />
      <FlatList
        data={posts}
        ref={scrollViewRef}
        style={{ width: '100%', marginTop: 32 }}
        renderItem={({ item }) => <ItemPost data={item} navigation={navigation} />}
        keyExtractor={(item, idx) => idx.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  scrollView: {
    marginTop: 32,
  },
});
export default PostsScreen;
