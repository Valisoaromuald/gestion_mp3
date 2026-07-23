import { gestionMp3Api } from "@/api/clients/gestionMp3Api"
import { utilisateurService } from "@/services/utilisateurService"
import { useAuthStore } from "@/stores/authStore"
import type { Utilisateur } from "@/types/utilisateur"
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"

interface LoginForm {
    login: string
    motDePasse: string
}
export function useUtilisateur() {
    const loginForm = reactive<LoginForm>(
        defaultForm()
    )
    const router = useRouter()
    const authStore = useAuthStore()
    const isLoginLoading = ref<boolean>(false);
    const errorMessage = ref<string>('')

    function defaultForm(): LoginForm {
        return {
            login: '',
            motDePasse: ''
        }
    }
    async function authentifier() {
        try {
            errorMessage.value = ''
            isLoginLoading.value = true

            const utilisateur: Partial<Utilisateur> = (await gestionMp3Api.post<Partial<Utilisateur>>(utilisateurService.endpoint + '/login', { login: loginForm.login, motDePasse: loginForm.motDePasse })).data
            if (utilisateur.id) {
                authStore.login(utilisateur)
                router.push({ name: 'playlists' })
            }
            else {
                errorMessage.value = "veuillez bien verifier le login et le mot de passe";
            }
        } catch (error) {
            errorMessage.value = "une erreur cote serveur est survenu";
        }
        finally {
            isLoginLoading.value = false
        }
    }
    function seDeconnecter() {
        authStore.logout()
        router.replace({name:"login"})
    }
    return {
        loginForm,
        errorMessage,
        isLoginLoading,
        authentifier,
        seDeconnecter
    }
}