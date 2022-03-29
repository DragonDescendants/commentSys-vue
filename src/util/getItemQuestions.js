import { ref } from "vue";
import http from "../api/api";

export default function getQuestions(url, params) {
  const result = ref(null);
  const loading = ref(true);

  http.get(url, {
      params: params,
    //   params: {
    //     page: 1,
    //     size: 10,
    //   },
    })
    .then((response) => {
      loading.value = false;
      result.value = response.data.data;
    });

  return {
    result,
    loading,
  };
}
