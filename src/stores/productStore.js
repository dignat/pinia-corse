import { defineStore } from "pinia";
export const useDefineStore = defineStore("ProductStore", {
  // initial state
  state: () => {
    return {
      products: [],
    };
  },
  // acctions
  actions: {
    async fill() {
      this.products = (await import("@/data/products.json")).default;
    },
  },

  // getters
});
