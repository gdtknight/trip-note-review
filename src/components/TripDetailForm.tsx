import Button from "@/components/Button";
import Input from "@/components/Input";
import { Theme } from "@/constants/Theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface TripDetailFormData {
  title: string;
  content: string;
  weather: string;
  image?: ImagePicker.ImagePickerAsset | null;
}

interface TripDetailFormProps {
  label: string;
  initialTitle?: string;
  initialContent?: string;
  initialImageUrl?: string;
  initialWeather?: string;
  isLoading?: boolean;
  onSubmit: (data: TripDetailFormData) => void;
}

const TripDetailForm = ({
  label,
  initialImageUrl,
  initialTitle = "",
  initialContent = "",
  initialWeather = "",
  isLoading = false,
  onSubmit,
}: TripDetailFormProps) => {
  const [title, setTitle] = useState(initialTitle || "");
  const [content, setContent] = useState(initialContent || "");
  const [weather, setWeather] = useState(initialWeather || "");
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [imageUrl, setImageUrl] = useState(initialImageUrl || "");

  // 비동기 날씨 정보 동기화
  useEffect(() => {
    if (initialWeather) {
      setWeather(initialWeather);
    }
  }, [initialWeather]);

  useEffect(() => {
    if (initialImageUrl) {
      setImageUrl(initialImageUrl);
    }
  }, [initialImageUrl]);

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
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("알림", "제목을 입력해주세요.");
      return;
    }

    if (!imageUrl && !image) {
      Alert.alert("알림", "이미지를 추가해주세요.");
      return;
    }

    onSubmit({
      title,
      content,
      weather,
      image,
    });
  };

  const currentImageUri = image ? image.uri : imageUrl;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <SafeAreaView edges={["bottom"]} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable onPress={pickImage} style={styles.imageContainer}>
            {currentImageUri ? (
              <>
                <Image source={{ uri: currentImageUri }} style={styles.image} />
                {/* 📸 이미지 위에 연하게 오버랩되는 레이어 */}
                <View style={styles.imageOverlay}>
                  <AntDesign
                    name="camera"
                    size={24}
                    color={Theme.colors.gray100}
                  />
                  <Text style={styles.overlayText}>이미지 변경</Text>
                </View>
              </>
            ) : (
              <>
                <AntDesign name="camera" size={24} color="black" />
                <Text style={styles.imageText}>이미지 추가</Text>
              </>
            )}
          </Pressable>
          <Input
            label="제목"
            placeholder="여행 기록 제목을 입력해주세요."
            style={{
              padding: 20,
            }}
            value={title}
            onChangeText={setTitle}
          />
          <Input
            label="날씨"
            style={{
              padding: 20,
            }}
            value={weather}
            editable={false}
          />
          <Input
            label="내용"
            placeholder="여행 기록 내용을 입력해주세요."
            value={content}
            onChangeText={setContent}
            multiline
            style={{
              height: 150,
              padding: 20,
              textAlignVertical: "top",
            }}
          />
          <View style={{ marginTop: "auto" }}>
            <Button label={label} onPress={handleSubmit} disabled={isLoading} />
          </View>
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
    overflow: "hidden",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)", // 0.35 정도가 사진도 잘 보이고 글씨도 읽기 좋은 황금 비율입니다
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  overlayText: {
    fontSize: 14,
    fontFamily: Theme.fonts.medium,
    color: Theme.colors.gray100,
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

export default TripDetailForm;
