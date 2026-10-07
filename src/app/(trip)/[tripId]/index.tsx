import PlusButton from "@/components/PlusButton";
import TripDetailCard from "@/components/TripDetailCard";
import { theme } from "@/constants/theme";
import { useGetTripDetailList } from "@/hooks/useTripDetail";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TripDetailListScreen = () => {
  const { tripId } = useLocalSearchParams();
  const router = useRouter();

  const {
    data: tripDetailList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetTripDetailList(tripId as string);

  const combinedTripDetailList = useMemo(() => {
    const data = tripDetailList?.pages.flatMap((page) => page.data);
    const meta = tripDetailList?.pages[0].meta;
    return {
      data: data ?? [],
      meta: meta ?? undefined,
    };
  }, [tripDetailList]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <FlatList
        data={combinedTripDetailList.data ?? []}
        contentContainerStyle={{ gap: 10 }}
        keyExtractor={(tripDetail) => tripDetail.id}
        renderItem={({ item: tripDetail }) => (
          <TripDetailCard item={tripDetail} handleModal={() => {}} />
        )}
        ListEmptyComponent={() => (
          <Text
            style={{
              fontSize: 16,
              marginTop: 50,
              textAlign: "center",
              color: theme.colors.gray,
            }}
          >
            여행 기록이 없습니다.
          </Text>
        )}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      <View style={styles.plusButtonContainer}>
        <PlusButton
          onPress={() => router.navigate(`/${tripId}/createTripDetail`)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  plusButtonContainer: {
    alignItems: "flex-end",
  },
});

export default TripDetailListScreen;
