// ==UserScript==
// @name         Magiccards.info checklist preview of images
// @description  enter something useful

// @namespace    http://magiccards.info/
// @version      1.0
// @grant        none
// @author       Petter

// @namespace    https://github.com/petterm/Magiccards.info-checklist-image-preview
// @repository   https://github.com/petterm/Magiccards.info-checklist-image-preview.git
// @license      MIT
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
//
// @include      http://magiccards.info/*.html
//
// @updateURL    https://github.com/petterm/Magiccards.info-checklist-image-preview/blob/master/magiccards-preview.user.js
// @downloadURL  https://github.com/petterm/Magiccards.info-checklist-image-preview/blob/master/magiccards-preview.user.js
// @homepage     https://github.com/petterm/Magiccards.info-checklist-image-preview


// ==/UserScript==

jQuery('head').append('<link rel="stylesheet" href="https://cdn.rawgit.com/jninnes/mtgicons/v1.2.1/dist/mtgicons.css" />');

jQuery(function($) {
    
    var preview = $('<div id="__test" style="position: fixed; top: 20px; right: 20px;"></div>').appendTo('body');
    var pImage = $('<img src="" />').appendTo(preview);
    
    preview.on('mouseenter', function() {
        preview.hide();
    });
    
    var replaceManaSymbols = function(html) {
        var reg = /(\d*)([XYZWUBRG]*)/.exec(html);
        var parts = reg[2].split('');
        var result = '<i class="mtg mana-' + reg[1] + '"></i>';
        $.each(parts, function(key, value){
            result += '<i class="mtg mana-' + value.toLowerCase() + '"></i>';
        });
        
        return result;
    };

    var activePreview = undefined;
    var showPreview = function(link) {
        var cardUrl = link.attr('href');
        activeTooltip = cardUrl;
        $.get(cardUrl, function(document) {
            if (activeTooltip == cardUrl) {
                var image = /"(http:\/\/magiccards.info\/scans.+\.jpg)"/.exec(document);
                pImage.attr('src', image[1]);
                preview.show();
                //preview.appendTo(link.parent());
            }
        });
    };
    
    var hidePreview = function() {
        //preview.detach().hide();
    };
    
    // Mana symbols
    $('table tr[class="even"] td:nth-child(4), table tr[class="odd"] td:nth-child(4)').each(function(){
        var $this = $(this);
        var html = $this.html();
        if (/^\d*[XYZWUBRG]*$/.test(html) && html != '') {
            $this.html(replaceManaSymbols(html));
        }
    });
    
    // Cardname tooltip
    $('table tr[class="even"] td:nth-child(2) a, table tr[class="odd"] td:nth-child(2) a').each(function(){
        var $this = $(this);
        $this.on('mouseenter', function(){
            showPreview($this);
        });
        
        $this.on('mouseleave', function(){
            hidePreview();
        });
    });

});