<template>
    <div class="card p-4">
        <!-- Progress Spinner -->
        <div v-if="loading" class="progress-spinner-overlay mx-auto flex justify-center w-full h-screen">
            <Loader class="my-auto" />
        </div>

        <DataTable v-else v-model:filters="filters" :value="customers" paginator showGridlines :rows="10"
            dataKey="nurseId" filterDisplay="menu"
            :globalFilterFields="['user.firstName', 'user.lastName', 'regionsString', 'user.mobileNo', 'user.whatsAppNo']">
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="بحث بالكلمة المفتاحية" />
                    </IconField>
                </div>
            </template>
            <template #empty> لم يتم العثور على ممرضين. </template>
            <template #loading> جاري تحميل بيانات الممرضين. الرجاء الانتظار. </template>

            <!-- Column for Nurse -->
            <Column class="text-center Column" header="الممرض" filterField="user.firstName"
    :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
    <template #body="{ data }">
        <div class="flex flex-col items-center gap-2 justify-center">
            <RouterLink :to="`/yourNurse/${data.nurseId}`">
                <img class="w-20 h-20" :alt="data.user.firstName" :src="`${data.personalImage}`"
                    style="border-radius: 50%;" />
            </RouterLink>
            <RouterLink :to="`/yourNurse/${data.nurseId}`">
                <span>{{ data.user.firstName }} {{ data.user.lastName }}</span>
            </RouterLink>
        </div>
    </template>
    <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" placeholder="البحث بالممرض" />
    </template>
</Column>


            <!-- Column for Regions -->
            <Column class="text-center Column" header="المنطقة" filterField="regionsString" style="min-width: 12rem">
                <template #body="{ data }">
                    <div v-if="data.regions && data.regions.length">
                        <span v-for="region in data.regions" :key="region.id" class="region-item">
                            {{ region.arName }}
                        </span>
                    </div>
                    <div v-else>غير محدد</div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="البحث بالمنطقة" />
                </template>
            </Column>

            <!-- Column for Contact Numbers -->
            <Column class="text-center" header="أرقام التواصل" style="min-width: 15rem">
                <template #body="{ data }">
                    <div>
                        <div>موبايل: {{ data.user.mobileNo }}</div>
                        <div>واتساب: {{ data.user.whatsAppNo }}</div>
                    </div>
                </template>
            </Column>

            <!-- Column for Rating -->
            <Column class="text-center" header="التقييم" style="min-width: 10rem">
                <template #body="{ data }">
                    <div>
                        <v-rating style="direction: ltr;" v-model="data.rating" half-increments :length="5" color="yellow"
                            readonly class="custom-rating" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import DataTable from 'primevue/datatable';

const customers = ref([]);
const filters = ref();
const loading = ref(true);

const apiUrl = 'https://development.somee.com/api/Nurses/GetAllNursesData?pageNumber=1&pageSize=10';

onMounted(async () => {
    try {
        const response = await axios.get(apiUrl);
        // تحويل بيانات المناطق إلى سلسلة نصية لكل ممرض
        customers.value = response.data.data.map(nurse => ({
            ...nurse,
            regionsString: nurse.regions ? nurse.regions.map(region => region.arName).join(' ') : '' // تحويل المناطق إلى سلسلة نصية
        }));
        initFilters(); // تأكد من استدعاء initFilters هنا
    } catch (error) {
        console.error("Error fetching customer data:", error);
    } finally {
        loading.value = false;
    }
});

// تهيئة الفلاتر
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'user.firstName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'regionsString': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }, // استخدم 'regionsString' للفلترة
        'user.mobileNo': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'user.whatsAppNo': { value: null, matchMode: FilterMatchMode.CONTAINS },
        rating: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    };
};

const clearFilter = () => {
    initFilters();
};
</script>

<style >
.dark .p-datatable-header {
    background-color: #5c5858 !important;
}

.custom-rating .v-rating__icon {
    font-size: 20px;
    position: relative;
    direction: ltr;
}

.custom-rating .v-rating__icon--half::before {
    content: '';
    position: absolute;
    right: 0;
    width: 50%;
    height: 100%;
    background-color: transparent;
    z-index: 0;
}

.custom-rating .v-rating__icon--half {
    color: grey;
}

.custom-rating .v-rating__icon--full {
    color: blue;
}

.region-item {
    display: block; /* يجعل كل منطقة تظهر في سطر منفصل */
}

.p-datatable-column-header-content {
    display: block !important;
    justify-content: center ;
    

}

</style>
