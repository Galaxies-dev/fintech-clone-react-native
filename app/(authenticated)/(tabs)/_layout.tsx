import CustomHeader from '@/components/CustomHeader';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { Tabs, useSegments } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useEffect } from 'react';

const Layout = () => {
  const segments = useSegments();

  useEffect(() => {
    console.log(segments);
  }, [segments]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarBackground: () => (
          <BlurView
            intensity={100}
            style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
            tint={'extraLight'}
          />
        ),
        tabBarStyle: {
          backgroundColor: 'transparent',
          position: 'absolute',
          left: 0,
          bottom: 0,
          right: 0,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="registered" size={size} color={color} />
          ),
          header: () => <CustomHeader />,
          headerTransparent: true,
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          title: 'Invest',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="line-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transfers"
        options={{
          title: 'Transfers',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="exchange" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="crypto"
        options={{
          headerShown: false,
          title: 'Crypto',
          tabBarIcon: ({ size, color }) => <FontAwesome name="bitcoin" size={size} color={color} />,
          tabBarStyle: {
            backgroundColor: Colors.background,
            display: segments[3] === '[id]' ? 'none' : 'flex',
          },
        }}
      />
      <Tabs.Screen
        name="lifestyle"
        options={{
          title: 'Lifestyle',
          tabBarIcon: ({ size, color }) => <FontAwesome name="th" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
};
export default Layout;
