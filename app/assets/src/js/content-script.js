'use strict';

$(function () {


    var journalList = $('#history .journal'),
        journalNumber = journalList.length
    ;
    
    console.log(13113);

    journalList.each(function () {
        var journal = $(this);
    });

    var notePlus = '' +
        '<div class="note-plus">' +
        '   <span class="up"><i class="fa fa-chevron-up" aria-hidden="true"></i></span>' +
        '</div>'
    ;

    $('body').append(notePlus);

});
