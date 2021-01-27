'use strict';

import jQuery from 'jquery';

window.$ = window.jQuery = jQuery;

require('select2');
require('jquery-ui');
require('magnific-popup');

var RedminePlus = function () {
    this.elHistory         = $('#history');
    this.elNotePlus        = null;
    this.elNoteNumber      = null;
    this.noteId            = this.getNoteId();
    this.noteNumberCurrent = '';
    this.noteNumberMax     = $('#history .journal').length;
    // this.directionClass = 'direction';
    this.elDirectionUp     = null;
    this.elDirectionDown   = null;
    this.input_new_style   = [];

    var self        = this,
        storageVars = [
            'position'
        ]
    ;

    chrome.storage.sync.get(storageVars, function (storage) {
        self.storage = storage;
        self.getNoteNumberCurrent();
        self.createNotePlus();
        self.highlightCurrentNote();
        self.disableDirection();
        self.popupImage();
    });

    // do function
    this.listeningNoteUpdate();
    this.addButtonGetInfoSubTask();
    this.createLinkLogTimeOnWorkTime();
};

RedminePlus.prototype.getNoteId = function () {
    const currentLink = window.location.href,
          findId      = currentLink.match(/issues\/(\d+)/)
    ;

    if (findId) {
        return findId[1];
    }

    return null;
};

RedminePlus.prototype.createNotePlus = function () {
    var self = this;

    if (!self.elHistory.length) {
        return;
    }

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
        noteNumber = ''
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
    self.highlightCurrentNote();
    self.elNoteNumber.val(self.noteNumberCurrent);
};

/**
 * Setup disable direction element
 */
RedminePlus.prototype.disableDirection = function () {
    if (!this.elDirectionUp || !this.elDirectionUp.length) {
        return;
    }

    const self = this;

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
                var link = '' +
                    '<a href="' + item.data._link + '" class="ref-link-note">' +
                    '   #note-' + item.data._noteNumber +
                    '</a>'
                ;

                if (!item.data._link) {
                    link = 'Description';
                }

                return '(In ' + link + ')' +
                    ' <a href="' + item.data.src + '" target="_blank">' +
                    '   ' + item.data._title +
                    '   <i class="fa fa-external-link" aria-hidden="true"></i> ' +
                    '</a>';
            }
        },
        callbacks: {
            beforeOpen: function () {
                if (self.elNotePlus && self.elNotePlus.length) {
                    self.elNotePlus.hide();
                }
            },
            close     : function () {
                if (self.elNotePlus && self.elNotePlus.length) {
                    self.elNotePlus.show();
                }
            }
        }
    }, index);

    // event close image popup when click on link of image
    $('body').on('click', '.ref-link-note', function () {
        $.magnificPopup.close();
    });
};

RedminePlus.prototype.listeningNoteUpdate = function () {
    let target         = $('.journal'),
        // Options for the observer (which mutations to observe)
        observerConfig = {childList: true},
        observer       = []
    ;

    $.each(target, function (index) {
        const elJournal = $(this);
        // create an observer instance
        observer[index] = new MutationObserver(function (mutationRecordsList) {
            mutationRecordsList.forEach(function (mutationRecord) {
                console.log(mutationRecord);
                if (mutationRecord.addedNodes.length) {
                    let addedNode         = $(mutationRecord.addedNodes[0]),
                        elTotalAndBtnCard = addedNode.find('[class^="totalAndSubmit"]')
                    ;

                    console.log(addedNode);

                    if (!elTotalAndBtnCard.length) {
                        return true;
                    }
                }
            });
        })
        ;
        // pass in the target node, as well as the observer options
        observer[index].observe(elJournal[0], observerConfig);
    });


    $('body').on('click', '[accesskey="r"]', function () {
        // let elPreview = $(this),
        //     elJournal=elPreview.closest('.journal'),
        // idJournal=elJournal.
        // elShowPreview = elForm.find('[id^=journal')
        // ;
    });
};

/**
 * Add button get details of sub tasks
 */
RedminePlus.prototype.addButtonGetInfoSubTask = function () {
    let getSubTaskClass = '';

    if (!$('#issue_tree .list.issues > tbody > tr').length) {
        getSubTaskClass = 'disabled';
    }

    $('#issue_tree .contextual')
        .append('' +
            '<a href="javascript:void(0)" class="get-sub-detail red-btn-link ' + getSubTaskClass + '">' +
            '   <i class="fa fa-get-pocket" aria-hidden="true"></i>' +
            '   Get details of sub tasks' +
            '</a>'
        )
        .find('a')
        .addClass('red-btn-link')
        .end()
        .find('a:first-child')
        .prepend('<i class="fa fa-plus" aria-hidden="true"></i>\n');

    const self = this;

    $('body').on('click', '.get-sub-detail:not(.disabled)', function () {
        self.getDetailSubTask();
    });
};

