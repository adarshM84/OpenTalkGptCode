pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-2.14.305-dist/pdf.worker.js';
localStorage.setItem("uploadPdf", false);

window.onload = () => {
    loadNav("ragNav");
    setDefault("stopChat", "false", true);
    setDefault("chatInProcess", "false", true);

    const ollamaRagModal = localStorage.getItem("ollamaRagModal");

    if (!ollamaRagModal || ollamaRagModal == "undefined" || ollamaRagModal == "null" || ollamaRagModal.toLocaleLowerCase() == "select modal") {
        showSweetAlert("error", "Oops...", "Please select or download <strong>rag modal</strong> from home");
    }

    document.getElementById("askBtn").addEventListener("click", async () => {
        findAns();
    });

    document.getElementById("stopChat").addEventListener("click", async () => {
        toggleChat(false)
    });

    document.getElementById("userQuestion").addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            findAns();
        }
    });

    if (localStorage.getItem("ollamaModal") && localStorage.getItem("ollamaModal") !== null && localStorage.getItem("ollamaModal").length != 0) {
        document.getElementById("modalInfo").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shield-check" viewBox="0 0 16 16">
        <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
        <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
      </svg> `+ localStorage.getItem("ollamaModal");
    }
}

let docs = []; // Store {text, embedding, metadata}

async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let pages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(" ");
        pages.push(text);
    }
    return pages.join("\n");
}

function chunkText(text, chunkSize = 800, overlap = 200) {
    const chunks = [];
    let i = 0;
    while (i < text.length) {
        chunks.push(text.slice(i, i + chunkSize));
        i += (chunkSize - overlap);
    }
    return chunks;
}


async function getEmbedding(text) {
    
    var apiUrl = "http://localhost:11434";
    apiUrl = `${localStorage.getItem("requestProtocol")}://${localStorage.getItem("hostAddress")}:${localStorage.getItem("ollamaPort")}/api/embeddings`;
    if (localStorage.getItem("settingsType") == "basic") apiUrl = localStorage.getItem("modalConnectionUri") + "/api/embeddings";

    const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: localStorage.getItem("ollamaRagModal"), prompt: text })
    });
    const data = await res.json();
    return data.embedding;
}

async function processPDF(file) {
    const text = await extractTextFromPDF(file);
    const chunks = chunkText(text);
    for (let i = 0; i < chunks.length; i++) {
        const emb = await getEmbedding(chunks[i]);
        docs.push({
            text: chunks[i],
            embedding: emb,
            metadata: { fileName: file.name, chunkId: i + 1 }
        });
    }
}

function cosineSim(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (magA * magB);
}

async function findRelevantChunks(question, topK = 3) {
    const qEmbed = await getEmbedding(question);
    const scores = docs.map(doc => ({
        score: cosineSim(qEmbed, doc.embedding),
        text: doc.text,
        meta: doc.metadata
    }));
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, topK);
}

async function askOllama(question, contextChunks, lastDivid = false) {
    const chat = document.getElementById("chat");
    var tmpDiv = document.createElement("div");
    tmpDiv.class = "bot";

    const contextText = contextChunks.map(c => `(${c.meta.fileName}, chunk ${c.meta.chunkId}): ${c.text}`).join("\n\n");
    const prompt = `
You are an expert assistant. Use ONLY the context provided to answer the question.
If the answer is not in the context, say "I cannot find the answer in the document."

Context:
${contextText}

Question: ${question}
Answer:
    `;

    var apiUrl = "http://localhost:11434";
    apiUrl = `${localStorage.getItem("requestProtocol")}://${localStorage.getItem("hostAddress")}:${localStorage.getItem("ollamaPort")}/api/generate`;
    if (localStorage.getItem("settingsType") == "basic") apiUrl = localStorage.getItem("modalConnectionUri") + "/api/generate";

    const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: localStorage.getItem("ollamaModal"), prompt: prompt })
    });

    const reader = res.body.getReader();
    let result = "";
    const decoder = new TextDecoder();
    chat.appendChild(tmpDiv);

    while (true) {
        const { done, value } = await reader.read();
        if (localStorage.getItem("stopChat") == "true") {
            toggleChat(false);
            console.log("Chat stopped by user.");
            return; // Stop further execution if stopDownload is true
        }
        if (done) {
            toggleChat(false);
            break;
        }

        const lines = decoder.decode(value).split("\n").filter(l => l.trim() !== "");
        for (const line of lines) {
            try {
                const json = JSON.parse(line);
                // showElement("ragLoading", false);
                if (json.response) {
                    result = json.response;
                    // tmpDiv.innerHTML = `<div class="bot">Bot: ${parseText(result)}</div>`;
                    addMessage("", parseText(result), "answer", lastDivid, "chat");
                }
            } catch { }
        }
    }

    return result.trim();
}

