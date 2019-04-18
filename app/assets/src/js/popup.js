'use strict';

// get variables in background
var bkg = chrome.extension.getBackgroundPage();

// variables of chrome storage
var storageVars = [
    'workTimeStart',
    'workTimeEnd',
    'isNotification',
    'isUseNewStyle',
    'isMoveActionButton',
    'checkInTime',
    'checkOutTime',
    'isCountdown',
    'workingDays'
];

chrome.storage.sync.get(storageVars, function (result) {
    new Vue({
        el     : '#app',
        data   : function () {
            var //isWorkDay = bkg.isWorkingDate(result.workingDays),
                today = moment().format('YYYY-MM-DD'),
                data  = {
                    checkInTime      : 'N/A',
                    checkOutTime     : 'N/A',
                    countdownCheckout: 'N/A',
                    isCountdown      : (typeof result.isCountdown === 'undefined' || result.isCountdown === true) ? true : false
                }
            ;

            if (result.checkInTime && moment(result.checkInTime, 'x').format('YYYY-MM-DD') === today) {
                data.checkInTime = moment(result.checkInTime, 'x').format('YYYY-MM-DD HH:mm:ss');
            }

            // if (result.isCountdown) {
            //     data.isCountdown = true;
            // }

            if (result.checkOutTime && moment(result.checkOutTime, 'x').format('YYYY-MM-DD') === today) {
                data.checkOutTime = moment(result.checkOutTime, 'x').format('YYYY-MM-DD HH:mm:ss');
            }

            return data;
        },
        mounted: function () {
            var appVar          = this,
                intervalTrigger = null;

            // function countdown check out
            var countdownFn = function () {
                var now         = moment(),
                    today       = moment().format('YYYY-MM-DD'),
                    workEndTime = moment().format('YYYY-MM-DD ' + result.workTimeEnd);

                try {
                    if (!bkg.isWorkingDate(result.workingDays)) {
                        throw 'Today is not working';
                    }

                    // today is check out
                    if (result.checkOutTime &&
                        moment(result.checkOutTime, 'x').format('YYYY-MM-DD') === today
                    ) {
                        throw 'Today is check out';
                    }

                    if (moment(workEndTime, 'YYYY-MM-DD HH:mm:ss').diff(now) <= 0) {
                        throw 'Working time end';
                    }

                    if (!result.isCountdown) {
                        throw 'Countdown is off';
                    }
                } catch (e) {
                    console.info(e);
                    return null;
                }

                console.info('Countdown is starting');

                var ms       = null,
                    interval = 1000;

                return setInterval(function () {
                    now = moment();
                    // milliseconds from now to work time end
                    ms  = moment(workEndTime, 'YYYY-MM-DD HH:mm:ss').diff(now);

                    if (ms < 0) {
                        appVar.countdownCheckout = 'N/A';
                        clearInterval(intervalTrigger);
                        return;
                    }

                    appVar.countdownCheckout = moment.utc(ms).format('HH:mm:ss');
                }, interval);
            };

            // set trigger interval countdown check out
            intervalTrigger = countdownFn();

            $('.is-countdown').change(function () {
                var elCheckbox  = $(this),
                    isCountdown = elCheckbox.is(':checked') ? true : false;

                chrome.storage.sync.set({isCountdown: isCountdown}, function () {
                    console.info('Countdown is set to: ' + (isCountdown ? 'On' : 'Off'));
                });

                if (isCountdown) {
                    intervalTrigger = countdownFn();  // start countdown check out in popup

                    // call function set timeout check out in background
                    chrome.runtime.sendMessage({action: 'setTimeoutCheckout'}, function (response) {
                        console.info(response.message);
                    });
                } else {
                    appVar.countdownCheckout = 'N/A';
                    clearInterval(intervalTrigger); // stop countdown check out in popup

                    // call function clear timeout check out in background
                    chrome.runtime.sendMessage({action: 'clearTimeoutCheckout'}, function (response) {
                        console.info(response.message);
                    });

                }
            });
        }
    });
});

/**
 * Document ready
 */
$(function () {

    // open link
    $('[data-href]').click(function () {
        var link       = $(this).data('href'),
            samplePage = chrome.extension.getURL(link);

        window.open(samplePage, '_blank');
    });

    /**
     * Function toggle switch
     *
     * @param filter
     */
    $.switcher = function (filter) {
        var $haul = $('input[type=checkbox],input[type=radio]');

        if (filter !== undefined && filter.length) {
            $haul = $haul.filter(filter);
        }

        $haul.each(function () {
            var $checkbox = $(this).hide(),
                $switcher = $(document.createElement('div'))
                    .addClass('ui-switcher')
                    .attr('aria-checked', $checkbox.is(':checked'));

            if ('radio' === $checkbox.attr('type')) {
                $switcher.attr('data-name', $checkbox.attr('name'));
            }

            var toggleSwitch = function (e) {
                if (e.target.type === undefined) {
                    $checkbox.trigger(e.type);
                }
                $switcher.attr('aria-checked', $checkbox.is(':checked'));
                if ('radio' === $checkbox.attr('type')) {
                    $('.ui-switcher[data-name=' + $checkbox.attr('name') + ']')
                        .not($switcher.get(0))
                        .attr('aria-checked', false);
                }
            };

            $switcher.on('click', toggleSwitch);
            $checkbox.on('click', toggleSwitch);

            $switcher.insertBefore($checkbox);
        });
    };

    $.switcher();

});
