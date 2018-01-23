/* top exams card redirect action */
$(".top_exams_section .top_exams_wrapper .card_body").click(function(){
    window.location.href = $(this).attr("card_url");
});
