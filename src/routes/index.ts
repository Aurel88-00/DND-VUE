import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Auth/Login.vue";
import Home from "../views/Home.vue";
import Singup from "../components/Auth/Singup.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
          path: "/",
          name:"Home",
          component: Home
        },
        {
            path: "/login",
            name: "Login",
            component: Login
        },
        {
            path:'/register',
            name: "Register",
            component: Singup
        }
       
    ]
})

export default router;