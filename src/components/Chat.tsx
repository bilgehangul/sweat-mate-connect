
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, Paperclip, Smile } from 'lucide-react';

interface ChatProps {
  buddy: {
    id: number;
    name: string;
    avatar: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const Chat = ({ buddy, isOpen, onClose }: ChatProps) => {
  const [message, setMessage] = useState('');
  const [messages] = useState([
    {
      id: 1,
      sender: 'them',
      text: 'Hey! Ready for our workout session tomorrow?',
      time: '2:30 PM',
      avatar: buddy.avatar
    },
    {
      id: 2,
      sender: 'me',
      text: 'Absolutely! What time should we meet?',
      time: '2:32 PM',
      avatar: '👨‍💼'
    },
    {
      id: 3,
      sender: 'them',
      text: 'How about 6 PM at the main entrance?',
      time: '2:35 PM',
      avatar: buddy.avatar
    },
    {
      id: 4,
      sender: 'me',
      text: 'Perfect! See you there 💪',
      time: '2:36 PM',
      avatar: '👨‍💼'
    }
  ]);

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center text-lg">
              {buddy.avatar}
            </div>
            <div>
              <h3 className="font-semibold">{buddy.name}</h3>
              <p className="text-sm text-muted-foreground">Online</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-2 max-w-[70%] ${msg.sender === 'me' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className="w-8 h-8 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center text-sm">
                  {msg.avatar}
                </div>
                <div>
                  <div className={`p-3 rounded-lg ${
                    msg.sender === 'me' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button variant="outline" size="sm">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Smile className="w-4 h-4" />
            </Button>
            <Button onClick={handleSend} size="sm" className="gym-gradient text-white">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
