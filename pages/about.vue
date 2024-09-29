<template>
    <div class="card p-5">
      <h2>تسجيل الممرضين</h2>
      <form @submit.prevent="submitForm">
        <div class="field">
          <label for="name">الاسم:</label>
          <InputText v-model="name" id="name" required />
        </div>
        <div class="field">
          <label for="mobile">رقم الموبايل:</label>
          <InputText v-model="mobile" id="mobile" required />
        </div>
        <div class="field">
          <label for="whatsapp">رقم واتساب:</label>
          <InputText v-model="whatsapp" id="whatsapp" required />
        </div>
        <div class="field">
          <label for="email">الإيميل:</label>
          <InputText v-model="email" id="email" type="email" required />
        </div>
        <div class="field">
          <label for="region">المنطقة:</label>
          <InputText v-model="region" id="region" required />
        </div>
        <div class="field">
          <label for="image">اختر صورة:</label>
          <input type="file" @change="onFileChange" required />
        </div>
        <Button label="تسجيل" icon="pi pi-check" type="submit" />
      </form>
      <Toast ref="toast" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import Toast from 'primevue/toast';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  
  const name = ref('');
  const mobile = ref('');
  const whatsapp = ref('');
  const email = ref('');
  const region = ref('');
  const imageUrl = ref(''); // هذا سيحتوي على رابط الصورة
  const router = useRouter();
  const toast = ref(null);
  
  const onFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // رفع الصورة إلى Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // تأكد من استبدالها بالإعداد الخاص بك
  
      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dzswjhtds/image/upload', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        imageUrl.value = data.secure_url; // احصل على الرابط الآمن للصورة
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.value.add({ severity: 'error', summary: 'خطأ', detail: 'فشل رفع الصورة.' });
      }
    }
  };
  
  const submitForm = async () => {
    console.log('Values being sent:', {
      name: name.value,
      mobile: mobile.value,
      whatsapp: whatsapp.value,
      email: email.value,
      region: region.value,
      image: imageUrl.value, // استخدم الرابط الذي حصلنا عليه
    });
  
    const response = await fetch('/api/nurses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.value,
        mobile: mobile.value,
        whatsapp: whatsapp.value,
        email: email.value,
        region: region.value,
        image: imageUrl.value, // استخدم الرابط الآمن للصورة
      }),
    });
  
    if (response.ok) {
      toast.value.add({ severity: 'success', summary: 'نجاح', detail: 'تم التسجيل بنجاح!' });
      setTimeout(() => {
        router.push('/yourNurse'); // التوجيه إلى صفحة عرض الممرضين
      }, 2000);
    } else {
      toast.value.add({ severity: 'error', summary: 'خطأ', detail: 'فشل التسجيل. حاول مرة أخرى.' });
    }
  };
  </script>
  
  <style scoped>
  .card {
    max-width: 400px;
    margin: auto;
  }
  </style>
  