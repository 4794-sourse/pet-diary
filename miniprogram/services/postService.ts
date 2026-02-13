import { callCloudFunction } from '../utils/cloud';
import type { PostDraft } from '../types';

export const postService = {
  async create(post: PostDraft) {
    return callCloudFunction<{ id: string }>({
      name: 'post_crud',
      data: { action: 'create', payload: post },
    });
  },
};
