import { defineStore } from "pinia";

export const useAuthUserAtore = defineStore("AuthUserStore", {
  state: () => {
    return {
      username: "some",
    };
  },
});
