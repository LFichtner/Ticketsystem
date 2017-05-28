//var MyFrontendController;
//requirejs(['FE_Controller'], function (FrontendController) {
//    console.log(FrontendController);
//    MyFrontendController = new FrontendController();
//    MyFrontendController.load('login');
//});
//
//
//$(document).ready(function () {
//    console.log(MyFrontendController);
//});


var MyFrontendController = new Controller('http://127.0.0.1:3000/');
    
MyFrontendController.load('init');