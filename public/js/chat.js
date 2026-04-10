import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
//CLIENT SEND DATA
document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('.chat .inner-body');
  if (body) body.scrollTop = body.scrollHeight;
});
const formSendData=document.querySelector(".chat .inner-form");
if(formSendData){
    formSendData.addEventListener("submit",(e)=>{
        e.preventDefault();
        const content=e.target.elements.content.value;
        if(content){
            socket.emit("CLIENT_SEND_MESSAGE",content);
            e.target.elements.content.value="";
        }
    })
}

//end CLIENT SEND DATA

//Server return message
socket.on("SERVER_RETURN_MESSAGE",(data)=>{
    const myId=document.querySelector("[my-id]").getAttribute("my-id");
    const body=document.querySelector(".chat .inner-body");
    const div=document.createElement("div");
    let htmlFullname="";
    if(myId==data.userId){
        div.classList.add("inner-outgoing");
    }
    else{
         div.classList.add("inner-coming");
         htmlFullname= `<div class="inner-name" >${data.fullName}</div> `;
    }
   



    div.innerHTML=`
        ${htmlFullname}
        <div class="inner-content" >${data.content}</div>`;
    
    body.appendChild(div);
     body.scrollTop = body.scrollHeight;
})




//End Server return message

//emoji-picker
//icon
const buttonIcon=document.querySelector(".button-icon");
const emojiPicker=document.querySelector('emoji-picker');
const tooltip = document.querySelector('.tooltip');
 if(buttonIcon){
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip);
    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
  };
 };


// đóng khi click ra ngoài
document.addEventListener('click', (e) => {
  const isClickInsideButton = buttonIcon.contains(e.target);
  const isClickInsideTooltip = tooltip.contains(e.target);
  if (!isClickInsideButton && !isClickInsideTooltip && tooltip.classList.contains('shown')) {
    tooltip.classList.remove('shown');
  }
});

// đóng khi nhấn Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && tooltip.classList.contains('shown')) {
    tooltip.classList.remove('shown');
  }
});

//end icon

if(emojiPicker){
    
    const inputChat=document.querySelector(".chat .inner-form input[name='content']");
    emojiPicker.addEventListener('emoji-click', (event) => {
        
        const icon=event.detail.unicode;
        
        inputChat.value=inputChat.value + icon;
        console.log( inputChat.value);
       
    });
}


//end emoji-picker

