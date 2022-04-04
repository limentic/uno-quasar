<template>
  <q-layout view="lHh LpR lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EmptyLayout'
})
</script>
