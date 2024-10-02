<template>
    <div class="card p-4">
        <!-- Progress Spinner -->
        <div v-if="loading" class="progress-spinner-overlay mx-auto flex justify-center w-full h-screen">
            <ProgressSpinner class="my-auto" />
        </div>

        <DataTable v-else v-model:filters="filters" :value="customers" paginator showGridlines :rows="10" dataKey="id"
            filterDisplay="menu"
            :globalFilterFields="['name', 'country.name', 'representative.name', 'contact.phone', 'contact.whatsapp']">
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
            <template #empty> لم يتم العثور على عملاء. </template>
            <template #loading> جاري تحميل بيانات العملاء. الرجاء الانتظار. </template>

            <!-- Column for nurses -->
            <Column class="text-start" header="الممرض" filterField="representative.name" :showFilterMatchModes="false"
                :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <RouterLink :to="`/yourNurse/${data.representative.id}`">
                            <img class="w-20 h-20" :alt="data.representative.name" :src="`${data.representative.image}`"
                                style="border-radius: 50%;" />
                        </RouterLink>
                        <RouterLink :to="`/yourNurse/${data.representative.id}`">
                            <span>{{ data.representative.name }}</span>
                        </RouterLink>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="البحث بالممرض" />
                </template>
            </Column>

            <!-- Column for Country -->
            <Column class="text-start" header="المنطقة" filterField="country.name" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <img alt="flag" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                            :class="`flag flag-${data.country.code}`" style="width: 24px" />
                        <span>{{ data.country.name }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="البحث بالدولة" />
                </template>
                <template #filterclear="{ filterCallback }">
                    <Button type="button" icon="pi pi-times" @click="filterCallback()" severity="secondary"></Button>
                </template>
                <template #filterapply="{ filterCallback }">
                    <Button type="button" icon="pi pi-check" @click="filterCallback()" severity="success"></Button>
                </template>
            </Column>

            <!-- Column for Contact Numbers -->
            <Column class="text-start" header="أرقام التواصل" style="min-width: 15rem">
                <template #body="{ data }">
                    <div>
                        <div>موبايل: {{ data.contact.phone }}</div>
                        <div>واتساب: {{ data.contact.whatsapp }}</div>
                    </div>
                </template>
               
            </Column>

            <!-- Column for Rating -->
            <Column class="text-start" header="التقييم" style="min-width: 10rem">
                <template #body="{ data }">
                    <div>
                        <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= data.rating }">★</span>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import ProgressSpinner from 'primevue/progressspinner'; // Import ProgressSpinner
import { RouterLink } from 'vue-router'; // Import RouterLink

const customers = ref([]);
const filters = ref();
const representatives = ref([{ name: 'محمد المصري', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9aruNtZuWgkMb4UJaYPlsQjbkVpaIEMfFnA&s' },
{ name: 'أحمد علي', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX0LBfFIE5QMv3b5kFWQF4oMRN1o7yivlpKvtre3RcNpXaoCCT2mi067oKRtcu6KCp7UA&usqp=CAU' },
 { name: 'محمود حسان', image: 'https://img.youm7.com/ArticleImgs/2020/4/13/69680-200409141245-nurse-last-words-coronavirus-patient.jpg' },
 { name: 'خالد الشناوي', image: 'https://www.deutschland.de/sites/default/files/styles/image_carousel_mobile/public/media/image/male-nurse-steffen-roesel-hospital-job-Everyday-life-in-Germany-station.jpg?itok=IEQEA4y2' }, 
{ name: 'هشام عبد الله', image: 'https://hymc.org.il/_uploads/extraimg/babet(1).jpg' },
 { name: 'سارة عمر', image: 'https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-friendly-hijab-nurse-flat-png-image_11952365.png' }, 
 { name: 'نورا المصري', image: 'https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-friendly-hijab-nurse-flat-png-image_11952364.png' }, 
 { name: 'ياسر النجار', image: 'https://png.pngtree.com/background/20230919/original/pngtree-attractive-male-nurse-surgical-nurse-man-photo-picture-image_5142061.jpg' },
  { name: 'إسلام سامي', image: 'https://img.freepik.com/premium-photo/male-nurse-isolated-white_53419-2889.jpg' },
  { name: 'آية حسين', image: 'https://png.pngtree.com/png-clipart/20221231/original/pngtree-illustration-of-a-smiling-muslimah-doctor-with-a-stethoscope-png-image_8836825.png' }]);
const loading = ref(true); // Add loading state

onMounted(() => {
    setTimeout(() => {
        customers.value = getCustomers();
        loading.value = false; // Hide spinner when data is loaded
    }, 2000); // Simulate 2 seconds delay
});

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'representative.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }, // Search by nurse name
        contact: { value: null, matchMode: FilterMatchMode.CONTAINS },
        rating: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    };
};

