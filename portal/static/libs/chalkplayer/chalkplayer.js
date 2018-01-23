$(function(){

	/*finding video pointer*/
	cp_mediaPlayer = document.getElementById("media_video");
	fallback_player = document.getElementById("fallback_video");

	/*initiate polyfill*/
	shaka.polyfill.installAll();
	/*check for support*/
	shaka.Player.support().then(function(support) {
		if (!support.supported)
	  	$(".chalk_player").attr("data-valid","0");
	  else if($(".chalk_player").attr("data-valid")!="2")
	  {
	  	$(".chalk_player").attr("data-valid","1");
	  	cp_shakaPlayer = new shaka.Player(cp_mediaPlayer);
			window.cp_shakaPlayer = cp_shakaPlayer;
			cp_shakaPlayer.addEventListener('error', videoErrorEvent);
		  cp_shakaPlayer.configure({ preferredAudioLanguage: 'en' });
	  }
	});

  /*checking compatiability*/
	$(".chalk_player").attr("data-valid","1");
	if(!!document.getElementById('media_video').canPlayType)
		$(".chalk_player").attr("data-valid","1");
	else
	{
		$(".chalk_player").addClass("hidden").attr("data-valid","0");
		$(".fallback_player").removeClass("hidden");
	}

	// Safari fallback
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf('safari') != -1 && ua.indexOf('chrome') == -1)
	{
		$(".chalk_player").addClass("hidden").attr("data-valid","2");
		$(".fallback_player").removeClass("hidden");
		document.getElementById('fallback_video').addEventListener('error', videoErrorEvent);
	}
	else if($(".chalk_player").attr("data-valid")!=="1")
	{
		document.getElementById('media_video').addEventListener('error',videoErrorEvent,false);
		document.getElementById('media_video').onloadeddata = function(){
			$('.chalk_player .loadingWrapper').addClass('hidden');
			if(typeof g_cplay_t !=='undefined' && g_cplay_t!=0)
			cp_mediaPlayer.currentTime = g_cplay_t;
		 };
     /*hiding controls*/
   	 $(".chalk_player video").prop("controls",false);
	}

	/*volume carry forward*/
	var _l_vol=50;
  if (localStorage.chst_video_vol)
  	_l_vol=Number(localStorage.chst_video_vol);
  cp_mediaPlayer.volume = _l_vol/100;
  ui_volume(_l_vol);
	change_volume_icon();

	/* time drag status */
	var timeDrag = false;
	$('.chalk_player .progressWrapper').mousedown(function(e) {
		if($(".chalk_player video").attr("data-video-ready")=="1")
		{
			timeDrag = true;
		  $(".chalk_player video").attr("data-play-status",((cp_mediaPlayer.paused)?"0":"1"));
		  $(".chalk_player .media_controls .progressWrapper").addClass("seeking");
			cp_mediaPlayer.pause();
		  update_progress(e.pageX,"mousedown");
		}
	});

	/*volume drage status*/
	var volumeDrag = false;
	$('.chalk_player .volumeWrapper').mousedown(function(e) {
		if($(".chalk_player video").attr("data-video-ready")=="1")
		{
			volumeDrag = true;
	  	update_volume(e.pageX);
		}
	});

	/*after click*/
	$(document).mouseup(function(e) {
	  if(timeDrag) {
	    timeDrag = false;
	    $(".chalk_player .media_controls .timeBar,.chalk_player .media_controls .videoThumb").addClass("cs_animate");
	    $(".chalk_player .media_controls .progressWrapper").removeClass("seeking");
	    if($(".chalk_player video").attr("data-play-status")=="1")
	    	cp_mediaPlayer.play();
	    update_progress(e.pageX,"mouseup");
	  }
	  if(volumeDrag) {
	  	$(".chalk_player .media_controls .volume,.chalk_player .media_controls .volumeThumb").addClass("cs_animate");
	    volumeDrag = false;
	    update_volume(e.pageX);
	  }
	});

	/*after movement*/
	$(document).mousemove(function(e) {
    if(timeDrag)
    {
    	$(".chalk_player .media_controls .timeBar,.chalk_player .media_controls .videoThumb").removeClass("cs_animate");
      update_progress(e.pageX,"mousemove");
    }
    if(volumeDrag)
    {
    	$(".chalk_player .media_controls .volume,.chalk_player .media_controls .volumeThumb").removeClass("cs_animate");
      update_volume(e.pageX);
    }
	});

	/*progress on tooltip*/
	$(".chalk_player .media_controls .progressWrapper").mousemove(function(e){
		if($(".chalk_player video").attr("data-video-ready")=="1")
    	progress_on_tooltip(e.pageX);
	});

	/*timer updates*/
	cp_mediaPlayer.ontimeupdate = function(){
		set_progress();
		$(".chalk_player .loadingWrapper").addClass("hidden");
		if($(".chalk_player video").attr("data-diy")=="1" && $(".chalk_player video").attr("data-diy-stop")=="0")
			check_diy();
	}

	/*on pause*/
	cp_mediaPlayer.onpause = function(){
		$(".chalk_player .media_controls .play_icon .media_icon").addClass("glyphicon-play").removeClass("glyphicon-pause");
	}

	/*when loading for data*/
	cp_mediaPlayer.onwaiting = function(){
		$(".chalk_player .loadingWrapper").removeClass("hidden");
	}

	/*when video plays*/
	cp_mediaPlayer.onplay = function(){
		$(".chalk_player .media_controls .play_icon .media_icon").removeClass("glyphicon-play").addClass("glyphicon-pause");
		$(".chalk_player .loadingWrapper").addClass("hidden");
	}

	/*when video ends*/
	cp_mediaPlayer.onended = function(){
		$(".chalk_player .media_controls .play_icon .media_icon").addClass("glyphicon-repeat").removeClass("glyphicon-pause").removeClass("glyphicon-play");
		/*show transition*/
		$(".chalk_player video").addClass("end_transition");
		$(".chalk_player .media_controls").removeClass("hidden");
		/*show progress*/
		var total_boxes = $(".toc .box").length;
		var completed_boxes = $(".toc .box[data-box-status='2']").length;
		var percentage = Math.round(completed_boxes/total_boxes*100);
		/*when review modal hides*/
	  $('#review_modal').on('hidden.bs.modal', function () {
			last_transition(percentage);
		});
		/*course completion*/
		if((percentage==100 || completed_boxes==Math.round(total_boxes*20/100)) && $("body").attr("data-course-complete")=="0")
		{
			$("#review_modal .text_percent").html(percentage+"%");
			if(percentage==100)
				$("#review_modal .trophy_img").removeClass("hidden");
			$("#review_modal").modal("show");
			$("#review_modal .course_progress .progress-bar").css("width",percentage+"%");
		}
		/*show last transition*/
		else
			last_transition(percentage);
	}

	/*when video starts playing*/
	cp_mediaPlayer.ondurationchange = function(){
		on_video_start();
	}

	/*fullscreen listner*/
	$(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange",function(){
		 var state = (document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.MSFullScreen);
		 if(state)
			add_fullscreen();
		else
			remove_fullscreen();
	});

	/*hide and show media controls*/
	$(".chalk_player").hover(mouse_in_video,mouse_out_video);
	$(".chalk_player").mousemove(mouse_move_video);
	$(".chalk_player .media_controls").hover(mouse_in_controls,mouse_out_controls);
	$(".chalk_player .diy_wrapper").hover(mouse_in_controls,mouse_out_controls);

	/*keyboard shortcuts*/
  $(document).keyup(function(e) {
  	if($(".chalk_player").attr("data-valid")=="1" && $(".chalk_player video").attr("data-video-ready")=="1" && !$(".discuss_platform").hasClass("discuss_visible"))
  		keyboard_shortcuts(e.keyCode);
  });

  /*show next and prev tooltips*/
  $(".chalk_player .media_controls .media_link").hover(function(){
  	$(this).find(".media_tooltip").removeClass("hidden");
  },function(){
  	$(this).find(".media_tooltip").addClass("hidden");
  });

  /*disable rightclick*/
  $('.chalk_player video,.fallback_player video').bind('contextmenu', function(e) {
	  return false;
	});

});

