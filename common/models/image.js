module.exports = function(Image) {


	Image.afterRemote('**', function(ctx, unused, next) {
		var fs = require('fs');
		var pathBase = __dirname + '/../../server/storage/images/';

		if(!ctx.args.id){
			ctx.result = {'error': 'file id is required'};
	  		next();
		}

		var id = ctx.args.id;

		Image.findById(id, function(err,ret){
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

			 	ctx.res.writeHead(200, {'Content-Type': 'image/'+extension});
			 	ctx.res.end(data);

			  }else{
			  	ctx.result = {'error': 'File can not be load, because is not found in directory'};
			  	next();
			  }

			});
		}

	});

};
