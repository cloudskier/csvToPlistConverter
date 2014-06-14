//Check File API support
function parse() {
	if (window.File && window.FileList && window.FileReader) {
		var filesInput = document.getElementById("files");
		filesInput.addEventListener("change", function(event) {
		var files = event.target.files;
		var output = document.getElementById("result");
		var file = files[0];
		if (!file.type.match('plain')) {
			var picReader = new FileReader();
			picReader.addEventListener("load", function(event) {
							var textFile = event.target;
							
							//contentOfFile contains the whole uploaded CSV document as stringvalue
							var contentOfFile = textFile.result;
							
							var textFile = null,
							makeTextFile = function(text) {	
								
							var data = new Blob([text], {type: 'text/plain'});
							
							// If we are replacing a previously generated file we need to manually revoke the object URL to avoid memory leaks.
							if (textFile !== null) {
								window.URL.revokeObjectURL(textFile);
							}
							textFile = window.URL.createObjectURL(data);
							return textFile;
						}
						
						var create = document.getElementById('create');
						create.addEventListener('click', function () {


						//---------------------------------------------------------------------
						//insert correction for not allowed characters in plist-files here:
						contentOfFile = contentOfFile.replace(/&/g, "und");
						//---------------------------------------------------------------------	
						
						
						var row = contentOfFile.split("\r");
						var innerContent = "";
						
						var conversionType = document.getElementById("conversionType");
						var selectedOption = conversionType.selectedIndex;
						var csvHasCaptions = document.getElementById("csvHasCaptions");
						var hasCaptions = csvHasCaptions.selectedIndex;
													
						/*possible values for selectedOption:
							0 --> dictionary
							1 --> array
						*/

						switch (selectedOption) {
							case 0: //dictionary
								if ( !hasCaptions ) {
									alert("dictionary has to contain captions for assigning keys! \n converted with assuming keys exist in CSV");
								}
								var allCaptionsAsString = row[0];
								var numberOfRowsIncludingCaptions = row.length;
								var column = allCaptionsAsString.split(";");
								var numberOfColumns = column.length;
								
								for (var i = 1; i < numberOfRowsIncludingCaptions; i++) {
									
									//creating dictionaries rows out of CSV-file
									var currentRow = row[i];
									var informationArray = currentRow.split(";");
									
									//creating key in dictionary for dictionary
									innerContent += "\t<key>" + informationArray[0] + "</key>\n" +
														"\t<dict>\n";
									//filling dictionary with key and value pairs
									for (var n = 1; n < numberOfColumns; n++) {
										innerContent +=	"\t\t<key>" + column[n] + "</key>\n" +
															"\t\t<string>" + informationArray[n] + "</string>\n";
									}
									innerContent += "\t</dict>\n";
								}
								break;
							case 1: //array
								var startIndex = hasCaptions ? 1 : 0; 
							
								var numberOfRowsIncludingCaptions = row.length;
								for (var i = startIndex; i < numberOfRowsIncludingCaptions; i++) {
										//creating array rows out of CSV-file
										var currentRow = row[i];
										var informationArray = currentRow.split(";");
										var numberOfColumns = informationArray.length;
										
										innerContent += "\t<key>" + informationArray[0] + "</key>\n" +
														"\t<array>\n";
														
										//filling array with values
										for (var n = 1; n < numberOfColumns; n++) {
											innerContent += "\t\t<string>" + informationArray[n] + "</string>\n";
										}
										innerContent += "\t</array>\n";
								}
								break;
						}
						
						
						//---------------------------------------------------------------------
						//insert header of plist-file here:
						var header =	"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
										"<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n" +
										"<plist version=\"1.0\">\n" +
										"<dict>\n";			
						//---------------------------------------------------------------------
							
								
						//---------------------------------------------------------------------
						//insert footer of plist-file here:
						var footer = 	"</dict>\n" +
										"</plist>";			
						//---------------------------------------------------------------------	
							
											
						var content = header + innerContent + footer;
							
						var link = document.getElementById('downloadlink');
						link.href = makeTextFile(content);
						link.style.display = 'block';
					}, false);
				});
					picReader.readAsText(file);
		}
			
								
		});
	}
	else {
		console.log("Your browser does not support File API");
	}
}
parse()