/*inititalizing youtube player*/
var yt_player;
function onYouTubeIframeAPIReady() {
  // yt_player = new YT.Player('youtube_player', {
  //     playerVars: { 'autoplay': 1, 'controls': 0 },
  //     events: {
  //       'onReady': onytPlayerReady,
  //       'onStateChange': onytPlayerStateChange
  //     }
  // });
}

/*inititalizing vimeo player*/
var vm_player;

/*when the youtube player has loaded*/
function onytPlayerReady(event)
{
  $(".embed_wrapper").attr("data-youtube-ready","1");
  yt_player.playVideo();
}

/*when youtube player state changes*/
function onytPlayerStateChange(event)
{
  var player_state = yt_player.getPlayerState();
  /*if video has ended, mark it as complete*/
  if(player_state==0 && $('#toc .box.active').attr('data-box-status')!=2)
    save_activity(2);
  /*if player has reached 90% mark as complete*/
  if(player_state==1)
    track_yotube_progress();
}

/*track youtube progress*/
function track_yotube_progress()
{
  var current = yt_player.getCurrentTime();
  var duration = yt_player.getDuration();
  if(current>duration*(0.8) && $('#toc .box.active').attr('data-box-status')!=2)
    save_activity(2);
  else
  {
      setTimeout(function () {
        var player_state = yt_player.getPlayerState();
        if(player_state==1)
          track_yotube_progress();
    }, 100);
  }
}

/* fetch policy **/
var g_fetch_vpolicy_lock=0;
function fetch_vpolicy(active_pass)
{
	var course_id=$('#toc').data('course_id');
	if(g_fetch_vpolicy_lock==0)
	{
		g_fetch_vpolicy_lock=1;
	$.ajax({
		type:"GET",
		dataType:"json",
		url:"backend.php",
		data:
		{
			mode:"FETCH_POLICY",
			cid:course_id,
			policies:g_vid_policies,
			vp_version:g_vp_version
		},
		success:function(json){
			g_fetch_vpolicy_lock=0;
			if(json.status==1)
			{
				g_cplay_t=cp_mediaPlayer.currentTime;
				g_vid_policies=json.policies;
				tout=json.tout;
				var box_url=$('#toc .box.active').attr('data-box-url');
				if(active_pass=="1")
				{
					var box_type=$('#toc .box.active').attr('data-box-type');
					if(box_type=='video' || box_type=='audio' || box_type=='diy')
					play_media('video',box_url,1);
					else if(box_type=='text')
					play_text(box_url);
				}
			}
		},
		error:function(err){
			g_fetch_vpolicy_lock=0;
      error_response(err);
		}
	});
	}// Locked
}

/** PROGRESS **/
/*show progress on tooltip*/
function progress_on_tooltip(x)
{
	var progress = $('.chalk_player .progressBar');
	var position = x - progress.offset().left;
	var maxduration = cp_mediaPlayer.duration;
	var percentage = 100 * position / progress.width();
	//Check within range
  if(percentage > 100) {
      percentage = 100;
  }
  if(percentage < 0) {
      percentage = 0;
  }
  var currentPos = maxduration * percentage / 100;
  $(".chalk_player .hoverTime").css("margin-left",percentage+'%');
  if(!isNaN(currentPos))
  	$(".chalk_player .media_controls .progressWrapper .hoverTime").removeClass("hidden").html(duration_display(currentPos));
  else
  	$(".chalk_player .media_controls .progressWrapper .hoverTime").addClass("hidden");
}

/*update progress bar*/
function update_progress(x,update_type)
{
  var progress = $('.chalk_player .progressBar');
  var maxduration = cp_mediaPlayer.duration;
  var position = x - progress.offset().left;
  var percentage = 100 * position / progress.width();
  //Check within range
  if(percentage > 100) {
      percentage = 100;
  }
  if(percentage < 0) {
      percentage = 0;
  }
  //Update progress bar and video currenttime
  $('.chalk_player .timeBar').css('width', percentage+'%');
  $(".chalk_player .videoThumb").css("margin-left",percentage+'%');
  var currentPos = maxduration * percentage / 100;
  $(".chalk_player .media_controls .videoProgress").html(duration_display(currentPos));
  $(".chalk_player .media_controls .videoDuration").html(duration_display(maxduration));
  if(update_type=="mouseup")
  {
  	cp_mediaPlayer.currentTime = currentPos;
	  /*update diy*/
		if($(".chalk_player video").attr("data-diy")=="1" && update_type!=undefined)
			update_diy();
		/*remove opacity if present*/
		if($(".chalk_player video").hasClass("end_transition"))
			remove_last_transition();
  }
}

