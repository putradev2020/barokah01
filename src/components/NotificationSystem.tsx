import React, { useEffect, useState } from 'react';
import { Bell, X, CheckCircle } from 'lucide-react';

interface Notification {
  id: number;
  message: string;
  timestamp: string;
  read?: boolean;
}

interface NotificationSystemProps {
  notifications: Notification[];
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  // Send WhatsApp notification for new bookings
  useEffect(() => {
    notifications.forEach(notification => {
      if (!notification.read) {
        // Send WhatsApp notification to admin
        const message = encodeURIComponent(`🔔 NOTIFIKASI BOOKING BARU\n\n${notification.message}\n\nWaktu: ${new Date(notification.timestamp).toLocaleString('id-ID')}\n\nSilakan cek dashboard admin untuk detail lengkap.`);
        const whatsappUrl = `https://wa.me/6285368148449?text=${message}`;
        
        // Open WhatsApp in new tab (for demo purposes)
        // In production, you might want to use a WhatsApp API service
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
        }, 1000);
      }
    });
  }, [notifications]);

  const markAsRead = (id: number) => {
    setLocalNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = localNotifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Notifikasi</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {localNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Tidak ada notifikasi
              </div>
            ) : (
              localNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleString('id-ID')}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        title="Tandai sudah dibaca"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {localNotifications.length > 0 && (
            <div className="p-4 border-t">
              <button
                onClick={() => setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
              >
                Tandai semua sudah dibaca
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;