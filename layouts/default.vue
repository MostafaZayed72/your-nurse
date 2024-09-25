<template>
  <div :class="{ 'dark': isDarkMode }">
    <div class="mb-0 px-4 bg-cyan-500 flex justify-between items-center py-2 shadow-xl">
      <div class="flex items-center gap-4">
        <Icon
          @click="toggleSidebar"
          name="iconamoon:menu-burger-horizontal"
          class="md:hidden text-xl text-white cursor-pointer"
        />
        <span class="text-2xl font-bold ml-2 bg-cyan-700 text-yellow-400 px-4 py-2 rounded-xl">Your Nurse</span>
      </div>

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
          to="/about" 
          active-class="bg-cyan-700 text-yellow-400" 
          exact-active-class="bg-cyan-700 text-yellow-400"
        >
          من نحن؟
        </NuxtLink>
        <NuxtLink 
          class="hover:bg-cyan-700 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" 
          to="/choose-nurse" 
          active-class="bg-cyan-700 text-yellow-400" 
          exact-active-class="bg-cyan-700 text-yellow-400"
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
      </div>

      <DarkModeToggle />
    </div>

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
            to="/about" 
            active-class="bg-cyan-700 text-yellow-400" 
            exact-active-class="bg-cyan-700 text-yellow-400"
          >
            من نحن؟
          </NuxtLink>
          <NuxtLink 
            class="hover:bg-cyan-700 px-4 py-2 rounded-lg delayed cursor-pointer font-bold text-slate-50 hover:text-yellow-400" 
            to="/choose-nurse" 
            active-class="bg-cyan-700 text-yellow-400" 
            exact-active-class="bg-cyan-700 text-yellow-400"
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
        </div>
      </div>
    </transition>

    <main class="p-0">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
}
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
</style>
