var i = 0;
var botMessage = "";
var speed = 10;
var allDownloadModalList = [
    { name: "llama3.2:1b", size: "1.3 GB", downloaded: false },
    { name: "llama3.2:latest", size: "2.0 GB", downloaded: false },
    { name: "llama3.1:latest", size: "4.7 GB", downloaded: false },
    { name: "llama3.1:70b", size: "40 GB", downloaded: false },
    { name: "llama3.1:405b", size: "231 GB", downloaded: false },
    { name: "phi3:latest", size: "2.3 GB", downloaded: false },
    { name: "phi3:medium", size: "7.9 GB", downloaded: false },
    { name: "gemma2:2b", size: "1.6 GB", downloaded: false },
    { name: "gemma2:latest", size: "5.5 GB", downloaded: false },
    { name: "gemma2:27b", size: "16 GB", downloaded: false },
    { name: "mistral:latest", size: "4.1 GB", downloaded: false },
    { name: "moondream:latest", size: "829 MB", downloaded: false },
    { name: "neural-chat:latest", size: "4.1 GB", downloaded: false },
    { name: "starling-lm:latest", size: "4.1 GB", downloaded: false },
    { name: "codellama:latest", size: "3.8 GB", downloaded: false },
    { name: "llama2-uncensored:latest", size: "3.8 GB", downloaded: false },
    { name: "llava:latest", size: "4.5 GB", downloaded: false },
    { name: "solar:latest", size: "6.1 GB", downloaded: false }
];

function typeWriter() {
    document.getElementById("botResponse" + parseInt(localStorage.getItem("qId"))).textContent = botMessage;
}

function getOsType() {
    const platform = navigator.userAgent.toLowerCase();
    if (platform.includes('win')) return 'Windows';
    if (platform.includes('mac')) return 'macOS';
    if (platform.includes('linux')) return 'Linux';
    if (platform.includes('iphone') || platform.includes('ipad')) return 'iOS';
    if (platform.includes('android')) return 'Android';
    return 'Unknown';
}

