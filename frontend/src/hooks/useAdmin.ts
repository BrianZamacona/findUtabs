import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { PaginatedResponse } from '@/types/api';
import { User } from '@/types/user';

export interface AdminStats {
  totalUsers: number;
  totalTabs: number;
  pendingDmcaReports: number;
}

export interface DmcaReport {
  id: number;
  reporterName: string;
  reporterEmail: string;
  reporterCompany?: string;
  contentUrl: string;
  originalWorkDescription: string;
  ownershipStatement: string;
  goodFaithStatement: boolean;
  accuracyStatement: boolean;
  status: 'PENDING' | 'REVIEWED' | 'ACTIONED' | 'REJECTED';
  createdAt: string;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await api.get<AdminStats>('/admin/stats');
      return data;
    },
  });
};

export const useAdminUsers = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['admin', 'users', page, size],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<User>>('/admin/users', {
        params: { page, size },
      });
      return data;
    },
  });
};

export const useAdminDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      await api.delete(`/admin/users/${userId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
};

export const useAdminBanUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      const { data } = await api.put<User>(`/admin/users/${userId}/ban`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
};

export const useAdminDmcaReports = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['admin', 'dmca', page, size],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<DmcaReport>>('/admin/dmca-reports', {
        params: { page, size },
      });
      return data;
    },
  });
};

export const useAdminActionDmca = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, action }: { id: number; action: string }) => {
      const { data } = await api.put<DmcaReport>(`/admin/dmca-reports/${id}/action`, null, {
        params: { action },
      });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'dmca'] }),
  });
};

export const useAdminDeleteTab = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tabId: number) => {
      await api.delete(`/admin/tabs/${tabId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tabs'] }),
  });
};
