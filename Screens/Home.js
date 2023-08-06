import { useEffect, useState } from "react";
import { Button, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation, TabRouter } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { authSignOut } from "../redux/auth/authOperations";

import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";
import PostsScreen from "./PostsScreen";

import { Feather, MaterialIcons, AntDesign } from "@expo/vector-icons";

const MainTab = createBottomTabNavigator();

const Home = ({}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <MainTab.Navigator screenOptions={{ tabBarShowLabel: false }}>
      <MainTab.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          title: "Publications",
          headerTitleStyle: styles.headerTitle,
          headerRight: () => (
            <TouchableOpacity onPress={() => dispatch(authSignOut())}>
              <MaterialIcons name="logout" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: styles.headerLeft,
          headerRightContainerStyle: styles.headerRight,
          tabBarIcon: ({ focused, size, color }) => {
            return (
              <Feather
                name="grid"
                size={size}
                color={focused ? "#FF6C00" : "rgba(33, 33, 33, 0.8)"}
              />
            );
          },
        }}
      />
      <MainTab.Screen
        name="CreatePost"
        component={CreatePostsScreen}
        options={{
          unmountOnBlur: true,
          tabBarStyle: { display: "none" },
          title: "Create Post",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign
                name="arrowleft"
                size={24}
                color="rgba(33, 33, 33, 0.8)"
              />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: styles.headerLeft,
          headerRightContainerStyle: styles.headerRight,
          tabBarIcon: ({ focused, size, color }) => {
            return (
              <View style={styles.ovalIcon}>
                <Feather name="plus" size={20} color={"#FFFFFF"} />
              </View>
            );
          },
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => {
            return (
              <Feather
                name="user"
                size={size}
                color={focused ? "#FF6C00" : "rgba(33, 33, 33, 0.8)"}
              />
            );
          },
        }}
      />
    </MainTab.Navigator>
  );
};

const styles = StyleSheet.create({
  ovalIcon: {
    width: 70,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF6C00",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 17,
    lineHeight: 22,
    color: "#212121",
  },
  headerRight: {
    paddingRight: 16,
  },
  headerLeft: {
    paddingLeft: 16,
  },
});

export default Home;
