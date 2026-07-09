<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <!-- Desktop Header -->
        <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div class="px-6 lg:px-12">
                <div class="flex justify-between items-center py-5">
                    <div class="flex items-center space-x-4">
                        <div
                            class="w-12 h-12 bg-gradient-to-r from-gray-300 to-black rounded-xl flex items-center justify-center">
                            <i class="bi bi-mortarboard-fill text-white text-xl"></i>
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900">Study Social</h1>
                            <p class="text-sm text-gray-500">
    {{ userRole === 'student' ? 'You signed up as a Student' : 'You signed up as a Lecturer' }}
</p>
                        </div>
                    </div>

                    <div class="flex items-center space-x-6">
                        <!-- Notifications -->
                        <div class="relative">
                            <button @click="activeTab = 'messages'"
                                class="p-2 text-gray-600 hover:text-gray-900 relative transition-colors">
                                <i class="bi bi-bell text-xl"></i>
                                <span v-if="notifications > 0"
                                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                                    {{ notifications }}
                                </span>
                            </button>
                        </div>

                        <!-- SignOut -->
                        <div class="">
                            <button @click="handleSignOut"
                                class="p-2 bg-pink-400 hover:bg-pink-700 rounded-xl   text-white hover:text-gray-300 relative transition-colors">
                                Signout
                            </button>
                        </div>

                        <!-- Profile -->
                        <div
                            class="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                            <span class="text-white text-base font-semibold">A</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <div class="px-6 lg:px-12 py-8">
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar Navigation - Fixed for desktop -->
                <aside class="w-full lg:w-80 lg:flex-shrink-0">
                    <nav class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-28">
                        <ul class="space-y-3">
                            <li>
                                <button @click="activeTab = 'dashboard'"
                                    :class="['w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-base', activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100']">
                                    <i class="bi bi-speedometer2 text-lg"></i>
                                    <span>Dashboard</span>
                                </button>
                            </li>
                            <li>
                                <button @click="activeTab = 'courses'"
                                    :class="['w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-base', activeTab === 'courses' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100']">
                                    <i class="bi bi-book text-lg"></i>
                                    <span>Courses</span>
                                </button>
                            </li>
                            <li>
                                <button @click="activeTab = 'messages'"
                                    :class="['w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-base', activeTab === 'messages' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100']">
                                    <i class="bi bi-chat-dots text-lg"></i>
                                    <span>Messages</span>
                                    <span v-if="unreadMessages > 0"
                                        class="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                        {{ unreadMessages }}
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button @click="activeTab = 'content'"
                                    :class="['w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-base', activeTab === 'content' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100']">
                                    <i class="bi bi-file-earmark-text text-lg"></i>
                                    <span>Test</span>
                                </button>
                            </li>
                            <li>
                                <button @click="activeTab = 'assignments'"
                                    :class="['w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-base', activeTab === 'assignments' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100']">
                                    <i class="bi bi-clipboard-check text-lg"></i>
                                    <span>Assignments</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>

                <!-- Main Content Area -->
                <main class="flex-1 min-w-0">
                    <!-- Dashboard -->
                    <div v-if="activeTab === 'dashboard'" class="space-y-8">
                        <DashPage :courses="courses" :messages="messages" :uploads="uploads" :posts="posts"
                            :username="username" :notifications="notifications" @create-post="handleCreatePost"
                            @like-post="handleLikePost" @upload-file="handleFileUpload" @delete-post="handleDeletePost"
                            @download-media="handleDownloadMedia" />
                    </div>

                    <!-- Courses -->
                    <div v-if="activeTab === 'courses'">
                        <MyCoursesPage :courses="courses" :userRole="userRole" @course-added="handleCourseAdded" />
                    </div>

                    <!-- Messages -->
                    <div v-if="activeTab === 'messages'" class="space-y-6">
                        <div class="flex justify-between items-center mb-2">
                            <h2 class="text-3xl font-bold">Messages</h2>
                            <button
                                class="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
                                <i class="bi bi-plus-circle text-lg"></i>
                                <span class="text-base">New Message</span>
                            </button>
                        </div>

                        <div class="bg-white rounded-lg shadow-sm border border-gray-100">
                            <div v-for="(message, index) in messages" :key="message.id"
                                :class="['p-5 hover:bg-gray-50 cursor-pointer', index !== messages.length - 1 ? 'border-b border-gray-100' : '']">
                                <div class="flex items-start space-x-4">
                                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <i class="bi bi-person text-blue-600 text-lg"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center justify-between mb-1">
                                            <h4
                                                :class="['font-medium text-base', message.unread ? 'text-gray-900' : 'text-gray-700']">
                                                {{ message.sender }}
                                            </h4>
                                            <span class="text-sm text-gray-500">{{ message.time }}</span>
                                        </div>
                                        <h5
                                            :class="['text-base mb-1', message.unread ? 'font-medium text-gray-900' : 'text-gray-700']">
                                            {{ message.subject }}
                                        </h5>
                                        <p class="text-base text-gray-600 truncate">{{ message.preview }}</p>
                                    </div>
                                    <div v-if="message.unread" class="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Test (formerly Content) -->
                    <div v-if="activeTab === 'content'" class="space-y-6">
                        <div class="flex justify-between items-center mb-2">
                            <h2 class="text-3xl font-bold">Take a Test</h2>
                            <button v-if="testStep !== 'select-faculty'" @click="resetTest"
                                class="text-gray-600 hover:text-gray-900 flex items-center space-x-2 text-sm">
                                <i class="bi bi-arrow-left"></i>
                                <span>Start Over</span>
                            </button>
                        </div>

                        <!-- Step 1: Select Faculty -->
                        <div v-if="testStep === 'select-faculty'" class="space-y-4">
                            <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                                <div class="flex items-center space-x-4">
                                    <i class="bi bi-search text-gray-400 text-lg"></i>
                                    <input v-model="testSearchQuery" type="text" placeholder="Search faculty..."
                                        class="flex-1 outline-none text-base" />
                                </div>
                            </div>

                            <p class="text-gray-600">Select your faculty at Olabisi Onabanjo University (OOU)</p>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-for="faculty in filteredTestFaculties" :key="faculty.id"
                                    @click="selectTestFaculty(faculty)"
                                    class="bg-white rounded-lg shadow-sm border border-gray-100 p-5 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <i class="bi bi-bank text-blue-600 text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-semibold text-gray-900 text-base">{{ faculty.name }}</h4>
                                            <p class="text-sm text-gray-500">{{ faculty.departments.length }} departments</p>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="filteredTestFaculties.length === 0" class="col-span-full text-center text-gray-500 py-8">
                                    No faculty matches "{{ testSearchQuery }}"
                                </div>
                            </div>
                        </div>

                        <!-- Step 2: Select Department -->
                        <div v-if="testStep === 'select-department'" class="space-y-4">
                            <div class="flex items-center space-x-2 text-sm text-gray-500">
                                <button @click="backToFaculties" class="hover:text-blue-600 flex items-center space-x-1">
                                    <i class="bi bi-arrow-left"></i>
                                    <span>Faculties</span>
                                </button>
                                <i class="bi bi-chevron-right"></i>
                                <span class="font-medium text-gray-800">{{ selectedTestFaculty.name }}</span>
                            </div>

                            <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                                <div class="flex items-center space-x-4">
                                    <i class="bi bi-search text-gray-400 text-lg"></i>
                                    <input v-model="testSearchQuery" type="text" placeholder="Search department..."
                                        class="flex-1 outline-none text-base" />
                                </div>
                            </div>

                            <p class="text-gray-600">Select a department under {{ selectedTestFaculty.name }}</p>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-for="department in filteredTestDepartments" :key="department.id"
                                    @click="selectTestDepartment(department)"
                                    class="bg-white rounded-lg shadow-sm border border-gray-100 p-5 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <i class="bi bi-journal-bookmark text-green-600 text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-semibold text-gray-900 text-base">{{ department.name }}</h4>
                                            <p class="text-sm text-gray-500">Tap to start a 10-question test</p>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="filteredTestDepartments.length === 0" class="col-span-full text-center text-gray-500 py-8">
                                    No department matches "{{ testSearchQuery }}"
                                </div>
                            </div>
                        </div>

                        <!-- Step 3: Taking the Test -->
                        <div v-if="testStep === 'test'" class="space-y-6">
                            <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                                <div class="flex items-center justify-between mb-2">
                                    <h3 class="text-xl font-bold text-gray-900">{{ selectedTestDepartment.name }} Test</h3>
                                    <span class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                        {{ answeredCount }} / {{ currentQuestions.length }} answered
                                    </span>
                                </div>
                                <p class="text-gray-500 text-sm">{{ selectedTestFaculty.name }}</p>
                            </div>

                            <div v-for="(question, index) in currentQuestions" :key="question.id"
                                class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                                <h4 class="font-semibold text-gray-900 text-base mb-4">
                                    {{ index + 1 }}. {{ question.question }}
                                </h4>
                                <div class="space-y-2">
                                    <label v-for="(option, oIndex) in question.options" :key="oIndex"
                                        :class="['flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors',
                                            userAnswers[question.id] === oIndex ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50']">
                                        <input type="radio" :name="'question-' + question.id"
                                            :checked="userAnswers[question.id] === oIndex"
                                            @change="userAnswers[question.id] = oIndex" class="text-blue-600">
                                        <span class="text-base text-gray-700">{{ option }}</span>
                                    </label>
                                </div>
                            </div>

                            <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex justify-between items-center">
                                <p class="text-sm text-gray-500">You can review your answers before submitting.</p>
                                <button @click="submitTest"
                                    class="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                                    Submit Test
                                </button>
                            </div>
                        </div>

                        <!-- Step 4: Result -->
                        <div v-if="testStep === 'result'" class="space-y-6">
                            <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i class="bi bi-check-circle text-green-600 text-3xl"></i>
                                </div>
                                <h3 class="text-2xl font-bold text-gray-900 mb-2">Test Submitted!</h3>
                                <p class="text-gray-600 mb-1">{{ selectedTestDepartment.name }} • {{ selectedTestFaculty.name }}</p>
                                <p class="text-4xl font-bold text-blue-600 my-4">{{ testScore }} / {{ currentQuestions.length }}</p>
                                <button @click="resetTest"
                                    class="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                                    Take Another Test
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Assignments -->
                    <div v-if="activeTab === 'assignments'" class="space-y-6">
                        <div class="flex justify-between items-center mb-2">
                            <h2 class="text-3xl font-bold">Assignments</h2>
                            <button v-if="userRole === 'lecturer'"
                                class="bg-purple-600 text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors">
                                <i class="bi bi-plus-circle text-lg"></i>
                                <span class="text-base">Create Assignment</span>
                            </button>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div v-for="assignment in assignments" :key="assignment.id"
                                class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                                <div class="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 class="font-semibold text-xl">{{ assignment.title }}</h3>
                                        <p class="text-gray-600 text-base">{{ assignment.course }}</p>
                                    </div>
                                    <span :class="['px-3 py-1.5 rounded-full text-sm font-medium',
                                        assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            assignment.status === 'submitted' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800']">
                                        {{ assignment.status }}
                                    </span>
                                </div>
                                <div class="space-y-2 text-base text-gray-600">
                                    <div class="flex items-center">
                                        <i class="bi bi-calendar mr-2"></i>
                                        Due: {{ assignment.dueDate }}
                                    </div>
                                    <div class="flex items-center">
                                        <i class="bi bi-clock mr-2"></i>
                                        {{ assignment.timeLeft }}
                                    </div>
                                </div>
                                <div class="mt-5 pt-5 border-t border-gray-100">
    <button @click="handleSubmitAssignment(assignment.id)"
        :disabled="assignment.status === 'submitted'"
        class="w-full py-2.5 rounded-lg text-base transition-colors"
        :class="assignment.status === 'submitted' ? 'bg-green-600 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'">
        <span v-if="assignment.status === 'submitted'">
            <i class="bi bi-check-circle-fill mr-1"></i> Yes, it has been submitted
        </span>
        <span v-else>Submit Assignment</span>
    </button>