initFilters();

const clearFilter = () => {
    initFilters();
};

const getCustomers = () => {
    return [
        { id: 1, name: 'محمد المصري', country: { name: 'الإبراهيمية', code: 'eg' }, representative: { name: 'محمد المصري', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9aruNtZuWgkMb4UJaYPlsQjbkVpaIEMfFnA&s' }, contact: { phone: '01234567890', whatsapp: '01123456789' }, rating: 5 },
        { id: 2, name: 'أحمد علي', country: { name: 'محرم بك', code: 'eg' }, representative: { name: 'أحمد علي', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX0LBfFIE5QMv3b5kFWQF4oMRN1o7yivlpKvtre3RcNpXaoCCT2mi067oKRtcu6KCp7UA&usqp=CAU' }, contact: { phone: '01234567891', whatsapp: '01123456790' }, rating: 4 },
        { id: 3, name: 'محمود حسان', country: { name: 'الحضرة', code: 'eg' }, representative: { name: 'محمود حسان', image: 'https://img.youm7.com/ArticleImgs/2020/4/13/69680-200409141245-nurse-last-words-coronavirus-patient.jpg' }, contact: { phone: '01234567892', whatsapp: '01123456791' }, rating: 3 },
        { id: 4, name: 'خالد الشناوي', country: { name: 'العوايد', code: 'eg' }, representative: { name: 'خالد الشناوي', image: 'https://www.deutschland.de/sites/default/files/styles/image_carousel_mobile/public/media/image/male-nurse-steffen-roesel-hospital-job-Everyday-life-in-Germany-station.jpg?itok=IEQEA4y2' }, contact: { phone: '01234567893', whatsapp: '01123456792' }, rating: 2 },
        { id: 5, name: 'هشام عبد الله', country: { name: 'البيطاش', code: 'eg' }, representative: { name: 'هشام عبد الله', image: 'https://hymc.org.il/_uploads/extraimg/babet(1).jpg' }, contact: { phone: '01234567894', whatsapp: '01123456793' }, rating: 1 },
        { id: 6, name: 'سارة عمر', country: { name: 'الكيلو 21', code: 'eg' }, representative: { name: 'سارة عمر', image: 'https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-friendly-hijab-nurse-flat-png-image_11952365.png' }, contact: { phone: '01234567895', whatsapp: '01123456794' }, rating: 5 },
        { id: 7, name: 'نورا المصري', country: { name: 'المندرة', code: 'eg' }, representative: { name: 'نورا المصري', image: 'https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-friendly-hijab-nurse-flat-png-image_11952364.png' }, contact: { phone: '01234567896', whatsapp: '01123456795' }, rating: 4 },
        { id: 8, name: 'ياسر النجار', country: { name: 'سيدي بشر', code: 'eg' }, representative: { name: 'ياسر النجار', image: 'https://png.pngtree.com/background/20230919/original/pngtree-attractive-male-nurse-surgical-nurse-man-photo-picture-image_5142061.jpg' }, contact: { phone: '01234567897', whatsapp: '01123456796' }, rating: 3 },
        { id: 9, name: 'إسلام سامي', country: { name: 'العصافرة', code: 'eg' }, representative: { name: 'إسلام سامي', image: 'https://img.freepik.com/premium-photo/male-nurse-isolated-white_53419-2889.jpg' }, contact: { phone: '01234567898', whatsapp: '01123456797' }, rating: 2 },
        { id: 10, name: 'آية حسين', country: { name: 'كرموز', code: 'eg' }, representative: { name: 'آية حسين', image: 'https://png.pngtree.com/png-clipart/20221231/original/pngtree-illustration-of-a-smiling-muslimah-doctor-with-a-stethoscope-png-image_8836825.png' }, contact: { phone: '01234567899', whatsapp: '01123456798' }, rating: 1 },
    ];
};
</script>

<style scoped>
/* Add styles for your components here */
.star {
    font-size: 20px;
    color: #61615e; /* Gold color for filled stars */
}
.star.filled {
    
@apply text-cyan-500
}
</style>
