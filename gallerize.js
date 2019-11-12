jQuery(function($){
    $.fn.gallerize = function(options){
        /*
            We use this variable to store all the images present on page/provided by selector
        */
        var images = [];
        /*
            We use this variable to access jQuery object from anywhere
        */
        var me = this;
        /*
            Do a basic input data check
        */
        if(typeof(options.id) === "undefined" || options.id.length == 0)
        {
            console.error("No gallery id was provided!");
            return;
        }
        /*
            Check if such gallery already exists
        */
        if($("#gallerize-modal-gallery-"+options.id).length > 0)
        {
            console.error("The gallery id provided has already been taken!");
            return;
        }
        /*
            Creates basic HTML elements for the gallery and appends them to the body

            @returns VOID
        */
        var Prepare = function(){
            /*
                Create modal container
            */
            var container_div = document.createElement("div");
            /*
                Set class for styling and id and hide the modal window by default
            */ 
            $(container_div).attr("class","gallerize-modal");
            $(container_div).attr("id","gallerize-modal-gallery-"+options.id);
            $(container_div).css("opacity","0");
            $(container_div).css("pointer-events","none");


            /*
                Create a close button for modal window
            */ 
            var close_btn = document.createElement("span");
            $(close_btn).attr("class","gallerize-close");
            $(close_btn).attr("id","gallerize-close-modal-"+options.id);
            $(close_btn).html("&times;");
            /*
                Create a modal window
            */
            var gallery = document.createElement("div");
            $(gallery).css("opacity","0");
            $(gallery).attr("class","gallerize-gallery");
            $(gallery).attr("id","gallerize-slider-"+options.id);
            /*
                Create a gallery container for centering
            */
            var gallery_container = document.createElement("div");
            $(gallery_container).css("position","relative");
            $(gallery_container).css("height","100%");
            /*
                Put button into container
            */
            $(container_div).append(close_btn);
            /*
                Processes each image and takes its src

                @returns VOID
            */
            var ProcessImages = function(){
                for(var i = 0; i<me.length; i++) 
                {
                    var img = me.eq(i);
                    if(img.hasClass("gallerize-initialized")) continue;

                    var image_url = (
                            img.attr("src") 
                        ||  img.attr("async-src") 
                        ||  img.prop("currentSrc")
                        || (function(){
                            var matches = img.css("background-image").match(/url\("(.*?)"\)/);
                            if(Array.isArray(matches) && matches.length > 1)
                            {
                                return matches[1];
                            }
                            return null;
                        })()
                    );
                    if(image_url == null || image_url == undefined || typeof(image_url) === "undefined") continue;
                    /*
                        Apply filters
                    */
                    if(!FilterImages(image_url)) continue;
                    /*
                        Validate image size
                    */
                    if(!ValidateSize(img)) continue;
                    /*
                        Validate image parents
                    */
                    if(!ValidateParents(img)) continue;
                    /*
                        Create an image container and set the image as background image
                    */
                    var image_div = document.createElement("div");
                    $(image_div).attr("class","gallerize-gallery-image");
                    $(image_div).attr("image_src",image_url);
                    img.attr("gallerize_image_src",image_url);
                    img.addClass("gallerize-initialized");

                    $(image_div).css("background-image","url("+image_url+")");
                    /*
                        Scale down small images on desktop
                    */
                    if(img.width() < 600 && $(window).width() > 1199)
                    {
                        $(image_div).css("transform","scale(0.6)");
                    }
                    /*
                        Put image div into global container
                    */
                    $(gallery).append(image_div);
                    /*
                        Put image into array to store it
                    */
                    images.push(image_url);
                    /*
                        Bind click event on current image that is being processed
                    */
                    img.click(function(){
                        var initiator = this;
                        var OpenImg = function(){
                            if($("#gallerize-modal-gallery-"+options.id).hasClass("gallerize-initialized")
                            && $("#gallerize-modal-gallery-"+options.id +" .gallerize-gallery").css("opacity") !== 0)
                            {
                                /*
                                    Get url of image where the click even has occured and take its index from images array
                                */
                                var clicked_image_url = ($(initiator).attr("gallerize_image_src"));
                                var clicked_image_index = images.indexOf(clicked_image_url); 
                                /*
                                    Go to needed slide
                                */
                                $("#gallerize-modal-gallery-"+options.id +" .gallerize-gallery")[0].slick.slickGoTo( parseInt(clicked_image_index) );
                                /*
                                    Show the modal
                                */
                                $("#gallerize-modal-gallery-"+options.id).css("visibility","visible");
                                setTimeout(function(){
                                    $("#gallerize-modal-gallery-"+options.id).css("opacity",1);
                                    /*
                                        Bring a focus to gallery
                                    */  
                                    $("#gallerize-modal-gallery-"+options.id +" .gallerize-gallery .slick-track .slick-slide").click();
                                },100);
                            }
                            else
                            {
                                setTimeout(function(){
                                    OpenImg();
                                },250);
                            }
                        }
                        OpenImg();
                    });
                    /*
                        Make img "clickable" - add cursor:pointer
                    */
                    img.css("cursor","pointer");
                }
            }();
            $(gallery_container).append(gallery);
            $(container_div).append(gallery_container);
            /*
                Append modal window container to the body
            */ 
            $(document.body).append(container_div);
            /*
                Bind event for close button
            */
            $("#gallerize-close-modal-"+options.id).click(function(){
                $("#gallerize-modal-gallery-"+options.id).animate({opacity:0},150,function(){
                    $("#gallerize-modal-gallery-"+options.id).css("visibility","hidden");
                });
            });
        }
        /*
            Loads needed scripts and styles by adding HTML elemnts like "link" and "script" to the body

            @returns VOID
        */
        var LoadScriptsAndStyles = function(){
            var scripts_and_styles = [
                "//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css",
                "//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"
            ];

            for (var i = scripts_and_styles.length - 1; i >= 0; i--) {
                var current_url = scripts_and_styles[i];
                /*
                    Put link tag if there is .css in the end of link
                */
                if(current_url.endsWith(".css"))
                {
                    /*
                        Anti-duplicate
                    */
                    if($("link[href='"+current_url+"']").length > 0) continue;

                    var style = document.createElement("link");
                    style.rel = "stylesheet";
                    style.href = current_url;
                    (document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]).appendChild(style);
                }
                /*
                    Put script tag if there is .js in the end of link
                */
                else if(current_url.endsWith(".js"))
                {
                    /*
                        Anti-duplicate
                    */
                    if($("script[src='"+current_url+"']").length > 0) continue;

                    var script = document.createElement("script");
                    script.async = true;
                    script.defer = true;
                    script.src = current_url;
                    (document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]).appendChild(script);
                }
            }
        };
        /*
            Filters images by provided options

            @returns BOOLEAN
        */
        var FilterImages = function(image_path){
            /*
                Filter by name
            */
            return function(image_path){
                if (typeof(options.excludeNames) !== "undefined" && Array.isArray(options.excludeNames))
                {
                    if(options.excludeNames.includes(Basename(image_path)))
                    {
                        return false;
                    }
                }
                return true;
                /*
                    If filter by name is passed, then filter by extension
                */
            }(image_path) === false ? false : function(image_path){
                if (typeof(options.excludeExtensions) !== "undefined" && Array.isArray(options.excludeExtensions))
                {
                    var filename = Basename(image_path);
                    if(filename.includes("."))
                    {
                        var possible_extensions = filename.split(".");
                        var extension = possible_extensions[possible_extensions.length-1];
                        if(options.excludeExtensions.includes(extension))
                        {
                            return false;
                        }
                    }
                }
                return true;
                /*
                    If filter by extension is passed, then filter by domain
                */
            }(image_path) === false ? false : function(image_path){
                if (typeof(options.excludeDomains) !== "undefined" && Array.isArray(options.excludeDomains))
                {
                    for (var i = options.excludeDomains.length - 1; i >= 0; i--) {
                        if(image_path.includes(options.excludeDomains[i]))
                        {
                            return false;
                        }
                    }
                }
                return true;
            }(image_path);
        }
        /*
            Validates minimal size of image if it's configured, default one is set to 150px (we only check width)

            @returns BOOLEAN
        */
        var ValidateSize = function(img){
            if (typeof(options.minSize) !== "undefined" && parseInt(options.minSize) >= 150)
            {
                if(img.width() < parseInt(options.minSize))
                {
                    return false;
                }
            }
            else
            {
                if(img.width() < 150)
                {
                    return false;
                }
            }
            return true;
        };
        /*
            Validates parents of current image, skips the images that are wrapped into links

            @returns BOOLEAN
        */
        var ValidateParents = function(img){
            var parents = img.parents();

            if(!parents) return true;

            for (var i = parents.length - 1; i >= 0; i--) {
                if($(parents).eq(i).prop("tagName") == "A") return false;
            }
            return true;
        };
        /*
            Allows to know the basename of file from provided path

            @returns STRING
        */  
        var Basename = function(path){
            if(!path) return;

            if(path.includes("/"))
            {
                return path.split("/").reverse()[0];
            }
            else return path;
        }
        /*
            Sets images on dots under gallery

            @returns VOID
        */
        var AppendImagesToDots = function(){
            if (typeof(options.imageDots) === "undefined" || options.imageDots === false)
            {
                return;
            }
            /*
                Get all dots
            */
            var dots = $("#gallerize-modal-gallery-"+options.id +" .gallerize-gallery > ul.slick-dots > li");
            if(dots.length == images.length)
            {
                /*
                    Calculate width of images on dots
                */
                var max_width = 150; // max width of thumbnail is 150px
                var target = $("#gallerize-modal-gallery-"+options.id +" .gallerize-gallery");
                var img_width = target.width() / images.length - 15;
                if(img_width * images.length < (target.width()-30))
                {
                    for(;((img_width+15) * images.length) < (target.width() - 30);)
                    {
                        img_width++;
                    }
                }
                /*
                    Lock size of max_size value if it"s greater than max_size
                */
                if(img_width > max_width)
                {
                    img_width = max_width;
                }
                /*
                    Append style settings to slick dots
                */
                for (var i = 0; i < images.length; i++) {
                    var final_img_width = img_width;
                    if(i < images.length-1)
                    {
                        dots.eq(i).css("margin-right","15px");
                        final_img_width += (15/images.length);
                    }
                    dots.eq(i).find("button").css("background-image","url("+images[i]+")");
                    dots.eq(i).find("button").css("background-size","cover");
                    dots.eq(i).find("button").css("background-repeat","no-repeat");
                    dots.eq(i).find("button").css("width",final_img_width + "px");
                    dots.eq(i).find("button").css("height",img_width*0.5625 + "px"); // 16:9
                    dots.eq(i).find("button").css("border-radius",0);

                    dots.eq(i).addClass("image-dot");
                }
                $("#gallerize-modal-gallery-"+options.id +" .gallerize-gallery > ul.slick-dots").addClass("image-dots");
                if(images.length > 17)
                {
                    $("#gallerize-modal-gallery-"+options.id +" .gallerize-gallery > ul.slick-dots").css("display","none");
                }
            }
        }
        /*
            Initializes slick slider if there is more than 1 image in modal

            @returns VOID
        */
        var InitializeGallery = function(){
            /*
                Check if Slick has loaded & Initialize slick 
            */
            if($("#gallerize-modal-gallery-"+options.id +" .gallerize-gallery").not(".slick-initialized").length > 0 && $().slick)
            {
                $("#gallerize-modal-gallery-"+options.id +" .gallerize-gallery").not(".slick-initialized").slick({
                    dots:true,
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true,
                    autoplay: false,
                    prevArrow:"<button type=\"button\" class=\"gallerize-navigation-btn gallerize-slick-prev\"><i class=\"gallerize-navigation left\"></i></button>",
                    nextArrow:"<button type=\"button\" class=\"gallerize-navigation-btn gallerize-slick-next\"><i class=\"gallerize-navigation right\"></i></button>"
                });
                /*
                    Render slick-initialized gallery, but hide modal
                */
                var OnSlickInitialized = function(){
                    if( $("#gallerize-modal-gallery-"+options.id +" .gallerize-gallery-image").width() > 0
                    && $("#gallerize-modal-gallery-"+options.id +" .gallerize-gallery-image").height() > 0 
                    && $("#gallerize-modal-gallery-"+options.id +" .gallerize-gallery").css("opacity") == 0)
                    {
                        /*
                            Hide gallery on init by default
                        */
                        $("#gallerize-modal-gallery-"+options.id).addClass("gallerize-initialized");
                        $("#gallerize-modal-gallery-"+options.id).css("pointer-events","all");
                        $("#gallerize-modal-gallery-"+options.id).css("visibility","hidden");
                        /*
                            Set gallery opacity to 1
                        */
                        $("#gallerize-modal-gallery-"+options.id +" .gallerize-gallery").css("opacity",1);
                        /*
                            Set images instead of dots if it's configured
                        */
                        AppendImagesToDots();
                        $(window).resize(function(){
                            AppendImagesToDots();
                        });
                    }
                    else
                    {
                        setTimeout(function(){
                            OnSlickInitialized();
                        },250);
                    }
                };
                setTimeout(function(){
                    OnSlickInitialized();
                },750);
            }
            else
            {
                /*
                    If slick hasn"t loaded yet or there are no images then wait
                */
                setTimeout(function(){
                    InitializeGallery();
                },150);
            }
        }
        /*
            Initialize everything
        */
        $(function(){
            /*
                Prepare HTML 
            */
            Prepare();
            /*
                Exit if there are no images
            */
            if(images.length == 0)
            {
                return;
            }
            /*
                Load Slick
            */
            LoadScriptsAndStyles();
            /*
                Init slick
            */
            setTimeout(function(){
                InitializeGallery();
            },500)
        });
    };
});