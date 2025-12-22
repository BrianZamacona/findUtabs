import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, LoginCredentials, RegisterData } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout: storeLogout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setUser(data);
      router.push('/browse');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      setUser(data);
      router.push('/browse');
    },
  });

  const logout = () => {
    storeLogout();
    authService.logout();
    queryClient.clear();
    router.push('/');
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
