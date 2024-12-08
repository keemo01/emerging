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

        // Chat item structure
        li.innerHTML = `
            <div class="chat-preview">
                <span class="chat-title">${previewName}</span>
                <span class="chat-timestamp">${timestamp}</span>
            </div>
            <div class="chat-actions">
                <button class="rename-btn">Rename</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // Switch to the clicked chat when selected
        li.querySelector('.chat-preview').addEventListener('click', () => switchToChat(chat.id));

        // Add event listener for renaming
        li.querySelector('.rename-btn').addEventListener('click', () => renameChat(chat.id));

        // Add event listener for deleting
        li.querySelector('.delete-btn').addEventListener('click', () => deleteChat(chat.id));

        chatHistoryList.appendChild(li);
    });
}

// Renames a chat tab
function renameChat(chatId) {
    const chat = context.chats.find(c => c.id === chatId);
    if (!chat) return;

    // Prompt user for new chat name
    const newName = prompt('Enter a new name for this chat:', chat.userName || 'New Chat');
    if (newName && newName.trim().length > 0) {
        chat.userName = newName.trim();
        updateChatHistoryList();
    }
}

// Deletes a chat tab
function deleteChat(chatId) {
    if (confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
        // Remove the chat from context
        context.chats = context.chats.filter(chat => chat.id !== chatId);

        // Reset current chat if the deleted chat was active
        if (context.currentChatId === chatId) {
            context.currentChatId = context.chats.length > 0 ? context.chats[0].id : null;
            document.getElementById('chat-history').innerHTML = '';
        }

        // Update chat list
        updateChatHistoryList();
    }
}


// Switches to the selected chat and reloads the conversation history
function switchToChat(chatId) {
    context.currentChatId = chatId;
    const chat = context.chats.find(c => c.id === chatId);
    
    // Updates the UI and reloads the chat history
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

// Handles the user input and generates a resaponse based on that
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

    // Generates a response based on the user input
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

// Creates a response based on the input and mood of the user.
function getElizaResponse(input, chat) {
    // Normalize input for easier pattern matching
    const normalizedInput = input.toLowerCase().trim();

    // Request the user's name if you don't already know it.
    if (!chat.userName) {
        chat.userName = extractName(input) || "friend";
        return `Hello! I'm ELIZA. It's wonderful to meet you, ${chat.userName}! What would you like to talk about today?`;
    }

    // Using additional replies in the response patterns
    const responsePatterns = [
        {
            patterns: [/\b(sad|depressed|unhappy|down|low|crying|miserable|heartbroken)\b/],
            responses: [
                `I'm really sorry you're feeling down, ${chat.userName}. Can you tell me more about what's troubling you?`,
                `It sounds like you're struggling right now, ${chat.userName}. I'm here to listen if you want to share.`,
                `Feeling sad can be overwhelming. Talking about it might help. What’s on your mind?`
            ]
        },
        {
            patterns: [/\b(happy|good|excited|great|wonderful|joyful|delighted|thrilled)\b/],
            responses: [
                `I'm so glad to hear that you're feeling happy, ${chat.userName}! What's been making your day so great?`,
                `Your positivity is inspiring, ${chat.userName}. Want to tell me more about it?`,
                `Happiness is a gift. What’s been bringing you joy lately, ${chat.userName}?`
            ]
        },
        {
            patterns: [/\b(stress|anxious|nervous|worried|overwhelmed|pressured|panicking)\b/],
            responses: [
                `Feeling stressed can be difficult to handle, ${chat.userName}. What's been on your mind?`,
                `Stress can take a toll on anyone. Would you like to talk about what's causing it?`,
                `Let's take it one step at a time, ${chat.userName}. What's been making you feel this way?`
            ]
        },
        {
            patterns: [/\b(help|advice|guidance|support|assist|aid)\b/],
            responses: [
                `I'm here for you, ${chat.userName}. What kind of help do you need?`,
                `Support is important, and I'm here to provide it. Tell me more about what you're looking for.`,
                `Reaching out for help is a strong first step. What’s on your mind, ${chat.userName}?`
            ]
        },
        {
            patterns: [/\b(goals|dreams|aspirations|future|plans|ambitions)\b/],
            responses: [
                `Dreams are powerful, ${chat.userName}. What goals are you working toward right now?`,
                `Talking about goals can be exciting! What’s your biggest aspiration at the moment, ${chat.userName}?`,
                `Your future is full of possibilities, ${chat.userName}. What plans are you most excited about?`
            ]
        },
        {
            patterns: [/\b(relationships|friends|family|love|partner|bond|connection)\b/],
            responses: [
                `Relationships can be meaningful and complex, ${chat.userName}. Would you like to share more about yours?`,
                `Connecting with others is so important. How are your relationships these days, ${chat.userName}?`,
                `It sounds like relationships are on your mind. What thoughts would you like to share about them, ${chat.userName}?`
            ]
        }
    ];

    // Check for specific pattern matches
    for (const pattern of responsePatterns) {
        if (pattern.patterns.some(p => p.test(normalizedInput))) {
            return pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
        }
    }

    // Enhanced fallback responses
    const fallbackResponses = [
        `That's interesting, ${chat.userName}. Could you tell me more?`,
        `I'm listening, ${chat.userName}. What else is on your mind?`,
        `Can you elaborate on that, ${chat.userName}?`,
        `Your perspective is intriguing, ${chat.userName}. Please continue.`,
        `I’m here for you, ${chat.userName}. What else would you like to talk about?`
    ];

   // In the event that no pattern match, return a random fallback response.
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}


// Helper function to extract name (can be kept the same as in the original code)
function extractName(input) {
    const nameMatch = input.match(/(?:I'm|I am|name is|call me|my name is) (\w+)/i);
    return nameMatch ? nameMatch[1] : null;
}

// Adds a message to the chat history
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
