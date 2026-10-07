import Input from "@/components/input";
import { Theme } from "@/constants/Theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateTripDetailScreen = () => {
  const [image, setImage] = useState<String | null>(null);
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("갤러리 접근 권한 필요", "갤러리 접근 권한이 없습니다.", [
        { text: "취소", style: "cancel" },
      ]);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <SafeAreaView edges={["bottom"]} style={styles.container}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <>
              <Pressable onPress={pickImage} style={styles.imageContainer}>
                <AntDesign name="camera" size={24} color="black" />
                <Text style={styles.imageText}>이미지 추가</Text>
              </Pressable>
            </>
          )}
          <Input label="제목" />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  formContainer: {
    gap: 20,
    flexGrow: 1,
  },
  imageContainer: {
    width: "100%",
    height: 150,
    backgroundColor: Theme.colors.white,
    borderRadius: 20,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    fontSize: 14,
    fontFamily: Theme.fonts.regular,
    color: Theme.colors.gray,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 20,
  },
});

export default CreateTripDetailScreen;
