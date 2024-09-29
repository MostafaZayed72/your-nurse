<template>
    <div class="card relative">
        <!-- Spinner يظهر أثناء تحميل البيانات -->
        <div v-if="loading" class="fixed inset-0 flex items-center justify-center z-10">
            <ProgressSpinner />
        </div>

        <!-- DataTable -->
        <DataTable 
            v-model:filters="filters" 
            :value="nurses" 
            paginator 
            :rows="10" 
            dataKey="id" 
            filterDisplay="row" 
            :loading="loading"
            :globalFilterFields="['name', 'region', 'mobile']" 
            v-if="!loading" 
            class="pa-4"
        >
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
            <template #empty> لا توجد بيانات للممرضين. </template>
            <template #loading> جارٍ تحميل بيانات الممرضين. يرجى الانتظار. </template>
            
            <!-- عمود الممرض -->
            <Column class="text-start" header="الممرض" filterField="name" :showFilterMenu="false" style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2 cursor-pointer hover:text-cyan-400 delayed" @click="goToNurse(data.id)">
                        <img :alt="data.name" :src="data.image" class="w-24 h-24" style="border-radius: 50%;" />
                        <span>{{ data.name }}</span>
                    </div>
                </template>
            </Column>
             
            <!-- عمود المنطقة -->
            <Column class="text-start" header="المنطقة" filterField="region" style="min-width: 12rem">
                <template #body="{ data }">
                    <span>{{ data.region }}</span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="بحث بالمنطقة" />
                </template>
            </Column>

            <!-- عمود رقم الموبايل -->
            <Column class="text-start" header="رقم الموبايل" filterField="mobile" style="min-width: 12rem">
                <template #body="{ data }">
                    <span>{{ data.mobile }}</span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="بحث برقم الموبايل" />
                </template>
            </Column>

            <!-- عمود البريد الإلكتروني -->
            <Column class="text-start" header="البريد الإلكتروني" filterField="email" style="min-width: 12rem">
                <template #body="{ data }">
                    <span>{{ data.email }}</span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="بحث بالبريد الإلكتروني" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProgressSpinner from 'primevue/progressspinner';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import { useRouter } from 'vue-router';

const nurses = ref([]);
const filters = ref({
    global: { value: null },
    name: { value: null },
    region: { value: null },
    mobile: { value: null },
    email: { value: null }
});
const loading = ref(true);
const router = useRouter();

// دالة لجلب بيانات الممرضين
const fetchNurses = async () => {
    try {
        const response = await fetch('/api/nurses');
        if (response.ok) {
            nurses.value = await response.json();
        } else {
            console.error('Error fetching nurses:', response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        loading.value = false;
    }
};

// دالة للتوجيه إلى صفحة تفاصيل الممرض
const goToNurse = (id) => {
    router.push(`/yourNurse/${id}`);
};

// جلب البيانات عند تحميل المكون
onMounted(() => {
    fetchNurses();
});
</script>

<style scoped>
.card {
    max-width: 800px;
    margin: auto;
}
</style>
