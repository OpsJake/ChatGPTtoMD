// ==UserScript==
// @name        ChatGPTtoMD
// @version     3.3
// @author      snacksbtw
// @description Script to allow downloading ChatGPT threads as markdown files.
// @match       https://chat.openai.com/*
// @icon        https://downloads.intercomcdn.com/i/o/258434/f17230ce5dd4837640d30565/87c0a4270d60f2dc4f60b416f8518be6.png

// ==/UserScript==

// Define the h() function as shown in your code
function h(html) {
  return html
    .replace(/<p>/g, '\n\n')
    .replace(/<\/p>/g, '')
    .replace(/<b>/g, '**')
    .replace(/<\/b>/g, '**')
    .replace(/<i>/g, '_')
    .replace(/<\/i>/g, '_')
    .replace(/<code[^>]*>/g, (match) => {
      const lm = match.match(/class="[^"]*language-([^"]*)"/);
      return lm ? '\n```' + lm[1] + '\n' : '```';
    })
    .replace(/<\/code[^>]*>/g, '```')
    .replace(/<[^>]*>/g, '')
    .replace(/Copy code/g, '')
    .replace(
      /This content may violate our content policy. If you believe this to be in error, please submit your feedback — your input will aid our research in this area./g,
      '',
    )
    .trim();
}
// Create a function to get the Title of the selected conversation
function getSelectedConversation() {
    const selectedConversation = document.querySelectorAll('.p-1.hover\\:text-white');
    let fileName;
    if(selectedConversation.length){
      //get the parent element
      let parent = selectedConversation[0].parentNode.parentNode;
      //select the specific div element
      let specificDiv = parent.querySelector('.flex-1.text-ellipsis.max-h-5.overflow-hidden.break-all.relative');
      //get the text content of the specific div element
      fileName = specificDiv.textContent;
    }
    else{
    fileName = "Conversation";
    }
    return fileName
    console.log(fileName)
}
window.addEventListener('load', getSelectedConversation);
// document.addEventListener('DOMContentLoaded', getSelectedConversation);
// Create a function to add the button to the collapsible menu
function addButtonToMenu() {
  // Select the collapsible menu
  const menu = document.querySelector('.flex.h-full.flex-1.flex-col.space-y-1.p-2');
  // If the menu does not exist, try again after a short delay
  if (!menu) {
    setTimeout(addButtonToMenu, 500);
    return;
  }
  const selectedConversation = document.querySelectorAll('.p-1.hover\\:text-white');
  let fileName;
  if(selectedConversation.length){
    //get the parent element
    let parent = selectedConversation[0].parentNode.parentNode;
    //select the specific div element
    let specificDiv = parent.querySelector('.flex-1.text-ellipsis.max-h-5.overflow-hidden.break-all.relative');
    //get the text content of the specific div element
    fileName = specificDiv.textContent;
  }
  else{
    fileName = "Conversation";
  }
  const button = document.createElement('button');
  button.textContent = 'Download Conversation';
  button.className = 'flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm';

  // Append the button to the menu
  menu.insertBefore(button, menu.firstChild);

  // Call the function to add the button to the menu when the page loads
  button.addEventListener('click', () => {
    const fileName = getSelectedConversation();
    const e = document.querySelectorAll('.text-base');
  let t = '';
  for (const s of e) {
    if (s.querySelector('.whitespace-pre-wrap')) {
      t += `**${s.querySelector('img') ? 'You' : 'ChatGPT'}**: ${h(
        s.querySelector('.whitespace-pre-wrap').innerHTML,
      )}\n\n`;
    }
  }
  const a = document.createElement('a');
  a.download = `${fileName}.md`;
  a.href = URL.createObjectURL(new Blob([t]));
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
  });
}
// Run the addButtonToMenu() and getSelectedConversation function when the page loads
window.addEventListener('load', () => {
    const fileName = getSelectedConversation();
    addButtonToMenu(fileName)
});
