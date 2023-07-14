window.jframe = (() => {
  // Save the last place the user exited the window in local storage
  //var lastPosition = {0,0}
  function savePosition(x, y) {
    window.localStorage.setItem(
      "lastMouseLeavePosition",
      JSON.stringify({
        x: x,
        y: y,
      })
    );
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
  document.addEventListener("mouseleave", function (event) {
    savePosition(event.clientX, event.clientY);
  });

  var loadIframe = function (url, width = 400, height = 400) {
    var lastMouseLeavePosition = loadPosition();
    var wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.top = (lastMouseLeavePosition.y || 0) + "px";
    wrapper.style.left = (lastMouseLeavePosition.x || 0) + "px";
    wrapper.style.border = "1px solid black"; // Add a border for resizing
    wrapper.style.resize = "both"; // Enable resizing
    wrapper.style.overflow = "auto"; // Enable scrolling when content exceeds wrapper size
    wrapper.style.width = `${width}px`;
    wrapper.style.height = `${height}px`;
    document.body.appendChild(wrapper);

    var topBar = document.createElement("div");
    topBar.style.width = "100%";
    topBar.style.height = "25px"; // Adjust the height as needed
    topBar.style.backgroundColor = "lightgray"; // Set the color of the top bar
    topBar.style.cursor = "move"; // Set the cursor to indicate draggable area
    topBar.style.position = "absolute";
    topBar.style.top = "0";
    topBar.style.left = "0";
    wrapper.appendChild(topBar);

    var closeButton = document.createElement("span");
    closeButton.innerHTML = "x";
    closeButton.addEventListener("click", function () {
      wrapper.remove();
    });
    closeButton.style.position = "absolute";
    closeButton.style.top = "0px";
    closeButton.style.right = "5px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "16px";
    closeButton.style.fontWeight = "bold";
    closeButton.style.color = "black";
    topBar.appendChild(closeButton);

    var isDragging = false;
    var dragOffsetX = 0;
    var dragOffsetY = 0;

    topBar.addEventListener("mousedown", function (event) {
      isDragging = true;
      dragOffsetX = event.clientX - wrapper.offsetLeft;
      dragOffsetY = event.clientY - wrapper.offsetTop;
    });

    document.addEventListener("mousemove", function (event) {
      if (isDragging) {
        wrapper.style.left = event.clientX - dragOffsetX + "px";
        wrapper.style.top = event.clientY - dragOffsetY + "px";
      }
    });

    document.addEventListener("mouseup", function () {
      isDragging = false;
    });

    var iframeWrapper = document.createElement("div");
    iframeWrapper.style.width = "100%";
    iframeWrapper.style.height = "calc(100% - 25px)"; // Adjust the height to leave space for the top bar
    iframeWrapper.style.overflow = "hidden"; // Hide the scrollbars
    iframeWrapper.style.position = "absolute";
    iframeWrapper.style.top = "25px";
    iframeWrapper.style.left = "0px";
    wrapper.appendChild(iframeWrapper);

    var iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none"; // Remove iframe border
    iframeWrapper.appendChild(iframe);
  };
  return loadIframe;
})();
