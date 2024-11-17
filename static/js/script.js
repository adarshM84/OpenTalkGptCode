// Set Function
const textarea = document.getElementById('userInput');

textarea.addEventListener('input', function () {
    this.style.height = 'auto';  // Reset height
    this.style.height = (this.scrollHeight <= 60 ? this.scrollHeight : 60) + 'px'; // Set height based on content or max-height
});

var rebuildRules = undefined;
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
    rebuildRules = async function (domain) {
        const domains = [domain];
        /** @type {chrome.declarativeNetRequest.Rule[]} */
        const rules = [{
            id: 1,
            condition: {
                requestDomains: domains
            },
            action: {
                type: 'modifyHeaders',
                requestHeaders: [{
                    header: 'origin',
                    operation: 'set',
                    value: `${localStorage.getItem("requestProtocol")}://${domain}`,
                }],
            },
        }];
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: rules.map(r => r.id),
            addRules: rules,
        });
    }
}

//On Load Settings
window.onload = () => {
    localStorage.setItem("isDownloaing", "false")
    if (localStorage.getItem("ollamaPort") == null || localStorage.getItem("ollamaPort").length == 0) localStorage.setItem("ollamaPort", "11434");
    if (localStorage.getItem("hostAddress") == null || localStorage.getItem("hostAddress").length == 0) localStorage.setItem("hostAddress", "localhost");
    if (localStorage.getItem("requestProtocol") == null || localStorage.getItem("requestProtocol").length == 0) localStorage.setItem("requestProtocol", "http");
    if (localStorage.getItem("settingsType") == null || localStorage.getItem("settingsType").length == 0) localStorage.setItem("settingsType", "basic");
    if (localStorage.getItem("useEmoji") == null || localStorage.getItem("useEmoji").length == 0) localStorage.setItem("useEmoji", "false");
    if (localStorage.getItem("modalConnectionUri") == null || localStorage.getItem("modalConnectionUri").length == 0) localStorage.setItem("modalConnectionUri", "http://localhost:11434");

    if (localStorage.getItem("ollamaModal") && localStorage.getItem("ollamaModal") !== null && localStorage.getItem("ollamaModal").length != 0) {
        document.getElementById("modalInfo").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shield-check" viewBox="0 0 16 16">
        <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
        <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
      </svg> `+ localStorage.getItem("ollamaModal");
    }
    localStorage.setItem("botDesc", null);
    if (localStorage.getItem("settingsType") == "basic") {
        localStorage.setItem("settingsType", "basic");
        showElement("basicSettings", true);
        showElement("advanceSettings", false);
    } else {
        localStorage.setItem("settingsType", "advance");
        showElement("basicSettings", false);
        showElement("advanceSettings", true);
    }
    document.getElementById("resetSettings").addEventListener("click", function () {
        if (confirm("Are you sure want to reset settings ?")) {
            localStorage.clear();
            alert("Setting reset done.Now page will reload to apply changes.")
            window.location.reload();
        }
    })
    setHostAddress(localStorage.getItem("hostAddress"));//To Do a post call for chat with ollama modals
    setModalSettingsList();
    setButtonFunctionCalls();//To Set Function Call On Buttons 
}
// Set Function End
var chatHistory = [];

function setHostAddress(hostName) {
    if (rebuildRules) {
        rebuildRules(hostName);
    }
    else if (hostName.length > 0) rebuildRules(hostName);
}

function setButtonFunctionCalls() {

    document.getElementById("setCustomBotRole").addEventListener("click", function (event) {
        setRole(event, true, "coustomInput")
    });
    document.getElementById("askQuestion").addEventListener("click", function (event) {
        getQAnswer();
    });
    document.getElementById("userInput").addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            getQAnswer();
        }
    });
    
    document.getElementById("stopChat").addEventListener("click", function (event) {
        localStorage.setItem("stopChat", "true");
    })

    document.getElementById("opneIntroIcon").addEventListener("click", function (event) {
        openModal('openModalBtn')
    });
    document.getElementById("botImage").addEventListener("click", function (event) {
        openModal('openModalBtn')
    });
    document.getElementById("modalList").addEventListener("click", function (event) {
        setSettings(event);
    })

    setFunctionCallByClass("oppenSettingsModal", "click", openModal, "openSettingModalBtn");
    setFunctionCallByClass("setBotRole", "click", setRole);
    setFunctionCallByClass("ollamaSettings", "change", setSettings);

    var openSettingDiv = document.getElementsByClassName("openSettingDiv");
    for (i = 0; i < openSettingDiv.length; i++) {
        openSettingDiv[i].addEventListener("click", function (event) {
            for (i = 0; i < document.getElementsByClassName("settingsContDiv").length; i++) {
                document.getElementsByClassName("settingsContDiv")[i].hidden = true;
                if (document.getElementsByClassName("openSettingDiv")[i].classList.contains("activeTab")) document.getElementsByClassName("openSettingDiv")[i].classList.remove("activeTab");
            }
            if (event.target.name == "ollamaDownloadDiv") showOsWiseDownload("", true);
            event.currentTarget.classList.add("activeTab");
            document.getElementById(event.target.name).hidden = !document.getElementById(event.target.name).hidden;
        });
    }

    var downloadCardDiv = document.getElementsByClassName("downloadCard");
    for (i = 0; i < downloadCardDiv.length; i++) {
        downloadCardDiv[i].addEventListener("click", function (event) {
            for (i = 0; i < document.getElementsByClassName("downloadCard").length; i++) {
                if (document.getElementsByClassName("downloadCard")[i].classList.contains("currentOsDiv")) {
                    document.getElementsByClassName("downloadCard")[i].classList.remove("currentOsDiv");
                }
            }
            event.currentTarget.classList.add("currentOsDiv");
            showOsWiseDownload(event.currentTarget.id);
        });
    }
}

//Set Settings On Changes
function setSettings(event) {
    // console.log(event.target.name, event.target.type)
    if (event.target.type == "checkbox") {
        localStorage.setItem("useEmoji", event.target.checked);
    } else if (event.target.type == "text" && event.target.id == "hostName") {
        if (event.target.value.trim().length == 0) {
            alert("Please enter valid host name");
            return;
        }
        setHostAddress(event.target.value);
        localStorage.setItem("hostAddress", event.target.value);
    } else if (event.target.type == "text" && event.target.id == "modalConnectionUri") {
        if (event.target.value.trim().length == 0) {
            alert("Please enter valid uri");
            return;
        }
        localStorage.setItem("modalConnectionUri", event.target.value);
    } else if (event.target.type == "text" && event.target.id == "ollamaPort") {
        if (event.target.value.trim().length == 0) {
            alert("Please enter valid port");
            return;
        }
        localStorage.setItem("ollamaPort", event.target.value);
    } else if (event.target.type == "radio" && event.target.name == "requestProtocol") {
        const selectedRadio = document.querySelector('input[name="requestProtocol"]:checked');
        if (selectedRadio) {
            if (selectedRadio.value == "http") {
                localStorage.setItem("requestProtocol", "http");
            } else {
                localStorage.setItem("requestProtocol", "https");
            }
        } else {
            localStorage.setItem("requestProtocol", "http");
        }
    } else if (event.target.type == "radio" && event.target.name == "settingsType") {
        const selectedRadio = document.querySelector('input[name="settingsType"]:checked');
        if (selectedRadio) {
            if (selectedRadio.value == "basic") {
                localStorage.setItem("settingsType", "basic");
                showElement("basicSettings", true);
                showElement("advanceSettings", false);
            } else {
                localStorage.setItem("settingsType", "advance");
                showElement("basicSettings", false);
                showElement("advanceSettings", true);
            }
        } else {
            localStorage.setItem("settingsType", "basic");
        }
    } else if (event.target.type == "select-one") {
        if (event.target.value.trim().length == 0) {
            alert("Please select modal");
            return;
        }
        localStorage.setItem("ollamaModal", event.target.value);
        document.getElementById("modalInfo").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-shield-check" viewBox="0 0 16 16">
  <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
  <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
</svg> `+ localStorage.getItem("ollamaModal");
    }
    setModalSettingsList();
}

