document.addEventListener("DOMContentLoaded", function () {
        const textInput = document.getElementById("textInput");
        const countButton = document.getElementById("countButton");
        const fileInput = document.getElementById("fileInput");
        const countFileButton = document.getElementById("countFileButton");
        const resultParagraph = document.getElementById("result");

        countButton.addEventListener("click", function () {
        const text = textInput.value;
        if (!text) {
                resultParagraph.textContent = "Please enter some text.";
                return;
        }
        countTokens(text);
        });

        countFileButton.addEventListener("click", function () {
        const file = fileInput.files[0];
        if (!file) {
                resultParagraph.textContent = "Please upload a file.";
                return;
        }
        extractTextFromFile(file)
        .then((text) => countTokens(text))
        .catch((error) => {
                console.error("Error extracting text:", error);
                resultParagraph.textContent = "Failed to extract text from the file.";
        });
        });

        function countTokens(text) {
        try {
                const tokens = GPTTokenizer_cl100k_base.encode(text);
                const tokenCount = tokens.length;
                resultParagraph.textContent = `Token count: ${tokenCount}`;
        } catch (error) {
        console.error("Error counting tokens:", error);
        resultParagraph.textContent = "An error occurred while counting tokens.";
        }
}

        function extractTextFromFile(file) {
        return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                        const text = reader.result;
                        resolve(text);
                };
        reader.onerror = () => {
                reject(new Error("Failed to read the file."));
        };
        if (file.type === "application/pdf") {
                extractTextFromPDF(reader.result).then(resolve).catch(reject);
        } else if (file.type === "text/plain") {
        reader.readAsText(file);
        } else if (
        file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword"
        ) {
        extractTextFromWord(file).then(resolve).catch(reject);
        } else {
        reject(new Error("Unsupported file type."));
        }
        });
}

function extractTextFromPDF(data) {
        return new Promise((resolve, reject) => {
        const loadingTask = pdfjsLib.getDocument({ data });
        loadingTask.promise.then(pdf => {
                let text = "";
                const numPages = pdf.numPages;
                const pagePromises = [];
                for (let i = 1; i <= numPages; i++) {
                        pagePromises.push(pdf.getPage(i).then(page => {
                        return page.getTextContent().then(textContent => {
                        text += textContent.items.map(item => item.str).join(" ");
                });
        }));
        }
                Promise.all(pagePromises).then(() => {
                        resolve(text);
                }).catch(reject);
        }).catch(reject);
});
}

  // Function to extract text from Word documents (requires a library)
        function extractTextFromWord(file) {
                return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function (event) {
                const arrayBuffer = event.target.result;
                mammoth.extractRawText({ arrayBuffer })
                        .then(result => resolve(result.value))
                        .catch(reject);
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
                });
        }
});
