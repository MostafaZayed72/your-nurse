<template>
    <div class="p-4 md:p-10" style="background-image: url('https://img.freepik.com/free-photo/flat-lay-health-still-life-arrangement-with-copy-space_23-2148854064.jpg?w=826&t=st=1727887789~exp=1727888389~hmac=14c048d70f034fcbdd7e7db8f3a71ad0fe7b806a0a0c781b48312ec592e0a60f'); background-size: cover;">
      <div class="max-w-md  p-6 bg-cyan-500 shadow-md rounded-lg">
          <h1 class="text-2xl font-bold mb-6 text-center">تسجيل ممرض جديد</h1>
          <form @submit.prevent="registerNurse" class="space-y-4">
              <InputText v-model="firstName" placeholder="الاسم الأول" required class="w-full" />
              <InputText v-model="lastName" placeholder="اللقب" required class="w-full" />
              <InputText v-model="email" placeholder="البريد الإلكتروني" type="email" required class="w-full" />
              <InputText v-model="phone" style="direction: rtl;" placeholder="رقم الموبايل" type="tel" required class="w-full" />
              <InputText v-model="whatsapp" style="direction: rtl;" placeholder="رقم الواتساب (اختياري)" type="tel" class="w-full" />
  
              <!-- كلمة المرور -->
              <InputText v-model="password" placeholder="كلمة المرور" type="password" required class="w-full" />
              <InputText v-model="confirmPassword" placeholder="تأكيد كلمة المرور" type="password" required class="w-full" />
  
              <Dropdown
                  v-model="region"
                  :options="regions"
                  option-label="name"
                  placeholder="اختر المنطقة"
                  required
                  class="w-full"
              />
  
              <label class="block">الصورة الشخصية</label>
              <input type="file" @change="handleProfileImageChange" accept="image/*" class="w-full py-2" />
              <label class="block">صورة مزاولة المهنة</label>
              <input type="file" @change="handleLicenseImageChange" accept="image/*" class="w-full py-2" />
              <Button label="تسجيل" type="submit" class="w-full bg-blue-darken-4" :disabled="loading" />
          </form>
  
          <Toast ref="toast" class="pl-16 pl-md-0" style="direction: rtl" />
  
          <div v-if="loading" class="spinner-overlay">
              <Loader style="width: 50px; height: 50px;" />
          </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import InputText from 'primevue/inputtext'
  import Dropdown from 'primevue/dropdown'
  import Button from 'primevue/button'
  import Toast from 'primevue/toast';
  import axios from 'axios'
  import { useToast } from 'primevue/usetoast'; // استدعاء صحيح

  const toast = useToast();
  const firstName = ref('');
  const lastName = ref('');
  const email = ref('');
  const phone = ref('');
  const whatsapp = ref('');
  const region = ref(null);
  const profileImage = ref(null);
  const licenseImage = ref(null);
  const loading = ref(false);
  
  const password = ref('');
  const confirmPassword = ref('');
  
  // قائمة المناطق
  const regions = [
      { name: 'سيدي بشر' },
      { name: 'العجمي' },
      { name: 'محرم بك' },
      { name: 'الحضرة' }
  ];
  
  // التعامل مع تغيير الصورة الشخصية
  const handleProfileImageChange = (event) => {
      profileImage.value = event.target.files[0];
  };
  
  // التعامل مع تغيير صورة مزاولة المهنة
  const handleLicenseImageChange = (event) => {
      licenseImage.value = event.target.files[0];
  };
  
  // رفع الصورة إلى Cloudinary
  const uploadImageToCloudinary = async (file) => {
      const url = `https://api.cloudinary.com/v1_1/dzswjhtds/image/upload`;
      const formData = new FormData();
  
      formData.append('file', file);
      formData.append('upload_preset', 'my_upload_preset'); // قم بتعديل هذه المعلومات حسب إعدادات Cloudinary الخاصة بك
  
      try {
          const response = await axios.post(url, formData);
          return response.data.secure_url; // رابط الصورة المرفوعة
      } catch (error) {
          console.error('Error uploading image to Cloudinary:', error);
          return null;
      }
  };
  
  // دالة لتسجيل الممرض
  const registerNurse = async () => {
      if (!profileImage.value || !licenseImage.value) {
          toast.add({ severity: 'warn', summary: 'تحذير', detail: 'يرجى رفع صورة شخصية وصورة مزاولة المهنة' });
          return;
      }
  
      // التحقق من تطابق كلمتي المرور
      if (password.value !== confirmPassword.value) {
          toast.add({ severity: 'error', summary: 'خطأ', detail: 'كلمة المرور وتأكيد كلمة المرور غير متطابقتين' });
          return;
      }
  
      loading.value = true;
  
      const profileImageUrl = await uploadImageToCloudinary(profileImage.value);
      const licenseImageUrl = await uploadImageToCloudinary(licenseImage.value);
  
      if (!profileImageUrl || !licenseImageUrl) {
          toast.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء رفع الصور' });
          loading.value = false;
          return;
      }
  
      // إعداد بيانات الممرض (بدون قاعدة بيانات)
      const nurseData = {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          phone: phone.value,
          whatsapp: whatsapp.value || null,
          region: region.value.name,
          profile_picture: profileImageUrl,
          license_picture: licenseImageUrl,
          password: password.value
      };
  
      // عرض البيانات في الكونسول فقط للتأكد
      console.log('Nurse Registered:', nurseData);
  
      loading.value = false;
  
      toast.add({ severity: 'success', summary: 'نجاح', detail: 'تم تسجيل الممرض بنجاح! سيتم التواصل معك قريباً.' });
  
      resetForm();
  };
  
  // دالة لإعادة تعيين الحقول
  const resetForm = () => {
      firstName.value = '';
      lastName.value = '';
      email.value = '';
      phone.value = '';
      whatsapp.value = '';
      region.value = null;
      profileImage.value = null;
      licenseImage.value = null;
      password.value = '';
      confirmPassword.value = '';
  };
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
  .p-toast-message-warn {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000; /* تأكد من أن الـ Toast يظهر فوق العناصر الأخرى */
  }
  </style>
  