//To Show The Os Wise Download
function showOsWiseDownload(selectedDivId, isDefaut) {
    var downloadLink = "https://ollama.com/download/OllamaSetup.exe";
    var downloadNotes = "Requires Windows 10 or later";

    if (isDefaut) {
        var osType = getOsType();
        var downloadDivId = "linuxDownloadDiv";

        if (osType == "Windows") {
            downloadDivId = "windowDownloadDiv";
            showElement("linuxDownloadDivBtn", false);
            showElement("ollamaDownloadBtnDiv", true);

            document.getElementById("ollamaDownloadNotes").innerHTML = downloadNotes;
            document.getElementById("ollamaDownloadBtn").href = downloadLink;
        }
        else if (osType == "macOS") {
            downloadDivId = "macDownloadDiv";
            showElement("linuxDownloadDivBtn", false);
            showElement("ollamaDownloadBtnDiv", true);

            downloadLink = "https://ollama.com/download/Ollama-darwin.zip";
            downloadNotes = "Requires macOS 11 Big Sur or later";

            document.getElementById("ollamaDownloadNotes").innerHTML = downloadNotes;
            document.getElementById("ollamaDownloadBtn").href = downloadLink;
        }
        document.getElementById(downloadDivId).classList.add("currentOsDiv");
    }
    else if (!isDefaut) {
        if (selectedDivId == "linuxDownloadDiv") {
            showElement("linuxDownloadDivBtn", true);
            showElement("ollamaDownloadBtnDiv", false);
        } else {
            showElement("linuxDownloadDivBtn", false);
            showElement("ollamaDownloadBtnDiv", true);
           
            if (selectedDivId == "macDownloadDiv") {
                downloadLink = "https://ollama.com/download/Ollama-darwin.zip";
                downloadNotes = "Requires macOS 11 Big Sur or later";
            }
            document.getElementById("ollamaDownloadNotes").innerHTML = downloadNotes;
            document.getElementById("ollamaDownloadBtn").href = downloadLink;
        }
    }

}