// Event Listeners
document.getElementById("pdfInput").addEventListener("change", async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    document.getElementById("status").textContent = "Processing PDFs...";
    for (let file of files) {
        await processPDF(file);
    }
    localStorage.setItem("uploadPdf", true);
    document.getElementById("status").textContent = `✅ ${files.length} PDF(s) processed with ${docs.length} chunks.`;
});

function toggleChat(start) {
    if (start) {
        // Chat Start
        showElement("stopChat", true);
        showElement("askBtn", false);
        localStorage.setItem("stopChat", "false");
        localStorage.setItem("chatInProcess", "true");
    } else {
        // Chat Stop
        showElement("stopChat", false);
        showElement("askBtn", true);
        localStorage.setItem("stopChat", "true");
        localStorage.setItem("chatInProcess", "false");
    }
}


async function findAns(question = "", ansDivId = false) {
    const userQuery = document.getElementById("userQuestion").value;
    var isRetype = (ansDivId != false);
    if (!isRetype && !userQuery) return;

    document.getElementById("userQuestion").value = "";
    if (localStorage.getItem("uploadPdf") != 'true') {
        showSweetAlert("error", "Oops...", "Please upload pdf first.")
        return;
    }

    // showElement("ragLoading", true);

    if (localStorage.getItem("chatInProcess") == "true") {
        showSweetAlert("error", "Opps...", "Chat is in process.Please stop the chat or wait till it complete.");
        return;
    }
    if (localStorage.getItem("qId") == 'NaN' || !localStorage.getItem("qId")) {
        localStorage.setItem("qId", 1)
    }
    console.log(document.getElementById("stopChat"))
    toggleChat(true)

    const chat = document.getElementById("chat");
    // chat.innerHTML += `<div class="user">You: ${q}</div>`;
    var lastDivid = 0;


    if (isRetype) lastDivid = ansDivId;
    else lastDivid = addMessage(userQuery, "", "question", false, false, "chat");

    const relevant = await findRelevantChunks(userQuery);
    const answer = await askOllama(userQuery, relevant, lastDivid);

    // botAnEl.innerHTML = '<p class="card-text placeholder-glow coustomSpinner"> <span class="placeholder col-7"></span> <span class="placeholder col-4"></span> <span class="placeholder col-4"></span> <span class="placeholder col-6"></span> <span class="placeholder col-8"></span> </p> </div> ';
    scrollDown("chatMain")
}


//Re Answer Function
function reAnswer(divId) {
    if (!divId && divId.trim().length == 0) {
        return;
    }
    if (divId.includes("reAnswer")) divId = divId.substr(8);

    console.log("Div to answer", divId)

    var qDivId = "userQuestion" + divId;
    var ansDivId = "botResponse" + divId;

    if (localStorage.getItem("chatInProcess") == "true") {
        showSweetAlert("warning", "Opps...", "Chat is in process.Please stop the chat or wait till it complete.");
        return;
    }
    if (localStorage.getItem("qId") == 'NaN' || !localStorage.getItem("qId")) {
        localStorage.setItem("qId", 1)
    }
    var userQuery = document.getElementById(qDivId).textContent.trim();
    if (userQuery.length == 0) {
        showSweetAlert("success", "", "Please enter question");
        return
    }
    if (!localStorage.getItem("ollamaModal") || localStorage.getItem("ollamaModal") == "null" || localStorage.getItem("ollamaModal").length == 0) {
        showSweetAlert("success", "", "Please select or download any modal.");
        return;
    }

    document.getElementById(ansDivId).innerHTML = '<p class="card-text placeholder-glow coustomSpinner"> <span class="placeholder col-7"></span> <span class="placeholder col-4"></span> <span class="placeholder col-4"></span> <span class="placeholder col-6"></span> <span class="placeholder col-8"></span> </p> </div> ';

    findAns(userQuery, divId)
}