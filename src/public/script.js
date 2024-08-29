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

var layout = document.getElementsByClassName('layout')[0];

document.getElementById('btnBuscar').addEventListener('click', function () {
    layout.innerHTML = '';
    
    $.ajax({
        url: '/listcars',
        type: 'GET',
        contentType: 'application/json',
        data: JSON.parse(`{ "Categ":"${categ.value}", "fecha1":"${pickup.valueAsDate.getTime()}", "fecha2":"${dropoff.valueAsDate.getTime()}" }`),
        success: function(data) {
            
            const cards = document.createDocumentFragment();
            
            for (let i = 0; i < data[0].length; i++) {
                const card = document.createElement('div');
                card.classList.add('card', 'text-center', 'mt-3');

                var cardContent = 
                `<img src="logos/${data[0][i].idProveedor}.png" class="logo">
                <img src="Carros/${data[0][i].idAuto}.jpg" class="card-img-top" alt="Auto">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">${data[0][i].marca} ${data[0][i].modelo}</li>
                    <li class="list-group-item">${data[0][i].categoria}</li>
                    <li class="list-group-item">${data[0][i].transmision}</li>
                    <li class="list-group-item d-flex justify-content-evenly fs-4">
                        <div class="row">
                            <span id="costPerDay" class="col"><b>$${data[0][i].costo}</b>/ día</span>
                            <span id="totalCost" class="col"><b>$${data[1]*data[0][i].costo + 42}</b></span>
                        </div>
                    </li>
                </ul>
                <div class="card-body">
                    <button type="submit" formaction="/form/${data[0][i].idAuto}" form="formside" class="btn btn-outline-danger">Seleccionar</button>
                </div>`;

                card.innerHTML = cardContent;
                cards.appendChild(card);
            }
            layout.appendChild(cards);
        }
    
    });
});

var clean = document.getElementsByClassName('temp');

document.querySelector('header').removeAttribute('hidden');
document.querySelector('body > .cont').removeAttribute('hidden');
document.querySelector('footer').removeAttribute('hidden');

for (let i = 0; i < clean.length; i++) {
    clean[i].remove();
}