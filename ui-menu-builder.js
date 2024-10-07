// Define a flag for the first menu button
let firstMenuButton = true;
const menuhelp = {
  firstMenu: true,
  currentDraggable: null,
  isDragging: false,
  offsetX: 0,
  offsetY: 0
}

/**
 * Adds a mini menu button to the #minimenu element.
 * @param {string} icon - The icon text for the button.
 * @param {string} title - Tooltip and title of the button.
 * @param {function} handler - Function to be called when the button is clicked.
 * @param {function|null} toggle - Optional toggle function to determine active/inactive state.
 */
export function addMiniMenuButton(icon, title, handler, toggle = null) {
  // Ensure that the window object is accessible
  if (!window.top) {
    return;
  }

  // Get the mini menu element
  const menuButtons = window.top.document.querySelector("#minimenu");

  // Exit if the mini menu element is not found
  if (!menuButtons) {
    return;
  }

  // Create the button element
  const button = window.top.document.createElement("div");
  let active = false;

  // If toggle is provided, determine if the button should be active
  if (toggle !== null) {
    active = toggle();
  }

  // Set the button's initial class and style properties
  button.className = "ui-btn-frame p-0 me-1 custom-btn";
  if (active) {
    button.classList.add("item-selected");
  } else {
    button.classList.remove("item-selected");
  }

  // Set the button's size and margins
  button.style.height = "38px";
  button.style.width = "38px";
  button.style.overflow = "hidden";
  if (firstMenuButton) {
    button.style.marginLeft = "calc(var(--px)* 1)";
    firstMenuButton = false;
  }

  // Add tooltip and event listener to handle click actions
  button.setAttribute("data-tooltip", title);
  button.title = title;
  button.addEventListener("click", e => {
    e.preventDefault();
    handler();
    if (toggle !== null) {
      if (toggle()) {
        button.classList.add("item-selected");
      } else {
        button.classList.remove("item-selected");
      }
    }
  });

  // Add the icon to the button
  const buttonText = window.top.document.createElement("span");
  buttonText.innerText = icon;
  buttonText.style.fontSize = "28px";
  buttonText.style.paddingTop = "3px";
  button.appendChild(buttonText);

  // Append the button to the mini menu
  menuButtons.appendChild(button);
}

//w-50 input classname

/**
 * Class representing a button menu tab group UI element with options to add tabs.
 */
