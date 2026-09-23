import { theme } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Pressable, PressableProps, StyleSheet } from "react-native";

const PlusButton = ({ ...props }: PressableProps) => {
  return (
    <Pressable style={styles.plusButton} {...props}>
      <AntDesign name="plus" size={24} color="white" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  plusButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
  },
});

export default PlusButton;
