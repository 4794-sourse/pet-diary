import { reminderService } from '../../services/reminderService';

Page({
  data: {
    reminders: [] as any[],
  },

  async onShow() {
    try {
      const reminders = await reminderService.list();
      this.setData({ reminders: reminders.slice(0, 5) });
    } catch (error) {
      wx.showToast({ title: '加载失败', icon: 'none' });
      console.error(error);
    }
  },

  goToPetEdit() {
    wx.navigateTo({ url: '/pages/pet-edit/index' });
  },

  goToPostEdit() {
    wx.navigateTo({ url: '/pages/post-edit/index' });
  },

  goToReminderList() {
    wx.navigateTo({ url: '/pages/reminder-list/index' });
  },
});
