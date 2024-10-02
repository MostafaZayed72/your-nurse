<template>
  <div class="max-w-6xl mx-auto mt-10">
    <h1 class="text-2xl font-bold mb-4">تسجيل ممرض جديد</h1>
    <form @submit.prevent="registerNurse" class="space-y-4">
      <InputText v-model="nurse.name" placeholder="الاسم" required />
      <InputText v-model="nurse.email" type="email" placeholder="البريد الإلكتروني" required />
      <InputText v-model="nurse.phone" placeholder="رقم الهاتف" required />
      <input type="file" @change="handleFileChange" accept="image/*" />
      <Button label="تسجيل" type="submit" />
    </form>
    <div v-if="message" class="mt-4">{{ message }}</div>

    <h2 class="text-xl font-bold mt-8">قائمة الممرضين</h2>
    <DataTable :value="nurses" class="mt-4">
      <Column field="name" header="الاسم" />
      <Column field="email" header="البريد الإلكتروني" />
      <Column field="phone" header="رقم الهاتف" />
      <Column field="profile_picture" header="الصورة">
        <template #body="slotProps">
          <img :src="slotProps.data.profile_picture" alt="Profile Picture" class="w-16 h-16 rounded-full" />
        </template>
      </Column>
      <Column header="إجراءات">
        <template #body="slotProps">
          <Button label="تعديل" @click="openEditDialog(slotProps.data)" />
          <Button label="حذف" @click="deleteNurse(slotProps.data.id)" class="ml-2" />
        </template>
      </Column>
    </DataTable>

    <!-- Dialog لتعديل الممرض -->
    <Dialog header="تعديل بيانات الممرض" v-model:visible="isEditDialogVisible">
      <InputText v-model="editedNurse.name" placeholder="الاسم" required />
      <InputText v-model="editedNurse.email" type="email" placeholder="البريد الإلكتروني" required />
      <InputText v-model="editedNurse.phone" placeholder="رقم الهاتف" required />
      <input type="file" @change="handleEditFileChange" accept="image/*" />
      <Button label="تحديث" @click="updateNurse" />
      <Button label="إغلاق" @click="isEditDialogVisible = false" class="ml-2" />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import axios from 'axios'

const supabase = useSupabaseClient()
const nurse = ref({ name: '', email: '', phone: '', profile_picture: '' })
const message = ref('')
const nurses = ref([]) // لاحتواء قائمة الممرضين
const isEditDialogVisible = ref(false) // لتحديد حالة عرض Dialog التعديل
const editedNurse = ref({ id: null, name: '', email: '', phone: '', profile_picture: '' }) // لحفظ بيانات الممرض الذي سيتم تعديله
let selectedFile = null
let selectedEditFile = null // لاحتواء الملف الذي سيتم تحميله في الـ Dialog

const handleFileChange = (event) => {
  selectedFile = event.target.files[0]
  console.log('Selected file:', selectedFile)
}

const handleEditFileChange = (event) => {
  selectedEditFile = event.target.files[0] // تخزين الملف المحدد
  console.log('Selected edit file:', selectedEditFile)
}

const uploadImageToCloudinary = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/dzswjhtds/image/upload`
  const formData = new FormData()
  
  formData.append('file', file)
  formData.append('upload_preset', 'my_upload_preset')

  try {
    const response = await axios.post(url, formData)
    console.log('Image uploaded to Cloudinary:', response.data)
    return response.data.secure_url // هذا هو الرابط المباشر للصورة
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error)
    return null
  }
}

const registerNurse = async () => {
  const imagePath = selectedFile ? await uploadImageToCloudinary(selectedFile) : null

  const nurseData = { 
    ...nurse.value, 
    ...(imagePath && { profile_picture: imagePath }) // إضافة الرابط للصورة
  }

  const { data, error } = await supabase.from('nurses').insert([nurseData])

  if (error) {
    console.error('Error inserting nurse:', error)
    message.value = `خطأ: ${error.message}`
  } else {
    message.value = 'تم تسجيل الممرض بنجاح!'
    nurse.value = { name: '', email: '', phone: '', profile_picture: '' }
    selectedFile = null
    fetchNurses() // جلب الممرضين بعد التسجيل
  }
}

// دالة لجلب بيانات الممرضين
const fetchNurses = async () => {
  const { data, error } = await supabase.from('nurses').select('*')
  if (error) {
    console.error('Error fetching nurses:', error)
  } else {
    nurses.value = data
  }
}

// دالة لفتح Dialog التعديل
const openEditDialog = (nurseData) => {
  editedNurse.value = { ...nurseData } // نسخ بيانات الممرض إلى المتغير
  isEditDialogVisible.value = true // فتح الـ Dialog
}

// دالة لتحديث الممرض
const updateNurse = async () => {
  // إذا تم تحديد صورة جديدة، رفعها إلى Cloudinary
  const imagePath = selectedEditFile ? await uploadImageToCloudinary(selectedEditFile) : null;

  const { data, error } = await supabase.from('nurses').update({
    name: editedNurse.value.name,
    email: editedNurse.value.email,
    phone: editedNurse.value.phone,
    ...(imagePath && { profile_picture: imagePath }) // تحديث الصورة إذا كانت موجودة
  }).eq('id', editedNurse.value.id)

  if (error) {
    console.error('Error updating nurse:', error)
    message.value = `خطأ: ${error.message}`
  } else {
    message.value = 'تم تحديث بيانات الممرض بنجاح!'
    isEditDialogVisible.value = false // إغلاق الـ Dialog
    fetchNurses() // جلب الممرضين بعد التحديث
    selectedEditFile = null; // إعادة تعيين الملف
  }
}

// دالة لحذف الممرض
const deleteNurse = async (id) => {
  const { data, error } = await supabase.from('nurses').delete().eq('id', id)
  if (error) {
    console.error('Error deleting nurse:', error)
    message.value = `خطأ: ${error.message}`
  } else {
    message.value = 'تم حذف الممرض بنجاح!'
    fetchNurses() // جلب الممرضين بعد الحذف
  }
}

// جلب الممرضين عند تحميل الصفحة
onMounted(fetchNurses)
</script>

<style scoped>
/* يمكنك إضافة أنماط إضافية هنا إذا لزم الأمر */
</style>