//Bot response
function getQAnswer(isRoleSet) {
    localStorage.setItem("stopChat", "false");
    if (localStorage.getItem("qId") == 'NaN' || !localStorage.getItem("qId")) {
        localStorage.setItem("qId", 1)
    }
    var userQuery = document.getElementById('userInput').value.trim();
    if (userQuery.length == 0) {
        alert("Please enter question");
        return
    }
    if (!localStorage.getItem("ollamaModal") || localStorage.getItem("ollamaModal") == "null" || localStorage.getItem("ollamaModal").length == 0) {
        alert("Please select or download any modal.");
        return;
    }
    const lastDivid = addMessage(userQuery, "", "question");
    var useEmoji = "";
    showElement("askQuestion", false);
    showElement("stopChat", true);
    showElement("welcomeDiv", false);

    if (isRoleSet) {
        if (localStorage.getItem("botDesc") != "null" && localStorage.getItem("botDesc").length > 0) {
            addMessage("", "Sure ;) .Please ask question.", "answer", lastDivid);
            document.getElementById('userInput').value = '';
            showElement("askQuestion", true);
            showElement("stopChat", false);
            return;
        }
    }
    if (localStorage.getItem("useEmoji") != null && localStorage.getItem("useEmoji").length > 0) {
        if (localStorage.getItem("useEmoji") == "true") useEmoji = "Use Emoji In Response ";
    }
    if (localStorage.getItem("botDesc") != "null" && localStorage.getItem("botDesc").length > 0) {
        userQuery = (useEmoji.length > 0 ? useEmoji + localStorage.getItem("botDesc") : localStorage.getItem("botDesc")) + " User Ask : " + userQuery;
    } else {
        userQuery = useEmoji.length > 0 ? useEmoji + " User Ask : " + userQuery : " User Ask : " + userQuery;
    }

    chatHistory.push({ role: "user", content: userQuery });//Add For Chat History
    // console.log("History", chatHistory)
    scrollDown("chat");

    var ollamaModal = localStorage.getItem("ollamaModal") ? localStorage.getItem("ollamaModal") : "llama3.2";
    const data = {
        model: ollamaModal,
        messages: chatHistory,
        stream: true
    };

    var apiUrl = "http://localhost:11434";
    apiUrl = `${localStorage.getItem("requestProtocol")}://${localStorage.getItem("hostAddress")}:${localStorage.getItem("ollamaPort")}/api/chat`;
    if (localStorage.getItem("settingsType") == "basic") apiUrl = localStorage.getItem("modalConnectionUri") + "/api/chat";

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.body.getReader();
        }).then(reader => {
            let decoder = new TextDecoder();
            let buffer = ''; // Buffer to store incomplete JSON strings

            // Define recursive function to continuously fetch responses
            function readStream() {
                if (localStorage.getItem("stopChat") == "true") {
                    showElement("askQuestion", true);
                    showElement("stopChat", false);
                    console.log("Chat stopped by user.");
                    return; // Stop further execution if stopDownload is true
                }
                reader.read().then(({ done, value }) => {
                    if (done) {
                        // Process any remaining buffer at the end of stream
                        if (buffer !== '') {
                            processJSON(buffer);
                        }
                        return;
                    }

                    // Append the new chunk of data to the buffer
                    buffer += decoder.decode(value, { stream: true });

                    // Process complete JSON objects in the buffer
                    processBuffer();
                });
            }

            // Function to process the buffer and extract complete JSON objects
            function processBuffer() {
                let chunks = buffer.split('\n');
                buffer = '';

                // Process each chunk
                for (let i = 0; i < chunks.length - 1; i++) {
                    let chunk = chunks[i];
                    processJSON(chunk);
                }

                // Store the incomplete JSON for the next iteration
                buffer = chunks[chunks.length - 1];
            }

            // Function to parse and process a JSON object
            function processJSON(jsonString) {
                try {
                    let jsonData = JSON.parse(jsonString);
                    if (jsonData.error) {
                        alert("Not able to chat please check console for more.")
                        console.log(jsonData.error);
                        return;
                    }
                    // console.log(jsonData.message,jsonData.done)
                    jsonData.response = jsonData.message.content.replace(/"/g, '');
                    addMessage("", jsonData.response, "answer", lastDivid);

                    // Check if the response indicates "done: true"
                    if (jsonData.done) {
                        showElement("askQuestion", true);
                        showElement("stopChat", false);
                        scrollDown("chat");
                        chatHistory.push({ role: "assistant", content: document.getElementById("botResponseDiv" + localStorage.getItem("qId")).textContent });//Add For Chat History
                        //It will remember last 2 chat
                        if (chatHistory.length == 6) {
                            chatHistory.splice(0, 2);
                        }
                        showElement("welcomeDiv", false);
                    } else {
                        // Continue reading the stream
                        readStream();
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            }

            // Start reading the stream
            readStream();
        })
        .catch(error => {
            if (localStorage.getItem("ModalWorking") && localStorage.getItem("ModalWorking") == '1') {
                alert("May be modal is not downloaded or selected.")
            } else {
                alert('Error:', "There was a problem with the fetch operation"); // Display error if any
            }
            showElement("askQuestion", true);
            showElement("stopChat", false);
            localStorage.setItem("stopChat", "false");
            console.error('There was a problem with the fetch operation:', error);
        });

    // Clear the input field
    document.getElementById('userInput').value = '';
};

//Set Bot Prompt
function setRole(event, isCoustom = false, inputId = "") {
    var botRole = "";
    if (isCoustom) {
        botRole = document.getElementById(inputId).value.trim();
        if (botRole.length == 0) {
            alert("Enter valid role");
            return
        }
    } else {
        botRole = event.target.innerText;
    }
    localStorage.setItem("botDesc", botRole);
    document.getElementById('userInput').value = botRole;
    getQAnswer(true);
}