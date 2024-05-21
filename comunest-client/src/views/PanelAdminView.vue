<template>
	<div class="container my-5">
		<h1 class="d-flex justify-content-center mb-5">Eliminar casas</h1>
		<div class="container my-4">
			<div class="row justify-content-center">
				<div class="col-md-6 mb-4" v-for="casa in casas" :key="casa.id_casa">
					<router-link :to="{name: 'casaDetail', params: {id: casa.id_casa, nombre: casa.nombre}}">
						<div class="card-element">
							<div class="link">
							{{ casa.nombre }}
							</div>
							<button class="delete-btn" @click="borrarCasa(casa.id_casa)">&times;</button>
						</div>
					</router-link>
				</div>
			</div>
		</div>
		<h4 class="atras my-5 mx-5" @click="volverAtras()">&lt;&lt; Volver</h4>
	</div>
</template>

<script setup>
	import { useRouter } from "vue-router";
	import { onMounted, ref } from 'vue';

	const router = useRouter();

	const volverAtras = ()=>{
		router.go(-1);
	};

	let casas = ref([]);

	const borrarCasa = async(id)=>{
		let data = {id_casa: id}
		const response = await fetch("https://comunestapi.ddns.net/borrarCasa",{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
			});
		console.log(response);
		router.go(-1);
	}

	onMounted(async()=>{
		const response =await fetch('https://comunestapi.ddns.net/allCasas');

		const respuesta = await response.json();
		casas.value = respuesta;
	});
</script>


<style scoped>
.atras{
    cursor: pointer;
    color: blue;
  }

  .card-element {
            background-color: #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
        }

		.link{
			margin-bottom: 1rem;
            height: 9rem;
			width: 100%;
			padding: 12px 20px;
			display: flex;
            align-items: center;
            justify-content: center;
			font-size: 2rem;
			list-style-type: none;
			text-decoration: none;
			color: black;
		}

        .card-element:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            cursor: pointer;
        }

        .delete-btn {
            position: absolute;
            top: 10px;
            right: 20px;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #ff0000;
        }
</style>