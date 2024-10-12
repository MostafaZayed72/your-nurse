<template>
    <div class="language-switcher">
      <h1
        v-if="locale === 'ar-AR'"
        @click="switchLanguage('en-US')"
        class="hover:text-neutral-800 delayed bg-cyan-700  px-2 py-1 rounded button"
      >
        English
    </h1>
      <h1
        v-if="locale === 'en-US'"
        @click="switchLanguage('ar-AR')"
        class="hover:text-neutral-800 delayed bg-cyan-700  px-2 py-1 rounded button"
      >
        عربي
    </h1>
    </div>
  </template>
  
  <script setup>
  import { useI18n } from 'vue-i18n';
  import { ref, onMounted } from 'vue';
  
  // استخدام i18n
  const { locale } = useI18n();
  
  // تخزين وإسترجاع اللغة من localStorage
  const switchLanguage = (lang) => {
    locale.value = lang;
    localStorage.setItem('preferredLanguage', lang); // حفظ اللغة في localStorage
  };
  
  // عند تحميل الصفحة
  onMounted(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage');
    
    // إذا كانت اللغة محفوظة مسبقاً في localStorage، نستخدمها
    if (storedLanguage) {
      locale.value = storedLanguage;
    } else {
      // إذا لم تكن موجودة، يمكن تعيين اللغة الافتراضية (مثلاً: العربية)
      locale.value = 'ar-AR'; // أو يمكنك جعلها 'en-US' إذا كانت اللغة الافتراضية
      localStorage.setItem('preferredLanguage', locale.value); // حفظ اللغة الافتراضية
    }
  });
  </script>
  
  <style scoped>
  .language-switcher {
    display: flex;
    gap: 8px;
  }
  
  .button {
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: color 0.3s ease;
  }
  
  .button:hover {
    color: #f1c40f;
  }
  </style>
  