/*set progress*/
function set_progress()
{
	var currentPos = cp_mediaPlayer.currentTime; //Get currenttime
  var maxduration = cp_mediaPlayer.duration; //Get video duration
  var percentage = 100 * currentPos / maxduration; //in %
  $('.chalk_player .timeBar').css('width', percentage+'%');
  $(".chalk_player .videoThumb").css("margin-left",percentage+'%');
  $(".chalk_player .media_controls .videoProgress").html(duration_display(currentPos));
}

/*update seek position*/
function update_seek_position(x)
{
	/*fetching current data*/
	var currentPos = cp_mediaPlayer.currentTime;
	var duration = cp_mediaPlayer.duration;
	var currentPos = currentPos+x;
	/*handling extreme cases*/
	if(currentPos<0)
		currentPos = 0;
	if(currentPos>duration)
		currentPos = duration;
	/*seeking to that position*/
	cp_mediaPlayer.currentTime = currentPos;
	cp_mediaPlayer.play();
	/*update diy*/
	if($(".chalk_player video").attr("data-diy")=="1")
		update_diy();
	/*remove opacity if present*/
	if($(".chalk_player video").hasClass("end_transition"))
		remove_last_transition();
}

/*set buffer*/
function set_buffer()
{
	if(cp_mediaPlayer.currentTime>0 && cp_mediaPlayer.buffered.length>0)
	{
		var maxduration = cp_mediaPlayer.duration;
	  var currentBuffer = cp_mediaPlayer.buffered.end(0);
	  if(currentBuffer <= maxduration)
	  {
	  	var percentage = 100 * currentBuffer / maxduration;
	  	$('.bufferBar').css('width', percentage+'%');
	  }
	}
	else
		$('.bufferBar').css('width', 0);
  setTimeout(function() {
		set_buffer();
	}, 1000);
}

/*convert seconds to h:m:s*/
function duration_display(seconds)
{
	var displayString = "";
	/*hours*/
	if(isNaN(seconds))
	return "00:00";
	if(seconds>3600)
	{
		hours = pad(Math.floor(seconds/3600), 2, 0);
		mins = pad(Math.floor(seconds/60-(hours*60)), 2, 0);
		secs = pad(Math.floor(seconds-(mins*60)-(hours*60*60)), 2, 0);
		displayString = hours+":"+mins+":"+secs;
	}
	else if(seconds>60)
	{
		mins = pad(Math.floor(seconds/60), 2, 0);
		secs = pad(Math.floor(seconds-(mins*60)), 2, 0);
		displayString = mins+":"+secs;
	}
	else
	{
		secs = pad(Math.floor(seconds), 2, 0);
		displayString = "00:"+secs;
	}
	return displayString;
}

/** VOLUME CONTROLS **/
/*update volume*/
function update_volume(x)
{
	/*change volume*/
	var volume = $(".chalk_player .media_controls .volumeBar");
  var position = x - volume.offset().left;
  var percentage = 100 * position / volume.width();
  /*taking care of extremes*/
  if(percentage>100)
  	percentage = 100;
  if(percentage<0)
  	percentage = 0;
  localStorage.setItem("chst_video_vol",(percentage != 0)?percentage:"0.5");
  ui_volume(percentage);
  cp_mediaPlayer.volume = percentage / 100;
  /*mute conditions*/
  mute_condition();
  /*change volume icon*/
  change_volume_icon();
}

/*volume mute condition*/
function mute_condition()
{
	if(cp_mediaPlayer.volume==0)
  	cp_mediaPlayer.muted = true;
  else if(cp_mediaPlayer.volume>0)
  	cp_mediaPlayer.muted = false;
}

/*change volume icon status*/
function change_volume_icon()
{
	if(cp_mediaPlayer.muted)
		$(".chalk_player .media_controls .volume_icon").find(".media_icon").removeClass("glyphicon-volume-up glyphicon-volume-down").addClass("glyphicon-volume-off");
	else
		$(".chalk_player .media_controls .volume_icon").find(".media_icon").removeClass("glyphicon-volume-off glyphicon-volume-up glyphicon-volume-down").addClass((cp_mediaPlayer.volume>0.5)?"glyphicon-volume-up":"glyphicon-volume-down");
}

/*change UI of the volume bar*/
function ui_volume(percentage)
{
  /*changing bar sizes*/
  $('.chalk_player .media_controls .volume').css('width', percentage+'%');
  $(".chalk_player .media_controls .volumeThumb").css("margin-left",percentage+'%');
}

/*toggle volume mute/unmute*/
function toggle_volume()
{
	cp_mediaPlayer.muted = !cp_mediaPlayer.muted;
	if(cp_mediaPlayer.muted)
		cp_mediaPlayer.volume = 0;
	else
	{
		var _l_vol=50;
		if (localStorage.chst_video_vol)
			_l_vol=Number(localStorage.chst_video_vol);
		cp_mediaPlayer.volume = _l_vol/100;
	}
	/*change icon*/
	change_volume_icon();
	/*change volume bar*/
	ui_volume(cp_mediaPlayer.volume*100);
}

/*update volume*/
function update_volume_by_value(x)
{
	/*fetching current volume*/
	var currentVolume = cp_mediaPlayer.volume;
	currentVolume = currentVolume+x;
	if(currentVolume<0)
		currentVolume = 0;
	if(currentVolume>1)
		currentVolume = 1;
	/*change volume*/
	cp_mediaPlayer.volume = currentVolume;
	/*mute conditions*/
  mute_condition();
	/*change icon*/
	change_volume_icon();
	var percentage = currentVolume*100;
	localStorage.setItem("chst_video_vol",(percentage != 0)?percentage:"0.5");
	/*change UI*/
	ui_volume(percentage);
}

/** VIDEO **/
function fetch_resolution()
{
	/*resolution carry forward*/
  var _l_res=4;
  if (localStorage.chst_video_res)
  {
		_l_res_local=(localStorage.chst_video_res);
		_l_res=(typeof(_l_res_local)==='undefined' || (isNaN(_l_res_local) && _l_res_local!='auto'))?_l_res:((g_vp_version==1 && _l_res_local=='auto')?_l_res:_l_res_local);
	}
	$('.chalk_player .media_controls .resolution_wrapper .settings_option[data-resolution]').removeClass('active');
	$('.chalk_player .media_controls .resolution_wrapper .settings_option[data-resolution='+_l_res+']').addClass('active');
	localStorage.setItem("chst_video_res",_l_res);
	return _l_res;
}

