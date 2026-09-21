import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 5,
    },
  },
});

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    "Pretendard-Black": require("@/assets/fonts/Pretendard-Black.otf"),
    "Pretendard-Bold": require("@/assets/fonts/Pretendard-Bold.otf"),
    "Pretendard-ExtraBold": require("@/assets/fonts/Pretendard-ExtraBold.otf"),
    "Pretendard-ExtraLight": require("@/assets/fonts/Pretendard-ExtraLight.otf"),
    "Pretendard-Light": require("@/assets/fonts/Pretendard-Light.otf"),
    "Pretendard-Medium": require("@/assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-Regular": require("@/assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-SemiBold": require("@/assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Thin": require("@/assets/fonts/Pretendard-Thin.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(trip)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
};

export default RootLayout;
