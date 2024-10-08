<template>
  <div :class="{ 'dark': isDarkMode }">
    <div class="mb-0 px-4 bg-cyan-500 flex justify-between items-center py-2 shadow-xl">
      <div class="flex items-center gap-4">
        <Icon
          @click="toggleSidebar"
          name="iconamoon:menu-burger-horizontal"
          class="md:hidden text-xl text-white cursor-pointer"
        />
        <img src="/public/imgs/logo.jpeg" class="w-16 h-16 cursor-pointer" alt="" style="border-radius: 50%;" @click="navigateTo('/')">
      </div>

      <!-- الروابط في الشاشات الكبيرة -->
      <div class="links md:flex items-center gap-4 hidden">
        <NuxtLink 
          class="hover:bg-cyan-700 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" 
          to="/" 
          active-class="bg-cyan-700 text-yellow-400" 
          exact-active-class="bg-cyan-700 text-yellow-400"
        >
          الرئيسية
        </NuxtLink>
        <NuxtLink 
          class="hover:bg-cyan-700 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" 
          to="/Terms_and_Conditions" 
          active-class="bg-cyan-700 text-yellow-400" 
          exact-active-class="bg-cyan-700 text-yellow-400"
        >
        الشروط والأحكام

        </NuxtLink>
        <NuxtLink 
          :class="['hover:bg-cyan-700 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400', 
                   { 'bg-cyan-700 text-yellow-400': isYourNurseActive }]" 
          to="/yourNurse"
        >
          اختر ممرضك
        </NuxtLink>
        <NuxtLink 
          class="hover:bg-cyan-700 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" 
          to="/contact" 
          active-class="bg-cyan-700 text-yellow-400" 
          exact-active-class="bg-cyan-700 text-yellow-400"
        >
          تواصل معنا
        </NuxtLink>

        <!-- Dropdown للحساب الجديد -->
        <div class="relative">
          <button 
            @click="toggleDropdown" 
            :class="['hover:bg-cyan-700 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400', 
                    { 'bg-cyan-700 text-yellow-400': isSignupSectionActive }]"
          >
            تسجيل حساب جديد
          </button>
          <div v-if="isDropdownOpen" class="absolute bg-cyan-700 p-4 gap-2 flex flex-col  shadow-lg rounded mt-2 w-48 right-0 z-10">
            <NuxtLink 
              class="hover:text-yellow-400 delayed"
              to="/nurses/signup"
            >
              سجل كممرض
            </NuxtLink>
            <NuxtLink 
              class="hover:text-yellow-400 delayed"
              to="/users/signup"
            >
              سجل كمستخدم عادي
            </NuxtLink>
          </div>
        </div>
      </div>

      <DarkModeToggle />
    </div>

    <!-- Burger Menu Transition for Small Screens -->
    <transition name="slide">
      <div v-if="isSidebarOpen" class="bg-cyan-500 md:hidden border-t-2 border-cyan-600">
        <div class="flex flex-col p-4">
          <NuxtLink 
            class="hover:bg-cyan-700 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" 
            to="/" 
            active-class="bg-cyan-700 text-yellow-400" 
            exact-active-class="bg-cyan-700 text-yellow-400"
          >
            الرئيسية
          </NuxtLink>
          <NuxtLink 
            class="hover:bg-cyan-700 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" 
            to="/Terms_and_Conditions" 
            active-class="bg-cyan-700 text-yellow-400" 
            exact-active-class="bg-cyan-700 text-yellow-400"
          >
          الشروط والأحكام
        </NuxtLink>
          <NuxtLink 
            :class="['hover:bg-cyan-700 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400', 
                     { 'bg-cyan-700 text-yellow-400': isYourNurseActive }]" 
            to="/yourNurse"
          >
            اختر ممرضك
          </NuxtLink>
          <NuxtLink 
            class="hover:bg-cyan-700 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" 
            to="/contact" 
            active-class="bg-cyan-700 text-yellow-400" 
            exact-active-class="bg-cyan-700 text-yellow-400"
          >
            تواصل معنا
          </NuxtLink>

          <!-- Dropdown للحساب الجديد في الشاشات الصغيرة -->
          <div class="relative">
            <button 
              @click="toggleDropdown" 
              :class="['hover:bg-cyan-700 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400', 
                      { 'bg-cyan-700 text-yellow-400': isSignupSectionActive }]"
            >
              تسجيل حساب جديد
            </button>
            <div v-if="isDropdownOpen" class="bg-cyan-700 shadow-lg rounded mt-2 w-fit p-2 z-10 flex flex-col gap-2">
              <NuxtLink 
                to="/nurses/signup"
              >
                سجل كممرض
              </NuxtLink>
              <NuxtLink 
                to="/users/signup"
              >
                سجل كمستخدم عادي
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </transition>
    
    <Loader v-if="loading" />
    <main class="p-0">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const loading = ref(true);
const router = useRouter();

// التحكم في حالة الـ loading عند التنقل بين الصفحات
router.beforeEach((to, from, next) => {
  loading.value = true;
  next();
});

router.afterEach(() => {
  loading.value = false;
});

// عند تحميل الصفحة لأول مرة
onMounted(() => {
  loading.value = false;
});

const isSidebarOpen = ref(false);
const isDropdownOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
}

// إغلاق القائمة عند النقر خارجها
const closeDropdownOnClickOutside = (event) => {
  const dropdown = document.querySelector('.relative'); // عنصر القائمة
  if (dropdown && !dropdown.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

// إضافة وإزالة مستمع للنقر عند تشغيل وإيقاف المكون
onMounted(() => {
  document.addEventListener('click', closeDropdownOnClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdownOnClickOutside);
});

const route = useRoute();

// للتحقق إذا كان الرابط الحالي يحتوي على كلمة "signup" وتعيين الـ active
const isSignupActive = computed(() => route.path.endsWith('signup'));

// للتحقق إذا كان أي مسار يحتوي على "signup"
const isSignupSectionActive = computed(() => {
  return route.path.includes('signup');
});

// للتحقق إذا كان الرابط الحالي هو "yourNurse"
const isYourNurseActive = computed(() => route.path.startsWith('/yourNurse'));
</script>

<style scoped>
body.dark {
  background-color: #1e1e1e;
  color: white;
}

.slide-enter-active, .slide-leave-active {
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}

.slide-enter, .slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-enter-to, .slide-leave {
  opacity: 1;
  transform: translateX(0);
}

.slide-enter {
  opacity: 0;
  transform: translateX(-20px);
}

.dark .p-menubar .p-menubar-root-list {
  color: white;
}

.p-menuitem {
  color: black;
}

.dark .p-menuitem {
  color: white;
}

.p-menubar {
  color: white;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.z-10 {
  z-index: 10;
}

.bg-white {
  background-color: white;
}

.text-black {
  color: black;
}

.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.rounded {
  border-radius: 0.25rem;
}

.hover\:bg-gray-100:hover {
  background-color: #f7fafc;
}

.w-full {
  width: 100%;
}

.mt-2 {
  margin-top: 0.5rem;
}

.right-0 {
  right: 0;
}
</style>
