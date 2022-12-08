import mistune

# copied from here - https://blog.depa.do/post/mistune-parser-syntax-mathjax-centered-images

class HighlighterRenderer(mistune.Renderer):

    # Pass math through unaltered - mathjax does the rendering in the browser
    def block_math(self, text):
        return '$$%s$$' % text

    def latex_environment(self, name, text):
        return r'\begin{%s}%s\end{%s}' % (name, text, name)

    def inline_math(self, text):
        return '$%s$' % text
