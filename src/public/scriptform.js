var day = new Date();
day.setDate(day.getDate() + 5);
var today5 = new Date(day.getTime());

var pickup = document.getElementById('pickup');
var dropoff = document.getElementById('dropoff');

var categ = document.getElementById('Categ');

categ.value = categ.getAttribute('value');

pickup.min = day.toISOString().split('T')[0];
pickup.value = pickup.getAttribute('value');
day.setDate(day.getDate() + 3);
dropoff.min = day.toISOString().split('T')[0];
day.setDate(day.getDate() + 27);
dropoff.max = day.toISOString().split('T')[0];
dropoff.value = dropoff.getAttribute('value');

function changeP() {
    if (pickup.valueAsDate.getTime() < today5.getTime()) pickup.valueAsDate = today5;
    
    day = pickup.valueAsDate;
    day.setDate(day.getDate() + 3);

    if (dropoff.value == '' || dropoff.valueAsDate.getTime() < pickup.valueAsDate.getTime()+259200000) {    
        dropoff.valueAsDate = day;
    }
    dropoff.min = day.toISOString().split('T')[0];
    day.setDate(day.getDate() + 27);
    dropoff.max = day.toISOString().split('T')[0];
    if (dropoff.valueAsDate.getTime() > day.getTime()) dropoff.valueAsDate = day;
}

pickup.addEventListener('change', changeP);
dropoff.addEventListener('change', function () {
    if (dropoff.valueAsDate.getTime() < (new Date(dropoff.min)).getTime()) dropoff.value = dropoff.min;
    if (dropoff.valueAsDate.getTime() > (new Date(dropoff.max)).getTime()) dropoff.value = dropoff.max;
})

function refrescar () {
    document.getElementById('btnRefrescar').setAttribute('formaction', `${window.location.pathname}`)
}

document.getElementById('btnRefrescar').addEventListener('click', refrescar);

var toastLive = document.getElementById('liveToast');
var toast = new bootstrap.Toast(liveToast);

var dataForm = {};

document.getElementById('form').addEventListener('submit', event => {
    event.preventDefault()
    event.stopPropagation()
    
    if (!form.checkValidity() || inHora1.hasAttribute('disabled') || inHora2.hasAttribute('disabled')) {
        toast.show();
        setTimeout(() => {
            toast.hide();
          }, 4000);
    }
    else {
        dataForm = Object.fromEntries((new FormData(event.target)).entries());
        dataForm['pickDate'] = document.getElementById('pickup').value;
        dataForm['dropDate'] = document.getElementById('dropoff').value;

        const params = new URLSearchParams(dataForm);
        const URLdata = window.location;
        window.location.href = `${URLdata.origin}/userdata/${URLdata.pathname.split('/')[2]}/?${params.toString()}`;
    }
});

//De la provincia al polo pickup
var pickupPolo = document.getElementById('pickupPolo');
var pickupPlace = document.getElementById('pickupPlace');

pickupPlace.value = 0;
pickupPolo.setAttribute('disabled', '');
pickupPolo.innerHTML = '<option selected></option>';

pickupPlace.addEventListener('change', () => {
    if (pickupPlace.value == '') {
        pickupPolo.setAttribute('disabled', '');
        pickupPolo.innerHTML = '';
        pickupPolo.dispatchEvent(new Event('change'));
    }
    else
    {
        pickupPolo.removeAttribute('disabled');
        $.ajax({
            url: '/get-polotur',
            type: 'GET',
            contentType: 'application/json',
            data: JSON.parse(`{ "id":"${pickupPlace.value}" }`),
            success: function(data) {
                pickupPolo.innerHTML = data;
                pickupPolo.value = 0;
                pickupPolo.dispatchEvent(new Event('change'));
            }
        });
    }
    
    updatePrices();
});

//De la provincia al polo dropoff
var dropoffPolo = document.getElementById('dropoffPolo');
var dropoffPlace = document.getElementById('dropoffPlace');

dropoffPlace.value = 0;
dropoffPolo.setAttribute('disabled', '');
dropoffPolo.innerHTML = '<option selected></option>';

dropoffPlace.addEventListener('change', () => {
    if (dropoffPlace.value == '') {
        dropoffPolo.setAttribute('disabled', '');
        dropoffPolo.innerHTML = '';
        dropoffPolo.dispatchEvent(new Event('change'));
    }
    else
    {
        dropoffPolo.removeAttribute('disabled');
        $.ajax({
            url: '/get-polotur',
            type: 'GET',
            contentType: 'application/json',
            data: JSON.parse(`{ "id":"${dropoffPlace.value}" }`),
            success: function(data) {
                dropoffPolo.innerHTML = data;
                dropoffPolo.value = 0;
                dropoffPolo.dispatchEvent(new Event('change'));
            }
        });
    }
    updatePrices();
});

//Del polo a la oficina pickup
var pickupOficina = document.getElementById('pickupOficina');

pickupOficina.setAttribute('disabled', '');
pickupOficina.innerHTML = '<option selected></option>';

var pickupOficinaData = {};

pickupPolo.addEventListener('change', () => {
    if (pickupPolo.value == '') {
        pickupOficina.setAttribute('disabled', '');
        pickupOficina.innerHTML = '';
        pickupOficina.dispatchEvent(new Event('change'));
    }
    else
    {
        pickupOficina.removeAttribute('disabled');
        $.ajax({
            url: '/get-Oficina',
            type: 'GET',
            contentType: 'application/json',
            data: JSON.parse(`{ "id":"${pickupPolo.value}" }`),
            success: function(data) {
                var s = '';
                data.forEach(element => {
                    s += `<option value="${element.id}">${element.nombre}</option>`;
                    pickupOficinaData[element.id] = {apuerto:element.aereopuerto, hora_apertura:element.hora_apertura, hora_cierre:element.hora_cierre};
                });
                pickupOficina.innerHTML = s;
                pickupOficina.value = 0;
                pickupOficina.dispatchEvent(new Event('change'));
            }
        });
    }
});

