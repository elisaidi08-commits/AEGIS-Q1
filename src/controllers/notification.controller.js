const { db } = require('../config/database');

exports.getNotifications = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = (page - 1) * limit;

  const total = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ?').get(req.user.id).count;

  const notifications = db.prepare(`
    SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?
  `).all(req.user.id, limit, offset);

  const unread = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0').get(req.user.id).count;

  res.json({
    success: true,
    data: notifications.map(n => ({
      ...n,
      is_read: !!n.is_read
    })),
    unread_count: unread,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
};

exports.markAsRead = (req, res) => {
  const notification = db.prepare('SELECT * FROM notifications WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!notification) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOTIFICATION_NOT_FOUND', message: 'Notification not found' }
    });
  }

  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(req.params.id);

  res.json({
    success: true,
    data: { message: 'Notification marked as read' }
  });
};

exports.markAllAsRead = (req, res) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(req.user.id);

  res.json({
    success: true,
    data: { message: 'All notifications marked as read' }
  });
};
