<?php

    if(function_exists('date_default_timezone_set')) date_default_timezone_set("Asia/Kolkata");

    $g_url = "https://www.banknaukri.co/";
    $g_url = "http://localhost/";
    // $g_url = "http://13.228.8.13/";

    $g_api_url = "http://54.179.144.97/api/tech-rishav/";
    $g_s3_url="https://s3-ap-southeast-1.amazonaws.com/banknaukri-static/";
    $g_cf_user_url="";

    $g_platform_version = 1;
    $g_version_no = md5($g_platform_version);

    /* facebook app for online version chalkst*/
    $fb_client_id="1813175862343680";
    $fb_client_secret="3a6f5c613acca26b24e6f268df6a3e99";
    $fb_authorized_access_token="172d716ce32b2464e617f9214aa85c91";

    $gp_client_id="1053243033004-bep0o5kulk4ql9taioban9ga94eouv6n.apps.googleusercontent.com";
    $gp_client_secret='1fVFwzq_fvaKvl-DCRAe94hO';

    /* json string of home page */
    $page_json_string=curl_it($g_s3_url.'homepage.json','GET');
    $page_json=json_decode($page_json_string,"true");
    /*encrypt code*/
    function encrypt_code($code)
    {
        $encrypt_method = "AES-256-CBC";
        $secret_key = 'banknaukri';
        $secret_iv = 'banknaukri123';
        $key = hash('sha256', $secret_key);
        $iv = substr(hash('sha256', $secret_iv), 0, 16);
        return base64_encode(openssl_encrypt($code, $encrypt_method, $key, 0, $iv));
    }

    /*decrypt userid*/
    function decrypt_code($code)
    {
    	$encrypt_method = "AES-256-CBC";
        $secret_key = 'banknaukri';
        $secret_iv = 'banknaukri123';
    	$key = hash('sha256', $secret_key);
    	$iv = substr(hash('sha256', $secret_iv), 0, 16);
    	return openssl_decrypt(base64_decode($code), $encrypt_method, $key, 0, $iv);
    }

    /*curl request*/
    function curl_it($url,$method,$data=array(),$headers=array())
    {
    	global $g_url;
    	$ch = curl_init();
    	curl_setopt($ch, CURLOPT_URL, $url);
    	curl_setopt($ch, CURLOPT_REFERER,$g_url);
    	curl_setopt($ch, CURLOPT_TIMEOUT, 200);
    	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    	if($g_url=="http://localhost/")
    		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    	if(strtoupper($method)=="POST")
    		curl_setopt($ch, CURLOPT_FORBID_REUSE, 0);
    	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
    	if(count($headers)>0)
    		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    	if(count($data)>0)
    		curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    	$result = curl_exec($ch);
    	curl_close($ch);

        /* refresh token */
        $response = json_decode($result,true);
    	if(isset($response['_bn_ut']))
    	{
    		setcookie("_bn_ut",$response['_bn_ut']['token'],time()+21600,"/");
    	}
    	return $result;
    }

    /*permission redirection*/
    function perm_redirect($mode=0)
    {
        global $g_url;
    	switch($mode)
    	{
    		case 0: // Soft 403
    		if(!isset($_COOKIE['_bn_ut']))
    		header("location:".$g_url);
    		break;
    		case 1: // ACCESS DENIED
    		if(!isset($_COOKIE['_bn_ut']))
    		header("location:".$g_url."error/");
    		break;
    	}
    }

    /* login popup */
    function loginPage($popup=1,$login_same_page=1,$course_info)
    {
    	global $g_url;
    	global $fb_client_id;
    	global $gp_client_id;
    	global $fb_client_secret,$g_no_learners;

    	if(strpos($_SERVER['REQUEST_URI'],'?')>0){
    		$r_url=urlencode('https://' . $_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']."&lsp=".$login_same_page."&ci=".$course_info);
    		if(isset($_COOKIE['referrer_code'])){
    			$request_uri=$_SERVER['REQUEST_URI'];
    			if(strpos($request_uri, 'referrer_code='.$_COOKIE['referrer_code'].'&')){
    				$request_uri=str_replace('referrer_code='.$_COOKIE['referrer_code'].'&', '', $request_uri);
    				$r_url=urlencode('https://' . $_SERVER['HTTP_HOST'].$request_uri."&lsp=".$login_same_page."&ci=".$course_info);
    			}
    			else if(strpos($request_uri, 'referrer_code='.$_COOKIE['referrer_code'])){
    				$request_uri=str_replace('referrer_code='.$_COOKIE['referrer_code'], '', $request_uri);
    				$r_url=urlencode('https://' . $_SERVER['HTTP_HOST'].$request_uri."lsp=".$login_same_page."&ci=".$course_info);
    			}
    		}
    	}
    	else{
    		$r_url=urlencode('https://' . $_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']."?lsp=".$login_same_page."&ci=".$course_info);
    	}
    	$str=base64_encode($r_url);
    	/* added client id */
    	$g_authurl="https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/plus.me+https://www.googleapis.com/auth/userinfo.profile+https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/plus.login&response_type=code&access_type=offline&redirect_uri=".($g_url."users/accounts/login_backend.php")."&client_id=".$gp_client_id."&hl=en&from_login=1&as=-6136765567898e9e&authuser=0&state=".$str;
    	$fb_authurl="https://www.facebook.com/dialog/oauth?%20client_id=".$fb_client_id."&scope=email,user_friends,user_likes,user_birthday&auth_type=rerequest&redirect_uri=".$g_url."users/accounts/login_backend.php&state=".$str;
    	?>
    		<div class="login_signup_box clearfix row">
                <div class="col-sm-12 col-xs-12 login_col_right">
    				<div class="login_home clearfix">
    					<div class="col-sm-12">
                                <div class="login_box_logo text-center">
                                    <img src="/static/imgs/banknaukri_logo.png"></img>
                                </div>
                                <div class="login_mode_toggle text-center">
                                    <div class="col-sm-12 col-xs-12">
                                        <div class="col-sm-6 col-xs-6 login_tab tab_active">
                                            <span>Log in</span>
                                            <div class="tab_active_line"></div>
                                        </div>
                                        <div class="col-sm-6 col-xs-6 signup_tab">
                                            <span>Sign Up</span>
                                            <div class="tab_active_line"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="social_logins_container text-center">
                                    <a class="fb_url btn" href="<?php echo $fb_authurl; ?>" data-href="<?php echo $fb_authurl; ?>" class="btn btn-block btn-social btn-facebook center-block " onclick=common_ga('login','fb_login')><img src="<?php echo $g_url;?>/static/imgs/fb-icon.png"><span class="social-text">Log in with Facebook</span></a>
                                    <div class="clearfix"></div>
                                    <a class="gp_url btn" href="<?php echo $g_authurl; ?>" data-href="<?php echo $g_authurl; ?>" class="btn btn-block btn-social btn-google " onclick=common_ga('login','gplus_login')>
                                    <svg class="google_logo_svg" width="46px" height="46px" viewBox="0 0 46 46" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                                        <defs>
                                            <filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="filter-1">
                                                <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                                                <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                                                <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.168 0" in="shadowBlurOuter1" type="matrix" result="shadowMatrixOuter1"></feColorMatrix>
                                                <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter2"></feOffset>
                                                <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter2" result="shadowBlurOuter2"></feGaussianBlur>
                                                <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.084 0" in="shadowBlurOuter2" type="matrix" result="shadowMatrixOuter2"></feColorMatrix>
                                                <feMerge>
                                                    <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                                                    <feMergeNode in="shadowMatrixOuter2"></feMergeNode>
                                                    <feMergeNode in="SourceGraphic"></feMergeNode>
                                                </feMerge>
                                            </filter>
                                            <rect id="path-2" x="0" y="0" width="40" height="40" rx="2"></rect>
                                            <rect id="path-3" x="5" y="5" width="38" height="38" rx="1"></rect>
                                        </defs>
                                        <g id="Google-Button" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                                            <g id="9-PATCH" sketch:type="MSArtboardGroup" transform="translate(-608.000000, -219.000000)"></g>
                                            <g id="btn_google_dark_normal" sketch:type="MSArtboardGroup" transform="translate(-1.000000, -1.000000)">
                                                <g id="button" sketch:type="MSLayerGroup" transform="translate(4.000000, 4.000000)" filter="url(#filter-1)">
                                                    <g id="button-bg">
                                                        <use fill="#4285F4" fill-rule="evenodd" sketch:type="MSShapeGroup" xlink:href="#path-2"></use>
                                                        <use fill="none" xlink:href="#path-2"></use>
                                                        <use fill="none" xlink:href="#path-2"></use>
                                                        <use fill="none" xlink:href="#path-2"></use>
                                                    </g>
                                                </g>
                                                <g id="button-bg-copy">
                                                    <use fill="#FFFFFF" fill-rule="evenodd" sketch:type="MSShapeGroup" xlink:href="#path-3"></use>
                                                    <use fill="none" xlink:href="#path-3"></use>
                                                    <use fill="none" xlink:href="#path-3"></use>
                                                    <use fill="none" xlink:href="#path-3"></use>
                                                </g>
                                                <g id="logo_googleg_48dp" sketch:type="MSLayerGroup" transform="translate(15.000000, 15.000000)">
                                                    <path d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z" id="Shape" fill="#4285F4" sketch:type="MSShapeGroup"></path>
                                                    <path d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z" id="Shape" fill="#34A853" sketch:type="MSShapeGroup"></path>
                                                    <path d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z" id="Shape" fill="#FBBC05" sketch:type="MSShapeGroup"></path>
                                                    <path d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z" id="Shape" fill="#EA4335" sketch:type="MSShapeGroup"></path>
                                                    <path d="M0,0 L18,0 L18,18 L0,18 L0,0 Z" id="Shape" sketch:type="MSShapeGroup"></path>
                                                </g>
                                                <g id="handles_square" sketch:type="MSLayerGroup"></g>
                                            </g>
                                        </g>
                                    </svg>
                                    <div class="social-text">Sign in with Google</div></a>
                                </div>

                                <center><h5 class="fc8" style="margin-bottom: 2em;margin-top: 2em;">or use email</h5></center>

                                <!-- login mode  -->
                                <div class="login_form">
                                    <form class="form clearfix" method="POST" id="login_form" action="<?php echo $g_url;?>users/accounts/login_backend.php">
            							<input type="hidden" class="r_url" name="r_url" value="<?php echo $r_url; ?>" />
            							<div class="col-xs-12 col-sm-offset-2 col-sm-8 col-sm-offset-2">
                                            <input type="hidden" class="form-control" name="mode" value="LOGIN">
            								<input type="text" class="form-control add-form-control inp_field" placeholder="Email ID"  name="email" required ><br/>
            								<!-- <a class="show_pswd" onclick="changePswdType($(this))"><i class="glyphicon glyphicon-eye-open"></i></a> -->
            								<input type="password" class="form-control add-form-control inp_field" placeholder="Password"  name="pswd" required><br/>
            								<input type="submit" class="btn-1" value="Log In" /><br/>
            								<div class="forgot_text text-center">
            								<a  href="<?php echo $g_url;?>users/accounts/reset.php">Forgot your password?</a>
            								</div>
            							</div>
            						</form>
                                </div>
                                <!-- signup mode -->
                                <div  class="signup_box clearfix hidden">
                                    <form class="form clearfix" method="POST" id="signup_form" action="<?php echo $g_url;?>users/accounts/login_backend.php">
            							<input type="hidden" class="r_url" name="r_url" value="<?php echo $r_url; ?>" />
            							<input type="checkbox" class="hidden"  name="remember_me" checked />
            							<div class="col-xs-12 col-sm-offset-2 col-sm-8 col-sm-offset-2">
                                            <input type="hidden" class="form-control" name="mode" value="REGISTER">
            								<input type="text" class="form-control add-form-control inp_field" placeholder="Full Name" name="usr" required /><br/>
            								<input type="email" class="form-control add-form-control inp_field inp_email" placeholder="Email ID"  name="email" required ><br/>
            								<!-- <a class="show_pswd" onclick="changePswdType($(this))"><i class="glyphicon glyphicon-eye-open"></i></a> -->
            								<input type="password" class="form-control add-form-control inp_field inp_pass" placeholder="Password"  name="pswd" required><br/>
            								<input type="submit" class="btn-1" value="Signup for Bank Naukri" /><br/>

            							</div>
            						</form>
                                </div>
                        </div><!-- login box -->
    				</div><!-- Login signup box -->

    				<div class="clearfix"></div><br/>
                    <div class="loading hidden">
                        <div class="indeterminate"></div>
                    </div>
                    <div class="status clearfix"></div>
    				<div class="enable_cookie_status clearfix hidden">
    					<div class="alert alert-danger">
    						Please enable your browsers cookies to continue.
    					</div>
    				</div>
    			</div>
    		</div><!-- Login signup box -->
    <?php
    }

    //IS SAFE
    function isSafe($data,$mode)
    {
    	$data=trim($data);
    	$regex='/\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/ix';
    	if(!preg_match($regex,$data))
    	{
    		if($mode==1)
    		return 1;
    		else if($mode==2 && $data!="")
    		return 1;
    		else
    		return 0;
    	}
    	else
    	return 0;
    }// is Safe

    /* page header and navbar */
    function navbar_header() {
        global $g_url,$page_json,$g_cf_user_url;
    ?>
    <!-- ******HEADER****** -->
    <header id="header" class="header navbar-fixed-top main-header" itemscope="" itemtype="http://www.schema.org/SiteNavigationElement" >
            <nav class="navbar navbar_banknaukri" id="top_banner" data-url="<?php echo $g_url;?>">

                <div class="navbar-toggle collapsed pull-left visible-xs" id="navbar-mobile-menu-toggle" data-toggle="collapse" onclick="toggle_navbar_sidemenu();">
                    <span class="glyphicon glyphicon-menu-hamburger"></span>
                </div>
                <div class="navbar_right_sidebar visible-xs">
                    <div class="sidebar_header">
                        <ul class="nav navbar-nav">
                            <li class="sidebar_main_item expandable"><a href="javascript:void(0);" onclick="toggle_sidebar_sublist()">Bank Exam Prep <span class="glyphicon glyphicon-menu-down"></span></a>
                                <div class="subele_container hidden">
                                <?php
                                foreach($page_json['sections']['navbar']['bank_exams_prep'] as $ele)
                                {
                                    echo '<div class="sidebar_subele"><a href="'.$ele["url"].'">'.$ele["name"].'</a></div>';
                                }?>
                                </div>
                            </li>
                            <li class="sidebar_main_item expandable"><a href="javascript:void(0);" onclick="toggle_sidebar_sublist()">Govt Exam Prep <span class="glyphicon glyphicon-menu-down"></span></a>
                                <div class="subele_container hidden">
                                <?php
                                foreach($page_json['sections']['navbar']['govt_exams_prep'] as $ele)
                                {
                                    echo '<div class="sidebar_subele"><a href="'.$ele["url"].'">'.$ele["name"].'</a></div>';
                                }?>
                                </div>
                            </li>
                            <li class="sidebar_main_item"><a href="<?php echo $g_url;?>free-resources">Free Resources</a></li>
                            <!-- <li class="sidebar_main_item"><a href="<php echo $g_url;?>comphrensivecourse">Free Resources</a></li> -->

                            <li class="sidebar_main_item"><a href="<?php echo $g_url;?>mocktests/">Free Mock Tests</a></li>
                        </ul>
                    </div>
                    <!-- dark overlay -->
                </div>
                <div class="sidebar_dark hidden" onclick="toggle_navbar_sidemenu()"></div>
                <!--logo-->
        		<a class="logo pull-left" href="<?php echo $g_url;?>">
        		    <img class="banknaukri_logo" src="<?php echo $g_url;?>/static/imgs/banknaukri_logo.png" alt="BANK NAUKRI">
        		</a>

                <!-- navbar center buttons -->
                <ul class="nav navbar-nav navbar_link_wrapper hidden-xs">
                    <li class="dropdown">
                      <a href="#" class="dropdown-toggle navbar_item" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Bank Exam Prep <span class="caret"></span></a>
                      <ul class="navbar_dropdown dropdown-menu">
                        <div class="col-sm-12">
                          <center>  <a class="dropdown_header text-center" href="<?php echo $g_url;?>comphrensivecourse" style="color:white;">BankNaukri Complete Bundle</a></center>
                            <li role="separator" class="divider"></li>
                            <!-- <div class="dropdown_column col-sm-4"> -->
                            <?php
                                $count=0;
                                foreach($page_json["sections"]["navbar"]["bank_exams_prep"] as $ele)
                                {
                                    if($count%3 == 0)
                                    {
                                        echo '<div class="dropdown_column col-sm-4">';
                                    }
                            ?>
                                <li><a href="<?php echo $ele["url"]; ?>"><?php echo $ele["name"]; ?></a></li>

                            <?php
                                if($count%3 ==0)
                                {
                                    echo '</div>';
                                }
                            }?>
                        </div>
                      </ul>
                    </li>
                    <li class="dropdown">
                      <a href="#" class="dropdown-toggle navbar_item" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Govt Exam Prep <span class="caret"></span></a>
                      <ul class="navbar_dropdown dropdown-menu">
                        <div class="col-sm-12">
                            <li class="dropdown_header text-center">BankNaukri Complete Bundle</li>
                            <li role="separator" class="divider"></li>
                            <?php
                                $count=0;
                                foreach($page_json["sections"]["navbar"]["govt_exams_prep"] as $ele)
                                {
                                    if($count%3 == 0)
                                    {
                                        echo '<div class="dropdown_column col-sm-4">';
                                    }
                            ?>
                                <li><a href="<?php echo $ele["url"]; ?>"><?php echo $ele["name"]; ?></a></li>

                            <?php
                                if($count%3 ==0)
                                {
                                    echo '</div>';
                                }
                            }?>
                        </div>
                      </ul>
                    </li>
                    <li><a class="navbar_item" href="<?php echo $g_url;?>free-resources">Free Resources</a></li>
                    <!-- <li><a class="navbar_item" href="<php echo $g_url;?>comphrensivecourse">Free Resources</a></li> -->
                    <li><a class="navbar_item" href="<?php echo $g_url;?>mocktests/">Free Mock Tests</a></li>
                </ul>

                <!-- navbar account controls -->
                <ul class="nav navbar-nav navbar-right navbar_controls pull-right">
                    <?php
                        if(isset($_COOKIE['_bn_ut']))
                        {
                            $first_char = ($_COOKIE["_bn_user_name"]!=null && trim($_COOKIE["_bn_user_name"]!=""))?strtolower(trim($_COOKIE["_bn_user_name"])[0]):'#';
                            ?>
                            <li class="navbar_mycourses hidden-xs">
                                <a href="<?php echo $g_url; ?>mycourses/" class="navbar_item">My Courses</a>
                            </li>
                            <li class="profile_dropdown dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button">
                                    <div class="username fc4 hidden-xs pull-right" id="username_div"><?php echo ($_COOKIE['_bn_user_name']);?></div>

                    				<div class="image_wrapper pull-right">
                    					<div class="pic_wrapper <?php echo $first_char;?>">
                    						<div class="user_profile_pic" style="background-image:url(<?php echo $g_cf_user_url.$_COOKIE['_bn_uid'].'-150.png';?>)"></div>
                    						<div class="profile_pic <?php echo $first_char;?>">
                    							<div class="arrow hidden"></div>
                    						</div>
                    					</div>
                    				</div>
                                </a>

                                <ul class="dropdown-menu">
                                    <li class="visible-xs"><a href="<?php echo $g_url; ?>mycourses/">My Courses</a></li>
                                    <div class="visible-xs">
                                        <li role="separator" class="divider"></li>
                                    </div>
                                    <li><a href="<?php echo $g_url; ?>users/accounts/change_password.php">Change Password</a></li>
                                    <li><a href="<?php echo $g_url;?>users/accounts/logout.php">Logout</a></li>
                                </ul>

                            </li>
                        <?php }
                        else
                        {
                    ?>
                    <li class="hidden-xs"><a href="javascript:void(0)" class="navbar_login" onclick="$('#login_signup_modal').modal('show');">Login</a></li>
                    <li><button class="navbar_signup btn" href="javascript:void(0)" onclick="$('#login_signup_modal').modal('show');">Sign Up!</button>
                    <?php
                    }
                    ?>
                </ul>

            </nav>

    </header>
    <div class="clearfix" style="padding-bottom:60px"></div>
    <!-- modals -->
    <div id="login_signup_modal" class="modal fade modal-1" data-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="hide_validate_modal();">
                <i class="glyphicon glyphicon-remove" aria-hidden="true"></i>
            </button>
            <div class="modal-body bc4">
                <div class="container-fluid modal_container">
                    <div class="modal_container">
                            <?php echo loginPage(0,0,''); ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php }

    /* homepage footer */
    function footer()
    {
        global $g_url,$page_json;
        ?>
        <footer id="footer" class="clearfix">
            <div class="container">
                <div class="footer_wrapper col-sm-12 col-xs-12">
                    <div class="col-sm-3">
                        <div class="footer_column_head">Company</div>
                        <div class="footer_column_elements">
                            <div class="column_item">About basbeta</div>
                            <div class="column_item"><a href="<?php echo $g_url;?>contact-us">Contact</a></div>
                            <div class="column_item"><a href="<?php echo $g_url;?>info/privacy-policy">Privacy Policy</a></div>
                            <div class="column_item">Partner with us</div>
                        </div>
                    </div>

                    <div class="col-sm-3">
                        <div class="footer_column_head">Our Partners</div>
                        <div class="footer_column col-sm-12 col-xs-12">
                        </div>

                    </div>

                    <div class="col-sm-3">
                        <div class="footer_column_head">Contact Us</div>
                        <div class="footer_column col-sm-12 col-xs-12">
                        </div>
                    </div>

                    <div class="col-sm-3">
                        <img class="bnkn_footer_logo" src="<?php echo $g_url;?>/static/imgs/bankn_grey.png">
                        <div class="column_item bankn_tagmsg">basbeta is India’s No.1 Shopping Site.</div>
                    </div>
                    <div class="row_break hidden-sm"></div>
                </div>
            </div>
        </footer>
    <?php
    }

    /*change the params to pretty url compatiable text*/
    function pretty_case($value)
    {
        $value = trim($value);
        $value = strtolower($value);
        $value = str_replace(" ","-",$value);
        return $value;
    }

?>
