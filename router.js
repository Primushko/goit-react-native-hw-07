import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Home from './Screens/Home';
import LoginScreen from './Screens/LoginScreen';
import RegistrationScreen from './Screens/RegistrationScreen';
import CommentsScreen from './Screens/CommentsScreen';
import MapScreen from './Screens/MapScreen';
import { AntDesign } from '@expo/vector-icons';

const RootStack = createStackNavigator();

const useRoute = ({ isAuth }) => {

  return (
    <RootStack.Navigator>
      <RootStack.Group>
        {!isAuth ? (
          <>
            <RootStack.Screen
              name="Registration"
              component={RegistrationScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <RootStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        )}
      </RootStack.Group>
      <RootStack.Group screenOptions={{ presentation: 'card' }}>
        <RootStack.Screen
          name="Comment"
          options={{
            title: 'Comments',
            headerLeft: props => (
              <TouchableOpacity
                onPress={() => {
                  props.onPress();
                }}
              >
                <AntDesign name="arrowleft" size={24} color="rgba(33, 33, 33, 0.8)" />
              </TouchableOpacity>
            ),
            headerLeftLabelVisible: () => 'text',
            headerLeftContainerStyle: styles.headerLeft,
            headerRightContainerStyle: styles.headerRight,
          }}
          component={CommentsScreen}
        />
        <RootStack.Screen name="Map" options={{ headerShown: false }} component={MapScreen} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerLeft: {
    paddingLeft: 16,
  },
  headerRight: {
    paddingRight: 16,
  },
});
export default useRoute;
