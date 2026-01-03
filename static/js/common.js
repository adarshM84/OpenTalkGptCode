var i = 0;
var isFetchingTags = false;
var botMessage = "";
var speed = 10;
var allDownloadModalList = [
    { name: "gemma3:1b", size: "815MB", downloaded: false, type: "Chat" },
    { name: "llama3.2:1b", size: "1.3 GB", downloaded: false, type: "Chat" },
    { name: "gemma2:2b", size: "1.6 GB", downloaded: false, type: "Chat" },
    { name: "nomic-embed-text:latest", size: "274MB", downloaded: false, type: "Embedding" },
    { name: "nomic-embed-text:v1.5", size: "274MB", downloaded: false, type: "Embedding" },
    { name: "llama3.2:latest", size: "2.0 GB", downloaded: false, type: "Chat" },
    { name: "llama3.1:latest", size: "4.7 GB", downloaded: false, type: "Chat" },
    { name: "deepseek-r1:7b", size: "4.7 GB", downloaded: false, type: "Chat" },
    { name: "deepseek-r1:8b", size: "4.9GB", downloaded: false, type: "Chat" },
    { name: "deepseek-r1:14b", size: "9.0GB", downloaded: false, type: "Chat" },
    { name: "llama3.1:70b", size: "40 GB", downloaded: false, type: "Chat" },
    { name: "llama3.1:405b", size: "231 GB", downloaded: false, type: "Chat" },
    { name: "phi3:latest", size: "2.3 GB", downloaded: false, type: "Chat" },
    { name: "phi3:medium", size: "7.9 GB", downloaded: false, type: "Chat" },
    { name: "deepseek-r1:1.5b", size: "1.1GB", downloaded: false, type: "Chat" },
    { name: "gemma2:latest", size: "5.5 GB", downloaded: false, type: "Chat" },
    { name: "gemma2:27b", size: "16 GB", downloaded: false, type: "Chat" },
    { name: "mistral:latest", size: "4.1 GB", downloaded: false, type: "Chat" },
    { name: "moondream:latest", size: "829 MB", downloaded: false, type: "Chat" },
    { name: "neural-chat:latest", size: "4.1 GB", downloaded: false, type: "Chat" },
    { name: "starling-lm:latest", size: "4.1 GB", downloaded: false, type: "Chat" },
    { name: "codellama:latest", size: "3.8 GB", downloaded: false, type: "Chat" },
    { name: "llama2-uncensored:latest", size: "3.8 GB", downloaded: false, type: "Chat" },
    { name: "llava:latest", size: "4.5 GB", downloaded: false, type: "Chat" },
    { name: "solar:latest", size: "6.1 GB", downloaded: false, type: "Chat" }
];

let customeNav = `
<div class="container-fluid">
            <select class="form-select w-25 ollamaSettings" id="selectSavedChat">
                <option value="">Select Saved Chat</option>
                <option value="home">HOME</option>
            </select>
            <h4 id="headTitle" class="text-center headTitle" hidden>
               
                    OpenTalkGPT
               
            </h4>
            <h2 id="headRagTitle" class="text-center headTitle">
                
                    OpenTalkGPT - PDF Q&A (Optimized RAG)
                
            </h2>
            
            <div class="buttongGroup">
                <span class="badge text-black customBtn-primary" id="modalInfo" title="Seleted modal">DOWNLOADED</span>
                <span title="Settings" class="mx-2 oppenSettingsModal" id="openSettingIcon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                        class="bi bi-gear-wide-connected svg-Me" viewBox="0 0 16 16">
                        <path
                            d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z" />
                    </svg>
                </span>
                <span title="About Me" id="opneIntroIcon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                        class="bi bi-person-circle svg-Me" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                        <path fill-rule="evenodd"
                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                    </svg>
                </span>
                <a href="faq.html" class="mx-1" title="FAQ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                        class="bi bi-question-circle-fill svg-Me" viewBox="0 0 16 16">
                        <path
                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
                    </svg>
                </a>
                <a href="#" title="What's New" id="openFeatureList">
                    <img src="static/images/whatnew.png" class="whatnew" alt="">
                </a>
                <a href="index.html" title="Home" id="homeButton">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-house-door-fill svg-Me" viewBox="0 0 16 16">
                        <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
                    </svg>
                </a>
                
                <a href="rag.html" title="Rag - Chat with pdf">
                    <img src="static/images/rag.png" id="ragButton" class="ragicon" alt="">
                </a>
            </div>
        </div>
`;