</div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
                <div class="text-center">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="bi bi-exclamation-triangle text-red-600 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Delete Post?</h3>
                    <p class="text-gray-600 mb-6">Are you sure you want to delete this post? This action cannot be
                        undone.</p>

                    <div class="flex space-x-3">
                        <button @click="cancelDelete"
                            class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            No, Cancel
                        </button>
                        <button @click="confirmDelete"
                            class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import DashPage from '@/components/DashPage.vue'
import MyCoursesPage from '@/components/MycoursesPage.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '../supabase'

const activeTab = ref('dashboard')
const router = useRouter()
const userRole = ref('student')
const notifications = ref(3)
const currentUser = ref(null)
const username = ref('Student')
const showDeleteModal = ref(false)
const postToDelete = ref(null)

const messages = ref([
    {
        id: 1,
        sender: 'Dr. Sarah Johnson',
        subject: 'Mathematics Assignment Due',
        preview: 'Please submit your calculus assignment by Friday...',
        time: '2 hours ago',
        unread: true
    },
    {
        id: 2,
        sender: 'Physics Study Group',
        subject: 'Study Session Tomorrow',
        preview: 'We\'re meeting at the library at 3PM...',
        time: '5 hours ago',
        unread: true
    },
    {
        id: 3,
        sender: 'Prof. Michael Chen',
        subject: 'Lab Report Feedback',
        preview: 'Great work on your recent lab report...',
        time: '1 day ago',
        unread: false
    }
])