//Del polo a la oficina dropoff

var dropoffOficina = document.getElementById('dropoffOficina');

dropoffOficina.setAttribute('disabled', '');
dropoffOficina.innerHTML = '<option selected></option>';

var dropoffOficinaData = {};

dropoffPolo.addEventListener('change', () => {
    if (dropoffPolo.value == '') {
        dropoffOficina.setAttribute('disabled', '');
        dropoffOficina.innerHTML = '';
        dropoffOficina.dispatchEvent(new Event('change'));
    }
    else
    {
        dropoffOficina.removeAttribute('disabled');
        $.ajax({
            url: '/get-Oficina',
            type: 'GET',
            contentType: 'application/json',
            data: JSON.parse(`{ "id":"${dropoffPolo.value}" }`),
            success: function(data) {
                var s = '';
                data.forEach(element => {
                    s += `<option value="${element.id}">${element.nombre}</option>`;
                    dropoffOficinaData[element.id] = {apuerto:element.aereopuerto, hora_apertura:element.hora_apertura, hora_cierre:element.hora_cierre};
                });
                dropoffOficina.innerHTML = s;
                dropoffOficina.value = 0;
                dropoffOficina.dispatchEvent(new Event('change'));
            }
        });
    }
});

//De la oficina a la hora pickup
var btnHora1 = document.getElementById('btnHoraEntrega1');
var inHora1 = document.getElementById('timepkr1');

btnHora1.setAttribute('disabled', '');
inHora1.setAttribute('disabled', '');
inHora1.value = '';

pickupOficina.addEventListener('change', () => {
    if (pickupOficina.value == '') {
        btnHora1.setAttribute('disabled', '');
        inHora1.setAttribute('disabled', '');
        inHora1.value = '';
    }
    else
    {
        btnHora1.removeAttribute('disabled');
        inHora1.removeAttribute('disabled');
        minutosMin = pickupOficinaData[pickupOficina.value].hora_apertura;
        minutosMax = pickupOficinaData[pickupOficina.value].hora_cierre;
        updatetime(720);
    }
    updatePrices();
})

//De la oficina a la hora dropoff

var btnHora2 = document.getElementById('btnHoraEntrega2');
var inHora2 = document.getElementById('timepkr2');

btnHora2.setAttribute('disabled', '');
inHora2.setAttribute('disabled', '');
inHora2.value = '';

dropoffOficina.addEventListener('change', () => {
    if (dropoffOficina.value == '') {
        btnHora2.setAttribute('disabled', '');
        inHora2.setAttribute('disabled', '');
        inHora2.value = '';
    }
    else
    {
        btnHora2.removeAttribute('disabled');
        inHora2.removeAttribute('disabled');
        minutosMin2 = dropoffOficinaData[dropoffOficina.value].hora_apertura;
        minutosMax2 = dropoffOficinaData[dropoffOficina.value].hora_cierre;
        updatetime2(720);
    }
    updatePrices();
})

//Actualizaciones de precios

function actualizarInfo(AoR, id, contenido='') {
    var infoCost = document.getElementById('infoCost');
    var elemento = document.getElementById(id);

    if (AoR){
        if (!elemento) {
            var nuevoElemento = document.createElement('span');
            nuevoElemento.id = id;
            nuevoElemento.classList.add('fw-bold', 'd-block');
            nuevoElemento.innerHTML = contenido;
            infoCost.appendChild(nuevoElemento);
        }
    }
    else {
        if (elemento) {
            infoCost.removeChild(elemento);
        }
    }
}

function updatePrices () 
{
    if ((pickupPlace.value != '' && dropoffPlace.value != '') && pickupPlace.value != dropoffPlace.value){
        supleDrop = 20;
        actualizarInfo(1, 'supleDrop', 'Suplemento de devolución: $20');
    }
    else {
        supleDrop = 0;
        actualizarInfo(0, 'supleDrop');
    }
    if ((pickupOficina.value != '' && dropoffOficina.value != '') && 
    ((pickupPlace.value == 2 || pickupPlace.value == 3 || pickupPlace.value == 4) && dropoffOficinaData[dropoffOficina.value].apuerto == 'S'))
    {
        supleAereo = 25;
        actualizarInfo(1, 'supleAereo', 'Impuesto de aereopuerto: $25');
    }
    else {
        supleAereo = 0;
        actualizarInfo(0, 'supleAereo');
    }
    if (!(btnHora1.hasAttribute('disabled') || btnHora2.hasAttribute('disabled')) && minutos2 > minutos)
        supleHora = 1;
    else 
        supleHora = 0;
    
    var costoTotal = document.getElementsByClassName('costoTotal');
    document.getElementById('costoTotalDs').innerHTML = `Renta: $${selCarCosto} x ${diasReservados+supleHora} días = $${(diasReservados+supleHora)*selCarCosto}`;
    for (const i in costoTotal) {
        costoTotal[i].innerHTML = `$${(diasReservados+supleHora)*selCarCosto+42+supleDrop+supleAereo}`;
    }
}

// Clean ------------------------------------------------------------------------------------------------------
var clean = document.getElementsByClassName('temp');

document.querySelector('header').removeAttribute('hidden');
document.querySelector('body > .cont').removeAttribute('hidden');
document.querySelector('footer').removeAttribute('hidden');

for (let i = 0; i < clean.length; i++) {
    clean[i].remove();
}