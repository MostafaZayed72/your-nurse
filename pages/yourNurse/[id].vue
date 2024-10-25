<template>
  <div class="nurse-details p-4" v-if="nurse.user">
    <div>
      <div class="flex flex-col align-items-center gap-2 items-center justify-center">
        <img :src="nurse.personalImage" alt="صورة الممرض" class="rounded-full w-80 h-80" />
        <div>
          <h2 class="text-5xl font-bold text-gray-600 dark:text-gray-200">{{ nurse.user.firstName }} {{ nurse.user.lastName }}</h2>
        </div>
        <div class="flex flex-col md:flex-row items-center gap-4" style="direction: ltr;">
          <v-rating
            v-model="nurse.rating"
            halfIncrements
            :length="5"
            color="yellow"
            readonly
          />
        </div>
        <div class="flex flex-col md:flex-row mt-2 md:justify-between items-center gap-6">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <Icon name="ic:baseline-location-on" class="text-3xl cursor-pointer" />
              <h1 class="text-xl font-bold">{{ regions[0]?.arName }}، {{ regions[1]?.arName }}</h1>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="logos:whatsapp-icon" class="text-3xl cursor-pointer" />
              <h1 class="text-xl font-bold">{{ nurse.user.whatsAppNo }}</h1>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="material-symbols:phone-enabled" class="text-3xl cursor-pointer" color="blue" />
              <h1 class="text-xl font-bold">{{ nurse.user.mobileNo }}</h1>
            </div>
          </div>
        </div>
        <div class="my-6 w-[80%]" style="border-bottom: 1px solid #07b5d7;"></div>
      </div>
    </div>

    <!-- DataTable لعرض التفاصيل -->
    <DataTable :value="services" responsiveLayout="scroll" class="shadow-2 font-bold">
      <Column class="text-start" field="service" header="الخدمة" />
      <Column class="text-start" field="description" header="الوصف" />
      <Column class="text-start" field="price" header="السعر" />
    </DataTable>

    <h1 class="text-center text-3xl font-bold bg-cyan-500 rounded px-4 py-2 w-[30%] mx-auto my-6 cursor-pointer hover:bg-cyan-700 delayed text-white">
      احجز الآن
    </h1>
  </div>

  <!-- عرض رسالة التحميل أثناء الانتظار -->
  <div v-else class="text-center">
    <p>جاري تحميل البيانات...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Tag from 'primevue/tag';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import 'primeicons/primeicons.css';

// تعريف المتغيرات
const nurse = ref({});
const services = ref([
  { service: 'العناية المنزلية', description: 'تقديم رعاية طبية للمرضى في منازلهم.', price: '300 جنيه' },
  { service: 'متابعة الحالات المزمنة', description: 'متابعة وعلاج الحالات المزمنة مثل السكري وارتفاع ضغط الدم.', price: '400 جنيه' },
  { service: 'التأهيل الطبي', description: 'تأهيل المرضى بعد العمليات الجراحية أو الإصابات.', price: '500 جنيه' },
]);
const regions = ref([]);
const route = useRoute();

// جلب بيانات الممرض عند تحميل الصفحة
onMounted(async () => {
  try {
    const response = await axios.get(`https://development.somee.com/api/Nurses/GetNurseById?id=${route.params.id}`);
    nurse.value = response.data;
    regions.value = nurse.value.regions; // حفظ المناطق إذا كنت تحتاجها في العرض
  } catch (error) {
    console.error("Error fetching nurse data:", error);
  }
});
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
