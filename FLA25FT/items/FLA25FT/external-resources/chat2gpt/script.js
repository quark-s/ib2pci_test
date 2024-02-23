const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let model;

// TODO: Cache the tensorflow-modell for offline use (look, for instance, here: https://levelup.gitconnected.com/use-tensorflow-js-models-in-offline-applications-a7b5b0c67d4)
// 
//  * Source: https://www.kaggle.com/models/tensorflow/universal-sentence-encoder/frameworks/tfJs/variations/lite/versions/1?tfhub-redirect=true

async function loadModel() {

    sendTraceMessage("Chat2GPT-ModelLoaded", "Started");
	console.log("DEBUG: Model loading.");
	
    model = await use.load({modelUrl: './model/model.json', vocabUrl: './model/vocab.json'});

    sendTraceMessage("Chat2GPT-ModelLoaded", "Completed");
    console.log("DEBUG: Model loaded.");

    const sentences = ['Wie spät ist es.','What time is it?'];
    const modelTest = await model.embed(sentences);     
    
    sendTraceMessage("Chat2GPT-ModelCheck",JSON.stringify(modelTest));
    console.log("DEBUG: Model checked." + JSON.stringify(modelTest));
    	 
	welcome();
    
}

function welcome (){
	const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", "incoming");
    chatDiv.innerHTML = "<div>How can I help you?<br/>You have <b>three</b> free requests!</div>";
    
 	const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/chatbot.jpg" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                </div>`;
    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(chatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

loadModel();

let userText = null;

const loadDataFromLocalstorage = () => {
    // Load saved chats and theme from local storage and apply/add on the page
    const themeColor = localStorage.getItem("themeColor");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
                            <h1>Chat 2 GPT</h1>
                            <p>Start a conversation and show<br/>how would you use the power of AI<br/>to answer the writing task.</p>
                        </div>`

    chatContainer.innerHTML = localStorage.getItem("chatHistory") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to bottom of the chat container
}

const createChatElement = (content, className) => {
    // Create new div and apply chat, specified class and set html content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv; // Return the created chat div
}
 

const getChatResponse = async (incomingChatDiv) => {

    const pElement = document.createElement("p");
     
    try {
        let taskText = tasks["B"];
        let responseArray = GptResponses["B"];
        if(userDefId == "CHAT2GPT_A"){
            taskText = tasks["A"];
            responseArray = GptResponses["A"];
        }
        taskText = taskText.replace(/(\r\n|\n|\r|<br\/>|<i>|<\/i>|<b>|<\/b>|\s)/gm, "").toLowerCase().trim();
        let userTextCompare = userText.replace(/(\r\n|\n|\r|<br\/>|<i>|<\/i>|<b>|<\/b>|\s)/gm, "").toLowerCase().trim();

 		if (/^[A-Za-z]+$/.test(userText)){ 

			let response = "Could you please provide more details or context for your request related to " + userText + "? This will help me assist you more effectively.";
            pElement.textContent = response;
            
            sendTraceMessage("Chat2GPT-SingleWordResponse", response);
	        console.log("DEBUG: Chat2GPT-SingleWordResponse: " + response);     

        }

        else if (
                userTextCompare.includes(taskText)
            ){
                pElement.textContent = responseArray[Math.floor(Math.random() * responseArray.length)]
        }

        else {    

	        // Compare user input with pre-defined prompts and select the most similar prompt
	
	        const embeddings = await model.embed([userText, ...prompts]);
	
	        let userEmbedding = embeddings.slice([0, 0], [1]);
	        console.log(userEmbedding);
	
	        let similarityScores = [];
	
	        let minScore = 0;
	        let minIndex = 0;
	
	        for (let i = 1; i < prompts.length + 1; i++) {
	            let sentenceEmbedding = embeddings.slice([i, 0], [1]);
	            let score = tf.metrics.cosineProximity(userEmbedding, sentenceEmbedding).dataSync()[0];
	            if (score < minScore){
		            minScore = score;
		            minIndex = i-1;
	            }   
	            similarityScores.push({ sentence: prompts[i - 1], score: score });            
	        }
			
			sendTraceMessage("Chat2GPT-SimilarityScore", minScore);  
			console.log("DEBUG: Similarity Score: " + minScore);
	        sendTraceMessage("Chat2GPT-MostSimilarPrompt", prompts[minIndex]);
	        console.log("DEBUG: Prompt most similar to: " + prompts[minIndex]);
	
	        pElement.textContent =  responses[minIndex];

        }

      
    } catch (error) { // Add error class to the paragraph element and set error text
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
        sendTraceMessage("Chat2GPT-Error",JSON.stringify(error));	
    }

    // Remove the typing animation, append the paragraph element and save the chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("chatHistory", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

const copyResponse = (copyBtn) => {
    // Copy the text content of the response to the clipboard
    const reponseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(reponseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
    
    sendTraceMessage("Chat2GPT-CopyButton", reponseTextElement);
	console.log("DEBUG: Chat2GPT-CopyButton: " + reponseTextElement);
}

const showTypingAnimation = () => {
    // Display the typing animation and call the getChatResponse function
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/chatbot.jpg" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;
    // Create an incoming chat div with typing animation and append it to chat container
    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

function findLongestMatch(str1, str2) {
    let maxLen = 0;
    let dp = Array(str1.length + 1).fill().map(() => Array(str2.length + 1).fill(0));

    for (let i = 1; i <= str1.length; i++) {
        for (let j = 1; j <= str2.length; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                maxLen = Math.max(maxLen, dp[i][j]);
            }
        }
    }
    return maxLen;
}


const handleOutgoingChat = () => {
 
 	sendTraceMessage("Chat2GPT-RequestPrompt",JSON.stringify(chatInput.value));
 	
    userText = chatInput.value.trim();
 	userText = DOMPurify.sanitize(userText);
 	userText = userText.replace('"', '').replace("'", "");
    
    if(!userText) {   
    	sendTraceMessage("Chat2GPT-RejectPrompt",JSON.stringify(userText));
    	return;
    } else {
 		sendTraceMessage("Chat2GPT-AcceptPrompt",JSON.stringify(userText));
 		postGetVariable("V_StudentResponse_Chat");   
    }
	
}

window.addEventListener("message", (event) => {

	const data = JSON.parse(event.data);
	const writtenText = data.result.value;
	
	
	sendTraceMessage("Chat2GPT-CurrentStudentText",JSON.stringify(writtenText));
	
	const lss = findLongestMatch(writtenText,userText);
	
	sendTraceMessage("Chat2GPT-LongestSubString",JSON.stringify(lss));	
	
	console.log("DEBUG: Prompt: " + userText)
	console.log("DEBUG: Written Text: " + writtenText)
	console.log("DEBUG: Longest substring: ", lss);
	 
     // Clear the input field and reset its height
    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/user.jpg" alt="user-img">
                        <p>${userText}</p>
                    </div>
                </div>`;

    // Create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
});



deleteButton.addEventListener("click", () => {
    // Remove the chats from local storage and call loadDataFromLocalstorage function
    if(confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("chatHistory");
        loadDataFromLocalstorage();
        welcome();
    }
});

themeButton.addEventListener("click", () => {
    // Toggle body's class for the theme mode and save the updated theme to the local storage 
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

var currentPasteEvent = {};

chatInput.addEventListener("input", () => {   
    // Adjust the height of the input field dynamically based on its content
    chatInput.style.height =  `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {

    var charLower = String.fromCharCode(e.which).toLowerCase();

    // If the Enter key is pressed without Shift 
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleOutgoingChat();
    }
    else if((e.ctrlKey || e.metaKey) && charLower == "v"){
        currentPasteEvent = {"cursorPosStart": chatInput.selectionStart};
    }
});

chatInput.addEventListener("keyup", (e) => {
    var charLower = String.fromCharCode(e.which).toLowerCase();
    if((e.ctrlKey || e.metaKey) && charLower == "v"){
        let traceMessage = JSON.stringify({...currentPasteEvent, "event": "chatInputPaste", "content": e.target.value, "cursorPosEnd": chatInput.selectionStart});
        currentPasteEvent = {};
        sendTraceMessage("chatInputPaste", traceMessage);
        console.log('CTRL +  V', traceMessage);
    }    
})

loadDataFromLocalstorage();
sendButton.addEventListener("click", handleOutgoingChat);

document.addEventListener('contextmenu', event => {
    event.preventDefault();
    console.log("Right Click");
});

function getQueryVariable(variable)
{
    const parsedUrl = new URL(window.location.href);
    return parsedUrl.searchParams.get(variable);
}
  
var indexPath = getQueryVariable('indexPath');
var userDefIdPath = getQueryVariable('userDefIdPath');
var traceCount = 0;


function postGetVariable(variableName, callId)
{
	var callId = "ID" + new Date().toLocaleString();
	 
	var pass_data = {
            indexPath: indexPath,
            userDefIdPath: userDefIdPath,
            getVariable: {  variableName: variableName,   callId: callId},
            traceCount : traceCount++
        };

    window.parent.postMessage(JSON.stringify(pass_data), '*');	
     
}

function getQueryVariable(variable)
{
    const parsedUrl = new URL(window.location.href);
    return parsedUrl.searchParams.get(variable);
}

function sendTraceMessage(type, message){

	var pass_data = {
	     indexPath: indexPath,
	     userDefIdPath: userDefIdPath, 
	     traceMessage: message,
         traceType: type,	     
	     traceCount : traceCount++
	 };
	 window.parent.postMessage(JSON.stringify(pass_data), '*');	
	 
}