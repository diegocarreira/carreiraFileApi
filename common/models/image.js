module.exports = function(Image) {

	Image.afterRemote('**', function(ctx, unused, next) {
		var fs = require('fs');
		var pathBase = __dirname + '/../../server/storage/cache/';
		var pathOrigin = __dirname + '/../../server/storage/images/';

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
			var props = ctx.req.query;
			console.log("Props:", props);
			if(Object.keys(props).length > 0){
				var img = pathBase + id + '.' + props.type + '.' + props.size +  '.' + extension;
				var Config = require('../../img-config.js');
				var config = new Config();
				if(!config[props.type] || !config[props.type][props.size]){
					errorConfigNotFound(props);
					return false;
				}
				var width = config[props.type][props.size].width;
				var height = config[props.type][props.size].height;
			}else{
				var img = pathBase + id + '.' + extension;
			}
			console.log("IMG: ", img);
			fs.readFile(img, function (err,data) {
			  if(data){
			 		ctx.res.writeHead(200, {'Content-Type': 'image/'+extension});
			 		ctx.res.end(data);
			  }else{
					var original = pathOrigin + id + '.' + extension;
					fs.readFile(original, function(err, data){
						if(data){
  						var lwip = require('lwip');

							if(Object.keys(props).length > 0){
								console.log("aquiiiiiiii");

								lwip.open(original, function(err, image){
								  image.batch()
								    .resize(width, height)
								    .writeFile(img, function(err){
											readFile(id, extension)
								    });
								});
							}else{
								lwip.open(original, function(err, image){
								  image.writeFile(img, function(err){
										readFile(id, extension)
							    });
								});
							}
						}else{
							console.log(err);
							errorFileNotFound(id);
						}
					});
				}
			});
		}
		function errorFileNotFound(fileName){
			ctx.result = {'error': 'File ' + fileName + ' can not be load, because is not found in directory'};
			next();
		}
		function errorConfigNotFound(props){
			ctx.result = {'error': 'Config ' + JSON.stringify(props) + ' not found'};
			next();
		}
	});

};
