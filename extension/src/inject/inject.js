    chrome.extension.sendMessage({}, function(response) {
        var readyStateCheckInterval = setInterval(function() {
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
                        setTimeout(function() {
                            defer(method)
                        }, 50);
                    }
                }

                // now do the actual stuff
                defer(function() {
                    console.log("jQuery is now loaded");

                    let $share_bar = $('.gig-share-bar-container');
                    if ($share_bar.length) {

                        let $link_container = $($.parseHTML(`
                        <div>TEST</div>
                    `));

                        console.log($link_container);

                        $link_container.css({
                            border: '1px solid black',
                            padding: '1rem',
                            color: 'red',
                            'margin-left': '1rem'
                        });

                        $share_bar.find('table:first tbody tr:first').append($link_container)

                        console.log($share_bar.find('table:first tbody tr:first'));
                    }

                    let $aside_action = $('.aside-action');
                    let $refer_button = $($.parseHTML(`
                        <div>Refer a mate</div>
                    `));

                    $refer_button.css({
                        float: 'left',
                        display: 'table',
                        'text-align': 'center',
                        color: '#2d2d2d',
                        'letter-spacing': '2px',
                        'text-decoration': 'underline',
                        cursor: 'pointer',
                        position: 'relative',
                        //left: '24%',
                        //transform: 'translate(-50% -50%)',
                        //'padding': '15px 69px',
                        //width: '100 %',
                        //'text-shadow': '00 black',
                        //'font-weight': 'bold',
                        //'text-transform': 'uppercase',
                    });
                    let $refer_modal = $($.parseHTML(`
                            <div id="refer-modal"> Share this link! </div>
                        `));
                    $refer_modal.css({
                        width: '260px',
                        padding: '20px 20px',
                        height: '100px',
                        position: 'relative',
                        border: '1px solid rgba(27, 31, 35, 0.15)',
                        'background-color': 'white',
                        'box-shadow': '0 3px 12px rgba(27,31,35,0.15)',
                        'margin-top': '15px',
                    });
                    $refer_modal.hide();
                    $refer_button.append($refer_modal);
                    $refer_button.click(() => {
                        //alert("refer button cliked");
                        console.log("refer button clicked");
                        console.log($refer_modal);

                        $('#refer-modal').show();


                    });


                    $aside_action.append($refer_button);


                });

                // save to database


            }
        }, 10);
    });
    ``