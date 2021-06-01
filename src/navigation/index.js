import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../views/index';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

function Navigation({config}) {
  return (
    <NavigationContainer>
      {config.isTab ? (
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Settings" component={HomeScreen} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          {
            config.pages.map((item, index) => {
              return (
                <Stack.Screen name={item.name} component={item.component} />
              )
            })
          }
        </Stack.Navigator>
      )}

      {/* <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator> */}
    </NavigationContainer>
  );
}

export default Navigation;
