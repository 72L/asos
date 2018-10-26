var hats = [
    {
        "src": "https://imageshack.com/a/img924/7744/QsmSgl.png"
    },
    {
        "src": "https://imageshack.com/a/img921/4472/bZ2Frn.png"
    },
    {
        "src": "https://imageshack.com/a/img924/8503/gkNzvu.png"
    },
    {
        "src": "https://imageshack.com/a/img924/6651/JyKQJd.png"
    },
    {
        "src": "https://imageshack.com/a/img923/6226/kZJBGv.png"
    },
    {
        "src": "https://imageshack.com/a/img924/8254/hWxpsd.png"
    },
    {
        "src": "https://imageshack.com/a/img922/296/6ojTLG.png"
    },
    {
        "src": "https://imageshack.com/a/img923/2356/UMggwO.png"
    },
    {
        "src": "https://imageshack.com/a/img921/8770/FKaiM9.png"
    },
    {
        "src": "https://imageshack.com/a/img923/8733/3YCJKR.png"
    }
]

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

        this.main_window_selector = '.product-carousel .window';

        // save OG image list
        this.og_img_list = []
        $('.amp-images img').each((i, item) => {
            this.og_img_list.push({
                '$item': $(item),
                'src': item.src
            })
        })

        this.api_result_cache = {
            upload: {},
            faces: {}
        }

        // build hat list
        this._build_hat_list()
    }

    add_all_filters(hat_src, hat_height, hat_width) {
        this.og_img_list.map((item) => {
            this.add_filter(item.$item, item.src, hat_src, hat_height, hat_width);
        })
    }

    _build_hat_list() {

        let $hat_selector = $('<div>');
        $hat_selector.css({
            position: 'absolute',
            'z-index': 10000,
            'overflow-y': 'scroll',
            'max-height': '300px',
            bottom: '0',
            margin: '2px',
        })

        let $hat_inst_div = $('<div>');
        $hat_inst_div.css({
            padding: '10px',
            background: '#eee',
            margin: '1px',
            color: 'black'
        }).html(
            'Select a hat:'
        )

        $hat_selector.append($hat_inst_div);

        for (let hat of hats) {
            let $hat_option_div = $('<div>');
            $hat_option_div.css({
                padding: '10px',
                background: '#6666662e',
                margin: '1px',
                cursor: 'pointer'
            })
            let $hat_img = $(`<img src="${hat.src}" width="100px" class="hat_img">`)
            hat.$hat_img = $hat_img
            $hat_option_div.append($hat_img)
            $hat_option_div.click(() => {
                console.log($hat_img[0].clientHeight);
                this.add_all_filters(hat.src, $hat_img[0].clientHeight, $hat_img[0].clientWidth)
            })
            $hat_selector.append($hat_option_div)

        }

        $('.product-carousel .window').append($hat_selector)
        console.log(hats);

    }

    _upload_img(src, callback) {

        console.log('uploading...')
        // check cache
        if (src in this.api_result_cache.upload) {
            console.log('got from cache')
            return callback(this.api_result_cache.upload[src]);
        }

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
            success: (data) => {
                let direct_link = `https://${data.result.images[0].direct_link}`;
                console.log(direct_link);

                // save to cache
                this.api_result_cache.upload[src] = direct_link;
                callback(direct_link)
            }
        });

    }

    _get_img_height(imgSrc, callback) {
        let newImg = new Image();

        newImg.onload = function () {
            callback(height);
        }

        newImg.src = imgSrc; // this must be done AFTER setting onload
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
        // check cache
        if (img in this.api_result_cache.faces) {
            console.log('got from cache')
            return callback(this.api_result_cache.faces[img]);
        }

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
            success: (data) => {
                console.log(`${data.faces.length} faces were detected`);
                callback(data.faces)
                this.api_result_cache.faces[img] = data.faces;
            }
        });

    }

    _process_faces(faces, hat_src, hat_height, hat_width, callback) {
        // This list contain all the coordinates of the regions where the flower crown or the dog parts should be
        // Composited on top of the target image later using the `merge` command.
        let coordinates = [], $ajaxcalls = [];

        for (let face of faces) {

            // Show the face coordinates
            let cord = face['rectangle']

            // Show landmarks of interest:
            let landmarks = face['landmarks']
            console.log(face['landmarks'])

            let new_width = cord['width'] * 1.5;

            // Resize the flower crown to fit the face width
            $ajaxcalls.push(this._resize_img(
                hat_src,
                new_width, // Face width
                0, // Let Pixlab decide the best height for this picture
                (resized_src) => {
                    let adj_mult = new_width / hat_width,
                        adjustment = (hat_height > 40) ? hat_height * 0.5 * adj_mult : 0;
                    coordinates.push({
                        'img': resized_src,
                        'x': landmarks['bone']['outer_left']['x'],
                        'y': landmarks['bone']['outer_left']['y'] - adjustment,
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

    add_filter($img, og_src, hat_src, hat_height, hat_width) {

        $img.attr('style', 'border-top: 3px solid red;');

        this._upload_img(og_src, (uploaded_link) => {
            this._detect_faces(uploaded_link, (faces) => {
                this._process_faces(faces, hat_src, hat_height, hat_width, (coordinates) => {
                    this._compose(uploaded_link, coordinates, (transformed_link) => {
                        $img.attr('src', transformed_link)
                        $img.attr('style', 'border-top: none;');
                    })
                })
            })
        })

    }
}

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
                fm = new FaceManipulator();
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