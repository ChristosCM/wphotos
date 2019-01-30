function update(){
    $(document).ready(function() {
        var categories = ischecked();
        console.log(categories.length);
        if (categories.length!=0){
        $.ajax({
            url: '/images',
            type: 'GET',
            data: {"cat": categories},
            datatype: 'json',
            success(imagesST){
                var images = JSON.parse(imagesST);
                if (images.length){
                $("#imshow").html('<div class ="container-fluid" id="im">');
                for (i=0; i<images.length; i++){
                    $("#im").append('<figure class="figure"><img src="'+images[i].path+'"class = "image"><figcaption class="figure-caption">Category: '+images[i].category+' /Posted by user: '+images[i].user+' /On: '+images[i].date+'</figcaption></figure><div class="divider"></div>')
                }
                $("imshow").html('</div>');
            }else{
                $("#imshow").html('<h3>Unfortunately, there are no images in the categories you have selected</h3>');
            }

            },

            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                alert("Status: " + textStatus); alert("Error: " + errorThrown); 
            }   

                });
            
            } else{
                $("#imshow").html('<h3>No Categories Selected</h3>');

            }
        });
}
//this function hides the about section and the signup form that can be both shown with the use of buttons.
$(document).ready(function() {
    var x = document.getElementById("about");
    x.style.display = "none";
    var y = document.getElementById("signup");
    y.style.display = "none";


});
//function to show and hide about section on click of the navbar item
function shFunction() {
    var x = document.getElementById("about");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
  //function to show and hide the signup menu
  function shsign() {
    var x = document.getElementById("signup");
    if (x.style.display === "none") {
      x.style.display = "block";
      $('#sign').html("Hide");
    } else {
      x.style.display = "none";
      $('#sign').html("Sign Up");

    }
  }
//function to show navbar only when user is scrolling up
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-50px";
  }
  prevScrollpos = currentScrollPos;
} 

$(document).ready(function(){
    $('#signUpload').submit(function(e) {
   e.preventDefault();
   var forename = $("#forename").val();
   var surname = $("#surname").val();
   var email = $("#email").val();
   var username = $("#username").val();
   if (forename === ''){
    alert('Forename field is empty.');
    return false;
   }
   if (surname === ''){
    alert('Surname field is empty.');
    return false;
   }
   if (username === ''){
    alert('Username field is empty.');
    return false;
   }
   $.get("/people/"+username, function(data){
    if (data){
        alert('A user with the username already exists, please select another username.')
    }else {
        $.ajax({
            url: '/people',
            type: 'POST',
            data: {"forename": forename, "surname": surname, "email": email, "username": username, "access_token": "concertina"},
            datatype: 'json',
            success(data){
                alert("The user has been created. Now you can upload your own pictures!");
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                alert("Status: " + textStatus); alert("Error: " + errorThrown); 
            }
        })
    }
});
    });
});
$(document).ready(function() {
update();
$('#frmUploader').submit(function(e) {
   $("#status").empty().text("File is uploading...");
   $(this).ajaxSubmit({

       error: function(xhr) {
   status('Error: ' + xhr.status);
       },

       success: function(response) {
   $("#status").empty().text(response);
}
});

  //disables page return
return false;
}); 
});

$(document).ready(function() {
    var categories = ischecked();
        console.log(categories.length);
        if (categories.length!=0){
        $.ajax({
            url: '/images',
            type: 'GET',
            data: {"cat": categories},
            datatype: 'json',
            success(imagesST){
                var images = JSON.parse(imagesST);
                if (images.length){
                $("#imshow").html('<div class ="container-fluid" id="im">');
                for (i=0; i<images.length; i++){
                    $("#im").append('<figure class="figure"><img src="'+images[i].path+'"class = "image"><figcaption class="figure-caption">Category: '+images[i].category+' /Posted by user: '+images[i].user+' /On: '+images[i].date+'</figcaption></figure><div class="divider"></div>')
                }
                $("imshow").html('</div>');
            }else{
                $("#imshow").html('<h3>Unfortunately, there are no images in the categories you have selected</h3>');
            }

            },

            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                alert("Status: " + textStatus); alert("Error: " + errorThrown); 
            }   

                });
            
            } else{
                $("#imshow").html('<h3>Please select a category.</h3>');

            }
        });
    

function ischecked(){
    cat = [];
    if ($("#g").is(":checked")){
        cat.push($("#g").val())
    }
    if ($("#n").is(":checked")){
        cat.push($("#n").val())
    }
    if ($("#m").is(":checked")){
        cat.push($("#m").val())
    }
    if ($("#p").is(":checked")){
        cat.push($("#p").val())
    }
    if ($("#l").is(":checked")){
        cat.push($("#l").val())
    }
    if ($("#a").is(":checked")){
        cat.push($("#a").val())
    }
    if ($("#t").is(":checked")){
        cat.push($("#t").val())
    }
    return cat;
}