function convertBackticksToCodeBlock(text) {
    return text
        .replace(/```sql([\s\S]*?)```/g, '<code class="align-middle">$1</code>'); // Handles multiline code blocks
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function scrollDown(divId) {
    document.getElementById(divId).scrollBy(0, document.getElementById(divId).scrollHeight);
}

//This will set the function call by class name
function setFunctionCallByClass(elementClassName, actionType, func, funcElementId = false) {
    var tmpClassElementList = document.getElementsByClassName(elementClassName);
    for (i = 0; i < tmpClassElementList.length; i++) {
        tmpClassElementList[i].addEventListener(actionType, function (event) {
            if (funcElementId) func(funcElementId)
            else func(event)
        });
    }
}

//Show Div Message For Chat
function addMessage(userQ, botAn, msgType, ansDivNo = parseInt(localStorage.getItem("qId"))) {
    if (msgType == "question") {
        localStorage.setItem("qId", parseInt(localStorage.getItem("qId")) + 1)
        var chatRow = document.createElement("div");
        chatRow.className = "chatRow my-3";
        chatRow.id = "chatRow" + parseInt(localStorage.getItem("qId"));
        chatRow.setAttribute("style", "white-space: pre-line;line-height: 1.6;");

        var userQDiv = document.createElement("div");
        userQDiv.className = "userQuery d-flex justify-content-start";
        userQDiv.textContent = userQ;//Set Question

        var botAnDiv = document.createElement("div");
        botAnDiv.className = "botResponse d-flex justify-content-start";
        botAnDiv.id = "botResponseDiv" + parseInt(localStorage.getItem("qId"));

        var botAnEl = document.createElement("p");
        botAnEl.id = "botResponse" + parseInt(localStorage.getItem("qId"));
        botAnEl.setAttribute("style", "width:100% !important;")
        // botAnEl.innerHTML = '<span class="mt-1 coustomSpinner">Loading</span> <span class="spinner-grow spinner-grow-sm mt-2" role="status" aria-hidden="true"></span><span class="spinner-grow spinner-grow-sm mt-2" role="status" aria-hidden="true"></span><span class="spinner-grow spinner-grow-sm mt-2" role="status" aria-hidden="true"></span>';
        botAnEl.innerHTML = '<p class="card-text placeholder-glow coustomSpinner"> <span class="placeholder col-7"></span> <span class="placeholder col-4"></span> <span class="placeholder col-4"></span> <span class="placeholder col-6"></span> <span class="placeholder col-8"></span> </p> </div> ';
        botAnDiv.appendChild(botAnEl);

        var divSvgList = document.createElement("div");
        divSvgList.className = "responseSvg"
        divSvgList.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-clipboard2-fill reactSvg copyResponse" viewBox="0 0 16 16"  id="copy' + parseInt(localStorage.getItem("qId")) + '"><path id="' + parseInt(localStorage.getItem("qId")) + '" d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/><path id="' + parseInt(localStorage.getItem("qId")) + '" d="M3.5 1h.585A1.5 1.5 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5q-.001-.264-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1"/><title>Copy Response</title>    </svg>                                                                                  <svg id="copied' + parseInt(localStorage.getItem("qId")) + '" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-clipboard-check-fill reactSvg" viewBox="0 0 16 16" style="display:none"><path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708"/><title>Copied</title></svg> '

        chatRow.appendChild(userQDiv);
        chatRow.appendChild(botAnDiv);
        chatRow.appendChild(divSvgList);
        divSvgList.addEventListener("click", function (event) { copyResponse(event.target.id) })


        document.getElementById("chat").appendChild(chatRow);
        return parseInt(localStorage.getItem("qId"));
    } else if (msgType == "answer") {
        if (document.getElementById("botResponse" + ansDivNo).innerHTML.search("coustomSpinner") != -1) {
            document.getElementById("botResponse" + ansDivNo).innerHTML = "";
            botMessage = "";
        }
        botMessage += botAn;
        document.getElementById("botResponse" + ansDivNo).setAttribute("style", "white-space: pre-line;");
        typeWriter("chat");
    }
    // scrollDown("chat"); This may be annoying to show scroll every time
}

//Copy Response
function copyResponse(divId, copied = false) {
    if(!divId && divId.trim().length ==0 ){
        return;
    }
    if (divId.includes("copy")) divId = divId.substr(4);
    if (divId.includes("copied")) divId = divId.substr(6);

    if (navigator.clipboard) {
        if (!copied) {
            window.navigator.clipboard.writeText(document.getElementById("chatRow" + divId).getElementsByTagName("div")[1].textContent);
            document.getElementById("copy" + divId).setAttribute("style", "display:none");
            document.getElementById("copied" + divId).setAttribute("style", "display:initial");
            setTimeout(copyResponse, 2000, divId, copied = true)
        } else {
            document.getElementById("copy" + divId).setAttribute("style", "display:initial");
            document.getElementById("copied" + divId).setAttribute("style", "display:none");
        }
    } else {
        // Clipboard API is not supported
        console.error('Clipboard API is not supported in this browser');
    }
}


function showElement(elementId, flag) {
    document.getElementById(elementId).hidden = !flag;
}


function showMessage(msgType, elementId, msg) {
    if (msgType == "success") {
        if (document.getElementById(elementId).classList.contains('text-danger')) document.getElementById(elementId).classList.remove("text-danger");
        document.getElementById(elementId).classList.add("text-success");
        document.getElementById(elementId).innerHTML = msg;
    }
    else if (msgType == "error") {
        if (document.getElementById(elementId).classList.contains('text-success')) document.getElementById(elementId).classList.remove("text-success");
        document.getElementById(elementId).classList.add("text-danger");
        document.getElementById(elementId).innerHTML = msg;
    }
}

//Call By Enter
function callByEnter(event, functionName) {
    if (event.key == "Enter") {
        switch (functionName) {
            case "getQAnswer":
                getQAnswer();
                break;
            default:
        }
    }
}


function copyData(value) {
    navigator.clipboard.writeText(value)
}


function openModal(modalBtnId) {
    document.getElementById(modalBtnId).click();
    if (openSettingModalBtn == "oppenSettingsModal") setModalSettingsList();
}

//Se Message
function setMessage(elemId, msg, isError) {
    document.getElementById(elemId).innerHTML = msg;
    var messageCss = isError ? "color:red;" : "color:green;";
    document.getElementById(elemId).setAttribute("style", messageCss);
}

function bytesToGigabytes(bytes) {
    return bytes / (1024 ** 3);
}

//Load Data To Table For Download
function loadModalTableData(modalInfo) {
    // modalInfo = modalInfo.filter(tmpInfo => tmpInfo.downloaded);
    modalInfo.sort((a, b) => { return b.downloaded - a.downloaded; });
    var tableInstance = document.getElementById("modalTableBody");
    tableInstance.innerHTML = "";
    var downloadedModalCount = 0;

    for (i = 0; i < modalInfo.length; i++) {
        var tmpTr = document.createElement("tr");
        tmpTr.id = "downloadModalRow" + (i + 1)

        var tmpThSr = document.createElement("td");
        tmpThSr.innerHTML = (i + 1);
        tmpThSr.classList.add("backgroundLightWhite");
        tmpThSr.scope = "row";

        var tmpThName = document.createElement("td");
        tmpThName.innerHTML = modalInfo[i].name;
        tmpThName.classList.add("backgroundLightWhite");

        var tmpThSize = document.createElement("td");
        tmpThSize.innerHTML = modalInfo[i].size;
        tmpThSize.classList.add("backgroundLightWhite", "text-center");

        var tmpThAction = document.createElement("td");
        tmpThAction.classList.add("backgroundLightWhite", "text-center");

        const downloadButton = document.createElement('button');
        downloadButton.type = 'button';
        downloadButton.title = "Click here to download";
        downloadButton.name = tmpTr.id;
        downloadButton.classList.add("customBtn-sm", "customBtn-primary", "mx-1", "button--neumorphic", "startDownload");
        downloadButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16">
  <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708"/>
</svg>`;
        downloadButton.addEventListener("click", function (event) { downloadModalOnline(event.currentTarget.name) });//Download Dunction Set

        const stopButton = document.createElement('button');
        stopButton.type = 'button';
        stopButton.title = "Click here to stop download";
        stopButton.name = tmpTr.id;
        stopButton.hidden = true;
        stopButton.classList.add("customBtn-sm", "customBtn-warning", "mx-1", "button--neumorphic", "stopDownload");
        stopButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-stop-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.5 5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5z"/>
</svg>`;
        stopButton.addEventListener("click", function (event) { stopDownload(event.currentTarget.name); localStorage.setItem("stopDownload", true); });//Download Dunction Set

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.title = 'Click here to delete';
        deleteButton.name = tmpTr.id;
        // if (downloadedModalCount == 0 && modalInfo[i] && modalInfo[i].downloaded) {
        //     deleteButton.disabled = true;
        //     deleteButton.title = "Not allowed to delete";
        //     deleteButton.setAttribute("style", "cursor: not-allowed !important;")
        //     downloadedModalCount++;
        // }
        deleteButton.addEventListener("click", function (event) { deleteModalOnline(event.currentTarget.name) });
        deleteButton.classList.add("customBtn-sm", "customBtn-danger", "mx-1", "button--neumorphic");
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash2-fill" viewBox="0 0 16 16">
  <path d="M2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671zm9.89-.69C10.966 2.214 9.578 2 8 2c-1.58 0-2.968.215-3.926.534-.477.16-.795.327-.975.466.18.14.498.307.975.466C5.032 3.786 6.42 4 8 4s2.967-.215 3.926-.534c.477-.16.795-.327.975-.466-.18-.14-.498-.307-.975-.466z"/>
</svg>`

        if (modalInfo[i] && modalInfo[i].downloaded) tmpThAction.appendChild(deleteButton);
        else tmpThAction.appendChild(downloadButton);
        tmpThAction.appendChild(stopButton);

        var tmpThDownload = document.createElement("td");
        tmpThDownload.classList.add("backgroundLightWhite", "d-flex", "align-items-center");

        var tmpSpanMessage = document.createElement("span");
        tmpSpanMessage.classList.add("badge", "text-black","text-break");
        tmpSpanMessage.classList.add(modalInfo[i].downloaded ? ("customBtn-primary") : ("customBtn-danger"));
        tmpSpanMessage.id = "downloadStatus" + (i + 1)
        tmpSpanMessage.innerHTML = modalInfo[i].downloaded ? "DOWNLOADED" : "PENDING";

        var tmpSpanSpinner = document.createElement("span");
        tmpSpanSpinner.classList.add("badge", "text-black");
        tmpSpanSpinner.hidden = true;
        tmpSpanSpinner.innerHTML = `<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>`;
        tmpThDownload.appendChild(tmpSpanSpinner);
        tmpThDownload.appendChild(tmpSpanMessage);

        tmpTr.appendChild(tmpThSr);
        tmpTr.appendChild(tmpThName);
        tmpTr.appendChild(tmpThSize);
        tmpTr.appendChild(tmpThAction);
        tmpTr.appendChild(tmpThDownload);

        tableInstance.appendChild(tmpTr);
    }

}

//This will download the modal based on user request
function downloadModalOnline(modalDownloadRowId) {
    if (localStorage.getItem("isDownloaing") && localStorage.getItem("isDownloaing") == "true") {
        alert("Download is already in process.Please wait till complete")
        return;
    }
    if (!localStorage.getItem("isDownloaing") || localStorage.getItem("isDownloaing").length == 0 || localStorage.getItem("isDownloaing") == "false") {
        localStorage.setItem("isDownloaing", "true");
    }
    localStorage.setItem("stopDownload", "false");

    let tmpDownloadRow = document.getElementById(modalDownloadRowId);
    tmpDownloadRow.getElementsByTagName("td")[3].getElementsByClassName("startDownload")[0].hidden = true;//Start Button
    tmpDownloadRow.getElementsByTagName("td")[3].getElementsByClassName("stopDownload")[0].hidden = false;//Show Stop Button
    let tmpDownloadStatus = tmpDownloadRow.getElementsByTagName("td")[4];

    let tmpDownloadStatusSpan = tmpDownloadStatus.getElementsByTagName("span")[2];
    tmpDownloadStatusSpan.classList.remove('customBtn-danger');
    tmpDownloadStatusSpan.classList.add('customBtn-primary');

    let modalName = tmpDownloadRow.getElementsByTagName("td")[1].textContent.trim();

    tmpDownloadStatus.getElementsByTagName("span")[0].hidden = false;
    tmpDownloadStatusSpan.innerHTML = `Download Started Please wait..`;

    if (localStorage.getItem("ModalWorking") && localStorage.getItem("ModalWorking") == "1" && modalName && modalName.length > 0) {
        const data = {
            name: modalName,
            stream: true
        };

        var apiUrl = "http://localhost:11434";
        apiUrl = `${localStorage.getItem("requestProtocol")}://${localStorage.getItem("hostAddress")}:${localStorage.getItem("ollamaPort")}/api/pull`;
        if (localStorage.getItem("settingsType") == "basic") apiUrl = localStorage.getItem("modalConnectionUri") + "/api/pull";

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                // console.log(response, "response");
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.body.getReader();
            })
            .then(reader => {
                let decoder = new TextDecoder();
                let buffer = ''; // Buffer to store incomplete JSON strings
                let noOfLayes=1;
                let tmpDigest="";

                // Define recursive function to continuously fetch responses
                function readStream() {
                    // Check if we should stop reading
                    if (localStorage.getItem("stopDownload") === "true") {
                        console.log("Download stopped by user.");
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

                        // Continue reading the stream if not done
                        readStream();
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
                        let downloadPercent = 0;
                        if (jsonData.total && jsonData.completed) {
                            downloadPercent = (jsonData.completed / jsonData.total) * 100;
                        }
                        if(jsonData.error){
                            tmpDownloadStatusSpan.innerHTML="Not able to download please check internet connection on ollama server and check console for more info.";
                            console.log(jsonData.error);
                            return;
                        }
                        if(jsonData.digest && jsonData.digest.length>2){
                            if(jsonData.digest != tmpDigest){
                                if(tmpDigest.length>0) noOfLayes++;
                                tmpDigest=jsonData.digest;
                            }
                        }

                        tmpDownloadStatusSpan.innerHTML = `Layer ${noOfLayes} : ${downloadPercent.toFixed(2)}%`;

                        // Check if the response indicates "done: true"
                        if (jsonData.status && jsonData.status == "success") {
                            alert("Download Complete");
                            localStorage.setItem("isDownloaing", "false")
                            setModalSettingsList();//Load Latest Data
                        }
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                }

                // Start reading the stream
                readStream();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                alert('Error:', error); // Display error if any
            });

    }
}

