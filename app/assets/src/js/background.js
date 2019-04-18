'use strict';

console.log('\'Allo \'Allo! Event Page for Browser Action');

// chrome.storage.sync.clear();

// the extension has been installed/updated
chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);

    var storageVars = [
        'workingDays',
        'workTimeStart',
        'workTimeEnd',
        'isNotification',
        'isUseNewStyle',
        'isMoveActionButton'
    ];

    /**
     * Setting default values
     */
    chrome.storage.sync.get(storageVars, function (result) {
        if (result.workingDays) {
            console.info('Working days: ' + result.workingDays + ' (0 (for Sunday) through 6 (for Saturday)');
        } else {
            // 0 (for Sunday) through 6 (for Saturday)
            var workingDays = [1, 2, 3, 4, 5];
            chrome.storage.sync.set({workingDays: workingDays}, function () {
                console.info('Working days is set to: ' + workingDays);
            });
        }

        // setting start time working days
        if (result.workTimeStart) {
            console.info('Working time start: ' + result.workTimeStart);
        } else {
            // save working time end if not set
            var workTimeStart = '08:00:00';
            chrome.storage.sync.set({workTimeStart: workTimeStart}, function () {
                console.info('Value of working start is set to: ' + workTimeStart);
            });
        }

        // setting end time working days
        if (result.workTimeEnd) {
            console.info('Working time end: ' + result.workTimeEnd);
        } else {
            // save working time end if not set
            var workTimeEnd = '17:00:00';
            chrome.storage.sync.set({workTimeEnd: workTimeEnd}, function () {
                console.info('Value of working end is set to: ' + workTimeEnd);
            });
        }

        // setting desktop notification
        if (typeof result.isNotification !== 'undefined') {
            console.info('Desktop notifications is: ' + (result.isNotification ? 'yes' : 'no'));
        } else {
            // setting desktop notification default is allow
            chrome.storage.sync.set({isNotification: 1}, function () {
                console.info('Desktop notifications is set to: yes');
            });
        }

        // use new style
        if (typeof result.isUseNewStyle !== 'undefined') {
            console.info('Use new style is: ' + (result.isUseNewStyle ? 'yes' : 'no'));
        } else {
            // setting desktop notification default is allow
            chrome.storage.sync.set({isUseNewStyle: 1}, function () {
                console.info('Use new style is set to: yes');
            });
        }

        // use new style
        if (typeof result.isMoveActionButton !== 'undefined') {
            console.info('Move action button is: ' + (result.isMoveActionButton ? 'yes' : 'no'));
        } else {
            // setting desktop notification default is allow
            chrome.storage.sync.set({isMoveActionButton: 1}, function () {
                console.info('Move action button is set to: yes');
            });
        }
    });
});

//chrome.browserAction.setBadgeText({text: 'Notice'});

// add notification for check-in
var noticeCheckIn = function () {
    var opt = {
        type              : 'basic',
        title             : 'Ieyasu Plus',
        message           : 'Begin of working hours. Check-in! :)',
        iconUrl           : '../assets/dist/img/icon-128.png',
        buttons           : [
            {
                title: 'Open the site'
            },
            {
                title: 'Close'
            }
        ],
        requireInteraction: true
    };

    chrome.notifications.create('warningCheckIn', opt, function (id) {
        if (chrome.runtime.lastError) {
            console.error(id + ':' + chrome.runtime.lastError.message);
        }
    });
};

// add notification for checkout
var noticeCheckOut = function () {
    var opt = {
        type              : 'basic',
        title             : 'Ieyasu Plus',
        message           : 'End of working hours. Checkout! :)',
        iconUrl           : '../assets/dist/img/icon-128.png',
        buttons           : [
            {
                title: 'Open the site'
            },
            {
                title: 'Close'
            }
        ],
        requireInteraction: true
    };

    chrome.notifications.create('warningCheckOut', opt, function (id) {
        if (chrome.runtime.lastError) {
            console.error(id + ':' + chrome.runtime.lastError.message);
        }
    });
};