/*set available resolutions for the current video*/
function set_resolutions(videoTracks)
{
	$(".chalk_player .media_controls .resolution_wrapper .settings_option:gt(0)").addClass('hidden');
	var videoWidthIndex = {256:1,426:2,640:3,854:4,1280:5,1920:6};
	for (var i = 1; i < videoTracks.length; i++) {
		$(".chalk_player .media_controls .resolution_wrapper .settings_option[data-resolution='"+videoWidthIndex[videoTracks[i-1]["width"]]+"']").removeClass("hidden");
	};
}

/*on click of video player*/
function video_click(type)
{
	/*if settings not open*/
	if($(".chalk_player .settings_wrapper").hasClass("hidden"))
		toggle_video_play(type);
	else
		$(".chalk_player .settings_wrapper").addClass("hidden");
	/*if diy step present*/
	if($(".chalk_player video").attr("data-diy-step-show")=="1")
		goto_next_step();
}

/*pause/play video*/
function toggle_video_play(type)
{
	/*if video is paused*/
	if(cp_mediaPlayer.paused)
	{
		/*if video not reached end*/
		if(!cp_mediaPlayer.ended)
		{
			cp_mediaPlayer.play();
			$(".chalk_player .overlay_icon.play_btn").css("display","block").fadeOut("slow");
		}
		/*video reached end*/
		else if(cp_mediaPlayer.ended && type=='control')
		{
			$(".chalk_player .transition_wrapper").addClass("hidden");
			$(".chalk_player video").removeClass("end_transition");
			cp_mediaPlayer.currentTime = 0;
			cp_mediaPlayer.load();
		}
	}
	/*video playing*/
	else
	{
		cp_mediaPlayer.pause();
		$(".chalk_player .media_controls").attr("data-mouse-in","1");
		mouse_in_video();
		$(".chalk_player .overlay_icon.pause_btn").css("display","block").fadeOut(1000);
	}
}

/*ajax call to fetch media content URLs*/
function get_media_content(media_type,resumePoint)
{
	$('body').attr("data-learning-mode",media_type);
	/*reset video params*/
	video_reset();
	/*hide all box types*/
	$('[data-activity-type]').addClass("hidden");
	/*show loading*/
	$('#main_loading,.chalk_player .loadingWrapper').removeClass('hidden');

	fetch_media_link(1,0);
}

// Fetch media link
function fetch_media_link(force_play,force_loop)
{
	/*get user token*/
  var chalk_user_token = fetch_user_token();
	/*fetch params*/
	var course_url=$('#toc').data('course_url');
	var course_id=$('#toc').data('course_id');
	var box_content_id=$('#toc .box.active').attr('data-box-content-id');
	var box_id=$('#toc .box.active').attr('data-box-id');
  var cs_id = $("#toc").data("cs_id");
	_l_res=fetch_resolution();
	$.ajax({
			type:"POST",
			dataType:"json",
			headers:{
        'Authorization':chalk_user_token
	    },
	    url: g_api_url+"learning/fetch-media/",
			data:
			{
				mode:"FETCH_MEDIA_LINK",
				box_id:box_id,
				course_id:course_id,
				vp_version:g_vp_version,
				resolution:_l_res
			},
			success:function(json){
				if(json.status==1)
				{
					box_url=json.box_url;
					media_type=json.media_type;
					g_vid_policies=json.policies;
          content_type = json.content_type;
					if(force_loop==1)
					{
						// setTimeout(function(){ fetch_media_link(0,1);},parseInt(json.tout)*1000);
					}

					if(force_play==1)
					{
						cp_mediaPlayer.poster = "";
						if(media_type=="11" && $("#toc .box.active").attr("data-box-id")==box_id)
						{
							/* Viewing from boxcloud if box file_id is present */
							if (json.boxcloud_url==undefined || (json.boxcloud_url).trim().length==0)
								play_text(box_url);
							else
								fetch_embed_type_content(box_content_id,media_type);
						}
            /*box type embeded video*/
            else if( $('#toc .box.active').attr('data-box-id')==box_id && (media_type ==4) )
            {
              play_embed_media(box_url,content_type);
            }
						/*box type video*/
						else if( $('#toc .box.active').attr('data-box-id')==box_id && (media_type == 1 || media_type == 2 || media_type == 3) )
						{
							play_media('video',box_url,force_loop);
						}
						/*box type diy*/
						if($('#toc .box.active').attr('data-box-id')==box_id && $('#toc .box.active').attr('data-box-type')=='diy')
							fetch_diy(box_id,box_content_id);
						}// Resuming / starting..
				}
				else
				{
					/*hide all box types*/
					$('[data-activity-type]').addClass("hidden");
					/*show error message*/
					$('#main_loading').html('<div class="'+json.css+'">'+json.msg+'</div>');
				}
			},
			error:function(err){
					setTimeout(function(){ fetch_media_link(0,1);},5*1000);			}
		});

}

