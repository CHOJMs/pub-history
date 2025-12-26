var swiper, bottom;

// $(function(){
//     bottom = $('.scroll-trigger > div:eq(0)').innerHeight();
//     bottom = Math.ceil(bottom);
//     $('.scroll-trigger').css({'marginTop':`-${bottom}px`, 'margin-left':'-1px'});
// });
$(function(){

    var myIndex = 1;

    $('#fullpage').fullpage({
        anchors: ['01','02','03','04','05','06'],
        navigation: false,
        navigationPosition: 'right',
        fitToSectionDelay: 0,
        scrollingSpeed: 800,
        scrollOverflow: true,
        //normalScrollElements: '#lastSection',
        'afterLoad': function(anchorLink, index){


            if(index == 1){
                //$('#header').removeClass('active');
                //$('#section-02 .inner').css({'transform':'translateY(-62.5%)'});
                $('.my-btn').find('img').attr('src','./resources/images/my_01.png');
                $('#section-02, #section-03').removeClass('on');
                myIndex = 1;

            }else{
                //$('#section-02 .inner').css({'transform':'translateY(-20%)'});
                //$('#header').addClass('active');
            }

            if(index == 2){
                
            }

            if(index == 3){

            }

            /*if(index == 4){
                $('#section4_bg').addClass('fade');
                $('#section4_title01').delay(0).fadeIn(800);
                $('#section4_title02').delay(300).fadeIn(800);
                $('#section4_title03').delay(600).fadeIn(800);

                $('#section5_left').delay(0).fadeIn(800);
                $('#section5_right').delay(400).fadeIn(800);
            }*/

            /*if(index == 4){

            }

            if(index == 5){

            }*/
        },

    });
    
    $('.my-btn').click(function(){
        myIndex++;

        if(myIndex == 3){
            $('#section-02, #section-03').addClass('on');

            //$('#section-02.active .inner').css({'transform':'translateY(0)'});
            //$('#section-03 .inner').css({'transform':'translateY(0)'});
        }else{
            $('#section-02, #section-03').removeClass('on');
        }

        if(myIndex >= 4){
            myIndex = 1;
        }
        $(this).find('img').attr('src','./resources/images/my_0'+myIndex+'.png');

        return false;
    });
})

var mainSwiper = new Swiper('.swiper-container.text-relative', {
    touchRatio: 1,
    simulateTouch: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    breakpoints: {
        // when window width is >= 320px
        769: {
            touchRatio: 0,
            simulateTouch: false,
        },

    },
    // controller: {
    //   control: subSwiper,
    // },
    speed: 1000
});
var subSwiper = new Swiper('.swiper-container.bg-fixed', {
    touchRatio: 1,
    simulateTouch: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    breakpoints: {
        // when window width is >= 320px
        769: {
            touchRatio: 0,
            simulateTouch: false,
        },

    },
    // controller: {
    //   control: mubSwiper,
    // },
    speed: 1000
});

mainSwiper.controller.control = subSwiper;
subSwiper.controller.control = mainSwiper;

var imgHeight = 0;
var sub_swiper = function sub_swiper() {
    swiper = new Swiper('.sub-container .swiper-container', {
        centeredSlides: true,
        slidesPerView: 1.175,
        spaceBetween: 15,
        //touchRatio: 1,
        simulateTouch: true,
        /*navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },*/
        on: {
            afterInit: function(swiper){
                imgHeight = $('.swiper-slide.swiper-slide-active figure img').innerHeight() + 50;
                $('.sub-container .swiper-container .swiper-wrapper').css({'height': `${imgHeight}px`});

                var add2 = $('.swiper-pagination-progressbar-fill').width() / 8;
                $('.dot').css({'left':`${add2}px`});
                //console.log($('.swiper-pagination-progressbar-fill').width());

                $('.count > span').text(`${swiper.realIndex + 1}`);
            },
            slideChangeTransitionStart: function(swiper){
                console.log(swiper.realIndex)
                if(swiper.realIndex == 3){
                    imgHeight = $('.swiper-slide.swiper-slide-active').children('figure').find('img').innerHeight() + 91;
                }else{
                    imgHeight = $('.swiper-slide.swiper-slide-active').children('figure').find('img').innerHeight() + 50;
                }

                $('.count > span').text(`${swiper.realIndex + 1}`);
                
                $('.sub-container .swiper-container .swiper-wrapper').css({'height': `${imgHeight}px`});
            },
            slideChange: function(swiper){
                var add = 8 / (swiper.snapIndex + 1);
                var add2 = $('.swiper-pagination-progressbar-fill').width() / add;
                $('.dot').css({'left':`${add2}px`});
                console.log(add2);
                //$('.dot').css({'transform':`translateY(-50%) scaleX(${add})`});
            },
        },
        pagination: {
            el: '.swiper-pagination',
            type: "progressbar",
            renderProgressbar: function (progressbarFillClass) {
                return '<div class="' + progressbarFillClass + '"></div><span class="dot"></span>';
            }
        },
        breakpoints: {
            // when window width is >= 320px
            769: {
                touchRatio: 0,
                simulateTouch: false,
            },

        },
        speed: 1000
    });
};

sub_swiper();