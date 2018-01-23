var g_api_url = "http://54.179.144.97/api/tech-rishav/";
var g_cookie_domain = "localhost";
// var g_cookie_domain = "13.228.8.13";

$(function(){
    load_fonts();
});

/** Font family **/
function load_fonts()
{
  WebFontConfig = {
      google: { families: ['Roboto:300,400,500,700:latin','Roboto Slab:400,700:latin' ] }
    };
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
}

/*get user token if present*/
function fetch_user_token()
{
  if(document.cookie.indexOf("_bn_ut")>=0)
    return getCookie("_bn_ut");
  else
  {
    var err = {"responseText":'INVALID_TOKEN',"status":403};
    error_response(err);
  }
}

/*api call error response*/
function error_response(err)
{
  /*error response from server*/
  if(err!=undefined && err.responseText!=undefined)
  {
    var message = err.responseText;
    var status = err.status;
    message = message.replace("{}","");
    $(".loading").addClass("hidden");
    var hostname = location.hostname;
    var protocol = location.protocol;
    var g_url = protocol+"//"+hostname+"/";
    setTimeout(function() {
      switch(status)
      {
        /*access denied*/
        case 403:
          /*unset cookie token*/
          remove_user_cookies()
          var current_url = window.location.href;
          if(g_url!=undefined && current_url!=g_url)
          {
            alert("Your session has expired. Please login to authorize your account.");
            window.location = g_url;
          }
        break;
        /*limit reached*/
        case 429:
          alert("Too many requests from this account. Please wait for a minute and try again.");
        break;
        /*server error*/
        case 500:
          console.log("Server Error. Contact the support team.");
        break;
      }
    }, 1000);
    switch(message)
    {
      case 'INVALID_TOKEN':
        console.log("token not valid/expired");
      break;
      case 'TOO_MANY_REQUESTS':
        console.log("Too many requests");
      break;
    }
  }
  /*timeout or no response from server*/
  else
  {
    console.log("Timeout Error. Check your network. Please try again after sometime. If nothing works contact support team.");
  }
}

/*get cookie by name*/
function getCookie(name)
{
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}

/*delete cookie*/
var delete_cookie = function(name) {
  document.cookie = name+'=;path=/;domain='+g_cookie_domain+';expires=' + new Date(0).toUTCString();
};

/*remove all user cookies*/
function remove_user_cookies()
{
  delete_cookie('_bn_ut');
}

/*check if the cookies are enabled in the browser*/
function isCookiesEnabled()
{
  var cookieEnabled = navigator.cookieEnabled;
  return cookieEnabled;
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

// ga analytics
function common_ga(type,value)
{
  var gaclass=value;
  if(type=="search")
    var eventCategory="Product Analytics";
  else if(type=="login")
    var eventCategory="Engagement Analytics";

  if(typeof gaclass!="undefined")
  {
    var eventAction={ 'Course'        : 'Search Auto Suggest Course Click',
                      'Article'       : 'Search Auto Suggest Article Click',
                      'Topic'         : 'Search Auto Suggest Topic Click',
                      'fb_login'      : 'Fb Login Button Click',
                      'gplus_login'   : 'Google Login Button Click'
                    };

    var eventLabel={  'Course'        : 'Search Auto Suggest Course Clicked',
                      'Article'       : 'Search Auto Suggest Article Clicked',
                      'Topic'         : 'Search Auto Suggest Topic Clicked',
                      'fb_login'      : 'Logged in with Facebook',
                      'gplus_login'   : 'Logged in with Email'
                    };
    ga('send', {
      hitType: 'event',
      eventCategory: eventCategory,
      eventAction: eventAction[gaclass],
      eventLabel: eventLabel[gaclass]
    });
  }
}

/* login/signup action */
$(".login_signup_box .login_mode_toggle .login_tab").click(function(){
    $(".login_signup_box .login_mode_toggle .signup_tab").removeClass("tab_active");
    $(".login_signup_box .login_mode_toggle .login_tab").addClass("tab_active");
    $(".login_signup_box .login_form").removeClass("hidden");
    $(".login_signup_box .signup_box").addClass("hidden");
});

$(".login_signup_box .login_mode_toggle .signup_tab").click(function(){
    $(".login_signup_box .login_mode_toggle .signup_tab").addClass("tab_active");
    $(".login_signup_box .login_mode_toggle .login_tab").removeClass("tab_active");
    $(".login_signup_box .login_form").addClass("hidden");
    $(".login_signup_box .signup_box").removeClass("hidden");
});

/* setting login_signup modal to required tab on button press */
$(".navbar_banknaukri .navbar_login").click(function(){
    $("#login_signup_modal .login_signup_box .login_mode_toggle .login_tab").trigger("click");
});
$(".navbar_banknaukri .navbar_signup, .section_signup_btn").click(function(){
    $("#login_signup_modal .login_signup_box .login_mode_toggle .signup_tab").trigger("click");
});

/* logout user */
function logout_user()
{
  /*get user token*/
  var chalk_user_token = fetch_user_token();
  /*ajax call*/
  $.ajax({
    type:'POST',
    dataType:"json",
    headers:{
      'Authorization':chalk_user_token
    },
    url: g_api_url+"auth/logout",
    success:function(json){
    },
    error:function(err){
      error_response(err);
    }
  });
  /*remove the token*/
  remove_user_cookies();
  /*redirect to login page*/
  window.location.href = $(".navbar-chalk").attr("data-url");
}

function toggle_navbar_sidemenu()
{
	if($(".navbar_right_sidebar").hasClass("open"))
	{
		$(".navbar_right_sidebar").removeClass("open");
        $("#top_banner  .sidebar_dark").addClass("hidden")
	}
	else
	{
		$(".navbar_right_sidebar").addClass("open");
        $("#top_banner .sidebar_dark").removeClass("hidden")
	}
}

/* expand and show list in sidebar*/
function toggle_sidebar_sublist()
{
    $(".navbar_right_sidebar .sidebar_main_item.expandable").click(function(){
        var child_container=$(this).find(".subele_container");
        if (child_container.hasClass("hidden"))
            child_container.removeClass("hidden");
        else
            child_container.addClass("hidden");
    });

}

/* verifying token in every ajax call */
$( document ).ajaxSuccess(function( event, request, settings ) {
   //refreshing the token, if the existing token expired, but cookie still exists
   $data=JSON.parse(request.responseText);
   if($data['_bn_ut'] && $data['_bn_ut']['token']!='' && $data['_bn_ut']['token']!=null)
   {
     document.cookie = "_bn_ut=" + $data['_bn_ut']['token'] + ";" + $data['_bn_ut']['expirey'] + ";path=/";
   }
 });
