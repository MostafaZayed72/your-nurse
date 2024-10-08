<template>
    <div class="top-nurses-container p-4" style="direction: rtl;">
        <h2 class="text-2xl font-bold mb-4">أعلى الممرضين تقييماً</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="nurse in topNurses" :key="nurse.id" class="nurse-card p-4  bg-cyan-darken-1 shadow-md rounded-md">
                <div class="flex items-center gap-4">
                    <img :src="nurse.representative.image" :alt="nurse.representative.name" class="w-16 h-16 rounded-full" />
                    <div>
                        <h3 class="text-xl font-semibold">{{ nurse.representative.name }}</h3>
                        <p>التقييم: 
                            <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= nurse.rating }">★</span>
                        </p>
                        <p>المنطقة: {{ nurse.country.name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const customers = ref([
    { id: 1, name: 'محمد المصري', country: { name: 'الإبراهيمية', code: 'eg' }, representative: { name: 'محمد المصري', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9aruNtZuWgkMb4UJaYPlsQjbkVpaIEMfFnA&s' }, contact: { phone: '01234567890', whatsapp: '01123456789' }, rating: 5 },
    { id: 2, name: 'أحمد علي', country: { name: 'محرم بك', code: 'eg' }, representative: { name: 'أحمد علي', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX0LBfFIE5QMv3b5kFWQF4oMRN1o7yivlpKvtre3RcNpXaoCCT2mi067oKRtcu6KCp7UA&usqp=CAU' }, contact: { phone: '01234567891', whatsapp: '01123456790' }, rating: 4 },
    { id: 3, name: 'محمود حسان', country: { name: 'الحضرة', code: 'eg' }, representative: { name: 'محمود حسان', image: 'https://img.youm7.com/ArticleImgs/2020/4/13/69680-200409141245-nurse-last-words-coronavirus-patient.jpg' }, contact: { phone: '01234567892', whatsapp: '01123456791' }, rating: 3 },
    { id: 4, name: 'خالد الشناوي', country: { name: 'العوايد', code: 'eg' }, representative: { name: 'خالد الشناوي', image: 'https://www.deutschland.de/sites/default/files/styles/image_carousel_mobile/public/media/image/male-nurse-steffen-roesel-hospital-job-Everyday-life-in-Germany-station.jpg?itok=IEQEA4y2' }, contact: { phone: '01234567893', whatsapp: '01123456792' }, rating: 2 },
    { id: 5, name: 'هشام عبد الله', country: { name: 'البيطاش', code: 'eg' }, representative: { name: 'هشام عبد الله', image: 'https://hymc.org.il/_uploads/extraimg/babet(1).jpg' }, contact: { phone: '01234567894', whatsapp: '01123456793' }, rating: 1 },
    { id: 6, name: 'سارة عمر', country: { name: 'الكيلو 21', code: 'eg' }, representative: { name: 'سارة عمر', image: 'https://images.akhbarelyom.com//images/images/medium/20190909143445305.jpg' }, contact: { phone: '01234567895', whatsapp: '01123456794' }, rating: 5 },
]);

// حساب الممرضين الأعلى تقييمًا (مثلاً عرض أعلى 3)
const topNurses = computed(() => {
    return customers.value
        .sort((a, b) => b.rating - a.rating) // ترتيب الممرضين حسب التقييم
        .slice(0, 3); // اختيار أعلى 3 ممرضين
});
</script>

<style scoped>

/* .dark .nurse-card{
    background-color: rgb(80, 88, 88);
} */
.star {
    font-size: 16px;
}

.star.filled {
    color: gold;
}

.nurse-card {
    transition: transform 0.3s;
}

.nurse-card:hover {
    transform: scale(1.05);
}
</style>
