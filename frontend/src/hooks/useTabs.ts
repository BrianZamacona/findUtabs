import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Tab, CreateTabRequest } from '@/types/tab';
import { PaginatedResponse } from '@/types/api';

export const useTabs = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['tabs', page, size],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Tab>>('/tabs', {
        params: { page, size },
      });
      return data;
    },
  });
};

export const useTab = (id: number) => {
  return useQuery({
    queryKey: ['tab', id],
    queryFn: async () => {
      const { data } = await api.get<Tab>(`/tabs/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateTab = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tabData: CreateTabRequest) => {
      const { data } = await api.post<Tab>('/tabs', tabData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabs'] });
    },
  });
};

export const useDeleteTab = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/tabs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabs'] });
    },
  });
};

export const useSearchTabs = (searchType: 'artist' | 'title', query: string, page = 0, size = 20) => {
  return useQuery({
    queryKey: ['tabs', 'search', searchType, query, page, size],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Tab>>(`/tabs/search/${searchType}`, {
        params: { [searchType]: query, page, size },
      });
      return data;
    },
    enabled: !!query,
  });
};

export const useTopTabs = () => {
  return useQuery({
    queryKey: ['tabs', 'top'],
    queryFn: async () => {
      const { data } = await api.get<Tab[]>('/tabs/top');
      return data;
    },
  });
};
