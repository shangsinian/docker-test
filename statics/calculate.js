window.onload = function (){
	setTimeout(logger,1000)
	return logger
}

function logger(){
	var logger = new window.Tracker('cn-qingdao.log.aliyuncs.com','shang-test','shang-log-store');
	var performance = getPerformanceTiming()
	console.log(performance)
	for (var key in performance){
		logger.push(key, performance[key]);
	}
	logger.logger(); 
}