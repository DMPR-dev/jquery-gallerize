# jQuery Gallerize
A jQuery plugin that allows to put all images present on page into gallery popup.

# Summary
*  <a href="#usage-id-required">Usage</a>
*  <a href="#options-excludenames-array">Options:excludeNames</a>
*  <a href="#options-excludedomains-array">Options:excludeDomains</a>
*  <a href="#options-imagedots-boolean">Options:imageDots</a>
*  <a href="#options-minsize-integer">Options:minSize</a>
*  <a href="#screenshot">Screenshot</a>

# Usage - id - REQUIRED
```
jQuery('.single-post-content img, .single-post-content div').gallerize({
	id:'single-post-gallery',
});
```
# Options: excludeNames - array
This option allows you to exclude specific names of images(should contain full name + extension)
```
jQuery('.single-post-content img, .single-post-content div').gallerize({
	id:'single-post-gallery',
	excludeNames:["load.gif"]
});
```
# Options: excludeDomains - array
This option allows you to exclude specific domains / url parts, so basically if image URL contains forbidden substring, it will be excluded
```
jQuery('.single-post-content img, .single-post-content div').gallerize({
	id:'single-post-gallery',
	excludeDomains:["://s.w.org"]
});
```
# Options: imageDots - boolean
This option allows you to define if plugin should put images instead of simple dots at the bottom of modal popup window with gallery
```
jQuery('.single-post-content img, .single-post-content div').gallerize({
	id:'single-post-gallery',
	imageDots:true
});
```
# Options: minSize - integer
This option allows you to specify the minimal size(width) of the image to be picked up by plugin, minimal (impossible to overwrite) is 150px
```
jQuery('.single-post-content img, .single-post-content div').gallerize({
	id:'single-post-gallery',
	minSize: 160
});
```

# Screenshot
<img src="https://i.imgur.com/Eh5thNm.png" style="width:100%;" alt="Screenshot"/>