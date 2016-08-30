// Uploads a Stem to current Project
function addNewStemEvent(button_id) {
	var new_stem_exist = document.getElementById(NEW_STEM_ROW_ID + proj_id);
	if(new_stem_exist != undefined) {
		return
	}
    var proj_id = button_id.replace("add_stem_", "");
	var stem_table_body= document.getElementById(STEM_TABLE_ID + proj_id).getElementsByTagName('tbody')[0];
	if(stem_table_body.hasChildNodes()) {
	    stem_table_body.innerHTML = "";	
	}	
	
	// NEW STEM TABLE
    var row = stem_table_body.insertRow(0);
	row.id = NEW_STEM_ROW_ID + proj_id;
    var cell = row.insertCell(0);
	var new_stem_table = document.createElement("table");
	new_stem_table.id = "new_stem_table_" + proj_id;
	new_stem_table.className = NEW_STEM_TABLE_ID;
	cell.appendChild(new_stem_table);
    
	row = new_stem_table.insertRow(new_stem_table.rows.length);
	cell = row.insertCell(0);
	text = document.createTextNode("STEMS");
    cell.appendChild(text);

    cell = row.insertCell(1);
    var input = document.createElement("INPUT");
    input.id = "stem_title_" + proj_id;
    input.placeholder = "Enter stem title";
    cell.appendChild(input);

    row = new_stem_table.insertRow(new_stem_table.rows.length);
    cell = row.insertCell(0);
    cell.width = "10%";

    cell = row.insertCell(1);
	var stemCategoryId = "stem_category_" + proj_id;
    cell.innerHTML = "<select id='"+stemCategoryId+"'>"+ 
                        "<option selected disabled>Category</option>"+
                        "<option value='drums'>Drums"+
                        "<option value='guitar'>Guitar"+
                        "<option value='producer'>Producer"+
                        "<option value='vocal'>Vocal";
    
	row = new_stem_table.insertRow(new_stem_table.rows.length);
	cell = row.insertCell(0);
	cell.width = "10%";
	
	cell = row.insertCell(1);
	var stemStatusId = "stem_status_" + proj_id;
	cell.innerHTML = "<select id='"+stemStatusId+"'>"+
                        "<option selected disabled>Status</option>"+
						"<option value='public'>Public"+
                        "<option value='private'>Private";
						
    row = new_stem_table.insertRow(new_stem_table.rows.length);
    cell = row.insertCell(0);
    cell.width = "10%";
    cell = row.insertCell(1);
	var stemUploadId = "stem_upload_" + proj_id;
    cell.innerHTML = "<input id='"+stemUploadId+"' type='file'>";
	
	// Extra spacing
    row = new_stem_table.insertRow(new_stem_table.rows.length);
    cell = row.insertCell(0);
    cell.setAttribute("class", "empty_cell");
	
	// Stem Save Button
	row = new_stem_table.insertRow(new_stem_table.rows.length);
	cell = row.insertCell(0);
	var saveButton = document.createElement("BUTTON");
	saveButton.id = "stem_save_button_" + proj_id;
	saveButton.value = proj_id;
	saveButton.innerHTML = "SAVE";
	saveButton.addEventListener('click', function() { saveStemEvent(this.value); }, false);
	cell.appendChild(saveButton);
	
	// Stem Cancel Button
	cell = row.insertCell(1);
	var cancelButton = document.createElement("BUTTON");
	cancelButton.id = "stem_cancel_button_" + proj_id;
	cancelButton.value = proj_id;
	cancelButton.innerHTML = "CANCEL";
	cancelButton.addEventListener('click', function() { cancelStemEvent(this.value); }, false);
	cell.appendChild(cancelButton);
}

function cancelStemEvent(proj_id) {
	var stem_table_body = document.getElementById(STEM_TABLE_ID + proj_id).getElementsByTagName('tbody')[0];
	stem_table_body.deleteRow(0);
}

function saveStemEvent(proj_id){
	var username = current_user.user.username;
	var stemCategoryId = "stem_category_" + proj_id;
	var stemCategory = document.getElementById(stemCategoryId);
	if(stemCategory == "Category") {
		stemCategory = "";
	}
    var selectedStemCategoryIndex = stemCategory.selectedIndex;
	var selectedStemCategory = stemCategory.options[selectedStemCategoryIndex].value;
	var stemStatusId = "stem_status_" + proj_id;
	var stemStatus = document.getElementById(stemStatusId);
    var selectedStemStatusIndex = stemStatus.selectedIndex;
    var selectedStemStatus = stemStatus.options[selectedStemStatusIndex].value; 
	var stem_name = document.getElementById("stem_title").value;
	var filename = document.getElementById("stem_upload");
	console.log("Save clicked");
	
	var processStem = function(result)
	{
        console.log("Saved stem " + stem_name + " to "  + result);
		var stem_table_body = document.getElementById(STEM_TABLE_ID + proj_id).getElementsByTagName('tbody')[0];
		stem_table_body.deleteRow(0);
        refreshProjects();
	}
	
	var url = "api/upload_stem";
	var formData = new FormData();
	formData.append("username", username);
	formData.append("category", selectedStemCategory);
	formData.append("stem_status", selectedStemStatus);
	formData.append("stem_name", stem_name);
    formData.append("proj_id", proj_id);
	formData.append("filename", filename.files[0]);
    
    postProjectRequest(url, formData, processStem);
}

function postStemRequest(url, data, callback){
   $.ajax({
       type: "POST",
       url: url,
       data: data,
       dataType: 'json',
       processData: false, // important
       contentType: false, // important
       success : function (result){
           callback(result);
       },
       error : function(result){
           failCallback(result);
       }
   });
}