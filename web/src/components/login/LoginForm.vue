<script lang="ts" setup>
import { ref } from 'vue';
const errorMessage = ref<string>('');
const login = defineModel<string>('login', { type: String })
const password = defineModel<string>('password', { type: String })
</script>

<template>
    <div class="login-view container-fluid d-flex flex-column justify-content-center align-items-center min-vh-100">
        <div class="login-card shadow p-4 p-md-5 w-100 mx-auto" style="max-width: 450px;">
            <div class="card-body">

                <h2 class="h3 fw-bold text-center mb-4 login-title">
                    Mihaino hira
                </h2>

                <form>
                    <!-- LOGIN -->
                    <div class="mb-3">
                        <label for="login" class="form-label fw-medium login-label">
                            Login
                        </label>
                        <input id="login" type="text" class="form-control login-input" v-model="login"
                            placeholder="exemple@email.com" />
                    </div>

                    <!-- PASSWORD -->
                    <div class="mb-4">
                        <label for="password" class="form-label fw-medium login-label">
                            Mot de passe
                        </label>
                        <input id="password" type="password" class="form-control login-input" v-model="password"
                            placeholder="••••••••" />
                    </div>

                    <button type="submit" class="btn w-100 login-btn">
                        Se connecter
                    </button>
                </form>

            </div>
        </div>

        <div v-show="errorMessage.length !== 0" class="alert login-alert mt-4 mx-auto" style="max-width: 450px;">
            {{ errorMessage }}
        </div>
    </div>
</template>

<style scoped>
.login-view {
    background-color: var(--body-color);
}

.login-card {
    background-color: var(--surface-color);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
}

.login-title {
    color: var(--text-color);
}

.login-label {
    color: var(--text-secondary);
}

.login-input {
    background-color: var(--bg-gray);
    border: 1px solid var(--border-subtle);
    color: var(--text-color);
}

.login-input::placeholder {
    color: var(--text-tertiary);
}

.login-input:focus {
    background-color: var(--bg-gray);
    border-color: var(--primary-color);
    color: var(--text-color);
    box-shadow: 0 0 0 3px rgba(53, 178, 224, 0.2);
}

.login-btn {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--body-color);
    font-weight: 600;
    transition: opacity 0.2s ease;
}

.login-btn:hover {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    opacity: 0.85;
    color: var(--body-color);
}

.login-alert {
    background-color: var(--surface-color);
    border: 1px solid #b23a3a;
    color: #f0a3a3;
}
</style>