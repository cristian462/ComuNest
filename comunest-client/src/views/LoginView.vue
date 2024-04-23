<template>
	<div class="container-md mt-5">
    <div class="header p-5 pb-4 border-bottom-0">
        <h1 class="fw-bold mb-0 fs-2 mb-4">Iniciar Sesión</h1>
    </div>
    <div class="body p-5 pt-0">
            <div class="form-floating mb-4">
                <input type="email" class="form-control rounded-3" placeholder="name@example.com" v-model="user.correo" required/>
                <label for="mail">Correo Electrónico</label>
            </div>

            <div class="form-floating mb-5">
                <input type="password" class="form-control rounded-3" placeholder="Password" v-model="user.pass" required/>
                <label for="pass">Contraseña</label>
            </div>
            <div class="mb-4 mx-5-md mx-5-lg">
            </div>
            <button class="w-100 my-2 btn btn-lg rounded-3 btn-primary" @click="submit">Iniciar Sesión</button>
    </div>
</div>
</template>

<script setup>
import {ref} from "vue";
import { useStore } from 'vuex';

const store = useStore();
let user = ref({
    correo: '',
    pass: '',
  });

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

		console.log(respuesta.usuario);

		switch(respuesta.login){
			case 0:
				return "no coincide el correo";
			case 1:
				return "contraseña incorrecta";
			case 2:
				store.commit('setUser', respuesta.usuario);
				console.log(store.state.user);
				store.getters.destroy;
				console.log(store.state.user);
		}

	}catch(err){
		console.log(err);
	}
  }
</script>