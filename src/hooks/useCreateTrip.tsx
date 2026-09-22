import { api } from "@/api";
import { RequestCreateType } from "@/types/tripType";
import { useMutation } from "@tanstack/react-query";

const useCreateTrip = () => {
  // react-query 에서 제공되는 훅
  // 서버 데이터 생성, 삭제, 수정 할때 사용
  // 성공시 onSuccess 실행
  // 실패시 onError 실행
  // 업데이트후에는 invalidateQueries 사용해서 캐시 무효화
  return useMutation({
    mutationFn: async (body: RequestCreateType) => {
      const res = await api.post("/trips", body);
      return res.data;
    },
  });
};

export default useCreateTrip;
