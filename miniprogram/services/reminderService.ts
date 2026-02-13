import { callCloudFunction } from '../utils/cloud';

export const reminderService = {
  async list() {
    return callCloudFunction<any[]>({
      name: 'reminder_crud',
      data: { action: 'list' },
      transform: (result) => ((result as { data?: any[] }).data ?? []),
    });
  },

  async complete(reminderId: string) {
    return callCloudFunction({
      name: 'reminder_crud',
      data: { action: 'complete', payload: { reminderId } },
    });
  },
};
