'use strict';

$(function () {

    function notePlusCreate() {
        if (!$('#history').length) {
            return;
        }

        var journalList   = $('#history .journal'),
            noteNumberMax = journalList.length,
            currentUrl    = $(location).attr('href'),
            currentUrls   = currentUrl.split('#'),
            noteNumber    = '';

        if (currentUrls[1]) {
            var noteText = currentUrls[1].split('-'),
                type     = noteText[0];

            if (type === 'note') {
                noteNumber = noteText[1];
            }
        }

        var notePlus = '' +
            '<div class="note-plus">' +
            // '   <span class="direction top"><i class="fa fa-step-backward rotate" aria-hidden="true"></i></span>' +
            '   <span class="direction up"><i class="fa fa-chevron-up" aria-hidden="true"></i></span>' +
            '   <input type="text" class="note-number" value="' + noteNumber + '" />' +
            '   <span class="direction down"><i class="fa fa-chevron-down" aria-hidden="true"></i></span>' +
            // '   <span class="direction end"><i class="fa fa-step-forward rotate" aria-hidden="true"></i></span>' +
            '   <span class="move"><i class="fa fa-arrows" aria-hidden="true"></i></span>' +
            '</div>'
        ;

        $('body').append(notePlus);

        var elNotePlus   = $('.note-plus'),
            elNoteNumber = $('.note-number');

        // animate content of note plus
        elNotePlus
            .draggable({
                axis       : 'y',
                containment: 'window',
                scroll     : false,
                handle     : '.move'
            })
            .hide()
            .animate({width: 'toggle'}, 500)
        ;

        // get note plus position
        var notePos  = elNotePlus.offset(),
            notePosX = notePos.left,
            notePosY = notePos.top;

        // event on input note
        elNoteNumber
            .click(function () {    // select value of note number after click
                $(this).select();
            })
            .on('keypress keyup blur', function (event) {   // only allow numeric
                elNoteNumber.val(elNoteNumber.val().replace(/[^\d].+/, ''));

                if ((event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            })
            .keyup(function (e) {    // change note number
                if (e.keyCode === 8) {
                    return;
                }
                var noteNumberNew = elNoteNumber.val();

                if (noteNumberNew > noteNumberMax) {
                    noteNumberNew = noteNumberMax;
                } else if ($.isNumeric(noteNumberNew) && noteNumberNew < 1) {
                    noteNumberNew = 1;
                }

                elNoteNumber.val(noteNumberNew);
                noteNumber = noteNumberNew;

                gotoNote();

                elNoteNumber.focus();
            })
            .focus(function () {    // keep css of note focus
                elNotePlus.addClass('on-focus');
            })
            .focusout(function () { // remove css of note after focusout
                elNotePlus.removeClass('on-focus');
            });

        /**
         * Goto note
         */
        function gotoNote() {
            if (!noteNumber || !$.isNumeric(noteNumber) || noteNumber < 0) {
                return;
            }

            var contentNote = $('#note-' + noteNumber),
                noteLink    = contentNote.find('a.journal-link');

            window.location = noteLink.attr('href');
        }

        // up note
        $('.direction.up').click(function () {
            if (noteNumber > 1) {
                elNoteNumber.val(--noteNumber);
                gotoNote();
                elNoteNumber.blur();
            }
        });

        // down note
        $('.direction.down').click(function () {
            if (noteNumber < noteNumberMax) {
                elNoteNumber.val(++noteNumber);
                gotoNote();
                elNoteNumber.blur();
            }
        });
    }

    notePlusCreate();

});
