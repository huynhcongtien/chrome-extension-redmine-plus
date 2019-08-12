'use strict';

var RedminePlus = function () {
    this.elHistory         = $('#history');
    this.elNotePlus        = null;
    this.elNoteNumber      = null;
    this.noteNumberCurrent = '';
    this.noteNumberMax     = $('#history .journal').length;
    // this.directionClass = 'direction';
    this.elDirectionUp     = null;
    this.elDirectionDown   = null;

    var self        = this,
        storageVars = [
            'position'
        ]
    ;

    chrome.storage.sync.get(storageVars, function (storage) {
        self.storage = storage;
        self.createNotePlus();
        self.disableDirection();
        self.popupImage();
    });
};

RedminePlus.prototype.createNotePlus = function () {
    var self = this;

    if (!self.elHistory.length) {
        return;
    }

    self.getNoteNumberCurrent();

    var notePlus = '' +
        '<div class="note-plus">' +
        '   <span class="direction top"><i class="fa fa-angle-double-up" aria-hidden="true"></i></span>' +
        '   <span class="direction up"><i class="fa fa-angle-up" aria-hidden="true"></i></span>' +
        '   <input type="text" class="note-number" value="' + self.noteNumberCurrent + '" />' +
        '   <span class="direction down"><i class="fa fa-angle-down" aria-hidden="true"></i></span>' +
        '   <span class="direction bottom"><i class="fa fa-angle-double-down" aria-hidden="true"></i></span>' +
        '   <span class="move"><i class="fa fa-arrows" aria-hidden="true"></i></span>' +
        '</div>'
    ;

    $('body').append(notePlus);

    self.setDirectionElement();
    self.elNotePlus   = $('.note-plus');
    self.elNoteNumber = self.elNotePlus.find('.note-number');

    var elNotePlus   = self.elNotePlus,
        elNoteNumber = self.elNoteNumber
    ;

    // animate content of note plus
    elNotePlus
        .hide()
        .animate({width: 'toggle'}, 500)
        .css({
            top: self.storage.position.top
        })
        .draggable({
            axis       : 'y',
            containment: 'window',
            scroll     : false,
            handle     : '.move',
            stop       : function () {
                self.updatePosition();
            }
        })
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

            self.goToNote();

            elNoteNumber.focus();
        })
        .focus(function () {    // keep css of note focus
            elNotePlus.addClass('on-focus');
        })
        .focusout(function () { // remove css of note after focusout
            elNotePlus.removeClass('on-focus');
        })
    ;
};

/**
 * Setup direction element
 */
RedminePlus.prototype.setDirectionElement = function () {
    var self = this;

    self.elDirectionUp   = $('.direction.up:not(.disabled)');
    self.elDirectionDown = $('.direction.down:not(.disabled)');

    // up note
    self.elDirectionUp.click(function () {
        if (self.noteNumberCurrent > 1) {
            self.elNoteNumber.val(--self.noteNumberCurrent);
            self.goToNote();
            self.elNoteNumber.blur();
        }
    });

    // down note
    self.elDirectionDown.click(function () {
        if (self.noteNumberCurrent < self.noteNumberMax) {
            self.elNoteNumber.val(++self.noteNumberCurrent);
            self.goToNote();
            self.elNoteNumber.blur();
        }
    });

    $('.direction.top:not(.disabled)').click(function () {
        self.goToTop();
    });

    $('.direction.bottom:not(.disabled)').click(function () {
        self.goToBottom();
    });
};

/**
 * Update position of note plus
 */
RedminePlus.prototype.updatePosition = function () {
    var self     = this,
        position = self.elNotePlus.position()
    ;

    chrome.storage.sync.set({position: position});
};

/**
 * Get note number by link
 * @param {string} link
 * @return int|null
 */
RedminePlus.prototype.getNoteNumberByLink = function (link) {
    if (!link) {
        return null;
    }

    var links      = link.split('#'),
        noteNumber = 0
    ;

    $.each(links, function () {
        var hash     = this,
            noteText = hash.split('-'),
            type     = noteText[0],
            value    = noteText[1]
        ;

        if (type === 'note' && $.isNumeric(value)) {
            noteNumber = noteText[1];
            return false;
        }
    });

    return noteNumber;
};

/**
 * Get note number current
 */
RedminePlus.prototype.getNoteNumberCurrent = function () {
    var self       = this,
        currentUrl = $(location).attr('href')
    ;

    self.noteNumberCurrent = self.getNoteNumberByLink(currentUrl);
};

/**
 * Update note number
 */
RedminePlus.prototype.updateNoteNumber = function () {
    var self = this;

    self.getNoteNumberCurrent();
    self.elNoteNumber.val(self.noteNumberCurrent);
};

/**
 * Setup disable direction element
 */
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

/**
 * Go to note
 */
RedminePlus.prototype.goToNote = function () {
    var self = this;

    if (!self.noteNumberCurrent || !$.isNumeric(self.noteNumberCurrent) || self.noteNumberCurrent < 0) {
        return;
    }

    self.disableDirection();

    var contentNote = $('#note-' + self.noteNumberCurrent),
        noteLink    = contentNote.find('a.journal-link')
    ;

    window.location = noteLink.attr('href');
};

/**
 * Go to top of page
 */
RedminePlus.prototype.goToTop = function () {
    $('html, body').animate({scrollTop: 0}, 'fast');
};

/**
 * Go to bottom of page
 */
RedminePlus.prototype.goToBottom = function () {
    $('html, body').animate({scrollTop: $(document).height()}, 'fast');
};

/**
 * Initialize popup show image
 */
RedminePlus.prototype.popupImage = function () {
    var self     = this,
        listImg  = [],
        imgOrder = 0
    ;

    $('.wiki img').each(function () {
        var elImg = $(this);

        if (!elImg.closest('.contextual').length) {
            var imgSrc      = elImg.attr('src'),
                imgTitle    = elImg.attr('title'),
                paths       = imgSrc.split('/'),
                imgName     = paths[paths.length - 1],
                journalLink = elImg.closest('.journal').find('.journal-link').attr('href'),
                noteNumber  = self.getNoteNumberByLink(journalLink)
            ;

            listImg.push({
                src        : imgSrc,
                _title     : imgTitle || imgName,
                _link      : journalLink || '',
                _noteNumber: noteNumber
            });

            elImg
                .addClass('magnific')
                .data('magnific-id', imgOrder)
            ;

            imgOrder++;
        }
    });

    $('img.magnific').on('click', function () {
        var elImg    = $(this),
            orderImg = elImg.data('magnific-id')
        ;

        self.openPopupImg(listImg, orderImg);
    });

};

/**
 * Popup show image
 *
 * @param {Array} listImg
 * @param {int} index
 */
RedminePlus.prototype.openPopupImg = function (listImg, index) {
    var self = this;

    $.magnificPopup.open({
        gallery  : {
            enabled: true
        },
        type     : 'image',
        items    : listImg,
        image    : {
            titleSrc: function (item) {
                var link = '<a href="' + item.data._link + '">#note-' + item.data._noteNumber + '</a>';

                if (!item.data._link) {
                    link = 'Description';
                }

                return '(In ' + link + ')' + ' ' + item.data._title;
            }
        },
        callbacks: {
            beforeOpen: function () {
                self.elNotePlus.hide();
            },
            close     : function () {
                self.elNotePlus.show();
            }
        }
    }, index);
};

/**
 * Document ready
 */
$(function () {

    var redminePlus = new RedminePlus();

    console.log(redminePlus);

    $(window).on('hashchange', function () {
        redminePlus.updateNoteNumber();
    });

});
