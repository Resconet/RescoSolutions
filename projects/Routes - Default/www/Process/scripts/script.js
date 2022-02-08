
let buttons = document.querySelectorAll('.handler-button');
let arrows = document.querySelectorAll('.arrow');
let arrowsBackground = document.querySelectorAll('.arrow-background');

document.addEventListener('DOMContentLoaded', function () {
    
    onStateChange();

    let buttonsContainer = document.querySelector('#buttons-container');
    buttonsContainer.addEventListener('click', function(event) {
        if(event.target.classList.contains('handler-button') && (!event.target.classList.contains('disabled'))) {
            let action = event.target.getAttribute('action');
            var stateName = null;
            if (action === "travel") {
                stateName = _stateNames.Travel;
            } else if (action === "work") {
                stateName = _stateNames.Work;
            } else if (action === "complete") {
                stateName = _stateNames.Completed;
            } else if (action === "break") {
                stateName = _stateNames.Break;
            }

            activateState(stateName, onStateChange);
        }
    });
});


function complete() {
    for(let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add('disabled');
    }
    document.querySelector('.progress-line').style.backgroundColor = '#20A200';
    let itemsEl = document.querySelectorAll('.progress-line-item');
    for(let i = 0; i < itemsEl.length; i++) {
        if(itemsEl[i].classList.contains('break')) itemsEl[i].classList.remove('break');
    }
    changeButtonState(buttons[0], "Travel", "work");
    changeButtonState(buttons[1], "Work", "work");
}

function onStateChange() {

    getCurrentState(function (stateObj) {
        renderProgress(stateObj);
        changeButtons(stateObj);
    });
    
}

function changeButtons(stateObj) {

    // button texts require localization
    var TravelTxt = MobileCRM.Localization.getTextOrDefault("Routes.Buttons.Travel", "Travel");
    var TravelResumeTxt = MobileCRM.Localization.getTextOrDefault("Routes.Buttons.TravelResume", "Resume Travelling");
    var WorkTxt = MobileCRM.Localization.getTextOrDefault("Routes.Buttons.Work", "Work");
    var WorkResumeTxt = MobileCRM.Localization.getTextOrDefault("Routes.Buttons.WorkResume", "Resume Work");
    var BreakTxt = MobileCRM.Localization.getTextOrDefault("Routes.Buttons.Break", "Break");
    var CompleteTxt = MobileCRM.Localization.getTextOrDefault("Routes.Buttons.Complete", "Complete");

    if (stateObj.State === _stateNames.Scheduled) {
        changeButtonState(buttons[0], TravelTxt, "travel");
        changeButtonState(buttons[1], WorkTxt, "work");
    } else if (stateObj.State === _stateNames.Travel && stateObj.BreakActive == false) {
        changeButtonState(buttons[0], BreakTxt, "break");
        changeButtonState(buttons[1], WorkTxt, "work");
    } else if (stateObj.State === _stateNames.Travel && stateObj.BreakActive == true) {
        changeButtonState(buttons[0], TravelResumeTxt, "travel");
        changeButtonState(buttons[1], WorkTxt, "work");
    } else if (stateObj.State === _stateNames.Work && stateObj.BreakActive == false) {
        changeButtonState(buttons[0], BreakTxt, "break");
        changeButtonState(buttons[1], CompleteTxt, "complete");
    } else if (stateObj.State === _stateNames.Work && stateObj.BreakActive == true) {
        changeButtonState(buttons[0], WorkResumeTxt, "work");
        changeButtonState(buttons[1], CompleteTxt, "complete");
    } else {
        changeButtonState(buttons[0], TravelTxt, "travel");
        changeButtonState(buttons[1], WorkTxt, "work");
    }
}

function changeButtonState(button, name, action) {
    button.innerHTML = name;
    button.setAttribute('action', action);
}

function calculateLevel(stateObj) {
    if (stateObj.State == _stateNames.Scheduled)
        return 1;
    if (stateObj.State == _stateNames.Travel)
        return 2;
    if (stateObj.State == _stateNames.Work)
        return 3;
    if (stateObj.State == _stateNames.Completed)
        return 4;
}

function renderProgress(stateObj) {    

    let items = document.querySelectorAll('.progress-line-item');    

    // level indicates progress in process bar
    var level = calculateLevel(stateObj);

    for (let k = 0; k < items.length; k++) {
        if (items[k].classList.contains('break')) items[k].classList.remove('break');
        if (items[k].classList.contains('selected')) items[k].classList.remove('selected');
        if (items[k].classList.contains('done')) items[k].classList.remove('done');
        if (k + 1 != level) {
            items[k].classList.add('selected', 'done');
        } else {
            if (stateObj.BreakActive === true) {
                items[k].classList.add('break');
                break;
            }
            items[k].classList.add('selected');
            break;
        }
    }
    if (level == 4) {
        // arrows[].style.opacity = 1;
        arrowsBackground[2].style.opacity = 1;
        complete();
    }
    if (level >= 3) {
        arrowsBackground[2].style.borderColor = "transparent transparent transparent #F2F2F2";
        arrows[2].style.borderColor = "transparent transparent transparent #20A200";
        arrows[2].style.opacity = 1;
        arrowsBackground[1].style.opacity = 1;
    }
    if (level >= 2) {
        arrowsBackground[1].style.borderColor = "transparent transparent transparent #F2F2F2";
        arrows[1].style.opacity = 1;
        arrowsBackground[0].style.opacity = 1;
        arrows[1].style.borderColor = "transparent transparent transparent #20A200";
    }
    if (level >= 1) {
        arrows[0].style.opacity = 1;
    }

    if (stateObj.BreakActive) {
        if (level == 2) {
            arrows[1].style.borderColor = "transparent transparent transparent #D9AB0F";
        } else if (level == 3) {
            arrows[2].style.borderColor = "transparent transparent transparent #D9AB0F";
        }
    }
}