/*play video files*/
var g_cplay_t=0;
function play_media(media_type,url,force_loop)
{
	/*show video components*/
	$('[data-activity-type*="<video>"]').removeClass('hidden');
	/*load video*/
	$('#main_loading').addClass('hidden');
	$('.chalk_player .loadingWrapper').removeClass('hidden');
	var l_res=fetch_resolution();
	var  cin_url=url.split('/');
	// shakable and mpd available
	if($(".chalk_player").attr("data-valid")=="1" && g_vp_version == 2)
	{
		g_pp_version=1;
		var v_url=url+'v.mpd';
		cp_shakaPlayer.load(v_url).then(function(){
			/*set resolutions*/
			var videoTracks = cp_shakaPlayer.getTracks();
			set_resolutions(videoTracks);
			$('.chalk_player .loadingWrapper').addClass('hidden');
			// console.log(l_res);
			if(l_res=="auto")
			cp_shakaPlayer.configure({'abr': {
				defaultBandwidthEstimate:5000000,
				enabled:true
			}});
			else
			{
				cp_shakaPlayer.configure({'abr':{ enabled:false}});
				var current_tracks = cp_shakaPlayer.getTracks();
				var no_tracks=current_tracks.length; // Including audio track
				l_res=Math.min(l_res,no_tracks);
				cp_shakaPlayer.selectTrack(current_tracks[l_res-1],false);
				localStorage.setItem("chst_video_res",l_res);
				fetch_resolution();
			}
		},g_cplay_t);
	}
	// Fallback player for safari
	else if($(".chalk_player").attr("data-valid")=="2")
	{
		g_pp_version=2;
		url=url+(g_vp_version==1?'':'/m/')+'v1-0'+(l_res=='auto'?4:l_res)+'.mp4'+g_vid_policies[cin_url[4]];
		$('.chalk_player .loadingWrapper').addClass('hidden');
    fallback_player.src=url;
		fallback_player.load();
		fallback_player.play();
	}
	// Default player
	else //	if(g_vp_version == 1) // Normal player
	{
    var cslib = $("#toc").data('cslib');
		var cin_index = ((cslib=="1")?3:4);
		g_pp_version=3;
		$("#toc .box.active").attr('data-box-url',url);
		$('.chalk_player .media_controls .resolution_wrapper .settings_option[data-resolution]').addClass('hidden');
		$('.chalk_player .media_controls .resolution_wrapper .settings_option[data-resolution]:gt(0)').removeClass('hidden');
		cp_mediaPlayer.src=url+(g_vp_version==1?'':'/m/')+'v1-0'+(l_res=='auto'?4:l_res)+'.mp4'+g_vid_policies[cin_url[cin_index]];
		cp_mediaPlayer.load();

	}

}

/*play embed media*/
function play_embed_media(video_id,content_type)
{
  $(".embed_wrapper #youtube_player,.embed_wrapper #vimeo_player").addClass("hidden");
  switch (content_type)
  {
    /*youtube*/
    case "3":
      $(".embed_wrapper #youtube_player").removeClass("hidden");
      if($(".embed_wrapper").attr("data-youtube-first")=="1")
      {
        /*show video components*/
        $('[data-activity-type*="<embed_video>"]').removeClass('hidden');
        /*load video*/
        $('#main_loading').addClass('hidden');
        yt_player.loadVideoById(video_id, 5, "large");
      }
      else
      {
        yt_player = new YT.Player('youtube_player', {
            playerVars: { 'autoplay': 1, 'controls': 0 },
            events: {
              'onReady': onytPlayerReady,
              'onStateChange': onytPlayerStateChange
            }
        });
        /*put the source for the embed video*/
        $("#youtube_player").attr("src","https://www.youtube.com/embed/"+video_id+"?rel=0&iv_load_policy=3&?modestbranding=1&showsearch=0&showinfo=0&wmode=transparent&enablejsapi=1");
        /*if the youtube player is ready*/
        set_embed_player(content_type);
      }
    break;
    /*vimeo*/
    case "4":
      $(".embed_wrapper #vimeo_player").removeClass("hidden");
      if($(".embed_wrapper").attr("data-vimeo-first")=="1")
      {
        /*show video components*/
        $('[data-activity-type*="<embed_video>"]').removeClass('hidden');
        /*load video*/
        $('#main_loading').addClass('hidden');
        vm_player.loadVideo(video_id).then(function(id){
          vm_player.play();
        });
      }
      else
      {
        var options = {
            id: video_id,
            loop: false
        };
        vm_player = new Vimeo.Player('vimeo_player',options);
        vm_player.ready().then(function(){
          $(".embed_wrapper").attr("data-vimeo-ready","1");
        });
        vm_player.on('ended',function(data){
          if($('#toc .box.active').attr('data-box-status')!=2)
            save_activity(2);
        });
        vm_player.on("timeupdate",function(data){
          if(data.percent>0.8 && $('#toc .box.active').attr('data-box-status')!=2)
            save_activity(2);
        });
        /*if the vimeo player is ready*/
        set_embed_player(media_type);
      }
    break;
  }
}

/*set embed player*/
function set_embed_player(content_type)
{
  /*show video components*/
  $('[data-activity-type*="<embed_video>"]').removeClass('hidden');
	$('[data-activity-type*="<embed_video>"] .embed_wrapper').removeClass('hidden');
  /*load video*/
  $('#main_loading').addClass('hidden');
  /*configure the display*/
  $(".embed_wrapper").css("height",Math.round($(".embed_wrapper").width()*9/16)+"px");
  /*play the youtueb video*/
  if(content_type=="3")
    $(".embed_wrapper").attr("data-youtube-first","1");
  /*play the vimeo video*/
  else if(content_type=="4")
  {
    $(".embed_wrapper").attr("data-vimeo-first","1");
    vm_player.play();
  }
  /*save activity*/
  if($('#toc .box.active').attr('data-box-status')!=2)
    save_activity(1);
}

/*catch shaka player erros*/
function videoErrorEvent(event)
{
	// 0 => normal player, 1=>shaka , 2 =>fallback
	if((g_pp_version!=1 && typeof event.target.error !=='undefined' && (event.target.error.code=="2" || event.target.error.code=="4")) || (	g_pp_version==1 && event.detail!=undefined && event.detail.code=="1002") )// 403
	{
		g_cplay_t=cp_mediaPlayer.currentTime;
		fetch_media_link(1,0);
	}
	else
	console.log('Video Error Code:'+event.target.error.code);
}

/*video params reset*/
function video_reset()
{
	cp_mediaPlayer.pause();
	fallback_player.src = "";
	$(".chalk_player .media_controls .prev_box,.chalk_player .media_controls .next_box").addClass("media_disable").find(".media_link").attr("href","javascript:void(0)").find(".media_icon").removeClass("fc4");
	$(".chalk_player .loadingWrapper,.chalk_player .progressDuration,.chalk_player .diy_wrapper,.chalk_player .transition_wrapper,.discuss_platform").addClass("hidden");
	$(".chalk_player .videoThumb").css("margin-left","0");
	$(".chalk_player .bufferBar,.chalk_player .timeBar").css("width","0");
	$(".chalk_player video").attr("data-first-play","0");
	$(".chalk_player video").attr("data-video-ready","0");
	$(".chalk_player video").attr("data-stats","0");
	$(".chalk_player .media_controls").addClass("media_show");
	$(".chalk_player video").removeClass("end_transition");
  if($(".embed_wrapper").attr("data-youtube-ready")=="1")
    yt_player.pauseVideo();
  if($(".embed_wrapper").attr("data-vimeo-ready")=="1")
    vm_player.pause();
}

