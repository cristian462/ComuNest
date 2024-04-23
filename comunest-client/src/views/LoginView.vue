<template>
	<div class="container-md mt-5">
    <div class="header p-5 pb-4 border-bottom-0">
        <h1 class="fw-bold mb-0 fs-2 mb-4">Iniciar Sesión</h1>
    </div>
    <div class="body p-5 pt-0">
            <div class="form-floating mb-4">
                <input type="email" class="form-control rounded-3" :class="mal" placeholder="name@example.com" v-model="user.correo" required/>
                <label for="mail">Correo Electrónico</label>
            </div>

            <div class="form-floating mb-5">
                <input type="password" class="form-control rounded-3" :class="mal" placeholder="Password" v-model="user.pass" required/>
                <label for="pass">Contraseña</label>
            </div>
            <div class="mb-4 mx-5-md mx-5-lg">{{ mensaje }}</div>
            <button class="w-100 my-2 btn btn-lg rounded-3 btn-primary" @click="submit">Iniciar Sesión</button>
    </div>
</div>
</template>

<script setup>
import {ref} from "vue";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
let user = ref({
    correo: '',
    pass: '',
  });

  let mal = ref('');
  let mensaje = ref('');

  const submit = async ()=>{
	try{
		const data = {
			"email": user.value.correo,
			"pass": user.value.pass
		}
		const response = await fetch('http://localhost:4000/login',{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		const respuesta = await response.json();
		//console.log(respuesta);

		if(respuesta.login === 0){
			mal = "is-invalid"
			mensaje = "Correo o contraseña incorrectos";
		} else if(respuesta.login === 1){
			store.commit('start', respuesta.usuario);
			console.log(store.state.user);
			router.push('/home');
		}
	}catch(err){
		console.log(err);
	}
  }
</script>