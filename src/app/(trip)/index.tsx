import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MyTripList = () => {
  return (
    <SafeAreaView>
      <View>
        <View style={{ width: 300, height: 300, backgroundColor: "blue" }} />
        <View style={{ width: 300, height: 300, backgroundColor: "red" }} />
        <View style={{ width: 300, height: 300, backgroundColor: "black" }} />
      </View>
    </SafeAreaView>
  );
};

export default MyTripList;
