/*
* Modulo para redimencionar as imagens
* https://www.npmjs.com/package/image-resize-stream#createstream-width-height-options
*/

module.exports = function(Container) {
	var fs = require('fs');
	var pathBase = __dirname + '/../../server/storage/';
	// Tipos de extensão dos arquivos, adicionar sempre em uppercase
	var fileTypes = {
		images: ['JPG', 'JPEG', 'PNG', 'GIF'],
		documents: ['JPG', 'JPEG', 'PNG', 'GIF', 'DOC', 'DOCX', 'ODT', 'PDF', 'XLS']
	}

	Container.afterRemote('**', function (ctx, user, next) {

		if(ctx.methodString == 'container.upload'){
			var fields = ctx.result.result.fields;
			if(!ctx.result.result.files.file && !fields.base64){
				ctx.result = {'error': 'param file is required'};
				next();
				return;
			}
			var container, fileName, fileExtension, file, ctx, date = new Date();

			if(fields.base64){
				var base64 = (fields.base64 + "").split(',');
				var mimetype = base64[0].split('/')[1].split(';')[0];
				fileExtension = mimetype;
				fileName = date.getTime();
				container = "images";
				var write = fs.writeFileSync(pathBase + "/images/" + fileName + '.' + fileExtension, base64[1], 'base64');
			}else{
				file = ctx.result.result.files.file[0];
				container = file.container;
				fileName = file.name.split('.')[0];
				fileExtension = file.name.split('.')[1];
			}

			//Verifica se o arquivo está no formatos disponíveis
			if(fileTypes[container].indexOf(fileExtension.toUpperCase()) == -1){
				ctx.result = {'error': 'Invalid format, formats available for the type `' + container + '` (' + fileTypes[container].join() + ')'};
				next(); return;
			}

			//Le o arquivo e manda inserir
			var teste = pathBase+container+'/'+fileName+'.'+fileExtension;

			fs.readFile(teste, function (err,data) {
				if(err){
					console.log("Deu merda aqui: ", err);
				}
				if(data){
					console.log('fileexists');
					insertFileRow(fields.description);
				}else{
					ctx.result = {'error': 'File can not be saved'};
					next();
				}
			});

			function renameFile(newFileName){
				var filePathOriginal = pathBase + container + '/' + fileName + '.' + fileExtension;
				var filePathNew = pathBase+container + '/' + newFileName + '.' + fileExtension;

				fs.rename(filePathOriginal, filePathNew, function (err) {
					if (err){
						console.log("Deu merda aqui: ", err);
						ctx.result = {'error': 'File can not be renamed'};
							next();
					}
					console.log('renamed complete');
					ctx.result = {'result': newFileName};
					next();
				});
			}

			function insertFileRow(description){
				var entity = {};
				if(container == 'images'){
					entity = Container.app.models.image;
				}else if(container == 'documents'){
					entity = Container.app.models.document;
				}

				entity.upsert({date: date, extension: fileExtension, description: description}, function(err,ret){
					if(err){
						console.log("Deu merda aqui: ", err);
						ctx.result = {'error': err};
						next();
					}else{
						renameFile(ret.id);
					}
				});
			};

		}else{
			console.log("Aquiiiiiii");
			next();
		}

	});



};
