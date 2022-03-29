import { ref } from "vue";
import http from "../api/api";

export default function getItemById(url) {
  const result = ref(null);
  const loading = ref(true);

  http.get(url)
    .then((response) => {
      loading.value = false;
      result.value = response.data.data;
    });

  return {
    result,
    loading,
  };
}
