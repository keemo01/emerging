// Stores the current chat session and all previous chat sessions
let context = {
    currentChatId: null,
    chats: [], // Array to store all chat sessions
};

document.addEventListener('DOMContentLoaded', function() {
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const newChatBtn = document.getElementById('new-chat-btn');

    // Event listeners for send button, enter key press, and new chat button
    if (sendBtn) sendBtn.addEventListener('click', processUserInput);
    if (userInput) userInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') processUserInput();
    });
    if (newChatBtn) newChatBtn.addEventListener('click', startNewChat);

    // Start first chat if no chats exist
    if (context.chats.length === 0) {
        startNewChat();
    } else {
        loadChatHistory();
    }
});

// Creates a new chat with a unique ID and initial settings
function createNewChat() {
    const chatId = Date.now().toString(); // Unique ID for each chat
    const newChat = {
        id: chatId,
        userName: '',  // User name will be filled after initial conversation
        userMood: '',  // Mood is stored for future context
        conversationHistory: [], // Store all messages for this chat
        timestamp: new Date()  // Timestamp for sorting chats by date
    };
    context.chats.push(newChat);  // Add new chat to the chat history
    return chatId;
}

// Starts a new chat and asks the user for their name
function startNewChat() {
    const chatId = createNewChat();
    context.currentChatId = chatId;
    
    // Clears the previous chat history in the UI
    document.getElementById('chat-history').innerHTML = '';
    
    // Update the sidebar to reflect the new chat
    updateChatHistoryList();
    
    // Start conversation by asking the user's name
    appendMessage('eliza', "Hello! I'm ELIZA nice to meet you. What's your name?");
}

// Updates the chat history list in the sidebar
function updateChatHistoryList() {
    const chatHistoryList = document.getElementById('chat-history-list');
    chatHistoryList.innerHTML = '';
    
    // Sort chats by timestamp and display in the sidebar
    context.chats.sort((a, b) => b.timestamp - a.timestamp).forEach(chat => {
        const li = document.createElement('li');
        li.classList.add('chat-history-item');
        if (chat.id === context.currentChatId) {
            li.classList.add('active');
        }
        
        // Create chat preview text
        const previewName = chat.userName || 'New Chat';
        const timestamp = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(new Date(chat.timestamp));
        
        li.innerHTML = `
            <div class="chat-preview">
                <span class="chat-title">${previewName}</span>
                <span class="chat-timestamp">${timestamp}</span>
            </div>
        `;
        
        // Switch to the clicked chat when selected
        li.addEventListener('click', () => switchToChat(chat.id));
        chatHistoryList.appendChild(li);
    });
}

// Switches to the selected chat and reloads the conversation history
function switchToChat(chatId) {
    context.currentChatId = chatId;
    const chat = context.chats.find(c => c.id === chatId);
    
    // Updates UI and reloads the chat history
    document.getElementById('chat-history').innerHTML = '';
    updateChatHistoryList();
    
    // Display all messages from the selected chat
    chat.conversationHistory.forEach(msg => {
        appendMessage(msg.role, msg.content);
    });
}

// Retrieves the current active chat object
function getCurrentChat() {
    return context.chats.find(chat => chat.id === context.currentChatId);
}

// Handles the processing of user input and generates a response
function processUserInput() {
    const userInput = document.getElementById('user-input');
    const chatHistory = document.getElementById('chat-history');
    if (!userInput || !chatHistory) return;

    const userMessage = userInput.value.trim();
    if (userMessage === "" || userMessage.length < 2) return;

    const currentChat = getCurrentChat();
    appendMessage('user', userMessage);

    // Save user message in conversation history
    currentChat.conversationHistory.push({role: 'user', content: userMessage});

    // Generate ELIZA's response based on the user input
    const elizaResponse = getElizaResponse(userMessage, currentChat);

    setTimeout(() => {
        appendMessage('eliza', elizaResponse);
        currentChat.conversationHistory.push({role: 'eliza', content: elizaResponse});
        
        // Update timestamp after new message
        currentChat.timestamp = new Date();
        updateChatHistoryList();
    }, 500 + Math.random() * 1000);

    // Clear input field after sending message
    userInput.value = '';
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Generates a response based on the user's input and mood
function getElizaResponse(input, chat) {
    // If the user's name is not yet known, ask for it
    if (!chat.userName) {
        chat.userName = extractName(input); // Extract name from user input
        return `It's great to meet you, ${chat.userName}! I'm an AI assistant, and I'm here to listen and provide support. How are you feeling today?`;
    }

    // If the user's name is known, respond based on their mood
    if (input.match(/\b(sad|depressed|unhappy|down)\b/i)) {
        return `I'm really sorry to hear you're feeling this way, ${chat.userName}. Dealing with sadness or depression can be very difficult. What do you think is contributing to these feelings? I'm here to listen and provide support.`;
    } else if (input.match(/\b(happy|good|excited|great)\b/i)) {
        return `That's wonderful to hear, ${chat.userName}! I'm so glad you're feeling happy and positive. What's been the highlight of your day so far? I'd love to hear more about what's bringing you joy.`;
    } else if (input.match(/\b(stress|anxious|nervous)\b/i)) {
        return `It sounds like you're dealing with a lot of stress and anxiety, ${chat.userName}. I understand how challenging that can be. Is there something specific that's causing you to feel this way? I'm here to listen and provide any support or suggestions I can.`;
    } else if (input.match(/\b(help|advice|guidance)\b/i)) {
        return `I'm here to help in any way I can, ${chat.userName}. What kind of help or advice are you looking for? I'll do my best to provide a thoughtful and useful response.`;
    } else if (input.match(/\b(goals|dreams|aspirations)\b/i)) {
        return `That's a great question, ${chat.userName}. Exploring our goals and dreams can be really fulfilling. What are some of your key aspirations in life? I'd be happy to discuss ways you might work towards achieving them.`;
    } else if (input.match(/\b(relationships|friends|family)\b/i)) {
        return `Relationships can be a really important part of our lives, ${chat.userName}. How are the important relationships in your life going? I'm happy to listen and provide a supportive perspective if you'd like to discuss any challenges or joys you're experiencing.`;
    } else {
        return `I'm listening, ${chat.userName}. Please feel free to share what's on your mind. I'm here to provide a supportive and non-judgmental space for you to express yourself.`;
    }
}

// ADDS a message to the chat history
function appendMessage(sender, message) {
    const chatHistory = document.getElementById('chat-history');
    if (!chatHistory) return;

    const newMessage = document.createElement('div');
    newMessage.classList.add('message', sender);
    newMessage.textContent = message;

    chatHistory.appendChild(newMessage);
}

// Extracts the user's name from the input
function extractName(input) {
    const nameMatch = input.match(/(?:I'm|I am|name is|call me|my name is) (\w+)/i);
    return nameMatch ? nameMatch[1] : "there"; // Will use "there" instead if it cant find the name
}

// Extracts the user's mood from the input
function extractMood(input) {
    const moodMatch = input.match(/\b(happy|sad|good|bad|depressed|excited|nervous|anxious|stressed|great)\b/i);
    return moodMatch ? moodMatch[1] : "neutral"; // will use   "neutral" if mood is not found
}
