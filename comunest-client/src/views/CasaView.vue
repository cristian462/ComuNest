<template>
	<div>
		
	</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';




onMounted(async()=>{
	const route = useRoute();
	let id_casa = route.params.id;
	try {
    const response = await fetch("http://localhost:4000/casa", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(id_casa)
    });
	const meses = await response.json();
	console.log(meses);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>