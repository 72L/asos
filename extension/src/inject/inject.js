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
                console.log("jQuery is now loaded");

                let $share_bar = $('.gig-share-bar-container');
                if ($share_bar.length) {

                    let $link_container = $($.parseHTML(`
                        <div>
                            <img 
                                src="data:image/png;base64,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"/>
                           </div>
                    `));

                    console.log($link_container);

                    $link_container.css({
                        border: '1px solid black',
                        padding: '1rem',
                        color: 'red',
                        'margin-left': '1rem',
                    });

                    $share_bar.find('table:first tbody tr:first').append($link_container)

                    console.log($share_bar.find('table:first tbody tr:first'));
                }


            });

            // save to database


        }
    }, 10);
});