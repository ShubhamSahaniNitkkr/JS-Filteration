<!DOCTYPE html>
<html>
    <head>
        <!-- mobile meta -->
        <meta name="HandheldFriendly" content="True">
        <meta name="MobileOptimized" content="320">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
        <title>Home | Shbham Sunny |Software Developer </title>
        <!--lib css-->
        <link href='../static/libs/bootstrap/css/bootstrap.min.css' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
        <!-- banknaukri CSS -->
        <link href='../static/css/common.css' rel='stylesheet' type='text/css'>
        <link href='freeresources.css' rel='stylesheet' type='text/css'>
        <link rel="icon" type="image/x-icon" href="../static/imgs/favicon.ico">
        <?php include_once "../ga.php"; ?>
    </head>
    <body>
        <?php include 'banner.php' ?>

        <div class="clearfix"></div>

        <!-- home success success testimonial end -->

        <!-- top exams list -->
        <div class="top_exams_section" style="background-color:white;">
            <div class="container">
                <div class="section_heading text-center col-sm-12 col-xs-12">
                    Filteration of Products using javascript .
                    <p style="font-size:15px;">Click on video to open modal,integrated algo to close video on close modal.</p>
                </div>
                <div class="top_exams_wrapper col-sm-12 col-xs-12">

              <!-- Course buttons background color -->
                    <div class="links">  </div>

              <!-- courses fetching from json file -->
                    <div class="rows">
                      <button class="active btns" id="all">General</button>
                      <?php
                          $json = file_get_contents('../../web_data/freeresources.json');
                          $data = json_decode($json,true);
                          $users4 = $data['exams'];
                      ?>
                      <?php
                      foreach($users4 as $courses) {
                      ?>
                      <!-- <div class="container"> -->

                      <button class="btns" id="<?=$courses['id']?>" ><?=$courses['course']?></button>

                      <?php } ?>



            <!-- courses materail fetching from database -->
                    <div class="spacer"></div>
                    <?php
                        $json = file_get_contents('../../web_data/freeresources.json');
                        $data = json_decode($json,true);
                        $users5 = $data['resources'];
                    ?>
                    <div id="parent">
                      <?php
                      foreach($users5 as $coursematerial) {
                      ?>


                    <div href="#" class="box <?= $coursematerial['id']?>" style="background-image:url('../static/imgs/<?=$coursematerial['thumb']?>'); background-size: 232px 128px; "data-toggle="modal" data-target="#<?=$coursematerial['no']?>" data-theVideo="<?=$coursematerial['url']?>"><?= $coursematerial['course']?></div>

                      <!--MOdal-->

                          <div class="modal fade" id="<?= $coursematerial['no']?>" role="dialog" data-keyboard="false" data-backdrop="static">
                            <div class="modal-dialog">

                              <!--Modal content-->
                              <div class="modal-content">
                                <div class="modal-header">
                                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                                  <center><h4 class="modal-title"><?= $coursematerial['course']?></h4></center>
                                </div>
                                <div class="modal-body" class="edit-content">
                                   <p class="edit-content"> </p>
                                  <center>
                                    <?php if($coursematerial['filetype']=="video")
                                    {?>
                                      <iframe width="520" height="345" src=""></iframe>
                                  <?php }
                                  else {
                                    ?>
                                    <div>
                                      <object data="test.pdf" type="application/pdf" width="520" height="345">
                                        alt : <a href="<?= $coursematerial['url']?>"><?= $coursematerial['url']?></a>
                                      </object>
                                    </div>
                                  <?php } ?>
                                </center>
                                </div>
                                <div class="modal-footer">
                                  <?php if($coursematerial['filetype']=="video")
                                  {?>
                                    <a class="btn btn-default" href='<?= $coursematerial['download']?> ' download>Download</a>

                                <?php }
                                else {
                                  ?>
                                  <a class="btn btn-default" href='<?= $coursematerial['url']?>' download>Download</a>


                                <?php } ?>


                                  <!-- <button type="button"  href="https://www.youtube.com/embed/F9Bo89m2f6g" download>Download</button> -->
                                </div>
                              </div>

                            </div>
                          </div>

                      <?php } ?>
                    </div>
                </div>
              </div>
            </div>
        </div>



        <!-- app promo section -->
        <div class="app_promo_section" style="background-color:#F8F8F8">
            <div class="container">
                <div class="section_heading text-center col-sm-12 col-xs-12" margin-top=-10px;>
                    basbeta app on the go !
                </div>
                <div class="app_promo_wrapper col-sm-12 col-xs-12">
                    <div class="col-sm-6">
                        <div class="app_promo_msg">
                            Get access to India’s best Bank Exam preparation anytime, anywhere, right from your mobile phone. Coming soon…
                        </div>
                        <div class="app_promo_logo">
                            <img src="..//static/imgs/play_store_soon.png">
                        </div>
                    </div>
                    <div class="app_promo_img col-sm-6">
                        <img src="..//static/imgs/app_promo.svg">
                    </div>
                </div>
            </div>
        </div>
        <!-- app promo section end -->

        <!-- page footer -->
        <?php echo footer(); ?>
        <!-- page footer end -->




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
    </div><!--registration modal end-->
    </body>
    <script type="text/javascript" src="../static/js/jquery/jquery-2.0.2.min.js"></script>
    <script type="text/javascript" src="../static/libs/bootstrap/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../static/js/common/common.js"></script>
    <script type="text/javascript" src="../static/js/home/home.js"></script>
    <script type="text/javascript" src="freeresources.js"></script>



</html>
