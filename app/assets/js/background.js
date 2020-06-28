'use strict';

console.log('\'Allo \'Allo! Event Page for Browser Action');

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === 'install' || details.reason === 'update') {
        console.info('This is a '+ details.reason);

        var storageVars = [
            'position'
        ];

        chrome.storage.sync.get(storageVars, function (storage) {
            if (typeof storage.position === 'undefined') {
                var position = {
                    top: 100,
                    left: null
                };

                chrome.storage.sync.set({position: position}, function () {
                    console.info('Position is: ', position);
                });
            }
        });
    }
});
