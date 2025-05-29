<script setup lang="ts">
import { ref, computed } from "vue";
import type { IRegister } from "../../lib/interfaces/register.interface";
import { Roles } from "../../lib/enums/roles.enum";
import { registerSchema } from "../../lib/schemas/register.schema";
import { useRouter } from "vue-router";
import Tabs from "../utils/Tabs.vue";
import { register } from "../../api/auth";

//Tabs updates
const tabsData = [
  { id: 1, label: "Register as User", value: Roles.USER },
  { id: 2, label: "Register as Admin", value: Roles.ADMIN },
];
const activeTab = ref(1);
const handleActiveTab = (tabId: number) => {
   activeTab.value = tabId;
}
const selectedRole = computed(() : Roles => {
  const foundTab = tabsData.find(tab => tab.id === activeTab.value)
  return foundTab ? foundTab.value : Roles.USER;
}) 

const registerData = ref<IRegister>({
  username: "",
  email: "",
  password: "",
  role: Roles.USER,
});
const showPassword = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");
const usernameError = ref("");
const emailError = ref("");
const passwordError = ref("");
const router = useRouter();

console.log(selectedRole, "activetab")

const validateUsername = async () => {
  usernameError.value = "";
  try {
    await registerSchema.validate({
      username: registerData.value.username,
      email: "",
      password: "",
    });
    return true;
  } catch (error: any) {
    usernameError.value = error.message;
    return false;
  }
};

const validateEmail = async () => {
  emailError.value = "";

  try {
    await registerSchema.validate({
      username: "",
      email: registerData.value.email,
      password: "",
    });
    return true;
  } catch (error: any) {
    emailError.value = error.message;
    return false;
  }
};

const validatePassword = async () => {
  passwordError.value = "";

  try {
    await registerSchema.validate({
      username: registerData.value.username,
      email: registerData.value.email,
      password: registerData.value.password,
    });
    return true;
  } catch (error: any) {
    passwordError.value = error.message;
    return false;
  }
};

const validateForm = async () => {
  try {
    await registerSchema.validate(
      {
        username: registerData.value.username,
        email: registerData.value.email,
        password: registerData.value.password,
      },
      { abortEarly: false }
    );

    usernameError.value = "";
    emailError.value = "";
    passwordError.value = "";
    return true;
  } catch (error: any) {
    if (error.inner) {
      error.inner.forEach((err: any) => {
        if (err.path === "username") {
          usernameError.value = error.message;
        }
        if (err.path === "email") {
          emailError.value = err.message;
        }
        if (err.path === "password") {
          passwordError.value = err.message;
        }
      });
    }
    return false;
  }
};
const handleSubmit = async () => {
  const isValid = await validateForm();

  if (!isValid) {
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";
  try {
    const { data } = await register({
      username: registerData.value.username,
      email: registerData.value.email,
      password: registerData.value.password,
      role: selectedRole.value
    });
    if (data && data.accessToken) {
      router.push("/");
    }
  } catch (error) {
    errorMessage.value = "Invalid email or password. Please try again.";
    console.error("Login error:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <main class="register-container">
    <div class="register-area">
      <div class="register-card">
        <h1 class="register-title">Register</h1>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <Tabs :tabs="tabsData" :activeTab="activeTab" @setActiveTab="handleActiveTab" />
        <form @submit.prevent="handleSubmit" class="register-form">
            <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              v-model="registerData.username"
              placeholder="Enter your username"
              :class="{ 'input-error': usernameError }"
              @blur="validateUsername"
              required
            />
            <span v-if="usernameError" class="error-text">{{ usernameError }}</span>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="registerData.email"
              placeholder="Enter your email"
              :class="{ 'input-error': emailError }"
              @blur="validateEmail"
              required
            />
            <span v-if="emailError" class="error-text">{{ emailError }}</span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input-container">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="registerData.password"
                placeholder="Enter your password"
                :class="{ 'input-error': passwordError }"
                @blur="validatePassword"
                required
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? "Hide" : "Show" }}
              </button>
            </div>
            <span v-if="passwordError" class="error-text">{{
              passwordError
            }}</span>
          </div>

          <div class="form-group">
            <label for="role">Role</label>
              <input
                type="text"
                id="role"
                :value="tabsData.find(tab => tab.id === activeTab)?.value"
                disabled="true"
              />
              
          </div>

          <div class="form-actions">
            <button type="submit" class="register-button" :disabled="isSubmitting">
              {{ isSubmitting ? "Registering..." : "Register" }}
            </button>
          </div>
        </form>

        <div class="login-link">
          Already have an account? <RouterLink to="/login">Login</RouterLink>
        </div>
      </div>
    </div>
    <div class="image-area">
      <img
        loading="lazy"
        decoding="async"
        srcset="/src/assets/signup-image.jpg 50w"
        height="max-content"
        style="aspect-ratio: 5/3; height: 100%; width: 100%; object-fit: cover"
        alt="signup-image"
      />
    </div>
  </main>
</template>
<style scoped>
.register-container {
  display: grid;
  grid-template-columns: repeat(2, 50%);
  gap: 20px;
  padding: 20px;
}
.register-area,
.image-area {
  height: 94vh;
}

.register-area{
  align-content: center;
}
.register-title{
  text-align: center;
  margin-bottom: 20px;
  color: #666;
}
.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.form-group input[type="email"],
.form-group input[type="password"],
.form-group input[type="text"] {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.input-error {
  border-color: #e53935 !important;
}

.error-text {
  color: #e53935;
  font-size: 12px;
  margin-top: 4px;
}

.error-message {
  background-color: #ffebee;
  color: #e53935;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
}


.form-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
}

.register-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.register-button:hover {
  background-color: #3a7bc8;
}

.register-button:disabled {
  background-color: #a5c7f0;
  cursor: not-allowed;
}
.password-input-container {
  position: relative;
  display: flex;
}

.login-link {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #555;
}

.login-link a {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

.password-input-container input {
  flex: 1;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #777;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
}

.toggle-password:hover {
  color: #4a90e2;
}
</style>
