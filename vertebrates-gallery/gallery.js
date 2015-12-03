$(document).ready(function () {
  // Register a helper to show only the first 175 characters of a string variable
  Handlebars.registerHelper('substring', function(value) {
    return value.slice(0, 175) + '...';
  });
  
  // Render the Vertebrates object
  var vertebrates_source = $("#vertebrates-template").html();
  var vertebrates_template = Handlebars.compile(vertebrates_source);
  var vertebrates_html = vertebrates_template(animals_data);
  $('#vertebrates').html(vertebrates_html);
  
  // Render the Categories array
  var categories_source = $("#categories-template").html();
  var categories_template = Handlebars.compile(categories_source);
  var categories_html = categories_template(animals_data);
  $('#categories').html(categories_html);
  
  // Render the Animals array for the first category
  var animals_source = $('#animals-template').html();
  var animals_template = Handlebars.compile(animals_source);
  
  var category = animals_data.category[0];
  category.id = 0; // Add the index to the selected category and render it for each animal with {{@root.id}}
  
  var animals_html = animals_template(category);
  $('#animals').html(animals_html);
  
  // Render the Animals array for the selected category in the carousel
  $('#carousel-categories').on('slid.bs.carousel', function (event) {
    // relatedTarget is the DOM for the element <div class="item {{#if @first }}active{{/if}}" data-ref="{{@index}}"> 
    // within the categories-template
    var categoryId = parseInt(event.relatedTarget.dataset.category);
    
    var category = animals_data.category[categoryId];
    category.id = categoryId; // Add the index to the selected category and render it for each animal with {{@root.id}}
    
    var animals_html = animals_template(category);
    $('#animals').html(animals_html);
  });
  
  // Render the Animal object
  var animal_source = $('#animal-template').html();
  var animal_template = Handlebars.compile(animal_source);
  
  $('#animal-modal').on('show.bs.modal', function (event) {
    // relatedTarget is the DOM for the element <button type="button" class="btn btn-primary btn-xs" href="#"  data-toggle="modal" data-target="#animal-modal" data-category="{{@root.id}}" data-animal="{{@index}}">
    // within the categories-template
    var categoryId = parseInt(event.relatedTarget.dataset.category);
    var animalId = parseInt(event.relatedTarget.dataset.animal);
    
    var category = animals_data.category[categoryId];
    var animal = category.animals[animalId];
    
    var animal_html = animal_template(animal);
    $('#animal-modal').html(animal_html);
  });
});