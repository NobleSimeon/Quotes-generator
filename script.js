console.log("It is working");

const quoteText = document.querySelector(".quote");
const author = document.querySelector(".author");
const newQuoteBtn = document.querySelector(".new-quote"),
  volumeUpBtn = document.querySelector(".volume-up"),
  copyBtn = document.querySelector(".copy"),
  shareBtn = document.querySelector(".share");

let quote_id = "";

async function updateQuote() {
  console.log("I was clciked");
  newQuoteBtn.innerText = "Loading...";
  newQuoteBtn.classList.add("active");
  let defaultEndPoint = "https://api.quotable.io/random";
  const queryParams = new URLSearchParams(window.location.search);

  if (queryParams.has("_id")) {
    let quoteEndPoint = queryParams.get("_id");
    defaultEndPoint = `https://api.quotable.io/quotes/${quoteEndPoint}`;
  }
  const response = await fetch(defaultEndPoint);
  const data = await response.json();
  if (response.ok) {
    console.log(data);
    quoteText.innerText = data.content;
    author.innerText = `- ${data.author}`;
    newQuoteBtn.classList.remove("active");
    newQuoteBtn.innerText = "New Quote";
  } else {
    quoteText.textContent = "An error occured";
    console.log(data);
  }
  quote_id = data._id;
}

updateQuote();

newQuoteBtn.addEventListener("click", updateQuote);

volumeUpBtn.addEventListener("click", () => {
  let concatenatedText;
  concatenatedText = `"${textConcatenation().quote}." by ${
    textConcatenation().new_text
  }`;
  let utterance = new SpeechSynthesisUtterance();
  utterance.text = concatenatedText;
  console.log(concatenatedText);
  utterance.lang = "en-GB";
  speechSynthesis.speak(utterance);
});

function textConcatenation() {
  let concatenatedText = "";
  let text = author.textContent;
  let words = text.split(" ");
  words.shift();
  let new_text = words.join(" ");

  let quote = quoteText.textContent;
  let lastChar = quote.charAt(quote.length - 1);

  if (lastChar === ".") {
    quote = quoteText.textContent.slice(0, -1);
  }

  concatenatedText = `"${quote}" by ${new_text}.`;
  return {
    concatenatedText,
    quote,
    new_text,
  };
}

copyBtn.addEventListener("click", () => {
  let concatenatedText;
  concatenatedText = textConcatenation().concatenatedText;

  navigator.clipboard.writeText(concatenatedText);

  copyBtn.classList.add("copied");
  setTimeout(() => {
    copyBtn.classList.remove("copied");
  }, 3500);
});

shareBtn.addEventListener("click", () => {
  let concatenatedText;
  concatenatedText = textConcatenation().concatenatedText;

  const data = {
    title: "Quote of the day",
    text: concatenatedText,
    url: `https://simone-quote-gen.netlify.app/?_id=${quote_id}`,
  };
  navigator.share(data);
});

// async function shareQuote() {
//   const canvas = await takeScreenshot();
//   const blob = await getBlobFromCanvas(canvas);
//   const file = new File([blob], 'quote.png', { type: 'image/png' });

// let concatenatedText;
// concatenatedText = textConcatenation();

// const data = {
//   title: "Quote of the day",
//   text: concatenatedText,
//   // files: [file]
// };

//   try {
//     await navigator.share(data);
//   } catch (error) {
//     console.error('Sharing failed', error);
//   }
// }

// function takeScreenshot() {
//   return new Promise(resolve => {
//     html2canvas(document.body).then(canvas => {
//       resolve(canvas);
//     });
//   });
// }

// function getBlobFromCanvas(canvas) {
//   return new Promise(resolve => {
//     canvas.toBlob(blob => {
//       resolve(blob);
//     });
//   });
// }
