import { theme } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Tripcard = () => {
  return (
    <Pressable style={styles.container}>
      <View>
        <Text style={styles.title}>제목</Text>
        <Text style={styles.dateText}>시작날짜 ~ 종료날짜</Text>
      </View>
      <View>
        <Pressable>
          <AntDesign name="more" size={24} color="black" />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    height: 80,
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: theme.fonts.semibold,
  },
  dateText: {
    fontSize: 16,
    color: theme.colors.gray,
    fontFamily: theme.fonts.regular,
  },
});

// # React.memo
// - 컴포넌트의 불필요한 리렌더링을 방지하여 성능을 최적화하기 위한
//  **고차 컴포넌트(HOC, Higher Order Component)**
//
// ## 기본 개념 및 동작 원리
//
// - 기본 동작: 부모 컴포넌트가 리렌더링될 때, React.memo로 감싼 자식 컴포넌트는
//  전달받은 props가 이전과 동일하다면 리렌더링을 건너뛰고 마지막으로 렌더링된 결과를 재사용합니다.
// - 비교 방식: props의 변화 확인은 기본적으로 **얕은 비교(Shallow Comparison, Object.is)**
export default memo(Tripcard);
