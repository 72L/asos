chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            // ----------------------------------------------------------
            // This part of the script triggers when page is done loading
            console.log("Hello. This message was sent from scripts/inject.js");
            // ----------------------------------------------------------

            // wait for jquery to load
            function defer(method) {
                if (window.jQuery) {
                    method();
                } else {
                    setTimeout(function () {
                        defer(method)
                    }, 50);
                }
            }

            // now do the actual stuff
            defer(function () {
                alert("jQuery is now loaded");

                let $share_bar = $('.gig-share-bar-container');
                if ($share_bar.length) {

                    let $link_container = $.parseHTML(`
                        <div>TEST</div>
                    `).css({
                        border: '1px solid black',
                        padding: '1rem',
                        color: 'red'
                    });

                    $share_bar.find('table:first tbody tr:first').append($link_container)

                    console.log($share_bar.find('table:first tbody tr:first'));
                }


            });

            // save to database


        }
    }, 10);
});