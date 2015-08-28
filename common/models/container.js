module.exports = function(Container) {
	var fs = require('fs');


	Container.afterRemote('**', function (ctx, user, next) {

		if(ctx.methodString == 'container.upload'){

			var fields = ctx.result.result.fields;

			var pathBase = __dirname + '/../../server/storage/';
			if(!ctx.result.result.files.file){
				ctx.result = {'error': 'param file is required'};
				next();
			}
			var file = ctx.result.result.files.file[0];

			var container = file.container;
			var fileName = file.name.split('.')[0];
			var fileExtension = file.name.split('.')[1];
			var date = new Date();

			if(container == 'images'){
				if(
					fileExtension != 'jpg' &&
					fileExtension != 'JPG' &&
					fileExtension != 'jpeg' &&
					fileExtension != 'JPEG' &&
					fileExtension != 'png' &&
					fileExtension != 'PNG' &&
					fileExtension != 'gif'
				){
					ctx.result = {'error': 'To container  `images` file must have extensions jpg, png, or gif'};
			  		next();
				}
			}else if(container == 'documents'){
				if(
					fileExtension != 'jpg' &&
					fileExtension != 'JPG' &&
					fileExtension != 'jpeg' &&
					fileExtension != 'JPEG' &&
					fileExtension != 'png' &&
					fileExtension != 'PNG' &&
					fileExtension != 'gif' &&
					fileExtension != 'doc' &&
					fileExtension != 'docx' &&
					fileExtension != 'odt' &&
					fileExtension != 'pdf' &&
					fileExtension != 'xls'
				){
					ctx.result = {'error': 'To container  `documents` file must have extensions (jpg, png, gif, doc, docx, odt, pdf, xls)'};
			  		next();
				}
			}else{
				ctx.result = {'error': 'Container not permitted'};
		  		next();
			}

			fs.readFile(pathBase+container+'/'+fileName+'.'+fileExtension, function (err,data) {

			  if(data){
			  	insertFileRow(container, date, fileExtension, fields.description);
			  }else{
			  	ctx.result = {'error': 'File can not be saved'};
			  	next();
			  }

			});

			var insertFileRow = function(container, date, extension, description){
				var entity = {};
				if(container == 'images'){
					entity = Container.app.models.image;
				}else if(container == 'documents'){
					entity = Container.app.models.document;
				}

				entity.upsert({date: date, extension: extension, description: description}, function(err,ret){
					if(err){
						ctx.result = {'error': err};
						next();
					}else{
						renameFile(ret.id);
					}
				});
			};


			var renameFile = function(newFileName){
				fs.rename(pathBase+container+'/'+fileName+'.'+fileExtension, pathBase+container+'/'+newFileName+'.'+fileExtension, function (err) {
					if (err){
						ctx.result = {'error': 'File can not be renamed'};
			  			next();
					}
					ctx.result = {'result': newFileName};
					next();
				});
			}




		}else{
			next();
		}
	});




};
