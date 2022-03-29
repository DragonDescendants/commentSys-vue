import { ref } from "vue";
import http from "../api/api";

export default function getHotItems(url) {
  const result = ref(null);
  const loading = ref(true);

  http.get(url, {
      params: {
        page: 1,
        size: 10,
      },
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
