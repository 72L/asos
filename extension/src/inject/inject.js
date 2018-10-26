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

                    let $aside_action = $('.aside-action'); // add_to_bag button
                    let $refer_button = $($.parseHTML(`
                        <div>Refer a mate</div>
                    `)); // refer_button
                    /* edit refer_button css */
                    $refer_button.css({
                        float: 'left',
                        padding: '0px 75px',
                        display: 'table',
                        'text-align': 'center',
                        color: '#2d2d2d',
                        'letter-spacing': '2px',
                        'text-decoration': 'underline',
                        cursor: 'pointer',
                        position: 'relative',
                    });
                    let $popup = $($.parseHTML(`
                            <div id = "popup" > 
                                <div id="popup_title"> Recommend this to a mate </div>
                                <input id="popup_input" type = "text" name = "FirstName" value = "${window.location.href}" > 
                                <button id="popup_copy_button"> Copy </button>
                                <img id="facebook_share" src='https://image.flaticon.com/icons/svg/145/145802.svg') > </img>
                                <img id="pinterest_share" src='https://image.flaticon.com/icons/svg/145/145808.svg') > </img>
                                <img id="instagram_share" src='https://image.flaticon.com/icons/svg/174/174855.svg') > </img> 
                                <img id="twitter_share" src='https://image.flaticon.com/icons/svg/145/145812.svg') > </img>
                            </div>
                        `)); // popup window
                    /* edit css of the "popup_title" in the popup window  */
                    $popup.find('#popup_title').css({
                        'padding-bottom': '5px',
                        'font-size': '15px',
                        'letter-spacing': '1px',
                        'font-weight': 'bold',
                        'font-family': '"futura-pt-n7", "futura-pt", Tahoma, Geneva, Verdana, Arial, sans-serif',
                        'font-style': 'normal',
                        position: 'relative',
                        left: '-33px',
                        top: '-7px'
                    });
                    /* edit css of the "input_field" in the popup window  */
                    $popup.find('#popup_input').css({
                        width: '79%',
                        'font-size': '14px',
                        'padding-left': '4px',
                        'letter-spacing': '0.1px',
                        'font-family': 'futura-pt-n7, futura-pt, Tahoma, Geneva, Verdana, Arial, sans-serif',
                        'font-weight': 'bold',
                    });
                    /* edit css of the "Copy" button in the popup window  */
                    $popup.find('#popup_copy_button').css({
                        width: 'auto',
                        'font-size': '12px',
                        height: '40px',
                        'font-family': 'futura-pt-n7, futura-pt, Tahoma, Geneva, Verdana, Arial, sans-serif',
                        'font-weight': 'bold',
                        'text-transform': 'uppercase',
                    });
                    /* edit css of the "facebook_share" button in the popup window  */
                    $popup.find('#facebook_share').css({
                        width: '20%',
                        'padding-top': '25px',
                        'padding-right': '10px'
                    });
                    /* edit css of the "pinterest_share" button in the popup window  */
                    $popup.find('#pinterest_share').css({
                        width: '20%',
                        'padding-top': '25px',
                        'padding-right': '10px'
                    });
                    /* edit css of the "instagram_share" button in the popup window  */
                    $popup.find('#instagram_share').css({
                        width: '20%',
                        'padding-top': '25px',
                        'padding-right': '10px'
                    });
                    /* edit css of the "twitter_share" button in the popup window  */
                    $popup.find('#twitter_share').css({
                        width: '20%',
                        'padding-top': '25px'
                    });
                    /* edit popup window css */
                    $popup.css({
                        width: '260px',
                        left: '0px',
                        padding: '20px 20px',
                        height: '150px',
                        position: 'absolute',
                        border: '1px solid rgba(27, 31, 35, 0.15)',
                        'background-color': 'white',
                        'box-shadow': '0 3px 12px rgba(27,31,35,0.15)',
                        'margin-top': '15px',
                    });
                    $popup.hide(); /* hide popup window when first created */
                    $refer_button.append($popup); // attach newly created popup window to refer_button
                    /* do stuff when clicking refer_button */
                    $refer_button.click(() => {
                        $('#popup').show(); // toggle popup window ON & OFF
                    });
                    /* do stuff when clicking popup_copy_button */
                    $popup.find('#popup_copy_button').click(() => {
                        console.log("popup_copy button pressed");
                    });

                    $aside_action.append($refer_button); // attach newly created refer_button to add_to_bag button
                });

                // NEXT STEP: save to database
            }
        }, 10);
    })