import PlusButton from "@/components/PlusButton";
import TripCard from "@/components/TripCard";
import { theme } from "@/constants/theme";
import { useGetTripList } from "@/hooks/useTrip";
import { storageService } from "@/services/storageService";
import { ResponseTripListType } from "@/types/tripType";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CACHE_KEY = "tripListCache";
const CACHE_EXPIRY_KEY = "tripCacheExpiry";
const CACHE_DURATION = 5 * 60 * 1000; // 5분

const MyTripList = () => {
  const router = useRouter();
  const [cacheData, setCacheData] = useState<ResponseTripListType | null>(null);
  const {
    data: trips,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetTripList();

  const saveToCache = useCallback(async (data: ResponseTripListType) => {
    await Promise.all([
      storageService.setItem(CACHE_KEY, JSON.stringify(data)),
      storageService.setItem(
        CACHE_EXPIRY_KEY,
        (Date.now() + CACHE_DURATION).toString(),
      ),
    ]);
  }, []);

  useEffect(() => {
    if (trips?.pages[0]) {
      saveToCache(trips.pages[0]);
    }
  }, [trips, saveToCache]);

  const loadFromCache = useCallback(async () => {
    const [cached, expiry] = await Promise.all([
      storageService.getItem(CACHE_KEY),
      storageService.getItem(CACHE_EXPIRY_KEY),
    ]);
    if (cached && expiry) {
      const isExpired = Date.now() > expiry;
      if (!isExpired) {
        setCacheData(cached);
      }
    }
  }, []);

  useEffect(() => {
    loadFromCache();
  }, [loadFromCache]);

  const combinedTrips = useMemo(() => {
    // trips 가 존재하면 trips 반환
    // trips 가 존재하지 않으면 캐쉬 반환
    // 둘다 존재하지 않으면 빈 배열 반환
    if (trips?.pages.length) {
      const data = trips?.pages.flatMap((page) => page.data) ?? [];
      const meta = trips?.pages[0].meta;
      return {
        data,
        meta,
      };
    }
    if (cacheData) {
      return { data: cacheData, meta: cacheData.meta };
    }
    return { data: [], meta: undefined };
  }, [trips]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>내 여행</Text>
      <FlatList
        contentContainerStyle={{ gap: 10 }}
        data={combinedTrips.data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TripCard
            id={item.id}
            title={item.title}
            startDate={item.startDate}
            endDate={item.endDate}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <Text style={{ textAlign: "center" }}>여행을 추가해 주세요</Text>
        }
      />
      <View style={styles.buttonContainer}>
        <PlusButton onPress={() => router.navigate("/createTrip")} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    marginBottom: 30,
  },
  buttonContainer: {
    alignItems: "flex-end",
  },
});

export default MyTripList;
