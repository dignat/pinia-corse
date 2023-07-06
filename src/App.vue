<script setup>
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
import useProductStore from "@/stores/productStore";
import useCartStore from "@/stores/cartStore.js";
import { ref, reactive } from "vue";
const productSotre = useProductStore();
const cartStore = useCartStore();
productSotre.fill();
// const addToCart = (count, product) => {
//   count = parseInt(count);
//   //patch function from pinia store to group multipledirect mutiations of the store together
//   cartStore.$patch((state) => {
//     for (let index = 0; index < count; index++) {
//       state.push(product);
//     }
//   });
// };
const future = reactive([]);
const history = reactive([]);
history.push(JSON.stringify(cartStore.$state));
const redo = () => {
  const latestState = future.pop();
  if (!latestState) return;
  doingHistory.value = true;
  history.push(latestState);
  cartStore.$state = JSON.parse(latestState);
  doingHistory.value = false;
};
const doingHistory = ref(false);
const undo = () => {
  if (history.length === 1) return;
  doingHistory.value = true;
  future.push(history.pop());
  cartStore.$state = JSON.parse(history.at(-1));
  doingHistory.value = false;
};
cartStore.$subscribe((mutation, state) => {
  if (!doingHistory.value) {
    history.push(JSON.stringify(state));
    future.splice(0, future.length);
  }
});
cartStore.$onAction(({ name, store, args, after, onError }) => {
  if (name === "addItems") {
    after(() => {
      console.log(args[0]);
    });
    onError((error) => {
      console.log(error.message);
    });
  }
});
</script>

<template>
  <div class="container">
    <TheHeader />
    <AppButton @click="undo">Undo</AppButton>
    <AppButton @click="redo">Redo</AppButton>

    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <ProductCard
        v-for="product in productSotre.products"
        :key="product.name"
        :product="product"
        @addToCart="cartStore.addItems($event, product)"
      />
    </ul>
  </div>
</template>
