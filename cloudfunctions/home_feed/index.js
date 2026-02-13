const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async () => {
  const { OPENID: openid } = cloud.getWXContext();
  const now = new Date();

  const [remindersRes, postsRes] = await Promise.all([
    db.collection('reminders')
      .where({
        owner_openid: openid,
        status: 'active',
        next_due_at: db.command.lte(now),
      })
      .orderBy('next_due_at', 'asc')
      .limit(10)
      .get(),
    db.collection('posts')
      .where({ owner_openid: openid, deleted: false })
      .orderBy('event_at', 'desc')
      .limit(5)
      .get(),
  ]);

  return {
    todayReminders: remindersRes.data,
    recentPosts: postsRes.data,
  };
};
