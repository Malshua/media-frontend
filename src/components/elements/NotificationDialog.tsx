import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoNotifications } from "react-icons/io5";
import Image from "next/image";
import { bell } from "../../../public/assets/images";

const dummyNotifications = [
  {
    id: 1,
    user: "Lois Griffin",
    time: "11 hours ago",
    message: "@Brian Griffin when you wanna go out buddy?",
    task: "Take Brian on a walk",
    assigned: null,
    read: false,
  },
  {
    id: 2,
    user: "Lois Griffin",
    time: "11 hours ago",
    message: null,
    task: "Take Brian on a walk",
    assigned: "Peter Griffin",
    read: false,
  },
  {
    id: 3,
    user: "Glenn Quagmire",
    time: "11 hours ago",
    message: null,
    task: "Take Brian on a walk",
    assigned: null,
    read: true,
  },
];

function NotificationDialog() {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [viewUnread, setViewUnread] = useState(true);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = viewUnread
    ? notifications.filter((n) => !n.read)
    : notifications;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <IoNotifications className="h-5 w-5" />
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-0 mr-10">
        <div className="flex justify-between items-center border-b px-4 pt-2">
          <div className="flex gap-4 text-sm font-semibold">
            <button
              onClick={() => setViewUnread(true)}
              className={cn(
                "pb-1",
                viewUnread ? "border-b-2 border-black" : "text-gray-500"
              )}
            >
              Unread{" "}
              <span className="text-xs bg-red-500 text-white rounded-full px-2 ml-1">
                {unreadCount}
              </span>
            </button>
            <button
              onClick={() => setViewUnread(false)}
              className={cn(
                "pb-1",
                !viewUnread ? "border-b-2 border-black" : "text-gray-500"
              )}
            >
              All
            </button>
          </div>
          <Button
            variant="outline"
            className="text-xs h-7 px-3 mb-1"
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        </div>
        <ScrollArea className="h-[350px]">
          {notifications.length > 1 ? (
            <NoNotifs />
          ) : (
            <div className="divide-y">
              <AnimatePresence>
                {notifications?.map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "px-4 py-3 flex flex-col gap-1 transition-all border-b mx-1 rounded-md my-1",
                      !n.read ? "" : ""
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {!n.read && (
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      )}
                      <p
                        className={cn(
                          "text-sm",
                          !n.read ? "" : "text-[#787774]"
                        )}
                      >
                        <span className="font-semibold">{n.user}</span>{" "}
                        commented in{" "}
                        <span className="font-semibold">{n.task}</span>
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-xs text-gray-500",
                        !n.read ? "" : "text-[#CBCACA]"
                      )}
                    >
                      {n.time} •
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationDialog;

const NoNotifs = () => {
  return (
    <div className="flex flex-col items-center justify-center py-14 mx-auto">
      <Image
        src={bell}
        alt="empty state image"
        width={165}
        height={165}
        priority={true}
      />
      <div className="mt-8 text-center text-light-1">
        <h3 className="font-semibold md:text-xl text-[#000000]">
          No Notifications Yet
        </h3>
        <p className="mt-1 text-xs text-[#757575]">
          You have no notifications currently.
        </p>
      </div>
    </div>
  );
};
