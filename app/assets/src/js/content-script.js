'use strict';

$(function () {


    var journalList = $('#history .journal'),
        journalNumber = journalList.length
    ;

    journalList.each(function () {
        var journal = $(this);
    });

    var notePlus = '' +
        '<div class="note-plus">' +
        '   <span class="direction up"><i class="fa fa-chevron-up" aria-hidden="true"></i></span>' +
        '   <input type="text" class="note-number" />' +
        '   <span class="direction down"><i class="fa fa-chevron-down" aria-hidden="true"></i></span>' +
        '</div>'
    ;

    $('body').append(notePlus);

});
