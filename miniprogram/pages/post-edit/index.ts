import { postService } from '../../services/postService';

Page({
  data: {
    petId: '',
    content: '',
  },

  onPetIdInput(event: WechatMiniprogram.Input) {
    this.setData({ petId: event.detail.value });
  },

  onContentInput(event: WechatMiniprogram.Input) {
    this.setData({ content: event.detail.value });
  },

  async onSubmit() {
    const { petId, content } = this.data;
    if (!petId || !content) {
      wx.showToast({ title: '请填写 petId 和内容', icon: 'none' });
      return;
    }

    await postService.create({
      petId,
      content,
      tags: [],
      imageFileIds: [],
    });

    wx.showToast({ title: '发布成功', icon: 'success' });
    wx.navigateBack();
  },
});