function loadNav(elementId, type = "other") {
    document.getElementById(elementId).innerHTML = customeNav;
    if (type == "other") {
        showElement("opneIntroIcon", false);
        showElement("ragButton", false);
        showElement("headTitle", false);
        showElement("headRagTitle", true);
        showElement("selectSavedChat", false);
        showElement("openFeatureList", false);
        showElement("openSettingIcon", false);
    } else {
        showElement("homeButton", false);
        showElement("headTitle", true);
        showElement("headRagTitle", false);
    }
}

function showSweetAlert(messageType = "error", title = "Oops...", htmlMessage = "", footerMessage = '<a href="index.html">Home</a>') {
    Swal.fire({
        icon: messageType,
        title: title,
        html: htmlMessage,
        footer: footerMessage,
        // allowOutsideClick: false, // Prevent closing by clicking outside
        allowEscapeKey: false,    // Prevent ESC from closing
        allowEnterKey: false,     // Prevent Enter key from closing
        showCancelButton: false,  // Only one button
        confirmButtonText: 'OK',  // Button text
        draggable: true           // Keep draggable if you want
    }).then((result) => {
        if (result.isConfirmed) {
            console.log("User clicked OK");
            // Put your next logic here
        }
    });
}



function getCode(event) {
    // console.log(event.currentTarget, event.currentTarget.getAttribute("name"))
    window.navigator.clipboard.writeText(event.currentTarget.parentNode.getElementsByClassName("mainCodeContent")[0].textContent);
    event.currentTarget.getElementsByTagName("svg")[0].setAttribute("style", "display:none");
    event.currentTarget.getElementsByTagName("svg")[1].setAttribute("style", "display:initial");
}

function isModalPresent(name, type) {
    for (let i = 0; i < allDownloadModalList.length; i++) {
        const modal = allDownloadModalList[i];
        if (
            modal.name?.toLowerCase().includes(name.toLowerCase()) &&
            modal.type?.toLowerCase().includes(type.toLowerCase())
        ) {
            return true;
        }
    }
    return false;
}


function parseText(input) {
    // Escape any HTML in the input to prevent parsing
    const escapedInput = input
        .replace(/&/g, "&amp;") // Escape `&`
        .replace(/</g, "&lt;") // Escape `<`
        .replace(/>/g, "&gt;"); // Escape `>`

    // Replace **text** with <b>text</b> while preserving escaped content
    let formatted = escapedInput.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    // Map of language types to their code block styles and badges
    const languageStyles = {
        html: { className: "htmlCode", label: "HTML" },
        css: { className: "cssCode", label: "CSS" },
        javascript: { className: "jsCode", label: "JS" },
        php: { className: "phpCode", label: "PHP" },
        cpp: { className: "cppCode", label: "cpp" },
        general: { className: "generalCode", label: "Code" }
    };

    // Function to wrap the code block
    function wrapCodeBlock(lang, code) {
        const { className, label } = languageStyles[lang] || languageStyles.general;
        var preparedContents = `
                <div class="${className} customCodeBlock">
                    <p class="codeBage" title="Copy Response"><span>${label}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="20" fill="currentColor" class="bi bi-clipboard2-fill reactSvg copyResponse mx-1" viewBox="0 0 16 16" id="copy67">
                            <path id="67" d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"></path>
                            <path id="67" d="M3.5 1h.585A1.5 1.5 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5q-.001-.264-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1"></path>
                        </svg>
                        <svg style="display:none;" xmlns="http://www.w3.org/2000/svg" width="15" height="20" fill="currentColor" class="bi bi-clipboard-check-fill reactSvg" viewBox="0 0 16 16"><path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"></path><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708"></path><title>Copied</title></svg>
                    </p>
                    <span class="mainCodeContent">${code}</span>
                </div>`;
        return preparedContents;
    }


    // Detect and format code blocks with triple backticks
    formatted = formatted.replace(/```(html|css|javascript|php|cpp|)(.*?)```/gs, (match, lang, code) => {
        lang = lang || "general"; // Default to 'general' if no language is specified
        return wrapCodeBlock(lang, code);
    });

    // Replace headings, ignoring text inside code blocks
    formatted = formatted.replace(/(?!<div class="[^"]*">)(\#{2,})(.*?)(?!<\/div>)/g, (match, hashes, content) => {
        const level = hashes.length; // Determine the header level
        return `<h${level}>${content.trim()}</h${level}>`;
    });
    return formatted;
}

