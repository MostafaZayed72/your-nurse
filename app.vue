<template>
 <div style="direction: rtl;" >
    <NuxtLayout >
<NuxtPage />
</NuxtLayout>
 </div>

</template>

<style>
.delayed{
    transition: 0.3s ;
}
body {
   font-family: "Tajawal", sans-serif !important;
}

.v-data-table{
  color: black !important;
}
.dark .v-data-table {
    background-color: white;
    color: white; 
   }
   .p-datatable-header{
    background-color: #fcf9f9 !important;
  }
  .dark .p-datatable-header{
    background-color: #5c5858 !important;
  }
  /* تغيير لون خلفية الصفوف */
.p-datatable .p-datatable-tbody > tr:nth-child(odd) {
  background-color: #ddd4d4; /* لون خلفية الصفوف الفردية */
}
.dark .p-datatable .p-datatable-tbody > tr:nth-child(odd) {
  background-color: #5c5858; /* لون خلفية الصفوف الفردية */
  color: white;
}

.p-datatable .p-datatable-tbody > tr:nth-child(odd){
  color: black;
}
.p-datatable .p-datatable-tbody > tr:nth-child(even){
  color: black;
}

.p-iconfield .p-inputtext:not(:first-child){
  background-color: white;
}
.p-datatable .p-datatable-tbody > tr:nth-child(even) {
  background-color: #f8f5f5; /* لون خلفية الصفوف الزوجية */
}
.dark .p-datatable .p-datatable-tbody > tr:nth-child(even) {
  background-color: #3a3838; /* لون خلفية الصفوف الزوجية */
  color: white;
}

/* تغيير لون خلفية رأس الجدول */
.p-datatable .p-datatable-thead > tr > th {
  background-color: #07b6d6; /* لون خلفية رأس الجدول */
  color: #ffffff; /* لون النص في رأس الجدول */
  
}

/* تغيير لون الحدود */
.p-datatable .p-datatable-tbody > tr > td {
  border-color: #07b6d6; /* لون حدود الخلايا */
}
.p-multiselect-label:has(.p-chip){
display: flex !important;
flex-wrap: wrap !important;

}
.p-multiselect-label{
display: flex !important;
flex-wrap: wrap !important;
white-space:pre-wrap !important;
}
.p-paginator{
  background-color: #07b6d6 !important;
}
.p-paginator-prev{
  color: white !important;
  cursor: pointer !important;
}
.p-paginator-first{
  color: white !important;
  cursor: pointer !important;
}
.p-paginator-next{
  color: white !important;
  cursor: pointer !important;
}

.p-paginator-last{
  color: white !important;
  cursor: pointer !important;
}
.p-datatable-inline-filter{
  display: flex !important;
  gap: 2px !important;
  justify-content: start !important;
  align-items: start !important;
}
td {
    border-right: 1px solid #07b6d6 !important; /* إضافة خط عمودي */
}
.p-datatable-header-cell  {
    border-right: 1px solid #ddd !important; /* إضافة خط عمودي */
}


</style>