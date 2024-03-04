import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/Colors';
import { useAuth, useUser } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [edit, setEdit] = useState(false);

  const onSaveUser = async () => {
    try {
      await user?.update({
        firstName: firstName!,
        lastName: lastName!,
      });
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    } finally {
      setEdit(false);
    }
  };

  const onCaptureImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
      base64: true,
    });

    if (!result.canceled) {
      const base64 = `data:image/png;base64,${result.assets[0].base64}`;
      user?.setProfileImage({
        file: base64,
      });
    }
  };

  return (
    <BlurView intensity={80} style={[styles.container]} tint="dark">
      {user && (
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={onCaptureImage}
            style={{
              width: 100,
              height: 100,
              backgroundColor: Colors.gray,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50,
            }}>
            {user?.imageUrl && <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />}
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', gap: 6 }}>
            {!edit && (
              <View style={styles.editRow}>
                <Text style={{ fontSize: 26, fontWeight: '600', color: '#fff' }}>
                  {firstName} {lastName}
                </Text>
                <TouchableOpacity onPress={() => setEdit(true)}>
                  <Ionicons name="ellipsis-horizontal" size={24} color={'#fff'} />
                </TouchableOpacity>
              </View>
            )}
            {edit && (
              <View style={styles.editRow}>
                <TextInput
                  placeholder="First Name"
                  value={firstName || ''}
                  onChangeText={setFirstName}
                  style={[styles.inputField, { width: 140 }]}
                />
                <TextInput
                  placeholder="Last Name"
                  value={lastName || ''}
                  onChangeText={setLastName}
                  style={[styles.inputField, { width: 140 }]}
                />
                <TouchableOpacity onPress={onSaveUser}>
                  <Ionicons name="checkmark-outline" size={24} color={'#fff'} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={() => signOut()}>
          <Ionicons name="log-out" size={24} color={'#fff'} />
          <Text style={{ color: '#fff', fontSize: 18 }}>Log out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="person" size={24} color={'#fff'} />
          <Text style={{ color: '#fff', fontSize: 18 }}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="bulb" size={24} color={'#fff'} />
          <Text style={{ color: '#fff', fontSize: 18 }}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="megaphone" size={24} color={'#fff'} />
          <Text style={{ color: '#fff', fontSize: 18, flex: 1 }}>Inbox</Text>
          <View
            style={{
              backgroundColor: Colors.primary,
              paddingHorizontal: 10,
              borderRadius: 10,
              justifyContent: 'center',
            }}>
            <Text style={{ color: '#fff', fontSize: 12 }}>14</Text>
          </View>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray,
    alignSelf: 'center',
  },
  editRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  inputField: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ABABAB',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  actions: {
    backgroundColor: 'rgba(256, 256, 256, 0.1)',
    borderRadius: 16,
    gap: 0,
    margin: 20,
  },
  btn: {
    padding: 14,
    flexDirection: 'row',
    gap: 20,
  },
});
export default Page;
