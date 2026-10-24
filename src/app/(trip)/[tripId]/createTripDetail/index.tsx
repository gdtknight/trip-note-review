import TripDetailForm, {
  TripDetailFormData,
} from "@/components/TripDetailForm";
import { useCreateTripDetail, useGetWeather } from "@/hooks/useTripDetail";
import { ImagePickerAsset } from "expo-image-picker";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";

import { useEffect, useState } from "react";
import { Alert } from "react-native";

const CreateTripDetailScreen = () => {
  const { tripId } = useLocalSearchParams();

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  const { data: weatherData } = useGetWeather(
    location?.coords.latitude ?? 0,
    location?.coords.longitude ?? 0,
  );

  const { mutateAsync, isPending } = useCreateTripDetail();

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

  const createTripDetail = async (data: TripDetailFormData) => {
    if (!data.image) {
      Alert.alert("알림", "이미지를 선택해주세요.");
      return;
    }

    await mutateAsync(
      {
        tripId: tripId as string,
        ...data,
        image: data.image as ImagePickerAsset,
      },
      {
        onSuccess: () => {
          router.back();
        },
      },
    );
  };

  return (
    <TripDetailForm
      label="여행기록 추가"
      initialWeather={
        weatherData?.weather[0]?.main
          ? convertWeather(weatherData?.weather[0]?.main)
          : ""
      }
      isLoading={isPending}
      onSubmit={createTripDetail}
    />
  );
};

export default CreateTripDetailScreen;
