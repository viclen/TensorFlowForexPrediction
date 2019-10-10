let startDate = '2019-05-01';
let endDate = '2019-10-08';
let apiKey = 'e196684ad9816e33b139';
let base = 'EUR';
let symbols = 'CAD,GBP,AUD';

let url = `https://api.exchangeratesapi.io/history?start_at=${startDate}&end_at=${endDate}&symbols=${symbols}`;

var precision = 6;

if (!localStorage.getItem("data")) {
    fetch(url)
        .then(r => r.json())
        .then(data => {
            for(var rate in data.rates){
                console.log(rate.CAD)
            }
            localStorage.setItem("data", JSON.stringify(data));
        });
}else{
    var data = JSON.parse(localStorage.getItem("data"));
    var i = 0;
    var lastvalues = [];
    var CADarray = [];

    for(var rate in data.rates){
        if(i >= 4){
            lastvalues.splice(1);
        }
        var volume = 0;
        if(i > 1){
            volume = lastvalues[lastvalues.length-1] - data.rates[rate].CAD;
        }
        lastvalues.push(data.rates[rate].CAD);
        var sma = 0;
        lastvalues.forEach((v) => {
            sma += v;
        });
        sma = sma / lastvalues.length;
        data.rates[rate].smaCAD5 = Math.round(sma * (10 ** precision)) / (10 ** precision);
        data.rates[rate].volumeCAD = Math.round(volume * (10 ** precision)) / (10 ** precision);
        i++;

        CADarray.push({
            date: new Date(rate + "T00:00:00.000"),
            value: data.rates[rate].cad,
            sma: data.rates[rate].smaCAD5,
            volume: data.rates[rate].volumeCAD
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

    data.CADarray = CADarray;

    localStorage.setItem("data", JSON.stringify(data));
}