// Save the last place the user exited the window in local storage
function savePosition(x, y) {
    window.localStorage.setItem("lastMouseLeavePosition", JSON.stringify({
      "x": x,
      "y": y
    }));
  }
  
  // Load the last place the user exited the window from local storage
  function loadPosition() {
    var position = window.localStorage.getItem("lastMouseLeavePosition");
    if (position) {
      return JSON.parse(position);
    }
    return null;
  }
  
  // Handler for the mouseleave event
  document.addEventListener("mouseleave", function(event) {
    // Get the current mouse position
    var currentMousePosition = event.clientX,
        currentMouseY = event.clientY;
      savePosition(currentMousePosition, currentMouseY);
    
  });

  window.iframe = {entry:()=>{
    var lastMouseLeavePosition = loadPosition();
    loadIframe("https://links.jeremyfletcher.net", 500, 300, lastMouseLeavePosition)
  }};

  function loadIframe(url, width, height, lastMouseLeavePosition) {

  
    // Create a wrapper for the iframe
    var wrapper = document.createElement("div");
    wrapper.style.width = width + "px";
    wrapper.style.height = height + "px";
    wrapper.style.position = "fixed";
    wrapper.style.top = "0px";
    wrapper.style.left = (lastMouseLeavePosition.x || 0) + "px";
    document.body.appendChild(wrapper);
  
    var iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.width = width;
    iframe.height = height;
    wrapper.appendChild(iframe);
  
    // Add an "x" to the wrapper that will close the iframe when clicked
    var closeButton = document.createElement("span");
    closeButton.innerHTML = "x";
    closeButton.addEventListener("click", function() {
        wrapper.remove();
    });
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.color = "red";
    wrapper.appendChild(closeButton);
  }

  function loadBox(lastMouseLeavePosition) {
    var box = document.createElement("div");
    box.style.position = "fixed";
    box.style.left = (lastMouseLeavePosition.x || 0) + 'px'
    box.style.top = 0
    box.style.width = "100px";
    box.style.height = "100px";
    box.style.backgroundColor = "red";
    document.body.appendChild(box);

    // Add an "x" to the box that will close it when clicked
    var closeButton = document.createElement("button");
    closeButton.innerHTML = "x";
    closeButton.addEventListener("click", function() {
      box.remove();
    });
    box.appendChild(closeButton);
  }
  
  