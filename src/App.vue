<template>
  <div id="app" :class="$store.state.app.device">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

