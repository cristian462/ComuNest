<template>
  <div class="container d-flex flex-wrap gap-5 px-5 mt-5 flex-column">
    <h1 class="d-flex justify-content-center my-3 pb-5" style="font-size: 2.9rem">Casas a las que perteneces</h1>
    <div class="d-flex flex-row gap-5 flex-wrap justify-content-center">
      <div class="card" :class="casa.resuelto ? `si-resuelto border-success` : `border-danger no-resuelto`" style="flex-grow: 1; min-width: 500px; border: 2px solid black;" v-for="casa in casas" :key="casa.id_casa">
        <router-link :to="{name: 'casa', params: {id: casa.id_casa, nombre: casa.casa}}">
        <div class="card-body d-flex justify-content-around">
          <div class="d-flex flex-column pt-2" :class="casa.resuelto ? `border-success` : `border-danger`" style="border-right: 2px solid black; padding-right: 20px;">
          <h2 class="card-title">{{ casa.casa }}</h2>
          <h5 class="card-subtitle mb-2 text-body-secondary">{{casa.nombre}}</h5>
        </div>
        <div class="d-flex flex-column pt-4">
          <p class="card-text fs-4 d-flex align-items-center">Total del mes: {{casa.total}} €</p>
          <small class="secondary-text d-flex justify-content-end" v-if="!casa.resuelto">No resuelto</small>
          <small class="secondary-text d-flex justify-content-end" v-else>Resuelto</small>
        </div>
        </div>
      </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const data = {
  id_user: store.state.user.id
};

const casas = ref([]);

onMounted(async () => {
  try {
    const response = await fetch("http://localhost:4000/listaCasas", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const fetchedCasas = await response.json();
    casas.value = fetchedCasas;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>

<style scopded>
  .card{
    transition: transform 0.3s ease;
  }
  a{
    text-decoration: none !important;
    color: black !important;
  }
  .card:hover{
    cursor: pointer;
    transform: scale(1.03);
  }

  .no-resuelto{
    background-color: rgba(255, 0, 0, 0.1) !important;
  }

  .si-resuelto{
    background-color: rgba(0, 255, 0, 0.1) !important;
  }
</style>
