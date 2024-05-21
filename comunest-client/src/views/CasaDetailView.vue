<template>
	<div class="container my-5">
		<div class="container my-5">
        <div class="text-center mb-5">
            <h1>{{ nombre }}</h1>
        </div>
		<h2 class="mb-3">Integrantes:</h2>
        <div id="integrantes-list">
            <div class="integrante" v-for="integrante in integrantes" :key="integrante.id_user">
                <span>{{ integrante.nombre }}</span>
				<button class="delete-btn" @click="borrarIntegrante(integrante.id_user)">&times;</button>
            </div>
        </div>
	</div>
	<h4 class="atras my-5 mx-5 pt-5" @click="volverAtras()">&lt;&lt; Volver</h4>
</div>
</template>

<script setup>
	import { onMounted, ref } from "vue";
	import { useRouter, useRoute } from "vue-router";

	const router = useRouter();
	const route = useRoute();

	const volverAtras = ()=>{
		router.go(-1);
	};

	const nombre = route.params.nombre;
	let integrantes = ref([]);

	const borrarIntegrante = async(id)=>{
		const data = {
			id_casa: route.params.id,
			id_user: id
		};
		const response = await fetch('https://comunestapi.ddns.net/borrarIntegrante',{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		console.log(await response.json());
		router.go(-1);
	}

	onMounted(async ()=>{
		const data = {
			id_casa: route.params.id
		};

		const response = await fetch('https://comunestapi.ddns.net/listaIntegrantes',{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		const respuesta = await response.json();
		integrantes.value = respuesta;
	});
</script>

<style scoped>
.atras{
    cursor: pointer;
    color: blue;
  }

  .integrante {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #f8f9fa;
            padding: 10px 20px;
            margin-bottom: 10px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .delete-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #ff0000;
        }

        .delete-btn:hover {
            color: #d9534f;
			transform: scale(1.05);
        }
</style>