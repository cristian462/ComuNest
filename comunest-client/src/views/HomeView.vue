<template>
  <div>
    <li v-for="casa in casas" :key="casa.nombre"></li>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
const store = new useStore();
const data = {
    id_user: store.state.user.id
  }
let casas = [];

onMounted(async ()=>{
 
  const response = await fetch("http://localhost:4000/listaCasas",{
    method:'POST',
    headers: {
          'Content-Type': 'application/json'
             },
    body: JSON.stringify(data)
  });
  casas = await response.json();
  console.log(casas);
  });

  

</script>
