$('.topBanner').on('click', function(){
    window.location.assign('/');    
})

$('.archiveLink a').each(function(i){
    console.log(i);
    var liCount = $('.archiveLink').length-1;
    var newRequest = 'http://www.jason-thomas.xyz/post?postNum=' + (liCount - i); 
    $(this).attr('href', newRequest);
})