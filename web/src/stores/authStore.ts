import type { Utilisateur } from "@/types/utilisateur";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useAuthStore = defineStore("auth",()=>{
    const isAuthenticated = ref<boolean>(false)
    const user = ref<Partial<Utilisateur>>({})
    function setUtilisateur(us:Partial<Utilisateur>){
        user.value = us
    }
    function login(utilisateur: Partial<Utilisateur>) {
      user.value = utilisateur;
      isAuthenticated.value = true;
    }

    function logout() {
      user.value = {};
      isAuthenticated.value = false;
    }
    return{
        isAuthenticated,
        user,
        login,
        logout,
        setUtilisateur
    }
},{persist:true})