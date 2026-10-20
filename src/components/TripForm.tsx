import Button from "@/components/Button";
import Input from "@/components/Input";
import { Theme } from "@/constants/Theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TripFormProps {
  initialTitle?: string;
  initialStartDate?: Date;
  initialEndDate?: Date;
  label: string;
  onSubmit: (data: { title: string; startDate?: Date; endDate?: Date }) => void;
}

const TripForm = ({
  initialTitle,
  initialStartDate,
  initialEndDate,
  label,
  onSubmit,
}: TripFormProps) => {
  const router = useRouter();

  const [title, setTitle] = useState<string>(initialTitle || "");
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialStartDate || undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialEndDate || undefined,
  );

  const isDirty =
    title !== initialTitle ||
    startDate?.getTime() !== initialStartDate?.getTime() ||
    endDate?.getTime() !== initialEndDate?.getTime();

  const handleChangeText = useCallback(
    (text: string) => {
      setTitle(text);
    },
    [title],
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS == "ios" ? 100 : 0}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Input label="제목" value={title} onChangeText={handleChangeText} />
          <View>
            <Text style={styles.label}>여행 기간</Text>
            <View>
              <View style={styles.dateContainer}>
                <Text>시작일</Text>
                <DateTimePicker
                  value={startDate ?? new Date()}
                  mode="date"
                  display="default"
                  locale="ko-KR"
                  onValueChange={(_, date) => setStartDate(date)}
                />
              </View>
              <View style={[styles.dateContainer, { marginTop: 12 }]}>
                <Text>종료일</Text>
                <DateTimePicker
                  value={endDate ?? new Date()}
                  mode="date"
                  display="default"
                  locale="ko-KR"
                  onValueChange={(_, date) => setEndDate(date)}
                  minimumDate={startDate}
                />
              </View>
            </View>
          </View>
          <View
            style={[styles.buttonContainer, { opacity: isDirty ? 1 : 0.4 }]}
          >
            <Button
              label={label}
              onPress={() => onSubmit({ title, startDate, endDate })}
              disabled={!isDirty}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    gap: 30,
    flexGrow: 1,
  },
  label: {
    marginBottom: 20,
    fontSize: 18,
    fontFamily: Theme.fonts.regular,
  },
  dateContainer: {
    gap: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: "auto",
  },
});

export default TripForm;
