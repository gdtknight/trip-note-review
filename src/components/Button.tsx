import { Theme } from "@/constants/Theme";
import { memo } from "react";
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

interface ButtonProps extends PressableProps {
  label: string;
}

const Button = ({ label, ...props }: ButtonProps) => {
  return (
    <Pressable style={styles.button} {...props}>
      <Text
        style={{
          color: Theme.colors.white,
          fontSize: 18,
          fontFamily: Theme.fonts.semibold,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 52,
    backgroundColor: Theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default memo(Button);
