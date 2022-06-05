#### 2022 update

Reading this code now, wow what a shocker. I have thought about pressing the nuke button on this blog but have always ended up making small changes. Someday I should do a proper refactor if I'm going to keep this. This was my first web app so it's not that bad, but not great.

#### Creating DB

`./init_db.py`

#### Using iframes

This site makes use of the project `iframeResizer`. 

Be sure to include the `iframeResizer.contentWindow.min.js` in the loaded page and define the iframe with no scrolling, like ```<iframe ... scrolling="no></iframe>```. There should already be a style to set the iframe to have width:100%

### Project

This site is hosted from a VPS - I'd probably prefer to use Heroku otherwise, but this allowed me to learn how Linux, Apache2 and virtual hosts interact.

This site uses Flask, which for something simple like a blog, you could argue is a better option than Rails or Django. If I wanted to manage client details or do fancy stuff, Rails might be a better option.

This blog has also allowed me to learn more about Flask, which I think would really be a great option if you wanted to make simple restful APIs - the kind of thing that accepts a post or a get request via a query string or Ajax call and returns a result.

This blog was made using the standard Flask blog tutorial, which I altered and changed for my own purposes. You can read more about [what I've done to change this blog](http://www.jason-thomas.xyz/post?postNum=0), on the first ever blog post for that page.

### Embedding videos

To embed a video, like from Youtube, make sure you take the iframe as is and put it inside a div with the class `aspect-ratio`, like this:

FYI, the standard aspect ratio for Youtube videos is 560 * 315.

    <div class='aspect-ratio'>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/sGIDDIIjlOg" frameborder="0"
        allowfullscreen></iframe>
    </div>

The stylesheet has styles to make these iframes appear in their current aspect ratio. [This site](https://fettblog.eu/blog/2013/06/16/preserving-aspect-ratio-for-embedded-iframes/) page has more details.
