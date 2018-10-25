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
                    //console.log("jQuery is now loaded");

                    let $aside_action = $('.aside-action'); // add_to_bag button
                    let $refer_button = $($.parseHTML(`
                        <div>Refer a mate</div>
                    `)); // refer_button

                    $refer_button.css({
                        float: 'left',
                        display: 'table',
                        'text-align': 'center',
                        color: '#2d2d2d',
                        'letter-spacing': '2px',
                        'text-decoration': 'underline',
                        cursor: 'pointer',
                        position: 'relative',
                    }); /* edit refer_button css */
                    let $popup = $($.parseHTML(`
                            <div id="popup"> Recommend this to a mate
                                <input id="popup_input" type = "text" name = "FirstName" value = "www.asos.co.uk" > 
                                <input id="popup_copy_button" type = "submit" value = "Copy" >
                            </div>
                        `)); // popup window
                    $popup.find('#popup_input').css({}); /* edit css of the input_field in the popup window  */
                    $popup.find('#popup_copy_button').css({}); /* edit css of the "Copy" button in the popup window  */
                    $popup.css({
                        width: '260px',
                        padding: '20px 20px',
                        height: '100px',
                        position: 'relative',
                        border: '1px solid rgba(27, 31, 35, 0.15)',
                        'background-color': 'white',
                        'box-shadow': '0 3px 12px rgba(27,31,35,0.15)',
                        'margin-top': '15px',
                    }); /* edit popup window css */
                    $popup.hide(); // hide popup window when first created
                    $refer_button.append($popup); // attach newly created popup window to refer_button
                    $refer_button.click(() => {
                        $('#popup').show(); // show popup window when refer_button is clicked
                    }); // do stuff when clikcing refer_button


                    $aside_action.append($refer_button); // attach newly created refer_button to add_to_bag button
                });

                // save to database


            }
        }, 10);
    });