import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useAssets } from 'expo-asset';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';

const Page = () => {
  const [assets] = useAssets([require('@/assets/videos/intro.mp4')]);

  return (
    <View style={styles.container}>
      {assets && (
        <Video
          style={styles.video}
          source={{
            uri: assets[0].uri,
          }}
          isMuted
          shouldPlay
          resizeMode={ResizeMode.COVER}
          isLooping
        />
      )}
      <View style={{ marginTop: 80, padding: 20 }}>
        <Text style={styles.header}>Ready to change the way you money?</Text>
      </View>

      <View style={styles.buttons}>
        <Link
          href="/login"
          style={[defaultStyles.pillButton, { flex: 1, backgroundColor: Colors.dark }]}
          asChild>
          <TouchableOpacity>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '500' }}>Log in</Text>
          </TouchableOpacity>
        </Link>
        <Link
          href="/signup"
          style={[defaultStyles.pillButton, { flex: 1, backgroundColor: '#fff' }]}
          asChild>
          <TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: '500' }}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  header: {
    fontSize: 36,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#fff',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 60,
    paddingHorizontal: 20,
  },
});
export default Page;
