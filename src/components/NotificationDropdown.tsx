
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/context/NotificationContext";
import { Check, BookOpen, AlertCircle, CreditCard, Bell } from "lucide-react";

interface NotificationDropdownProps {
  children: React.ReactNode;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ children }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "borrow":
        return <BookOpen className="h-4 w-4 mr-2" />;
      case "due":
        return <AlertCircle className="h-4 w-4 mr-2" />;
      case "payment":
        return <CreditCard className="h-4 w-4 mr-2" />;
      case "return":
        return <Check className="h-4 w-4 mr-2" />;
      default:
        return <Bell className="h-4 w-4 mr-2" />;
    }
  };
  
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    navigate("/notifications");
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="rounded-full px-2">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-64 overflow-y-auto">
          <DropdownMenuGroup>
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex items-start py-2 ${!notification.read ? "bg-muted/50" : ""}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div>
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No notifications</p>
              </div>
            )}
          </DropdownMenuGroup>
        </div>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/notifications")}
              >
                View All
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAllAsRead()}
                >
                  Mark All as Read
                </Button>
              )}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
