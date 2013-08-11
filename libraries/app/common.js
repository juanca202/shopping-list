$(document).on('mobileinit', function() {
	try {
        $.extend($.mobile, {
            defaultPageTransition: 'slide',
            defaultDialogTransition: 'none'
        });
        $.extend($.mobile.page.prototype.options, {
            domCache: true,
            addBackBtn: true
        });
    }catch(err){
        console.log(err.message);
        console.log(err.stack);
    }
});