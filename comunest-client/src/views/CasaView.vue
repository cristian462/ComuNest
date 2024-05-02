<template>
	<div class="container d-flex flex-wrap gap-5 px-5 mt-5">
    <div class="card py-4" :class="casa.resuelto ? `si-resuelto border-success` : `border-danger no-resuelto`" style="flex-grow: 1; min-width: 420px; border: 2px solid black;" v-for="mes in meses" :key="mes.id_mes">
      <h2>mes.nombre</h2>
      <h5>mes.total</h5>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';




onMounted(async()=>{
	const route = useRoute();
	let id_casa = route.params.id;

  console.log(id_casa);

  const meses = ref([]);
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
	console.log(meses);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>

<style scoped>
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