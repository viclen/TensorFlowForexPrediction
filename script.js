let startDate = '2017-10-08';
let endDate = '2019-10-09';
let apiKey = 'e196684ad9816e33b139';
let base = 'EUR';
let symbols = 'CAD,GBP,AUD';

let url = "converter.php";//`https://api.exchangeratesapi.io/history?start_at=${startDate}&end_at=${endDate}&symbols=${symbols}`;

var precision = 10;

var data;

if (!localStorage.getItem("data")) {
    fetch(url)
        .then(r => r.json())
        .then(data => {
            // for(var rate in data.rates){
            //     console.log(data.rates[rate].CAD);
            // }
            localStorage.setItem("data", JSON.stringify(data));
        });
}else{
    data = JSON.parse(localStorage.getItem("data"));
    var i = 0;
    var lastvalues = [];
    var CADarray = [];

    for(var rate in data.rates){
        CADarray.push({
            date: new Date(rate),
            value: data.rates[rate].CAD
        });
    }

    CADarray.sort((a, b) => {
        if(a.date > b.date){
            return 1;
        }else if(a.date < b.date){
            return -1;
        }else{
            return 0;
        }
    });

    for(var i=0; i<CADarray.length; i++){
        var rate = CADarray[i];
        if(i >= 4){
            lastvalues.splice(1);
        }
        var volume = 0;
        if(i > 0){
            volume = lastvalues[lastvalues.length-1] - rate.value;
        }
        lastvalues.push(rate.value);
        var sma = 0;
        lastvalues.forEach((v) => {
            sma += v;
        });
        sma = sma / lastvalues.length;

        sma = Math.round(sma * (10 ** precision)) / (10 ** precision);
        volume = Math.round(volume * (10 ** precision)) / (10 ** precision);
        volume = Math.sqrt(volume ** 2);

        CADarray[i] = {
            date: rate.date,
            value: rate.value,
            sma,
            volume
        };
    }

    data.CADarray = CADarray;

    localStorage.setItem("data", JSON.stringify(data));
}