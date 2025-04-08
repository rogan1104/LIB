
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Check,
  BookOpen,
  AlertCircle,
  CreditCard,
  Bell,
  CheckCheck,
  ArrowLeft
} from "lucide-react";

const Notifications = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "borrow":
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case "due":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "payment":
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case "return":
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-library-primary text-white py-8">
          <div className="container mx-auto px-4">
            <div className="mb-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-white hover:bg-library-secondary"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
              
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  onClick={() => markAllAsRead()}
                  className="border-white text-white hover:bg-white hover:text-library-primary"
                >
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Mark all as read ({unreadCount})
                </Button>
              )}
            </div>
          </div>
        </section>
        
        {/* Notifications List */}
        <section className="py-8 bg-library-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle>Your Notifications</CardTitle>
                <CardDescription>
                  Stay updated with information about your books, due dates, and payments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-4 rounded-lg flex ${
                          notification.read ? "bg-white" : "bg-library-light border-l-4 border-library-primary"
                        }`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="mr-3 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <p className="font-medium">{notification.message}</p>
                            {!notification.read && (
                              <span className="text-xs font-medium bg-library-accent text-library-primary px-2 py-0.5 rounded">New</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Notifications</h3>
                    <p className="text-muted-foreground">
                      You don't have any notifications at the moment.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Notifications;
