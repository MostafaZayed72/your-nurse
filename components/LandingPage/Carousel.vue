<template>
    <v-container>
      <v-carousel
        height="200"
        show-arrows="hover"
        cycle
        hide-delimiter-background
        class="rounded d-md-none"
        v-if="slides.length > 0"
      >
        <v-carousel-item
          v-for="(slide, i) in slides"
          :key="slide.id"
        >
          <v-sheet height="100%">
            <div class="d-flex fill-height justify-center align-center">
              <!-- عرض الصورة -->
              <img
                :src="slide.image"
                alt="Slider Image"
                class="w-full h-full object-cover rounded-lg"
              />
            </div>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
  
      <v-carousel
        height="500"
        show-arrows="hover"
        cycle
        hide-delimiter-background
        class="rounded mt-10 d-none d-md-block "
        v-if="slides.length > 0"
      >
        <v-carousel-item
          v-for="(slide, i) in slides"
          :key="slide.id"
        >
          <v-sheet height="100%">
            <div class="d-flex fill-height justify-center align-center">
              <!-- عرض الصورة -->
              <img
                :src="slide.image"
                alt="Slider Image"
                class="w-full h-full object-cover rounded-lg"
              />
            </div>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
  
      <Loader v-else class="mt-10" />
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  // تعريف مصفوفة الشرائح
  const slides = ref([
    {
      id: 1,
      image: 'https://cdn.prod.website-files.com/63a1cbc81b0e903002cf9cec/642604b850060e114dc20476_I%27m%20Tired%20of%20Working%20with%20Patients-%20Now%20What%3F%208%20Non-Bedside%20Nursing%20Jobs%20to%20Consider%20.webp',
    },
    {
      id: 2,
      image: 'https://res.cloudinary.com/grand-canyon-university/image/fetch/w_750,h_564,c_fill,g_faces,q_auto/https://www.gcu.edu/sites/default/files/images/articles/6c9a136a729cbdce51a52f6430b127755741251d.jpg',
    },
    {
      id: 3,
      image: 'https://cms.afrotech.com/wp-content/uploads/2022/12/GettyImages-1403278383.jpg',
    },
    {
      id: 4,
      image: 'https://s3.amazonaws.com/utep-uploads/wp-content/uploads/bradley/2018/06/04143519/MaleNurses_Featured_Image.jpg',
    },
  ]);
  
  onMounted(() => {
    // هنا يمكنك استدعاء دالة لجلب الصور من API إذا كنت ترغب في ذلك
  });
  </script>
  
  <style scoped>
  /* إضافة تأثير الزوايا الدائرية */
  .v-carousel-item img {
    border-radius: 0.5rem; /* أو استخدم أي قيمة أخرى حسب احتياجك */
  }
  </style>
  