var isWorkingDate = function (workingDays) {
    var date      = new Date(),
        dayInWeek = date.getDay();

    // set notification checkout only workdays: 1 to 5 is Monday to Friday
    if (workingDays.indexOf(dayInWeek) === -1) {
        return false;
    }

    return true;
};

/**
 * Check check-in
 */
chrome.storage.sync.get(['checkInTime', 'workTimeEnd', 'isNotification', 'workingDays'], function (result) {
    if (!result.isNotification || !isWorkingDate(result.workingDays) || moment().format('HH:mm:ss') > result.workTimeEnd) {
        return;
    }

    if (!result.checkInTime ||
        moment(result.checkInTime, 'x').format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')
    ) {
        noticeCheckIn();
    }
});

/**
 * Check checkout
 */
chrome.storage.sync.get(['checkInTime', 'checkOutTime', 'workTimeEnd', 'isNotification', 'workingDays'], function (result) {
    // not is working date or check-in
    if (!result.isNotification || !isWorkingDate(result.workingDays)
        //|| !result.checkInTime ||
        //moment(result.checkInTime, 'x').format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD') // today is not check-in
    ) {
        return;
    }

    // not check out in today
    if (moment(result.checkOutTime, 'x').format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD') &&
        moment().format('HH:mm:ss') > result.workTimeEnd
    ) {
        noticeCheckOut();
    }
});

/**
 * Open link checkout
 */
chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
    if (buttonIndex === 0) {
        chrome.tabs.create({url: 'https://ieyasu.co/timestamp'});
    }
});

var countdownCheckout = null;

/**
 * Set notification checkout only workdays
 */
var timeoutCheckoutFn = function () {
    chrome.storage.sync.get(['checkInTime', 'checkOutTime', 'workTimeEnd', 'isNotification', 'workingDays'], function (result) {
        var today = moment().format('YYYY-MM-DD');

        // today is check-in and is checkout
        if (!result.isNotification || !isWorkingDate(result.workingDays) ||
            (result.checkOutTime && moment(result.checkOutTime, 'x').format('YYYY-MM-DD') === today)
        ) {
            console.log('adada hhhhd');
            return;
        }

        var now         = moment(),
            workEndTime = moment().format('YYYY-MM-DD ' + result.workTimeEnd);

        // milliseconds from now to work time end
        var ms = moment(workEndTime, 'YYYY-MM-DD HH:mm:ss').diff(now);

        if (ms > 0) {
            var timeCountDown = moment.utc(ms).format('HH:mm:ss');
            countdownCheckout = setTimeout(noticeCheckOut, ms);

            // reset auto countdown everyday
            chrome.storage.sync.set({isCountdown: true}, function () {
                console.info('Countdown is set to: On');
            });

            console.info('Countdown check out in: ' + timeCountDown);
        } else {
            console.info('Working time end');
        }
    });
};

timeoutCheckoutFn();

/**
 * Listener event from tabs
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.info('The request is ' + (sender.tab ? 'from a content script: ' + sender.tab.url : 'from the extension'));

    switch (request.action) {
        case 'setTimeoutCheckout':
            // clear timeout old
            if (countdownCheckout) {
                clearTimeout(countdownCheckout);
            }

            timeoutCheckoutFn();
            sendResponse({message: '[From background] The set timeout checkout function is called.'});
            break;

        case 'clearTimeoutCheckout':
            if (countdownCheckout) {
                clearTimeout(countdownCheckout);
                console.info('The timeout checkout function is clear.');
            }
            sendResponse({message: '[From background] The timeout checkout function is clear.'});
            break;

        default:
            sendResponse({message: '[From background] No action.'});
            break;
    }
});

// chrome.tabs.onRemoved.addListener(function (tabid, removed) {
//     alert("tab closed");
// });

// chrome.windows.onRemoved.addListener(function (windowid) {
//     alert("window closed");
// });
