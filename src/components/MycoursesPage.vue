<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center mb-2">
            <h2 class="font-heading text-3xl font-semibold text-[#1C2B39]">My Courses</h2>
            <button @click="showAddFacultyModal = true"
                class="bg-[#C6862E] text-[#1C2B39] px-5 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-[#B37726] hover:text-white transition-colors font-medium">
                <i class="bi bi-plus-circle text-lg"></i>
                <span class="text-base">Add Faculty</span>
            </button>
        </div>

        <!-- Faculties List -->
        <div class="space-y-4">
            <div v-for="faculty in faculties" :key="faculty.id"
                class="bg-white rounded-xl border border-[#E4E0D8] overflow-hidden">
                
                <!-- Faculty Header -->
                <div @click="toggleFaculty(faculty.id)"
                    class="p-5 cursor-pointer hover:bg-[#F7F5F0] flex items-center justify-between transition-colors">
                    <div class="flex items-center space-x-3">
                        <i :class="['bi text-xl text-[#1C2B39]', expandedFaculty === faculty.id ? 'bi-chevron-down' : 'bi-chevron-right']"></i>
                        <h3 class="text-xl font-semibold text-[#1C2B39]">{{ faculty.name }}</h3>
                        <span class="bg-[#FBF3E4] text-[#C6862E] text-sm px-3 py-1 rounded-full font-medium">
                            {{ faculty.departments.length }} departments
                        </span>
                    </div>
                </div>

                <!-- Departments (Collapsible) -->
                <transition name="expand">
                    <div v-if="expandedFaculty === faculty.id" class="border-t border-[#E4E0D8]">
                       <div v-for="department in faculty.departments" :key="department.id"
                            class="border-b border-[#E4E0D8] last:border-b-0">
                            
                            <!-- Department Header -->
                            <div @click="toggleDepartment(faculty.id, department.id)"
                                class="p-5 pl-12 cursor-pointer hover:bg-[#F0EDE6] flex items-center justify-between bg-[#F7F5F0] transition-colors">
                                <div class="flex items-center space-x-3">
                                    <i :class="['bi text-lg text-[#2F6F5E]', expandedDepartment[faculty.id] === department.id ? 'bi-folder-open' : 'bi-folder']"></i>
                                    <h4 class="text-lg font-semibold text-[#1C2B39]">{{ department.name }}</h4>
                                    <span class="bg-[#E9F2EF] text-[#2F6F5E] text-xs px-2 py-1 rounded-full font-medium">
                                        {{ department.courses.length }} courses
                                    </span>
                                </div>
                                <button @click.stop="showAddCourseModal(faculty.id, department.id)"
                                    class="text-[#C6862E] hover:text-[#B37726] text-sm flex items-center space-x-1 font-medium">
                                    <i class="bi bi-plus-circle"></i>
                                    <span>Add Course</span>
                                </button>
                            </div>

                            <!-- Courses (Collapsible) -->
                            <transition name="expand">
                                <div v-if="expandedDepartment[faculty.id] === department.id" class="bg-white">
                                    <div v-for="course in department.courses" :key="course.id"
                                        class="p-5 pl-20 border-b border-[#E4E0D8] last:border-b-0 hover:bg-[#F7F5F0] transition-colors">
                                        
                                        <div class="flex items-start justify-between">
                                            <div class="flex-1">
                                                <h5 class="font-semibold text-[#1C2B39] text-base mb-2">{{ course.title }}</h5>
                                                <div class="space-y-1 text-sm text-[#5B6672]">
                                                    <p><i class="bi bi-person mr-2"></i>{{ course.lecturer }}</p>
                                                    <p><i class="bi bi-people mr-2"></i>{{ course.students }} students</p>
                                                    <p class="text-[#8B95A0]"><i class="bi bi-clock mr-2"></i>Updated {{ course.lastUpdate }}</p>
                                                </div>
                                            </div>
                                            <div class="flex space-x-2 ml-4">
                                                <button @click="downloadCourse(course)"
                                                    class="bg-[#1C2B39] text-white p-2 rounded-lg hover:bg-[#24384A] transition-colors"
                                                    title="Download Course">
                                                    <i class="bi bi-download text-lg"></i>
                                                </button>
                                                <button @click="viewCourse(course)"
                                                    class="bg-[#2F6F5E] text-white p-2 rounded-lg hover:bg-[#265A4C] transition-colors"
                                                    title="View Course">
                                                    <i class="bi bi-eye text-lg"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Empty State -->
                                    <div v-if="department.courses.length === 0"
                                        class="p-5 pl-20 text-center text-[#8B95A0]">
                                        <p>No courses yet. <button @click="showAddCourseModal(faculty.id, department.id)"
                                            class="text-[#C6862E] hover:underline font-medium">Add one now!</button></p>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>
                </transition>
            </div>
        </div>

        <!-- Success Message -->
        <transition name="fade">
            <div v-if="showSuccessMessage"
                class="fixed top-4 right-4 bg-[#2F6F5E] text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50">
                <i class="bi bi-check-circle text-xl"></i>
                <span>{{ successMessage }}</span>
            </div>
        </transition>

        <!-- Add Course Modal -->
        <div v-if="showCourseModal"
            class="fixed inset-0 bg-[#1C2B39]/60 flex items-center justify-center z-50 px-4">
            <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
                <h2 class="font-heading text-2xl font-semibold text-[#1C2B39] mb-6">Add New Course</h2>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-[#5B6672] mb-1">Course Title</label>
                        <input v-model="courseFormData.title" type="text" placeholder="Enter course title"
                            class="w-full border border-[#E4E0D8] rounded-lg px-4 py-2 outline-none focus:border-[#C6862E] transition-colors">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-[#5B6672] mb-1">Lecturer Name</label>
                        <input v-model="courseFormData.lecturer" type="text" placeholder="Enter lecturer name"
                            class="w-full border border-[#E4E0D8] rounded-lg px-4 py-2 outline-none focus:border-[#C6862E] transition-colors">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-[#5B6672] mb-1">Number of Students</label>
                        <input v-model.number="courseFormData.students" type="number" placeholder="0"
                            class="w-full border border-[#E4E0D8] rounded-lg px-4 py-2 outline-none focus:border-[#C6862E] transition-colors">
                    </div>
                </div>

                <div class="flex space-x-3 mt-8">
                    <button @click="closeCourseModal"
                        class="flex-1 px-4 py-2.5 border border-[#E4E0D8] text-[#1C2B39] rounded-lg hover:bg-[#F7F5F0] transition-colors font-medium">
                        Cancel
                    </button>
                    <button @click="saveCourse"
                        class="flex-1 px-4 py-2.5 bg-[#C6862E] text-[#1C2B39] rounded-lg hover:bg-[#B37726] hover:text-white transition-colors font-medium">
                        Add Course
                    </button>
                </div>
            </div>
        </div>

        <!-- Course View Modal with PDF Viewer -->
        <div v-if="viewCourseModal"
            class="fixed inset-0 bg-[#1C2B39]/60 flex items-center justify-center z-50 px-4">
            <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <!-- Header -->
                <div class="flex justify-between items-start p-6 border-b border-[#E4E0D8]">
                    <div>
                        <h2 class="font-heading text-2xl font-semibold text-[#1C2B39]">{{ selectedCourse.title }}</h2>
                        <p class="text-[#5B6672] mt-1">{{ selectedCourse.lecturer }}</p>
                    </div>
                    <button @click="viewCourseModal = false" class="text-[#8B95A0] hover:text-[#1C2B39] transition-colors">
                        <i class="bi bi-x text-2xl"></i>
                    </button>
                </div>

                <!-- PDF Viewer -->
                <div class="flex-1 overflow-auto bg-[#F7F5F0]">
                    <div v-if="selectedCourse.pdfUrl" class="w-full h-full">
                        <iframe :src="selectedCourse.pdfUrl" 
                            class="w-full h-full" 
                            type="application/pdf"
                            allow="fullscreen"></iframe>
                    </div>
                    <div v-else class="flex items-center justify-center h-96 text-[#8B95A0]">
                        <p>No PDF available for this course</p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="border-t border-[#E4E0D8] p-6 bg-white flex justify-between items-center">
                    <div class="space-y-1 text-sm text-[#5B6672]">
                        <p><strong class="text-[#1C2B39]">Students:</strong> {{ selectedCourse.students }}</p>
                        <p><strong class="text-[#1C2B39]">Last Updated:</strong> {{ selectedCourse.lastUpdate }}</p>
                    </div>
                    <div class="flex space-x-3">
                        <button @click="downloadCourse(selectedCourse)"
                            class="bg-[#1C2B39] text-white px-4 py-2.5 rounded-lg hover:bg-[#24384A] transition-colors flex items-center space-x-2 font-medium">
                            <i class="bi bi-download"></i>
                            <span>Download PDF</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, defineEmits, onMounted } from 'vue'
import { supabase } from '../supabase'

const emit = defineEmits(['course-added'])

defineProps({
    userRole: {
        type: String,
        required: true
    }
})

const expandedFaculty = ref(null)
const expandedDepartment = ref({})
const showAddFacultyModal = ref(false)
const showCourseModal = ref(false)
const viewCourseModal = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')
const selectedCoursefaculty = ref(null)
const selectedCourseDepartment = ref(null)
const selectedCourse = ref(null)

const courseFormData = ref({
    title: '',
    lecturer: '',
    students: 0
})

// Sample Data Structure
const faculties = ref([
    {
        id: 1,
        name: 'Faculty of Science',
        departments: [
            {
                id: 101,
                name: 'Computer Science',
                courses: [
                    {
                        id: 1001,
                        title: 'Web Development Fundamentals',
                        lecturer: 'Dr. Sarah Johnson',
                        students: 45,
                        lastUpdate: '2 days ago',
                        pdfUrl: null, // Will be loaded from Supabase
                        fileName: 'web-development.pdf'
                    },
                    {
                        id: 1002,
                        title: 'Data Structures & Algorithms',
                        lecturer: 'Prof. Michael Chen',
                        students: 38,
                        lastUpdate: '1 day ago',
                        pdfUrl: null, // Will be loaded from Supabase
                        fileName: 'data-structures.pdf'
                    }
                ]
            },
            {
                id: 102,
                name: 'Data Engineering',
                courses: [
                    {
                        id: 1003,
                        title: 'Big Data Processing',
                        lecturer: 'Dr. Emily Rodriguez',
                        students: 32,
                        lastUpdate: '3 days ago',
                        pdfUrl: null,
                        fileName: 'big-data.pdf'
                    },
                    {
                        id: 1004,
                        title: 'Database Design',
                        lecturer: 'Prof. David Kim',
                        students: 28,
                        lastUpdate: '1 week ago',
                        pdfUrl: null,
                        fileName: 'database.pdf'
                    }
                ]
            },
            {
                id: 103,
                name: 'Engineering',
                courses: [
                    {
                        id: 1005,
                        title: 'Software Engineering Principles',
                        lecturer: 'Dr. James Wilson',
                        students: 50,
                        lastUpdate: '4 days ago',
                        pdfUrl: null,
                        fileName: 'software-engineering.pdf'
                    }
                ]
            },
            {
                id: 104,
                name: 'Cybersecurity',
                courses: [
                    {
                        id: 1006,
                        title: 'Network Security Fundamentals',
                        lecturer: 'Prof. Lisa Anderson',
                        students: 35,
                        lastUpdate: '5 days ago',
                        pdfUrl: null,
                        fileName: 'network-security.pdf'
                    },
                    {
                        id: 1007,
                        title: 'Cryptography & Encryption',
                        lecturer: 'Dr. Robert Johnson',
                        students: 42,
                        lastUpdate: '6 days ago',
                        pdfUrl: null,
                        fileName: 'cryptography.pdf'
                    }
                ]
            },
            {
                id: 105,
                name: 'Machine Learning',
                courses: [
                    {
                        id: 1008,
                        title: 'Introduction to Machine Learning',
                        lecturer: 'Dr. Sarah Badmus',
                        students: 55,
                        lastUpdate: '3 days ago',
                        pdfUrl: null,
                        fileName: 'ml-introduction.pdf'
                    },
                    {
                        id: 1009,
                        title: 'Deep Learning & Neural Networks',
                        lecturer: 'Prof. Adewole Olamilekan',
                        students: 40,
                        lastUpdate: '2 days ago',
                        pdfUrl: null,
                        fileName: 'deep-learning.pdf'
                    },
                    {
                        id: 1010,
                        title: 'Natural Language Processing',
                        lecturer: 'Dr. Chioma Okafor',
                        students: 38,
                        lastUpdate: '1 week ago',
                        pdfUrl: null,
                        fileName: 'nlp.pdf'
                    }
                ]
            }
        ]
    }
])

const toggleFaculty = (facultyId) => {
    expandedFaculty.value = expandedFaculty.value === facultyId ? null : facultyId
}

const toggleDepartment = (facultyId, departmentId) => {
    if (!expandedDepartment.value[facultyId]) {
        expandedDepartment.value[facultyId] = null
    }
    expandedDepartment.value[facultyId] = expandedDepartment.value[facultyId] === departmentId ? null : departmentId
}

const showAddCourseModal = (facultyId, departmentId) => {
    selectedCoursefaculty.value = facultyId
    selectedCourseDepartment.value = departmentId
    showCourseModal.value = true
}

const closeCourseModal = () => {
    showCourseModal.value = false
    courseFormData.value = { title: '', lecturer: '', students: 0 }
}

const saveCourse = () => {
    if (!courseFormData.value.title || !courseFormData.value.lecturer) {
        return
    }

    const faculty = faculties.value.find(f => f.id === selectedCoursefaculty.value)
    const department = faculty.departments.find(d => d.id === selectedCourseDepartment.value)

    if (department.courses.length >= 3) {
        successMessage.value = 'Maximum 3 courses per department reached!'
        showSuccessMessage.value = true
        setTimeout(() => showSuccessMessage.value = false, 3000)
        return
    }

    const fileName = courseFormData.value.title.toLowerCase().replace(/\s+/g, '-') + '.pdf'

    const newCourse = {
        id: Date.now(),
        title: courseFormData.value.title,
        lecturer: courseFormData.value.lecturer,
        students: courseFormData.value.students,
        lastUpdate: 'just now',
        pdfUrl: null,
        fileName
    }

    department.courses.push(newCourse)
    emit('course-added', newCourse)

    // Fetch the public URL for the newly added course immediately
    const { data } = supabase
        .storage
        .from('courses')
        .getPublicUrl(newCourse.fileName)
    newCourse.pdfUrl = data.publicUrl

    successMessage.value = 'Course added successfully!'
    showSuccessMessage.value = true
    setTimeout(() => showSuccessMessage.value = false, 3000)

    closeCourseModal()
}

const viewCourse = (course) => {
    selectedCourse.value = course
    viewCourseModal.value = true
}

const downloadCourse = async (course) => {
    try {
        // Download from Supabase Storage
        const { data, error } = await supabase
            .storage
            .from('courses')
            .download(course.fileName)

        if (error) throw error

        // Create blob URL and trigger download
        const url = URL.createObjectURL(data)
        const link = document.createElement('a')
        link.href = url
        link.download = course.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        successMessage.value = `Downloaded: ${course.title}`
    } catch (error) {
        successMessage.value = `Download failed: ${error.message}`
    }
    
    showSuccessMessage.value = true
    setTimeout(() => showSuccessMessage.value = false, 3000)
}

// Load PDF URLs from Supabase on mount
onMounted(async () => {
    try {
        // Get all courses and load their PDF URLs
        for (const faculty of faculties.value) {
            for (const department of faculty.departments) {
                for (const course of department.courses) {
                    if (course.fileName) {
                        const { data } = supabase
                            .storage
                            .from('courses')
                            .getPublicUrl(course.fileName)
                        
                        course.pdfUrl = data.publicUrl
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error loading PDFs:', error)
    }
})
</script>

<style scoped>
/* Uses the same academic design system as the parent dashboard (navy/gold/teal).
   Font family is inherited from the parent's .study-social-root wrapper;
   font-heading is redeclared here because Vue scoped styles don't cross component boundaries. */
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&display=swap');

.font-heading {
    font-family: 'Lora', Georgia, serif;
    letter-spacing: -0.01em;
}

.expand-enter-active, .expand-leave-active {
    transition: all 0.3s ease;
}

.expand-enter-from {
    opacity: 0;
    height: 0;
}

.expand-leave-to {
    opacity: 0;
    height: 0;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>