import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Tab, CreateTabRequest } from '@/types/tab';
import { PaginatedResponse } from '@/types/api';

export const useAllTabs = (page = 0, size = 20, sort?: string) => {
  return useQuery({
    queryKey: ['tabs', page, size, sort],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Tab>>('/tabs', {
        params: { page, size, ...(sort ? { sort } : {}) },
      });
      return data;
    },
  });
};

/** @deprecated Use useAllTabs instead */
export const useTabs = useAllTabs;

export const useTabById = (id: number) => {
  return useQuery({
    queryKey: ['tab', id],
    queryFn: async () => {
      const { data } = await api.get<Tab>(`/tabs/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

/** @deprecated Use useTabById instead */
export const useTab = useTabById;

export const useTabsByUser = (userId: number, page = 0, size = 20) => {
  return useQuery({
    queryKey: ['tabs', 'user', userId, page, size],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Tab>>(`/tabs/user/${userId}`, {
        params: { page, size },
      });
      return data;
    },
    enabled: !!userId,
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

export const useSearchTabsByArtist = (artist: string, page = 0, size = 20) => {
  return useQuery({
    queryKey: ['tabs', 'search', 'artist', artist, page, size],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Tab>>('/tabs/search/artist', {
        params: { artist, page, size },
      });
      return data;
    },
    enabled: !!artist,
  });
};

export const useSearchTabsByTitle = (title: string, page = 0, size = 20) => {
  return useQuery({
    queryKey: ['tabs', 'search', 'title', title, page, size],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Tab>>('/tabs/search/title', {
        params: { title, page, size },
      });
      return data;
    },
    enabled: !!title,
  });
};

/** @deprecated Use useSearchTabsByArtist or useSearchTabsByTitle */
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
