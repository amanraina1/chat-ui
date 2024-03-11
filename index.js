let leftSide = document.querySelector(".left-side");
const input = document.getElementById("search-input");

const url = "https://my-json-server.typicode.com/codebuds-fk/chat/chats";
let data = null;

window.addEventListener("load", () => getData());

//Filter on the basis of title or order id
input.addEventListener("keyup", (e) => {
  data = data.filter(
    (item) =>
      item.title.includes(e.target.value) ||
      item.orderId.includes(e.target.value)
  );
  fullDetails(data);
  console.log(e.target.value);
});

async function getData() {
  const res = await fetch(url);
  data = await res.json();
  fullDetails(data);
  // console.log(data);
}

function fullDetails(data) {
  const element = document.getElementById("chat");
  const chatTemplate = document.getElementById("template-left-card");
  element.innerHTML = "";
  data.forEach((detail) => {
    const chatClone = chatTemplate.content.cloneNode(true);
    fillDataInCard(chatClone, detail);
    element.appendChild(chatClone);
  });
}

function fillDataInCard(chatClone, data) {
  const day = new Date(data.latestMessageTimestamp).getDay();
  const month = new Date(data.latestMessageTimestamp).getMonth();
  const year = new Date(data.latestMessageTimestamp).getFullYear();

  const findId = chatClone.querySelector(".chat-ui");
  const productImg = chatClone.querySelector("img");
  const productTitle = chatClone.querySelector("h3");
  const orderId = chatClone.querySelector("h4");
  const productDetails = chatClone.querySelector("p");
  const productDate = chatClone.querySelector(".date");

  findId.id = data.orderId;

  productImg.src = data.imageURL;
  productTitle.innerHTML = data.title;
  orderId.innerHTML = data.orderId;
  productDetails.innerHTML = `${
    data.messageList.length > 0 ? data.messageList[0].message : ""
  }`;
  productDate.innerHTML = `${day}/${month}/${year}`;
}

function collapse(id) {
  //For collapsing and expanding the right side
  const rightSide = document.getElementById("right-side");

  // To add bg color on the selcted product
  let prevId = null;
  const selectedProduct = document.getElementById(id);
  const allProducts = document.querySelectorAll(".chat-ui");
  allProducts.forEach((allProduct) => {
    //To remove the bg color of prev selected product
    if (allProduct.classList[1] === "active") {
      prevId = allProduct.id;
      allProduct.classList.remove("active");
    }
  });
  if (prevId === id) {
    if (leftSide.style.width === "50%") {
      leftSide.style.width = "100%";
      rightSide.style.display = "none";
      selectedProduct.classList.remove("active");
    }
  } else {
    leftSide.style.width = "50%";
    rightSide.style.width = "50%";
    rightSide.style.display = "block";
    selectedProduct.classList.add("active");
  }

  //Elements for the right side
  const product = data.find((detail) => detail.orderId === id);
  const messageTemplate = document.getElementById("template-right-card");
  rightSide.innerHTML = "";
  const messageClone = messageTemplate.content.cloneNode(true);
  const productImage = messageClone.querySelector("img");
  const productTitle = messageClone.querySelector("h2");
  const productMessage = messageClone.querySelector("#texting");
  fillMessages(productMessage, product);
  productImage.src = product.imageURL;
  productTitle.innerHTML = product.title;
  rightSide.appendChild(messageClone);
}

function fillMessages(element, product) {
  // If no message is in the chat, then this this message will be displayed
  if (product.messageList.length === 0) {
    const noMessage = document.createElement("div");
    noMessage.id = "msg";
    noMessage.innerHTML = "Send a Message to Start Chatting";
    element.appendChild(noMessage);
    return;
  }
  product.messageList?.forEach((message) => {
    const hours = new Date(message.timestamp).getHours();
    const minutes = new Date(message.timestamp).getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";

    if (message.messageType === "text") {
      // For text message
      let div = document.createElement("div");
      let span = document.createElement("span");
      span.innerHTML = `${hours}:${minutes} ${ampm}`;
      div.id = message.sender;
      let textMessage = document.createElement("p");
      textMessage.innerHTML = message.message;
      textMessage.appendChild(span);
      div.appendChild(textMessage);
      element.appendChild(div);
    } else {
      // For optioned message
      let ele = document.createElement("div");
      ele.id = message.sender;
      let textMessage = document.createElement("p");
      textMessage.innerHTML = message.message;
      ele.appendChild(textMessage);
      element.appendChild(ele);
      if (message.options?.length > 0) {
        message.options.forEach((option) => {
          const div = document.createElement("div");
          div.innerHTML = option.optionText;
          div.id = "optionText";
          if (option.optionSubText) {
            const subText = document.createElement("div");
            subText.innerHTML = option.optionSubText;
            subText.id = "subText";
            div.appendChild(subText);
          }

          ele.appendChild(div);
        });
      }
    }
  });
}

function updateMessages() {
  const writeMessage = document.getElementById("write-message");
  const textElement = document.getElementById("texting");
  const userMessages = document.createElement("div");
  userMessages.id = "USER";
  if (writeMessage.value === "") return;

  const removeMessage = document.getElementById("msg");
  console.log(removeMessage);
  if (removeMessage) {
    removeMessage.remove();
  }

  const paragraphElement = document.createElement("P");
  paragraphElement.innerHTML = writeMessage.value;

  userMessages.appendChild(paragraphElement);

  textElement.insertBefore(userMessages, textElement.firstChild);
  writeMessage.value = "";
}
