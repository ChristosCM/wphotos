function update(){
    $(document).ready(function() {
        var categories = ischecked();
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
                    $("#imshow").append('<img src="'+images[i].path+'"class = "image"><p>'+images[i].category+'</p><div class="divider"></div>')
                }
                $("imshow").html('</div>');
            }
            },

            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                alert("Status: " + textStatus); alert("Error: " + errorThrown); 
            }   

                });
            
            } 
        });
}
$(document).ready(function() {

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
                    $("#imshow").append('<img src="'+images[i].path+'"class = "image"><p>'+images[i].category+'</p><div class="divider"></div>')
                }
                $("imshow").html('</div>');
            }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                alert("Status: " + textStatus); alert("Error: " + errorThrown); 
            }   
                });
            
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