//This will stop the download of modal
function stopDownload(modalDownloadRowId) {
    let tmpDownloadRow = document.getElementById(modalDownloadRowId);
    let tmpDownloadStatus = tmpDownloadRow.getElementsByTagName("td")[4];
    tmpDownloadStatus.innerHTML = `<span class="badge text-black" hidden=""><div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div></span><span class='badge text-black customBtn-danger'>DOWNLOAD STOPPED</span>`;

    tmpDownloadRow.getElementsByTagName("td")[3].getElementsByClassName("stopDownload")[0].hidden = true;
    tmpDownloadRow.getElementsByTagName("td")[3].getElementsByClassName("startDownload")[0].hidden = false;

    localStorage.setItem("stopDownload", "true");
    localStorage.setItem("isDownloaing", "false")
}

//This will delete modal
function deleteModalOnline(modalDownloadRowId) {
    let tmpDownloadRow = document.getElementById(modalDownloadRowId);
    let tmpDownloadStatus = tmpDownloadRow.getElementsByTagName("td")[4];

    let tmpDownloadStatusSpan = tmpDownloadStatus.getElementsByTagName("span")[2];

    let modalName = tmpDownloadRow.getElementsByTagName("td")[1].textContent.trim();

    let isDelete = confirm(`Are you sure want to delete ${modalName} modal ? `);
    if (!isDelete) return 0;

    tmpDownloadStatusSpan.classList.remove('customBtn-primary');
    tmpDownloadStatusSpan.classList.add('customBtn-danger');

    tmpDownloadStatus.getElementsByTagName("span")[0].hidden = false;
    tmpDownloadStatusSpan.innerHTML = `Delete Started Please wait..`;

    if (localStorage.getItem("ModalWorking") && localStorage.getItem("ModalWorking") == "1" && modalName && modalName.length > 0) {
        // console.log("start");
        const data = {
            name: modalName
        };

        var apiUrl = "http://localhost:11434";
        apiUrl = `${localStorage.getItem("requestProtocol")}://${localStorage.getItem("hostAddress")}:${localStorage.getItem("ollamaPort")}/api/delete`;
        if (localStorage.getItem("settingsType") == "basic") apiUrl = localStorage.getItem("modalConnectionUri") + "/api/delete";

        fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // console.log(response)
                if (response.status == "200") {
                    window.location.reload();
                    // setModalSettingsList();//Load Latest Data
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }
}

//Prepare the modal list for download
function setDownloadModalList(presentModal) {
    let downloadModalList = JSON.parse(JSON.stringify(allDownloadModalList));//Reset Old Modal Info
    for (i = 0; i < presentModal.length; i++) {
        let modalFound = 0;
        for (j = 0; j < downloadModalList.length; j++) {
            if (downloadModalList[j].name == presentModal[i].name) {
                downloadModalList[j].downloaded = true;
                modalFound = 1;
            }
        }
        //If modal Not Found In List Then Add In Showing List
        if (modalFound == 0) {
            downloadModalList.push({ name: presentModal[i].name, size: bytesToGigabytes(presentModal[i].size).toFixed(1) + " GB", downloaded: true })
        }
    }
    loadModalTableData(downloadModalList);
}

//Set Modal And Load Data Of Settings
function setModalSettingsList() {
    if (!localStorage.getItem("ollamaPort") || localStorage.getItem("ollamaPort") == "null" || localStorage.getItem("ollamaPort").length == 0) {
        localStorage.setItem("ollamaPort", "11434");
    }
    if (!localStorage.getItem("hostAddress") || localStorage.getItem("hostAddress") == "null" || localStorage.getItem("hostAddress").length == 0) {
        localStorage.setItem("hostAddress", "localhost");
    }
    if (!localStorage.getItem("requestProtocol") || localStorage.getItem("requestProtocol") == "null" || localStorage.getItem("requestProtocol").length == 0) {
        localStorage.setItem("requestProtocol", "http");
    }
    if (!localStorage.getItem("settingsType") || localStorage.getItem("settingsType") == "null" || localStorage.getItem("settingsType").length == 0) {
        localStorage.setItem("settingsType", "basic");
    }

    var hostAddress = localStorage.getItem("hostAddress");
    var requestProtocol = localStorage.getItem("requestProtocol");
    var ollamaPort = localStorage.getItem("ollamaPort");
    var useEmoji = localStorage.getItem("useEmoji") == "true" ? true : false;
    if (localStorage.getItem("settingsType") == "basic") {
        document.getElementById("modalConnectionUri").value = localStorage.getItem("modalConnectionUri");
    }

    document.getElementById("useEmogi").checked = useEmoji;
    document.getElementById("ollamaPort").value = ollamaPort;
    document.getElementById("hostName").value = hostAddress;

    if (localStorage.getItem("requestProtocol") == "http") {
        document.getElementsByClassName("requestProtocol")[0].checked = true;
        document.getElementsByClassName("requestProtocol")[1].checked = false;
    } else {
        document.getElementsByClassName("requestProtocol")[1].checked = true;
        document.getElementsByClassName("requestProtocol")[0].checked = false;
    }
    //Settings Type
    if (localStorage.getItem("settingsType") == "basic") {
        document.getElementsByClassName("settingsType")[0].checked = true;
        document.getElementsByClassName("settingsType")[1].checked = false;
    } else {
        document.getElementsByClassName("settingsType")[1].checked = true;
        document.getElementsByClassName("settingsType")[0].checked = false;
    }

    var apiUrl = "http://localhost:11434";
    apiUrl = `${requestProtocol}://${hostAddress}:${ollamaPort}/api/tags`;
    if (localStorage.getItem("settingsType") == "basic") apiUrl = localStorage.getItem("modalConnectionUri") + "/api/tags";

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => response.json())
        .then((data) => {
            // console.log(data.models);
            var modelsList = data.models;
            var modelSelect = document.getElementById("modalList");
            modelSelect.innerHTML = "";
            modelSelect.innerHTML = "<option disabled selected>Select Modal</option>";
            for (i = 0; i < modelsList.length; i++) {
                var tmpOption = document.createElement("option");
                tmpOption.value = modelsList[i].name;
                tmpOption.innerHTML = modelsList[i].name + " " + modelsList[i].details.parameter_size;

                var selectedModal = localStorage.getItem("ollamaModal");
                // if (!selectedModal || selectedModal == "null" || selectedModal.length == 0) {
                //     tmpOption.selected = true;
                // }
                if (selectedModal == modelsList[i].name) {
                    tmpOption.selected = true;
                }

                modelSelect.appendChild(tmpOption)
            }
            setMessage("settingsMessage", "<img class='customIcon' src='static/images/verify.gif' />Modal loaded successfully", 0);
            setMessage("downloadMessage", "<img class='customIcon' src='static/images/verify.gif' />Modal loaded successfully", 0);
            if (data.models) setDownloadModalList(data.models);
            localStorage.setItem("ModalWorking", 1);
            showElement("modalErrorDiv", false);
            showElement("chatContainer", true);
        })
        .catch((error => {
            var modelSelect = document.getElementById("modalList");
            modelSelect.innerHTML = "";
            setTimeout(function () { setMessage("settingsMessage", `<img class='customIcon' src='static/images/cross.gif' />Unable to connect to ollama.Please check server running or not through below url.<br><a target='_blank' href='${apiUrl}'>${apiUrl}<a><br><span class='text-success'> To install or make of ollama server click <a href='https://github.com/ollama/ollama/tree/main#user-content-ollama'>here</a></span>`, 1) }, 100);
            setMessage("downloadMessage", "<img class='customIcon' src='static/images/cross.gif' />Not able to connect with modal.Please check in Modal Settings Section", 1);
            localStorage.setItem("ModalWorking", 0);
            showElement("modalErrorDiv", true);
            showElement("chatContainer", false);
            console.error('There was a problem with the fetch operation:', error);
        }));

}
