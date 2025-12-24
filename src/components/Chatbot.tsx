import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const KNOWLEDGE_BASE = [
  { keywords: ['location', 'where', 'address', 'located', 'find you'], answer: "We are located in Kinoo, Gaitumbi. You can find us on Google Maps!" },
  { keywords: ['contact', 'phone', 'email', 'call', 'number'], answer: "You can call us at 0720757185 or email info@kmci.org." },
  { keywords: ['service', 'time', 'when', 'sunday', 'schedule'], answer: "Sunday Services start at 10:00 AM. We also have Mid-week services on Wednesdays at 6:30 PM." },
  { keywords: ['donate', 'give', 'offering', 'tithe', 'mpesa', 'paybill'], answer: "You can give online via our Donate page or use M-Pesa. Click the 'Give Online' button in the menu for details." },
  { keywords: ['pastor', 'leader', 'who', 'apostle'], answer: "Our ministry is led by our dedicated Apostle and pastoral team." },
  { keywords: ['mission', 'vision', 'about'], answer: "Our mission is to advance God's Kingdom globally through evangelism, discipleship, and humanitarian outreach." },
  { keywords: ['ministry', 'ministries', 'youth', 'women', 'men'], answer: "We have various ministries including Men's, Women's, Youth, and Children's church. Check the Ministries page for more!" },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([
    { text: "Hello! I'm the KMCI Assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMsg = { text: input, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Process response
    setTimeout(() => {
      const lowerInput = userMsg.text.toLowerCase();
      const match = KNOWLEDGE_BASE.find(item => 
        item.keywords.some(keyword => lowerInput.includes(keyword))
      );

      const responseText = match 
        ? match.answer 
        : "I'm not sure about that. Please contact us directly at 0720757185 for more specific inquiries.";

      setMessages(prev => [...prev, { text: responseText, isUser: false }]);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-amber-500 text-white p-4 rounded-full shadow-2xl hover:bg-amber-600 transition-all ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[500px]"
          >
            <div className="bg-gray-900 p-4 flex justify-between items-center text-white">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="font-bold">KMCI Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4 h-80">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isUser ? 'bg-amber-500 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button type="submit" className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