const courses = ref([
    {
        id: 1,
        title: 'Advanced Mathematics',
        lecturer: 'Dr. Sarah Johnson',
        students: 45,
        lastUpdate: '2 days ago',
        color: 'bg-blue-500'
    },
    {
        id: 2,
        title: 'Physics Science',
        lecturer: 'Prof. Michael Chen',
        students: 38,
        lastUpdate: '1 day ago',
        color: 'bg-green-500'
    },
    {
        id: 3,
        title: 'Computer Science',
        lecturer: 'Dr. Emily Rodriguez',
        students: 52,
        lastUpdate: '3 hours ago',
        color: 'bg-purple-500'
    },
    {
        id: 4,
        title: 'Chemistry Basics',
        lecturer: 'Prof. David Kim',
        students: 41,
        lastUpdate: '5 days ago',
        color: 'bg-red-500'
    }
])

const uploads = ref([
    {
        id: 1,
        title: 'Calculus Chapter 5 Notes',
        type: 'PDF',
        size: '2.4 MB',
        uploadedBy: 'Dr. Sarah Johnson',
        course: 'Advanced Mathematics',
        uploadDate: '2025-09-20'
    },
    {
        id: 2,
        title: 'Physics Lab Report Template',
        type: 'DOCX',
        size: '156 KB',
        uploadedBy: 'Prof. Michael Chen',
        course: 'Physics Laboratory',
        uploadDate: '2025-09-19'
    },
    {
        id: 3,
        title: 'Programming Assignment Guide',
        type: 'PDF',
        size: '890 KB',
        uploadedBy: 'Dr. Emily Rodriguez',
        course: 'Computer Science',
        uploadDate: '2025-09-18'
    }
])

