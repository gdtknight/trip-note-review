import Modal from "@/components/Modal";
import PlusButton from "@/components/PlusButton";
import TripCard from "@/components/TripCard";
import { theme } from "@/constants/theme";
import { useDeleteTrip, useGetTripList } from "@/hooks/useTrip";
import { useTripStore } from "@/store/tripStore";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CACHE_KEY = "tripListCache";
const CACHE_EXPIRY_KEY = "tripCacheExpiry";
const CACHE_DURATION = 5 * 60 * 1000; // 5분

const MyTripList = () => {
  const router = useRouter();
  const { cachedTrips } = useTripStore((state) => state);
  const { setCachedTrips } = useTripStore((state) => state.actions);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>();

  const { mutateAsync } = useDeleteTrip();

  const handleOpenModal = (id: string) => {
    setIsOpen(true);
    setSelectedId(id);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedId(null);
  };

  const updateTrip = (tripId: string) => {
    router.navigate({
      pathname: `/updateTrip`,
      params: {
        tripId,
      },
    });
  };

  const deleteTrip = (tripId: string) => {
    mutateAsync(tripId, {
      onSuccess: () => {
        handleCloseModal();
      },
    });
  };

  const {
    data: trips,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetTripList();

  useEffect(() => {
    if (trips?.pages[0]) {
      setCachedTrips(trips.pages[0]);
    }
  }, [trips, setCachedTrips]);

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
    if (cachedTrips) {
      return { data: cachedTrips.data, meta: cachedTrips.meta };
    }
    return { data: [], meta: undefined };
  }, [trips, cachedTrips]);

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
            handleOpenModal={handleOpenModal}
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
      <Modal
        selectedId={selectedId}
        isOpen={isOpen}
        closeModal={handleCloseModal}
        updateTrip={updateTrip}
        deleteTrip={deleteTrip}
      />
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
