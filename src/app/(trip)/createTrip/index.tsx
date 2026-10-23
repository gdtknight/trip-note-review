import TripForm from "@/components/TripForm";
import { useCreateTrip } from "@/hooks/useTrip";
import { useRouter } from "expo-router";

const CreateTripScreen = () => {
  const router = useRouter();

  const { mutateAsync } = useCreateTrip();

  const createTrip = (data: {
    title: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    mutateAsync(
      {
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

  return <TripForm label="여행 생성" onSubmit={createTrip} />;
};

export default CreateTripScreen;
