$('.topBanner').on('click', function(){
    window.location.assign('/');    
})

$('.archiveLink').on('click', function(){
    var liCount = $('.archiveLink').length-1;
    var liClicked = $(this).index();
    var liString = liCount - liClicked
    var newRequest = '/post?postNum=' + liString.toString() 
    window.location = newRequest;
})