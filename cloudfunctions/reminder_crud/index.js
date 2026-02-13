const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

function calcNextDue(currentDueAt, rule) {
  const due = new Date(currentDueAt);
  if (rule?.unit === 'month') {
    due.setMonth(due.getMonth() + (rule.interval || 1));
    return due;
  }

  due.setDate(due.getDate() + (rule?.interval || 1));
  return due;
}

exports.main = async (event) => {
  const { OPENID: openid } = cloud.getWXContext();
  const { action, payload = {} } = event;

  if (action === 'create') {
    const result = await db.collection('reminders').add({
      data: {
        owner_openid: openid,
        pet_id: payload.petId,
        type: payload.type || 'custom',
        title: payload.title,
        rule: payload.rule || { unit: 'day', interval: 1 },
        next_due_at: new Date(payload.nextDueAt),
        last_done_at: null,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return { id: result._id };
  }

  if (action === 'list') {
    const result = await db.collection('reminders')
      .where({ owner_openid: openid, status: 'active' })
      .orderBy('next_due_at', 'asc')
      .get();
    return { data: result.data };
  }

  if (action === 'complete') {
    const reminderResult = await db.collection('reminders').where({
      _id: payload.reminderId,
      owner_openid: openid,
      status: 'active',
    }).get();

    if (!reminderResult.data || reminderResult.data.length === 0) {
      throw new Error('reminder not found or permission denied');
    }

    const reminder = reminderResult.data[0];
    const nextDueAt = calcNextDue(reminder.next_due_at, reminder.rule);

    await db.collection('reminder_logs').add({
      data: {
        reminder_id: payload.reminderId,
        owner_openid: openid,
        pet_id: reminder.pet_id,
        done_at: new Date(),
        comment: payload.comment || '',
      },
    });

    const updateResult = await db.collection('reminders').where({
      _id: payload.reminderId,
      owner_openid: openid,
      status: 'active',
    }).update({
      data: {
        last_done_at: new Date(),
        next_due_at: nextDueAt,
        updated_at: new Date(),
      },
    });

    if (!updateResult.stats || updateResult.stats.updated === 0) {
      throw new Error('reminder not found or permission denied');
    }

    return { success: true };
  }

  if (action === 'pause') {
    await db.collection('reminders').doc(payload.reminderId).update({
      data: {
        status: 'paused',
        updated_at: new Date(),
      },
    });
    return { success: true };
  }

  throw new Error('unsupported action');
};
