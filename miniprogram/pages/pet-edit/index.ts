import { petService } from '../../services/petService';

Page({
  data: {
    name: '',
    species: 'cat',
  },

  onNameInput(event: WechatMiniprogram.Input) {
    this.setData({ name: event.detail.value });
  },

  onSpeciesInput(event: WechatMiniprogram.Input) {
    this.setData({ species: event.detail.value });
  },

  async onSubmit() {
    const { name, species } = this.data;
    if (!name) {
      wx.showToast({ title: '请输入宠物名', icon: 'none' });
      return;
    }

    await petService.create({ name, species });
    wx.showToast({ title: '已保存', icon: 'success' });
    wx.navigateBack();
  },
});
