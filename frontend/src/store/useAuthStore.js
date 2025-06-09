import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";


export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data.user })
            toast.success(res.data.message)
        } catch (error) {
            console.log(error, "Error checking auth")
            toast.error("Please log in")
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data)

            set({ authUser: res.data.user })
            toast.success(res.message)
        } catch (error) {
            console.log(error, "Error signing up")
            toast.error("Error signing up")
            set({ authUser: null })
        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data)

            set({ authUser: res.data.user })
            toast.success(res.message)
        } catch (error) {
            console.log(error, "Error logging in")
            toast.error("Error logging in")
            set({ authUser: null })
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout")

            set({ authUser: null })
            toast.success(res.message)
        } catch (error) {
            console.log(error, "Error logging in")
            toast.error("Error logging in")
        }
    },


}))