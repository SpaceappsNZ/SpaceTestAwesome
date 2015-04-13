module.exports = {
	//datetime methods
	validate_date: function  (date) {
						var n = date.search("/");
						var m = date.search("-");
						if (n == 2 || m == 2){
							return true;
						} else {
							return false;
						}
	},

	//takes a date of format dd/mm/yyyy and returns a date of format
	//yyyy-mm-dd
	format_date: function (date) {
					var date_list = date.split("/");
					var new_date = date_list[2] + "-" + date_list[1] + "-" + date_list[0];
					return new_date;
	},

	change_date: function (date) {
					var date_list = date.split("-");
					date_list[2] = parseInt(date_list[2]) + 1;

					if(parseInt(date_list[0])>=1995&&parseInt(date_list[1])>=6&&parseInt(date_list[2])>=16){
						if (date_list[2] > 28){
								date_list[2] = 1;
						}
					}else{
						date_list[0] = parseInt(1996 + Math.random() * (2014 - 1995));
						date_list[1] = parseInt(1 + Math.random() * (12 - 1));
						date_list[2] = parseInt(1 + Math.random() * (28 - 1));
					}

					return_date = date_list[0]+'-'+date_list[1]+'-'+date_list[2];
					return return_date;
	}
}
