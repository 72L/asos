
class FaceManipulator {
    constructor() {

        // PixLab API key
        this.api_key = '77c52cc725ea96ceb0eb5ccf39833d84'

        // filter img
        this.flower_src = 'https://ggyr.org/wp-content/uploads/2018/02/PumpkinCluster1.png'
        this.flower_src = 'https://panthertales.org/wp-content/uploads/2017/11/pumpkin.png';

        // proxy url
        this.proxy_url = "https://safe-ridge-86600.herokuapp.com/";

        // imageshak api key
        this.imageshack_api_key = '26HKSUVW2e2902e5954c6d3221c044fc34d18532'
    }

    _upload_img(src, callback){


        $.ajax({
            url: `${this.proxy_url}https://api.imageshack.com/v2/images`,
            type: 'POST',
            cache: false,
            data: {
                urls: [src],
                api_key: this.imageshack_api_key
            },
            dataType: 'json',
            error: function () {
                return true;
            },
            success: function (data) {
                let direct_link = `https://${data.result.images[0].direct_link}`;
                console.log(direct_link);
                callback(direct_link)
            }
        });

    }

    _resize_img(img, width, height, callback) {
        console.log("Resizing images...");

        return $.ajax({
            url: `${this.proxy_url}https://api.pixlab.io/smartresize`,
            type: 'GET',
            cache: false,
            data: {
                'img': img,
                'key': this.api_key,
                'width': width,
                'height': height
            },
            dataType: 'json',
            error: function () {
                return true;
            },
            success: function (data) {
                callback(data.link)
            }
        });
    }

    _detect_faces(img, callback) {

        console.log('detecting faces...')

        $.ajax({
            url: `${this.proxy_url}https://api.pixlab.io/facelandmarks`,
            type: 'GET',
            cache: false,
            data: {
                'img': img,
                'key': this.api_key,
            },
            dataType: 'json',
            error: function () {
                return true;
            },
            success: function (data) {
                console.log(`${data.faces.length} faces were detected`);
                callback(data.faces)
            }
        });

    }

    _process_faces(faces, callback) {
        // This list contain all the coordinates of the regions where the flower crown or the dog parts should be
        // Composited on top of the target image later using the `merge` command.
        let coordinates = [], $ajaxcalls = [];

        for (let face of faces) {

            // Show the face coordinates
            let cord = face['rectangle']

            // Show landmarks of interest:
            let landmarks = face['landmarks']
            console.log(face['landmarks'])

            // Resize the flower crown to fit the face width
            $ajaxcalls.push(this._resize_img(
                this.flower_src,
                20 + cord['width'] * 1.50, // Face width
                0, // Let Pixlab decide the best height for this picture
                (resized_src) => {
                    // Composite the flower crown on top of the bone most left region.
                    coordinates.push({
                        'img': resized_src,
                        'x': landmarks['bone']['outer_left']['x'],
                        'y': landmarks['bone']['outer_left']['y']
                    })
                }
            ))

        }

        // this will setup the promise ---
        // what will run when all 28 AJAX calls complete
        $.when.apply(null, $ajaxcalls).then(function () {
            callback(coordinates)
        });

    }

    _compose(base_img_src, coordinates, callback) {

        let payload_data = {
            'src': base_img_src,
            'key': this.api_key,
            'cord': coordinates
        }

        // Finally, Perform the composite operation
        console.log("Composite operation...")
        console.log(payload_data);

        $.ajax({
            url: `${this.proxy_url}https://api.pixlab.io/merge`,
            type: 'POST',
            data: JSON.stringify(payload_data),
            dataType: 'json',
            contentType: 'application/json',
            error: function () {
                return true;
            },
            success: function (reply) {
                callback(reply.ssl_link)
            }
        });

    }

    add_filter($img) {

        let img_src = $img[0].src;
        $img.attr('style', 'border-top: 1px solid gray;');

        this._upload_img(img_src, (uploaded_link)=>{
            this._detect_faces(uploaded_link, (faces) => {
                this._process_faces(faces, (coordinates) => {
                    this._compose(uploaded_link, coordinates, (transformed_link) => {
                        $img.attr('src', transformed_link)
                        $img.attr('style', 'border-top: none;');
                    })
                })
            })
        })

    }
}

fm = new FaceManipulator();

chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval)

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