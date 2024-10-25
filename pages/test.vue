<template>
    <div class="p-4 md:p-10">
        <h1 class="text-2xl font-bold mb-6 text-center">{{$t('عرض المناطق')}}</h1>
        
        <div class="mb-4">
            <h2 class="text-xl font-semibold">{{$t('إضافة منطقة جديدة')}}</h2>
            <form @submit.prevent="addRegion" class="space-y-4">
                <InputText v-model="newRegion.enName" :placeholder="$t('الاسم بالإنجليزية')" required class="w-full" />
                <InputText v-model="newRegion.arName" :placeholder="$t('الاسم بالعربية')" required class="w-full" />
                <Button :label="$t('إضافة منطقة')" type="submit" class="w-full bg-blue-darken-4" />
            </form>
        </div>

        <h2 class="text-xl font-semibold">{{$t('المناطق المتاحة')}}</h2>
        <ul>
            <li v-for="region in regions" :key="region.id">
                {{ region.enName }} ({{ region.arName }})
            </li>
        </ul>

        <Toast class="pl-16 pl-md-0" style="direction: rtl" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// حالة المناطق
const regions = ref([])

// حالة المنطقة الجديدة
const newRegion = ref({
    enName: '',
    arName: ''
})

// دالة لتحميل المناطق
const fetchRegions = async () => {
    try {
        const response = await axios.get('https://development.somee.com/api/Regions/GetAllRegions')
        regions.value = response.data
    } catch (error) {
        toast.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء تحميل المناطق' })
        console.error(error)
    }
}

// دالة لإضافة منطقة جديدة
const addRegion = async () => {
    try {
        await axios.post('https://development.somee.com/api/Regions/AddRegion', newRegion.value)
        toast.add({ severity: 'success', summary: 'نجاح', detail: 'تم إضافة المنطقة بنجاح!' })
        newRegion.value = { enName: '', arName: '' } // إعادة تعيين القيم
        fetchRegions() // إعادة تحميل المناطق
    } catch (error) {
        toast.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء إضافة المنطقة' })
        console.error(error)
    }
}

// تحميل المناطق عند تحميل المكون
onMounted(fetchRegions)
</script>

<style>
/* أضف أي تنسيقات مخصصة هنا */
</style>
