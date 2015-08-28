module.exports = function(Image) {


	Image.afterRemote('**', function(ctx, unused, next) {
		var fs = require('fs');
		var pathBase = __dirname + '/../../server/storage/images/';

		// console.log('entrouuuu');
		// console.log(ctx.args.id);
		if(!ctx.args.id){
			ctx.result = {'error': 'file id is required'};
	  		next();
		}

		var id = ctx.args.id;

		Image.findById(id, function(err,ret){
			// console.log('ret');
			// console.log(ret);
			if( (err) || (!ret) ){
				ctx.result = {'error': 'File not found for this id'};
	  			next();
			}else{
				readFile(ret.id,ret.extension);
			}
		});



		var readFile = function(id, extension){
			console.log("ID ____>", id);
			fs.readFile(pathBase+id+'.'+extension, function (err,data) {
			  if(data){


			 	ctx.res.writeHead(200, {'Content-Type': 'text/html'});
			 	ctx.res.write('<html><body><img src="data:image/jpeg;base64,')
			 	ctx.res.write(new Buffer(data).toString('base64'));
			 	ctx.res.end('"/></body></html>');


			  }else{
			  	ctx.result = {'error': 'File can not be load, because is not found in directory'};
			  	next();
			  }

			});
		}

	});

};
