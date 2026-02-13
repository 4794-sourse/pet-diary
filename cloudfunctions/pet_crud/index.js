const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID: openid } = cloud.getWXContext();
  const { action, payload = {} } = event;

  if (action === 'create') {
    const result = await db.collection('pets').add({
      data: {
        owner_openid: openid,
        name: payload.name,
        species: payload.species || '',
        breed: payload.breed || '',
        birthday: payload.birthday || null,
        archived: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    return { id: result._id };
  }

  if (action === 'list') {
    const result = await db.collection('pets')
      .where({ owner_openid: openid, archived: false })
      .orderBy('updated_at', 'desc')
      .get();
    return { data: result.data };
  }

  if (action === 'update') {
    const { id, ...rest } = payload;
    const allowedFields = ['name', 'species', 'breed', 'birthday', 'archived'];
    const updates = allowedFields.reduce((acc, field) => {
      if (rest[field] !== undefined) {
        acc[field] = rest[field];
      }
      return acc;
    }, {});

    const result = await db.collection('pets').where({
      _id: id,
      owner_openid: openid,
      archived: false,
    }).update({
      data: {
        ...updates,
        updated_at: new Date(),
      },
    });

    if (!result.stats || result.stats.updated === 0) {
      throw new Error('pet not found or permission denied');
    }

    return { success: true };
  }

  throw new Error('unsupported action');
};
