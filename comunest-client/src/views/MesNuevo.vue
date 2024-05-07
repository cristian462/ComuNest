<template>
	<div>
	</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
	onMounted(async()=>{
		try{
			const route = useRoute();
			const router = useRouter();
			const store = useStore();
			const date = new Date();
			const nombreMesmin = date.toLocaleString('default', { month: 'long' });
			const nombreMes = nombreMesmin.charAt(0).toUpperCase() + nombreMesmin.slice(1);
    
			let data = {
				id_casa: route.params.id,
				nombre: nombreMes,
				id_user: store.state.user.id
			}
			const response = await fetch("http://localhost:4000/nuevoMes", {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			console.log(response);
			router.go(-1);	
				}catch(error){
					console.error("Error fetching data:", error);
				}
			});
</script>