<template>
  <div class="p-4 md:p-10 flex flex-col justify-center items-center my-auto h-screen" style="background-image: url('http://localhost:3000/_nuxt/public/imgs/logo.jpeg'); background-repeat: repeat; background-size: contain;  ">
   <div class="max-w-md mx-auto  p-6 bg-cyan-500 shadow-md rounded-lg my-auto">
     <h1 class="text-2xl font-bold mb-6 text-center ">تسجيل الدخول</h1>
     <form @submit.prevent="loginUser" class="space-y-4">
       <InputText v-model="email" placeholder="البريد الإلكتروني" type="email" required class="w-full" />
       <InputText v-model="password" placeholder="كلمة المرور" type="password" required class="w-full" />
       <Button label="تسجيل الدخول" type="submit" class="w-full bg-blue-darken-4" :disabled="loading" />
     </form>
 
     <Toast class="pl-16 pl-md-0" style="direction: rtl" />
 
     <div v-if="loading" class="spinner-overlay">
       <Loader style="width: 50px; height: 50px;" />
     </div>
   </div>
  </div>
 </template>
 
 <script setup>
 import { ref } from 'vue'
 import InputText from 'primevue/inputtext'
 import Button from 'primevue/button'
 import Toast from 'primevue/toast'
 import { useToast } from 'primevue/usetoast'
 import { createClient } from '@supabase/supabase-js'
 
 const email = ref('')
 const password = ref('')
 const loading = ref(false)
 const toast = useToast()
 
 const supabaseUrl = 'https://nvhadtslthjknimxnsjg.supabase.co'
 const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52aGFkdHNsdGhqa25pbXhuc2pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2ODY0NzksImV4cCI6MjA0MzI2MjQ3OX0.9elgAbob5JqVwDqf5jni6NZfd7tBOgmLV08kXea_cK0' // ضع المفتاح الصحيح هنا
 const supabase = createClient(supabaseUrl, supabaseKey)
 
 // دالة تسجيل الدخول
 const loginUser = async () => {
   loading.value = true
 
   const { data, error } = await supabase.auth.signInWithPassword({
   email: email.value,
   password: password.value,
 });
 
   loading.value = false
 
   if (error) {
     toast.add({ severity: 'error', summary: 'خطأ', detail: error.message })
     return
   }
 
   // في حالة النجاح، الحصول على التوكن
   const token = data.session.access_token
 
   // حفظ التوكن في localStorage أو استخدامه حسب الحاجة
   localStorage.setItem('token', token)
 
   toast.add({ severity: 'success', summary: 'نجاح', detail: 'تم تسجيل الدخول بنجاح' })
 
   // توجيه المستخدم إلى صفحة أخرى بعد تسجيل الدخول
   router.push('/')
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
 