/*when video starts playing*/
function on_video_start()
{
	/*setting height of the player*/
	if($(".chalk_player video").attr("data-set-height")=="0")
	{
		$(".chalk_player video,.fallback_video video,.embed_wrapper").css("height",Math.round($(".chalk_player video").width()*9/16)+"px");
		$(".chalk_player video").attr("data-set-height","1");
	}
	$(".chalk_player video").attr("data-video-ready","1");
	/*buffer*/
	setTimeout(function() {
		set_buffer();
	}, 0);
	/*loading*/
	$(".chalk_player .loadingWrapper").addClass("hidden");
	setTimeout(function(){
		$(".chalk_player .media_controls").addClass("media_show");
		setTimeout(function(){
			if($(".chalk_player .media_controls").attr("data-mouse-in")=="0")
			{
				$(".chalk_player .media_controls").attr("data-prev-hide",Date.now());
				mouse_out_video();
			}
		},4000);
	},0);
	/*video ranges*/
	$(".chalk_player .media_controls .videoProgress").html("00:00");
	$(".chalk_player .media_controls .videoDuration").html(duration_display(cp_mediaPlayer.duration));
	$(".chalk_player .media_controls .progressDuration").removeClass("hidden");
	if($("body").attr("data-course-perm")=="1")
		$(".discuss_platform").removeClass("hidden");
	/*resolution change*/
	var start_position = $(".chalk_player video").attr("data-start-position");
	if(start_position!="0")
	{
		$(".chalk_player video").attr("data-start-position","0");
		cp_mediaPlayer.currentTime = start_position;
	}
}

/*when mouse enters video*/
function mouse_in_video()
{
	$(".chalk_player .media_controls").addClass("media_show");
	if($(".chalk_player video").attr("data-diy")=="1")
		$(".chalk_player .diy_wrapper .steps_container").removeClass("hidden");
	setTimeout(function() {
		if($(".chalk_player .media_controls").attr("data-mouse-in")=="0")
			if(Date.now()-$(".chalk_player .media_controls").attr("data-prev-hide")>4000)
			{
				$(".chalk_player .media_controls").attr("data-prev-hide",Date.now());
				mouse_out_video();
			}
	}, 4000);
}

/*when mouse moves over video*/
function mouse_move_video()
{
	$(".chalk_player .media_controls").addClass("media_show");
	if($(".chalk_player video").attr("data-diy")=="1")
		$(".chalk_player .diy_wrapper .steps_container").removeClass("hidden");
	setTimeout(function() {
		if($(".chalk_player .media_controls").attr("data-mouse-in")=="0")
			if(Date.now()-$(".chalk_player .media_controls").attr("data-prev-hide")>4000)
			{
				$(".chalk_player .media_controls").attr("data-prev-hide",Date.now());
				mouse_out_video();
			}
	}, 4000);
}

/*when mouse leaves video*/
function mouse_out_video()
{
	$(".chalk_player .media_controls").removeClass("media_show");
	$(".chalk_player .media_controls .settings_wrapper").addClass("hidden");
	if($(".chalk_player .diy_wrapper .content_wrapper").hasClass("hidden"))
		$(".chalk_player .diy_wrapper .steps_container").addClass("hidden");
}

/*when mouse enters media controls*/
function mouse_in_controls()
{
	$(".chalk_player .media_controls").attr("data-mouse-in","1");
}

/*when mouse leaves media controls*/
function mouse_out_controls()
{
	$(".chalk_player .media_controls").attr("data-mouse-in","0");
}

/*toggle fullscreen*/
function toggle_fullscreen()
{
	/*go to fullscreen*/
	if($(".chalk_player video").attr("data-fullscreen-mode")=="0")
	{
		if (cp_mediaPlayer.parentNode.requestFullscreen)
	  	cp_mediaPlayer.parentNode.requestFullscreen();
		else if (cp_mediaPlayer.parentNode.msRequestFullscreen)
		  cp_mediaPlayer.parentNode.msRequestFullscreen();
		else if (cp_mediaPlayer.parentNode.mozRequestFullScreen)
		  cp_mediaPlayer.parentNode.mozRequestFullScreen();
		else if (cp_mediaPlayer.parentNode.webkitRequestFullscreen)
		  cp_mediaPlayer.parentNode.webkitRequestFullscreen();
	}
	/*exit fullscreen*/
	else
	{
		if (document.exitFullscreen)
			document.exitFullscreen();
		else if(document.mozCancelFullScreen)
			document.mozCancelFullScreen();
		else if(document.msExitFullscreen)
			document.msExitFullscreen();
		else if(document.webkitExitFullscreen)
			document.webkitExitFullscreen();
	}
}

/*adding fullscreen*/
function add_fullscreen()
{
	$(".chalk_player .media_controls,#media_video,.chalk_player").addClass("fullscreen_mode");
	$(".chalk_player video").attr("data-fullscreen-mode","1");
}

/*removing fullscreen*/
function remove_fullscreen()
{
	$(".chalk_player video").attr("data-fullscreen-mode","0");
	$(".chalk_player .media_controls,#media_video,.chalk_player").removeClass("fullscreen_mode");
}

/*toggle settings*/
function toggle_settings()
{
	var settings_wrapper = $(".chalk_player .media_controls .settings_wrapper");
	if(settings_wrapper.hasClass("hidden"))
		settings_wrapper.removeClass("hidden");
	else
		settings_wrapper.addClass("hidden");
}

/*change playback rate*/
function change_playback_rate(x)
{
	if(!x.hasClass("active"))
	{
		$(".chalk_player .media_controls .speed_wrapper .settings_option").removeClass("active");
		x.addClass("active");
		cp_mediaPlayer.playbackRate = x.attr("data-playback-rate");
		$(".chalk_player .media_controls .settings_wrapper").addClass("hidden");
	}
}

