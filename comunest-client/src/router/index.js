import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegistroView from '../views/RegistroView.vue'
import LoginView from '../views/LoginView.vue'
import CasaView from '../views/CasaView.vue'
import NuevaCasa from '../views/NuevaCasa.vue'
import MesNuevo from '../views/MesNuevo.vue'
import CasaLoginView from '../views/CasaLoginView.vue'
import GastosView from '../views/GastosView.vue'
import GastoNuevoView from '../views/GastoNuevoView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/casa/:id/:nombre',
    name: 'casa',
    component: CasaView
  },
  {
    path: '/registro',
    name: 'registro',
    component: RegistroView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/mesNuevo/:id',
    name: 'mesNuevo',
    component: MesNuevo
  },
  {
    path: '/casaNueva',
    name: 'casaNueva',
    component: NuevaCasa
  },
  {
    path: '/casaLogin/:id/:nombre',
    name: 'casaLogin',
    component: CasaLoginView
  },
  {
    path: '/gastosView/:id_mes/:nombre/:resuelto/:id_casa',
    name: 'gastos',
    component: GastosView
  },
  {
    path: '/gastoNuevo/:id_mes/:id_casa',
    name: 'gastoNuevo',
    component: GastoNuevoView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router