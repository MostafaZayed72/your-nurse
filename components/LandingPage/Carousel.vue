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
                class="w-full h-full object-cover rounded-lg "
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
      image: 'https://scontent.fcai19-8.fna.fbcdn.net/v/t39.30808-6/462537619_122110091732547089_7600453508252705657_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeHOTxQ0URpjLw_YmnJMJ5AKHuYqSZ9XaSQe5ipJn1dpJNOkWO0sdRfzE0TNdAbEjAn4x_Q7Nu1BJIIgrxtjVJJm&_nc_ohc=S49pCg10lREQ7kNvgHdzbh1&_nc_zt=23&_nc_ht=scontent.fcai19-8.fna&_nc_gid=AA0x3zqJx_sesG6NTX4idoO&oh=00_AYDa_R_IcleCNXs7Bsj1oUe8HbW0Ihu3vblm9R17SmCYHQ&oe=6737D4F9',
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
  