/*change resolution of the videos*/
function change_resolution(x)
{
	if(!x.hasClass("active"))
	{
		/*fetching resolution*/
		$(".chalk_player .media_controls .resolution_wrapper .settings_option").removeClass("active");
		x.addClass("active");
		var _l_res_local = x.attr("data-resolution");
		if(typeof _l_res_local !=='undefined')
		_l_res=_l_res_local;
		localStorage.setItem("chst_video_res",_l_res);
		/*change resolution*/
		if(g_pp_version==3)// Normal player
		{
			cp_mediaPlayer.pause();
			var current_position = cp_mediaPlayer.currentTime;
			$(".chalk_player video").attr("data-start-position",current_position)
			play_media('video',$("#toc .box.active").attr('data-box-url'),'');
		}
		else if(g_pp_version==1)// shaka player
		{
			cp_mediaPlayer.pause();
			if(_l_res=="auto")
			cp_shakaPlayer.configure({'abr': {
				defaultBandwidthEstimate:5000000,
				enabled:true}});
			else
			{
				cp_shakaPlayer.configure({'abr':{'enabled': false} });
				var current_tracks = cp_shakaPlayer.getTracks();
				var no_tracks=current_tracks.length;
				cp_shakaPlayer.selectTrack(current_tracks[Math.min(_l_res,no_tracks)-1],false);
			}
			cp_mediaPlayer.play();
		}
	}
}

/*keyboard shortcuts*/
function keyboard_shortcuts(code)
{
	switch(code)
	{
		/*space -> toggle pause or play*/
		case 32:
			toggle_video_play();
		break;
		/*END -> go to end of video*/
		case 35:
			update_seek_position(cp_mediaPlayer.duration);
		break;
		/*HOME -> go to start of video*/
		case 36:
			$(".chalk_player .transition_wrapper").addClass("hidden");
			update_seek_position((-1)*cp_mediaPlayer.currentTime);
			cp_mediaPlayer.play();
		break;
		/*left arrow -> go back 5 seconds*/
		case 37:
			update_seek_position(-5);
		break;
		/*up arrow -> increase volume 5%*/
		case 38:
			update_volume_by_value(0.05);
		break;
		/*right arrow -> go forward 5 seconds*/
		case 39:
			update_seek_position(5);
		break;
		/*down arrow -> decrease volume 5%*/
		case 40:
			update_volume_by_value(-0.05);
		break;
		/*f -> go fullscreen*/
		case 70:
			toggle_fullscreen();
		break;
	}
}

/*toggle information*/
function toggle_information()
{

}

/*last transition*/
function last_transition(percentage)
{
	/*show next*/
	if(!$(".chalk_player .media_controls .left_side .next_box").hasClass("media_disable"))
	{
		if($("body").attr("data-course-perm")=="1")
		{
			setTimeout(function() {
				if(cp_mediaPlayer.currentTime==cp_mediaPlayer.duration)
					window.location.href=$(".chalk_player .media_controls .left_side .next_box .media_link").attr("href");
			}, 10000);
			/*check if next box exists*/
			$(".chalk_player .transition_wrapper .circle_loader .next_box").attr("href",$(".chalk_player .media_controls .left_side .next_box .media_link").attr("href"));
			var next_box_title = $(".box.active").nextAll(".box").find(".title").html();
			if(next_box_title!=undefined)
				$(".chalk_player .transition_wrapper .up_next").html("Up next: <b>"+next_box_title+"</b>");
			/*check if next section exists*/
			else
			{
				var next_section_title = $(".box.active").parent().nextAll(".section_wrapper").find(".section").html();
				if(next_section_title!=undefined)
					$(".chalk_player .transition_wrapper .up_next").html("Next section: <b>"+next_section_title+"</b>");
			}
			$(".chalk_player .transition_wrapper").removeClass("hidden");
		}
		else
		{
			/*fetch all preview boxes*/
			var preview_boxes = [];
			$(".box.preview").each(function(){
				preview_boxes.push($(this).attr("data-box-id"));
			});
			/*check if next preview box exists*/
			var current_index = preview_boxes.indexOf($(".box.active").attr("data-box-id"));
			if(current_index>-1 && preview_boxes[current_index+1]!=undefined)
			{
				var next_box_id = preview_boxes[current_index+1];
				var next_preview_url = $(".box[data-box-id='"+next_box_id+"']").find(".title").attr("href");
				setTimeout(function() {
					if(cp_mediaPlayer.currentTime==cp_mediaPlayer.duration)
						window.location.href=next_preview_url;
				}, 10000);
				$(".chalk_player .transition_wrapper .circle_loader .next_box").attr("href",next_preview_url);
				var next_box_title = $(".box[data-box-id='"+next_box_id+"']").find(".title").html();
				if(next_box_title!=undefined)
					$(".chalk_player .transition_wrapper .up_next").html("Up next: <b>"+next_box_title+"</b>");
				$(".chalk_player .transition_wrapper").removeClass("hidden");
				fetch_next(next_box_id);
			}
		}
	}
}

/*fetch next url*/
function fetch_next(next_box_id)
{
  var next_box_id = $(".chalk_player .media_controls .next_box").attr("data-box-id");
	var next_box_content_id = $(".toc .box[data-box-id='"+next_box_id+"']").attr("data-box-content-id");
	var next_box_type = $(".toc .box[data-box-id='"+next_box_id+"']").attr("data-box-type");
	var course_id = $('#toc').data('course_id');
	var box_url=$(".toc .box[data-box-id='"+next_box_id+"']").attr("data-box-url");

	/*fetch next video url*/
	var _l_res = fetch_resolution();
	{
		if(next_box_type=="video" || next_box_type=="audio" )
			play_media(next_box_type,box_url,'');
	  else if(next_box_type=="audio")
	    play_media(next_box_type,box_url,'');
	  else if(next_box_type=="text")
	    play_text(box_url)
	  else if(next_box_type=="diy")
	    fetch_next_url(next_box_content_id,next_box_id,"v",_l_res);
	}
}

/*remove last transition*/
function remove_last_transition()
{
	$(".chalk_player .transition_wrapper").addClass("hidden");
	$(".chalk_player video").removeClass("end_transition");
	cp_mediaPlayer.play();
}

/*fetch upcoming url*/
function fetch_diy(box_id,box_content_id)
{
	var course_id=$('#toc').data('course_id');
  /*get user token*/
  var chalk_user_token = fetch_user_token();
  var cs_id = $("#toc").data("cs_id");
	/*AJAX*/
	$.ajax({
		type:"POST",
		dataType:"json",
		url: g_api_url+"learning/fetch-diy-steps/",
    headers:{
      'Authorization':chalk_user_token
    },
		data:
		{
			mode:"FETCH_DIY_STEPS",
			box_content_id:box_content_id,
			course_id:course_id,
      cs_id:cs_id
		},
		success:function(json){
			if(json.status==1)
			{
				$('[data-activity-type*="<video>"]').removeClass('hidden');
				$('[data-activity-type*="<diy>"]').removeClass('hidden');
				diy_init(json.steps,json.author);
			}
		},
		error:function(err){
      error_response(err);
		}
	});
}

