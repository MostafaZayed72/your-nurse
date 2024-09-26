<template>
    <div class="card relative ">
        <!-- Spinner يظهر أثناء تحميل البيانات -->
        <div v-if="loading" class="fixed inset-0 flex items-center justify-center z-10">
            <ProgressSpinner />
        </div>

        <!-- DataTable -->
        <DataTable v-model:filters="filters" :value="customers" paginator :rows="10" dataKey="id" filterDisplay="row" :loading="loading"
                :globalFilterFields="['name', 'country.name', 'representative.name', 'status']" v-if="!loading" class="pa-4">
            <template #header>
                <div class="flex justify-center">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="بحث بالكلمات المفتاحية" />
                    </IconField>
                </div>
            </template>
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            
            <!-- عمود الاسم -->
            <!-- <Column class="text-start" field="name" header="الإسم" style="min-width: 12rem">
                <template #body="{ data }">
                    <span class="cursor-pointer hover:text-cyan-400 delayed" @click="goToNurse(data.representative.id)">
                        {{ data.name }}
                    </span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="بحث بالإسم" />
                </template>
            </Column> -->
            
           
             <!-- عمود المنطقة -->
             <Column class="text-start w-fit" header="المنطقة" filterField="country.name" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <img alt="flag" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${data.country.code}`" style="width: 24px" />
                        <span>{{ data.country.name }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText class="region"  v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="بحث بالمنطقة" />
                </template>
            </Column>
            <!-- عمود الممرض -->
            <Column class="text-start" header="الممرض" filterField="representative" :showFilterMenu="false" style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2 cursor-pointer hover:text-cyan-400 delayed" @click="goToNurse(data.representative.id)">
                        <img :alt="data.representative.name" :src="`${data.representative.image}`" class="w-24 h-24 " style="border-radius: 50%;"  />
                        <span >{{ data.representative.name }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="representatives" optionLabel="name" placeholder="الكل" style="min-width: 14rem" :maxSelectedLabels="1">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <img :alt="slotProps.option.name" :src="`${slotProps.option.image}`" style="width: 32px" />
                                <span>{{ slotProps.option.name }}</span>
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column>
            
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';  // استيراد useRouter لتغيير المسار
import { FilterMatchMode } from '@primevue/core/api';
import ProgressSpinner from 'primevue/progressspinner';  // تأكد من استيراد الـ Spinner بشكل صحيح

const customers = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS }
});
const representatives = ref([
    { id: 1, name: 'عمرو ناصر', image: 'https://png.pngtree.com/background/20231022/original/pngtree-smiling-and-young-businessman-self-assured-confidence-white-background-photo-picture-image_5683113.jpg' },
    { id: 2, name: 'فادي محمد', image: 'https://png.pngtree.com/png-vector/20240108/ourlarge/pngtree-portrait-of-handsome-young-man-in-white-shirt-isolated-on-background-png-image_11428344.png' },
    { id: 3, name: 'فؤاد نور', image: 'https://png.pngtree.com/thumb_back/fw800/background/20230521/pngtree-handsome-businessman-in-beige-studio-suit-smiling-with-copyspace-for-business-portraits-photo-image_52150088.jpg' },
    { id: 4, name: 'محمود الغنام', image: 'https://png.pngtree.com/png-vector/20240411/ourlarge/pngtree-portrait-of-young-handsome-man-in-black-suit-on-grey-background-png-image_12278379.png' },
    { id: 5, name: 'إسماعيل السيد', image: 'https://png.pngtree.com/png-vector/20240110/ourlarge/pngtree-handsome-young-man-in-white-t-shirt-smiling-and-looking-at-png-image_11428855.png' },
    { id: 6, name: 'أحمد فوزي', image: 'https://png.pngtree.com/png-vector/20240110/ourlarge/pngtree-portrait-of-a-handsome-young-man-laughing-isolated-on-white-background-png-image_11428739.png' },
    { id: 7, name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { id: 8, name: 'Onyama Limba', image: 'onyamalimba.png' },
    { id: 9, name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { id: 10, name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);
const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
const loading = ref(true);

// استيراد الـ router
const router = useRouter();

onMounted(() => {
    setTimeout(() => {
        customers.value = getMockCustomers();
        loading.value = false;
    }, 1000); // Simulate loading delay
});

const getMockCustomers = () => {
    return [
        { id: 1, name: 'عمرو ناصر', country: { name: 'محرم بك', code: 'us' }, representative: representatives.value[0], status: 'new', verified: true },
        { id: 2, name: 'فادي محمد', country: { name: 'الهانوفيل', code: 'de' }, representative: representatives.value[1], status: 'qualified', verified: false },
        { id: 3, name: 'فؤاد نور', country: { name: 'سيدي بشر', code: 'ca' }, representative: representatives.value[2], status: 'negotiation', verified: true },
        { id: 4, name: 'محمود الغنام', country: { name: 'البيطاش', code: 'es' }, representative: representatives.value[3], status: 'renewal', verified: false },
        { id: 5, name: 'إسماعيل السيد', country: { name: 'المنشية', code: 'fr' }, representative: representatives.value[4], status: 'proposal', verified: true },
    ];
};

// دالة للتوجيه إلى المسار المطلوب باستخدام ID
const goToNurse = (id) => {
    navigateTo(`/yourNurse/${id}`);
};
</script>

