
import { useState, useEffect } from "react";
import { Notification } from "../types";
import { notifications as sampleNotifications } from "../data/sampleData";
import { User } from "../types";

export const useNotificationsState = (user: User | null) => {
  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    if (user) {
      // In a real app, we would fetch notifications from an API
      // For demo, we're using sample data
      const userNotifs = sampleNotifications.filter(n => n.userId === user.id);
      setUserNotifications(userNotifs);
    } else {
      setUserNotifications([]);
    }
  }, [user]);

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setUserNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setUserNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    setUserNotifications(prev => [newNotification, ...prev]);
  };

  return {
    notifications: userNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification
  };
};
