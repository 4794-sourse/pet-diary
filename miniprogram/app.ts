App<IAppOption>({
  globalData: {
    userReady: false,
  },

  onLaunch() {
    wx.cloud.init({
      traceUser: true,
    });
  },
});

export interface IAppOption {
  globalData: {
    userReady: boolean;
  };
}