/** DIY **/
/*loading DIY*/
function diy_init(content,author)
{
	$(".chalk_player video").attr("data-diy","1").attr("data-diy-stop","0").attr("data-diy-step",1).attr("data-diy-end",content[0]['end']).attr("data-diy-step-show","0");
	$(".chalk_player .diy_wrapper .steps_wrapper,.chalk_player .diy_wrapper .content_wrapper").empty();
	for (var i = 0; i < content.length; i++) {
		var step = i+1;
		/*cloning step*/
		var sclone = $("#diy_clones .diy_step").clone();
		sclone.removeClass("hidden").attr("data-diy-step",step).attr("data-diy-end",content[i]['end']).find(".step_number").html(step);
		sclone.prop("title",content[i]["diy_step"]);
		if(step==1)
			sclone.addClass("active");
		/*on click of the step*/
		sclone.click(function(){
			var clicked_step = $(this).attr("data-diy-step");
			if(clicked_step-1>=1)
				cp_mediaPlayer.currentTime = $(".chalk_player .diy_wrapper .diy_step[data-diy-step='"+(clicked_step-1)+"']").attr("data-diy-end");
			else
				cp_mediaPlayer.currentTime = 0;
			update_diy();
		});
		$(".chalk_player .diy_wrapper .steps_wrapper").append(sclone);
		/*cloning content*/
		var cclone = $("#diy_clones .diy_content").clone();
		cclone.addClass("hidden").attr("data-diy-step",step).attr("data-diy-end",content[i]['end']).find(".title").html(content[i]["diy_step"]);
		if(step+1<=content.length)
			cclone.find(".continue_btn").html("Continue to Step "+(step+1));
		cclone.find(".desc").html(content[i]["diy_content"]);
		cclone.find(".user_profile_pic").css('background-image','url("'+author['profile_pic']+'")');
		cclone.find(".profile_pic").addClass((author.author_name!=undefined && author.author_name!=null && author.author_name!="" && author.author_name!="0")?author["author_name"].trim().charAt(0).toLowerCase():"c");
		cclone.find(".pic_wrapper").addClass((author.author_name!=undefined && author.author_name!=null && author.author_name!="" && author.author_name!="0")?author["author_name"].trim().charAt(0).toLowerCase():"c");
		$(".chalk_player .diy_wrapper .content_wrapper").append(cclone);
	};
	$(".chalk_player .diy_wrapper").removeClass("hidden");
}

/*check if the valid step is reached*/
function check_diy()
{
	var currentPos = cp_mediaPlayer.currentTime;
	var step_end = $(".chalk_player video").attr("data-diy-end");
	/*if current step exists*/
	if(step_end!=undefined)
	{
		currentPos = Math.floor(currentPos);
		step_end = parseInt(step_end);
		/*to show note*/
		if(currentPos==step_end)
			show_diy_note();
	}
}

/*if user chooses to update the seek position in diy*/
function update_diy()
{
	$(".chalk_player video").attr("data-diy-stop","0");
	$(".chalk_player .diy_wrapper .diy_content,.chalk_player .diy_wrapper .content_wrapper").addClass("hidden");
	/*fetch current time*/
	var currentPos = cp_mediaPlayer.currentTime;
	currentPos = Math.floor(currentPos);
	/*fetch diy steps*/
	var diy_ends = [];
	$(".diy_wrapper .diy_step").each(function(){
		diy_ends.push(parseInt($(this).attr("data-diy-end")));
	});
	/*find the current step it belongs to*/
	var next_step = 1;
	var step_flag = false;
	for (var i = 0; i < diy_ends.length; i++) {
		next_step = i+1;
		if(currentPos<diy_ends[i])
		{
			step_flag = true;
			break;
		}
	};
	/*set video for diy end*/
	if(!step_flag)
		$(".chalk_player video").attr("data-diy-stop","1");
	/*set video for that step*/
	else
	{
		var next_end = $(".chalk_player .diy_wrapper .diy_step[data-diy-step='"+next_step+"']").attr("data-diy-end");
		$(".chalk_player video").attr("data-diy-step",next_step).attr("data-diy-end",next_end);
		$(".chalk_player .diy_wrapper .diy_step").removeClass("active");
		$(".chalk_player .diy_wrapper .diy_step[data-diy-step='"+next_step+"']").addClass("active");
	}
}

/*show diy note on video*/
function show_diy_note()
{
	var current_step = $(".chalk_player video").attr("data-diy-step");
	/*pause video*/
	cp_mediaPlayer.pause();
	/*show note*/
	$(".chalk_player .diy_wrapper .content_wrapper,.chalk_player .diy_wrapper .diy_content[data-diy-step='"+current_step+"'],.chalk_player .diy_wrapper .steps_container").removeClass("hidden");
	$(".chalk_player video").attr("data-diy-step-show","1");
}

/*go to next step*/
function goto_next_step()
{
	var current_step = $(".chalk_player video").attr("data-diy-step");
	$(".chalk_player video").attr("data-diy-step-show","0");
	/*hide the note*/
	$(".chalk_player .diy_wrapper .content_wrapper,.chalk_player .diy_wrapper .diy_content,.chalk_player .diy_wrapper .steps_container").addClass("hidden");
	/*next step details*/
	var next_step = parseInt(current_step)+1;
	var next_end = $(".chalk_player .diy_wrapper .diy_step[data-diy-step='"+next_step+"']").attr("data-diy-end");
	/*to update the next step details*/
	$(".chalk_player .diy_wrapper .diy_step").removeClass("active");
	if(next_end!=undefined)
	{
		$(".chalk_player video").attr("data-diy-step",next_step).attr("data-diy-end",next_end);
		/*next step active*/
		$(".chalk_player .diy_wrapper .diy_step[data-diy-step='"+next_step+"']").addClass("active");
	}
	else
		$(".chalk_player video").attr("data-diy-stop","1");
	/*play video*/
	cp_mediaPlayer.play();
}
