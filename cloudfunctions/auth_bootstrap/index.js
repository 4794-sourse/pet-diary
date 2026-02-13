const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  const user = await db.collection('users').doc(openid).get().catch(() => null);
  if (!user || !user.data) {
    await db.collection('users').doc(openid).set({
      data: {
        nickname: event.nickname || '',
        avatar_url: event.avatarUrl || '',
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  return { openid, initialized: true };
};
