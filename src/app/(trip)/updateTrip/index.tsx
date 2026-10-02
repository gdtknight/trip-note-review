import TripForm from "@/components/TripForm";
import { useGetTrip, useUpdateTrip } from "@/hooks/useTrip";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const UpdateTripScreen = () => {
  const { tripId } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const { data, isLoading } = useGetTrip(tripId as string);

  const { mutateAsync } = useUpdateTrip();

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setStartDate(new Date(data.startDate));
      setEndDate(new Date(data.endDate));
    }
  }, [data]);

  const handleUpdateTrip = (data: {
    title: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    mutateAsync(
      {
        tripId: tripId as string,
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
      },
      {
        onSuccess: () => {
          router.back();
        },
      },
    );
  };

  if (isLoading || !data) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <TripForm
      initialTitle={data?.title}
      initialStartDate={data ? new Date(data.startDate) : new Date()}
      initialEndDate={data ? new Date(data.endDate) : new Date()}
      label="수정하기"
      onSubmit={handleUpdateTrip}
    />
  );
};

export default UpdateTripScreen;
