import React, { useState, useEffect } from 'react';
import './ChatWindow.css';

// 创建组件函数
function ChatWindow() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // 组件加载时初始化聊天
        fetchInitialMessages();
    }, []);

    const fetchInitialMessages = async () => {
        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: '你好' }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Initial message response:', data);
            setMessages([
                { text: '你好', sender: 'user' },
                { text: data.response, sender: 'bot' },
            ]);
        } catch (error) {
            console.error('Error fetching initial messages:', error);
            setMessages([{ text: '连接服务器失败，请稍后再试。', sender: 'bot' }]);
        }
    };

    // 发送消息
    const handleSend = async () => {
        if (input.trim()) {
            setIsLoading(true);
            setMessages(prev => [...prev, { text: input, sender: 'user' }]);
            setInput('');

            try {
                const response = await fetch('http://localhost:5000/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: input }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Bot response:', data);
                setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
            } catch (error) {
                console.error('Error sending message:', error);
                setMessages(prev => [...prev, { text: '对不起，我遇到了一些问题。', sender: 'bot' }]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
                {isLoading && <div className="message bot">正在输入...</div>}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                    placeholder="输入消息..."
                />
                <button onClick={handleSend} disabled={isLoading}>发送</button>
            </div>
        </div>
    );
}

export default ChatWindow;

