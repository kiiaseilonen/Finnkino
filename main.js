 // ladataan elokuvat dropdown valikkoon ja luodaan fadein-efekti bodyyn, kun sivu on ladattu
 $(window).ready(function(){
  getTheatres();
  $('body').css('display', 'none');
  $('body').fadeIn(500);
  });


// luodaan funktio, jolla teatterit haetaan 
function getTheatres() {

  //luodaan api request
$.get("https://www.finnkino.fi/xml/TheatreAreas/", function(theatres) {
    $(theatres)
    // valitaan tieto jota haetaan eli teatterit
    .find("TheatreArea")

    //haetaan jokaiseen vaihtoehtoon nimi ja id
    .each(function () {
      var id = $(this).find("ID").text();
      var name = $(this).find("Name").text();

      // lisätään saatu data dropdown menuun
      $("#ddmenu").append(
        '<option value="' + id + '">' + name + "</option>"
      );

    });
});
}


// luodaan eventlistener, jonka avulla saadaan oikeat päivämäärät näkyviin teattereittain
$("#ddmenu").change(function () {
  
    // haetaan tietoa rajapinnasta
  $.get("https://www.finnkino.fi/xml/ScheduleDates/?area=" + $("#ddmenu").val(), 
  function(dates) {

    // resetataan html, ettei edellisiä tuloksia jää näkyviin 
    $("#paivat").html("");
    
    $(dates)
    
    //haetaan rajapinnasta esitysten päivämäärät ja siistitään saatu data nätimpään muotoon
      .find("dateTime")
        .each(function () {
          var date = $(this).text();
          var day =  date.substring(8, 10);
          var month =  date.substring(5, 7);
          var year =  date.substring(0, 4);
          var fullDate = day + "." + month + "." + year;

      // lisätään saatu data dropdown menuun
            $("#paivat").append(
              '<option value="' + fullDate + '">' + fullDate + '</option>'
            );
        });
  });
});

  // luodaan eventlistener, jonka avulla saadaan oikeat leffat näkyviin teattereittain ja päiväkohtaisesti
$("#paivat, #ddmenu").change(function () {

    // resetataan html, ettei edellisiä tuloksia jää näkyviin 
 $("#elokuvat").html("");

    // haetaan tietoa rajapinnasta
  $.get("https://www.finnkino.fi/xml/Schedule/" + '?area=' + $("#ddmenu").val()  + "&dt=" + $("#paivat").val(), 
  function(movies) {
     
    $(movies)

    // haetaan tarvittava data
      .find("Show")
      .each(function (){
     
        var MovieId = $(this).find("EventID").text();
        var MovieTitle = $(this).find("Title").text();

        // lisätään data valikkoon
          $("#elokuvat").append(
                '<option value="' + MovieId + '">' + MovieTitle + '</option>'
              );  
              
              //poistetaan listalta dublicatet
           $("#elokuvat option").each(function() {
          $(this).siblings('[value="'+ $(this).val() +'"]').remove();
  
         
      });
    });
});
  
  // lisätään valikkoon vaihtoehto "kaikki elokuvat"
   $("#elokuvat").append(
    '<option value="hidden" selected>' + "Kaikki elokuvat" + '</option>');
   $("#elokuvat").val("hidden")
 

}); 

// luodaan eventlistener buttonille, jolloin saadaan lista elokuvista
$("#lataaNaytos").click(function () {

  // luodaan taas pyyntö apille
 $.get("https://www.finnkino.fi/xml/Schedule/" + '?area=' + $("#ddmenu").val()  + "&dt=" + $("#paivat").val() + "&eventID=" + $("#elokuvat").val(), 
  function(events) {

    // resetataan html, ettei edellisiä tuloksia jää näkyviin 
    $("#leffatiedot").html("");

    // luodaan taulukko, jonne data laitetaan näkyviin
    var table = "<div class='table-responsive'> <table class='table table-borderless table-dark'>";
    $(events)

    // haetaan tarvittavat tiedot apista ja tallennetaan ne muuttujiin
      .find("Show")
      .each(function () {
        var image = $(this).find("EventSmallImagePortrait").text();
        var title = $(this).find("Title").text();
        var theatre =$(this).find("Theatre").text();

        var time = $(this).find("dttmShowStart").text().substring(11, 16);
        var date = $(this).find("dttmShowStart").text()
        var day =  date.substring(8, 10);
        var month =  date.substring(5, 7);
        var year =  date.substring(0, 4);
        var fullDate = day + "." + month + "." + year;
        var genres = $(this).find("Genres").text();
        var auditorium = $(this).find("TheatreAuditorium").text();
        var pm = $(this).find("PresentationMethod").text();


        // lisätään muuttujat taulukkoon
        table += "<tr>";
            table += "<td id='leffakuva' rowspan=3 class='text-left'><img  src='" + image + "'></td>";
            table += "<td class='text-left'><h4>" + title + "</h4></td>";
        table += "</tr>";
        table += "<tr>";
            table += "<td class='text-left'><h3>" + time + "</h3></td>";
            table += "<td><p>" + theatre + "</p></td>";
            table += "<td><p>" + pm + "</p></td>";
        table += "</tr>";
        table += "<tr class='line'>";
            table += "<td class='text-left'><p>" + fullDate + "</p></td>";
            table += "<td><p>" + auditorium + "</p></td>";
            table += "<td><p>" + genres + "</p></td>";
        table += "</tr>";
        });
      table += "</table></div>";
  
      // tulostetaan taulukko näytölle
      $("#leffatiedot").append(
        table
      );  
      
  })
})

  // luodaan efektejä buttoniin
  $("#lataaNaytos").mouseover(function () {
    $("#lataaNaytos").css({ background: "#ce9e02", color: "white", transition:"0.4s"});
  });

  $("#lataaNaytos").mouseout(function () {
    $("#lataaNaytos").css({ background: "#fdc300", color: "black" });
  });
  
  
 