RedminePlus.prototype.convertDayOfMonthToText = function (day) {
    if (isNaN(day)) {
        return '';
    }

    switch (day) {
        case 0:
            return 'Sun';
        case 1:
            return 'Mon';
        case 2:
            return 'Tue';
        case 3:
            return 'Wed';
        case 4:
            return 'Thu';
        case 5:
            return 'Fri';
        case 6:
        default:
            return 'Sat';

    }
};

RedminePlus.prototype.highlightCurrentNote = function () {
    const self        = this;
    let elCurrentNote = $('#note-' + self.noteNumberCurrent).closest('.journal');

    if (!self.noteNumberCurrent) {
        const resultRegex = /#(change-\d+)/.exec(window.location.href);

        if (resultRegex) {
            elCurrentNote = $('#' + resultRegex[1]);
        }
    }

    $('#history .journal').removeClass('selected');

    elCurrentNote.addClass('selected');
};

RedminePlus.prototype.getDetailSubTask = function () {
    const self               = this,
          elGetDetailSubTask = $('.get-sub-detail'),
          listTask           = $('#issue_tree .list.issues > tbody > tr'),
          countTask          = listTask.length
    ;
    let countAjaxCompleted   = 0;

    elGetDetailSubTask
        .addClass('disabled')
        .find('.fa')
        .removeClass('fa-get-pocket')
        .addClass('fa-refresh fa-spin')
    ;

    listTask.each(function () {
        const elTr             = $(this),
              elSubject        = elTr.find('.subject'),
              issueId          = elTr.find('.checkbox input').val(),
              elStatus         = elSubject.next(),
              statusText       = elStatus.text(),
              now              = new Date(),
              elEstimatedHours = elTr.find('.estimated-hours'),
              elStartDate      = elTr.find('.start-date'),
              elDueDate        = elTr.find('.due-date'),
              textLoading      = '----Loading----'
        ;

        if (!elStartDate.length) {
            elSubject
                .next()
                .next()
                .after('' +
                    '<td class="estimated-hours">' + textLoading + '</td>' +
                    '<td class="start-date">' + textLoading + '</td>' +
                    '<td class="due-date">' + textLoading + '</td>'
                )
            ;
        } else {
            elEstimatedHours.text(textLoading);
            elStartDate.text(textLoading);
            elDueDate.text(textLoading).removeClass('danger');
        }

        $.ajax({
            url     : window.location.origin + '/issues/' + issueId + '.json',
            type    : 'get',
            dataType: 'json'
        }).done(function (response) {
            countAjaxCompleted++;

            if (countAjaxCompleted === countTask) {
                elGetDetailSubTask
                    .removeClass('disabled')
                    .find('.fa')
                    .addClass('fa-get-pocket')
                    .removeClass('fa-refresh fa-spin')
                ;
            }

            const issueData           = response.issue,
                  subject             = issueData.subject,
                  estimatedHours      = issueData.estimated_hours || '-',
                  startDate           = issueData.start_date,
                  startDateObj        = new Date(issueData.start_date),
                  startDateOfWeek     = startDateObj.getDay(),
                  startDateOfWeekText = self.convertDayOfMonthToText(startDateOfWeek),
                  classStartDay       = (startDateOfWeek === 0 || startDateOfWeek === 6) ? 'warn' : ''
            ;

            let dueDateOfWeekText = '-',
                classDueDay       = '',
                classDueDate      = '',
                dueDate           = ''
            ;

            if (issueData.due_date) {
                const dueDateObj     = new Date(issueData.due_date),
                      duetDateOfWeek = dueDateObj.getDay()
                ;

                dueDate           = issueData.due_date;
                dueDateOfWeekText = '(' + self.convertDayOfMonthToText(duetDateOfWeek) + ')';
                classDueDay       = (duetDateOfWeek === 0 || duetDateOfWeek === 6) ? 'warn' : '';
                classDueDate      = (statusText === 'In Progress' && (
                    (
                        now.getFullYear() + '-' + (now.getMonth() < 10 ? '0' : '') +
                        now.getMonth() + '-' + (now.getDate() < 10 ? '0' : '') + now.getDate()
                    ) >
                    (
                        dueDateObj.getFullYear() + '-' + (dueDateObj.getMonth() < 10 ? '0' : '') +
                        dueDateObj.getMonth() + '-' + (dueDateObj.getDate() < 10 ? '0' : '') + dueDateObj.getDate()
                    )
                )) ? 'danger' : '';
            }

            const htmlSubjectTask = elTr.find('.subject a')[0].outerHTML;

            elTr
                .find('.subject')
                .html(htmlSubjectTask + ': ' + subject)
                .end()
                .find('.estimated-hours')
                .html(estimatedHours)
                .end()
                .find('.start-date')
                .html('<span class="' + classStartDay + '">(' + startDateOfWeekText + ')</span> ' + startDate)
                .end()
                .find('.due-date')
                .addClass(classDueDate)
                .html('<span class="' + classDueDay + '">' + dueDateOfWeekText + '</span> ' + dueDate)
            ;
        });
    });
};

