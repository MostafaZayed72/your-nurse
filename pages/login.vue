<template>
  <div class="p-4 md:p-10 flex flex-col justify-center items-center my-auto h-screen"
    style="background-image: url('http://localhost:3000/_nuxt/public/imgs/logo.jpeg'); background-repeat: repeat; background-size: contain;">
    <div class="max-w-md mx-auto p-6 bg-cyan-500 shadow-md rounded-lg my-auto">
      <h1 class="text-2xl font-bold mb-6 text-center">تسجيل الدخول</h1>
      <form @submit.prevent="loginUser" class="space-y-4">
        <InputText v-model="email" placeholder="البريد الإلكتروني" type="email" required class="w-full" />
        <InputText v-model="password" placeholder="كلمة المرور" type="password" required class="w-full" />
        <Button label="تسجيل الدخول" type="submit" class="w-full bg-blue-darken-4" :disabled="loading" />
      </form>

      <Toast class="pl-16 pl-md-0" style="direction: rtl" />

      <Loader v-if="loading" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'  // استيراد useLocalStorage

const email = ref('')
const password = ref('')
const loading = ref(false)
const toast = useToast()
const router = useRouter()

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

// استخدام useLocalStorage بدلاً من localStorage مباشرة
const token = useLocalStorage('token', '')
const userID = useLocalStorage('userID', '')

const loginUser = async () => {
  loading.value = true

  try {
    const response = await axios.post(`${apiBaseUrl}/api/Users/login`, {
      email: email.value,
      password: password.value,
    })

    // في حالة النجاح، الحصول على التوكن و userID
    const { token: newToken, userID: newUserID } = response.data
    
    // تخزين التوكن و userID باستخدام useLocalStorage
    token.value = newToken
    userID.value = newUserID

    toast.add({ severity: 'success', summary: 'نجاح', detail: 'تم تسجيل الدخول بنجاح' })

    // توجيه المستخدم إلى الصفحة الرئيسية بعد تسجيل الدخول
    router.push('/')
  } catch (error) {
    const errorMsg = error.response?.data?.msg || 'حدث خطأ أثناء تسجيل الدخول'
    toast.add({ severity: 'error', summary: 'خطأ', detail: errorMsg })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
input {
  color: black !important;
}

/* CSS لتوسيع ProgressSpinner ليغطي الشاشة */
.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
</style>
