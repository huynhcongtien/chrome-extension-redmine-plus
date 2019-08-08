'use strict';

// $(function () {
//
//     function notePlusCreate() {
//
//     }
//
//     notePlusCreate();
//
// });

var RedminePlus = function () {
    this.init();
    this.createNotePlus();
    this.disableDirection();
};

RedminePlus.prototype.init = function () {
    this.elHistory         = $('#history');
    this.noteNumberCurrent = '';
    this.noteNumberMax     = 0;
    // this.directionClass = 'direction';
    this.elDirectionUp     = null;
    this.elDirectionDown   = null;
};

RedminePlus.prototype.setDirectionElement = function () {
    this.elDirectionUp   = $('.direction.up:not(.disabled)');
    this.elDirectionDown = $('.direction.down:not(.disabled)');
};

RedminePlus.prototype.createNotePlus = function () {
    var self = this;

    if (!self.elHistory.length) {
        return;
    }

    var journalList = self.elHistory.find('.journal'),
        currentUrl  = $(location).attr('href'),
        currentUrls = currentUrl.split('#'),
        noteNumber  = ''
    ;

    self.noteNumberMax = journalList.length;

    if (currentUrls[1]) {
        var noteText = currentUrls[1].split('-'),
            type     = noteText[0];

        if (type === 'note') {
            self.noteNumberCurrent = noteText[1];
        }
    }

    var notePlus = '' +
        '<div class="note-plus">' +
        // '   <span class="direction top"><i class="fa fa-step-backward rotate" aria-hidden="true"></i></span>' +
        '   <span class="direction up"><i class="fa fa-chevron-up" aria-hidden="true"></i></span>' +
        '   <input type="text" class="note-number" value="' + self.noteNumberCurrent + '" />' +
        '   <span class="direction down"><i class="fa fa-chevron-down" aria-hidden="true"></i></span>' +
        // '   <span class="direction end"><i class="fa fa-step-forward rotate" aria-hidden="true"></i></span>' +
        '   <span class="move"><i class="fa fa-arrows" aria-hidden="true"></i></span>' +
        '</div>'
    ;

    $('body').append(notePlus);

    self.setDirectionElement();

    var elNotePlus   = $('.note-plus'),
        elNoteNumber = $('.note-number')
    ;

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
        notePosY = notePos.top
    ;

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

            if (noteNumberNew > self.noteNumberMax) {
                noteNumberNew = self.noteNumberMax;

            } else if ($.isNumeric(noteNumberNew) && noteNumberNew < 1) {
                noteNumberNew = 1;
            }

            elNoteNumber.val(noteNumberNew);
            self.noteNumberCurrent = noteNumberNew;

            self.gotoNote();

            elNoteNumber.focus();
        })
        .focus(function () {    // keep css of note focus
            elNotePlus.addClass('on-focus');
        })
        .focusout(function () { // remove css of note after focusout
            elNotePlus.removeClass('on-focus');
        })
    ;

    // var elDirectionUp   = $('.direction.up:not(.disabled)'),
    //     elDirectionDown = $('.direction.down:not(.disabled)')
    // ;
    //
    // function disableDirection() {
    //     if (self.noteNumberCurrent === 1) {
    //         elDirectionUp.addClass('disabled');
    //     } else if (self.noteNumberCurrent === self.noteNumberMax) {
    //         elDirectionDown.addClass('disabled');
    //     } else {
    //         elDirectionUp.removeClass('disabled');
    //         elDirectionDown.removeClass('disabled');
    //     }
    // }
    //
    // disableDirection();

    /**
     * Goto note
     */
    // function gotoNote() {
    //     if (!noteNumber || !$.isNumeric(noteNumber) || noteNumber < 0) {
    //         return;
    //     }
    //
    //     disableDirection();
    //
    //     var contentNote = $('#note-' + noteNumber),
    //         noteLink    = contentNote.find('a.journal-link');
    //
    //     window.location = noteLink.attr('href');
    // }

    // up note
    self.elDirectionUp.click(function () {
        if (self.noteNumberCurrent > 1) {
            elNoteNumber.val(--self.noteNumberCurrent);
            self.gotoNote();
            elNoteNumber.blur();
        }
    });

    // down note
    self.elDirectionDown.click(function () {
        if (self.noteNumberCurrent < self.noteNumberMax) {
            elNoteNumber.val(++self.noteNumberCurrent);
            self.gotoNote();
            elNoteNumber.blur();
        }
    });
};

RedminePlus.prototype.disableDirection = function () {
    var self = this;

    if (self.noteNumberCurrent === 1) {
        self.elDirectionUp.addClass('disabled');
    } else if (self.noteNumberCurrent === self.noteNumberMax) {
        self.elDirectionDown.addClass('disabled');
    } else {
        self.elDirectionUp.removeClass('disabled');
        self.elDirectionDown.removeClass('disabled');
    }
};

RedminePlus.prototype.gotoNote = function () {
    var self = this;

    if (!self.noteNumberCurrent || !$.isNumeric(self.noteNumberCurrent) || self.noteNumberCurrent < 0) {
        return;
    }

    self.disableDirection();

    var contentNote = $('#note-' + self.noteNumberCurrent),
        noteLink    = contentNote.find('a.journal-link');

    window.location = noteLink.attr('href');
};

var x = new RedminePlus();

console.log(x);
