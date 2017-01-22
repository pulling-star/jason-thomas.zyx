Personal blog site - will be posting about Python, things I learn with code, unicycles, etc.

This site is hosted from a VPS - I'd probably prefer to use Heroku otherwise, but this allowed me to learn how Linux, Apache2 and virtual hosts interact.

This site uses Flask, which for something simple like a blog, you could argue is a better option than Rails or Django. If I wanted to manage client details or do fancy stuff, Rails might be a better option.

This blog has also allowed me to learn more about Flask, which I think would really be a great option if you wanted to make simple restful APIs - the kind of thing that accepts a post or a get request via a query string or Ajax call and returns a result.

This blog was made using the standard Flask blog tutorial, which I altered and changed for my own purposes. You can read more about [what I've done to change this blog](http://www.jason-thomas.xyz/post?postNum=0), on the first ever blog post for that page.

###Embedding videos

To embed a video, like from Youtube, make sure you take the iframe as is and put it inside a div
with the class `aspect-ratio`, like this:

    <div class='aspect-ratio'>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/sGIDDIIjlOg" frameborder="0"
        allowfullscreen></iframe>
    </div>

The stylesheet has styles to make these iframes appear in their current aspect ratio. [This
site](https://fettblog.eu/blog/2013/06/16/preserving-aspect-ratio-for-embedded-iframes/)
page has more details.

