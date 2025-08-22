import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  ArrowLeft, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Search,
  Circle
} from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'renter' | 'admin';
};

interface ChatPageProps {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const mockConversations = [
  {
    id: '1',
    participant: {
      id: '2',
      name: 'Suresh Patil',
      avatar: 'SP',
      status: 'online',
      location: 'Baramati, Pune'
    },
    lastMessage: {
      text: 'The tractor is available from Monday. When do you need it?',
      timestamp: '2024-01-24T10:30:00',
      sender: '2',
      read: false
    },
    listing: {
      title: 'John Deere 5310 Tractor',
      price: 1500
    }
  },
  {
    id: '2',
    participant: {
      id: '3',
      name: 'Amit Sharma',
      avatar: 'AS',
      status: 'offline',
      location: 'Shirur, Pune'
    },
    lastMessage: {
      text: 'Thank you for renting the rotary tiller. How was the experience?',
      timestamp: '2024-01-23T16:45:00',
      sender: '3',
      read: true
    },
    listing: {
      title: 'Rotary Tiller - 7ft',
      price: 800
    }
  },
  {
    id: '3',
    participant: {
      id: '4',
      name: 'Pradeep Singh',
      avatar: 'PS',
      status: 'online',
      location: 'Indapur, Pune'
    },
    lastMessage: {
      text: 'Sure, I can deliver the harvester to your location',
      timestamp: '2024-01-22T14:20:00',
      sender: '1',
      read: true
    },
    listing: {
      title: 'Combine Harvester',
      price: 3000
    }
  }
];

const mockMessages = [
  {
    id: '1',
    text: 'Hi, I\'m interested in renting your John Deere tractor',
    sender: '1',
    timestamp: '2024-01-24T09:00:00'
  },
  {
    id: '2',
    text: 'Hello! The tractor is in excellent condition. When do you need it?',
    sender: '2',
    timestamp: '2024-01-24T09:15:00'
  },
  {
    id: '3',
    text: 'I need it for this weekend, Saturday and Sunday. Is it available?',
    sender: '1',
    timestamp: '2024-01-24T09:30:00'
  },
  {
    id: '4',
    text: 'Yes, it\'s available. The rate is ₹1500 per day. Would you like to book it?',
    sender: '2',
    timestamp: '2024-01-24T09:45:00'
  },
  {
    id: '5',
    text: 'That sounds good. Can you deliver it to my farm?',
    sender: '1',
    timestamp: '2024-01-24T10:00:00'
  },
  {
    id: '6',
    text: 'I can deliver within 10km for ₹200 extra. What\'s your location?',
    sender: '2',
    timestamp: '2024-01-24T10:15:00'
  },
  {
    id: '7',
    text: 'I\'m in Baramati too, near the market. That should be fine.',
    sender: '1',
    timestamp: '2024-01-24T10:25:00'
  },
  {
    id: '8',
    text: 'Perfect! The tractor is available from Monday. When do you need it?',
    sender: '2',
    timestamp: '2024-01-24T10:30:00'
  }
];

export function ChatPage({ user, onNavigate }: ChatPageProps) {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatTime(timestamp);
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredConversations = mockConversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-background flex">
      {/* Conversations List */}
      <div className="w-80 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => onNavigate('home')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Messages
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConversation.id === conversation.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{conversation.participant.avatar}</AvatarFallback>
                    </Avatar>
                    {conversation.participant.status === 'online' && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium truncate">{conversation.participant.name}</h4>
                      <span className="text-xs opacity-75">
                        {formatLastMessageTime(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm opacity-75 mb-1">{conversation.participant.location}</p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm opacity-75 truncate flex-1">
                        {conversation.lastMessage.text}
                      </p>
                      {!conversation.lastMessage.read && conversation.lastMessage.sender !== user.id && (
                        <Badge variant="destructive" className="ml-2 h-2 w-2 p-0 rounded-full" />
                      )}
                    </div>
                    
                    <p className="text-xs opacity-60 mt-1">
                      Re: {conversation.listing.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{selectedConversation.participant.avatar}</AvatarFallback>
                  </Avatar>
                  {selectedConversation.participant.status === 'online' && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedConversation.participant.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2">
                    <Circle className={`h-2 w-2 fill-current ${
                      selectedConversation.participant.status === 'online' ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <span>{selectedConversation.participant.status}</span>
                    <span>•</span>
                    <span>{selectedConversation.participant.location}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Listing Context */}
            <div className="p-3 bg-muted/50 border-b">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{selectedConversation.listing.title}</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{selectedConversation.listing.price}/day
                  </p>
                </div>
                <Button size="sm">View Listing</Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === user.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-sm">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
