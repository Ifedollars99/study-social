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
                                    <span>Content</span>
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

                    <!-- Content -->
                    <div v-if="activeTab === 'content'" class="space-y-6">
                        <div class="flex justify-between items-center mb-2">
                            <h2 class="text-3xl font-bold">Course Content</h2>
                            <button v-if="userRole === 'lecturer'"
                                class="bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors">
                                <i class="bi bi-cloud-upload text-lg"></i>
                                <span class="text-base">Upload Content</span>
                            </button>
                        </div>

                        <div class="bg-white rounded-lg shadow-sm border border-gray-100">
                            <div class="p-5 border-b border-gray-100">
                                <div class="flex items-center space-x-4">
                                    <i class="bi bi-search text-gray-400 text-lg"></i>
                                    <input type="text" placeholder="Search content..."
                                        class="flex-1 outline-none text-base" />
                                </div>
                            </div>

                            <div class="divide-y divide-gray-100">
                                <div v-for="upload in uploads" :key="upload.id" class="p-5 hover:bg-gray-50">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center space-x-4">
                                            <div
                                                class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                                <i class="bi bi-file-earmark-pdf text-orange-600 text-xl"></i>
                                            </div>
                                            <div>
                                                <h4 class="font-medium text-base">{{ upload.title }}</h4>
                                                <p class="text-base text-gray-600">
                                                    {{ upload.course }} • Uploaded by {{ upload.uploadedBy }}
                                                </p>
                                                <p class="text-sm text-gray-500">{{ upload.type }} • {{ upload.size }}
                                                </p>
                                            </div>
                                        </div>
                                        <button class="text-blue-600 hover:text-blue-800 transition-colors p-2">
                                            <i class="bi bi-download text-2xl"></i>
                                        </button>
                                    </div>
                                </div>
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
                                    <button
                                        class="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-base">
                                        {{ assignment.status === 'submitted' ? 'View Submission' : 'Submit Assignment'
                                        }}
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
        course: 'Advanced Mathematics',
        dueDate: 'Sept 25, 2024',
        timeLeft: '2 days left',
        status: 'pending'
    },
    {
        id: 2,
        title: 'Lab Report: Motion Analysis',
        course: 'Physics Laboratory',
        dueDate: 'Sept 27, 2024',
        timeLeft: '4 days left',
        status: 'pending'
    },
    {
        id: 3,
        title: 'Algorithm Implementation',
        course: 'Computer Science',
        dueDate: 'Sept 22, 2024',
        timeLeft: 'Overdue',
        status: 'overdue'
    },
    {
        id: 4,
        title: 'Chemical Equations Quiz',
        course: 'Chemistry Basics',
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