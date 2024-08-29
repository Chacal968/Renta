//Tpicker 1 ---------------------------------------------------------------------------------------------------
var tpicker = document.getElementById('tpicker1');

document.getElementById('btnHoraEntrega1').addEventListener('click', (a) => {
	a.stopPropagation();
	tpicker.classList.toggle('visually-hidden');
	tpicker2.classList.add('visually-hidden');
	showdate();
})

tpicker.addEventListener('click', (a) => {
	a.stopPropagation();
})

function showdate(){
	$('.inDatePick .pk1').show();
	$('.inDatePick .pk2').hide();
}

var minutosMin = 0;
var minutosMax = 1435;

var minutos = 720;
$('#timepkr1').val('');

function updatetime(setMinutos=minutos, meridiano=0)
{
	if(meridiano){
		if(setMinutos >= 720) setMinutos -= 720;
		else setMinutos += 720;
	}

	if(setMinutos <= minutosMax && setMinutos >= minutosMin) 
		minutos = setMinutos;
	else if (setMinutos <= minutosMax) minutos = minutosMin;
	else minutos = minutosMax;
	
	var hora = Math.floor(minutos/60);

	var strHora = ('0'+String((hora%12)+(hora==12 ? 12 : 0))).slice(-2);
	var strMinutos = ('0'+String(minutos%60)).slice(-2);
	
	$('#timepkr1').val(`${strHora}:${strMinutos} ${hora>=12 ? 'PM' : 'AM'}`);

	$('.inDatePick .hrhere').html(strHora);
	$('.inDatePick .minhere').html(strMinutos);
	$('.inDatePick .medchange').html(hora>=12 ? 'PM' : 'AM');
	updatePrices();
}

$('.inDatePick .hrup').click(function(){
	updatetime(minutos+60);
});
$('.inDatePick .hrdown').click(function(){
	updatetime(minutos-60);
});
$('.inDatePick .minup').click(function(){
	updatetime(minutos+5);
});
$('.inDatePick .mindown').click(function(){
	updatetime(minutos-5);
});
$('.inDatePick .medchange').click(function(){
	updatetime(minutos, 1);
});
$('.inDatePick .hrhere').click(function(){
	$('.inDatePick .hrtt').show();
	$('.inDatePick .pk1').hide();
	$('.inDatePick .mintt').hide();
});
$('.inDatePick .minhere').click(function(){
	$('.inDatePick .hrtt').hide();
	$('.inDatePick .pk1').hide();
	$('.inDatePick .mintt').show();
});
$('.inDatePick .hrtable td').click(function(){
	$('.inDatePick .hrtt').hide();
	$('.inDatePick .pk1').show();
	$('.inDatePick .mintt').hide();
});
$('.inDatePick .mintable td').click(function(){
	$('.inDatePick .hrtt').hide();
	$('.inDatePick .pk1').show();
	$('.inDatePick .mintt').hide();
});

//Tpicker 2 ---------------------------------------------------------------------------------------------------
var tpicker2 = document.getElementById('tpicker2');

document.getElementById('btnHoraEntrega2').addEventListener('click', (a) => {
	a.stopPropagation();
	tpicker2.classList.toggle('visually-hidden');
	tpicker.classList.add('visually-hidden');
	showdate2();
})

tpicker2.addEventListener('click', (a) => {
	a.stopPropagation();
})

document.addEventListener('click', () => {
    tpicker.classList.add('visually-hidden');
	tpicker2.classList.add('visually-hidden');
})

function showdate2(){
	$('.inDateDrop .pk1').show();
	$('.inDateDrop .pk2').hide();
}

var minutosMin2 = 0;
var minutosMax2 = 1435;

var minutos2 = 720;
$('#timepkr2').val('');

function updatetime2(setMinutos=minutos2, meridiano=0)
{
	if(meridiano){
		if(setMinutos >= 720) setMinutos -= 720;
		else setMinutos += 720;
	}

	if(setMinutos <= minutosMax && setMinutos >= minutosMin) 
		minutos2 = setMinutos;
	else if (setMinutos <= minutosMax) minutos2 = minutosMin;
	else minutos2 = minutosMax;
	
	var hora = Math.floor(minutos2/60);

	var strHora = ('0'+String((hora%12)+(hora==12 ? 12 : 0))).slice(-2);
	var strMinutos = ('0'+String(minutos2%60)).slice(-2);
	
	$('#timepkr2').val(`${strHora}:${strMinutos} ${hora>=12 ? 'PM' : 'AM'}`);

	$('.inDateDrop .hrhere').html(strHora);
	$('.inDateDrop .minhere').html(strMinutos);
	$('.inDateDrop .medchange').html(hora>=12 ? 'PM' : 'AM');
	updatePrices();
}

$('.inDateDrop .hrup').click(function(){
	updatetime2(minutos2+60);
});
$('.inDateDrop .hrdown').click(function(){
	updatetime2(minutos2-60);
});
$('.inDateDrop .minup').click(function(){
	updatetime2(minutos2+5);
});
$('.inDateDrop .mindown').click(function(){
	updatetime2(minutos2-5);
});
$('.inDateDrop .medchange').click(function(){
	updatetime2(minutos2, 1);
});
$('.inDateDrop .hrhere').click(function(){
	$('.inDateDrop .hrtt').show();
	$('.inDateDrop .pk1').hide();
	$('.inDateDrop .mintt').hide();
});
$('.inDateDrop .minhere').click(function(){
	$('.inDateDrop .hrtt').hide();
	$('.inDateDrop .pk1').hide();
	$('.inDateDrop .mintt').show();
});
$('.inDateDrop .hrtable td').click(function(){
	$('.inDateDrop .hrtt').hide();
	$('.inDateDrop .pk1').show();
	$('.inDateDrop .mintt').hide();
});
$('.inDateDrop .mintable td').click(function(){
	$('.inDateDrop .hrtt').hide();
	$('.inDateDrop .pk1').show();
	$('.inDateDrop .mintt').hide();
});