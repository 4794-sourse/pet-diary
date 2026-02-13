const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID: openid } = cloud.getWXContext();
  const { action, payload = {}, page = 1, pageSize = 10 } = event;

  if (action === 'create') {
    const result = await db.collection('posts').add({
      data: {
        owner_openid: openid,
        pet_id: payload.petId,
        content: payload.content,
        tags: payload.tags || [],
        image_file_ids: payload.imageFileIds || [],
        event_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        deleted: false,
      },
    });
    return { id: result._id };
  }

  if (action === 'list') {
    const result = await db.collection('posts')
      .where({ owner_openid: openid, deleted: false })
      .orderBy('event_at', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();
    return { data: result.data };
  }

  if (action === 'delete') {
    const result = await db.collection('posts').where({
      _id: payload.id,
      owner_openid: openid,
      deleted: false,
    }).update({
      data: {
        deleted: true,
        updated_at: new Date(),
      },
    });

    if (!result.stats || result.stats.updated === 0) {
      throw new Error('post not found or permission denied');
    }

    return { success: true };
  }

  throw new Error('unsupported action');
};
