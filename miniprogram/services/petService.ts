import { callCloudFunction } from '../utils/cloud';
import type { Pet } from '../types';

export const petService = {
  async create(pet: Pet) {
    return callCloudFunction<{ id: string }>({
      name: 'pet_crud',
      data: { action: 'create', payload: pet },
    });
  },

  async list() {
    return callCloudFunction<Pet[]>({
      name: 'pet_crud',
      data: { action: 'list' },
      transform: (result) => ((result as { data?: Pet[] }).data ?? []),
    });
  },
};
