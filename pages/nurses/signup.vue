<template>
    <div class="p-4 md:p-10"
        style="background-image: url('https://img.freepik.com/free-photo/flat-lay-health-still-life-arrangement-with-copy-space_23-2148854064.jpg?w=826&t=st=1727887789~exp=1727888389~hmac=14c048d70f034fcbdd7e7db8f3a71ad0fe7b806a0a0c781b48312ec592e0a60f'); background-size: cover;">
        <div class="max-w-md p-6 bg-cyan-500 shadow-md rounded-lg">
            <h1 class="text-2xl font-bold mb-6 text-center">{{ $t('تسجيل ممرض جديد') }}</h1>
            <form @submit.prevent="registerNurse" class="space-y-4">
                <InputText v-model="firstName" :placeholder="$t('الاسم الأول')" required class="w-full" />
                <InputText v-model="lastName" :placeholder="$t('اللقب')" required class="w-full" />
                <Dropdown v-model="gender" :options="genders" option-label="label" :placeholder="$t('الجنس')" required
                    class="w-full" />
                <InputText v-model="mobileNo" style="direction: rtl;" :placeholder="$t('رقم الموبايل')" type="tel"
                    required class="w-full" />
                <InputText v-model="whatsAppNo" style="direction: rtl;" :placeholder="$t('رقم الواتساب (اختياري)')"
                    type="tel" class="w-full" />

                <Calendar v-model="birthday" :placeholder="$t('تاريخ الميلاد')" class="w-full" required />

                <InputText v-model="email" :placeholder="$t('البريد الإلكتروني')" type="email" required
                    class="w-full" />
                <InputText v-model="password" :placeholder="$t('كلمة المرور')" type="password" required
                    class="w-full" />
                <InputText v-model="confirmPassword" :placeholder="$t('تأكيد كلمة المرور')" type="password" required
                    class="w-full" />

                <label class="block">{{ $t('الصورة الشخصية') }}</label>
                <input type="file" @change="handleProfileImageChange" accept="image/*" class="w-full py-2" />
                <label class="block">{{ $t('صورة مزاولة المهنة') }}</label>
                <input type="file" @change="handleLicenseImageChange" accept="image/*" class="w-full py-2" />
                <Button :label="$t('تسجيل')" type="submit" class="w-full bg-blue-darken-4" :disabled="loading" />
            </form>

            <Toast class="pl-16 pl-md-0" style="direction: rtl" />

            <Loader v-if="loading" />



            <Dialog class="text-start" v-model:visible="isDialogVisible" header="نجاح التسجيل" modal>
                <p>تم التسجيل بنجاح! سيتم إرسال إيميل تأكيد إليك خلال 48 ساعة.</p>
                <Button label="موافق" @click="goToHome" />
            </Dialog>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

// إعداد المتغيرات
const router = useRouter()
const profileImage = ref(null)
const licenseImage = ref(null)
const loading = ref(false)
const isDialogVisible = ref(false) // متغير للتحكم في ظهور الديالوج

// دالة لتحميل الصورة الشخصية
const handleProfileImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        profileImage.value = file
    }
}

// دالة لتحميل صورة مزاولة المهنة
const handleLicenseImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        licenseImage.value = file
    }
}

// إعداد التوست
const toast = useToast()

// الحقول المطلوبة
const firstName = ref('')
const lastName = ref('')
const gender = ref(null)
const mobileNo = ref('')
const whatsAppNo = ref('')
const birthday = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// قائمة الجنس
const genders = [
    { label: 'ذكر', value: 1 },
    { label: 'أنثى', value: 2 }
]

// رفع الصورة إلى Cloudinary
const uploadImageToCloudinary = async (file) => {
    const url = 'https://api.cloudinary.com/v1_1/dzswjhtds/image/upload'
    const formData = new FormData()

    formData.append('file', file)
    formData.append('upload_preset', 'my_upload_preset')

    try {
        const response = await axios.post(url, formData)
        return response.data.secure_url
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error)
        return null
    }
}

// دالة لتسجيل الممرض
const registerNurse = async () => {
    if (!profileImage.value || !licenseImage.value) {
        toast.add({ severity: 'warn', summary: 'تحذير', detail: 'يرجى رفع صورة شخصية وصورة مزاولة المهنة' })
        return
    }

    if (password.value !== confirmPassword.value) {
        toast.add({ severity: 'error', summary: 'خطأ', detail: 'كلمة المرور وتأكيد كلمة المرور غير متطابقتين' })
        return
    }

    loading.value = true // تفعيل حالة التحميل

    const profileImageUrl = await uploadImageToCloudinary(profileImage.value)
    const licenseImageUrl = await uploadImageToCloudinary(licenseImage.value)

    if (!profileImageUrl || !licenseImageUrl) {
        toast.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء رفع الصور' })
        loading.value = false
        return
    }

    // إعداد بيانات الممرض
    const nurseData = {
        firstName: firstName.value,
        lastName: lastName.value,
        gender: gender.value.value,
        mobileNo: mobileNo.value,
        whatsAppNo: whatsAppNo.value || null,
        birthday: birthday.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value
    }

    // إرسال البيانات إلى الـ API لتسجيل المستخدم
    try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/Users/register`, nurseData)

        const nurseAdditionalData = {
            email: nurseData.email,
            personalImage: profileImageUrl,
            professionImage: licenseImageUrl
        }

        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/Nurses/AddNurse`, nurseAdditionalData)

        toast.add({ severity: 'success', summary: 'نجاح', detail: 'تم تسجيل الممرض بنجاح!' })
        isDialogVisible.value = true // إظهار الديالوج
        resetForm()

    } catch (error) {
        toast.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء التسجيل' })
        console.error(error)
    } finally {
        loading.value = false // إلغاء حالة التحميل
    }
}

// دالة للتحويل إلى الصفحة الرئيسية
const goToHome = () => {
    isDialogVisible.value = false // إخفاء الديالوج
    router.push('/') // الانتقال إلى الصفحة الرئيسية
}

// إعادة تعيين الحقول
const resetForm = () => {
    firstName.value = ''
    lastName.value = ''
    gender.value = null
    mobileNo.value = ''
    whatsAppNo.value = ''
    birthday.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    profileImage.value = null
    licenseImage.value = null
}
</script>

<style>
input {
    color: black !important;
}

.spinner-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.logo-spinner {

    animation: spin 1s linear infinite;
    /* إضافة حركة دوران */
}

.p-select-option {
    justify-content: center !important;
}


@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
