import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  TranscriptionResponse,
  LibrarySong,
  CreateTranscriptionRequest,
} from '@/types/transcription';
import { PaginatedResponse } from '@/types/api';

export const usePublicLibrary = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['library', 'public', page, size],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<LibrarySong>>('/transcriptions/library', {
        params: { page, size },
      });
      return data;
    },
  });
};

export const useMyLibrary = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['library', 'mine', page, size],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<LibrarySong>>(
        '/transcriptions/my-library',
        { params: { page, size } },
      );
      return data;
    },
  });
};

export const useTranscription = (id: number) => {
  return useQuery({
    queryKey: ['transcription', id],
    queryFn: async () => {
      const { data } = await api.get<TranscriptionResponse>(`/transcriptions/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useRequestTranscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateTranscriptionRequest) => {
      const { data } = await api.post<TranscriptionResponse>('/transcriptions', request);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
    },
  });
};
