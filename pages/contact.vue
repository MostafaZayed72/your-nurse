<template>
    <div class="card relative">
        <!-- Spinner يظهر أثناء تحميل البيانات -->
        <div v-if="loading" class="fixed inset-0 flex items-center justify-center z-10">
            <Loader />
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
            :globalFilterFields="['name', 'region', 'mobile', 'email']" 
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
                    <div class="flex items-center gap-2">
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
            </Column>

            <!-- عمود رقم الموبايل -->
            <Column class="text-start" header="رقم الموبايل" filterField="mobile" style="min-width: 12rem">
                <template #body="{ data }">
                    <span>{{ data.mobile }}</span>
                </template>
            </Column>

            <!-- عمود البريد الإلكتروني -->
            <Column class="text-start" header="البريد الإلكتروني" filterField="email" style="min-width: 12rem">
                <template #body="{ data }">
                    <span>{{ data.email }}</span>
                </template>
            </Column>

            <!-- عمود إجراءات -->
            <Column class="text-start" header="الإجراءات" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button icon="pi pi-pencil" @click="openEditDialog(data)" class="p-button-info" />
                        <Button icon="pi pi-trash" @click="confirmDeleteNurse(data.id)" class="p-button-danger" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- نافذة التأكيد للحذف -->
        <Dialog 
            header="تأكيد الحذف" 
            :visible="deleteDialog" 
            modal 
            @hide="deleteDialog = false" 
            :dismissableMask="true"
        >
            <p>هل أنت متأكد أنك تريد حذف هذا الممرض؟</p>
            <template #footer>
                <Button label="لا" icon="pi pi-times" @click="deleteDialog = false" />
                <Button label="نعم" icon="pi pi-check" @click="deleteNurse" />
            </template>
        </Dialog>

        <!-- نافذة تعديل بيانات الممرض -->
        <Dialog 
            header="تعديل بيانات الممرض" 
            :visible="editDialog" 
            modal 
            @hide="editDialog = false" 
            :dismissableMask="true"
        >
            <div class="field">
                <label for="name">الإسم</label>
                <InputText id="name" v-model="selectedNurse.name" />
            </div>
            <div class="field">
                <label for="region">المنطقة</label>
                <InputText id="region" v-model="selectedNurse.region" />
            </div>
            <div class="field">
                <label for="mobile">رقم الموبايل</label>
                <InputText id="mobile" v-model="selectedNurse.mobile" />
            </div>
            <div class="field">
                <label for="email">البريد الإلكتروني</label>
                <InputText id="email" v-model="selectedNurse.email" />
            </div>
            <template #footer>
                <Button label="إلغاء" icon="pi pi-times" @click="editDialog = false" />
                <Button label="حفظ" icon="pi pi-check" @click="updateNurse" />
            </template>
        </Dialog>

        <Toast ref="toast" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { useRouter } from 'vue-router';
import 'primeicons/primeicons.css';

const nurses = ref([]);
const filters = ref({
    global: { value: null },
    name: { value: null },
    region: { value: null },
    mobile: { value: null },
    email: { value: null }
});
const loading = ref(true);
const deleteDialog = ref(false);
const editDialog = ref(false);
const nurseToDelete = ref(null);
const selectedNurse = ref({});
const router = useRouter();
const toast = ref(null);

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

const confirmDeleteNurse = (id) => {
    nurseToDelete.value = id;
    deleteDialog.value = true;
};

// دالة لحذف الممرض
const deleteNurse = async () => {
    try {
        const response = await fetch(`/api/nurses/${nurseToDelete.value}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            // تحديث قائمة الممرضين بعد الحذف
            nurses.value = nurses.value.filter(nurse => nurse.id !== nurseToDelete.value);
            toast.value.add({ severity: 'success', summary: 'نجاح', detail: 'تم حذف الممرض بنجاح!' });
        } else {
            console.error('Error deleting nurse:', response.statusText);
            toast.value.add({ severity: 'error', summary: 'خطأ', detail: 'فشل حذف الممرض. حاول مرة أخرى.' });
        }
    } catch (error) {
        console.error('Delete error:', error);
        toast.value.add({ severity: 'error', summary: 'خطأ', detail: 'فشل حذف الممرض. حاول مرة أخرى.' });
    } finally {
        deleteDialog.value = false;
        nurseToDelete.value = null;
    }
};

// دالة تحديث بيانات الممرض
const updateNurse = async () => {
    try {
        const response = await fetch(`/api/nurses/${selectedNurse.value.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedNurse.value),
        });
        if (response.ok) {
            // تحديث قائمة الممرضين بعد التعديل
            const index = nurses.value.findIndex(nurse => nurse.id === selectedNurse.value.id);
            if (index !== -1) {
                nurses.value[index] = { ...selectedNurse.value };
            }
            toast.value.add({ severity: 'success', summary: 'نجاح', detail: 'تم تعديل بيانات الممرض بنجاح!' });
        } else {
            console.error('Error updating nurse:', response.statusText);
            toast.value.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تعديل بيانات الممرض. حاول مرة أخرى.' });
        }
    } catch (error) {
        console.error('Update error:', error);
        toast.value.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تعديل بيانات الممرض. حاول مرة أخرى.' });
    } finally {
        editDialog.value = false; // يجب أن يتم إغلاق الديالوج هنا
    }
};

const openEditDialog = (nurse) => {
    selectedNurse.value = { ...nurse };
    editDialog.value = true;
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
