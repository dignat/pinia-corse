import { groupBy } from "lodash";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useAuthUserStore } from "AuthUserStore";
export const useCartStore = defineStore("CartStore", {
  // initial state
  state: () => {
    return {
      items: [],
    };
  },
  //actions
  actions: {
    addItems(count, item) {
      count = parseInt(count);
      for (let index = 0; index < count; index++) {
        // clone the object as the objects are passed by reference in js and this will cause if we change a product every product in the
        // csrt to change
        this.items.push({ ...item });
      }
    },
    clearItem(itemName) {
      this.items = this.items.filter((item) => item.name !== itemName);
    },
    setItemCount(item, count) {
      this.clearItem(item.name);
      this.addItems(count, item);
    },
    checkout() {
      const authUser = useAuthUserStore();
      alert(
        `${authUser.username} just bought ${this.count} items at a total of ${this.total}`
      );
    },
  },
  //getters synonnumous with the computed property on the component
  // its purposee is to return computed value bssed on the state of the store
  // always returns something otherwise there is no way to know the value of the getter

  getters: {
    // if we use arrow functions we need to use state on the place of this , because of the way arrow functions
    // treat this
    // count: (state) => state.items.length;
    count() {
      return this.items.length;
    },
    isEmpty() {
      // we can use getters inside aother getters
      return this.count === 0;
    },
    grouped: (state) => {
      const grouped = groupBy(state.items, (item) => item.name);
      const sorted = Object.keys(grouped).sort();
      let inOrder = {};
      sorted.forEach((key) => (inOrder[key] = grouped[key]));
      return inOrder;
    },
  },
  groupCount: (state) => (name) => state.grouped[name].length,
  total: (state) => state.items.reduce((p, c) => p + c.price, 0),
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
}
