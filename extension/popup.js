document.addEventListener("DOMContentLoaded", function () {
        const textInput = document.getElementById("textInput");
        const countButton = document.getElementById("countButton");
        const fileInput = document.getElementById("fileInput");
        const countFileButton = document.getElementById("countFileButton");
        const resultParagraph = document.getElementById("result");

  // Count tokens from textarea
        countButton.addEventListener("click", function () {
        const text = textInput.value;
        if (!text) {
                resultParagraph.textContent = "Please enter some text.";
                return;
        }
        countTokens(text);
        });

  // Count tokens from uploaded file
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

  // Function to count tokens
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

  // Function to extract text from a file
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
        // Handle PDF files
                extractTextFromPDF(reader.result).then(resolve).catch(reject);
        } else if (file.type === "text/plain") {
        // Handle plain text files
        reader.readAsText(file);
        } else if (
        file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword"
        ) {
        // Handle Word documents
        extractTextFromWord(file).then(resolve).catch(reject);
        } else {
        reject(new Error("Unsupported file type."));
        }
        });
}

  // Function to extract text from PDF (requires a PDF library)
        function extractTextFromPDF(data) {
    // You'll need a library like pdf.js or pdf-lib for this
    // Example: https://mozilla.github.io/pdf.js/
        return new Promise((resolve, reject) => {
      // Placeholder for PDF text extraction logic
        reject(new Error("PDF text extraction not implemented."));
        });
}

  // Function to extract text from Word documents (requires a library)
        function extractTextFromWord(file) {
    // You'll need a library like mammoth.js for this
    // Example: https://github.com/mwilliamson/mammoth.js
        return new Promise((resolve, reject) => {
      // Placeholder for Word text extraction logic
        reject(new Error("Word document text extraction not implemented."));
        });
        }
});
