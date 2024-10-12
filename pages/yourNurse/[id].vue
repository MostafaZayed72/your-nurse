<template>
    <div class="nurse-details p-4">
      <!-- Card لعرض المعلومات العامة -->
      <Card class="mb-4 pa-4 Card mx-auto">
        <template #header>
          <div class="flex align-items-center gap-2">
            <img :src="nurse.image" alt="عمرو ناصر" class="w-20 h-20 rounded-full" />
            <div>
              <h2 class="text-2xl font-bold">{{ nurse.name }}</h2>
              <Tag value="الممرض" severity="info" class="mt-1" />
            </div>
          </div>
        </template>

        <template #content>
          <div class="flex flex-col md:flex-row mt-2 md:justify-between items-center gap-6">
            <div class="flex gap-2">
              <Icon name="logos:whatsapp-icon" class="text-3xl cursor-pointer"  />
              <Icon name="material-symbols:phone-enabled" class="text-3xl cursor-pointer" color="blue"  />
            </div>

            <!-- تقييم النجوم باستخدام Vuetify -->
            <div class="flex flex-col md:flex-row items-center gap-4" style="direction: ltr;">
              <v-rating
                v-model="rating"
                halfIncrements
                :length="5"
                color="blue"
                readonly
                

              />
              <h1>التقييم : 4.5</h1>
            </div>
          </div>
        </template>
      </Card>

      <!-- DataTable لعرض التفاصيل -->
      <DataTable :value="services" responsiveLayout="scroll" class="shadow-2">
        <Column class="text-start" field="service" header="الخدمة" />
        <Column class="text-start" field="description" header="الوصف" />
        <Column class="text-start" field="price" header="السعر" />
      </DataTable>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Tag from 'primevue/tag';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import 'primeicons/primeicons.css';

// بيانات الممرض
const nurse = ref({
  name: 'عمرو ناصر',
  image: 'https://png.pngtree.com/background/20231022/original/pngtree-smiling-and-young-businessman-self-assured-confidence-white-background-photo-picture-image_5683113.jpg',
});

// تقييم النجوم
const rating = ref(2.9); // تقييم 4.5 من 5

// بيانات الخدمات التي يقدمها الممرض
const services = ref([
  { service: 'العناية المنزلية', description: 'تقديم رعاية طبية للمرضى في منازلهم.', price: '300 جنيه' },
  { service: 'متابعة الحالات المزمنة', description: 'متابعة وعلاج الحالات المزمنة مثل السكري وارتفاع ضغط الدم.', price: '400 جنيه' },
  { service: 'التأهيل الطبي', description: 'تأهيل المرضى بعد العمليات الجراحية أو الإصابات.', price: '500 جنيه' },
]);
</script>

<style scoped>
.nurse-details {
  max-width: 800px;
  margin: 0 auto;
}

img {
  object-fit: cover;
}

.p-4 {
  padding: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.shadow-2 {
  box-shadow: 0 2px 8px rgba(124, 123, 123, 0.1);
}

.Card {
  background-color: rgb(207, 212, 214);
}

.dark .Card {
  background-color: rgb(53, 55, 56);
  color: white;
}


/* تخصيص مظهر النجوم */
.custom-rating .v-rating__icon {
  font-size: 20px; /* حجم النجوم */
}

/* لتأكيد أن الجزء الفارغ من النجوم يكون على اليسار */
.custom-rating {
  direction: rtl; /* اجعل الاتجاه من اليسار إلى اليمين */
}

/* تخصيص النصف نجمة */
.custom-rating .v-rating__icon--half {
  background: none; /* إزالة الخلفية الافتراضية للنصف نجمة */
}

/* تخصيص الأيقونات */
.custom-rating .v-rating__icon {
  position: relative;
  direction: ltr;
}

.custom-rating .v-rating__icon--half::before {
  content: ''; /* إضافة عنصر وهمي */
  position: absolute;
  left: 0; /* جعل الجزء الفارغ على اليسار */
  width: 50%; /* عرض النصف */
  height: 100%;
  background-color: grey; /* لون الجزء الفارغ */
  z-index: 0; /* وضعه تحت النجمة */
}


</style>
