import { USER_CHATS } from "@/constants";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageSquare, Circle } from "lucide-react";

const UserChats = () => {
  return (
    <div className="w-full pb-24 pt-16 relative">
      <div className="container mx-auto max-w-5xl px-4">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Chat <span className="text-primary">Contacts</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See who you’ve been chatting with recently.
          </p>
        </div>

        {/* CHAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {USER_CHATS.map((chat) => (
            <Card
              key={chat.id}
              className="bg-card/90 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors"
            >
              <CardHeader className="flex flex-row items-center justify-between px-5 pt-4 pb-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden border border-border">
                    <img
                      src={chat.profilePic}
                      alt={`${chat.name}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{chat.name}</p>
                    <p className="text-sm text-muted-foreground">{chat.lastMessage}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Circle
                    className={`w-3 h-3 ${
                      chat.status === "online"
                        ? "text-green-500"
                        : chat.status === "away"
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}
                    fill="currentColor"
                  />
                  <span>{chat.timestamp}</span>
                </div>
              </CardHeader>

              <CardContent className="px-5 pb-4">
                <button className="text-sm text-primary flex items-center gap-1 hover:underline">
                  <MessageSquare className="h-4 w-4" />
                  Open Chat
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserChats;
