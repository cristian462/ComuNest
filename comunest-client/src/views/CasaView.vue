<template>
	<div class="container d-flex flex-wrap gap-5 px-5 mt-5 flex-column">
    <h1 class="d-flex justify-content-center" style="font-size: 2.9rem">{{nombre_casa}}</h1>
    <div><router-link to="/casaNueva"><button class="btn btn-primary">+</button></router-link></div>

    <div class="d-flex flex-row gap-5 flex-wrap justify-content-center">
      <div v-for="mes in meses" :key="mes.id_mes">
        <router-link :to="{name: 'gastos', params: {id_mes: mes.id_mes, nombre: mes.nombre, resuelto: mes.resuelto, id_casa: id_casa.id_casa}}">
          <div class="card px-5 py-2 pt-3 d-flex flex-row justify-content-between" :class="mes.resuelto ? `si-resuelto border-success` : `border-danger no-resuelto`" 
            style="flex-grow: 1; min-width: 408px; border: 2px solid black;">
            <h2 class="pr-5">{{ mes.nombre }}</h2>
            <div>
              <h4>Total: {{ mes.total }}</h4>
              <small class="secondary-text d-flex justify-content-end" v-if="!mes.resuelto">No resuelto</small>
              <small class="secondary-text d-flex justify-content-end" v-else>Resuelto</small>
            </div>
          </div>
        </router-link>
    </div>
    </div>
    <h4 class="atras" @click="volverAtras()">&lt;&lt; Volver</h4>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';



const route = useRoute();
  const id = ref();
  id.value = route.params.id;

	let id_casa ={
    id_casa: route.params.id
  };

const router = useRouter();

  const volverAtras = ()=>{
    router.go(-1);
  }

  const nombre_casa = ref('');
  nombre_casa.value = route.params.nombre;

  const meses = ref([]);

onMounted(async()=>{
	try {
    const response = await fetch("http://localhost:4000/casa", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(id_casa)
    });
	const fetchedMeses = await response.json();
  meses.value = fetchedMeses;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>

<style scoped>
  .atras{
    cursor: pointer;
    color: blue;
  }

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