class ButtonMenuTabGroup {
  constructor(menu, menuBody) {
    this.menu = menu;
    this.menuBody = menuBody;
  }
  // Private tabbar property
  #tabbar = null;
  #tabContent = null;
  // Private tabs property to store tab elements
  #tabs = [];
  #firstTab = true;
  addTab(text, uiSection = false) {

    if (!this.#tabbar) {
      this.#tabbar = window.top.document.createElement("div");
      this.#tabbar.className = "tabnav d-flex mb-3 p-2";
      this.menuBody.appendChild(this.#tabbar);
    }
    if (!this.#tabContent) {
      this.#tabContent = window.top.document.createElement("div");
      this.#tabContent.className = "tabcontent d-flex flex-column overflow-hidden flex-grow-1";
      this.menuBody.appendChild(this.#tabContent);
    }

    const tab = window.top.document.createElement("div");
    tab.className = "ui-btn-frame flex-grow-1 me-1";

    tab.innerText = text;
    tab.setAttribute("data-toggletarget", `${text}_tabid`);
    this.#tabbar.appendChild(tab);
    this.#tabs.push(tab);

    const tabBody = window.top.document.createElement("div");
    tabBody.id = `${text}_tabid`;
    if (uiSection) {
      tabBody.className = "ui-section d-none";
    } else {
      tabBody.className = "item-bag d-flex overflow-hidden flex-column flex-grow-1 d-none";
    }
    this.#tabContent.appendChild(tabBody);
    if (this.#firstTab) {
      tab.classList.add("active");
      tabBody.classList.remove("d-none");
      this.#firstTab = false;
    }
    return new MenuBuilder(this.menu, tabBody);
  }
}

/**
 * Class representing a button menu UI element with options to add various types of buttons.
 */
class MenuBuilder {
  #menu = null;
  #menuBody = null;
  //#mainBody = null;
  constructor(menu, menuBody) {
    this.#menu = menu;
    this.#menuBody = menuBody;
    //this.#mainBody = menuBody;
  }

  // Private functions to handle simple things
  #SetClassActive(element, className, active) {
    if (active) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }


  // Start new ui-inset-frame
  UiInsetFrame() {
    if (!window.top) {
      return;
    }
    const insetGroup = window.top.document.createElement("div");
    insetGroup.className = "flex-grow-1 ui-inset-frame ui-section mx-1 mb-1";
    this.#menuBody.appendChild(insetGroup);
    return new MenuBuilder(this.#menu, insetGroup);
  }

  // Start new ui-content-frame
  UiContentFrame() {
    if (!window.top) {
      return;
    }
    const contentFrame = window.top.document.createElement("div");
    contentFrame.className = "ui-content-frame tooltip-bag";
    this.#menuBody.appendChild(contentFrame);
    return new MenuBuilder(this.#menu, contentFrame);
  }
  // Start new ui-content-frame
  UiSection() {
    if (!window.top) {
      return;
    }
    const uiSection = window.top.document.createElement("div");
    uiSection.className = "ui-section";
    this.#menuBody.appendChild(uiSection);
    return new MenuBuilder(this.#menu, uiSection);
  }

  // Add stat text label
  addStatTextLabel(statName, statValue) {
    if (!window.top) {
      return;
    }
    const statTextLabel = window.top.document.createElement("div");
    statTextLabel.className = "d-flex justify-content-between";
    const statNameLabel = window.top.document.createElement("span");
    statNameLabel.className = "text-alt";
    statNameLabel.innerText = statName;
    const statValueLabel = window.top.document.createElement("span");
    statValueLabel.className = "statVal";
    statValueLabel.innerText = statValue;
    statTextLabel.appendChild(statNameLabel);
    statTextLabel.appendChild(statValueLabel);
    this.#menuBody.appendChild(statTextLabel);
  }
  /**
  * Adds a labeled text input to the menu with optional constraints.
  *
  * @param {?string} name - The label for the input field.
  * @param {?string} value - The default value for the input field.
  * @param {?string} placeHolder - The placeholder value for the input field.
  * @param {Function} handler - The function to handle input value changes. Receives the new value as a parameter.
  * @param {boolean} [onInput=false] -if true will fire as it changes, false waits for unfocus (optional).
  */
  addTextInput(name, value, placeHolder, handler, onInput=false) {
    if (!window.top) {
      return;
    }

    const textContainer = window.top.document.createElement("div");
    textContainer.className = "d-flex justify-content-between";
    if (name !== null) {
      // Create label for the input field
      const textNameLabel = window.top.document.createElement("span");
      textNameLabel.className = "text-alt";
      textNameLabel.innerText = name;
      textContainer.appendChild(textNameLabel);
    }
    // Create the input field
    const textInput = window.top.document.createElement("input");
    textInput.className = "searchBar flex-grow-1";
    textInput.type = "text";
    if (value !== null) textInput.value = value;
    if (placeHolder !== null) textInput.placeholder = placeHolder

    // Attach change event to the input field
    textInput.addEventListener(onInput ? "input": "change", (e) => {
      e.preventDefault();
      e.stopPropagation();
      handler(e.target.value);
    });

    //input to the container

    textContainer.appendChild(textInput);

    // Append the container to the menu body
    this.#menuBody.appendChild(textContainer);
  }
  // Add Number only input
  /**
 * Adds a labeled number input to the menu with optional constraints.
 *
 * @param {string} name - The label for the input field.
 * @param {number} value - The default value for the input field.
 * @param {number|null} [min=null] - The minimum allowable value (optional).
 * @param {number|null} [max=null] - The maximum allowable value (optional).
 * @param {number|null} [step=null] - The step value for increments (optional).
 * @param {dw} [dw=null] -pass in dw for index value name (optional).
 * @param {Function} handler - The function to handle input value changes. Receives the new value as a parameter.
 */
  addNumberInput(name, value, min = null, max = null, step = null, dw = null, handler) {
    if (!window.top) {
      return;
    }

    const numberOption = window.top.document.createElement("div");
    numberOption.className = "d-flex justify-content-between";

    // Create label for the input field
    const optionNameLabel = window.top.document.createElement("span");
    optionNameLabel.className = "text-alt";
    optionNameLabel.innerText = name;

    // Create the input field
    const optionValue = window.top.document.createElement("input");
    optionValue.className = "searchBar";
    optionValue.style.backgroundColor = "#333";
    optionValue.type = "number";
    optionValue.value = value;
    if (min !== null) optionValue.min = min;
    if (max !== null) optionValue.max = max;
    if (step !== null) optionValue.step = step;

    // Attach change event to the input field
    optionValue.addEventListener("change", (e) => {
      e.preventDefault();
      e.stopPropagation();
      //const num = e.target.valueAsNumber
      // console.group("changed");
      // console.log(num);
      // console.log(e);
      // console.groupEnd();
      handler(e.target.valueAsNumber);
    });

    // Append label and input to the container
    numberOption.appendChild(optionNameLabel);
    numberOption.appendChild(optionValue);

    // Append the container to the menu body
    this.#menuBody.appendChild(numberOption);
  }

  // Add text label
  addTextLabel(text) {
    if (!window.top) {
      return;
    }
    this.#menuBody.appendChild(window.top.document.createTextNode(text));
  }

  // Private flag and property for handling button groups
  #newIconButtonGroup = true;
  #currentIconButtonGroup = null;


  addTabGroup() {
    if (!window.top) {
      return;
    }
    return new ButtonMenuTabGroup(this.#menu, this.#menuBody);
  }

  addScrollbar() {
    if (!window.top) {
      return;
    }
    this.#menuBody.classList.add("scrollbar");
  }
  removeScrollbar() {
    if (!window.top) {
      return;
    }
    this.#menuBody.classList.remove("scrollbar");
  }

  /**
 * Adds a button with an icon to the current button group.
 * @param {string} icon - The icon text for the button.
 * @param {string} tooltip - Tooltip and title of the button.
 * @param {function} handler - Function to be called when the button is clicked.
 * @param {function|null} toggle - Optional toggle function to determine active/inactive state.
 */
  addIconButton(icon, tooltip, handler, toggle = null) {
    if (!window.top) {
      return;
    }

    const menuButtons = this.#menuBody;
    if (!menuButtons) {
      return;
    }

    // Create a new button group if needed
    if (this.#newIconButtonGroup) {
      this.#currentIconButtonGroup = window.top.document.createElement("div");
      this.#currentIconButtonGroup.className = "d-flex flex-wrap item-bag ui-content-frame p-0";
      menuButtons.appendChild(this.#currentIconButtonGroup);
      this.#newIconButtonGroup = false;
    }

    // Create the button element and set its properties
    const button = window.top.document.createElement("div");
    let active = false;
    if (toggle !== null) {
      active = toggle();
    }
    button.className = "ui-btn-frame p-0 me-1 custom-btn";
    if (active) {
      button.classList.add("item-selected");
    } else {
      button.classList.remove("item-selected");
    }
    button.style.height = "38px";
    button.style.width = "38px";
    button.style.overflow = "hidden";
    button.setAttribute("data-tooltip", tooltip);
    button.title = tooltip;

    // Add event listener for button clicks
    button.addEventListener("click", e => {
      console.log(`clicked ${tooltip}`);
      e.preventDefault();
      handler();
      if (toggle !== null) {
        if (toggle()) {
          button.classList.add("item-selected");
        } else {
          button.classList.remove("item-selected");
        }
      }
    });

    // Add the icon to the button
    const buttonText = window.top.document.createElement("span");
    buttonText.innerText = icon;
    buttonText.style.fontSize = "28px";
    buttonText.style.paddingTop = "3px";
    button.appendChild(buttonText);

    // Append the button to the current button group
    this.#currentIconButtonGroup.appendChild(button);
  }

  /**
 * Adds a button with both an icon and text.
 * @param {string} icon - The icon text for the button.
 * @param {string} tooltip - Tooltip of the button.
 * @param {string} text - The text to display on the button.
 * @param {function} handler - Function to be called when the button is clicked.
 * @param {function|null} toggle - Optional toggle function to determine active/inactive state.
 */
  addIconTextButton(icon, tooltip, text, handler, toggle = null) {
    if (!window.top) {
      return;
    }

    const menuButtons = this.#menuBody;
    if (!menuButtons) {
      return;
    }
    this.#newIconButtonGroup = true;

    // Create the button and set its properties
    const { button, buttonContent } = this.#makeButton();
    let active = false;
    if (toggle !== null) {
      active = toggle();
    }
    if (active) {
      button.classList.add("item-selected");
    } else {
      button.classList.remove("item-selected");
    }
    button.style.overflow = "hidden";
    button.setAttribute("data-tooltip", tooltip);
    button.title = tooltip;

    // Add event listener for click events
    button.addEventListener("click", e => {
      console.log(`clicked ${tooltip}`);
      e.preventDefault();
      e.stopPropagation();
      handler();
      if (toggle !== null) {
        console.log(`active: ${toggle()}`);
        if (toggle()) {
          button.classList.add("item-selected");
        } else {
          button.classList.remove("item-selected");
        }
      }
    });

    // Add the icon and text to the button
    const buttonIcon = window.top.document.createElement("div");
    buttonIcon.innerText = icon;
    buttonIcon.style.fontSize = "28px";
    buttonIcon.style.paddingTop = "3px";
    buttonContent.appendChild(buttonIcon);
    buttonContent.insertAdjacentText("beforeend", text);

    // Append the button to the menu body
    menuButtons.appendChild(button);
  }


  addTextToggleButton(tooltip, text, handler, toggle) {
    if (!window.top) {
      return;
    }
    const menuButtons = this.#menuBody;
    if (!menuButtons) {
      return;
    }
    this.#newIconButtonGroup = true;
    const { button, buttonContent } = this.#makeButton();
    let active = false;
    if (toggle !== null) {
      active = toggle();
    }
    //this.#SetClassActive(button, "item-selected", active);

    button.style.overflow = "hidden";
    button.setAttribute("data-tooltip", tooltip);
    button.title = tooltip;
    // checkmark
    const checkmark = window.top.document.createElement("span");
    checkmark.textContent = "✔️";
    checkmark.style.fontSize = "20px";
    buttonContent.appendChild(checkmark);
    this.#SetClassActive(checkmark, "invisible", !active);
    // Add event listener for button clicks
    button.addEventListener("click", e => {
      //console.log(`clicked ${tooltip}`);
      e.preventDefault();
      e.stopPropagation();
      handler();
      if (toggle !== null) {
        console.log(`active: ${toggle()}`);
        //this.#SetClassActive(button, "item-selected", toggle());
        this.#SetClassActive(checkmark, "invisible", !toggle());

      }
    });

    // Add the text to the button
    buttonContent.insertAdjacentText("beforeend", text);

    // Append the button to the menu body
    menuButtons.appendChild(button);
  }




  /**
   * Adds a text-only button to the menu.
   * @param {string} tooltip - Tooltip and title of the button.
   * @param {string} text - The text to display on the button.
   * @param {function} handler - Function to be called when the button is clicked.
   * @param {function|null} toggle - Optional toggle function to determine active/inactive state.
   */
  addTextButton(tooltip, text, handler, toggle = null) {
    if (!window.top) {
      return;
    }

    const menuButtons = this.#menuBody;
    if (!menuButtons) {
      return;
    }
    this.#newIconButtonGroup = true;

    // Create the button and set its properties
    const { button, buttonContent } = this.#makeButton();
    let active = false;
    if (toggle !== null) {
      active = toggle();
    }
    this.#SetClassActive(button, "item-selected", active);
    button.style.overflow = "hidden";
    button.setAttribute("data-tooltip", tooltip);
    button.title = tooltip;

    // Add event listener for button clicks
    button.addEventListener("click", e => {
      console.log(`clicked ${tooltip}`);
      e.preventDefault();
      e.stopPropagation();
      handler();
      if (toggle !== null) {
        console.log(`active: ${toggle()}`);
        if (toggle()) {
          button.classList.add("item-selected");
        } else {
          button.classList.remove("item-selected");
        }
      }
    });

    // Add the text to the button
    buttonContent.insertAdjacentText("beforeend", text);

    // Append the button to the menu body
    menuButtons.appendChild(button);
  }

  /**
 * Adds a title bar to the menu.
 * @param {string} title - The title text to display.
 */
  addUiTitleBar(title) {
    if (!window.top) {
      return;
    }
    this.#newIconButtonGroup = true;

    // Create the title frame and set its text
    const uiTitleFrame = window.top.document.createElement("div");
    uiTitleFrame.className = "ui-title-frame";
    uiTitleFrame.innerText = title;

    // Append the title frame to the menu body
    this.#menuBody.appendChild(uiTitleFrame);
  }
  /**
* Adds a title bar to the menu.
* @param {string} title - The title text to display.
* @param {boolean} defaultActive - The default active state of the title bar.
*/
  UiTitleBarToggleGroup(title, defaultActive) {
    if (!window.top) {
      return;
    }
    this.#newIconButtonGroup = true;

    // Create the title frame and set its text
    const uiTitleFrame = window.top.document.createElement("div");
    uiTitleFrame.className = "ui-title-frame";
    uiTitleFrame.innerText = title;

    const contentFrame = window.top.document.createElement("div");
    contentFrame.className = "ui-content-frame tooltip-bag";
    this.#SetClassActive(contentFrame, "d-none", !defaultActive);

    // Add event listener for button clicks to toggle the content frame
    uiTitleFrame.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      contentFrame.classList.toggle("d-none");
    });
    // Append the title frame and content frame to the menu body
    this.#menuBody.appendChild(uiTitleFrame);
    this.#menuBody.appendChild(contentFrame);
    return new MenuBuilder(this.#menu, contentFrame);
  }

  // Private method to create a button element
  #makeButton() {
    const button = window.top.document.createElement("div");
    button.className = "ui-btn-frame d-flex justify-content-between align-items-center ps-0 me-1";
    const buttonContent = window.top.document.createElement("div");
    buttonContent.className = "d-flex align-items-center";
    button.appendChild(buttonContent);
    return { button, buttonContent };
  }
}

// /**
//  * Class representing a button menu tab UI element with options to add buttons. 
//  */
// class ButtonMenuTab extends ButtonMenu {
//   constructor(menu, menuBody) {
//     super(menu, menuBody);
//   }
// }

/**
 * Creates a new button menu with a title bar.
 * @param {string} icon - The icon text for the mini-menu button.
 * @param {string} title - The title text for both the mini-menu button and the menu.
 * @returns {MenuBuilder} - A ButtonMenu instance to further customize the menu.
 */
export function addButtonMenu(icon, title) {
  if (!window.top) {
    return;
  }

  const UI = window.top.document.querySelector("#ui");
  if (!UI) {
    return;
  }

  if (menuhelp.firstMenu) {
    menuhelp.firstMenu = false;
    console.log("first menu");
    window.top.document.addEventListener('mousemove', function (e) {
      if (menuhelp.isDragging) {
        //console.log("menu start dragging");
        menuhelp.currentDraggable.style.left = e.clientX - menuhelp.offsetX + 'px';
        menuhelp.currentDraggable.style.top = e.clientY - menuhelp.offsetY + 'px';
      }
    });

    window.top.document.addEventListener('mouseup', function () {
      if (menuhelp.isDragging) {
        //console.log("menu stop dragging");
        menuhelp.isDragging = false;
      }
    });

  }

  // Create the menu container and its title frame
  const menu = window.top.document.createElement("div");
  menu.className = "invisible position-absolute translate-middle ui ui-outset-frame d-flex flex-column custom-mnu";
  menu.id = title.replace(/[^a-zA-Z0-9]/g, '');
  menu.style.width = "460px";
  menu.style.maxHeight = "750px"
  menu.style.top = "50%";
  menu.style.left = "50%";
  const uiTitleFrame = window.top.document.createElement("div");
  uiTitleFrame.className = "ui-title-frame";
  menu.appendChild(uiTitleFrame);
  // Add event listener for mouse down event on the title frame
  uiTitleFrame.addEventListener('mousedown', function (e) {
    //console.log("titlebar mouse down");
    menuhelp.currentDraggable = this.parentElement; // Set the parent element (the draggable box) as current
    menuhelp.isDragging = true;
    menuhelp.offsetX = e.clientX - menuhelp.currentDraggable.offsetLeft;
    menuhelp.offsetY = e.clientY - menuhelp.currentDraggable.offsetTop;
  });


  const uiTitle = window.top.document.createElement("span");
  uiTitle.className = "title";
  uiTitle.innerText = title;
  uiTitleFrame.appendChild(uiTitle);

  // Add title buttons and close functionality
  const titleBtnsLeft = window.top.document.createElement("div");
  titleBtnsLeft.className = "title-btns title-btns-left";
  uiTitleFrame.appendChild(titleBtnsLeft);
  const titleBtnsRight = window.top.document.querySelector(".title-btns.title-btns-right").cloneNode(true);
  titleBtnsRight.className = "title-btns title-btns-right";
  uiTitleFrame.appendChild(titleBtnsRight);
  const button = titleBtnsRight.querySelector(".close-ui-window");
  button.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    menu.classList.add("invisible");
    return false;
  });

  // Create the menu body for content
  const menuBody = window.top.document.createElement("div");
  menuBody.className = "ui-content-frame overflow-hidden d-flex flex-column flex-grow-1 item-bag border-0 p-0";
  menu.appendChild(menuBody);

  // Insert the menu into the UI
  const menuElement = UI.querySelector("#menu");
  UI.insertBefore(menu, menuElement);
  var once = true;
  // Add a mini menu button to toggle the visibility of the menu
  addMiniMenuButton(icon, title, () => {
    menu.classList.toggle("invisible");
  });
  return new MenuBuilder(menu, menuBody);
}

/**
 * Adds a button to the minimap UI container.
 * @param {string} icon - The icon text for the button.
 * @param {string} title - Tooltip and title of the button.
 * @param {function} handler - Function to be called when the button is clicked.
 */
export function addMinimapButton(icon, title, handler) {
  if (!window.top) {
    return;
  }

  // Find or create the custom minimap button container
  const minimap = window.top.document.querySelector("#minimap");
  if (!minimap) {
    return;
  }

  let minimapButtons = minimap.querySelector("#custom-minimap-buttons");
  if (!minimapButtons) {
    minimapButtons = window.top.document.createElement("div");
    minimapButtons.id = "custom-minimap-buttons";
    minimapButtons.className = "d-flex position-absolute start-0 ui custom-btn";
    minimapButtons.style.bottom = "-18px";
    minimapButtons.style.fontSize = "16px";
    minimap.appendChild(minimapButtons);
  }

  // Create the minimap button
  const button = window.top.document.createElement("div");
  button.className = "ui-btn-frame p-0 w-9 h-9";
  button.style.bottom = "-21px";
  button.title = title;

  // Add event listener for click action
  button.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    handler();
    return false;
  });

  // Add the icon to the minimap button
  const buttonText = window.top.document.createElement("span");
  buttonText.setAttribute("data-tooltip", title);
  buttonText.innerText = icon;
  buttonText.style.fontSize = "16px";
  button.appendChild(buttonText);

  // Append the button to the minimap buttons container
  minimapButtons.appendChild(button);
}

/**
 * Cleans up and removes all custom buttons and menus when the code is unloaded.
 */
function onUnload() {
  if (!window.top) {
    return;
  }

  const customMenus = window.top.document.querySelectorAll(".custom-mnu");
  for (let i = 0; i < customMenus.length; i++) {
    customMenus[i].remove();
  }

  const customButtons = window.top.document.querySelectorAll(".custom-btn");
  for (let i = 0; i < customButtons.length; i++) {
    customButtons[i].remove();
  }
}

// Add event listener to run onUnload when the window unloads
window.addEventListener("unload", onUnload);
