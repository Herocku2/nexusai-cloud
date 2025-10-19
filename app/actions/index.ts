"use server"

// Re-exportar las funciones de social auth
export { 
  doSocialLogin,
  loginWithGoogle,
  loginWithGitHub,
  loginWithProvider 
} from './social-auth'