RedminePlus.prototype.createLinkLogTimeOnWorkTime = function () {
    if (!$('.controller-work_time').length) {
        return;
    }

    const elTableMonthlyReport = $('input[value="data download"]').prev('table'),
          elList               = elTableMonthlyReport.find('tbody tr td:first-child'),
          elHref               = elList.find('a')
    ;

    elHref.each(function () {
        console.log($(this));
    });
};

RedminePlus.prototype.addClassForInputs = function (content) {
    content
        .find('input:not(:submit,:button, :checkbox), textarea')
        .addClass('red-form-control')
        .end()
        .find('input:submit')
        .addClass('red-btn red-btn-sm red-btn-primary')
        .end()
        .find('input:button')
        .addClass('red-btn red-btn-sm red-btn-secondary')
    ;
};

RedminePlus.prototype.updateIssueFrom = function (url) {
    const self = this;

    $.ajax({
        url    : url,
        type   : 'post',
        data   : $('#issue-form').serialize(),
        success: function () {
            const content = $('#all_attributes');

            content
                .find('select')
                .select2({
                    width: 'resolve'
                })
            ;

            self.addClassForInputs(content);
            self.addClassForLabel();
        }
    });
};

RedminePlus.prototype.addClassForLabel = function () {
    $('.red-form-control, .select2-hidden-accessible').each(function () {
        var elInput = $(this),
            elLabel = elInput.prev()
        ;

        if (elLabel.length) {
            elLabel.addClass('red-label-control');
        }
    });
};

/**
 * Document ready
 */
$(function () {

    var redminePlus = new RedminePlus();

    $(window).on('hashchange', function () {
        redminePlus.updateNoteNumber();
    });

    // $('#update, #new_time_entry, #quick-search, #issue_extensions_search, ' +
    //     '#new-relation-form, #issue-form, #my_account_form, #filters-table, .add-filter,' +
    //     '#query_form, #tab-content-info, #content'
    // )

    $('#update, #new_time_entry, #issue-form, .edit_time_entry, #quick-search, .controller-search')
        .find('select')
        .each(function () {
            var elSelect = $(this);
            elSelect.select2({
                width: 'resolve'
            });
        })
        .end()
        .each(function () {
            var elContent = $(this);
            redminePlus.addClassForInputs(elContent);
        })
    ;

    $('#project_quick_jump_box').on('change', function () {
        const href           = $(this).val();
        window.location.href = window.location.origin + href;
    });

    $('body').on('change', '#issue_tracker_id', function () {
        const link = '/projects/beer/issues/update_form.js' + (redminePlus.noteId ? ('?id=' + redminePlus.noteId) : '');
        redminePlus.updateIssueFrom(link);
    });


    //$('[name="datepicker"]').addClass('red-form-control');

    // $('[name="project_id"], [name="meeting_rooms"]').select2({
    //     width: 'resolve'
    // });

    $('.contextual .icon-edit').click(function () {
        $('#update select')
            .select2('destroy')
            .select2({
                width: 'resolve'
            })
        ;
    });

    redminePlus.addClassForLabel();

    // change style of text for code
    $('.editable').each(function () {
        var elEditable   = $(this),
            textOriginal = elEditable.html(),
            textNew      = textOriginal.replace(/`(.*?)`/gm, '<code class="txt-code">$1</code>')
        ;

        elEditable.html(textNew);
    });

    // Get the header
    const elSubject = $('#content .subject h3');

    if (elSubject.length) {
        const headerOffsetLeft = elSubject.offset().left - 10,
              sticky           = elSubject.offset().top
        ;

        // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
        function stickySubject() {
            if (window.pageYOffset > sticky) {
                elSubject.css('left', headerOffsetLeft + 'px ');
                elSubject
                    .closest('.issue')
                    .addClass('sticky')
                ;
            } else {
                elSubject.css('left', '');
                elSubject
                    .closest('.issue')
                    .removeClass('sticky')
                ;
            }
        }

        // When the user scrolls the page, execute myFunction
        window.onscroll = function () {
            stickySubject();
        };
    }

    // auto scroll to bottom of attachments
    const elAttachments = $('.attachments');

    if (elAttachments.length) {
        elAttachments.scrollTop(elAttachments.height() + 50);
    }

});
