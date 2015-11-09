module.exports = function(Document) {
	// var fs = require('fs');
	// var pathBase = './server/storage/documents/';

	// Document.afterRemote('**', function(ctx, unused, next) {

		
	// 	if(!ctx.args.id){
	// 		ctx.result = {'error': 'file id is required'};
	//   		next();
	// 	}

	// 	var id = ctx.args.id;

	// 	Document.findById(id, function(err,ret){
			
	// 		if( (err) || (!ret) ){
	// 			ctx.result = {'error': 'File not found for this id'};
	//   			next();
	// 		}else{
	// 			readFile(ret.id,ret.extension);
	// 		}
	// 	}); 


	// 	var readFile = function(id, extension){
	// 		fs.readFile(pathBase+id+'.'+extension, function (err,data) {
	// 		  if(data){
		
	// 		 	ctx.res.writeHead(200, {'Content-Type': 'text/html'});
	// 		 	ctx.res.write('<html><body><img src="data:image/jpeg;base64,')
	// 		 	ctx.res.write(new Buffer(data).toString('base64'));
	// 		 	ctx.res.end('"/></body></html>');

	// 		  }else{
	// 		  	ctx.result = {'error': 'File can not be load, because is not found in directory'};
	// 		  	next();
	// 		  }

	// 		});
	// 	}

		

	// });

};