const assignments = ref([
    {
        id: 1,
        title: 'Calculus Problem Set 3',
        course: 'CMP 448 - Distributed Systems',
        dueDate: 'Sept 25, 2024',
        timeLeft: '2 days left',
        status: 'pending'
    },
    {
        id: 2,
        title: 'Lab Report: Motion Analysis',
        course: 'CMP 411 - Computer Networks',
        dueDate: 'Sept 27, 2024',
        timeLeft: '4 days left',
        status: 'pending'
    },
    {
        id: 3,
        title: 'Algorithm Implementation',
        course: 'CMP 405 - Algorithms and Complexity',
        dueDate: 'Sept 22, 2024',
        timeLeft: 'Overdue',
        status: 'overdue'
    },
    {
        id: 4,
        title: 'Chemical Equations Quiz',
        course: 'CMP 422 - Database Management Systems',
        dueDate: 'Sept 20, 2024',
        timeLeft: 'Submitted',
        status: 'submitted'
    }
])

const posts = ref([
    {
        id: 1,
        author: 'Dr. Sarah Badmus',
        authorRole: 'lecturer',
        content: 'Understanding calculus limits can be challenging. Here\'s a visual representation that might help!',
        mediaType: 'image',
        mediaUrl: 'https://i.pinimg.com/736x/99/f0/3c/99f03c6b3b441386386b4226ad02251a.jpg',
        subject: 'Advanced Mathematics',
        timestamp: new Date('2024-09-28T10:30:00'),
        likes: 12,
        comments: 3
    },
    {
        id: 2,
        author: 'Prof. Adewole olamilekan',
        authorRole: 'lecturer',
        content: 'Understanding data structures is crucial for programming. Here\'s a comprehensive video on arrays and linked lists.',
        mediaType: 'video',
        mediaUrl: '/videos/program.mp4',
        subject: 'Computer Science',
        timestamp: new Date('2024-09-28T09:15:00'),
        likes: 8,
        comments: 5
    },
    {
        id: 3,
        author: 'Student Olamide',
        authorRole: 'student',
        content: 'Created this flowchart to understand sorting algorithms better. Hope it helps others too!',
        mediaType: 'image',
        mediaUrl: 'https://i.pinimg.com/736x/93/2a/fa/932afa0ae289aebaf8d2bc10d907e2a5.jpg',
        subject: 'Computer Science',
        timestamp: new Date('2024-09-27T16:45:00'),
        likes: 15,
        comments: 7
    }
])

