import Modal from "@/components/Modal";
import PlusButton from "@/components/PlusButton";
import TripDetailCard from "@/components/TripDetailCard";
import { Theme } from "@/constants/Theme";
import {
  useDeleteTripDetail,
  useGetTripDetailList,
} from "@/hooks/useTripDetail";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutateAsync } = useDeleteTripDetail();

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

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedId(null);
  };

  const onUpdateTripDetail = (tripDetailId: string) => {
    router.navigate({
      pathname: "/(trip)/[tripId]/updateTripDetail",
      params: { tripId: tripId as string, tripDetailId: tripDetailId },
    });
    handleCloseModal();
  };

  const onDeleteTripDetail = (tripDetailId: string) => {
    mutateAsync(tripDetailId, {
      onSuccess: () => {
        handleCloseModal();
      },
    });
  };

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
          <TripDetailCard
            item={tripDetail}
            handleModal={() => {
              setSelectedId(tripDetail.id);
              setIsOpen(true);
            }}
          />
        )}
        ListEmptyComponent={() => (
          <Text
            style={{
              fontSize: 16,
              marginTop: 50,
              textAlign: "center",
              color: Theme.colors.gray,
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
      <Modal
        isOpen={isOpen}
        selectedId={selectedId}
        closeModal={handleCloseModal}
        updateHandler={onUpdateTripDetail}
        deleteHandler={onDeleteTripDetail}
      />
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