function typeWriter(ansDivId = parseInt(localStorage.getItem("qId"))) {
    var parentDivId = "botResponse" + ansDivId;
    if (localStorage.getItem("parseContent") == "true") {
        document.getElementById(parentDivId).innerHTML = (localStorage.getItem("parseContent") == "true") ? parseText(botMessage) : botMessage;
        setFunctionCallByClass("codeBage", "click", getCode);
    } else {
        document.getElementById(parentDivId).textContent = botMessage;
    }
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

function setDefault(key, defaultValue, setForce = false) {
    if (!localStorage.getItem(key) || localStorage.getItem(key).length === 0 || setForce) {
        localStorage.setItem(key, defaultValue);
    }
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
function addMessage(userQ, botAn, msgType, ansDivNo = parseInt(localStorage.getItem("qId")), qDivNo = false, parentDivId = "chatContent") {
    if (msgType == "question") {
        if (qDivNo == false) {
            localStorage.setItem("qId", parseInt(localStorage.getItem("qId")) + 1);
            qDivNo = parseInt(localStorage.getItem("qId"));
        }

        var chatRow = document.createElement("div");
        chatRow.className = "chatRow";
        chatRow.id = "chatRow" + qDivNo;
        chatRow.setAttribute("style", "white-space: pre-line;line-height: 1.6;");

        var userQDiv = document.createElement("div");
        userQDiv.className = "userQuery d-flex justify-content-start";
        userQDiv.id = "userQuestion" + qDivNo;
        userQDiv.textContent = userQ;//Set Question



        var editQuestion = document.createElement("div");
        editQuestion.className = "editQuestionSvg";
        editQuestion.innerHTML = '<svg name=' + parseInt(localStorage.getItem("qId")) + ' xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"> <path name=' + parseInt(localStorage.getItem("qId")) + ' d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/> <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/> </svg>';
        editQuestion.addEventListener("click", function (event) {
            if (document.getElementById("userQuestion" + event.target.getAttribute('name')).classList.contains("editDiv")) {
                document.getElementById("userQuestion" + event.target.getAttribute('name')).classList.remove("editDiv");
                document.getElementById("userQuestion" + event.target.getAttribute('name')).contentEditable = false;
            } else {
                document.getElementById("userQuestion" + event.target.getAttribute('name')).classList.add("editDiv");
                document.getElementById("userQuestion" + event.target.getAttribute('name')).contentEditable = true;
            }
        });

        var botAnDiv = document.createElement("div");
        botAnDiv.className = "botResponse d-flex justify-content-start";
        botAnDiv.id = "botResponseDiv" + qDivNo;

        var botAnEl = document.createElement("p");
        botAnEl.id = "botResponse" + qDivNo;
        botAnEl.className = "botResponseContent";
        botAnEl.setAttribute("style", "width:100% !important;");
        // botAnEl.innerHTML = '<span class="mt-1 coustomSpinner">Loading</span> <span class="spinner-grow spinner-grow-sm mt-2" role="status" aria-hidden="true"></span><span class="spinner-grow spinner-grow-sm mt-2" role="status" aria-hidden="true"></span><span class="spinner-grow spinner-grow-sm mt-2" role="status" aria-hidden="true"></span>';
        botAnEl.innerHTML = '<p class="card-text placeholder-glow coustomSpinner"> <span class="placeholder col-7"></span> <span class="placeholder col-4"></span> <span class="placeholder col-4"></span> <span class="placeholder col-6"></span> <span class="placeholder col-8"></span> </p> </div> ';
        botAnDiv.appendChild(botAnEl);

        var svgDivList = document.createElement("div");
        svgDivList.className = "responseSvg";

        var copySvgDiv = document.createElement("div");
        copySvgDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-clipboard2-fill reactSvg copyResponse mx-1" viewBox="0 0 16 16"  id="copy' + parseInt(localStorage.getItem("qId")) + '"><path id="' + parseInt(localStorage.getItem("qId")) + '" d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/><path id="' + parseInt(localStorage.getItem("qId")) + '" d="M3.5 1h.585A1.5 1.5 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5q-.001-.264-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1"/><title>Copy Response</title>    </svg> <svg id="copied' + parseInt(localStorage.getItem("qId")) + '" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-clipboard-check-fill reactSvg mx-1" viewBox="0 0 16 16" style="display:none"><path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708"/><title>Copied</title></svg> ';

        var reAnswerDiv = document.createElement("div");
        reAnswerDiv.innerHTML = '<svg style="background: black !important; color: white !important; border-radius: 10px !important;" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-arrow-repeat reactSvg mx-1" viewBox="0 0 16 16" id="reAnswer' + parseInt(localStorage.getItem("qId")) + '"> <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/> <path id="' + parseInt(localStorage.getItem("qId")) + '" fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/><title>Regenrate</title> </svg>';

        var sendReview = document.createElement("div");
        sendReview.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-balloon-heart-fill reactSvg mx-1 sendReview text-danger" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8.49 10.92C19.412 3.382 11.28-2.387 8 .986 4.719-2.387-3.413 3.382 7.51 10.92l-.234.468a.25.25 0 1 0 .448.224l.04-.08c.009.17.024.315.051.45.068.344.208.622.448 1.102l.013.028c.212.422.182.85.05 1.246-.135.402-.366.751-.534 1.003a.25.25 0 0 0 .416.278l.004-.007c.166-.248.431-.646.588-1.115.16-.479.212-1.051-.076-1.629-.258-.515-.365-.732-.419-1.004a2 2 0 0 1-.037-.289l.008.017a.25.25 0 1 0 .448-.224l-.235-.468ZM6.726 1.269c-1.167-.61-2.8-.142-3.454 1.135-.237.463-.36 1.08-.202 1.85.055.27.467.197.527-.071.285-1.256 1.177-2.462 2.989-2.528.234-.008.348-.278.14-.386"/><title>Write Review</title>
</svg>`;

        svgDivList.appendChild(copySvgDiv);
        svgDivList.appendChild(reAnswerDiv);
        svgDivList.appendChild(sendReview);

        chatRow.appendChild(editQuestion);
        chatRow.appendChild(userQDiv);
        chatRow.appendChild(botAnDiv);
        chatRow.appendChild(svgDivList);

        copySvgDiv.addEventListener("click", function (event) { copyResponse(event.target.id) });
        sendReview.addEventListener("click", function (event) { window.open("https://chromewebstore.google.com/detail/opentalkgpt/idknomikbgopkhpepapoehhoafacddlk/reviews") });
        reAnswerDiv.addEventListener("click", function (event) { reAnswer(event.target.id) });

        document.getElementById(parentDivId).appendChild(chatRow);
        return parseInt(localStorage.getItem("qId"));
    } else if (msgType == "answer") {
        var ansDivid = "botResponse" + ansDivNo;
        if (document.getElementById(ansDivid).innerHTML.search("coustomSpinner") != -1) {
            document.getElementById(ansDivid).innerHTML = "";
            botMessage = "";
        }
        botMessage += botAn;
        document.getElementById(ansDivid).setAttribute("style", "white-space: pre-line;width:100% !important;");
        typeWriter(ansDivNo);
    }
    // scrollDown("chat"); This may be annoying to show scroll every time
}

//Copy Response
function copyResponse(divId, copied = false) {
    if (!divId && divId.trim().length == 0) {
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

function validateString(input, strinType) {
    var validPattern = /^[a-zA-Z0-9 ,]*$/; // Pattern allowing only letters, numbers, spaces, and commas
    if (strinType == "modalName") {
        validPattern = /^[a-zA-Z0-9]*$/; // Pattern for modalName: Only letters and numbers
    }
    // Now use the actual input string for validation
    if (!validPattern.test(input)) {
        return (strinType == "modalName"
            ? "Only letters and numbers are allowed."
            : "Only letters, numbers, spaces, and commas are allowed.");
    }
    return true;
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

        var tmpType = document.createElement("td");
        tmpType.innerHTML = `<span class="badge text-black text-break ${modalInfo[i].type?.toLowerCase() !== "chat" ? "customBtn-warning" : "customBtn-blue"}">${modalInfo[i].type ?? "Chat"}</span>`;
        tmpType.classList.add("backgroundLightWhite", "text-center");

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
        tmpSpanMessage.classList.add("badge", "text-black", "text-break");
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
        tmpTr.appendChild(tmpType);
        tmpTr.appendChild(tmpThAction);
        tmpTr.appendChild(tmpThDownload);

        tableInstance.appendChild(tmpTr);
    }

}

//This will download the modal based on user request
function downloadModalOnline(modalDownloadRowId) {
    if (localStorage.getItem("isDownloaing") && localStorage.getItem("isDownloaing") == "true") {
        showSweetAlert("warning", "Oops...", "Download is already in process.Please wait till complete");
        return;
    }
    if (!localStorage.getItem("isDownloaing") || localStorage.getItem("isDownloaing").length == 0 || localStorage.getItem("isDownloaing") == "false") {
        localStorage.setItem("isDownloaing", "true");
    }
    localStorage.setItem("stopDownload", "false");

    let tmpDownloadRow = document.getElementById(modalDownloadRowId);
    console.log(tmpDownloadRow)
    tmpDownloadRow.getElementsByTagName("td")[4].getElementsByClassName("startDownload")[0].hidden = true;//Start Button
    tmpDownloadRow.getElementsByTagName("td")[4].getElementsByClassName("stopDownload")[0].hidden = false;//Show Stop Button
    let tmpDownloadStatus = tmpDownloadRow.getElementsByTagName("td")[5];

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
                let noOfLayes = 1;
                let tmpDigest = "";

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
                        if (jsonData.error) {
                            tmpDownloadStatusSpan.innerHTML = "Not able to download please check internet connection on ollama server and check console for more info.";
                            console.log(jsonData.error);
                            return;
                        }
                        if (jsonData.digest && jsonData.digest.length > 2) {
                            if (jsonData.digest != tmpDigest) {
                                if (tmpDigest.length > 0) noOfLayes++;
                                tmpDigest = jsonData.digest;
                            }
                        }

                        tmpDownloadStatusSpan.innerHTML = `Layer ${noOfLayes} : ${downloadPercent.toFixed(2)}%`;

                        // Check if the response indicates "done: true"
                        if (jsonData.status && jsonData.status == "success") {
                            showSweetAlert("success", "", "Download Complete");
                            localStorage.setItem("isDownloaing", "false")
                            setModalSettingsList();//Load Latest Data
                            window.location.reload();
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

    } else {
        showSweetAlert("error", "Opps...", "Ollama modal is not running please check.");
    }
}

//This will stop the download of modal
function stopDownload(modalDownloadRowId) {
    let tmpDownloadRow = document.getElementById(modalDownloadRowId);
    let tmpDownloadStatus = tmpDownloadRow.getElementsByTagName("td")[5];
    tmpDownloadStatus.innerHTML = `<span class="badge text-black" hidden=""><div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div></span><span class='badge text-black customBtn-danger'>DOWNLOAD STOPPED</span>`;

    tmpDownloadRow.getElementsByTagName("td")[4].getElementsByClassName("stopDownload")[0].hidden = true;
    tmpDownloadRow.getElementsByTagName("td")[4].getElementsByClassName("startDownload")[0].hidden = false;

    localStorage.setItem("stopDownload", "true");
    localStorage.setItem("isDownloaing", "false")
}

//This will delete modal
function deleteModalOnline(modalDownloadRowId) {
    let tmpDownloadRow = document.getElementById(modalDownloadRowId);
    let tmpDownloadStatus = tmpDownloadRow.getElementsByTagName("td")[5];

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
    if (isFetchingTags) return;
    isFetchingTags = true;
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
    var parseContent = localStorage.getItem("parseContent") == "true" ? true : false;
    var remTotalChat = localStorage.getItem("remTotalChat");

    document.getElementById("useEmogi").checked = useEmoji;
    document.getElementById("parseContent").checked = parseContent;
    document.getElementById("tmpChatHistory")[remTotalChat].selected = true;
    document.getElementById("modalConnectionUri").value = localStorage.getItem("modalConnectionUri");

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
            isFetchingTags = false;
            // console.log(data.models);
            var modelsList = data.models;
            var modelSelect = document.getElementById("modalList");
            var ragSelect = document.getElementById("ragModallList");
            var downloadedList = document.getElementById("presentModalList");
            downloadedList.innerHTML = modelSelect.innerHTML = ragSelect.innerHTML = "";
            downloadedList.innerHTML = modelSelect.innerHTML = ragSelect.innerHTML = "<option disabled selected>Select Modal</option>";

            for (i = 0; i < modelsList.length; i++) {
                var tmpOption = document.createElement("option");
                tmpOption.value = modelsList[i].name;
                tmpOption.innerHTML = modelsList[i].name + " " + modelsList[i].details.parameter_size;

                var selectedModal = localStorage.getItem("ollamaModal");
                var selectedRagModal = localStorage.getItem("ollamaRagModal");

                if (selectedModal == modelsList[i].name) {
                    tmpOption.selected = true;
                }

                var tmpOptionClone = tmpOption.cloneNode(true);
                var tmpRagClone = tmpOption.cloneNode(true);
                //Select selected rag modal
                if (selectedRagModal == modelsList[i].name) {
                    tmpRagClone.selected = true;
                }

                downloadedList.appendChild(tmpOptionClone);
                if (isModalPresent(modelsList[i].name, "Embedding")) {
                    ragSelect.appendChild(tmpRagClone);
                } else {
                    modelSelect.appendChild(tmpOption);
                }
            }
            setMessage("settingsMessage", "<img class='customIcon' src='static/images/verify.gif' />Modal loaded successfully", 0);
            setMessage("downloadMessage", "<img class='customIcon' src='static/images/verify.gif' />Modal loaded successfully", 0);
            if (data.models) setDownloadModalList(data.models);
            localStorage.setItem("ModalWorking", 1);
            showElement("modalErrorDiv", false);
            showElement("chatContainer", true);
        })
        .catch((error => {
            isFetchingTags = false;
            var modelSelect = document.getElementById("modalList");
            modelSelect.innerHTML = "";
            setTimeout(function () { setMessage("settingsMessage", `<img class='customIcon' src='static/images/cross.gif' />Unable to connect to ollama.Please check server running or not through below url.<br><a target='_blank' href='${apiUrl}'>${apiUrl}<a><br><span class='text-success'> To install or make of ollama server click <a href='https://github.com/ollama/ollama/tree/main#user-content-ollama'>here</a> or download from Download Modal Section</span>`, 1) }, 100);
            setMessage("downloadMessage", "<img class='customIcon' src='static/images/cross.gif' />Not able to connect with modal.Please check in Modal Settings Section", 1);
            localStorage.setItem("ModalWorking", 0);
            showElement("modalErrorDiv", true);
            showElement("chatContainer", false);
            console.error('There was a problem with the fetch operation:', error);
        }));

}
