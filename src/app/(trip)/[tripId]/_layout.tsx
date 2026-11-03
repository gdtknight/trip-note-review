import { useTripTitleStore } from "@/store/useTripTitleStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

const TripDetailLayout = () => {
  const router = useRouter();
  const { title } = useTripTitleStore((state) => state);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: title,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <MaterialIcons
                name="arrow-back-ios-new"
                size={24}
                color="black"
              />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
};

export default TripDetailLayout;
