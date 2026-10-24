import TripDetailForm, {
  TripDetailFormData,
} from "@/components/TripDetailForm";
import { useGetTripDetail, useUpdateTripDetail } from "@/hooks/useTripDetail";
import { ImagePickerAsset } from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";

import { ActivityIndicator, View } from "react-native";

const UpdateTripDetailScreen = () => {
  const { tripDetailId } = useLocalSearchParams();

  const { data: tripDetailInfo, isLoading } = useGetTripDetail(
    tripDetailId as string,
  );

  const { mutateAsync, isPending } = useUpdateTripDetail();

  const updateTripDetail = async (data: TripDetailFormData) => {
    await mutateAsync(
      {
        tripDetailId: tripDetailId as string,
        ...data,
        image: (data.image ?? undefined) as ImagePickerAsset,
      },
      {
        onSuccess: () => {
          router.back();
        },
      },
    );
  };

  if (isLoading || !tripDetailInfo) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <TripDetailForm
      label="여행기록 수정"
      initialTitle={tripDetailInfo?.title}
      initialContent={tripDetailInfo?.content}
      initialWeather={tripDetailInfo?.weather}
      initialImageUrl={tripDetailInfo?.image}
      isLoading={isPending}
      onSubmit={updateTripDetail}
    />
  );
};

export default UpdateTripDetailScreen;