/* ===================== Test feature (Content tab) ===================== */

// Sample OOU faculty/department structure — replace with real data later
const testFaculties = ref([
    {
        id: 1,
        name: 'Faculty of Science',
        departments: [
            { id: 101, name: 'Computer Science' },
            { id: 102, name: 'Data Engineering' },
            { id: 103, name: 'Engineering' },
            { id: 104, name: 'Cybersecurity' },
            { id: 105, name: 'Machine Learning' }
        ]
    },
    {
        id: 2,
        name: 'Faculty of Arts',
        departments: [
            { id: 201, name: 'English Language' },
            { id: 202, name: 'History' },
            { id: 203, name: 'Philosophy' }
        ]
    },
    {
        id: 3,
        name: 'Faculty of Social Sciences',
        departments: [
            { id: 301, name: 'Economics' },
            { id: 302, name: 'Political Science' },
            { id: 303, name: 'Mass Communication' }
        ]
    },
    {
        id: 4,
        name: 'Faculty of Management Sciences',
        departments: [
            { id: 401, name: 'Accounting' },
            { id: 402, name: 'Business Administration' },
            { id: 403, name: 'Marketing' }
        ]
    }
])

// Placeholder question pool — 10 random questions are drawn from this on each test
const questionPool = ref([
    { id: 1, question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Central Processor Unicode'], correctIndex: 0 },
    { id: 2, question: 'Which language runs in a web browser?', options: ['Java', 'C', 'Python', 'JavaScript'], correctIndex: 3 },
    { id: 3, question: 'What is the capital of Nigeria?', options: ['Lagos', 'Abuja', 'Ibadan', 'Kano'], correctIndex: 1 },
    { id: 4, question: 'H2O is the chemical formula for what?', options: ['Oxygen', 'Hydrogen', 'Water', 'Salt'], correctIndex: 2 },
    { id: 5, question: 'Which of these is a prime number?', options: ['4', '6', '9', '7'], correctIndex: 3 },
    { id: 6, question: 'Who is known as the father of computers?', options: ['Charles Babbage', 'Alan Turing', 'Bill Gates', 'Steve Jobs'], correctIndex: 0 },
    { id: 7, question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Cytoplasm'], correctIndex: 1 },
    { id: 8, question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Mars', 'Saturn'], correctIndex: 2 },
    { id: 9, question: 'What does HTML stand for?', options: ['Hyper Trainer Marking Language', 'HyperText Markup Language', 'HyperText Machine Language', 'Hyperlink Text Markup Language'], correctIndex: 1 },
    { id: 10, question: 'Which gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctIndex: 2 },
    { id: 11, question: 'What is 12 x 8?', options: ['96', '86', '106', '94'], correctIndex: 0 },
    { id: 12, question: 'Which of these is an operating system?', options: ['Microsoft Word', 'Windows', 'Excel', 'Chrome'], correctIndex: 1 },
    { id: 13, question: 'Who wrote "Things Fall Apart"?', options: ['Wole Soyinka', 'Chinua Achebe', 'Chimamanda Adichie', 'Ben Okri'], correctIndex: 1 },
    { id: 14, question: 'What is the boiling point of water at sea level (°C)?', options: ['90', '100', '110', '120'], correctIndex: 1 },
    { id: 15, question: 'Which currency is used in Nigeria?', options: ['Cedi', 'Naira', 'Rand', 'Franc'], correctIndex: 1 }
])

const testStep = ref('select-faculty') // select-faculty | select-department | test | result
const testSearchQuery = ref('')
const selectedTestFaculty = ref(null)
const selectedTestDepartment = ref(null)
const currentQuestions = ref([])
const userAnswers = ref({})
const testScore = ref(0)

const filteredTestFaculties = computed(() => {
    if (!testSearchQuery.value) return testFaculties.value
    const query = testSearchQuery.value.toLowerCase()
    return testFaculties.value.filter(f => f.name.toLowerCase().includes(query))
})

const filteredTestDepartments = computed(() => {
    if (!selectedTestFaculty.value) return []
    if (!testSearchQuery.value) return selectedTestFaculty.value.departments
    const query = testSearchQuery.value.toLowerCase()
    return selectedTestFaculty.value.departments.filter(d => d.name.toLowerCase().includes(query))
})

const answeredCount = computed(() => Object.keys(userAnswers.value).length)

const selectTestFaculty = (faculty) => {
    selectedTestFaculty.value = faculty
    testSearchQuery.value = ''
    testStep.value = 'select-department'
}

const backToFaculties = () => {
    selectedTestFaculty.value = null
    testSearchQuery.value = ''
    testStep.value = 'select-faculty'
}

const getRandomQuestions = (count) => {
    const shuffled = [...questionPool.value].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
}

const selectTestDepartment = (department) => {
    selectedTestDepartment.value = department
    testSearchQuery.value = ''
    currentQuestions.value = getRandomQuestions(10)
    userAnswers.value = {}
    testStep.value = 'test'
}

const submitTest = () => {
    let score = 0
    currentQuestions.value.forEach(q => {
        if (userAnswers.value[q.id] === q.correctIndex) {
            score++
        }
    })
    testScore.value = score
    testStep.value = 'result'
}

const resetTest = () => {
    testStep.value = 'select-faculty'
    selectedTestFaculty.value = null
    selectedTestDepartment.value = null
    testSearchQuery.value = ''
    currentQuestions.value = []
    userAnswers.value = {}
    testScore.value = 0
}

/* ===================== End Test feature ===================== */

const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Sign out error:', error.message)
  } else {
    console.log('✅ Signed out successfully')
    router.push('/')  // Redirect to home page
  }
}

// Event handlers for DashPage
const handleCreatePost = (postData) => {
    const post = {
        id: Date.now(),
        author: username.value,
        authorRole: userRole.value,
        content: postData.content,
        mediaType: postData.mediaType,
        mediaUrl: postData.mediaUrl,
        subject: postData.subject,
        timestamp: new Date(),
        likes: 0,
        comments: 0
    }

    posts.value.unshift(post)
}

const handleLikePost = (postId) => {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
        post.likes++
    }
}

const handleFileUpload = (file) => {
    // Handle file upload - integrate with your storage solution
    console.log('File uploaded:', file)
}

const handleDeletePost = (postId) => {
    postToDelete.value = postId
    showDeleteModal.value = true
}

const confirmDelete = () => {
    posts.value = posts.value.filter(post => post.id !== postToDelete.value)
    showDeleteModal.value = false
    postToDelete.value = null
}

const cancelDelete = () => {
    showDeleteModal.value = false
    postToDelete.value = null
}

// Course added handler
const handleCourseAdded = (newCourse) => {
    courses.value.unshift(newCourse)
}

// submit assignment
const handleSubmitAssignment = (assignmentId) => {
    const assignment = assignments.value.find(a => a.id === assignmentId)
    if (assignment && assignment.status !== 'submitted') {
        assignment.status = 'submitted'
        assignment.timeLeft = 'Submitted'
    }
}

// Improved Download media handler
const handleDownloadMedia = async (mediaUrl, fileName) => {
    try {
        // For external URLs (images, PDFs from external sources)
        if (mediaUrl.startsWith('http')) {
            // Create a temporary anchor and trigger download
            const link = document.createElement('a')
            link.href = mediaUrl
            link.download = fileName || 'download'
            link.target = '_blank'
            link.rel = 'noopener noreferrer'

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

        } else {
            // For local files (videos from /public folder)
            const link = document.createElement('a')
            link.href = mediaUrl
            link.download = fileName || 'download'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    } catch (error) {
        console.error('Download failed:', error)
        // Fallback: Open in new tab
        window.open(mediaUrl, '_blank')
    }
}

const unreadMessages = computed(() => {
    return messages.value.filter(message => message.unread).length
})

// Watch for tab changes to update notifications
watch(activeTab, (newTab) => {
    if (newTab === 'messages' && notifications.value > 0) {
        // Reduce notifications count when viewing messages
        notifications.value = Math.max(0, notifications.value - unreadMessages.value)
    }
})

// Get current user and username
onMounted(async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            currentUser.value = user
            // Get username from user metadata
            username.value = user.user_metadata?.username || user.email?.split('@')[0] || 'Student'
            // Get user role from signup category
            userRole.value = user.user_metadata?.role || user.user_metadata?.category || 'student'
        }
    } catch (error) {
        console.error('Error getting user:', error)
    }
})
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>