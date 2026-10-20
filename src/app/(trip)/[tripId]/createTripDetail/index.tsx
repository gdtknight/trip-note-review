import Button from "@/components/Button";
import Input from "@/components/Input";
import { Theme } from "@/constants/Theme";
import { useCreateTripDetail, useGetWeather } from "@/hooks/useTripDetail";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";

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

const CreateTripDetailScreen = () => {
  const { tripId } = useLocalSearchParams();
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: weatherData } = useGetWeather(
    location?.coords.latitude ?? 0,
    location?.coords.longitude ?? 0,
  );

  const { mutateAsync } = useCreateTripDetail();

  const createTrip = async () => {
    await mutateAsync(
      {
        tripId: String(tripId),
        title: title,
        content: content,
        image: image as ImagePicker.ImagePickerAsset,
        weather: convertWeather(weatherData?.weather[0].main) ?? "",
      },
      {
        onSuccess: () => {
          router.back();
        },
      },
    );
  };

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

  useEffect(() => {
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("권한 요청을 거부 했습니다.");
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync();
      setLocation(currentLocation);
    };

    getCurrentLocation();
  }, []);

  const convertWeather = (weather: string) => {
    switch (weather) {
      case "Clear":
        return "맑음";
      case "Clouds":
        return "흐림";
      case "Rain":
        return "비";
      case "Snow":
        return "눈";
      case "Mist":
        return "안개";
      default:
        return weather;
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
            <Image source={{ uri: image.uri }} style={styles.image} />
          ) : (
            <>
              <Pressable onPress={pickImage} style={styles.imageContainer}>
                <AntDesign name="camera" size={24} color="black" />
                <Text style={styles.imageText}>이미지 추가</Text>
              </Pressable>
            </>
          )}
          <Input
            label="제목"
            style={{
              padding: 20,
            }}
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
          <Input
            label="날씨"
            style={{
              padding: 20,
            }}
            value={convertWeather(
              weatherData?.weather[0].main ?? "날씨 정보를 불러올 수 없습니다.",
            )}
            editable={false}
          />
          <Input
            label="내용"
            value={content}
            onChangeText={(text) => setContent(text)}
            multiline
            style={{
              height: 150,
              paddingVertical: 10,
              textAlignVertical: "top",
            }}
          />
          <View style={{ marginTop: "auto" }}>
            <Button label="여행기록 추가" onPress={createTrip} />
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
