import { reminderService } from '../../services/reminderService';

Page({
  data: {
    reminders: [] as any[],
  },

  async onShow() {
    const reminders = await reminderService.list();
    this.setData({ reminders });
  },

  async onComplete(event: WechatMiniprogram.TouchEvent) {
    const reminderId = event.currentTarget.dataset.id;
    if (!reminderId) return;

    await reminderService.complete(reminderId);
    wx.showToast({ title: '已完成', icon: 'success' });
    const reminders = await reminderService.list();
    this.setData({ reminders });
  },
});
