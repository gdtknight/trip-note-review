import { Theme } from "@/constants/Theme";
import { TripDetailItemType } from "@/types/tripDetailType";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface TripDetailCardProps {
  item: TripDetailItemType;
  handleModal: () => void;
}

const TripDetailCard = ({ item, handleModal }: TripDetailCardProps) => {
  return (
    <Pressable>
      <Image style={styles.image} contentFit="cover" source={item.image} />
      <View style={styles.container}>
        <View style={{ gap: 10 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{item.createdAt.toString()}</Text>
        </View>
        <Pressable onPress={handleModal}>
          <AntDesign name="more" size={24} color="black" />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 170,
    backgroundColor: Theme.colors.gray,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  container: {
    padding: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: Theme.colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontFamily: Theme.fonts.bold,
  },
  date: {
    fontSize: 16,
    fontFamily: Theme.fonts.regular,
    color: Theme.colors.gray,
  },
});

export default memo(TripDetailCard);
